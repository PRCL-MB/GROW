# GROW-Relay – Einrichtung (ca. 5 Minuten)

Damit Coach und Teilnehmer:in sich zuverlässig verbinden (auch über Mobilfunk und
Firmen-WLAN), braucht die App einen kleinen eigenen Vermittlungs-Server. Das ist
die Datei [`relay.ts`](relay.ts) – ein paar Zeilen, die Nachrichten nur durchreichen
und **nichts speichern**.

Am einfachsten läuft er kostenlos auf **Deno Deploy** (immer an, keine Kaltstarts,
WebSocket-fähig).

## Schritt für Schritt

1. Geh auf **https://deno.com/deploy** und melde dich an (am einfachsten mit einem
   GitHub-Konto). Kostenlos.
2. Klicke auf **New Playground** (bzw. „Playground" / „New Project" → Playground).
3. **Lösche** den Beispielcode im Editor und füge stattdessen den **kompletten
   Inhalt von [`relay.ts`](relay.ts)** ein.
4. Klicke **Save & Deploy**. Oben erscheint eine URL wie
   `https://grow-relay-xxxx.deno.dev`.
5. **Test:** Öffne diese URL im Browser. Es sollte „GROW-Relay läuft ✔" erscheinen.
6. Schick mir (oder trag selbst ein) diese URL – als **`wss://`** statt `https://`,
   also z. B. `wss://grow-relay-xxxx.deno.dev`.

## Wo die URL in die App kommt

In `index.html` ganz im Sync-Bereich steht:

```js
const RELAY_URL = '';   // z. B. 'wss://grow-relay-xxxx.deno.dev'
```

Dort die `wss://`-URL eintragen, committen, deployen – fertig. Danach verbinden sich
Coach und Teilnehmer:in über diesen Relay.

## Gut zu wissen

- **Speichert nichts:** Der Relay hält die Nachrichten nur kurz im Arbeitsspeicher,
  um sie weiterzureichen. Ist niemand mehr im Raum, ist alles weg.
- **Getrennte Räume:** Jedes Coaching hat seine eigene `session`-ID; der Relay
  vermischt verschiedene Coachings nicht.
- **Transportverschlüsselung:** Die Verbindung läuft über `wss://` (TLS). Hinweis:
  Der Relay-Server selbst sieht die Inhalte technisch im Klartext (er läuft aber auf
  eurer eigenen Deno-Deploy-Instanz und speichert nichts). Wer echte
  Ende-zu-Ende-Verschlüsselung möchte (auch der Relay soll nicht mitlesen können),
  sagt Bescheid – das lässt sich nachrüsten.
- **Kosten:** Für Coaching-Datenmengen liegt das locker im kostenlosen Kontingent
  von Deno Deploy.
