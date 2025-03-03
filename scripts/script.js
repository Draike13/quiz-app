import element from './elements.js';
import { buildResetPage, deleteBtn } from './delete-menu.js';
import { loadCompleteQuizzes } from './helper.js';
import { displayQuiz, selectQuiz } from './quiz.js';

function menuControl(event) {
  //controls header options to open header2 menu
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
  let selected = selectQuiz(event);
  if (selected) {
    displayQuiz(selected.category, selected.difficulty);
  }
}

document.addEventListener('click', deleteBtn);
document.addEventListener('DOMContentLoaded', loadCompleteQuizzes);
document.getElementById('deleteIcon').addEventListener('click', buildResetPage);
document.addEventListener('click', menuControl);
header2.addEventListener('click', openQuiz);
