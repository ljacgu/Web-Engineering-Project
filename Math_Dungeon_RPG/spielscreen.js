// Elemente aus dem Spielscreen holen
const heldennameSpan = document.getElementById("heldenname");
const punkteSpan     = document.getElementById("punkte");
const lebenSpan      = document.getElementById("leben");
const aufgabeEl      = document.getElementById("aufgabe");
const modusAnzeige   = document.getElementById("modusAnzeige");
const antwortInput   = document.getElementById("antwort-input");
const checkButton    = document.getElementById("check-button");
const nachricht      = document.getElementById("nachricht");

// Spielzustand
let punktestand    = 0;
let lebenAnzahl    = 3;
let korrekteAntwort = 0;

// Spielerdaten vom Startscreen laden (gespeichert mit localStorage)
const heldenname = localStorage.getItem("heldenname") || "Held";
const modus      = localStorage.getItem("modus") || "addieren";

// Anzeige initialisieren
heldennameSpan.textContent = heldenname;
modusAnzeige.textContent   = `Modus: ${modus}`;

// Erste Aufgabe generieren
generiereAufgabe();

// Event Listener
checkButton.addEventListener("click", überprüfeAntwort);

// ---- Funktionen ----

function generiereAufgabe() {
    const zahl1 = Math.floor(Math.random() * 50) + 1;
    const zahl2 = Math.floor(Math.random() * 50) + 1;

    let operator = "+";

    if (modus === "addieren") {
        operator = "+";
        korrekteAntwort = zahl1 + zahl2;
    }

    aufgabeEl.textContent = `${zahl1} ${operator} ${zahl2} = ?`;
    antwortInput.value = "";
}

function überprüfeAntwort() {
    if (antwortInput.value === "") {
        nachricht.textContent = "Bitte gib eine Antwort ein!";
        return;
    }

    const benutzerAntwort = Number(antwortInput.value);

    if (benutzerAntwort === korrekteAntwort) {
        punktestand = punktestand + 10;
        punkteSpan.textContent = punktestand;
        nachricht.textContent = "Richtig! Das Monster wurde getroffen: +10 Punkte";
    } else {
        lebenAnzahl = lebenAnzahl - 1;
        lebenSpan.textContent = lebenAnzahl;
        nachricht.textContent = "Falsch! Das Monster hat dich getroffen: -1 Leben";
    }

    if (lebenAnzahl === 0) {
        nachricht.textContent = "Game Over! Du hast keine Leben mehr.";
        checkButton.disabled = true;
        return;
    }

    generiereAufgabe();
}
