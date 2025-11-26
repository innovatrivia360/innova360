const playerName = document.getElementById("playerName");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const timerDisplay = document.getElementById("timer");
const timerBox = document.getElementById("timer-box-wrapper"); 
const clickSound = document.getElementById("clickSound");
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");
const beepSound = document.getElementById("beepSound"); 
const scoreDisplay = document.getElementById("scoreDisplay");

let current = 0;
let score = 0;
let correctCount = 0; // Contador de aciertos brutos para la deducción
let incorrectCount = 0; // Contador de errores brutos
let timer;
let timeLeft = 15; // AJUSTADO A 15 SEGUNDOS

const nombreJugador = localStorage.getItem("nombreJugador");
playerName.textContent = nombreJugador ? `Jugador: ${nombreJugador}` : "";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  current = 0;
  score = 0;
  correctCount = 0;
  incorrectCount = 0;
  // SOLUCIÓN PARA EL BEEP
  try {
      clickSound.volume = 0;
      clickSound.play();
      clickSound.volume = 1;
  } catch(e) { /* No pasa nada si falla */ }
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) {
    // GUARDANDO TODOS LOS DATOS PARA EL CÁLCULO FINAL EN results.js
    localStorage.setItem("score", score);
    localStorage.setItem("correctCount", correctCount);
    localStorage.setItem("incorrectCount", incorrectCount);
    window.location = "results.html";
    return;
  }

  const q = questions[current];
  questionNumber.textContent = `Pregunta ${current + 1} de ${questions.length}`;
  questionText.textContent = q.question;

  optionsDiv.innerHTML = "";

  const mixedOptions = shuffleArray(
    q.options.map((option, index) => ({ text: option, index }))
  );

  mixedOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = () => checkAnswer(opt.index);
    optionsDiv.appendChild(btn);
  });

  resetTimer();
}

function showFeedback(text, color, correctText = "") {
  const feedback = document.createElement("div");
  feedback.textContent = text;
  feedback.style.color = color;
  feedback.style.fontSize = "22px";
  feedback.fontWeight = "bold";
  feedback.style.marginTop = "15px";
  feedback.style.textShadow = `0 0 10px ${color}`;
  optionsDiv.appendChild(feedback);

  if (correctText) {
    const correctInfo = document.createElement("p");
    correctInfo.textContent = "Respuesta correcta: " + correctText;
    correctInfo.style.color = "#00ffc8";
    correctInfo.style.fontSize = "16px";
    correctInfo.style.marginTop = "5px";
    optionsDiv.appendChild(correctInfo);
  }
}

function checkAnswer(selected) {
  // Detiene temporizador y sonido
  clearInterval(timer);
  beepSound.pause();
  beepSound.currentTime = 0;
  
  playClick();
  const q = questions[current];
  const buttons = optionsDiv.querySelectorAll("button");

  buttons.forEach((btn) => (btn.disabled = true));

  if (selected === q.correct) {
    score += 10;
    correctCount++; // Contar acierto
    correctSound.currentTime = 0;
    correctSound.play();
    showFeedback("¡Correcto!", "#00ffc8");
  } else {
    score -= 5; // Permite puntaje negativo
    incorrectCount++; // Contar error/tiempo agotado
    incorrectSound.currentTime = 0;
    incorrectSound.play();
    
    const feedbackText = selected === null ? "¡Tiempo Agotado! (Incorrecto)" : "Incorrecto";
    showFeedback(feedbackText, "#ff3b3b", q.options[q.correct]);
  }

  scoreDisplay.textContent = "Puntuación: " + score;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1500);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15; 
  timerDisplay.textContent = timeLeft;

  timerBox.classList.remove("warning-blink");
  beepSound.pause();
  beepSound.currentTime = 0;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // Alerta visual y sonora a los 5 segundos
    if (timeLeft <= 5 && timeLeft > 0) {
      if (!timerBox.classList.contains("warning-blink")) {
         timerBox.classList.add("warning-blink");
         beepSound.play();
      }
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      
      beepSound.pause();
      beepSound.currentTime = 0;

      // Penalización por tiempo agotado
      checkAnswer(null); 
    }
  }, 1000);
}

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

startGame();
