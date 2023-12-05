/* This is an example JavaScript file, feel free to remove/edit it anytime 
console.log(
  "%cProject by BigDevSoon",
  'font-size: 40px; font-weight: bold; color: #8A2BE2; font-family: "Comic Sans MS", cursive, sans-serif;'
);
console.log("Check out more projects at https://bigdevsoon.me");*/
 

let quizArr = [];
const quizContainer = document.getElementById("quiz-container");

async function makeServerRequest() {
  try {
    const request = await fetch("https://opentdb.com/api.php?amount=10");
  const response = await request.json();
  quizArr = [];
  response.results.forEach(item => {
    item.incorrect_answers.push(item.correct_answer)
    quizArr.push(item)
  });
  } catch (error) {
    console.log(error, "Please refresh the page")
  }
}
makeServerRequest()

let currentQuestion = 0;
let score = 0;


function startQuiz() {
  resetState()
  quizTitle()
  questionNumber()
  renderQuestion()
  renderAnswers()
}

//rendering quiz title
function quizTitle() {
  const quizHeading = document.createElement("h1");
  quizHeading.innerHTML = "Brown Quiz"
  quizHeading.id = "quiz-heading";
  quizContainer.appendChild(quizHeading)
}

//rendering question number
function questionNumber() {
  const questionNo = document.createElement("p");
  questionNo.id = "question-number";
  questionNo.innerHTML = `Question ${currentQuestion + 1} out of ${quizArr.length}`
  quizContainer.appendChild(questionNo);
  const currentScore = document.createElement("p");
  currentScore.id = "current-score";
  currentScore.innerHTML = `Score: ${score}`
  quizContainer.appendChild(currentScore);
}

//Rendering question
function renderQuestion() {
  //creating question element
  const questionElement = document.createElement("h2");
  questionElement.classList.add("question");
  questionElement.innerHTML = quizArr[currentQuestion].question
  quizContainer.appendChild(questionElement);
}

//rendering answers
function renderAnswers() {
  quizArr.forEach(item => {
    item.choices = [];
    while (item.choices.length < item.incorrect_answers.length) {
      let randomNum = Math.floor(Math.random() * item.incorrect_answers.length);
      if (!item.choices.includes(item.incorrect_answers[randomNum])) {
        item.choices.push(item.incorrect_answers[randomNum])
      }
    }
  });
  quizArr[currentQuestion].choices.forEach(
    option => {
      const answer = document.createElement("button");
      answer.classList.add("option");
      answer.innerHTML = option;
      if (answer.innerHTML == quizArr[currentQuestion].correct_answer) {
        answer.classList.add("right-answer")
      }
      answer.addEventListener("click", checkAnswer)
      quizContainer.appendChild(answer);
    }
  )
}


//displaying next
function nextQuestion() {
  const next = document.createElement("button");
  next.id = "next";
  if (currentQuestion < quizArr.length) {
    next.innerHTML = "Next";
  } else {
    next.innerHTML = "View score"
  }
  quizContainer.appendChild(next);
  next.addEventListener("click", () => {
    if (next.innerHTML == "Next") {
      startQuiz()
    }else {
      resetState();
      quizTitle();
      finalScore();
      const restart = document.createElement("button");
      restart.classList.add("replay");
      restart.innerHTML = "Play Again";
      quizContainer.appendChild(restart);
      restart.addEventListener("click", () => {
        makeServerRequest()
        replay()
      })
    }
  })
}

function checkAnswer(event) {
  const e = event.target;
  if (e.innerHTML == quizArr[currentQuestion].correct_answer) {
    e.classList.add("correct");
    score++
  } else {
    e.classList.add("incorrect");
  }
  try {
    document.querySelector(".right-answer").style.backgroundColor = "#01FF11"; 
  }finally {
    currentQuestion++;
  nextQuestion();
  disableOptions()
  }
}

function disableOptions() {
  const options = document.querySelectorAll(".option");
  options.forEach(item => {
    item.disabled = true;
  })
}

function finalScore() {
  const quizResult = document.createElement("h3");
  quizResult.innerHTML = `You scored ${score} out of ${quizArr.length}!`
  quizContainer.appendChild(quizResult)
}

function resetState() {
  while(quizContainer.firstChild) {
    quizContainer.removeChild(quizContainer.firstChild)
  }
  quizContainer.style.position = "static"
  quizContainer.style.left = "auto";
  quizContainer.style.top = "auto";
  quizContainer.style.transform = "translate(0, 0)"
  quizContainer.style.marginTop = "5vh";
  quizContainer.style.marginLeft = "auto";
  quizContainer.style.marginRight = "auto"
}

function replay() {
  score = 0;
  currentQuestion = 0;
  startQuiz();
}