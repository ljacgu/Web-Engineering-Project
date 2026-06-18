document.addEventListener("DOMContentLoaded", () => {

    const LIVES = 3;
    const PTS_CORRECT = 10;
    const WIN_PTS = 100;
    const NEXT_DELAY = 1200;
    const HS_KEY = "matheAbenteuerHS";
    const TIMER_SECS = { einfach: 30, mittel: 20, schwer: 15, extra: 10 };
    const ENEMIES   = { einfach: "👾", mittel: "🤖", schwer: "🐲", extra: "👹" };

    // Screens
    const startScreen = document.querySelector("#start-screen");
    const gameScreen  = document.querySelector("#game-screen");

    // Start screen
    const nameInput  = document.querySelector("#name-input");
    const charBtns   = document.querySelectorAll(".char-btn");
    const diffCards  = document.querySelectorAll(".diff-card");
    const startBtn   = document.querySelector("#start-btn");

    // Game screen
    const playerDisplay = document.querySelector("#player-display");
    const heartsEl      = document.querySelector("#hearts");
    const scoreEl       = document.querySelector("#score");
    const hsEl          = document.querySelector("#highscore");
    const enemyEl       = document.querySelector("#enemy-emoji");
    const hpFill        = document.querySelector("#hp-fill");
    const damagePop     = document.querySelector("#damage-pop");
    const timerEl       = document.querySelector("#timer-ring");
    const questionEl    = document.querySelector("#question");
    const choiceGrid    = document.querySelector("#choice-grid");
    const textMode      = document.querySelector("#text-mode");
    const textInput     = document.querySelector("#text-input");
    const checkBtn      = document.querySelector("#check-btn");
    const toggleModeBtn = document.querySelector("#toggle-mode-btn");
    const feedbackEl    = document.querySelector("#feedback");
    const newGameBtn    = document.querySelector("#new-game-btn");
    const backBtn       = document.querySelector("#back-btn");

    let selectedChar = "🚀";
    let selectedDiff = "einfach";
    let state = {};
    let timerInterval = null;
    let inputMode = "choice";
    let highscore = Number(localStorage.getItem(HS_KEY)) || 0;

    hsEl.textContent = highscore;

    // --- CHARACTER SELECTION ---
    charBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            charBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedChar = btn.dataset.char;
        });
    });

    // --- DIFFICULTY SELECTION ---
    diffCards.forEach(card => {
        card.addEventListener("click", () => {
            diffCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedDiff = card.dataset.diff;
        });
    });

    // --- TOGGLE INPUT MODE ---
    toggleModeBtn.addEventListener("click", () => {
        inputMode = inputMode === "choice" ? "text" : "choice";
        const isChoice = inputMode === "choice";
        choiceGrid.classList.toggle("hidden", !isChoice);
        textMode.classList.toggle("hidden", isChoice);
        toggleModeBtn.textContent = isChoice ? "⌨️ Lieber eintippen?" : "🎯 Antworten wählen?";
    });

    // --- START GAME ---
    startBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) { alert("Bitte gib deinen Heldennamen ein!"); return; }

        state = { name, diff: selectedDiff, pts: 0, lives: LIVES, answer: 0, monsterHp: 100 };

        document.body.className = `diff-${selectedDiff}`;
        playerDisplay.textContent = `${selectedChar} ${name}`;
        enemyEl.textContent = ENEMIES[selectedDiff];
        hpFill.style.width = "100%";
        scoreEl.textContent = 0;
        feedbackEl.textContent = "";
        newGameBtn.classList.add("hidden");
        checkBtn.disabled = false;
        updateHearts();

        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        generateQuestion();
    });

    // --- GENERATE QUESTION ---
    function generateQuestion() {
        let a, b, op;
        const d = state.diff;

        if (d === "einfach") {
            op = Math.random() > 0.5 ? "+" : "−";
            a = rand(6, 9); b = rand(5, 9);
            if (op === "−" && a < b) [a, b] = [b, a];
        } else if (d === "mittel") {
            op = Math.random() > 0.5 ? "×" : "÷";
            if (op === "×") { a = rand(1, 10); b = rand(1, 10); }
            else { b = rand(1, 10); a = b * rand(1, 10); }
        } else if (d === "schwer") {
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
        textInput.value = "";
        feedbackEl.textContent = "";

        const choices = makeChoices(state.answer);
        document.querySelectorAll(".choice-btn").forEach((btn, i) => {
            btn.textContent = choices[i];
            btn.className = "choice-btn";
            btn.disabled = false;
        });

        checkBtn.disabled = false;
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

    // --- ANSWER CHECK (text input) ---
    checkBtn.addEventListener("click", () => {
        if (textInput.value.trim() === "") {
            feedbackEl.textContent = "Bitte gib eine Zahl ein!";
            feedbackEl.style.color = "#e17055";
            return;
        }
        checkAnswer(Number(textInput.value));
    });

    textInput.addEventListener("keypress", e => {
        if (e.key === "Enter") checkBtn.click();
    });

    function checkAnswer(answer, clickedBtn = null) {
        stopTimer();
        document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
        checkBtn.disabled = true;

        if (answer === state.answer) {
            state.pts += PTS_CORRECT;
            scoreEl.textContent = state.pts;

            if (state.pts > highscore) {
                highscore = state.pts;
                localStorage.setItem(HS_KEY, highscore);
                hsEl.textContent = highscore;
            }

            state.monsterHp = Math.max(0, state.monsterHp - 10);
            hpFill.style.width = state.monsterHp + "%";

            if (clickedBtn) clickedBtn.classList.add("correct");
            showDamage("-10 💥");
            shakeEnemy();

            feedbackEl.textContent = "🎉 Richtig! Weiter so!";
            feedbackEl.style.color = "#00b894";
        } else {
            state.lives--;
            updateHearts();

            document.querySelectorAll(".choice-btn").forEach(b => {
                if (Number(b.textContent) === state.answer) b.classList.add("correct");
            });
            if (clickedBtn) clickedBtn.classList.add("wrong");

            feedbackEl.textContent = `❌ Fast! Richtig war: ${state.answer}`;
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
        const limit = TIMER_SECS[state.diff] || 30;
        let remaining = limit;
        timerEl.textContent = remaining;
        timerEl.className = "";

        timerInterval = setInterval(() => {
            remaining--;
            timerEl.textContent = remaining;
            timerEl.className = remaining <= 5 ? "danger" : remaining <= Math.ceil(limit * 0.4) ? "warn" : "";

            if (remaining <= 0) {
                stopTimer();
                state.lives--;
                updateHearts();
                feedbackEl.textContent = "⏰ Zeit abgelaufen! Ein Leben weg!";
                feedbackEl.style.color = "#d63031";

                if (state.lives <= 0) endGame(false);
                else setTimeout(generateQuestion, NEXT_DELAY);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerEl.className = "";
    }

    // --- HEARTS ---
    function updateHearts() {
        heartsEl.querySelectorAll(".heart").forEach((h, i) => {
            h.classList.toggle("lost", i >= state.lives);
        });
    }

    // --- ENEMY EFFECTS ---
    function shakeEnemy() {
        enemyEl.classList.add("shake");
        setTimeout(() => enemyEl.classList.remove("shake"), 350);
    }

    function showDamage(text) {
        damagePop.textContent = text;
        damagePop.classList.remove("hidden");
        damagePop.style.animation = "none";
        void damagePop.offsetHeight; // reflow to restart animation
        damagePop.style.animation = "";
        setTimeout(() => damagePop.classList.add("hidden"), 700);
    }

    // --- END GAME ---
    function endGame(won) {
        stopTimer();
        if (won) {
            feedbackEl.textContent = "🏆 Gewonnen! Du bist ein Mathe-Held!";
            feedbackEl.style.color = "#fdcb6e";
            enemyEl.textContent = "💀";
        } else {
            feedbackEl.textContent = "😢 Game Over! Versuch es nochmal!";
            feedbackEl.style.color = "#d63031";
        }
        newGameBtn.classList.remove("hidden");
    }

    // --- NAVIGATION ---
    newGameBtn.addEventListener("click", () => {
        stopTimer();
        document.body.className = "";
        gameScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        nameInput.value = "";
    });

    backBtn.addEventListener("click", () => {
        stopTimer();
        document.body.className = "";
        gameScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });

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
