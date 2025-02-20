import { getQuiz, quizBook } from '../data/data.js';

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
        console.log(question.difficulty);
        console.log(question.question);
      })
    );
  }
}

document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
