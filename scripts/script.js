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

let answersArray = [];
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
    getQuiz(category, difficulty).then(() => {
      let quizQuestions = fullQuiz.results.map((question) => buildQuestions(question));
      startQuiz(quizQuestions);
      header2.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

function buildQuestions(question) {
  return new Question(question);
}

function startQuiz(quizArray) {
  const container = document.querySelector('.blurb-container');
  container.classList.add('quiz-active');

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
    <div class="feedback-message">Correct!</div>
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
            }
            animating = false;
          }, 700);
        }, 2000);
      }
    });
  }, 700);
}

document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
