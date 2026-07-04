const assert = require("assert");
const {
    loadHighscoreLists,
    saveHighscoreLists
} = require("./logicFunction");

function test(name, testFunction) {
    testFunction();
    console.log("JA - " + name);
}

function createFakeStorage() {
    const storage = {
        //Hier werden die Testdaten gespeichert.
        data: {}
    };

    storage.getItem = function (key) {
        if (this.data[key]) {
            return this.data[key];
        }
        return null;
    };

    storage.setItem = function (key, value) {
        this.data[key] = value;
    };

    //gibt den fertigen Fake-LocalStorage zurück
    return storage;
}

test("loadHighscoreLists liefert leere Ranglisten", function () {
    const storage = createFakeStorage();
    const lists = loadHighscoreLists(storage);

    assert.deepStrictEqual(lists, {
        einfach: [],
        mittel: [],
        schwer: []
    });
});

test("LocalStorage liefert gespeicherten Eintrag", function () {
    const storage = createFakeStorage();
    const lists = {
        einfach: [{ name: "Ada", points: 50, time: 30 }],
        mittel: [],
        schwer: []
    };

    const saved = saveHighscoreLists(storage, lists);
    const loadedLists = loadHighscoreLists(storage);

    assert.strictEqual(saved, true);
    assert.deepStrictEqual(loadedLists.einfach[0], {
        name: "Ada",
        points: 50,
        time: 30
    });
});
