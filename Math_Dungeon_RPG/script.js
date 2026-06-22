document.addEventListener("DOMContentLoaded", () => {

    const LIVES = 3;
    const PTS_CORRECT = 10;
    const WIN_PTS = 100;
    const NEXT_DELAY = 1200;
    const HS_LIST_KEY = "matheAbenteuerHighscores";
    const HIGHSCORE_LEVELS = ["einfach", "mittel", "schwer"];
    const MAX_RANKING_PLACES = 5;
    const TIMER_SECS = { einfach: 30, mittel: 20, schwer: 15, zehner: 30 };
    const ENEMIES = {
        einfach: "Bilder/Wald-Pilzmonster.png",
        mittel: "Bilder/Wald-Pilzmonster.png",
        schwer: "Bilder/Wald-Pilzmonster.png",
        zehner: "Bilder/Wald-Pilzmonster.png"
    };

    const HERO_IMAGES = {
        Ritter: "Bilder/Char-1.png",
        Paladin: "Bilder/Char-2.png",
        Magier: "Bilder/Char-3.png",
        Samurai: "Bilder/Char-4.png"
    };

    // Screens
    const startScreen = document.querySelector("#start-screen");
    const gameScreen  = document.querySelector("#game-screen");
    const highscoreScreen = document.querySelector("#highscore-screen");

    // Start screen
    const nameInput  = document.querySelector("#name-input");
    const charBtns   = document.querySelectorAll(".char-btn");
    const levelCards = document.querySelectorAll("#start-screen .level-card");
    const highscoreLevelCards = document.querySelectorAll(".highscore-level-card");
    const startBtn   = document.querySelector("#start-btn");
    const rankingBtn = document.querySelector("#ranking-btn");

    // Game screen
    const playerDisplay = document.querySelector("#player-display");
    const lifeDisplay   = document.querySelector("#life-display");
    const scoreEl       = document.querySelector("#score");
    const hsEl          = document.querySelector("#highscore");
    const enemyEl       = document.querySelector("#enemy-image");
    const heroImage     = document.querySelector("#hero-image");
    const monsterHpBar  = document.querySelector("#monster-hp");
    const damageEl      = document.querySelector("#damage");
    const countdownEl   = document.querySelector("#countdown");
    const questionEl    = document.querySelector("#question");
    const choiceGrid    = document.querySelector("#choice-grid");
    const feedbackEl    = document.querySelector("#feedback");
    const newGameBtn    = document.querySelector("#new-game-btn");
    const showRankingEndBtn = document.querySelector("#show-ranking-end-btn");
    const backBtn       = document.querySelector("#back-btn");
    const highscoreBackBtn = document.querySelector("#highscore-back-btn");
    const highscoreTableBody = document.querySelector("#highscore-table-body");

    let selectedChar = "Ritter";
    let selectedLevel = "einfach";
    let selectedHighscoreLevel = "einfach";
    let state = {};
    let timerInterval = null;
    let highscore = getBestScore(selectedLevel);

    hsEl.textContent = highscore;

    // --- CHARACTER SELECTION ---
    charBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            charBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedChar = btn.dataset.char;
        });
    });

    // --- LEVEL SELECTION ---
    levelCards.forEach(card => {
        card.addEventListener("click", () => {
            levelCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedLevel = card.dataset.level;
            highscore = getBestScore(selectedLevel);
            hsEl.textContent = highscore;
        });
    });

    highscoreLevelCards.forEach(card => {
        card.addEventListener("click", () => {
            selectHighscoreLevel(card.dataset.level);
            renderHighscores();
        });
    });

    // --- START GAME ---
    startBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) { alert("Bitte gib deinen Heldennamen ein!"); return; }

        state = {
            name,
            level: selectedLevel,
            pts: 0,
            lives: LIVES,
            answer: 0,
            monsterHp: 100,
            startedAt: Date.now(),
            saved: false
        };

        document.body.className = `level-${selectedLevel}`;
        playerDisplay.textContent = `${selectedChar} ${name}`;
        heroImage.src = HERO_IMAGES[selectedChar];
        heroImage.alt = selectedChar;
        enemyEl.src = ENEMIES[selectedLevel];
        enemyEl.style.opacity = "1";
        heroImage.classList.remove("fall-out", "hit");
        enemyEl.classList.remove("fall-out", "hit");
        monsterHpBar.value = 100;
        scoreEl.textContent = 0;
        highscore = getBestScore(selectedLevel);
        hsEl.textContent = highscore;
        feedbackEl.textContent = "";
        newGameBtn.classList.add("hidden");
        showRankingEndBtn.classList.add("hidden");
        updateLifeDisplay();

        startScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        generateQuestion();
    });

    rankingBtn.addEventListener("click", () => {
        showHighscoreScreen(selectedLevel);
    });

    // --- GENERATE QUESTION ---
    function generateQuestion() {
        let a, b, op;
        const level = state.level;

        if (level === "einfach") {
            op = Math.random() > 0.5 ? "+" : "−";
            a = rand(6, 9); b = rand(5, 9);
            if (op === "−" && a < b) [a, b] = [b, a];
        } else if (level === "mittel") {
            op = Math.random() > 0.5 ? "×" : "÷";
            if (op === "×") { a = rand(1, 10); b = rand(1, 10); }
            else { b = rand(1, 10); a = b * rand(1, 10); }
        } else if (level === "schwer") {
            op = pick(["+", "−", "×", "÷"]);
            if (op === "+") { a = rand(1, 100); b = rand(1, 100); }
            else if (op === "−") { a = rand(10, 100); b = rand(1, a); }
            else if (op === "×") { a = rand(1, 12); b = rand(1, 12); }
            else { b = rand(1, 12); a = b * rand(1, 12); }
        } else {
            op = pick(["+", "−", "×", "÷"]);
            if (op === "+") { a = rand(1, 200); b = rand(1, 200); }
            else if (op === "−") { a = rand(10, 200); b = rand(1, a); }
            else if (op === "×") { a = rand(1, 20); b = rand(1, 20); }
            else { b = rand(1, 20); a = b * rand(1, 20); }
        }

        if (op === "+") state.answer = a + b;
        else if (op === "−") state.answer = a - b;
        else if (op === "×") state.answer = a * b;
        else state.answer = a / b;

        questionEl.textContent = `${a} ${op} ${b} = ?`;
        feedbackEl.textContent = "";

        const choices = makeChoices(state.answer);
        document.querySelectorAll(".choice-btn").forEach((btn, i) => {
            btn.textContent = choices[i];
            btn.className = "choice-btn";
            btn.disabled = false;
        });

        startTimer();
    }

    // --- GENERATE MULTIPLE CHOICE OPTIONS ---
    function makeChoices(correct) {
        const set = new Set([correct]);
        const spread = Math.max(5, Math.ceil(Math.abs(correct) * 0.25));
        let tries = 0;
        while (set.size < 4 && tries < 60) {
            tries++;
            const offset = rand(-spread, spread);
            const w = correct + offset;
            if (w !== correct && w >= 0) set.add(w);
        }
        let n = 1;
        while (set.size < 4) { if (!set.has(correct + n)) set.add(correct + n); n++; }
        return shuffle([...set]);
    }

    // --- ANSWER CHECK (choice buttons) ---
    choiceGrid.addEventListener("click", e => {
        const btn = e.target.closest(".choice-btn");
        if (!btn || btn.disabled) return;
        checkAnswer(Number(btn.textContent), btn);
    });

    function checkAnswer(answer, clickedBtn = null) {
        stopTimer();
        document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);

        if (answer === state.answer) {
            state.pts += PTS_CORRECT;
            scoreEl.textContent = state.pts;

            if (state.pts > highscore) {
                highscore = state.pts;
                hsEl.textContent = highscore;
            }

            state.monsterHp = Math.max(0, state.monsterHp - 10);
            monsterHpBar.value = state.monsterHp;

            if (clickedBtn) clickedBtn.classList.add("correct");
            showDamage("-10 HP");
            enemyGetsHit();

            feedbackEl.textContent = "Richtig! Weiter so!";
            feedbackEl.style.color = "#00b894";
        } else {
            state.lives--;
            updateLifeDisplay();

            document.querySelectorAll(".choice-btn").forEach(b => {
                if (Number(b.textContent) === state.answer) b.classList.add("correct");
            });
            if (clickedBtn) clickedBtn.classList.add("wrong");
            heroGetsHit();

            feedbackEl.textContent = `Fast! Richtig war: ${state.answer}`;
            feedbackEl.style.color = "#d63031";
        }

        if (state.pts >= WIN_PTS) {
            endGame(true);
        } else if (state.lives <= 0) {
            endGame(false);
        } else {
            setTimeout(generateQuestion, NEXT_DELAY);
        }
    }

    // --- TIMER ---
    function startTimer() {
        stopTimer();
        const limit = TIMER_SECS[state.level] || 30;
        let remaining = limit;
        countdownEl.textContent = remaining;
        countdownEl.className = "";

        timerInterval = setInterval(() => {
            remaining--;
            countdownEl.textContent = remaining;
            countdownEl.className = remaining <= 5 ? "danger" : remaining <= Math.ceil(limit * 0.4) ? "warn" : "";

            if (remaining <= 0) {
                stopTimer();
                state.lives--;
                updateLifeDisplay();
                heroGetsHit();
                feedbackEl.textContent = "Zeit abgelaufen! Leben weniger!";
                feedbackEl.style.color = "#d63031";

                if (state.lives <= 0) endGame(false);
                else setTimeout(generateQuestion, NEXT_DELAY);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        countdownEl.className = "";
    }

    // --- LEBENSANZEIGE ---
    function updateLifeDisplay() {
        const lives = Math.max(0, Math.min(LIVES, state.lives));
        lifeDisplay.src = lives === 0 ? "Bilder/leben0.png" : `Bilder/Leben${lives}.png`;
        lifeDisplay.alt = `${lives} Leben`;
    }

    // --- HIT EFFECTS ---
    function enemyGetsHit() {
        playHitAnimation(enemyEl);
    }

    function heroGetsHit() {
        playHitAnimation(heroImage);
    }

    function playHitAnimation(characterEl) {
        characterEl.classList.add("hit");
        setTimeout(() => characterEl.classList.remove("hit"), 350);
    }

    function enemyFallsDown() {
        playFallAnimation(enemyEl);
    }

    function heroFallsDown() {
        playFallAnimation(heroImage);
    }

    function playFallAnimation(characterEl) {
        playHitAnimation(characterEl);
        setTimeout(() => characterEl.classList.add("fall-out"), 350);
    }

    function showDamage(text) {
        damageEl.textContent = text;
        damageEl.classList.remove("hidden");
        damageEl.style.animation = "none";
        void damageEl.offsetHeight; // reflow to restart animation
        damageEl.style.animation = "";
        setTimeout(() => damageEl.classList.add("hidden"), 700);
    }

    // --- END GAME ---
    function endGame(won) {
        stopTimer();
        saveHighscore();
        if (won) {
            feedbackEl.textContent = "Gewonnen! Du bist ein Mathe-Held!";
            feedbackEl.style.color = "#fdcb6e";
            enemyFallsDown();
        } else {
            feedbackEl.textContent = "Game Over! Versuch es nochmal!";
            feedbackEl.style.color = "#d63031";
            heroFallsDown();
        }
        newGameBtn.classList.remove("hidden");
        showRankingEndBtn.classList.remove("hidden");
    }

    // --- NAVIGATION ---
    newGameBtn.addEventListener("click", () => {
        stopTimer();
        document.body.className = "";
        gameScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        nameInput.value = "";
    });

    showRankingEndBtn.addEventListener("click", () => {
        showHighscoreScreen(state.level || selectedLevel);
    });

    backBtn.addEventListener("click", () => {
        stopTimer();
        document.body.className = "";
        gameScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    highscoreBackBtn.addEventListener("click", () => {
        document.body.className = "";
        highscoreScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    // --- HIGHSCORES ---
    function showHighscoreScreen(level) {
        stopTimer();
        document.body.className = "";
        selectHighscoreLevel(HIGHSCORE_LEVELS.includes(level) ? level : "einfach");
        renderHighscores();
        startScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        highscoreScreen.classList.remove("hidden");
    }

    function selectHighscoreLevel(level) {
        selectedHighscoreLevel = level;
        highscoreLevelCards.forEach(card => {
            card.classList.toggle("selected", card.dataset.level === level);
        });
    }

    function loadHighscoreLists() {
        const emptyLists = { einfach: [], mittel: [], schwer: [] };

        try {
            const storedLists = JSON.parse(localStorage.getItem(HS_LIST_KEY)) || {};
            const lists = { ...emptyLists, ...storedLists };

            HIGHSCORE_LEVELS.forEach(level => {
                if (!Array.isArray(lists[level])) lists[level] = [];
            });

            return lists;
        } catch {
            return emptyLists;
        }
    }

    function saveHighscoreLists(lists) {
        localStorage.setItem(HS_LIST_KEY, JSON.stringify(lists));
    }

    function saveHighscore() {
        if (state.saved || !HIGHSCORE_LEVELS.includes(state.level)) return;

        const lists = loadHighscoreLists();
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
        const entry = {
            name: state.name,
            points: state.pts,
            time: elapsedSeconds
        };

        lists[state.level] = [...lists[state.level], entry]
            .sort((a, b) => b.points - a.points || a.time - b.time)
            .slice(0, MAX_RANKING_PLACES);

        saveHighscoreLists(lists);
        state.saved = true;
        highscore = getBestScore(state.level);
        hsEl.textContent = highscore;
    }

    function getBestScore(level) {
        const scores = loadHighscoreLists()[level] || [];

        return scores[0]?.points || 0;
    }

    function renderHighscores() {
        const entries = loadHighscoreLists()[selectedHighscoreLevel] || [];
        highscoreTableBody.innerHTML = "";

        if (entries.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = '<td colspan="4" class="empty-highscore">Noch keine Einträge</td>';
            highscoreTableBody.appendChild(row);
            return;
        }

        entries.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td>${entry.points}</td>
                <td>${formatTime(entry.time)}</td>
            `;
            highscoreTableBody.appendChild(row);
        });
    }

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

    // --- HELPERS ---
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
});
