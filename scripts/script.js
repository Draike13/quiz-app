import { getQuiz, quizBook } from '../data/data.js';
let easyBookQuizAPI = 'https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple';
let mediumBookQuizAPI = 'https://opentdb.com/api.php?amount=10&category=10&difficulty=medium&type=multiple';
let hardBookQuizAPI = 'https://opentdb.com/api.php?amount=10&category=10&difficulty=hard&type=multiple';
let overlay = document.querySelector('.menu-overlay');
let header2 = document.getElementById('header2');
let menu = document.querySelector('.header-icon');
// let easy = document.querySelector('.easy');
// let medium = document.querySelector('.medium');
// let hard = document.querySelector('.hard');

let easyBook = document.getElementById('easyBook');
let medBook = document.getElementById('medBook');
let hardBook = document.getElementById('hardBook');

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

function openEasy() {
  getQuiz(easyBookQuizAPI).then(() =>
    quizBook[0].results.forEach((question) => {
      console.log(question.question);
    })
  );
  document.getElementById('easyMenu').classList.add('open');
}
function openMedium() {
  getQuiz(mediumBookQuizAPI).then(() =>
    quizBook[0].results.forEach((question) => {
      console.log(question.question);
    })
  );
}
function openHard() {
  getQuiz(hardBookQuizAPI).then(() =>
    quizBook[0].results.forEach((question) => {
      console.log(question.question);
    })
  );
}

document.addEventListener('click', menuControl);
easyBook.addEventListener('click', openEasy);
medBook.addEventListener('click', openMedium);
hardBook.addEventListener('click', openHard);
