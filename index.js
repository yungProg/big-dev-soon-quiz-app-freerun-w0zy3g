/* This is an example JavaScript file, feel free to remove/edit it anytime 
console.log(
  "%cProject by BigDevSoon",
  'font-size: 40px; font-weight: bold; color: #8A2BE2; font-family: "Comic Sans MS", cursive, sans-serif;'
);
console.log("Check out more projects at https://bigdevsoon.me");*/

/*const quizArr = [
  {
    type: 'multiple',
    difficulty: 'medium',
    category: 'Science &amp; Nature',
    question: 'Which desert is the only desert in the world where the &quot;Saguaro&quot; cactus grows indigenously?',
    correct_answer: 'The Sonoran Desert',
    incorrect_answers: ['The Sonoran Desert', "gdjd", "jsj", "sksj"]
  },
  {
    type: 'multiple',
    difficulty: 'easy',
    category: 'Entertainment: Video Games',
    question: 'Who is the creator of Touhou project?',
    correct_answer: 'Zun',
    incorrect_answers: ['The Sonoran Desert', "gdjd", "Zun", "sksj"]
  },
  {
    type: 'multiple',
    difficulty: 'medium',
    category: 'Entertainment: Film',
    question: 'Which star actor was in &quot;Top Gun&quot;, &quot;Jerry Maguire&quot; and &quot;Born on the Fourth of July&quot;?',
    correct_answer: 'Tom Cruise',
    incorrect_answers: ['The Sonoran Desert', "Zun", "jsj", "Tom Cruise"]
  },
  {
    type: 'multiple',
    difficulty: 'hard',
    category: 'General Knowledge',
    question: 'According to the 2014-2015 Australian Bureau of Statistics, what percentage of Australians were born overseas?',
    correct_answer: '28%',
    incorrect_answers: ['The Sonoran Desert', "gdjd", "28%", "Tom Cruise"]
  },
  {
    type: 'multiple',
    difficulty: 'medium',
    category: 'Entertainment: Books',
    question: 'In Romance of the Three Kingdoms, who was not a member of the Peach Garden Oath?',
    correct_answer: 'Zhao Yun',
    incorrect_answers: ['The Sonoran Desert', "Tom Cruise", "jsj", "28%"]
  },
  {
    type: 'multiple',
    difficulty: 'easy',
    category: 'General Knowledge',
    question: 'What is on display in the Madame Tussaud&#039;s museum in London?',
    correct_answer: 'Wax sculptures',
    incorrect_answers: ['28%', "gdjd", "Wax sculptures", "Tom Cruise"]
  },
  {
    type: 'multiple',
    difficulty: 'easy',
    category: 'Entertainment: Video Games',
    question: 'In &quot;Yo! Noid 2,&quot; The Noid can perform what special move?',
    correct_answer: 'Dab',
    incorrect_answers: ['easy', "Dab", "jsj", "Video"]
  },
  {
    type: 'multiple',
    difficulty: 'easy',
    category: 'Sports',
    question: 'The Rio 2016 Summer Olympics held it&#039;s closing ceremony on what date?',
    correct_answer: 'August 21',
    incorrect_answers: ['Tom Cruise', "Ultimate", "August 21", "Sports"]
  },
  {
    type: 'multiple',
    difficulty: 'easy',
    category: 'Entertainment: Japanese Anime &amp; Manga',
    question: 'In Digimon, what is the Japanese name for the final evolutionary stage?',
    correct_answer: 'Ultimate',
    incorrect_answers: ['Ultimate', "Sports", "jsj", "sksj"]
  },
  {
    type: 'multiple',
    difficulty: 'hard',
    category: 'Entertainment: Video Games',
    question: 'Which Kingdom Hearts game featured the cast of &quot;The World Ends With You&quot;?',
    correct_answer: 'Dream Drop Distance',
    incorrect_answers: ['Sports', "gdjd", "jsj", "Dream Drop Distance"]
  }
];*/

let quizArr = [];

async function makeServerRequest() {
  const request = await fetch("https://opentdb.com/api.php?amount=10");
  const response = await request.json();
  quizArr = [];
  response.results.forEach(item => {
    item.incorrect_answers.push(item.correct_answer)
    quizArr.push(item)
  });
}
makeServerRequest()

let currentQuestion = 0;
let score = 0;

const quizContainer = document.getElementById("quiz-container");
function startQuiz() {
  resetState()
  quizTitle()
  questionNumber()
  renderQuestion()
  renderAnswers()
  console.log(quizArr)
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