# GROW – Grafische Begleitung für Online-Coachings

Eine schlanke Web-App zur **grafischen Unterstützung von Online-Coachings nach dem
GROW-Modell** (Goal · Reality · Options · Will). Ziel ist eine reizarme, klar
strukturierte Darstellung der einzelnen Coaching-Phasen, die nach und nach um
Coaching-Tools ergänzt wird.

## Nutzung

Es ist eine **einzelne HTML-Datei** ([`index.html`](index.html)) – keine
Installation, kein Build, keine externen Abhängigkeiten. Einfach im Browser öffnen
(bzw. über Codeberg Pages aufrufen).

**Es werden keine Daten gespeichert.** Alles lebt nur im geöffneten Browser-Tab.

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

- **WebRTC (Peer-to-Peer):** Die Coaching-Inhalte gehen **direkt** von Browser zu
  Browser und sind dabei **Ende-zu-Ende-verschlüsselt** – sie laufen über **keinen
  fremden Server**.
- Für den reinen Verbindungsaufbau wird der kostenlose, **inhaltsblinde**
  PeerJS-Vermittler genutzt (sieht nur „wer verbindet sich", nie Inhalte).
- Der **Coach ist die Quelle der Wahrheit**: Änderungen der Teilnehmer:in gehen an
  den Coach, der sie übernimmt und an alle verteilt.
- Ohne Internet/CDN läuft die App **weiter solo** (dann keine Live-Verbindung).
- Unten zeigt ein **Statuspunkt** den Verbindungszustand.

**Bekannte Grenze:** In sehr strengen Netzen (manche Firmen-/Mobilfunknetze) kann
eine direkte P2P-Verbindung scheitern, weil (bewusst) kein TURN-Relay betrieben
wird. Dann hilft nur ein anderes Netz oder – später – ein eigener kleiner Relay.

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
3. State        – zentrales Zustandsobjekt (nichts wird gespeichert)
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
Offline-Fallback) und **WebRTC via PeerJS** (geräteübergreifend). Die restliche App
spricht nur `Sync.send(state)`, `Sync.onReceive(cb)` und `Sync.onStatus(cb)` an.

Wer den Vermittler tauschen will (z. B. eigener PeerServer statt PeerJS-Public oder
ein Relay mit TURN für strenge Netze), muss nur dieses Modul anpassen.

## Lizenz / Zusammenarbeit

Internes Projekt. Beiträge per Branch + Pull Request willkommen.
