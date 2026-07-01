const assert = require("assert");

const {
    formatTime,
    escapeHtml,
    getNextTen,
    createAdditionTenTask,
    createSubtractionTenTask,
    loadHighscoreLists,
    saveHighscoreLists,
    addHighscoreEntry
} = require("../LogicForTests");

// Einfacher eigener Test-Runner: fuehrt einen Test aus und zeigt OK oder FEHLER an.
function test(name, fn) {
    try {
        fn();
        console.log(`OK: ${name}`);
    } catch (error) {
        console.error(`FEHLER: ${name}`);
        throw error;
    }
}

// Test 1: Prueft die Zeitformatierung fuer normale und einstellige Sekunden.
test("formatTime wandelt Sekunden in Minuten:Sekunden um", () => {
    assert.strictEqual(formatTime(61), "1:01");
    assert.strictEqual(formatTime(9), "0:09");
});

// Test 2: Prueft, dass HTML-Sonderzeichen sicher maskiert werden.
test("escapeHtml maskiert gefaehrliche HTML-Zeichen", () => {
    assert.strictEqual(
        escapeHtml(`<img src="x" onerror='alert(1)'> &`),
        "&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp;"
    );
});

// Test 3: Prueft die Berechnung des naechsten Zehners.
test("getNextTen berechnet den naechsten Zehner", () => {
    assert.strictEqual(getNextTen(71), 80);
    assert.strictEqual(getNextTen(80), 90);
});

// Zusatztest: Prueft eine Plus-Aufgabe fuer den 10er-Uebergang.
test("createAdditionTenTask erzeugt passende Aufgabe und Loesung", () => {
    const base = {
        start: 27,
        addend: 8,
        result: 35,
        nextTen: 30,
        toNextTen: 3,
        afterNextTen: 5
    };

    const task = createAdditionTenTask(base, 2);

    assert.strictEqual(task.text, "27 + ? = 35");
    assert.strictEqual(task.answer, 8);
    assert.strictEqual(task.hint, "27 + 3 = 30, dann + 5 = 35");
});

// Zusatztest: Prueft eine Minus-Aufgabe fuer den 10er-Uebergang.
test("createSubtractionTenTask erzeugt passende Aufgabe und Loesung", () => {
    const base = {
        start: 27,
        addend: 8,
        result: 35,
        nextTen: 30,
        toNextTen: 3,
        afterNextTen: 5
    };

    const task = createSubtractionTenTask(base, 3);

    assert.strictEqual(task.text, "35 - 8 = ?");
    assert.strictEqual(task.answer, 27);
    assert.strictEqual(task.hint, "35 - 5 = 30, dann - 3 = 27");
});

// Integrationstest: Prueft das Zusammenspiel von Highscore-Laden, Speichern und Lesen.
test("Highscore wird in LocalStorage gespeichert und wieder geladen", () => {
    const fakeLocalStorage = {
        daten: {},
        getItem(key) {
            return this.daten[key] || null;
        },
        setItem(key, value) {
            this.daten[key] = value;
        }
    };

    let lists = loadHighscoreLists(fakeLocalStorage);

    lists = addHighscoreEntry(lists, "einfach", {
        name: "TestHeld",
        points: 80,
        time: 42
    });

    const wasSaved = saveHighscoreLists(fakeLocalStorage, lists);

    const loadedLists = loadHighscoreLists(fakeLocalStorage);
    const savedEntry = loadedLists.einfach[0];

    assert.strictEqual(wasSaved, true);
    assert.strictEqual(savedEntry.name, "TestHeld");
    assert.strictEqual(savedEntry.points, 80);
    assert.strictEqual(savedEntry.time, 42);
});

// Fehlerfall: Wenn LocalStorage beim Speichern einen Fehler wirft, stuerzt die Funktion nicht ab.
test("Highscore-Speichern gibt false zurueck, wenn LocalStorage blockiert ist", () => {
    const blockedLocalStorage = {
        setItem() {
            throw new Error("LocalStorage ist blockiert");
        }
    };

    const wasSaved = saveHighscoreLists(blockedLocalStorage, {
        einfach: [],
        mittel: [],
        schwer: []
    });

    assert.strictEqual(wasSaved, false);
});
