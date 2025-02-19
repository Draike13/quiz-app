import { getQuiz, quizBookEasy } from '../data/data.js';
let easyBookQuizAPI = 'https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple';
let overlay = document.querySelector('.menu-overlay');
let header2 = document.getElementById('header2');
let menu = document.querySelector('.header-icon');
let easy = document.querySelector('.easy');
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
    quizBookEasy[0].results.forEach((question) => {
      console.log(question.question);
    })
  );
}

document.addEventListener('click', menuControl);
easy.addEventListener('click', openEasy);
