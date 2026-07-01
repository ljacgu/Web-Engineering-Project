function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

const TEN_STEP = 10;
function getNextTen(number) {
    return Math.floor(number / TEN_STEP) * TEN_STEP + TEN_STEP;
}

function createAdditionTenTask(base, questionPosition) {
    const hint = `${base.start} + ${base.toNextTen} = ${base.nextTen}, dann + ${base.afterNextTen} = ${base.result}`;

    if (questionPosition === 1) {
        return { text: `? + ${base.addend} = ${base.result}`, answer: base.start, hint };
    }

    if (questionPosition === 2) {
        return { text: `${base.start} + ? = ${base.result}`, answer: base.addend, hint };
    }

    return { text: `${base.start} + ${base.addend} = ?`, answer: base.result, hint };
}

function createSubtractionTenTask(base, questionPosition) {
    const hint = `${base.result} - ${base.afterNextTen} = ${base.nextTen}, dann - ${base.toNextTen} = ${base.start}`;

    if (questionPosition === 1) {
        return { text: `? - ${base.addend} = ${base.start}`, answer: base.result, hint };
    }

    if (questionPosition === 2) {
        return { text: `${base.result} - ? = ${base.start}`, answer: base.addend, hint };
    }

    return { text: `${base.result} - ${base.addend} = ?`, answer: base.start, hint };
}

const HIGHSCORE_SAVE_KEY = "matheAbenteuerHighscores";
const HIGHSCORE_LEVELS = ["einfach", "mittel", "schwer"];
const MAX_RANKING_PLACES = 5;

function createEmptyHighscoreLists() {
    return { einfach: [], mittel: [], schwer: [] };
}

function loadHighscoreLists(storage) {
    const emptyLists = createEmptyHighscoreLists();

    try {
        const storedLists = JSON.parse(storage.getItem(HIGHSCORE_SAVE_KEY)) || {};
        const lists = { ...emptyLists, ...storedLists };

        HIGHSCORE_LEVELS.forEach(level => {
            if (!Array.isArray(lists[level])) {
                lists[level] = [];
            }
        });

        return lists;
    } catch {
        return emptyLists;
    }
}

function saveHighscoreLists(storage, lists) {
    try {
        storage.setItem(HIGHSCORE_SAVE_KEY, JSON.stringify(lists));
        return true;
    } catch {
        return false;
    }
}

function addHighscoreEntry(lists, level, entry) {
    if (!HIGHSCORE_LEVELS.includes(level)) {
        return lists;
    }

    lists[level] = [...lists[level], entry]
        .sort((a, b) => b.points - a.points || a.time - b.time)
        .slice(0, MAX_RANKING_PLACES);

    return lists;
}

module.exports = {
    formatTime,
    escapeHtml,
    getNextTen,
    createAdditionTenTask,
    createSubtractionTenTask,
    loadHighscoreLists,
    saveHighscoreLists,
    addHighscoreEntry
};
