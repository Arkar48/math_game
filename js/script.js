const content = document.getElementById("content");
const start = document.getElementById("start_btn");
const muteSound = document.getElementById("sound");
const about = document.getElementById("about");
const blackboard = document.getElementById("image");
let vDom = ["p", "div", "ul", "li", "button", "audio", "i"];
let gameresult = [
  "Correct!",
  "Game over!",
  "Next game",
  "Start again",
  "time's up",
];
let gameExit = ["Are you sure wanted to exit ?", "yes", "no"];
const aboutcontent = [
  "Evaluate the quiz and choose a correct answer.",
  "You have two chances to choose wrong answers.",
  "If you choose a correct answer, this will generate next question.",
  "Remember you have only one minute to evaluate.",
  "Let's fun!",
];
let operators = ["+", "-", "×", "÷"];
let timer = 60;
let gametime;
let life = 3;
let randomNumber;

// Game Start
function startGame() {
  let gameresult = document.querySelector(".gameresult");
  if (content.contains(gameresult)) {
    gameresult.remove();
  }
  about.classList.add("d-none");
  playsound();
  const op = generateOperators(2);
  let randomNumbers = generateNumber(3);
  let AnsQuestion = createQuestion(op, randomNumbers);
  start.classList.add("d-none");
  content.append(AnsQuestion);
  if (life) {
    lifeCount(life, event);
  }
  gameTimer(event);
}
start.onclick = startGame;


function generateOperators(count) {
  let operations = new Set();
  while (operations.size < count) {
    const operate = operators[Math.floor(Math.random() * operators.length)];
    operations.add(operate);
  }
  return Array.from(operations);
}
function generateNumber(count) {
  let numbers = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * 9 + 1);
    numbers.add(num);
  }
  return Array.from(numbers);
}
function generateAnswer(correctAnswer) {
  const lowerBound = correctAnswer - 3;
  const upperBound = correctAnswer + 3;
  let potentialAnswers = new Set();
  potentialAnswers.add(correctAnswer);
  while (potentialAnswers.size < 5) {
    let randomAns = getRandomArbitrary(lowerBound, upperBound + 1);
    if (!Number.isInteger(correctAnswer)) {
      randomAns = parseFloat(randomAns.toFixed(2));
    } else {
      randomAns = Math.floor(randomAns);
    }
    if (randomAns !== correctAnswer) {
      potentialAnswers.add(randomAns);
    }
  }
  const shuffledAnswers = shuffleArray(Array.from(potentialAnswers));

  return shuffledAnswers;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function createQuestion(op, randomNumbers) {
  const divfortexts = document.createElement(vDom[1]);
  divfortexts.classList.add("text", "text-center");
  divfortexts.setAttribute("id", "gameContent");
  const question = document.createElement(vDom[0]);
  question.classList.add("item");
  const divforAns = document.createElement(vDom[1]);
  divforAns.classList.add(
    "answer",
    "mt-4",
    "d-flex",
    "justify-content-between"
  );
  const show = `${randomNumbers[0]} ${op[0]} ${randomNumbers[1]} ${op[1]} ${randomNumbers[2]}`;
  const equation = `${randomNumbers[0]} ${op[0]
    .replace("×", "*")
    .replace("÷", "/")} ${randomNumbers[1]} ${op[1]
    .replace("×", "*")
    .replace("÷", "/")} ${randomNumbers[2]}`;
  question.textContent = show + "= ?";
  const exit = document.createElement(vDom[0]);
  exit.textContent = "exit";
  exit.setAttribute("id", "exit");
  exit.classList.add("exit");
  blackboard.append(exit);
  exit.onclick = function () {
    exit.classList.add("d-none");
    divfortexts.setAttribute("style", "opacity:0; z-index:-1");
    playsound();
    let exitContent = exitGame(event);
    content.append(exitContent);
  };
  let correctAnswer = eval(equation);
  console.log(correctAnswer);
  if (!Number.isInteger(correctAnswer)) {
    correctAnswer = parseFloat(correctAnswer.toFixed(2));
  }
  let randomAnswer = generateAnswer(correctAnswer);
  for (let i = 0; i < randomAnswer.length; i++) {
    let answers = document.createElement(vDom[4]);
    answers.textContent = randomAnswer[i];
    answers.classList.add("button");
    answers.addEventListener("click", () => chooseAnswer(correctAnswer, event));
    divforAns.appendChild(answers);
  }
  divfortexts.append(question, divforAns);
  return divfortexts;
}

// Choose Answer
function chooseAnswer(correctAnswer, event) {
  let countDown = document.getElementById("timer");
  event.preventDefault();
  const ansChoice = event.target.textContent;
  let gameContent = document.getElementById("gameContent");
  if (correctAnswer == ansChoice) {
    countDown.remove();
    timer = 60;
    gamewinsound();
    gameContent.remove();
    let gameWin = correctAns();
    start.classList.add("d-none");
    content.append(gameWin);
    clearInterval(gametime);
  } else {
    let hearts = document.getElementById("hearts");
    life--;
    hearts.removeChild(hearts.lastChild);
    wrongChoiceSound();
    event.target.style.backgroundImage = "url('../img/icon2.png')";
    event.target.setAttribute("disabled", true);
    event.target.removeEventListener("click", chooseAnswer);
    start.classList.add("d-none");
    if (life == 0) {
      timer = 60;
      countDown.remove();
      clearInterval(gametime);
      gamelosesound();
      gameContent.remove();
      let gameLose = worngAns();
      start.classList.add("d-none");
      content.append(gameLose);
      hearts.remove();
    }
  }
  playsound();
}
function correctAns() {
  life = life;
  let heart = document.getElementById("hearts");
  heart.remove();
  const exit = document.getElementById("exit");
  exit.remove();
  let gameWinDiv = document.createElement(vDom[1]);
  gameWinDiv.classList.add("text", "text-center", "gameresult");
  let gameWintext = document.createElement(vDom[0]);
  gameWintext.textContent = gameresult[0];
  let nextGame = document.createElement(vDom[0]);
  nextGame.textContent = gameresult[2];
  nextGame.addEventListener("click", () => startGame(life));
  gameWinDiv.append(gameWintext);
  gameWinDiv.append(nextGame);
  return gameWinDiv;
}
function worngAns() {
  life = 3;
  const exit = document.getElementById("exit");
  exit.remove();
  let gameLoseDiv = document.createElement(vDom[1]);
  gameLoseDiv.classList.add("text", "text-center", "gameresult");
  let gameLosetext = document.createElement(vDom[0]);
  gameLosetext.textContent = gameresult[1];
  let tryAgain = document.createElement(vDom[0]);
  tryAgain.textContent = gameresult[3];
  tryAgain.addEventListener("click", () => startGame(life));
  gameLoseDiv.append(gameLosetext);
  gameLoseDiv.append(tryAgain);
  return gameLoseDiv;
}

// Life Count
function lifeCount(life, event) {
  event.preventDefault();
  let divforHearts = document.createElement(vDom[2]);
  divforHearts.setAttribute("id", "hearts");
  for (let i = 0; i < life; i++) {
    divforHearts.setAttribute("style", "z-index:100");
    let lifeTime = document.createElement(vDom[3]);
    lifeTime.classList.add("fa", "fa-heart", "mr-auto");
    divforHearts.append(lifeTime);
    blackboard.append(divforHearts);
  }
}

// Game Timer
function gameTimer() {
  let countDown = document.createElement(vDom[0]);
  countDown.setAttribute("id", "timer");
  countDown.innerText = "";
  gametime = setInterval(() => {
    timer--;
    countDown.innerText = timer;
    if (timer < 11) {
      timersound();
    }
    if (timer < 1) {
      clearInterval(gametime);
      setTimeout(resetimer, 2000);
    }
  }, 1000);
  image.append(countDown);
}
function resetimer() {
  timer = 60;
  let countDown = document.getElementById("timer");
  countDown.remove();
  life--;
  if (life == 0) {
    gamelosesound();
    gameContent.remove();
    let gameLose = worngAns();
    start.classList.add("d-none");
    content.append(gameLose);
    hearts.remove();
    countDown.remove();
  } else {
    gameTimer();
    let hearts = document.getElementById("hearts");
    hearts.removeChild(hearts.lastChild);
    wrongChoiceSound();
    start.classList.add("d-none");
  }
}

// Game action
function exitGame(event) {
  event.preventDefault();
  let countDown = document.getElementById("timer");
  clearInterval(gametime);
  let hearts = document.getElementById("hearts");
  const gameContent = document.getElementById("gameContent");
  const exit = document.getElementById("exit");
  const divforExit = document.createElement(vDom[1]);
  divforExit.classList.add("text-center", "exitQ");
  const exitQues = document.createElement(vDom[0]);
  exitQues.textContent = gameExit[0];
  const divforYN = document.createElement(vDom[1]);
  divforYN.classList.add("d-flex", "justify-content-center", "mt-4", "gap-4");
  hearts.setAttribute("style", "opacity:0; z-index:-100");
  const yes = document.createElement(vDom[0]);
  yes.textContent = gameExit[1];
  yes.onclick = function (event) {
    countDown.remove();
    timer = 60;
    event.preventDefault();
    life = 3;
    hearts.remove();
    playsound();
    divforExit.remove();
    exit.remove();
    start.classList.remove("d-none");
    gameContent.remove();
    about.classList.remove("d-none");
  };
  const no = document.createElement(vDom[0]);
  no.textContent = gameExit[2];
  no.onclick = function (event) {
    countDown.remove();
    timer = countDown.innerText;
    gameTimer();
    event.preventDefault();
    exit.classList.remove("d-none");
    playsound();
    divforExit.remove();
    start.classList.add("d-none");
    gameContent.setAttribute("style", "opacity:1; z-index:100");
    hearts.setAttribute("style", "opacity:1; z-index:100");
  };
  divforYN.append(yes, no);
  divforExit.append(exitQues, divforYN);
  return divforExit;
}

function aboutGame() {
  playsound();
  if (about.textContent == "about") {
    about.textContent = "back";
    let detailUl = document.createElement(vDom[2]);
    for (let i = 0; i < aboutcontent.length; i++) {
      let detailli = document.createElement(vDom[3]);
      detailli.classList.add("lists");
      detailli.textContent = aboutcontent[i];
      detailUl.append(detailli);
      detailUl.setAttribute("id", "aboutlist");
    }
    blackboard.append(detailUl);
    start.setAttribute("style", "opacity:0; z-index:-1");
  } else {
    let aboutList = document.getElementById("aboutlist");
    aboutList.remove();
    about.textContent = "about";
    start.setAttribute("style", "opacity:1; z-index:100");
    aboutList.remove();
  }
}
about.onclick = aboutGame;

// Sounds
function backgroundMusic() {
  let bg_music = document.createElement(vDom[5]);
  bg_music.setAttribute("id", "bg-music");
  bg_music.setAttribute("src", "background_music.mp3");
  bg_music.setAttribute("autoplay", false);
  bg_music.setAttribute("loop", true);
  document.body.append(bg_music);
}
backgroundMusic();
const sound = document.getElementById("bg-music");
function playsound() {
  let btnsound = new Audio("buttonclick2.wav");
  btnsound.loop = false;
  btnsound.play();
}
function gamelosesound() {
  let gamelosesound = new Audio("gamelose.mp3");
  gamelosesound.loop = false;
  sound.muted = true;
  gamelosesound.play().then(() => {
    if (muteSound.classList.contains("fa-volume-off")) {
      sound.muted = true;
      sound.autoplay = false;
    } else {
      setTimeout(() => {
        sound.muted = false;
      }, 4000);
    }
  });
}
function gamewinsound() {
  let gamewinsound = new Audio("gamewin.wav");
  gamewinsound.loop = false;
  sound.muted = true;
  gamewinsound.play().then(() => {
    if (muteSound.classList.contains("fa-volume-off")) {
      sound.muted = true;
      sound.autoplay = false;
    } else {
      setTimeout(() => {
        sound.muted = false;
      }, 2000);
    }
  });
}
function wrongChoiceSound() {
  let wrong_choice_sound = new Audio("wrong-47985.mp3");
  wrong_choice_sound.loop = false;
  sound.muted = true;
  wrong_choice_sound.play().then(() => {
    if (muteSound.classList.contains("fa-volume-off")) {
      sound.muted = true;
      sound.autoplay = false;
    } else {
      setTimeout(() => {
        sound.muted = false;
      }, 2000);
    }
  });
}
function mutedSound(event) {
  event.preventDefault();
  playsound();
  if (muteSound.classList.contains("fa-volume-high")) {
    sound.muted = true;
    sound.autoplay = false;
    muteSound.classList.remove("fa-volume-high");
    muteSound.classList.add("fa-volume-off");
  } else {
    sound.muted = false;
    muteSound.classList.add("fa-volume-high");
    muteSound.classList.remove("fa-volume-off");
    sound.currentTime = 0;
  }
}
function timersound() {
  let timersound = new Audio("timer.mp3");
  timersound.loop = false;
  timersound.play();
}
