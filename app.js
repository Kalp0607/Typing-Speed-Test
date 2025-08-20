const paragraphsByLevel = {
  easy: [
    "the and to in is it you of for on with at by this that we he she they do go can run get make take give see find",
    "say keep use know want like help call tell ask try love work most now here who what when where why how all any",
    "map cup bed car bus sun dog cat big red hot cold blue green pink white fast slow fun play jump walk read sing eat cake",
    "boy girl man woman mom dad kid baby aunt uncle team home house desk book tree park star ball game food rice soup bread cheese",
    "school city town shop road lake river hill wood leaf rain snow ball star fox bird fish frog goat duck cow lamb",
    "old new high low left right up down long short hard soft dark light calm kind quick slow warm cool",
    "apple orange lemon grape pear peach plum cake bread cheese rice soup meat tea milk egg nut bean corn",
    "game race sport math show quiz plan win lose draw score point team goal best first last more less",
    "big small tall short light dark bright soft calm loud warm quick slow neat clean rich poor open close",
    "fun rest read write jump walk eat bake sing draw cook paint clean fix ride move grow build",
    "have need give want make take tell ask try call help think find help look use show play show",
    "home life work team group class family friend car bus shop bank plan win lose draw score point",
    "read write sing draw cook paint clean fix ride play swim bike walk run jump help want",
    "see get go say keep take want ask try use love make work need find look ask call",
    "run win hit fit act map pad tap cap nor not our put let set yet rep tap nap lap",
    "new old good bad best worst first last up down right left near far few more less high low",
    "group class school team game quiz show race sport math plan task goal list time date week",
    "bus car bike taxi train ship plane desk chair book pen bag cake rice soup bread milk",
    "lake river sea hill farm tree wood park road lane path way home house shop mall bank",
    "apple orange lemon grape peach plum bread cake rice soup meat egg tea milk nut corn",
  ],
  medium: [
    "Reading improves imagination and increases vocabulary among people everywhere.",
    "Sunflowers bloom brightly throughout all the summer months and look beautiful.",
    "Mountains provide stunning views for hikers and travelers from distant places.",
    "Libraries contain books on many interesting subjects and foster curiosity.",
    "Knowing several languages helps people travel easily and communicate better.",
    "Creativity sparks innovation and brings new opportunities for everyone.",
    "Children learn faster if they read books and practice daily habits.",
    "Healthy routines such as exercise and balanced meals support lifelong wellness.",
    "Winter snow creates a scenic landscape enjoyed by skiers and snowboarders.",
    "Farmers plant and harvest crops that feed communities throughout every season.",
  ],
  hard: [
    "Can you believe it? He forgot his keys, again, despite being reminded twice.",
    "While walking outside, she noticed the rain—soft, steady, and persistent all day.",
    "Innovation, progress, and learning: they're all important for growth and success.",
    "Surprisingly, the answer was found behind the door, hidden beneath the mat.",
    "Quickly, he responded, “Yes, I’ll join you!” without a moment's hesitation.",
  ],
  extreme: [
    `In the intricate tapestry of science and philosophy, paradoxes often emerge not only as intellectual curiosities but as vital catalysts for the evolution of understanding. Consider Russell's paradox or Gödel's incompleteness theorem.=`,
    `The pursuit of certainty, whether through deductive reasoning, empirical evidence, or statistical analysis, frequently encounters unforeseen obstacles. Scientists meticulously design experiments—testing hypotheses, amassing data.=`,
    `Philosophers, meanwhile, dissect the language of consciousness, identity, and morality, employing tools of argumentation, rhetoric, and critical inquiry. In moments of breakthrough or confusion, they interrogate the axioms underlying.=`,
    `Technical proficiency in any demanding field is rarely acquired without sustained effort, repeated setbacks, and careful practice. Mathematicians, programmers, engineers, and researchers face daunting challenges—from confounding data.=`,
    `Communication must be precise: a misplaced comma or an ambiguous phrase can derail entire projects. As deadlines approach, fatigue sets in, but discipline remains paramount. Teamwork and solitary study alternate, each presenting its.=`,
  ],
};

const paragraphEl = document.getElementById("paragraph");
const inputEl = document.getElementById("inputBox");
const timerDisplay = document.getElementById("timerDisplay");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");
const restartBtn = document.getElementById("restartBtn");
const timerBtns = Array.from(document.querySelectorAll(".timer-btn"));
const levelBtns = Array.from(document.querySelectorAll(".level-btn"));

let currentLevel = "easy";
let currentParagraph = "";
let timerDuration = 15;
let timer = timerDuration;
let interval = null;
let started = false;
let ended = false;

function pickParagraph(level) {
  let pool = paragraphsByLevel[level];
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderParagraph(userInput = "") {
  paragraphEl.innerHTML = "";
  for (let i = 0; i < currentParagraph.length; i++) {
    let cl = "pending";
    if (userInput.length > i) {
      cl = userInput[i] === currentParagraph[i] ? "correct" : "incorrect";
    }
    let span = document.createElement("span");
    span.textContent = currentParagraph[i];
    span.className =
      "char " + cl + (currentParagraph[i] === " " ? " space" : "");
    paragraphEl.appendChild(span);
  }
  if (ended) paragraphEl.classList.add("finished");
  else paragraphEl.classList.remove("finished");

  // Auto scroll....keep latest typed character in view
  let chars = paragraphEl.querySelectorAll(".char");
  if (userInput.length > 0 && chars.length > userInput.length) {
    let activeChar = chars[userInput.length - 1];
    if (activeChar) {
      activeChar.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
}

function updateStats(userInput = "", elapsed = 0) {
  let mistakeCnt = 0,
    correctCnt = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === currentParagraph[i]) correctCnt++;
    else mistakeCnt++;
  }
  const accuracy = userInput.length
    ? ((correctCnt / userInput.length) * 100).toFixed(1)
    : "100";
  let userWords = userInput.trim().split(/\s+/);
  let paraWords = currentParagraph.trim().split(/\s+/);
  let correctWords = 0;
  for (let i = 0; i < userWords.length && i < paraWords.length; i++) {
    if (userWords[i] === paraWords[i]) {
      correctWords++;
    }
  }
  const minutes = elapsed > 0 ? elapsed / 60 : 1;
  const wpm = Math.round(correctWords / minutes);
  wpmEl.textContent = wpm;
  accuracyEl.textContent = `${accuracy}%`;
  mistakesEl.textContent = mistakeCnt;
}

function startTest() {
  timerDisplay.textContent = `Time: ${timerDuration}s`;
  timer = timerDuration;
  started = false;
  ended = false;
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  currentParagraph = pickParagraph(currentLevel);
  renderParagraph("");
  updateStats("", 0);
  clearInterval(interval);
  restartBtn.textContent = "Restart";
  paragraphEl.style.animation = "none";
  setTimeout(() => {
    paragraphEl.style.animation = "";
  }, 10);
}

function finishTest(force = "timer") {
  if (ended) return;
  ended = true;
  clearInterval(interval);
  inputEl.disabled = true;
  timerDisplay.textContent = force === "done" ? "Completed!" : "Time's up!";
  updateStats(inputEl.value, timerDuration - timer);
  restartBtn.textContent = "Try Again";
  renderParagraph(inputEl.value);
}

timerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    timerBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    timerDuration = parseInt(btn.dataset.seconds);
    startTest();
  });
});
levelBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    levelBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    currentLevel = btn.dataset.level;
    startTest();
  });
});

inputEl.addEventListener("input", function () {
  if (ended) return;
  if (!started) {
    started = true;
    interval = setInterval(() => {
      timer--;
      timerDisplay.textContent = `Time: ${timer}s`;
      updateStats(inputEl.value, timerDuration - timer);
      if (timer <= 0) finishTest("timer");
    }, 1000);
  }
  renderParagraph(inputEl.value);
  let elapsed = timerDuration - timer;
  updateStats(inputEl.value, elapsed);
  if (inputEl.value.length >= currentParagraph.length) {
    finishTest("done");
  }
});

restartBtn.addEventListener("click", startTest);

window.onload = startTest;
