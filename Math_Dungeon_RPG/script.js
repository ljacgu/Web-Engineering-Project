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


    let selectedChar = "Ritter";
    let selectedLevel = "einfach";
    let selectedHighscoreLevel = "einfach";
    let state = {};     // Speicher aktuellen Zustand
    let countdownTimer = null;

    let highscore = getBestScore(selectedLevel); //Highscore von bestimmte Level
    hsEl.textContent = highscore;               //Highscrore schreiben

    let tenState = {};  //Speicher aktuellen Zustand 10 Übergag

    //Hilfsfunktion
    //zufällige Zahl zwischen min und max
    function rand(min, max) {
        //wie viele Zahlen möglich
        const range = max - min + 1;
        //zufällige Kommazahl, dann eine gannze Zahl und verschiebt die Zahl
        return Math.floor(Math.random() * range) + min;
    }

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

        heroImage.classList.remove("fall", "hit", "fall-hidden");//notwendig, sonst ab zweites Spiel sichbar
        enemyEl.classList.remove("fall", "hit", "fall-hidden");//notwendig, sonst ab zweites Spiel sichbar

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

    //geklickte Button in section choiceGrid finden und bewerten
    choiceGrid.addEventListener("click", a => {
        const btn = a.target.closest(".choice-btn");

        if (!btn || btn.disabled) {//Verhindert mehrfaches klicken
            return;
        }
        checkAnswer(Number(btn.textContent), btn);
    });

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
        if (op === "+") {
            state.answer = a + b;
        } else if (op === "−") {
            state.answer = a - b;
        } else if (op === "×") {
            state.answer = a * b;
        } else {
            state.answer = a / b;
        }

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

    //4 Antwortmöglichkeiten erstellen
    function makeChoices(correct) {
        const choices = new Set([correct]);

        //Abweichung von der Lösung bestimmen
        let spread = 5;
        if (correct > 20) {
            spread = 10;
        }

        if (correct > 50) {
            spread = 20;
        }

        //Falsche Antworten generieren
        let tries = 0;
        while (choices.size < 4 && tries <1000) {
            tries++;
            const wrong = rand(-spread, spread);
            const wrong_answer = correct + wrong;
            if (wrong_answer !== correct && wrong_answer >= 0) {
                choices.add(wrong_answer);
            }
        }

        return mixAnswer([...choices]);
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

    function checkAnswer(answer, clickedBtn = null) {
        stopTimer();
        //deaktivieren alle Button, damit nicht mehrfach klicken
        document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);

        //Richtig, dann Punkt erhöhen und anzeigen
        if (answer === state.answer) {
            state.pts += PTS_CORRECT;
            scoreEl.textContent = state.pts;
            //Monster -10 HP
            state.monsterHp = state.monsterHp - 10;
            monsterHpBar.value = state.monsterHp;
            //Wenn besser als bishertige Highscore, Highscore aktuallisieren
            if (state.pts > highscore) {
                highscore = state.pts;
                hsEl.textContent = highscore;
            }
            // ausgewaählt Button wird grün gezeigt (in CSS choice-btn.correct) und Animation sowie Feedback
            if (clickedBtn) {
                clickedBtn.classList.add("correct");
            }
            showDamage("-10 HP");
            enemyGetsHit();
            feedbackEl.textContent = "Richtig! Weiter so!";
            feedbackEl.style.color = "#00b894";

        //Falsch, dann live -1
        } else {
            state.lives--;
            updateLifeDisplay();
            //die richtige Button herausfinden und markieren
            document.querySelectorAll(".choice-btn").forEach(b => {
                    if (Number(b.textContent) === state.answer) {
                        b.classList.add("correct");
                    }
            });
            //ausgewählte Button wird rot markiert + Animation +Feedback in rot
            if (clickedBtn) {
                clickedBtn.classList.add("wrong");
            }
            heroGetsHit();
            feedbackEl.textContent = `Fast! Richtig war: ${state.answer}`;
            feedbackEl.style.color = "#d63031";
        }

        //Spielbeendt wenn 100 Punkte oder keine Leben mehr, Timer abgelaufen nächste Frage
        if (state.pts >= WIN_PTS) {
            endGame(true);
        } else if (state.lives <= 0) {
            endGame(false);
        } else {
            setTimeout(generateQuestion, NEXT_DELAY);
        }
    }

    // Timer
    function startTimer() {
        stopTimer();
        let remain = TIMER_SECS[state.level]; // einfach 30 mittel 20 schwer 15
        countdownEl.textContent = remain;

        countdownTimer = setInterval(() => {
            remain--; //jeder Sekunde -1s
            countdownEl.textContent = remain;
            //Zeitabgelaufen dann timer stoppen, life-1, animation + Feedback
            if (remain <= 0) {
                stopTimer();
                state.lives--;
                updateLifeDisplay();
                heroGetsHit();
                feedbackEl.textContent = "Zeit abgelaufen! Leben weniger!";
                feedbackEl.style.color = "#d63031";
            //Zeitabgelaufen wenn kein Leben mehr Spiel beenden oder nächste Frage
                if (state.lives <= 0) {
                    endGame(false);
                } else {
                    setTimeout(generateQuestion, NEXT_DELAY);
                }
            }
        }, 1000); //1s
    }

    //Timer stoppen und ID entfernen
    function stopTimer() {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

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
        playHitAnimation(heroImage);
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
        playFallAnimation(heroImage);
    }

    function playFallAnimation(characterEl) {
        playHitAnimation(characterEl);
        //0.35s später entfernt fall
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

    // Spielbeenden (gewonnen oder verloren) ---
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

    // ------------------------------
    // SCREEN NAVIGATION
    // ------------------------------
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


    // ----------------------
    // HIGHSCORE-SCREEN
    // ----------------------

    //Highscore zur passender Rangliste anzeigen
    highscoreLevelAreas.forEach(area => {
        area.addEventListener("click", () => {
            selectHighscoreLevel(area.dataset.level);
            renderHighscores();
        });
    });
    //Nur das gewähltes Screen wird gezeigt
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

    function loadHighscoreLists() {
        //drei getrennte Ranglisten
        const emptyLists = { einfach: [], mittel: [], schwer: [] };

        try {
            //Daten ausholen
            const storedLists = JSON.parse(localStorage.getItem(HIGHSCORE_SAVE_KEY)) || {};
            //Die restelichen beide Liste bleibt
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
    //Speichern in LocalStorage
    function saveHighscoreLists(lists) {
        localStorage.setItem(HIGHSCORE_SAVE_KEY, JSON.stringify(lists));
    }

    function saveHighscore() {
        //ob schon gespeichert wurde
        if (state.saved || !HIGHSCORE_LEVELS.includes(state.level)) {
            return;
        }

        const lists = loadHighscoreLists();//aus dem LocalStorage laden
        //Wie lange das Spiel gedauert hat; aktuelle Zeit - Startzeit
        const timeUsed = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));

        //ein neue Ranglisten-Eintrag.
        const entry = {
            name: state.name,
            points: state.pts,
            time: timeUsed
        };
        //bisherige Liste, fügt den neuen Eintrag hinzu.
        lists[state.level] = [...lists[state.level], entry]
            //sortieren zuerst nach Punkte, wenn
            .sort((a, b) => b.points - a.points || a.time - b.time)
            .slice(0, MAX_RANKING_PLACES);

        saveHighscoreLists(lists);
        state.saved = true;
        //Aktualisiert die Highscore Anzeige
        highscore = getBestScore(state.level);
        hsEl.textContent = highscore;
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

    //Rangliste Tabelle HighscoreScreen anzeigen
    function renderHighscores() {
        const entries = loadHighscoreLists()[selectedHighscoreLevel] || [];
        highscoreTableBody.innerHTML = "";//alte Tabelle leeren

        if (entries.length === 0) {//Wenn die Liste leer ist
            const row = document.createElement("tr");//neue Zeile
            row.innerHTML = '<td colspan="4" class="empty-highscore">Noch keine Einträge</td>';//Zelle geht über alle 4
            highscoreTableBody.appendChild(row);// Zeile in die Tabelle einfügen
            return;
        }

        entries.forEach((entry, index) => {
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

    // Sekunden ->1:01
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        //padStart macht Seconds immer 2 Stellig wie 02 03 23;
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
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
        document.body.className = "";
        tenScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
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

        startScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        highscoreScreen.classList.add("hidden");
        tenScreen.classList.remove("hidden");
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
            tenFeedbackEl.textContent = "Bitte gib eine Antwort ein.";
            tenFeedbackEl.style.color = "#d63031";
            return;
        }

        //Feedback zu falsche Antwort
        const answer = Number(inputValue);
        if (answer !== tenState.answer) {
            tenFeedbackEl.textContent = "Leider falsch. Versuch es nochmal!";
            tenFeedbackEl.style.color = "#d63031";
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
            tenFeedbackEl.textContent = "Richtig! Du hast einen Tipp gebraucht. :|";
        } else {
            tenFeedbackEl.textContent = "Super! :)";
        }
        tenFeedbackEl.style.color = "#00b894";

        //wenn 100 Point erreicht spielvorbei
        if (tenState.score >= TEN_WIN_PTS) {
            finishTenGame();
        }
    }

    //Screen zu Finishlayout umstellen
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
});
