let questions = [];
let currentQuestion = 0;

const synth = window.speechSynthesis;

function speak(text) {
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  synth.speak(utter);
}

function startGame() {
  showScreen("level-screen");
  speak("Choose a level");
}

function loadLevel(level) {
  fetch(`questions/level${level}.json`)
    .then(res => res.json())
    .then(data => {
      questions = shuffle(data);
      currentQuestion = 0;
      showScreen("question-screen");
      askQuestion();
    });
}

function askQuestion() {
  const q = questions[currentQuestion];
  speak(q.question);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  shuffle(q.options).forEach(opt => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.innerHTML = `<img src="images/${opt.image}" />`;
    btn.onclick = () => selectOption(opt, q.correct);
    optionsDiv.appendChild(btn);
  });
}

function selectOption(option, correct) {
  speak(option.name);

  setTimeout(() => {
    if (option.name === correct) {
      speak("Great job!");
      currentQuestion++;
      if (currentQuestion < questions.length) {
        setTimeout(askQuestion, 1000);
      } else {
        speak("You finished the level!");
        showScreen("level-screen");
      }
    } else {
      speak("Try again");
    }
  }, 800);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
