let level = 1;
let questions = [];
let currentQuestion = 0;

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load level
function loadLevel(lvl) {
  level = lvl;
  fetch(`questions/level${level}.json`)
    .then(res => res.json())
    .then(data => {
      // Shuffle all questions and pick first 10
      const shuffled = shuffle(data);
      questions = shuffled.slice(0, 10);
      currentQuestion = 0;
      showScreen("question-screen");
      askQuestion();
    });
}

// Show screen helper
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  document.getElementById(screenId).style.display = "block";
}

// Ask question
function askQuestion() {
  const q = questions[currentQuestion];
  const questionDiv = document.getElementById("question");
  const optionsDiv = document.getElementById("options");

  questionDiv.innerText = q.question;
  optionsDiv.innerHTML = "";

  // Shuffle options for extra randomness
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.innerHTML = `<img src="${opt.image}" /><div class="poke-name">${opt.name}</div>`;
    btn.onclick = () => selectOption(opt, q.correct);
    optionsDiv.appendChild(btn);
  });

  // Speak question
  speakText(q.question);
}

// Option selection
function selectOption(selected, correct) {
  if (selected.name === correct) {
    speakText("Correct!");
  } else {
    speakText(`Wrong! Correct answer is ${correct}`);
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(askQuestion, 1500);
  } else {
    setTimeout(() => {
      speakText(`Level ${level} completed!`);
      showScreen("menu-screen");
    }, 1500);
  }
}

// Speak helper
function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utter);
}

// Initial menu
document.getElementById("play-btn").onclick = () => loadLevel(1);
document.getElementById("level2-btn").onclick = () => loadLevel(2);
document.getElementById("level3-btn").onclick = () => loadLevel(3);
