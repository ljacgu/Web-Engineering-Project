// -----------------------
// Allgemeine Logik
// Wird von mehreren Screens benutzt.
// -----------------------

//zufällige Zahl zwischen min und max
function rand(min, max) {
    //wie viele mögliche Zahlen es gibt
    const range = max - min + 1;
    //Zahlbereich berechnen und dann verschieben
    return Math.floor(Math.random() * range) + min;
}

//Rechenops zufällig auswählen: Zufällige Index von Array auswählen
function pickOp(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// -----------------------
// Spielscreen
// Logik für die normalen Matheaufgaben.
// -----------------------

function calculateAnswer(a, b, op) {
    if (op === "+") {
        return a + b;
    }

    if (op === "-" || op === "−") {
        return a - b;
    }

    if (op === "*" || op === "×") {
        return a * b;
    }

    if (op === "/" || op === "÷") {
        return a / b;
    }

    throw new Error("Unbekannter Operator: " + op);
}

//Aufgaben zum passenden Niveau generieren.
function createQuestion(level) {
    if (level === "einfach") {
        return createEasyQuestion();
    }

    if (level === "mittel") {
        return createMediumQuestion();
    }

    return createHardQuestion();
}

//Einfach: Plus und Minus
function createEasyQuestion() {
    const op = pickOp(["+", "−"]);
    let a;
    let b;

    if (op === "+") {
        a = rand(1, 99);
        b = rand(1, 100 - a);
    } else {
        //Die erste Zahl ist größer, damit kein negatives Ergebnis entsteht.
        a = rand(1, 100);
        b = rand(1, a);
    }

    return buildQuestion(a, b, op);
}

//Mittel: Mal und Geteilt
function createMediumQuestion() {
    const op = pickOp(["×", "÷"]);
    let a;
    let b;

    if (op === "×") {
        a = rand(2, 10);
        b = rand(2, Math.floor(100 / a));
    } else {
        //a ist ein Vielfaches von b, damit die Division glatt aufgeht.
        b = rand(2, 10);
        a = b * rand(2, Math.floor(100 / b));
    }

    return buildQuestion(a, b, op);
}

//Schwer: Einfach und Mittel kombiniert, mit größerem Zahlenbereich bei Mal und Geteilt.
function createHardQuestion() {
    const op = pickOp(["+", "−", "×", "÷"]);
    let a;
    let b;

    if (op === "+") {
        a = rand(1, 99);
        b = rand(1, 100 - a);
    } else if (op === "−") {
        a = rand(1, 100);
        b = rand(1, a);
    } else if (op === "×") {
        a = rand(2, 20);
        b = rand(2, Math.floor(100 / a));
    } else {
        //a ist ein Vielfaches von b, damit die Division glatt aufgeht.
        b = rand(2, 20);
        a = b * rand(2, Math.floor(100 / b));
    }

    return buildQuestion(a, b, op);
}

//Objekt zurückgeben
function buildQuestion(a, b, op) {
    const answer = calculateAnswer(a, b, op);
    return {
        a,
        b,
        op,
        answer,
        text: `${a} ${op} ${b} = ?`
    };
}

// -----------------------
// Spielscreen
// Logik für insgesamte 4 Lösungen
// -----------------------

//4 Antwortmöglichkeiten erstellen: richtige Antwort plus 3 falsche Antworten und danach mischen
function createAnswerChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);
    const spread = getWrongAnswerSpread(correctAnswer);

    //Falsche Antworten generieren
    let tries = 0;
    while (choices.size < 4 && tries < 1000) {
        tries++;
        const wrongAnswer = createWrongAnswerChoice(correctAnswer, spread);
        if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
            choices.add(wrongAnswer);
        }
    }

    return shuffleAnswerChoices([...choices]);
}

//abhängige Abweichung anhand wie groß die Lösung ist
function getWrongAnswerSpread(answer) {
    if (answer > 50) {
        return 20;
    }
    if (answer > 20) {
        return 10;
    }
    return 5;
}

//falsche Antwort = richtige Antwort + zufällige Abweichung
function createWrongAnswerChoice(correctAnswer, spread) {
    return correctAnswer + rand(-spread, spread);
}

// Reihenfolgen von Antworten zufällig mischen
function shuffleAnswerChoices(arr) {
    //hinten nach vorne
    for (let i = arr.length - 1; i > 0; i--) {
        //0-1 mit i+1 mul und abrunden
        const j = Math.floor(Math.random() * (i + 1));
        //zufällige index mit i tauschen
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// -----------------------
// Start 10er Uebergang
// Logik fuer Aufgaben, Loesung und Tipp.
// -----------------------

const LOGIC_TEN_ZAHLENRAUM_MIN = 1;   //Zahlbegrenzung
const LOGIC_TEN_ZAHLENRAUM_MAX = 100; //Zahlbegrenzung
const LOGIC_TEN_STEP = 10;            //Zehnerschritt
const LOGIC_TEN_ADDEND_MAX = 30;      //zweite Zahl beschraenken, damit nicht zu schwer

function createTenTask() {
    const base = createTenValue();
    const op = pickOp(["+", "-"]);
    const questionPosition = rand(1, 3);

    if (op === "+") {
        return createAdditionTenTask(base, questionPosition);
    }

    return createSubtractionTenTask(base, questionPosition);
}

function createTenValue() {
    while (true) {
        //startwert: Platz lassen, damit die Aufgabe ueber den naechsten Zehner geht
        const start = rand(LOGIC_TEN_ZAHLENRAUM_MIN, LOGIC_TEN_ZAHLENRAUM_MAX - LOGIC_TEN_STEP - 1);
        const nextTen = getNextTen(start);
        const toNextTen = nextTen - start;
        const maxAddend = Math.min(LOGIC_TEN_ADDEND_MAX, LOGIC_TEN_ZAHLENRAUM_MAX - start);

        //nur Aufgaben mit echtem Zehneruebergang
        if (toNextTen + 1 <= maxAddend) {
            const addend = rand(toNextTen + 1, maxAddend);
            return {
                start,
                addend,
                result: start + addend,
                nextTen,
                toNextTen,
                afterNextTen: addend - toNextTen
            };
        }
    }
}

//teilt durch 10, rundet ab, multipliziert mit 10 und geht dann zum naechsten Zehner
function getNextTen(number) {
    return Math.floor(number / LOGIC_TEN_STEP) * LOGIC_TEN_STEP + LOGIC_TEN_STEP;
}

//Texte fuer Tipps und Aufgaben (+)
function createAdditionTenTask(base, questionPosition) {
    //? an der Stelle 1
    if (questionPosition === 1) {
        return {
            text: `? + ${base.addend} = ${base.result}`,
            answer: base.start,
            hint: `Trick: Bei ? + ${base.addend} = ${base.result} rechnest du ${base.result} - ${base.addend}.`
        };
    }

    //? an der Stelle 2
    if (questionPosition === 2) {
        return {
            text: `${base.start} + ? = ${base.result}`,
            answer: base.addend,
            hint: `Gesuchte Zahl = ${base.result} - ${base.start}. Rechne den Abstand zwischen ${base.start} und ${base.result}.`
        };
    }

    //? an der Stelle 3
    return {
        text: `${base.start} + ${base.addend} = ?`,
        answer: base.result,
        hint: `Trick: Rechne ${base.start} + ${base.addend}.`
    };
}

//Texte fuer Tipps und Aufgaben (-)
function createSubtractionTenTask(base, questionPosition) {
    //? an der Stelle 1
    if (questionPosition === 1) {
        return {
            text: `? - ${base.addend} = ${base.start}`,
            answer: base.result,
            hint: `Trick: Bei ? - ${base.addend} = ${base.start} rechnest du ${base.start} + ${base.addend}.`
        };
    }

    //? an der Stelle 2
    if (questionPosition === 2) {
        return {
            text: `${base.result} - ? = ${base.start}`,
            answer: base.addend,
            hint: `Gesuchte Zahl = ${base.result} - ${base.start}. Rechne den Abstand zwischen ${base.start} und ${base.result}.`
        };
    }

    //? an der Stelle 3
    return {
        text: `${base.result} - ${base.addend} = ?`,
        answer: base.start,
        hint: `Trick: Rechne ${base.result} - ${base.addend}.`
    };
}

// -----------------------
// Ende 10er Uebergang
// -----------------------

// -----------------------
// Highscore-Screen
// -----------------------


const LOGIC_HIGHSCORE_SAVE_KEY = "matheAbenteuerHighscores";
const LOGIC_HIGHSCORE_LEVELS = ["einfach", "mittel", "schwer"];
const LOGIC_MAX_RANKING_PLACES = 5;

function loadHighscoreLists(storage) {
    //drei getrennte Ranglisten
    const emptyLists = { einfach: [], mittel: [], schwer: [] };

    try {
        //Daten ausholen
        const storedLists = JSON.parse(storage.getItem(LOGIC_HIGHSCORE_SAVE_KEY)) || {};
        //überschreibe Leere liste mit gespeicherten Highscoredaten
        const lists = { ...emptyLists, ...storedLists };
        //Absicherung gegen kaputte Daten
        LOGIC_HIGHSCORE_LEVELS.forEach(function (level) {
            if (!Array.isArray(lists[level])) {
                lists[level] = [];
            }
        });
        return lists;
    //Beim Fehler leere liste zurückgeben
    } catch {
        return emptyLists;
    }
}

//Speichern in LocalStorage
function saveHighscoreLists(storage, lists) {
    try {
        storage.setItem(LOGIC_HIGHSCORE_SAVE_KEY, JSON.stringify(lists));
        return true;
    } catch {
        return false;
    }
}

//Fügt einen Eintrag sortiert hinzu und behält nur die besten Plätze.
//Punkten absteigend, wenn Punkte gleich Zeit aufsteigend.
function addHighscoreEntry(old, entry) {
    return [...old, entry]
        .sort(function (a, b) {
            return b.points - a.points || a.time - b.time;
        })
        .slice(0, LOGIC_MAX_RANKING_PLACES);//zeige nur die beste 5
}

function getBestScoreFromList(scores) {
    if (scores.length === 0) {
        return 0;
    }

    //erste Eintrag zurückgeben
    return scores[0].points;
}

// Sekunden ->1:01
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    //padStart macht Seconds immer 2 Stellig wie 02 03 23;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

//---------------------------
//export
// --------------------------
if (typeof module !== "undefined") {
    module.exports = {
        rand,
        pickOp,
        calculateAnswer,
        createQuestion,
        createEasyQuestion,
        createMediumQuestion,
        createHardQuestion,
        buildQuestion,
        createAnswerChoices,
        getWrongAnswerSpread,
        createWrongAnswerChoice,
        shuffleAnswerChoices,
        createTenTask,
        createTenValue,
        getNextTen,
        createAdditionTenTask,
        createSubtractionTenTask,
        loadHighscoreLists,
        saveHighscoreLists,
        addHighscoreEntry,
        getBestScoreFromList,
        formatTime
    };
}
