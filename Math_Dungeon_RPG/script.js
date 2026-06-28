//warten bis alle HTML-Elemente geladen
document.addEventListener("DOMContentLoaded", () => {


    //-----------------------
    // allgemeine Einstellung
    // -----------------------

    //eigenes Spiel
    const LIVES = 3;        //3 Versuche
    const PTS_CORRECT = 10; // 10 Punkte für richtige Antwort
    const WIN_PTS = 100;    // 100 Punkte gehabt dann endGame True
    const NEXT_DELAY = 1500;//Wartezeit bis zur nächsten Aufgabe

    const HIGHSCORE_LEVELS = ["einfach", "mittel", "schwer"]; //Highscores einfach, mittel und schwer
    const MAX_RANKING_PLACES = 5; // Nur die beste 5 wird angezeigt
    const HIGHSCORE_SAVE_KEY = "matheAbenteuerHighscores"; //Localstorage Name

    const TIMER_SECS = { einfach: 30, mittel: 20, schwer: 15, zehner: 30 }; //Zeitbegrenzung

    const ENEMIES = {
        einfach: "Bilder/Wald-Pilzmonster.png",
        mittel: "Bilder/robot.png",
        schwer: "Bilder/monster.png",
        zehner: "Bilder/Wald-Pilzmonster.png"
    };

    const HERO_IMAGES = {
        Ritter: "Bilder/Char-1.png",
        Paladin: "Bilder/Char-2.png",
        Magier: "Bilder/Char-3.png",
        Samurai: "Bilder/Char-4.png"
    };

    //Pflichtaufgabe 10Übergang
    const ZAHLENRAUM_MIN = 1;   //Zahlbegrenzung
    const ZAHLENRAUM_MAX = 100; //Zahlbegrenzung
    const TEN_STEP = 10;        //Zehnerschritt
    const TEN_ADDEND_MAX = 20;
    const TEN_PTS_WITHOUT_TIP = 10; //10 Punkte ohne Tipp
    const TEN_PTS_WITH_TIP = 5;     //5 Punkte mit Tipp
    const TEN_WIN_PTS = 100;        //100 Punkte erreicht dann finishGame

    //-----------------------
    // Screen Elemente
    // -----------------------

    // --- SCREEN ELEMENTS ---
    const startScreen = document.querySelector("#start-screen");
    const gameScreen  = document.querySelector("#game-screen");
    const tenScreen = document.querySelector("#ten-screen");
    const highscoreScreen = document.querySelector("#highscore-screen");

    // --- STARTSCREEN ELEMENTS ---
    const nameInput  = document.querySelector("#name-input");
    const charBtns   = document.querySelectorAll(".char-btn");
    const levelAreas = document.querySelectorAll("#start-screen .level-area");
    const startBtn   = document.querySelector("#start-btn");
    const rankingBtn = document.querySelector("#ranking-btn");

    // --- NORMALER SPIELSCREEN ELEMENTS ---
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

    // --- HIGHSCORE-SCREEN ELEMENTS ---
    const highscoreLevelAreas = document.querySelectorAll(".highscore-level-area");
    const highscoreBackBtn = document.querySelector("#highscore-back-btn");
    const highscoreTableBody = document.querySelector("#highscore-table-body");

    // --- 10ER-ÜBERGANG-SCREEN ELEMENTS ---
    const tenScoreEl = document.querySelector("#ten-score");
    const tenQuestionEl = document.querySelector("#ten-question");
    const tenAnswerInput = document.querySelector("#ten-answer");
    const tenSubmitBtn = document.querySelector("#ten-submit-btn");
    const tenTipBtn = document.querySelector("#ten-tip-btn");
    const tenTipEl = document.querySelector("#ten-tip");
    const tenFeedbackEl = document.querySelector("#ten-feedback");
    const tenRestartBtn = document.querySelector("#ten-restart-btn");
    const tenBackBtn = document.querySelector("#ten-back-btn");


    let selectedChar = "Ritter";
    let selectedLevel = "einfach";
    let selectedHighscoreLevel = "einfach";
    let state = {};     // Speicher aktuellen Zustand
    let timerInterval = null;

    let highscore = getBestScore(selectedLevel); //Highscore von bestimmte Level
    hsEl.textContent = highscore;               //Highscrore schreiben

    let tenState = {};  //Speicher aktuellen Zustand 10 Übergag


    //--------------------------
    // Startscreen
    // -------------------------

    // Figurenauswahl: Figur anklickt,die alte Auswahl entfernen,neue markieren und speichern
    charBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            charBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedChar = btn.dataset.char;
        });
    });

    // Levelauswahl: Level anklickt,die alte Auswahl entfernen,neue markieren und speichern
    levelAreas.forEach(area => {
        area.addEventListener("click", () => {
            levelAreas.forEach(a => a.classList.remove("selected"));
            area.classList.add("selected");
            selectedLevel = area.dataset.level;
        });
    });

    //  START BUTTON;
    startBtn.addEventListener("click", () => {
        startSelectedGame();
    });

    //Rangliste button
    rankingBtn.addEventListener("click", () => {
        showHighscoreScreen(selectedLevel);
    });

    //unterscheiden: ob matheSpiel oder 10ner Übergang ausgewält wird
    function startSelectedGame() {
        const name = nameInput.value.trim(); //name holen, unnötige Leerzeichen entfernen
        if (!name) { alert("Bitte gib deinen Heldennamen ein!"); return; }

        if (selectedLevel === "zehner") {
            startTenGame(name);
            return;
        }

        startGame(name);
    }

    //normales Mathespiel
    function startGame(name) {
        state = {
            name,
            level: selectedLevel,
            pts: 0,
            lives: LIVES, //3 lebens
            answer: 0,    //Platzhalter für die richtige Lösung
            monsterHp: 100,
            startedAt: Date.now(),  //später Spielzeit für Rangliste
            saved: false            //wird Status gespeichert?
        };

        //Initialisierung
        document.body.className = `level-${selectedLevel}`; //Hintergrund wechsel
        playerDisplay.textContent = `${selectedChar} ${name}`; //Spielleiste oben

        heroImage.src = HERO_IMAGES[selectedChar];
        heroImage.alt = selectedChar;
        enemyEl.src = ENEMIES[selectedLevel];
        monsterHpBar.value = 100;

        scoreEl.textContent = 0;
        highscore = getBestScore(selectedLevel);
        hsEl.textContent = highscore;

        feedbackEl.textContent = "";
        updateLifeDisplay(); //3,2,1 oder 0 Leben

        heroImage.classList.remove("fall-out", "hit");//notwendig, sonst ab zweites Spiel sichbar
        enemyEl.classList.remove("fall-out", "hit");//notwendig, sonst ab zweites Spiel sichbar

        //von startScreen zu gameScreen
        startScreen.classList.add("hidden");
        tenScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");

        //anzeigen nur wenn Spiel vorbei ist
        newGameBtn.classList.add("hidden");         //notwendig, sonst ab zweites Spiel sichbar
        showRankingEndBtn.classList.add("hidden");  //notwendig, sonst ab zweites Spiel sichbar

        generateQuestion();
    }



    //----------------------
    // Spielscreen
    // ---------------------

    //Rechenops zufällig auswählenm: Zufallszahl zwischen 1 0 mit länge mul und dan abrunden ->index
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Fragegenerieren (nicht für 10ner Übergang)
    function generateQuestion() {
        let a, b, op;
        const level = state.level;

        //Level Einfach + -
        if (level === "einfach") {
            op = pick(["+", "−"]);
            if (op === "+") {
                //Zahlraum 1-100
                a = rand(1, 99);
                b = rand(1, 100 - a);
            } else {
                //a >b bei -
                a = rand(1, 100);
                b = rand(1, a);
            }

        //Level Mittel x /
        } else if (level === "mittel") {
            op = pick(["×", "÷"]);
            if (op === "×") {
                //Zahlraum so damit sinnvolle Aufgaben generiert werden
                a = rand(2, 10);
                b = rand(2, Math.floor(100 / a));
            } else {
                // a ist immer viel fach von b und innerhalb Zahlraum
                b = rand(2, 10);
                a = b * rand(2, Math.floor(100 / b));
            }

        //Level Schwer
        //Einfach Mittel kombinieren
        } else if (level === "schwer") {
            op = pick(["+", "−", "×", "÷"]);
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
                b = rand(2, 20);
                a = b * rand(2, Math.floor(100 / b));
            }
        }

        //richtige Lösung berechnen
        if (op === "+") state.answer = a + b;
        else if (op === "−") state.answer = a - b;
        else if (op === "×") state.answer = a * b;
        else state.answer = a / b;

        //Fragen anzeigen und vorherige Feedback bereinigen
        questionEl.textContent = `${a} ${op} ${b} = ?`;
        feedbackEl.textContent = "";

        //erstelle liste mit 4 Möglichkeiten
        const choices = makeChoices(state.answer);

        //Jeder Button bekommt eine Antwort aus der choice
        document.querySelectorAll(".choice-btn").forEach((btn, i) => {
            btn.textContent = choices[i];
            btn.className = "choice-btn";
            btn.disabled = false;
        });

        startTimer();
    }

    // --- NORMALER SPIELSCREEN: MULTIPLE CHOICE OPTIONS ---
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

    // --- NORMALER SPIELSCREEN: ANSWER CHECK ---
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

    // --- NORMALER SPIELSCREEN: TIMER ---
    function startTimer() {
        stopTimer();
        const limit = TIMER_SECS[state.level] || 30;
        let remaining = limit;
        countdownEl.textContent = remaining;

        timerInterval = setInterval(() => {
            remaining--;
            countdownEl.textContent = remaining;

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
    }

    // --- NORMALER SPIELSCREEN: LEBENSANZEIGE ---
    function updateLifeDisplay() {
        const lives = Math.max(0, Math.min(LIVES, state.lives));
        lifeDisplay.src = lives === 0 ? "Bilder/leben0.png" : `Bilder/Leben${lives}.png`;
        lifeDisplay.alt = `${lives} Leben`;
    }

    // --- NORMALER SPIELSCREEN: HIT AND FALL EFFECTS ---
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

    // --- NORMALER SPIELSCREEN: END GAME ---
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

    // --- SCREEN NAVIGATION ---
    newGameBtn.addEventListener("click", () => {
        stopTimer();
        document.body.className = "";
        gameScreen.classList.add("hidden");
        tenScreen.classList.add("hidden");
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
        tenScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    highscoreBackBtn.addEventListener("click", () => {
        document.body.className = "";
        highscoreScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        tenScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    tenSubmitBtn.addEventListener("click", checkTenAnswer);

    tenAnswerInput.addEventListener("keydown", e => {
        if (e.key === "Enter") checkTenAnswer();
    });

    tenTipBtn.addEventListener("click", () => {
        tenState.hintUsed = true;
        tenTipEl.textContent = tenState.hint;
        tenTipEl.classList.remove("hidden");
        tenTipBtn.disabled = true;
    });

    tenRestartBtn.addEventListener("click", () => {
        startTenGame(tenState.name || nameInput.value.trim() || "Held");
    });

    tenBackBtn.addEventListener("click", () => {
        document.body.className = "";
        tenScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

    // --- HIGHSCORE-SCREEN ---

    //Highscore zur passender Rangliste anzeigen
    highscoreLevelAreas.forEach(area => {
        area.addEventListener("click", () => {
            selectHighscoreLevel(area.dataset.level);
            renderHighscores();
        });
    });

    function showHighscoreScreen(level) {
        stopTimer();
        document.body.className = "";
        selectHighscoreLevel(HIGHSCORE_LEVELS.includes(level) ? level : "einfach");
        renderHighscores();
        startScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        tenScreen.classList.add("hidden");
        highscoreScreen.classList.remove("hidden");
    }



    // --- 10ER-ÜBERGANG-SCREEN ---
    function startTenGame(name) {
        stopTimer();
        document.body.className = "level-zehner";
        tenState = { name, score: 0, answer: 0, hint: "", hintUsed: false, finished: false };
        tenScoreEl.textContent = tenState.score;
        tenRestartBtn.classList.add("hidden");
        tenFeedbackEl.textContent = "";
        tenTipEl.textContent = "";
        tenTipEl.classList.add("hidden");
        tenAnswerInput.disabled = false;
        tenSubmitBtn.disabled = false;
        tenTipBtn.disabled = false;

        startScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        tenScreen.classList.remove("hidden");
        generateTenQuestion();
    }

    function generateTenQuestion() {
        const task = createTenTask();
        renderTenQuestion(task);
    }

    function renderTenQuestion(task) {
        tenState.answer = task.answer;
        tenState.hint = task.hint;
        tenState.hintUsed = false;
        tenQuestionEl.textContent = task.text;
        tenAnswerInput.value = "";
        tenTipEl.textContent = "";
        tenTipEl.classList.add("hidden");
        tenTipBtn.disabled = false;
        tenFeedbackEl.textContent = "";
        tenAnswerInput.focus();
    }

    function createTenTask() {
        const base = createTenTransitionBase();
        const op = pick(["+", "−"]);
        const questionPosition = rand(1, 3);

        if (op === "+") return createAdditionTenTask(base, questionPosition);
        return createSubtractionTenTask(base, questionPosition);
    }

    function createTenTransitionBase() {
        while (true) {
            const start = rand(ZAHLENRAUM_MIN, ZAHLENRAUM_MAX - TEN_STEP - 1);
            const nextTen = getNextTen(start);
            const toNextTen = nextTen - start;
            const maxAddend = Math.min(TEN_ADDEND_MAX, ZAHLENRAUM_MAX - start);

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

    function checkTenAnswer() {
        if (tenState.finished) return;

        const inputValue = tenAnswerInput.value.trim();
        if (!inputValue) {
            tenFeedbackEl.textContent = "Bitte gib eine Antwort ein.";
            tenFeedbackEl.style.color = "#d63031";
            return;
        }

        const answer = Number(inputValue);
        if (!Number.isInteger(answer)) {
            tenFeedbackEl.textContent = "Bitte gib eine ganze Zahl ein.";
            tenFeedbackEl.style.color = "#d63031";
            return;
        }

        if (answer !== tenState.answer) {
            tenFeedbackEl.textContent = "Leider falsch. Versuch es nochmal!";
            tenFeedbackEl.style.color = "#d63031";
            tenAnswerInput.select();
            return;
        }

        const points = tenState.hintUsed ? TEN_PTS_WITH_TIP : TEN_PTS_WITHOUT_TIP;
        tenState.score += points;
        tenScoreEl.textContent = tenState.score;
        tenFeedbackEl.textContent = tenState.hintUsed ? "Richtig! Du hast einen Tipp gebraucht." : "Super, Richtig!";
        tenFeedbackEl.style.color = "#00b894";

        if (tenState.score >= TEN_WIN_PTS) {
            finishTenGame();
        } else {
            setTimeout(generateTenQuestion, NEXT_DELAY);
        }
    }

    function finishTenGame() {
        tenState.finished = true;
        tenQuestionEl.textContent = "Gewonnen!";
        tenFeedbackEl.textContent = "Du hast den 10er-Übergang geschafft!";
        tenFeedbackEl.style.color = "#00b894";
        tenAnswerInput.disabled = true;
        tenSubmitBtn.disabled = true;
        tenTipBtn.disabled = true;
        tenRestartBtn.classList.remove("hidden");
    }

    function getNextTen(number) {
        return Math.floor(number / TEN_STEP) * TEN_STEP + TEN_STEP;
    }

    function selectHighscoreLevel(level) {
        selectedHighscoreLevel = level;
        highscoreLevelAreas.forEach(area => {
            area.classList.toggle("selected", area.dataset.level === level);
        });
    }

    function loadHighscoreLists() {
        const emptyLists = { einfach: [], mittel: [], schwer: [] };

        try {
            const storedLists = JSON.parse(localStorage.getItem(HIGHSCORE_SAVE_KEY)) || {};
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
        localStorage.setItem(HIGHSCORE_SAVE_KEY, JSON.stringify(lists));
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


    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
});
