// ============================================================================
// GROW – kleiner WebSocket-Relay
// ============================================================================
// Reicht Nachrichten zwischen Coach und Teilnehmer:in durch – getrennt nach
// Raum (?session=...). Speichert NICHTS: alles läuft nur durch den Arbeits-
// speicher und ist weg, sobald niemand mehr im Raum ist.
//
// Zusätzlich meldet der Relay die Teilnehmerzahl je Raum ("presence"), damit
// die App "warte auf Teilnehmer" / "verbunden" anzeigen kann.
//
// Läuft unverändert auf Deno Deploy (https://deno.com/deploy) – siehe README.md.
// Lokaler Test:  deno run --allow-net relay.ts
// ============================================================================

const rooms = new Map<string, Set<WebSocket>>();

// Teilnehmerzahl an alle im Raum melden
function announcePresence(room: Set<WebSocket>) {
  const msg = JSON.stringify({ t: "presence", count: room.size });
  for (const ws of room) {
    if (ws.readyState === WebSocket.OPEN) {
      try { ws.send(msg); } catch { /* egal */ }
    }
  }
}

Deno.serve((req: Request) => {
  const url = new URL(req.url);

  // Normale HTTP-Anfrage (kein WebSocket) -> kurze Statusseite (zum Testen im Browser)
  if ((req.headers.get("upgrade") || "").toLowerCase() !== "websocket") {
    return new Response("GROW-Relay läuft ✔", {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const session = url.searchParams.get("session");
  if (!session) return new Response("Kein session-Parameter", { status: 400 });

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    let room = rooms.get(session);
    if (!room) { room = new Set(); rooms.set(session, room); }
    room.add(socket);
    announcePresence(room);
  };

  // Jede App-Nachricht an alle ANDEREN im selben Raum weiterreichen
  socket.onmessage = (e: MessageEvent) => {
    const room = rooms.get(session);
    if (!room) return;
    for (const ws of room) {
      if (ws !== socket && ws.readyState === WebSocket.OPEN) {
        try { ws.send(e.data); } catch { /* egal */ }
      }
    }
  };

  const leave = () => {
    const room = rooms.get(session);
    if (!room) return;
    room.delete(socket);
    if (room.size === 0) rooms.delete(session);   // leerer Raum -> ganz vergessen
    else announcePresence(room);
  };
  socket.onclose = leave;
  socket.onerror = leave;

  return response;
});
