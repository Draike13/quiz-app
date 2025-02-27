import { getQuiz, fullQuiz } from '../data/data.js';

export class Question {
  constructor(question) {
    this.question = question.question;
    this.cAnswer = question.correct_answer;
    this.iAnswers = question.incorrect_answers;
    this.answers = this.#calcAllAnswers([...this.iAnswers], this.cAnswer);
    this.difficulty = question.difficulty;
    this.category = question.category;
  }

  #calcAllAnswers(iAnswers, cAnswer) {
    const randomIndex = Math.floor(Math.random() * (iAnswers.length + 1));
    iAnswers.splice(randomIndex, 0, cAnswer);
    return iAnswers;
  }
}
let score = 0;
let currentQuizId = null;
let overlay = document.querySelector('.menu-overlay');
let header2 = document.getElementById('header2');
let menu = document.querySelector('.header-icon');

function menuControl(event) {
  if (header2.classList.contains('open')) {
    if (event.target === overlay || event.target === menu) {
      header2.classList.remove('open');
      overlay.classList.remove('active');
    }
  } else if (!header2.classList.contains('.open')) {
    if (event.target === menu) {
      header2.classList.add('open');
      overlay.classList.toggle('active');
    }
  }
}

function openQuiz(event) {
  let menuItem = event.target.closest('.item');
  let difficultyParent = event.target.closest('.difficulty');
  if (menuItem && difficultyParent) {
    let difficulty = difficultyParent.dataset.difficulty;
    let category = menuItem.value;
    currentQuizId = menuItem.id;
    if (document.getElementById(currentQuizId).classList.contains('fa-solid')) {
      document.querySelector('.blurb-container').innerHTML = "You've already completed this one, why not try a different quiz?";
    } else {
      getQuiz(category, difficulty).then(() => {
        let quizQuestions = fullQuiz.results.map((question) => buildQuestions(question));
        startQuiz(quizQuestions);
        header2.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }
}

function buildQuestions(question) {
  return new Question(question);
}

function startQuiz(quizArray) {
  const container = document.querySelector('.blurb-container');
  container.classList.add('quiz-active');
  score = 0;
  const quizLength = quizArray.length;

  //slows down the shift of the container to show quiz card from the original blurb
  setTimeout(() => {
    container.innerHTML = '';

    let quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    container.appendChild(quizContainer);

    let cardStack = document.createElement('div');
    cardStack.classList.add('card-stack');
    quizContainer.appendChild(cardStack);

    quizArray.forEach((quiz, index) => {
      const card = document.createElement('div');
      card.classList.add('quiz-card');

      if (index !== 0) {
        card.classList.add('hidden');
      }
      card.dataset.correct = quiz.cAnswer;
      card.innerHTML = `
    <div class="question-bubble">${quiz.question}</div>
    <div class="answer-bubble">${quiz.answers[0]}</div>
    <div class="answer-bubble">${quiz.answers[1]}</div>
    <div class="answer-bubble">${quiz.answers[2]}</div>
    <div class="answer-bubble">${quiz.answers[3]}</div>
  `;

      cardStack.appendChild(card);
    });
    //sets small delay to make sure card has time to load
    setTimeout(() => {
      quizContainer.classList.add('show');
    }, 250);
    let animating = false;

    let removalDirection = 1;
    cardStack.addEventListener('click', (event) => {
      if (animating) return;
      if (event.target.classList.contains('answer-bubble')) {
        const topCard = document.querySelector('.quiz-card:not(.hidden)');
        if (!topCard) return;
        const correctAnswer = topCard.dataset.correct;
        const selectedAnswer = event.target.innerHTML;
        if (selectedAnswer === correctAnswer) {
          event.target.classList.add('correct');
          score++;
        } else {
          event.target.classList.add('wrong');

          topCard.querySelectorAll('.answer-bubble').forEach((bubble) => {
            if (bubble.innerHTML === correctAnswer) {
              bubble.classList.add('correct');
            }
          });
        }
        console.log('selected', selectedAnswer);

        animating = true;

        //sets delay for countdown to next question
        setTimeout(() => {
          if (removalDirection === 1) {
            topCard.classList.add('remove-card-right');
          } else {
            topCard.classList.add('remove-card-left');
          }
          //sets delay for laoding of next question in the stack after removal animation
          setTimeout(() => {
            topCard.remove();
            removalDirection = -removalDirection;
            const nextCard = document.querySelector('.quiz-card.hidden');
            if (nextCard) {
              nextCard.classList.remove('hidden');
              animating = false;
            } else {
              // adds delay in loading the final score onto page
              setTimeout(() => {
                const finalScore = displayScore(score, quizLength);
                addStar(currentQuizId, finalScore);
              }, 700);
            }
          }, 700);
        }, 2000);
      }
    });
  }, 700);
}

function displayScore(score, numberOfQuestions) {
  const container = document.querySelector('.blurb-container');
  container.innerHTML = '';

  let resultCard = document.createElement('div');
  resultCard.classList.add('quiz-result');
  let finalScore = Math.round((score / numberOfQuestions) * 100);

  resultCard.innerHTML = `
  <div class="final-score">You Scored: ${finalScore}%</div>`;
  container.appendChild(resultCard);
  return finalScore;
}

function addStar(selectedQuiz, score) {
  const passing = 80;
  if (score >= passing) {
    let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || {};
    completedQuizzes[selectedQuiz] = true;
    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    const quizItem = document.getElementById(selectedQuiz);
    quizItem.classList.replace('fa-regular', 'fa-solid');
  }
}

function loadCompleteQuizzes() {
  let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || {};
  for (let quizID in completedQuizzes) {
    if (completedQuizzes[quizID]) {
      let quizItem = document.getElementById(quizID);
      quizItem.classList.replace('fa-regular', 'fa-solid');
    }
  }
}

function buildResetPage() {
  let container = document.querySelector('.blurb-container');
  container.innerHTML = '';
  let quizContainer = document.createElement('div');
  quizContainer.classList.add('quiz-container');
  container.appendChild(quizContainer);
  quizContainer.innerHTML = `
  <div class="delete-menu">
    <div class="prompt-d">Wold you like to reset any of your completed quizes? <br><br> WARNING: This is perminant!</div>
    <div class="easy-button-d d-button">Reset Easy Quizes</div>
    <div class="med-button-d d-button">Reset Medium Quizes</div>
    <div class="hard-button-d d-button">Reset Hard Quizes</div>
    <div class="all-button-d d-button">Reset All Quizes</div>
</div>
  `;
  //fades in the card and buttons on the blurb for deletes
  setTimeout(() => {
    quizContainer.classList.add('show');
  }, 250);
}

document.getElementById('deleteIcon').addEventListener('click', buildResetPage);
document.addEventListener('DOMContentLoaded', loadCompleteQuizzes);
document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
