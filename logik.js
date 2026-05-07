const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const playerNameInput = document.getElementById("player-name");
const nameOutput = document.getElementById("name-output");

const taskText = document.getElementById("task");

const answerInput = document.getElementById("answer-input");

const checkBtn = document.getElementById("check-btn");

const message = document.getElementById("message");

const scoreOutput = document.getElementById("score");

let score = 0;

let currentAnswer = 0;



// SPIEL STARTEN
startBtn.addEventListener("click", () => {

  const playerName = playerNameInput.value;

  if(playerName === "") {
    alert("Bitte Namen eingeben!");
    return;
  }

  nameOutput.textContent = playerName;

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  generateTask();

});



// AUFGABE ERSTELLEN
function generateTask() {

  let number1 = Math.floor(Math.random() * 50);
  let number2 = Math.floor(Math.random() * 50);

  currentAnswer = number1 + number2;

  taskText.textContent = `${number1} + ${number2} = ?`;

}



// ANTWORT PRÜFEN
checkBtn.addEventListener("click", () => {

  let userAnswer = Number(answerInput.value);

  if(userAnswer === currentAnswer) {

    score += 10;

    scoreOutput.textContent = score;

    message.textContent = "✅ Richtig!";
    message.className = "correct";

  } else {

    message.textContent = "❌ Falsch!";
    message.className = "wrong";

  }

  answerInput.value = "";

  generateTask();

});