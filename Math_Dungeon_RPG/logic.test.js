const assert = require("assert");
const {
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
    addHighscoreEntry,
    getBestScoreFromList,
    formatTime
} = require("./logicFunction");

function test(name, testFunction) {
    testFunction();
    console.log("JA - " + name);
}

//Typ richtig? Loesung korrekt, passt angezeigte Text zur Aufgabe?
function assertQuestionIsValid(question) {
    assert.strictEqual(typeof question.a, "number");
    assert.strictEqual(typeof question.b, "number");
    assert.strictEqual(typeof question.op, "string");
    assert.strictEqual(typeof question.answer, "number");
    assert.strictEqual(question.answer, calculateAnswer(question.a, question.b, question.op));
    assert.strictEqual(question.text, `${question.a} ${question.op} ${question.b} = ?`);
}

//--------------------
// Allgemeine Logik
// -------------------

test("rand liefert Zahl im erwarteten Bereich", function () {
    const number = rand(1, 10);
    assert.ok(number >= 1);
    assert.ok(number <= 10);
});

//--------------------
// Spielscreen: Aufgaben
// -------------------

test("calculateAnswer liefert richtige Loesung", function () {
    assert.strictEqual(calculateAnswer(-5, 3, "+"), -2);
    assert.strictEqual(calculateAnswer(100, 58, "-"), 42);
    assert.strictEqual(calculateAnswer(100, 58, "−"), 42);
    assert.strictEqual(calculateAnswer(500, 3, "*"), 1500);
    assert.strictEqual(calculateAnswer(500, 3, "×"), 1500);
    assert.strictEqual(calculateAnswer(6000, 300, "/"), 20);
    assert.strictEqual(calculateAnswer(6000, 300, "÷"), 20);
    assert.throws(function () {
        calculateAnswer(5, 3, "X");
    }, /Unbekannter Operator/);
});

test("createQuestion erstellt passende Aufgabe", function () {
    const easyQuestion = createQuestion("einfach");
    const mediumQuestion = createQuestion("mittel");
    const hardQuestion = createQuestion("schwer");

    assertQuestionIsValid(easyQuestion);
    assertQuestionIsValid(mediumQuestion);
    assertQuestionIsValid(hardQuestion);

    assert.ok(["+", "−"].includes(easyQuestion.op));
    assert.ok(["×", "÷"].includes(mediumQuestion.op));
    assert.ok(["+", "−", "×", "÷"].includes(hardQuestion.op));
});

test("buildQuestion erstellt gueltiges Objekt", function () {
    assert.deepStrictEqual(buildQuestion(7, 5, "+"), {
        a: 7,
        b: 5,
        op: "+",
        answer: 12,
        text: "7 + 5 = ?"
    });
});

//--------------------
// Spielscreen: Antwortmoeglichkeiten
// -------------------

test("createAnswerChoices erstellt vier Antwortmoeglichkeiten", function () {
    const choices = createAnswerChoices(12);
    //4 Auswahl? richtige Lösung dabei? alle größer null?
    assert.strictEqual(choices.length, 4);
    assert.ok(choices.includes(12));
    for (let i = 0; i < choices.length; i++) {
        assert.ok(choices[i] >= 0);
    }
});

test("getWrongAnswerSpread hat passende Abweichung", function () {
    assert.strictEqual(getWrongAnswerSpread(50), 10);
    assert.strictEqual(getWrongAnswerSpread(51), 20);
    assert.strictEqual(getWrongAnswerSpread(20), 5);
    assert.strictEqual(getWrongAnswerSpread(21), 10);
});

test("createWrongAnswerChoice - richtige Antwort und Abweichung - liefert Zahl im moeglichen Bereich", function () {
    const wrongAnswer = createWrongAnswerChoice(20, 5);
    assert.ok(wrongAnswer >= 15);
    assert.ok(wrongAnswer <= 25);
});

//--------------------
// 10er Uebergang
// -------------------

test("getNextTen liefert den naechsten Zehner", function () {
    assert.strictEqual(getNextTen(47), 50);
    assert.strictEqual(getNextTen(50), 60);
});

test("createTenValue erstellt Werte mit echtem Zehneruebergang", function () {
    const base = createTenValue();

    assert.ok(base.start >= 1);
    assert.ok(base.result <= 100);
    assert.ok(base.addend <= 30);
    assert.strictEqual(base.result, base.start + base.addend);
    assert.strictEqual(base.nextTen, getNextTen(base.start));
    assert.strictEqual(base.toNextTen, base.nextTen - base.start);
    assert.strictEqual(base.afterNextTen, base.addend - base.toNextTen);
    assert.ok(base.addend > base.toNextTen);
});

test("createAdditionTenTask erstellt passende Texte und Antworten", function () {
    const base = {
        start: 47,
        addend: 15,
        result: 62,
        nextTen: 50,
        toNextTen: 3,
        afterNextTen: 12
    };

    assert.deepStrictEqual(createAdditionTenTask(base, 1), {
        text: "? + 15 = 62",
        answer: 47,
        hint: "Trick: Bei ? + 15 = 62 rechnest du 62 - 15."
    });

    assert.deepStrictEqual(createAdditionTenTask(base, 2), {
        text: "47 + ? = 62",
        answer: 15,
        hint: "Gesuchte Zahl = 62 - 47. Rechne den Abstand zwischen 47 und 62."
    });

    assert.deepStrictEqual(createAdditionTenTask(base, 3), {
        text: "47 + 15 = ?",
        answer: 62,
        hint: "Trick: Rechne 47 + 15."
    });
});

test("createSubtractionTenTask erstellt passende Texte und Antworten", function () {
    const base = {
        start: 47,
        addend: 15,
        result: 62,
        nextTen: 50,
        toNextTen: 3,
        afterNextTen: 12
    };

    assert.deepStrictEqual(createSubtractionTenTask(base, 1), {
        text: "? - 15 = 47",
        answer: 62,
        hint: "Trick: Bei ? - 15 = 47 rechnest du 47 + 15."
    });

    assert.deepStrictEqual(createSubtractionTenTask(base, 2), {
        text: "62 - ? = 47",
        answer: 15,
        hint: "Gesuchte Zahl = 62 - 47. Rechne den Abstand zwischen 47 und 62."
    });

    assert.deepStrictEqual(createSubtractionTenTask(base, 3), {
        text: "62 - 15 = ?",
        answer: 47,
        hint: "Trick: Rechne 62 - 15."
    });
});

test("createTenTask erstellt eine Aufgabe mit Text, Antwort und Tipp", function () {
    const task = createTenTask();

    assert.strictEqual(typeof task.text, "string");
    assert.strictEqual(typeof task.answer, "number");
    assert.strictEqual(typeof task.hint, "string");
    assert.ok(task.text.includes("?"));
});


//--------------------
// Highscore-Screen
// -------------------

test("addHighscoreEntry - neuer Eintrag - sortiert nach Punkten und Zeit", function () {
    const oldScores = [
        { name: "Ben", points: 30, time: 20 },
        { name: "Cem", points: 50, time: 40 }
    ];
    const entry = { name: "Ada", points: 50, time: 25 };

    const scores = addHighscoreEntry(oldScores, entry);

    assert.deepStrictEqual(scores[0], entry);
    assert.deepStrictEqual(scores[1], oldScores[1]);
});

test("getBestScoreFromList - sortierte Rangliste - liefert beste Punktzahl", function () {
    const scores = [
        { name: "Ada", points: 80, time: 30 },
        { name: "Ben", points: 50, time: 20 }
    ];

    assert.strictEqual(getBestScoreFromList(scores), 80);
    assert.strictEqual(getBestScoreFromList([]), 0);
});

test("formatTime - Sekundenanzahl ueber einer Minute - liefert Minuten und zweistellige Sekunden", function () {
    assert.strictEqual(formatTime(61), "1:01");
});

console.log("Alle logic Tests bestanden.");
