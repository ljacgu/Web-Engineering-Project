const startscreen = document.getElementById("startscreen");
const Spielername = document.getElementById("spielername");
const startbutton = document.getElementById("start-button");
const spielscreen = document.getElementById("spielscreen");

const heldenname = document.getElementById("heldenname");
const punkte = document.getElementById("punkte");
const leben = document.getElementById("leben");

const aufgabe = document.getElementById("aufgabe");
const antwortinput = document.getElementById("antwort-input");
const checkbutton = document.getElementById("check-button");
const nachricht = document.getElementById("nachricht");

//const restartbutton = document.getElementById("restart-button");

const genderSwitch = document.getElementById("gender");

genderSwitch.addEventListener("change", function() {

    if(genderSwitch.checked) {
        console.log("Geschlecht: Weiblich");
    } else {
        console.log("Geschlecht: Männlich");
    }

});

let punktestand = 0;
let lebenAnzahl = 3;
let korrekteAntwort = 0;

startbutton.addEventListener("click", startespiel);
checkbutton.addEventListener("click", überprüfeAntwort);
//restartbutton.addEventListener("click", neuesSpiel);

function startespiel() {
    const name = Spielername.value.trim();
    if (name === "") {
        alert("Bitte gib zuest deinen Heldennamen ein!");
        return;
    }

    heldenname.textContent = name;

    startscreen.classList.add("hidden");
    spielscreen.classList.remove("hidden");

    generiereAufgabe();
}

function generiereAufgabe() {
    const zahl1 = Math.floor(Math.random() * 50)+1;
    const zahl2 = Math.floor(Math.random() * 50)+1;

    korrekteAntwort = zahl1 + zahl2;

    aufgabe.textContent = `${zahl1} + ${zahl2} = ?`;

}

function überprüfeAntwort() {
    if (antwortinput.value === "") {
        nachricht.textContent = "Bitte gib eine Antwort ein!";
        return;
    }

    const benutzerAntwort = Number(antwortinput.value);

    if (benutzerAntwort === korrekteAntwort) {
        punktestand = punktestand + 10;
        punkte.textContent = punktestand;
        nachricht.textContent = "Richtig! Das Monster wurde getroffen: +10 Punkte";
    } else {
        lebenAnzahl = lebenAnzahl - 1;
        leben.textContent = lebenAnzahl;
        nachricht.textContent = "Falsch! Das Monster hat dich getroffen: -1 Leben";
    }

    if (lebenAnzahl === 0) {
        nachricht.textContent = "Game Over! Du hast keine Leben mehr.";
        checkbutton.disabled = true;
        //restartbutton.classList.remove("hidden");
        return;
    }
    generiereAufgabe();
}

/*function neuesSpiel() {
    punktestand = 0;
   lebenAnzahl = 3;

    punkte.textContent = punktestand;
    leben.textContent = lebenAnzahl;
    nachricht.textContent = "";

    antwortinput.value = "";

    checkbutton.disabled = false;
    restartbutton.classList.add("hidden");

    generiereAufgabe();
}*/
