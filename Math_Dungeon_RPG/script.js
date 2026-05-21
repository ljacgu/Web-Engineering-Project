// =========================
// STARTSCREEN
// =========================

// Elemente aus dem Startscreen holen
const spielerInput = document.getElementById("spielername");
const startButton = document.getElementById("start-button");
const schwierigkeitSelect = document.getElementById("schwierigkeit");

// ==========================================
// HINTERGRUNDWECHSEL BEI SCHWIERIGKEITSWAHL
// ==========================================
function ändereDungeonHintergrund() {
    //welcher Wert gerade ausgewählt ist
    const ausgewählterSchwierigkeit = schwierigkeitSelect.value;

    // Alle alten Hintergrund löschen, damit nicht stapeln
    document.body.classList.remove('bg-einfach', 'bg-mittel', 'bg-schwer', 'bg-extra_schwer');

    // Die passende neue Klasse an den body hängen
    if (ausgewählterSchwierigkeit === 'einfach') {
        document.body.classList.add('bg-einfach');
    } else if (ausgewählterSchwierigkeit === 'mittel') {
        document.body.classList.add('bg-mittel');
    } else if (ausgewählterSchwierigkeit === 'schwer') {
        document.body.classList.add('bg-schwer');
    } else if (ausgewählterSchwierigkeit === 'extra_schwer') {
        document.body.classList.add('bg-extra_schwer');
    }
}

// Beim Laden der Seite initialisieren
if (schwierigkeitSelect) {
    // Liest jetzt die "schwierigkeit" aus dem Speicher
    const gespeicherteSchwierigkeit = localStorage.getItem("schwierigkeit");
    if (gespeicherteSchwierigkeit) {
        schwierigkeitSelect.value = gespeicherteSchwierigkeit;
    }

    // Hintergrund direkt einmal richtig setzen beim Laden
    ändereDungeonHintergrund();
    // Event Listener aktivieren
    schwierigkeitSelect.addEventListener("change", ändereDungeonHintergrund);
}


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
    localStorage.setItem("schwierigkeit", schwierigkeitSelect.value);



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
const schwierigkeitAnzeige = document.getElementById("schwierigkeitAnzeige");
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

const schwierigkeit =
    localStorage.getItem("schwierigkeit") || "addieren";

// =========================
// ANZEIGE INITIALISIEREN
// =========================

if (heldennameSpan) {
    heldennameSpan.textContent = heldenname;
}

if (schwierigkeitAnzeige) {
    // Schöne Text-Anzeige für den Spielscreen
    let schwierigkeitText = "Einfach";
    if (schwierigkeit === "mittel") schwierigkeitText = "Mittel";
    if (schwierigkeit === "schwer") schwierigkeitText = "Schwer";
    if (schwierigkeit === "extra_schwer") schwierigkeitText = "Extra Schwer";

    schwierigkeitAnzeige.textContent = `Schwierigkeit: ${schwierigkeitText}`;
}
document.body.classList.remove('bg-einfach', 'bg-mittel', 'bg-schwer', 'bg-extra_schwer');

if (schwierigkeit === 'einfach') {
    document.body.classList.add('bg-einfach');
} else if (schwierigkeit === 'mittel') {
    document.body.classList.add('bg-mittel');
} else if (schwierigkeit === 'schwer') {
    document.body.classList.add('bg-schwer');
} else if (schwierigkeit === 'extra_schwer') {
    document.body.classList.add('bg-extra_schwer');

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