//1. Startscreen
document.addEventListener("DOMContentLoaded", () => {

    const startScreen = document.querySelector("#startscreen");
    const spielScreen = document.querySelector("#spielscreen");

    const inputSpielername = document.querySelector("#spielername");
    const dungeonKarten = document.querySelectorAll(".dungeon-karte");
    const btnStart = document.querySelector("#start-button");
    let gewaehlterDungeon = "";

    const displayHeldenname = document.querySelector("#heldenname");
    const displayPunkte = document.querySelector("#punkte");
    const displayLeben = document.querySelector("#leben");
    const displayModus = document.querySelector("#modusAnzeige");
    const displayAufgabe = document.querySelector("#aufgabe");
    const displayNachricht = document.querySelector("#nachricht");

    const inputAntwort = document.querySelector("#antwort-input");
    const btnCheck = document.querySelector("#check-button");
    const btnNewGame = document.querySelector("#newGame-button");

    // --- SPIEL-ZUSTAND (State) ---
    let gameState = {
        heldenname: "",
        schwierigkeit: "einfach",
        punkte: 0,
        leben: 3,
        aktuelleAntwort: 0
    };

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
            gameState.leben = 3;

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

    // --- SPIELLOGIK: DYNAMISCHE AUFGABEN ---
    function generiereAufgabe() {
        let num1 = 0;
        let num2 = 0;
        let operator = "+";

        // Generierung basierend auf deinem gewählten Dungeon-Modus
        if (gameState.schwierigkeit === "einfach") {
            displayModus.textContent = "Modus: 10er-Übergang (Forest)";
            operator = Math.random() > 0.5 ? "+" : "-";

            // Garantiert einen Zehnerübergang im Zahlenraum bis 20
            num1 = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
            num2 = Math.floor(Math.random() * 5) + 5; // 5, 6, 7, 8, 9

            if (operator === "-" && num1 < num2) {
                let temp = num1; num1 = num2; num2 = temp;
            }
        }
        else {
            displayModus.textContent = `Modus: Zahlenraum 1-100 (${gameState.schwierigkeit})`;
            // Für die anderen Modi nutzen wir standardmäßig eine Addition im Zahlenraum 1-100
            operator = "+";
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 49) + 1;
        }

        // Richtige Antwort im Hintergrund berechnen
        if (operator === "+") gameState.aktuelleAntwort = num1 + num2;
        if (operator === "-") gameState.aktuelleAntwort = num1 - num2;

        // Aufgabe im HTML anzeigen
        displayAufgabe.textContent = `${num1} ${operator} ${num2} = ?`;
        inputAntwort.value = "";
        inputAntwort.focus();
    }

    // --- ANTWORT PRÜFEN & EXCEPTION HANDLING ---
    btnCheck.addEventListener("click", pruefeAntwort);

    // Ermöglicht die Bestätigung mit der Enter-Taste im Eingabefeld
    inputAntwort.addEventListener("keypress", (e) => {
        if (e.key === "Enter") pruefeAntwort();
    });



















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

            // Auswertung
            if (spielerAntwort === gameState.aktuelleAntwort) {
                gameState.punkte += 10;
                displayPunkte.textContent = gameState.punkte;
                displayNachricht.textContent = " Treffer! Das Monster verliert KP!";
                displayNachricht.style.color = "lime";
            } else {
                gameState.leben--;
                displayLeben.textContent = gameState.leben;
                displayNachricht.textContent = ` Autsch! Richtig war: ${gameState.aktuelleAntwort}`;
                displayNachricht.style.color = "red";
            }

            // Spiel-Ende prüfen (Gewonnen bei 100 Punkten / Verloren bei 0 Leben)
            if (gameState.punkte >= 100 || gameState.leben <= 0) {
                if (gameState.punkte >= 100) {
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
                setTimeout(generiereAufgabe, 1200);
            }

        } catch (error) {
            console.warn("Fehler bei der Eingabeverarbeitung abgefangen:", error);
        }
    }


});
