// =========================
// STARTSCREEN
// =========================

// Elemente aus dem Startscreen holen
const spielerInput = document.getElementById("spielername");
const startButton = document.getElementById("start-button");
const modusSelect = document.getElementById("modus");



// =========================
// SPIEL STARTEN
// =========================

if (startButton) {
    startButton.addEventListener("click", starteSpiel);
}

function starteSpiel() {

    const name = spielerInput.value.trim();

    if (name === "") {
        alert("Bitte gib zuerst deinen Heldennamen ein!");
        return;
    }

    // Daten speichern
    localStorage.setItem("heldenname", name);
    localStorage.setItem("modus", modusSelect.value);

    localStorage.setItem(
        "geschlecht",
        genderSwitch.checked ? "weiblich" : "männlich"
    );

    // Zur Spielseite wechseln
    window.location.href = "spielscreen.html";
}

// =========================
// SPIELSCREEN
// =========================

// Elemente aus dem Spielscreen holen
const heldennameSpan = document.getElementById("heldenname");
const punkteSpan = document.getElementById("punkte");
const lebenSpan = document.getElementById("leben");
const aufgabeEl = document.getElementById("aufgabe");
const modusAnzeige = document.getElementById("modusAnzeige");
const antwortInput = document.getElementById("antwort-input");
const checkButton = document.getElementById("check-button");
const nachricht = document.getElementById("nachricht");
const newGameButton = document.getElementById("newGame-button");

// =========================
// SPIELZUSTAND
// =========================

let punktestand = 0;
let lebenAnzahl = 3;
let korrekteAntwort = 0;

// Spielerdaten laden
const heldenname =
    localStorage.getItem("heldenname") || "Held";

const modus =
    localStorage.getItem("modus") || "addieren";

// =========================
// ANZEIGE INITIALISIEREN
// =========================

if (heldennameSpan) {
    heldennameSpan.textContent = heldenname;
}

if (modusAnzeige) {
    modusAnzeige.textContent = `Modus: ${modus}`;
}

// Erste Aufgabe erzeugen
if (aufgabeEl) {
    generiereAufgabe();
}

// =========================
// EVENT LISTENER
// =========================

if (checkButton) {
    checkButton.addEventListener(
        "click",
        überprüfeAntwort
    );
}

if (newGameButton) {
    newGameButton.addEventListener("click", newGame);
}

// =========================
// AUFGABE GENERIEREN
// =========================

function generiereAufgabe() {

    const zahl1 =
        Math.floor(Math.random() * 50) + 1;

    const zahl2 =
        Math.floor(Math.random() * 50) + 1;

    let operator = "+";

    if (modus === "addieren") {

        operator = "+";

        korrekteAntwort = zahl1 + zahl2;

    }

    aufgabeEl.textContent =
        `${zahl1} ${operator} ${zahl2} = ?`;

    antwortInput.value = "";
}

// =========================
// ANTWORT PRÜFEN
// =========================

function überprüfeAntwort() {

    if (antwortInput.value === "") {

        nachricht.textContent =
            "Bitte gib eine Antwort ein!";

        return;
    }

    const benutzerAntwort =
        Number(antwortInput.value);

    // Richtige Antwort
    if (benutzerAntwort === korrekteAntwort) {

        punktestand += 10;

        punkteSpan.textContent = punktestand;

        nachricht.textContent =
            "Richtig! Das Monster wurde getroffen: +10 Punkte";

    } else {

        // Falsche Antwort
        lebenAnzahl--;

        lebenSpan.textContent = lebenAnzahl;

        nachricht.textContent =
            "Falsch! Das Monster hat dich getroffen: -1 Leben";
    }

    // Game Over
    if (lebenAnzahl === 0) {

        nachricht.textContent =
            "Game Over! Du hast keine Leben mehr.";

        checkButton.disabled = true;

        return;
    }

    // Neue Aufgabe
    generiereAufgabe();
}

// =========================
// NEUES SPIEL BUTTON - FUNKTION
// =========================

function newGame() {
    punktestand = 0;
    lebenAnzahl = 3;

    punkteSpan.textContent = punktestand;
    lebenSpan.textContent = lebenAnzahl;
    nachricht.textContent = "";

    checkButton.disabled = false;

    generiereAufgabe();
}