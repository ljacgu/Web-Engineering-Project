# Übersicht Math Dungeon RPG

## 1. Gesamtstruktur des Projekts

Das Projekt ist ein Browser-Spiel mit mehreren Bildschirmen. Die Datei `startscreen.html` beschreibt, welche Bereiche es gibt: Startscreen, Spielscreen, Rangliste und 10er-Übergang. Die Datei `style.css` bestimmt das Aussehen, zum Beispiel Hintergründe, Buttons, Animationen und das mobile Layout.

Die Spiellogik ist auf zwei JavaScript-Dateien verteilt:

- `script.js` steuert das Spiel im Browser. Dort befinden sich die Steuerung der DOM-Elemente, die Screen-Wechsel und die Event-Listener.
- `logicFunction.js` enthält die Rechenlogik und ausgelagerte Hilfsfunktionen.

Die Testdateien `logic.test.js` und `localstorage.test.js` prüfen wichtige Teile aus `logicFunction.js`.

## 2. Verantwortung der Dateien

| Datei | Verantwortung |
| --- | --- |
| `startscreen.html` | Legt die sichtbaren Spielbereiche an: Startscreen, normaler Spielscreen, Highscore-Screen und 10er-Übergang. Bindet `style.css`, `logicFunction.js` und `script.js` ein. |
| `style.css` | Gestaltet alle Screens, Figuren, Buttons, Rangliste, Timer, Trefferanimationen, Fallanimationen und mobile Ansicht. |
| `script.js` | Verbindet HTML und Spiellogik. Reagiert auf Klicks, startet Spiele, zeigt Aufgaben an, bewertet Antworten, steuert Timer, Animationen und Highscore-Anzeige. |
| `logicFunction.js` | Erzeugt Matheaufgaben, Antwortmöglichkeiten und verwaltet ausgelagerte Highscore-Logik. |
| `logic.test.js` | Testet Rechenfunktionen und Aufgabenerzeugung. |
| `localstorage.test.js` | Testet das Laden und Speichern der Highscore-Listen mit einem nachgebauten LocalStorage. |

## 3. Ablaufdiagramm

### Normaler Spielmodus

```text
Startscreen
  |
  | Spieler gibt Namen ein
  | Spieler wählt Figur und Level
  v
Klick auf "Spiel Starten"
  |
  v
startSelectedGame()
  |
  | wenn Level = zehner
  |   -> startTenGame()
  |
  | sonst
  v
startGame()
  |
  v
createGameState()
setupGameBasic()
resetGameDisplay()
showScreen(gameScreen)
  |
  v
showNextQuestion()
  |
  v
createQuestion()
createAnswerChoices()
startTimer()
  |
  v
Spieler klickt Antwort
  |
  v
checkAnswer()
  |
  | richtig
  |   -> answerIsCorrect()
  |
  | falsch
  |   -> answerIsWrong()
  |
  v
continueOrEndGame()
  |
  | Punkte >= 100
  |   -> endGame(true)
  |
  | Leben <= 0
  |   -> endGame(false)
  |
  | sonst
  |   -> showNextQuestion()
```

### Timer-Ablauf im normalen Spiel

```text
showNextQuestion()
  |
  v
startTimer()
  |
  | jede Sekunde: Zeit -1
  v
Zeit erreicht 0
  |
  v
timeIsOut()
  |
  v
Leben -1
Feedback anzeigen
continueOrEndGame()
```

### Highscore

```text
Spiel endet
  |
  v
endGame()
  |
  v
saveHighscore()
  |
  v
loadHighscoreLists()
addHighscoreEntry()
saveHighscoreLists()
  |
  v
Ergebnis und Endbuttons werden angezeigt
  |
  v
Spieler klickt "Rangliste anzeigen"
  |
  v
Rangliste wird geöffnet
  |
  v
showHighscoreScreen()
showHighscores()
```

### 10er-Übergang

```text
Startscreen
  |
  | Level "10er-Übergang" gewählt
  v
startSelectedGame()
  |
  v
startTenGame()
  |
  v
generateTenQuestion()
  |
  v
createTenTask()
showTenQuestion()
  |
  v
Spieler gibt Antwort ein
  |
  v
checkTenAnswer()
  |
  | falsch
  |   -> Feedback, gleiche Aufgabe bleibt
  |
  | richtig
  |   -> Punkte +10 ohne Tipp oder +5 mit Tipp
  |
  v
Punkte >= 100?
  |
  | ja
  |   -> finishTenGame()
  |
  | nein
  |   -> generateTenQuestion()
```