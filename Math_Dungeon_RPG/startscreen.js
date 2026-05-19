// Elemente aus dem Startscreen holen
const spielerInput = document.getElementById("spielername");
const startButton  = document.getElementById("start-button");
const genderSwitch = document.getElementById("genderToggle");
const modusSelect  = document.getElementById("modus");

// Geschlecht-Schalter: Konsolenausgabe bei Änderung
genderSwitch.addEventListener("change", function () {
    if (genderSwitch.checked) {
        console.log("Geschlecht: Weiblich");
    } else {
        console.log("Geschlecht: Männlich");
    }
});

// Startbutton: Spielerdaten speichern und zur Spielseite wechseln
startButton.addEventListener("click", starteSpiel);

function starteSpiel() {
    const name = spielerInput.value.trim();

    if (name === "") {
        alert("Bitte gib zuerst deinen Heldennamen ein!");
        return;
    }

    // Daten im Browser speichern, damit spielscreen.js sie lesen kann
    localStorage.setItem("heldenname", name);
    localStorage.setItem("modus", modusSelect.value);
    localStorage.setItem("geschlecht", genderSwitch.checked ? "weiblich" : "männlich");

    // Zur Spielseite wechseln
    window.location.href = "spielscreen.html";
}
