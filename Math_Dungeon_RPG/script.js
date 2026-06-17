//1. Startscreen
document.addEventListener("DOMContentLoaded", () => {

    /*Konstanten, damit wichtige Werte nur an einer Stelle geändert werden müssen
    und der Code besser lesbar ist.*/
    const START_LEBEN = 3;
    const PUNKTE_PRO_RICHTIGE_ANTWORT = 10;
    const SIEG_PUNKTE = 100;
    const PAUSE_BIS_NAECHSTE_AUFGABE = 1200;
    const HIGHSCORE_KEY = "mathDungeonHighscore";

    const TIMER_LIMITS = {
        einfach:     30,
        mittel:      20,
        schwer:      15,
        extra_schwer: 10
    };

    const startScreen = document.querySelector("#startscreen");
    const spielScreen = document.querySelector("#spielscreen");
    const zehnerScreen = document.querySelector("#zehner-screen");

    const inputSpielername = document.querySelector("#spielername");
    const figurOptionen = document.querySelectorAll(".figur-option");
    const spielerFigur = document.querySelector("#spieler-figur");
    const dungeonKarten = document.querySelectorAll("#dungeon-auswahl-bereich .dungeon-karte");
    const btnStart = document.querySelector("#start-button");
    const btnZurueckAuswahl = document.querySelector("#zurueck-auswahl-button");
    
   // Bereiche für die Navigation zwischen Spielauswahl und Dungeon-Auswahl
    const spielAuswahlBereich = document.querySelector("#spielauswahl-bereich");
    const dungeonAuswahlBereich = document.querySelector("#dungeon-auswahl-bereich");

    const btnWeiter = document.querySelector("#weiter-button");
    btnZurueckAuswahl.addEventListener("click", () => {
        dungeonAuswahlBereich.classList.add("hidden");
        btnStart.classList.add("hidden");
        btnZurueckAuswahl.classList.add("hidden");

        spielAuswahlBereich.classList.remove("hidden");
        btnWeiter.classList.remove("hidden");
    });

    // Karten für die Spielauswahl
    const spielKarten = document.querySelectorAll(".spiel-karte");
    let gewaehlterDungeon = "";
    let gewaehltesPortrait = "bilder/FigurePortrait1.webp";
    // Speichert, welches Spiel im Startscreen ausgewählt wurde
    let gewaehltesSpiel = "dungeon";

    const displayHeldenname = document.querySelector("#heldenname");
    const displayPunkte = document.querySelector("#punkte");
    const displayLeben = document.querySelector("#leben");
    const displayHighscore = document.querySelector("#highscore");
    const displayModus = document.querySelector("#modusAnzeige");
    const displayAufgabe = document.querySelector("#aufgabe");
    const displayNachricht = document.querySelector("#nachricht");

    const inputAntwort = document.querySelector("#antwort-input");
    const btnCheck = document.querySelector("#check-button");
    const btnNewGame = document.querySelector("#newGame-button");

    const timerContainer = document.querySelector("#timer-container");
    const timerWert = document.querySelector("#timer-wert");
    let timerInterval = null;

    const btnZurueckStart = document.querySelector("#zurueck-start-button");

    // Elemente für das Kampfsystem
    const monsterBild = document.querySelector("#monster-bild");
    const monsterLebenBalken = document.querySelector("#monster-leben-balken");
    const damageAnzeige = document.querySelector("#damage-anzeige");
    const herzen = document.querySelectorAll(".herz");

    const displayZehnerHeldenname = document.querySelector("#zehner-heldenname");
    const displayZehnerPunkte = document.querySelector("#zehner-punkte");
    const displayZehnerAufgabe = document.querySelector("#zehner-aufgabe");
    const displayZehnerNachricht = document.querySelector("#zehner-nachricht");

    const inputZehnerAntwort = document.querySelector("#zehner-antwort");
    const btnZehnerCheck = document.querySelector("#zehner-check-button");
    const btnZehnerZurueck = document.querySelector("#zehner-zurueck-button");

    // --- SPIEL-ZUSTAND (State) ---
    let gameState = {
        heldenname: "",
        schwierigkeit: "einfach",
        punkte: 0,
        leben: START_LEBEN,
        aktuelleAntwort: 0,

        // Zusätzliche Werte für das Kampfsystem
        monsterLeben: 100
    };

    // --- 10ER-ÜBERGANG ZUSTAND ---
    let zehnerPunkte = 0;
    let zehnerAntwort = 0;

    // --- HIGHSCORE LADEN ---
    let highscore = Number(localStorage.getItem(HIGHSCORE_KEY)) || 0;
    displayHighscore.textContent = highscore;

    // Speichert die angeklickte Figur und markiert immer nur eine Auswahl.
    figurOptionen.forEach(option => {
        option.addEventListener("click", () => {
            figurOptionen.forEach(figur => {
                figur.classList.remove("ausgewaehlt");
                figur.setAttribute("aria-checked", "false");
            });

            option.classList.add("ausgewaehlt");
            option.setAttribute("aria-checked", "true");
            gewaehltesPortrait = option.dataset.portrait;
        });
    });

    // Live-Wechsel bei Dungeon-Kartenklick
    dungeonKarten.forEach(karte => {
        karte.addEventListener("click", () => {
            dungeonKarten.forEach(k => {
                k.classList.remove("ausgewaehlt");
                k.setAttribute("aria-checked", "false");
            });
            karte.classList.add("ausgewaehlt");
            karte.setAttribute("aria-checked", "true");
            gewaehlterDungeon = karte.dataset.wert;
            updateDungeonVisuals(gewaehlterDungeon);
        });

        karte.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") karte.click();
        });
    });

    // Speichert die Auswahl des Spielmodus
    /*spielAuswahl.forEach(spiel => {
        spiel.addEventListener("change", () => {
            gewaehltesSpiel = spiel.value;
        });
    });*/

    // Speichert die Auswahl des Spielmodus über Karten
    spielKarten.forEach(karte => {
        karte.addEventListener("click", () => {
            spielKarten.forEach(k => {
                k.classList.remove("ausgewaehlt");
                k.setAttribute("aria-checked", "false");
            });

            karte.classList.add("ausgewaehlt");
            karte.setAttribute("aria-checked", "true");
            gewaehltesSpiel = karte.dataset.spiel;
        });

        karte.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") karte.click();
        });
    });

    // --- NAVIGATION: VON SPIELAUSWAHL ZUR NÄCHSTEN AUSWAHL ---
btnWeiter.addEventListener("click", () => {
    const name = inputSpielername.value.trim();

    if (name === "") {
        alert("Bitte gib einen Heldennamen ein!");
        return;
    }

    if (gewaehltesSpiel === "dungeon") {
        spielAuswahlBereich.classList.add("hidden");
        btnWeiter.classList.add("hidden");

        dungeonAuswahlBereich.classList.remove("hidden");
        btnStart.classList.remove("hidden");
        btnZurueckAuswahl.classList.remove("hidden");
    }
    else {
        zehnerPunkte = 0;
        displayZehnerHeldenname.textContent = name;
        displayZehnerPunkte.textContent = zehnerPunkte;
        displayZehnerNachricht.textContent = "";

        startScreen.classList.add("hidden");
        zehnerScreen.classList.remove("hidden");

        generiereZehnerAufgabe();
    }
});

    //--- Hintergrundbild UND Monster-Bild anhand Schwierigkeit wechseln ---
    function updateDungeonVisuals(schwierigkeit) {
        document.body.className = "";
        document.body.classList.add(`bg-${schwierigkeit}`);
    }



    // --- NAVIGATION: DUNGEON BETRETEN ---
    btnStart.addEventListener("click", () => {
        try {
            const name = inputSpielername.value.trim();

            // Ausfallsicherheit: Name darf nicht leer sein
            if (name === "") {
                alert("Bitte gib einen Heldennamen ein, um den Dungeon zu betreten!");
                return;
            }

            if (gewaehlterDungeon === "") {
                alert("Bitte wähle einen Dungeon aus!");
                return;
            }

            // Spieldaten speichern
            gameState.heldenname = name;
            gameState.schwierigkeit = gewaehlterDungeon;
            gameState.punkte = 0;
            gameState.leben = START_LEBEN;

            // Übernimmt die Auswahl vom Startscreen in den Spielscreen.
            spielerFigur.src = gewaehltesPortrait;

            // Monsterleben und Herz-Anzeige zurücksetzen
            gameState.monsterLeben = 100;
            monsterLebenBalken.style.width = "100%";

            herzen.forEach(herz => {
                herz.classList.remove("verloren");
            });

            damageAnzeige.classList.add("hidden");


            // UI für das neue Spiel vorbereiten
            displayHeldenname.textContent = gameState.heldenname;
            displayPunkte.textContent = gameState.punkte;
            displayLeben.textContent = gameState.leben;
            displayNachricht.textContent = "";
            btnNewGame.classList.add("hidden");
            btnCheck.classList.remove("hidden");
            inputAntwort.disabled = false;

            // NAVIGATION OHNE NEULADEN (SPA)
            startScreen.classList.add("hidden");
            spielScreen.classList.remove("hidden");

            // Erste Matheaufgabe starten
            generiereAufgabe();

        } catch (error) {
            console.error("Fehler beim Wechseln des Screens:", error);
        }
    });

    // --- NAVIGATON: ZURÜCK ZUM START ---
    btnNewGame.addEventListener("click", () => {
        stoppeTimer();
        document.body.className = "bg-standard"; // Zurück zum Start-Hintergrund
        spielScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        inputSpielername.value = "";
        gewaehlterDungeon = "";
        dungeonKarten.forEach(k => {
            k.classList.remove("ausgewaehlt");
            k.setAttribute("aria-checked", "false");
        });
    });

    // --- TIMER ---
    function stoppeTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerContainer.classList.remove("warnung", "kritisch");
    }

    function starteTimer() {
        stoppeTimer();
        const limit = TIMER_LIMITS[gameState.schwierigkeit] || 30;
        let verbleibend = limit;

        timerWert.textContent = verbleibend;

        timerInterval = setInterval(() => {
            verbleibend--;
            timerWert.textContent = verbleibend;

            timerContainer.classList.remove("warnung", "kritisch");
            if (verbleibend <= 5) {
                timerContainer.classList.add("kritisch");
            } else if (verbleibend <= Math.ceil(limit * 0.4)) {
                timerContainer.classList.add("warnung");
            }

            if (verbleibend <= 0) {
                stoppeTimer();
                gameState.leben--;
                displayLeben.textContent = gameState.leben;
                aktualisiereHerzen();
                displayNachricht.textContent = "Zeit abgelaufen! Du verlierst ein Leben!";
                displayNachricht.style.color = "red";

                if (gameState.leben <= 0) {
                    displayNachricht.textContent = "Game Over! Du bist im Dungeon gefallen.";
                    displayNachricht.style.color = "darkred";
                    btnCheck.classList.add("hidden");
                    inputAntwort.disabled = true;
                    btnNewGame.classList.remove("hidden");
                } else {
                    setTimeout(generiereAufgabe, PAUSE_BIS_NAECHSTE_AUFGABE);
                }
            }
        }, 1000);
    }

    // --- SPIELLOGIK: DYNAMISCHE AUFGABEN ---
    function generiereAufgabe() {
        let num1 = 0;
        let num2 = 0;
        let operator = "+";

        // Forest: Addition & Subtraktion mit 10er-Übergang
        if (gameState.schwierigkeit === "einfach") {
            displayModus.textContent = "Modus: Forest (+ / -)";
            operator = Math.random() > 0.5 ? "+" : "-";

            // Garantiert einen Zehnerübergang im Zahlenraum bis 20
            num1 = Math.floor(Math.random() * 4) + 6; // 6 bis 9
            num2 = Math.floor(Math.random() * 5) + 5; // 5 bis 9

            if (operator === "-" && num1 < num2) {
                let temp = num1; 
                num1 = num2; 
                num2 = temp;
            }
        }
        // Town: Multiplikation und Division
        else if(gameState.schwierigkeit === "mittel"){
            displayModus.textContent = `Modus: Town (× / ÷)`;
            operator = Math.random() > 0.5 ?  "×" : "÷";
            
            if (operator === "×") {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            } else{
                num2 = Math.floor(Math.random() * 10) + 1;
                let ergebnis = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * ergebnis; // sorgt für glatte Division
            }
        }

        // Basement: gemischte Aufgaben
        else if (gameState.schwierigkeit === "schwer") {
            displayModus.textContent = "Modus: Basement (+ / - / × / ÷)";

            const operatoren = ["+", "-", "×", "÷"];
            operator = operatoren[Math.floor(Math.random() * operatoren.length)];

            if (operator === "+") {
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
            }

            else if (operator === "-") {
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
            }

            else if (operator === "×") {
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
            }

            else if (operator === "÷") {
                num2 = Math.floor(Math.random() * 12) + 1;
                let ergebnis = Math.floor(Math.random() * 12) + 1;
                num1 = num2 * ergebnis;
            }
        }

        // Moon God Tower: extra schwer
        else if (gameState.schwierigkeit === "extra_schwer") {
            displayModus.textContent = "Modus: Moon God Tower";

            const operatoren = ["+", "-", "×", "÷"];
            operator = operatoren[Math.floor(Math.random() * operatoren.length)];

            if (operator === "+") {
                num1 = Math.floor(Math.random() * 200) + 1;
                num2 = Math.floor(Math.random() * 200) + 1;
            }

            else if (operator === "-") {
                num1 = Math.floor(Math.random() * 200) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
            }

            else if (operator === "×") {
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
            }

            else if (operator === "÷") {
                num2 = Math.floor(Math.random() * 20) + 1;
                let ergebnis = Math.floor(Math.random() * 20) + 1;
                num1 = num2 * ergebnis;
            }
        }

        // Richtige Antwort berechnen
        if (operator === "+") gameState.aktuelleAntwort = num1 + num2;
        if (operator === "-") gameState.aktuelleAntwort = num1 - num2;
        if (operator === "×") gameState.aktuelleAntwort = num1 * num2;
        if (operator === "÷") gameState.aktuelleAntwort = num1 / num2;

        displayAufgabe.textContent = `${num1} ${operator} ${num2} = ?`;
        inputAntwort.value = "";
        inputAntwort.focus();
        starteTimer();
    }

    // --- 10ER-ÜBERGANG: AUFGABE GENERIEREN ---
    function generiereZehnerAufgabe() {
        const zahl1 = Math.floor(Math.random() * 4) + 6; // 6 bis 9
        const zahl2 = Math.floor(Math.random() * 5) + 5; // 5 bis 9

        zehnerAntwort = zahl1 + zahl2;

        displayZehnerAufgabe.textContent = `${zahl1} + ${zahl2} = ?`;
        inputZehnerAntwort.value = "";
        inputZehnerAntwort.focus();
    }

    // --- 10ER-ÜBERGANG: ANTWORT PRÜFEN ---
    function pruefeZehnerAntwort() {
        const antwort = Number(inputZehnerAntwort.value);

        if (inputZehnerAntwort.value.trim() === "" || Number.isNaN(antwort)) {
            displayZehnerNachricht.textContent = "Bitte gib eine gültige Zahl ein!";
            displayZehnerNachricht.style.color = "orange";
            return;
        }

        if (antwort === zehnerAntwort) {
            zehnerPunkte += 10;
            displayZehnerPunkte.textContent = zehnerPunkte;
            displayZehnerNachricht.textContent = "Richtig!";
            displayZehnerNachricht.style.color = "lime";
        } else {
            displayZehnerNachricht.textContent = `Falsch! Richtig war: ${zehnerAntwort}`;
            displayZehnerNachricht.style.color = "red";
        }

        setTimeout(generiereZehnerAufgabe, 1200);
    }

    // --- ANTWORT PRÜFEN & EXCEPTION HANDLING ---
    btnCheck.addEventListener("click", pruefeAntwort);

    // Ermöglicht die Bestätigung mit der Enter-Taste im Eingabefeld
    inputAntwort.addEventListener("keypress", (e) => {
        if (e.key === "Enter") pruefeAntwort();
    });

    btnZehnerCheck.addEventListener("click", pruefeZehnerAntwort);

    inputZehnerAntwort.addEventListener("keypress", (e) => {
        if (e.key === "Enter") pruefeZehnerAntwort();
    });


    btnZehnerZurueck.addEventListener("click", () => {
        zehnerScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");

        spielAuswahlBereich.classList.remove("hidden");
        btnWeiter.classList.remove("hidden");

        dungeonAuswahlBereich.classList.add("hidden");
        btnStart.classList.add("hidden");

        displayZehnerNachricht.textContent = "";
        inputZehnerAntwort.value = "";
    });

    btnZurueckStart.addEventListener("click", () => {
        stoppeTimer();

        // Spielscreen verlassen
        spielScreen.classList.add("hidden");

        // Startscreen anzeigen
        startScreen.classList.remove("hidden");

        // Hintergrund zurücksetzen
        document.body.className = "bg-standard";

        // Spielauswahl anzeigen
        spielAuswahlBereich.classList.remove("hidden");
        btnWeiter.classList.remove("hidden");

        // Dungeonauswahl verstecken
        dungeonAuswahlBereich.classList.add("hidden");
        btnStart.classList.add("hidden");

        // Auswahl zurücksetzen
        gewaehlterDungeon = "";

        dungeonKarten.forEach(k => {
            k.classList.remove("ausgewaehlt");
            k.setAttribute("aria-checked", "false");
        });

    });















    // --- KAMPFSYSTEM: MONSTER ERHÄLT SCHADEN ---
    function monsterBekommtSchaden() {
        const schaden = 10;

        gameState.monsterLeben -= schaden;

        if (gameState.monsterLeben < 0) {
            gameState.monsterLeben = 0;
        }

        monsterLebenBalken.style.width = gameState.monsterLeben + "%";

        damageAnzeige.textContent = "-" + schaden + " Damage";
        damageAnzeige.classList.remove("hidden");

        monsterBild.classList.add("monster-wackelt");

        setTimeout(() => {
            monsterBild.classList.remove("monster-wackelt");
            damageAnzeige.classList.add("hidden");
        }, 700);
    }

    // --- SPIELERLEBEN VISUELL AKTUALISIEREN ---
    function aktualisiereHerzen() {
        herzen.forEach((herz, index) => {
            if (index < gameState.leben) {
                herz.classList.remove("verloren");
            } else {
                herz.classList.add("verloren");
            }
        });
    }


    function pruefeAntwort() {
        try {
            const spielerAntwort = Number(inputAntwort.value);

            // Ausfallsicherheit: Verhindert Absturz oder Fehler bei leeren/falschen Eingaben
            if (inputAntwort.value.trim() === "" || Number.isNaN(spielerAntwort)) {
                //Ist das Feld leer oder ist die Eingabe keine Zahl?
                displayNachricht.textContent = " Bitte gib eine gültige Zahl ein!";
                displayNachricht.style.color = "orange";
                return;
            }

            stoppeTimer();

            // Auswertung
            if (spielerAntwort === gameState.aktuelleAntwort) {
                gameState.punkte += PUNKTE_PRO_RICHTIGE_ANTWORT;
                displayPunkte.textContent = gameState.punkte;
                monsterBekommtSchaden();


                if (gameState.punkte > highscore) {
                    highscore = gameState.punkte;
                    localStorage.setItem(HIGHSCORE_KEY, highscore);
                    displayHighscore.textContent = highscore;
                }
                displayNachricht.textContent = " Treffer! Das Monster verliert KP!";
                displayNachricht.style.color = "lime";
            } else {
                gameState.leben--;
                displayLeben.textContent = gameState.leben;
                aktualisiereHerzen();
                displayNachricht.textContent = ` Autsch! Richtig war: ${gameState.aktuelleAntwort}`;
                displayNachricht.style.color = "red";
            }

            // Spiel-Ende prüfen (Gewonnen bei 100 Punkten / Verloren bei 0 Leben)
            if (gameState.punkte >= SIEG_PUNKTE || gameState.leben <= 0) {
                if (gameState.punkte >= SIEG_PUNKTE) {
                    displayNachricht.textContent = " Sieg! Du hast das Monster besiegt!";
                    displayNachricht.style.color = "gold";
                } else {
                    displayNachricht.textContent = " Game Over! Du bist im Dungeon gefallen.";
                    displayNachricht.style.color = "darkred";
                }

                // Buttons umschalten
                btnCheck.classList.add("hidden");
                inputAntwort.disabled = true;
                btnNewGame.classList.remove("hidden");
            } else {
                // Nächste Aufgabe nach einer kurzen Pause laden (1,2 Sekunden)
                setTimeout(generiereAufgabe, PAUSE_BIS_NAECHSTE_AUFGABE);
            }

        } catch (error) {
            console.warn("Fehler bei der Eingabeverarbeitung abgefangen:", error);
        }
    }


});
