/* This is an example JavaScript file, feel free to remove/edit it anytime 
console.log(
  "%cProject by BigDevSoon",
  'font-size: 40px; font-weight: bold; color: #8A2BE2; font-family: "Comic Sans MS", cursive, sans-serif;'
);
console.log("Check out more projects at https://bigdevsoon.me");*/
 
let selectedAnswers = [];
let quizArr = [];
const quizContainer = document.getElementById("quiz-container");
const answered = document.createElement("div");
answered.id = "review-container"

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
        selectedAnswers = []
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
    selectedAnswers.push({
      q_Num: currentQuestion,
      ques: quizArr[currentQuestion].question,
      selectedAns: e.innerHTML,
      corAns: quizArr[currentQuestion].correct_answer
    })
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
  const containerScore = document.createElement("div");
  containerScore.id = "score-container"
  const bar = document.createElement("div");
  bar.id = "progress-bar";
  bar.innerHTML = `${score}/${quizArr.length}`
  bar.style.background = `radial-gradient(closest-side, #200159 79%, transparent 80% 100%), conic-gradient(#B6BBC4 ${score * 10}%, #31304D 0)`
  const quizResult = document.createElement("h3");
  quizResult.innerHTML = `You scored ${score} <br/> out of ${quizArr.length}!`
  quizResult.style.display = "inline-block";
  quizContainer.appendChild(containerScore);
  containerScore.appendChild(bar)
  containerScore.appendChild(quizResult);
  const ansHeading = document.createElement("h4");
  ansHeading.id = "review-ans-heading";
  ansHeading.innerHTML = "Your Answers"
  answered.appendChild(ansHeading)
  renderSelectedAnswers()
  quizContainer.appendChild(answered)
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

function renderSelectedAnswers() {
  selectedAnswers.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card")
    const qContainer = document.createElement("div");
    qContainer.classList.add("ques");
    const qNum = document.createElement("span");
    qNum.classList.add("q-num");
    const answeredQuestion = document.createElement("h3");
    const isCorrect = document.createElement("span");
    isCorrect.classList.add("cor");
    const result = document.createElement("div");
    result.classList.add("ans");
    const yourAns = document.createElement("p");
    yourAns.classList.add("your-ans");
    const trueAns = document.createElement("p");
    trueAns.classList.add("cor-ans")
    qNum.innerHTML = item.q_Num + 1;
    answeredQuestion.innerHTML = item.ques;
    if (item.selectedAns == item.corAns) {
      isCorrect.innerHTML = '<i class="fa-solid fa-check" style="color: #01FF11;"></i>'
    }else {isCorrect.innerHTML = '<i class="fa-regular fa-circle-xmark" style="color: #ff0244;"></i>'}
    if (item.selectedAns == item.corAns) {
      yourAns.innerHTML = item.selectedAns;
      yourAns.style.color = "#01FF11"
      trueAns.innerHTML = "";
    } else {
      yourAns.innerHTML = item.selectedAns;
      yourAns.style.color = "#FF0244"
      trueAns.innerHTML = item.corAns;
      trueAns.style.color = "#01FF11"
    }
    qContainer.appendChild(qNum);
    qContainer.appendChild(answeredQuestion);
    qContainer.appendChild(isCorrect)
    result.appendChild(yourAns);
    result.appendChild(trueAns)
    card.appendChild(qContainer);
    card.appendChild(result)
    answered.appendChild(card)
  })
}

