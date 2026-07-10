# Math Dungeon RPG

## Was ist Math Dungeon RPG?

Math Dungeon RPG ist ein kleines Mathe-Spiel für Kinder im Grundschulalter.

Das Spiel soll Kindern helfen, Rechenaufgaben spielerisch zu üben. Statt Aufgaben nur auf einem Arbeitsblatt zu lösen, kämpfen die Kinder mit einem Helden gegen Monster. Jede richtige Antwort bringt Punkte und schwächt das Monster.

Das Ziel ist: Rechnen üben, Punkte sammeln und das Monster besiegen.

## Spiel starten

### Voraussetzungen

Es muss nichts installiert werden. Das Spiel nutzt keine externen Frameworks.

## Erste Schritte im Spiel

Auf dem Startscreen macht das Kind zuerst drei Dinge:

1. Einen Namen eingeben
2. Einen Helden auswählen
3. Ein Level auswählen

Danach startet das Spiel mit dem Button `Spiel starten`.

Wenn kein Name eingegeben wurde, startet das Spiel nicht. Das Kind bekommt dann eine Meldung und kann den Namen nachtragen.

## Normales Mathespiel

Im normalen Mathespiel beantwortet das Kind Rechenaufgaben mit Antwortbuttons.

Es gibt drei Level:

- einfach
- mittel
- schwer

Je nach Level werden die Aufgaben schwieriger. Außerdem gibt es einen Timer. Das Kind muss also innerhalb der Zeit antworten.

Im Spiel sieht das Kind:

- den eigenen Namen
- die aktuelle Rechenaufgabe
- vier Antwortmöglichkeiten
- Punkte
- Leben
- Timer
- den eigenen Helden
- das Monster
- den Lebensbalken des Monsters

## So funktioniert eine Runde

Das Kind sieht eine Rechenaufgabe und klickt auf eine Antwort.

Bei einer richtigen Antwort:

- die Antwort wird positiv markiert
- das Kind bekommt Punkte
- das Monster verliert Lebenspunkte
- eine kurze Rückmeldung erscheint

Bei einer falschen Antwort:

- die Antwort wird negativ markiert
- das Kind verliert ein Leben
- die richtige Lösung wird angezeigt

Wenn die Zeit abläuft:

- das Kind verliert ein Leben
- das Spiel geht weiter oder endet, wenn keine Leben mehr übrig sind

## Spielende

Das normale Spiel endet, wenn:

- das Kind genug Punkte gesammelt hat
- oder keine Leben mehr übrig sind

Nach dem Spiel kann das Kind:

- zur Rangliste wechseln
- zurück zum Hauptmenü gehen
- ein neues Spiel starten

## 10er-Übergang

Der 10er-Übergang ist ein eigener Übungsmodus.

Hier übt das Kind Aufgaben, bei denen über einen Zehner gerechnet wird, zum Beispiel von 47 auf 50 und dann weiter.

In diesem Modus gibt es keine Antwortbuttons. Das Kind gibt die Lösung selbst in ein Eingabefeld ein.

Der Screen zeigt:

- den Namen des Kindes
- die Aufgabe
- ein Eingabefeld
- den Punktestand
- einen Tipp-Button
- einen Antwort-Button

## Tipp-Funktion

Wenn das Kind nicht weiterweiß, kann es den Tipp-Button benutzen.

Der Tipp erklärt, wie man über den nächsten Zehner rechnet.

Wichtig:

- richtige Antwort ohne Tipp gibt mehr Punkte
- richtige Antwort mit Tipp gibt weniger Punkte

So wird Hilfe angeboten, aber eigenständiges Rechnen wird stärker belohnt.

## Rangliste

Das Spiel besitzt eine Highscore-Seite.

Dort werden die besten Ergebnisse gespeichert und angezeigt.

Die Ranglisten sind getrennt nach:

- einfach
- mittel
- schwer

Gespeichert werden:

- Name
- Punkte
- Spielzeit

Die Speicherung erfolgt im Browser mit `localStorage`.

Das bedeutet:

- die Ergebnisse bleiben im selben Browser erhalten
- es wird kein Server benötigt
- auf einem anderen Gerät sind die Ergebnisse nicht automatisch sichtbar
- wenn Browserdaten gelöscht werden, können die Highscores verloren gehen

## Für wen ist das Spiel gedacht?

Das Spiel ist für Kinder im Grundschulalter gedacht.

Es soll besonders beim Üben von Rechenaufgaben helfen. Die Spielwelt mit Helden, Monstern, Punkten und Leben soll motivieren und den Kindern ein bekanntes Spielgefühl geben.


## Bedienung kurz erklärt

### Startscreen

Hier beginnt das Spiel.

Das Kind gibt einen Namen ein, wählt einen Helden und entscheidet sich für ein Level.

### Spielscreen

Hier werden die Matheaufgaben gelöst.

Das Kind klickt auf eine Antwort und bekommt sofort Rückmeldung.

### 10er-Übergang

Hier gibt das Kind die Lösung selbst ein.

Bei Bedarf kann ein Tipp angezeigt werden.

### Highscore-Screen

Hier sieht das Kind die Rangliste.

Über den Zurück-Button gelangt es wieder zum Hauptmenü.

## Feedback im Spiel

Das Spiel zeigt direkt, was passiert ist:

- Grün bedeutet: richtig
- Rot bedeutet: falsch
- Punkte zeigen den Fortschritt
- Leben zeigen die verbleibenden Versuche
- der Monster-Lebensbalken zeigt, wie stark das Monster noch ist

## Weitere Dokumentation

Zusätzliche technische Dokumentation befindet sich in:
- `Funktionsuebersicht.md`

