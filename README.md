# GROW – Grafische Begleitung für Online-Coachings

Eine schlanke Web-App zur **grafischen Unterstützung von Online-Coachings nach dem
GROW-Modell** (Goal · Reality · Options · Will). Ziel ist eine reizarme, klar
strukturierte Darstellung der einzelnen Coaching-Phasen, die nach und nach um
Coaching-Tools ergänzt wird.

## Nutzung

Es ist eine **einzelne HTML-Datei** ([`index.html`](index.html)) – keine
Installation, kein Build, keine externen Abhängigkeiten. Einfach im Browser öffnen
(bzw. über Codeberg Pages aufrufen).

**Es werden keine Daten auf einem Server gespeichert.** Alles lebt nur im geöffneten
Browser-Tab. Damit ein versehentliches Neuladen den Coach nicht seine Einträge kostet,
hält der **Coach** seinen Stand zusätzlich nur **lokal im eigenen Tab**
(`sessionStorage`, an die Sitzungs-ID gebunden) – das wird beim Schließen des Tabs
automatisch gelöscht. Der Coachee speichert nichts (er bekommt den Stand beim
Verbinden vom Coach).

### Ansichten (Rollen)

Über den URL-Parameter `?role=`:

| Aufruf | Ansicht |
|---|---|
| `index.html` | **Coach** – alle Bedienelemente (Phasen-Reiter, Tools, Export) |
| `index.html?role=coachee&session=…` | **Teilnehmer:in** – sieht nur die Inhalte und kann mitschreiben, keine Steuer-Buttons |

Der Coach erhält unten den fertigen **Teilnehmer-Link** (inkl. Sitzungs-ID) mit
„kopieren"-Button. Mehrere Coachings laufen dank eigener **Sitzungs-ID**
(`?session=…`) gleichzeitig, ohne sich zu vermischen.

### Live-Übertragung (Coach ↔ Coachee)

Coach und Teilnehmer:in sehen dieselbe, live aktualisierte Seite. Technik:

- **Kleiner eigener WebSocket-Relay** (Ordner [`relay/`](relay/)): Coach und
  Teilnehmer:in verbinden sich beide nach außen zum Relay und tauschen darüber ihre
  Einträge aus. **Zuverlässig in allen Netzen** – auch Mobilfunk und Firmen-WLAN –
  ohne NAT/STUN/TURN-Gefrickel.
- Die Inhalte sind **Ende-zu-Ende-verschlüsselt** (AES-GCM). Der Schlüssel steht im
  **Link-Fragment** (`#k=…`), das der Browser **nie an einen Server sendet** – der
  Relay reicht nur verschlüsselte Nachrichten durch, **speichert nichts** und kann
  die Inhalte **nicht mitlesen**.
- Der **Coach ist die Quelle der Wahrheit**: Änderungen der Teilnehmer:in gehen an
  den Coach, der sie übernimmt und an alle verteilt.
- Ist kein Relay konfiguriert oder erreichbar, läuft die App **weiter solo**
  (nur gleiches Gerät). Unten zeigt ein **Statuspunkt** den Verbindungszustand.

**Einrichtung des Relays:** siehe [`relay/README.md`](relay/README.md) (einmal
~5 Minuten, kostenlos auf Deno Deploy). Danach die `wss://`-URL in `index.html`
unter `RELAY_URL` eintragen.

**Datenschutz:** Die Inhalte sind **Ende-zu-Ende-verschlüsselt** – der Relay reicht
nur verschlüsselte Nachrichten durch und kann sie nicht mitlesen (Schlüssel im
Link-Fragment, das nie an den Server geht). Er speichert ohnehin nichts.

### Ablauf

1. **Goal** (Startseite): Thema, Coachingziel, optionales Prozessziel. Mit „Weiter"
   wird das Coachingziel dauerhaft oben angeheftet und die Phasen-Reiter erscheinen.
2. **Reality**: großes Textfeld + Tool **Skala** (Bereich 0–10 / 0–100, bis zu zwei
   farblich getrennte Regler per Klick oder Ziehen, frei benennbar).
3. **Options** / **Will**: aktuell je ein Textfeld (weitere Tools folgen).
4. **Als PDF exportieren**: über die Druckfunktion des Browsers („Als PDF speichern").

## Mitentwickeln

Der Code steckt vollständig in `index.html` und ist in klar benannte, deutsch
kommentierte Abschnitte gegliedert:

```
1. CSS          – ruhiges, reizarmes Layout
2. HTML-Gerüst  – Kopfzeile, Reiter, Phasen-Panels
3. State        – zentrales Zustandsobjekt (Coach: lokal im Tab via sessionStorage)
4. Sync         – austauschbarer Übertragungskanal Coach ↔ Coachee
5. Render       – Zustand -> Oberfläche
6. Tools        – Coaching-Tools (aktuell: Skala)
7. PDF-Export   – über die Druckfunktion des Browsers
```

Ein neues Tool ergänzt man am einfachsten, indem man es an das `state`-Objekt
anhängt und in `render()` sowie ggf. im Abschnitt „Tools" ausbaut – analog zur
`Skala`.

### Sync-Modul

Die Übertragung steckt gekapselt im Modul `Sync` (an die Sitzungs-ID gebunden) und
kombiniert zwei Wege: **BroadcastChannel** (gleiches Gerät, mehrere Tabs – auch der
Fallback) und der **WebSocket-Relay** (geräteübergreifend, Ordner [`relay/`](relay/)).
Die restliche App spricht nur `Sync.send(state)`, `Sync.onReceive(cb)` und
`Sync.onStatus(cb)` an. Die Relay-Adresse steht in der Konstante `RELAY_URL`.

## Lizenz / Zusammenarbeit

Internes Projekt. Beiträge per Branch + Pull Request willkommen.
