import element from './elements.js';
import { getQuiz, fullQuiz } from '../data/data.js';
import { buildResetPage, deleteBtn } from './delete-menu.js';
import { loadCompleteQuizzes } from './helper.js';

class Question {
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

function menuControl(event) {
  if (element.header2.classList.contains('open')) {
    if (event.target === element.overlay || event.target === element.menu) {
      element.header2.classList.remove('open');
      element.overlay.classList.remove('active');
    }
  } else if (!element.header2.classList.contains('.open')) {
    if (event.target === element.menu) {
      element.header2.classList.add('open');
      element.overlay.classList.toggle('active');
    }
  }
}

function openQuiz(event) {
  let menuItem = event.target.closest('.item');
  let difficultyParent = event.target.closest('.difficulty');
  if (menuItem && difficultyParent) {
    let difficulty = difficultyParent.dataset.difficulty;
    let category = menuItem.value;
    element.currentQuizId = menuItem.id;
    if (document.getElementById(element.currentQuizId).classList.contains('fa-solid')) {
      document.querySelector('.blurb-container').innerHTML = "You've already completed this one, why not try a different quiz?";
    } else {
      getQuiz(category, difficulty).then(() => {
        let quizQuestions = fullQuiz.results.map((question) => buildQuestions(question));
        startQuiz(quizQuestions);
        element.header2.classList.remove('open');
        element.overlay.classList.remove('active');
      });
    }
  }
}

function buildQuestions(question) {
  return new Question(question);
}

function startQuiz(quizArray) {
  element.container.classList.add('quiz-active');
  element.score = 0;
  const quizLength = quizArray.length;

  //slows down the shift of the container to show quiz card from the original blurb
  setTimeout(() => {
    element.container.innerHTML = '';

    let quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    element.container.appendChild(quizContainer);

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
          element.score++;
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
                const finalScore = displayScore(element.score, quizLength);
                addStar(element.currentQuizId, finalScore);
              }, 700);
            }
          }, 700);
        }, 2000);
      }
    });
  }, 700);
}

function displayScore(score, numberOfQuestions) {
  element.container.innerHTML = '';

  let resultCard = document.createElement('div');
  resultCard.classList.add('quiz-result');
  let finalScore = Math.round((score / numberOfQuestions) * 100);

  resultCard.innerHTML = `
  <div class="final-score">You Scored: ${finalScore}%</div>`;
  element.container.appendChild(resultCard);
  return finalScore;
}

function addStar(selectedQuiz, score) {
  const passing = 70;
  if (score >= passing) {
    element.completedQuizzes[selectedQuiz] = true;
    localStorage.setItem('completedQuizzes', JSON.stringify(element.completedQuizzes));
    const quizItem = document.getElementById(selectedQuiz);
    quizItem.classList.replace('fa-regular', 'fa-solid');
  }
}

document.addEventListener('click', (event) => deleteBtn(event));
document.addEventListener('DOMContentLoaded', loadCompleteQuizzes);
document.getElementById('deleteIcon').addEventListener('click', buildResetPage);
document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
