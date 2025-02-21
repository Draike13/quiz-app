import { getQuiz, quizBook } from '../data/data.js';

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
    console.log(category, difficulty);
    getQuiz(category, difficulty).then(() =>
      quizBook.results.forEach((question) => {
        buildQuestions(question);
      })
    );
  }
}

function buildQuestions(question) {
  let quizQuestion = new Question(question);
  console.log(quizQuestion);
  console.log(quizQuestion.answers);
}

document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
