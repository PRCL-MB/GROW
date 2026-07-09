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
| `index.html?role=coachee` | **Teilnehmer:in** – sieht nur die Inhalte und kann mitschreiben, keine Steuer-Buttons |

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

### Offene Baustelle: Coach ↔ Coachee in Echtzeit

Damit die Teilnehmer:in *auf einem anderen Gerät* live dieselbe Seite sieht, braucht
es einen Übertragungsweg. Aktuell ist im Modul `Sync` **BroadcastChannel** verbaut –
das synchronisiert nur mehrere Tabs auf **demselben Gerät** (gut zum Testen). Für die
echte Fernübertragung muss dort ein Transport (WebRTC oder ein kleiner
Websocket-Dienst) eingehängt werden. Die App spricht nur `Sync.send(state)` und
`Sync.onReceive(cb)` an – der Rest bleibt unberührt.

## Lizenz / Zusammenarbeit

Internes Projekt. Beiträge per Branch + Pull Request willkommen.
