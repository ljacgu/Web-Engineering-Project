# Math Dungeon RPG

Kurze Beschreibung

Der Spieler gibt einen Namen ein, wählt einen Helden und entscheidet sich für ein Level. Danach werden Rechenaufgaben gelöst, um Monster zu besiegen, Punkte zu sammeln und eine Rangliste aufzubauen.

## Überblick

- Startscreen mit Namenseingabe, Heldenauswahl und Levelauswahl
- Spielscreen mit Aufgabe, Timer, Leben, Punkten und Monster-Lebensbalken
- eigener Übungsmodus für den 10er-Übergang
- Highscore-Seite mit Ranglisten für die Level

## Spielablauf

1. Der Spieler gibt einen Namen ein und wählt Held und Level.
2. Das Spiel startet und zeigt eine Matheaufgabe mit Antwortmöglichkeiten.
3. Bei einer richtigen Antwort verliert das Monster Leben und die Punkte steigen.
4. Bei einer falschen Antwort oder abgelaufener Zeit verliert der Spieler ein Leben.
5. Das Spiel endet, wenn der Spieler gewinnt oder keine Leben mehr hat.
6. Danach kann die Rangliste angezeigt oder ein neues Spiel gestartet werden.

## Aufbau der App

- `startscreen.html`: Grundstruktur der App mit Startscreen, Spielscreen, Highscore-Screen und 10er-Übergang
- `style.css`: Layout, Farben, Buttons, Hintergründe und Animationen
- `script.js`: Steuerung der Screens, Eingaben, Timer, Punkteanzeige und DOM-Aktualisierungen
- `logicFunction.js`: zentrale Logik für Aufgaben, Antwortmöglichkeiten, 10er-Übergang und Highscore-Funktionen

## Screens

**Startscreen**  
Enthält die Namenseingabe, Heldenauswahl, Levelauswahl sowie Buttons zum Starten und zur Rangliste.
Startscreen -> startGame -> createGameState -> setupGameBasic -> updateHighscoreForLevel -> resetGameDisplay -> showScreen -> showNextQuestion 
Startscreen -> 10er-Übergang -> Tenscreen
Startscreen -> showScreen -> Highscorescreen

**Spielscreen**  
Zeigt die aktuelle Aufgabe, vier Antwortmöglichkeiten, den Timer, die Leben, Punkte, Highscore und das Kampffeld mit Held und Monster.
Spielscreen -> Button click -> checkAnswer -> continueOrEndGame ->continue -> shownextQuestion -> Button click
                                                                ->end -> saveHighscore -> showGameResult -> Highscorescreen or Startscreen

**Highscore-Screen**  
Zeigt gespeicherte Ergebnisse nach Level sortiert.
Spielscreen -> Button click -> Highscorescreen -> Startscreen

**10er-Übergang**  
Ein zusätzlicher Übungsmodus mit eigener Aufgabe, Eingabefeld, Tipp-Funktion und Punkteanzeige.
startTenGame -> generateTenQuestion ->  showTenQuestion -> Antworten -> checkTenAnswer -> generateTenQuestion or finishTenGame
                                                        -> Tipps     -> Tipps remove hidden -> Antworten
## Spiellogik

Die zentrale Spiellogik liegt in `logicFunction.js`. Dort werden Aufgaben erzeugt, Antwortmöglichkeiten erstellt, 10er-Übergang-Aufgaben berechnet und Highscore-Daten vorbereitet.

`script.js` verbindet diese Logik mit der Oberfläche. Dort werden Screens gewechselt, Eingaben verarbeitet, Timer gestartet, Punkte und Leben angezeigt und Highscores im Browser gespeichert.
