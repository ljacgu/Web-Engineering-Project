## Aktuelle Architektur

Meine Anwendung ist aktuell ein clientseitiger Monolith. Das bedeutet, dass der größte Teil der Anwendung direkt im Browser läuft.

Die wichtigsten Bestandteile sind:

- `startscreen.html` für die Struktur der Webseite
- `style.css` für das Layout und die Gestaltung
- `script.js` für Spielablauf, Screens, DOM-Zugriffe und Events
- `logicFunction.js` für ausgelagerte Spiellogik und Highscore-Logik
- `localStorage` für die lokale Speicherung der Highscores

Es gibt aktuell keinen eigenen Server, keine zentrale Datenbank und keine zentrale Benutzerverwaltung. Jeder Browser führt das Spiel selbst aus und speichert seine Daten lokal.

## Was bei 10.000 gleichzeitigen Spieler:innen zuerst versagen würde



Das erste große Problem wäre die Speicherung und Verwaltung der Highscores.

Aktuell werden Highscores mit `localStorage` gespeichert. `localStorage` ist aber nur lokal auf einem bestimmten Gerät und in einem bestimmten Browser vorhanden. Dadurch hätte jede Person ihre eigene Highscore-Liste. Eine gemeinsame landesweite Rangliste wäre damit nicht möglich.

Außerdem wären die Daten nicht dauerhaft zuverlässig gesichert. Wenn der Browser-Cache gelöscht wird oder ein anderes Gerät benutzt wird, sind die gespeicherten Highscores nicht mehr verfügbar.

## Weitere Schwachstellen

Ein weiteres Problem sind große Bilddateien, besonders animierte GIF-Hintergründe. Diese können bei vielen Schulgeräten oder bei schwachem Schul-WLAN zu langen Ladezeiten führen. Außerdem können große GIF-Dateien den Browser kurz blockieren, weil sie geladen und gerendert werden müssen.

## Sinnvolle Architekturänderungen

- Frontend im Browser
- Backend/API für zentrale Spiellogik und Highscore-Verwaltung
- Datenbank für Highscores und Nutzerdaten
- optimierte Auslieferung von Bildern und anderen Dateien

Eine sinnvolle Auslagerung wäre ein eigener Highscore-Service. 

Der Highscore-Service wäre dafür verantwortlich:

- Highscores zentral zu speichern
- Highscores nach Level zu laden
- Einträge nach Punkten und Zeit zu sortieren
- nur die besten Plätze zu behalten
- ungültige oder manipulierte Werte abzuweisen
