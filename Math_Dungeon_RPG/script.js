    //-----------------------
    // allgemeine Einstellung
    // -----------------------

    //eigenes Spiel
    const LIVES = 3;        //3 Versuche
    const PTS_CORRECT = 10; // 10 Punkte für richtige Antwort
    const MONSTER_DAMAGE = 10; //Monster verliert 10 HP pro richtiger Antwort
    const WIN_PTS = 100;    // 100 Punkte gehabt dann endGame True
    const NEXT_DELAY = 1500;//Wartezeit bis zur nächsten Aufgabe

    const HIGHSCORE_LEVELS = ["einfach", "mittel", "schwer"]; //Highscores einfach, mittel und schwer
    const MAX_RANKING_PLACES = 5; // Nur die beste 5 wird angezeigt
    const HIGHSCORE_SAVE_KEY = "matheAbenteuerHighscores"; //Localstorage Name

    const TIMER_SECS = { einfach: 30, mittel: 20, schwer: 15, zehner: 30 }; //Zeitbegrenzung

    const COLOR_SUCCESS = "#00b894";
    const COLOR_ERROR = "#d63031";
    const COLOR_WIN = "#fdcb6e";

    const ENEMY_IMAGES = {
        einfach: "Bilder/Wald-Pilzmonster.png",
        mittel: "Bilder/robot.png",
        schwer: "Bilder/monster.png",
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
    const TEN_ADDEND_MAX = 30;  // zweite Zahl beschränken, damit nicht zu schwer
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
    const heroEl        = document.querySelector("#hero-image");
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
    const tenPlayerEl = document.querySelector("#ten-player");
    const tenScoreEl = document.querySelector("#ten-score");
    const tenQuestionEl = document.querySelector("#ten-question");
    const tenAnswerInput = document.querySelector("#ten-answer");
    const tenSubmitBtn = document.querySelector("#ten-submit-btn");
    const tenTipBtn = document.querySelector("#ten-tip-btn");
    const tenTipEl = document.querySelector("#ten-tip");
    const tenFeedbackEl = document.querySelector("#ten-feedback");
    const tenRestartBtn = document.querySelector("#ten-restart-btn");
    const tenBackBtn = document.querySelector("#ten-back-btn");

    const screens = [startScreen, gameScreen, tenScreen, highscoreScreen];

    let selectedChar = "Ritter";
    let selectedLevel = "einfach";
    let selectedHighscoreLevel = "einfach";
    let state = {};     // Speicher aktuellen Zustand
    let countdownTimer = null;

    let highscore = getBestScore(selectedLevel); //Highscore von bestimmte Level
    hsEl.textContent = highscore;               //Highscrore schreiben

    let tenState = {};  //Speicher aktuellen Zustand 10 Übergag

    //------------------
    // Hilfsfunktion
    // -----------------

    //zufällige Zahl zwischen min und max
    function rand(min, max) {
        //wie viele mögliche Zahlen es gibt
        const range = max - min + 1;
        //Zahlbereich berechnen und dann verschieben
        return Math.floor(Math.random() * range) + min;
    }

    //Nur der gewünschte Screen bleibt sichtbar, alle anderen werden versteckt.
    function showScreen(activeScreen) {
        screens.forEach(screen => {
            if (screen === activeScreen) {
                screen.classList.remove("hidden");
            } else {
                screen.classList.add("hidden");
            }
        });
    }

    function goToStartScreen() {
        document.body.className = "";
        showScreen(startScreen);
    }

    function showFeedback(element, text, color) {
        element.textContent = text;
        element.style.color = color;
    }

    function resetCharacterAnimation(characterEl) {
        characterEl.classList.remove("fall", "hit", "fall-hidden");
    }

    //Browser Zeichen nur als Text zeigt und nicht als HTML-Code
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));
    }

    // ------------------------------
    // SCREEN NAVIGATION
    // ------------------------------
    newGameBtn.addEventListener("click", () => {
        stopTimer();
        goToStartScreen();
        nameInput.value = "";
    });

    showRankingEndBtn.addEventListener("click", () => {
        showHighscoreScreen(state.level || selectedLevel);
    });

    backBtn.addEventListener("click", () => {
        stopTimer();
        goToStartScreen();
    });

    highscoreBackBtn.addEventListener("click", () => {
        goToStartScreen();
    });

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
        if (!name) {
            alert("Bitte gib deinen Heldennamen ein!");
            return;
        }

        if (selectedLevel === "zehner") {
            startTenGame(name);
            return;
        }

        startGame(name);
    }

    //normales Mathespiel
    function startGame(name) {
        state = createGameState(name);
        setupGameBasic();
        updateHighscoreForLevel(selectedLevel);
        resetGameDisplay();
        showScreen(gameScreen);
        showNextQuestion();
    }

    //Erstellt den Startzustand für eine neue normale Spielrunde.
    function createGameState(name) {
        return {
            name,
            level: selectedLevel,
            pts: 0,
            lives: LIVES,
            answer: 0,
            monsterHp: 100,
            startedAt: Date.now(),
            saved: false
        };
    }

    //Setzt Hintergrund, Spieleranzeige und Figurenbilder passend zur aktuellen Auswahl.
    function setupGameBasic() {
        document.body.className = `level-${selectedLevel}`;
        playerDisplay.textContent = `${selectedChar} ${state.name}`;
        heroEl.src = HERO_IMAGES[selectedChar];
        heroEl.alt = selectedChar;
        enemyEl.src = ENEMY_IMAGES[selectedLevel];
    }

    //Lädt den besten gespeicherten Punktestand für das gewählte Level.
    function updateHighscoreForLevel(level) {
        highscore = getBestScore(level);
        hsEl.textContent = highscore;
    }

    //Setzt alle sichtbaren Werte und Endzustände für eine neue Runde zurück.
    function resetGameDisplay() {
        scoreEl.textContent = 0;
        monsterHpBar.value = state.monsterHp; //aktualisiert den sichtbaren Lebensbalken
        feedbackEl.textContent = "";
        updateLifeDisplay();
        resetCharacterAnimation(heroEl);
        resetCharacterAnimation(enemyEl);
        setEndButtonsVisible(false);
    }

    //----------------------
    // Spielscreen: Teil 1 Aufgabe generieren
    // ---------------------

    //geklickte Button in section choiceGrid finden und bewerten
    choiceGrid.addEventListener("click", a => {
        const btn = a.target.closest(".choice-btn");

        if (!btn || btn.disabled) {//Verhindert mehrfaches klicken
            return;
        }
        checkAnswer(Number(btn.textContent), btn);
    });

    //Zeigt die nächste Aufgabe auf dem Spielscreen und bereitet die Antworten vor.
    function showNextQuestion() {
        const question = createQuestion(state.level);

        showQuestionText(question);
        choiceButtons(makeChoices(question.answer));

        startTimer();
    }

    //Aufgaben zu passende Niveau generieren.
    function createQuestion(level) {
        if (level === "einfach") {
            return createEasyQuestion();
        }

        if (level === "mittel") {
            return createMediumQuestion();
        }

        return createHardQuestion();
    }

    //Rechenops zufällig auswählenm: Zufällige Index von Array auswählebn
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    //Einfach Plus und Minus
    function createEasyQuestion() {
        const op = pick(["+", "−"]);
        let a, b;

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

    //Mittel Mal und Geteilt
    function createMediumQuestion() {
        const op = pick(["×", "÷"]);
        let a, b;

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

    //Schwer Einfacch mit Mittel kombinieren und größere Zahlbereich bei Mal und Geteilt
    function createHardQuestion() {
        const op = pick(["+", "−", "×", "÷"]);
        let a, b;

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

    function calculateAnswer(a, b, op) {
        if (op === "+") {
            return a + b;
        }
        if (op === "−") {
            return a - b;
        }
        if (op === "×") {
            return a * b;
        }
        return a / b;
    }

    //Speichert die richtige Lösung und zeigt den Fragetext im Spielscreen an.
    function showQuestionText(question) {
        state.answer = question.answer;
        questionEl.textContent = question.text;
        feedbackEl.textContent = "";
    }

    //Schreibt die Antwortmöglichkeiten in die vier Button
    function choiceButtons(choices) {
        document.querySelectorAll(".choice-btn").forEach((btn, i) => {
            btn.textContent = choices[i];
            btn.className = "choice-btn"; //correct oder wrong entfernen
            btn.disabled = false;
        });
    }

    //4 Antwortmöglichkeiten erstellen: choice hat[answer; 3 falsche Antwort] und dann mix
    function makeChoices(answer) {
        const choices = new Set([answer]);
        const spread = getChoiceSpread(answer);

        //Falsche Antworten generieren
        let tries = 0;
        while (choices.size < 4 && tries <1000) {
            tries++;
            const wrongAnswer = createWrongChoice(answer, spread);
            if (wrongAnswer !== answer && wrongAnswer >= 0) {
                choices.add(wrongAnswer);
            }
        }

        return mixAnswer([...choices]);
    }

    //abhängige Abweichung anhand wie groß die Lösung ist
    function getChoiceSpread(answer) {
        if (answer > 50) {
            return 20;
        }
        if (answer > 20) {
            return 10;
        }
        return 5;
    }

    //falsche Antworte= richtige Antwort + zufällige Abweichung
    function createWrongChoice(answer, spread) {
        return answer + rand(-spread, spread);
    }

    // Reihenfolgen von Antworten zufällig mischen
    function mixAnswer(arr) {
        //hinten nach vorne
        for (let i = arr.length - 1; i > 0; i--) {
            //0-1 mit i+1 mul und abrunden
            const j = Math.floor(Math.random() * (i + 1));
            //zufällige index mit i tauschen
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    //----------------------
    // Spielscreen: Teil 2 Aufgaben bewerten und Feedback
    // ---------------------

    //Lösung prüfen und auswerten: Weiter oder Spielvorbei
    function checkAnswer(answer, clickedBtn = null) {
        stopTimer();
        setChoiceButtonsDisabled(true);

        if (answer === state.answer) {
            answerIScorrect(clickedBtn);
        } else {
            answerISwrong(clickedBtn);
        }

        continueOrEndGame();
    }

    //pro Aufgabe nur eine Antwort
    function setChoiceButtonsDisabled(disabled) {
        document.querySelectorAll(".choice-btn").forEach(button => {
            button.disabled = disabled;
        });
    }

    //Verarbeitet eine richtige Antwort: Punkte, Monster-Schaden, Highscore und Feedback.
    function answerIScorrect(clickedBtn) {
        state.pts += PTS_CORRECT;
        scoreEl.textContent = state.pts;

        state.monsterHp = state.monsterHp - MONSTER_DAMAGE;
        monsterHpBar.value = state.monsterHp;

        if (state.pts > highscore) {
            highscore = state.pts;
            hsEl.textContent = highscore;
        }

        if (clickedBtn) {
            clickedBtn.classList.add("correct");
        }

        showDamage(`-${MONSTER_DAMAGE} HP`);
        enemyGetsHit();
        showFeedback(feedbackEl, "Richtig! Weiter so!", COLOR_SUCCESS);
    }

    //Verarbeitet eine falsche Antwort: Leben abziehen, richtige Lösung zeigen und Feedback.
    function answerISwrong(clickedBtn) {
        state.lives--;
        updateLifeDisplay();
        markCorrectChoice(state.answer);

        if (clickedBtn) {
            clickedBtn.classList.add("wrong");
        }

        heroGetsHit();
        showFeedback(feedbackEl, `Fast! Richtig war: ${state.answer}`, COLOR_ERROR);
    }

    //Markiert den richtigen Button.
    function markCorrectChoice(correctAnswer) {
        document.querySelectorAll(".choice-btn").forEach(button => {
            if (Number(button.textContent) === correctAnswer) {
                button.classList.add("correct");
            }
        });
    }

    //Entscheidet nach einer Antwort, ob das Spiel endet oder die nächste Aufgabe kommt.
    function continueOrEndGame() {
        if (state.pts >= WIN_PTS) {
            endGame(true);
        } else if (state.lives <= 0) {
            endGame(false);
        } else {
            setTimeout(showNextQuestion, NEXT_DELAY); //1.5s warten, dann neue Frage generieren
        }
    }

    // Spielbeenden (gewonnen oder verloren) ---
    function endGame(won) {
        stopTimer();
        saveHighscore();
        showGameResult(won);
        showEndButtons();
    }

    //Macht die Buttons sichtbar, die erst nach dem Spielende gebraucht werden.
    function showEndButtons() {
        setEndButtonsVisible(true);
    }
    //------------------
    // Spielscreen Teil 3 : Visuelle Effekt
    // -----------------

    // 4 Bilder für das Leben wechseln
    function updateLifeDisplay() {
        const lives = Math.max(0, Math.min(state.lives));//liegt 0-
        if (lives === 0) {
            lifeDisplay.src = "Bilder/leben0.png";
        } else {
            lifeDisplay.src = `Bilder/Leben${lives}.png`;
        }

        lifeDisplay.alt = `${lives} Leben`;
    }

    // Hit Animation
    function enemyGetsHit() {
        playHitAnimation(enemyEl);
    }

    function heroGetsHit() {
        playHitAnimation(heroEl);
    }

    function playHitAnimation(characterEl) {
        characterEl.classList.add("hit");
        //0.35s später entfernt hit
        setTimeout(() => characterEl.classList.remove("hit"), 350);
    }
    //Fall Animation

    function enemyFallsDown() {
        playFallAnimation(enemyEl);
    }

    function heroFallsDown() {
        playFallAnimation(heroEl);
    }

    function playFallAnimation(characterEl) {
        playHitAnimation(characterEl);
        setTimeout(() => characterEl.classList.add("fall"), 350);
        setTimeout(() => characterEl.classList.add("fall-hidden"), 1050);
    }

    function showDamage(text) {
        damageEl.textContent = text;
        damageEl.classList.remove("hidden");
        damageEl.style.animation = "none";//Stoppt kurz die Animation
        void damageEl.offsetHeight; // reflow (damit direkt beim nächsten Treffer wieder von vorne startet)
        damageEl.style.animation = "";//Aktiviert CSS-Animation wieder.
        setTimeout(() => damageEl.classList.add("hidden"), 700);
    }

    //Zeigt Text und Fallanimation passend zu Sieg oder Niederlage.
    function showGameResult(won) {
        if (won) {
            showFeedback(feedbackEl, "Gewonnen! Du bist ein Mathe-Held!", COLOR_WIN);
            enemyFallsDown();
        } else {
            showFeedback(feedbackEl, "Game Over! Versuch es nochmal!", COLOR_ERROR);
            heroFallsDown();
        }
    }

    function setEndButtonsVisible(visible) {
        if (visible) {
            newGameBtn.classList.remove("hidden");
            showRankingEndBtn.classList.remove("hidden");
        } else {
            newGameBtn.classList.add("hidden");
            showRankingEndBtn.classList.add("hidden");
        }
    }

    //--------------------------
    // Spielscreen Teil 4: Timer
    // -------------------------
    function startTimer() {
        stopTimer();
        let remain = TIMER_SECS[state.level]; // einfach 30 mittel 20 schwer 15
        countdownEl.textContent = remain;

        countdownTimer = setInterval(() => {
            remain--; //jeder Sekunde -1s
            countdownEl.textContent = remain;
            //Zeitabgelaufen dann timer stoppen, life-1, animation + Feedback
            if (remain <= 0) {
                timeISout();
            }
        }, 1000); //1s
    }

    //Verarbeitet den Fall, dass die Zeit für eine Aufgabe abgelaufen ist.
    function timeISout() {
        stopTimer();
        state.lives--;
        updateLifeDisplay();
        heroGetsHit();
        showFeedback(feedbackEl, "Zeit abgelaufen! Leben weniger!", COLOR_ERROR);
        continueOrEndGame();
    }

    //Timer stoppen und ID entfernen
    function stopTimer() {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

    // ----------------------
    // HIGHSCORE-SCREEN
    // ----------------------

    //Highscore zur passender Rangliste anzeigen
    highscoreLevelAreas.forEach(area => {
        area.addEventListener("click", () => {
            selectHighscoreLevel(area.dataset.level);
            showHighscores();
        });
    });

    //Nur das gewähltes Screen wird gezeigt
    function showHighscoreScreen(level) {
        document.body.className = "";
        selectHighscoreLevel(HIGHSCORE_LEVELS.includes(level) ? level : "einfach");
        showHighscores();
        showScreen(highscoreScreen);
    }
    // gewählte Level bekommt das selected class
    function selectHighscoreLevel(level) {
        selectedHighscoreLevel = level;
        highscoreLevelAreas.forEach(area => {
            if (area.dataset.level === level) {
                area.classList.add("selected");
            } else {
                area.classList.remove("selected");
            }
        });
    }

    //Rangliste Tabelle HighscoreScreen anzeigen
    function showHighscores() {
        const selectedEntries = loadHighscoreLists()[selectedHighscoreLevel] || [];
        highscoreTableBody.innerHTML = "";//alte Tabelle leeren

        if (selectedEntries.length === 0) {//Wenn die Liste leer ist
            const row = document.createElement("tr");//neue Zeile
            row.innerHTML = '<td colspan="4" class="empty-highscore">Noch keine Einträge</td>';//Zelle geht über alle 4
            highscoreTableBody.appendChild(row);// Zeile in die Tabelle einfügen
            return;
        }

        selectedEntries.forEach((entry, index) => {
            const row = document.createElement("tr");//neue Zeile

            //Zeile füllen mit: Platz, Name, Punkte und Zeit
            //escapeHtml: nur als normaler Text anzeigen
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.name)}</td> 
                <td>${entry.points}</td>
                <td>${formatTime(entry.time)}</td> 
            `;
            highscoreTableBody.appendChild(row);
        });
    }

    function loadHighscoreLists() {
        //drei getrennte Ranglisten
        const emptyLists = { einfach: [], mittel: [], schwer: [] };

        try {
            //Daten ausholen
            const storedLists = JSON.parse(localStorage.getItem(HIGHSCORE_SAVE_KEY)) || {};
            //überschreibe Leere liste mit gespeicherten Highscoredaten
            const lists = { ...emptyLists, ...storedLists };
            //Absicherung gegen kaputte Daten
            HIGHSCORE_LEVELS.forEach(level => {
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

    function saveHighscore() {
        //ob schon gespeichert wurde
        if (state.saved || !HIGHSCORE_LEVELS.includes(state.level)) {
            return;
        }

        const lists = loadHighscoreLists();//aus dem LocalStorage laden
        const entry = createHighscoreEntry();

        lists[state.level] = addHighscoreEntry(lists[state.level], entry);

        saveHighscoreLists(lists);
        state.saved = true;
        //Aktualisiert die Highscore Anzeige
        highscore = getBestScore(state.level);
        hsEl.textContent = highscore;
    }

    //Speichern in LocalStorage
    function saveHighscoreLists(lists) {
        try {
            localStorage.setItem(HIGHSCORE_SAVE_KEY, JSON.stringify(lists));
            return true;
        } catch {
            showFeedback(feedbackEl, "Highscore konnte nicht gespeichert werden.", COLOR_ERROR);
            return false;
        }
    }

    //Erstellt den Ranglisten Eintrag
    function createHighscoreEntry() {
        return {
            name: state.name,
            points: state.pts,
            time: getPlayTime()
        };
    }

    //Berechnet die bisherige Spielzeit in Sekunden.
    function getPlayTime() {
        return Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
    }

    //Fügt einen Eintrag sortiert hinzu und behält nur die besten Plätze.
    //Punkten absteigend, wenn Punkte gleich Zeit aufsteigend.
    function addHighscoreEntry(old, entry) {
        return [...old, entry]
            .sort((a, b) => b.points - a.points || a.time - b.time)
            .slice(0, MAX_RANKING_PLACES);//zeige nur die beste 5
    }

    function getBestScore(level) {
        //Highscore Liste von  bestimmte Level wenn keine leer List und 0 ausgeben
        const scores = loadHighscoreLists()[level] || [];

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

    // -----------------------
    // 10ER-ÜBERGANG-SCREEN
    // -----------------------

    //Antwort prüfen (Button Klicken)
    tenSubmitBtn.addEventListener("click", checkTenAnswer);
    //Antwort prüfen mit Enter
    tenAnswerInput.addEventListener("keydown", e => {
        //Eingabe schützen, nur Zahlen eingeben können und maximale nur 3 stellen
        const allowedKeys = ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"];
        const isNumberKey = e.key >= "0" && e.key <= "9";

        if (!isNumberKey && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.key === "Enter") {
            checkTenAnswer();
        }
    });

    //Tip benutzen dann: tip benutzt true, Inhalt anzeigen, tip button nicht mehr wählbar
    tenTipBtn.addEventListener("click", () => {
        tenState.hintUsed = true;
        tenTipEl.textContent = tenState.hint;
        tenTipEl.classList.remove("hidden");
        tenTipBtn.disabled = true;
    });

    //Spiel neustarten nach Spielende
    tenRestartBtn.addEventListener("click", () => {
        startTenGame(tenState.name || nameInput.value.trim() || "Held");
    });

    //Zurück zum Hauptmenü
    tenBackBtn.addEventListener("click", () => {
        goToStartScreen();
    });

    function startTenGame(name) {
        document.body.className = "level-zehner";
        tenState = { name, score: 0, answer: 0, hint: "", hintUsed: false, finished: false };
        tenPlayerEl.textContent = name;
        tenScoreEl.textContent = tenState.score;
        tenRestartBtn.classList.add("hidden");
        tenFeedbackEl.textContent = "";
        tenTipEl.textContent = "";
        tenTipEl.classList.add("hidden");
        tenAnswerInput.disabled = false;
        tenSubmitBtn.disabled = false;
        tenTipBtn.disabled = false;

        showScreen(tenScreen);
        generateTenQuestion();
    }

    function generateTenQuestion() {
        const task = createTenTask();
        showTenQuestion(task);
    }

    function createTenTask() {
        const base = createTenValue();
        const op = pick(["+", "−"]);
        const questionPosition = rand(1, 3);

        if (op === "+") {
            return createAdditionTenTask(base, questionPosition);
        }

        return createSubtractionTenTask(base, questionPosition);
    }

    function showTenQuestion(task) {
        tenState.answer = task.answer;
        tenState.hint = task.hint;
        tenState.hintUsed = false;
        tenQuestionEl.textContent = task.text;
        tenAnswerInput.value = "";
        tenTipEl.textContent = "";
        tenTipEl.classList.add("hidden");
        tenAnswerInput.disabled = false;
        tenSubmitBtn.disabled = false;
        tenTipBtn.disabled = false;
        tenFeedbackEl.textContent = "";
        tenAnswerInput.focus();
    }

    function createTenValue() {
        while (true) {
            //startwert (Platz verschaffen, damit über den nächsten Zehner gehen kann)
            const start = rand(ZAHLENRAUM_MIN, ZAHLENRAUM_MAX - TEN_STEP - 1);
            const nextTen = getNextTen(start);// nächste 10ner; start 71 nextTen 80
            const toNextTen = nextTen - start;//genau zum nächsten Zehner; S 71 toNT 9
            const maxAddend = Math.min(TEN_ADDEND_MAX, ZAHLENRAUM_MAX - start);//Zweite Zahl beschränken

            //wenn ein echter Zehnerübergang da ist
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

    //teilt mit 10, rundt nach unten ab, mit10 mul dann + 10
    function getNextTen(number) {
        return Math.floor(number / TEN_STEP) * TEN_STEP + TEN_STEP;
    }

    //Texte für Tipps und Aufgaben (+)
    function createAdditionTenTask(base, questionPosition) {
        const hint = `${base.start} + ${base.toNextTen} = ${base.nextTen}, dann + ${base.afterNextTen} = ${base.result}`;
        //? an der Stelle1
        if (questionPosition === 1) {
            return { text: `? + ${base.addend} = ${base.result}`, answer: base.start, hint };
        }
        //? an der Stelle 2
        if (questionPosition === 2) {
            return { text: `${base.start} + ? = ${base.result}`, answer: base.addend, hint };
        }
        //? an der Stelle 3
        return { text: `${base.start} + ${base.addend} = ?`, answer: base.result, hint };
    }
    //Texte für Tipps und Aufgaben (-)
    function createSubtractionTenTask(base, questionPosition) {
        const hint = `${base.result} - ${base.afterNextTen} = ${base.nextTen}, dann - ${base.toNextTen} = ${base.start}`;

        //? an der Stelle1
        if (questionPosition === 1) {
            return { text: `? - ${base.addend} = ${base.start}`, answer: base.result, hint };
        }
        //? an der Stelle 2
        if (questionPosition === 2) {
            return { text: `${base.result} - ? = ${base.start}`, answer: base.addend, hint };
        }
        //? an der Stelle 3
        return { text: `${base.result} - ${base.addend} = ?`, answer: base.start, hint };
    }

    function checkTenAnswer() {
        //Spielvorbei
        if (tenState.finished) {
            return;
        }

        //Wenn nichts eingegeben wird
        const inputValue = tenAnswerInput.value.trim();
        if (!inputValue) {
            showFeedback(tenFeedbackEl, "Bitte gib eine Antwort ein.", COLOR_ERROR);
            return;
        }

        //Feedback zu falsche Antwort
        const answer = Number(inputValue);
        if (answer !== tenState.answer) {
            showFeedback(tenFeedbackEl, "Leider falsch. Versuch es nochmal!", COLOR_ERROR);
            tenAnswerInput.select();
            return;
        }

        // +10 wenn kein Tip, +5 wenn mit TIp
        let points;
        if (tenState.hintUsed) {
            points = TEN_PTS_WITH_TIP;
        } else {
            points = TEN_PTS_WITHOUT_TIP;
        }
        tenState.score += points;
        tenScoreEl.textContent = tenState.score;

        //Feedback wenn richtig
        if (tenState.hintUsed) {
            showFeedback(tenFeedbackEl, "Richtig! Du hast einen Tipp gebraucht. :|", COLOR_SUCCESS);
        } else {
            showFeedback(tenFeedbackEl, "Super! :)", COLOR_SUCCESS);
        }

        //wenn 100 Point erreicht spielvorbei
        if (tenState.score >= TEN_WIN_PTS) {
            finishTenGame();
        } else {
            generateTenQuestion();
        }
    }

    //Screen zu Finishlayout umstellen
    function finishTenGame() {
        tenState.finished = true;
        tenQuestionEl.textContent = "Gewonnen!";
        showFeedback(tenFeedbackEl, "Du hast den 10er-Übergang geschafft!", COLOR_SUCCESS);
        tenAnswerInput.disabled = true;
        tenSubmitBtn.disabled = true;
        tenTipBtn.disabled = true;
        tenRestartBtn.classList.remove("hidden");
    }
