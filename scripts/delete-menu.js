import element from './elements.js';
import { loadCompleteQuizzes } from './helper.js';

export function buildResetPage() {
  element.container.innerHTML = '';
  let quizContainer = document.createElement('div');
  quizContainer.classList.add('quiz-container');
  element.container.appendChild(quizContainer);
  quizContainer.innerHTML = `
    <div class="delete-menu">
      <div class="prompt-d">Wold you like to reset any of your completed quizzes? <br><br> WARNING: This is perminant!</div>
      <div class="easy-button-d d-button" data-difficulty="easy">Reset Easy Quizzes</div>
      <div class="med-button-d d-button" data-difficulty="med">Reset Medium Quizzes</div>
      <div class="hard-button-d d-button" data-difficulty="hard">Reset Hard Quizzes</div>
      <div class="all-button-d d-button" data-difficulty="all">Reset All Quizzes</div>
  </div>
    `;
  //fades in the card and buttons on the blurb for deletes
  setTimeout(() => {
    quizContainer.classList.add('show');
  }, 250);
}

function resetQuizzes(difficulty) {
  Object.keys(element.completedQuizzes).forEach((key) => {
    if (key.startsWith(difficulty)) {
      delete element.completedQuizzes[key];
    }
  });
  updateQuizMenu();
}

function resetAllQuizes() {
  element.completedQuizzes = {};
  updateQuizMenu();
}

function updateQuizMenu() {
  localStorage.setItem('completedQuizzes', JSON.stringify(element.completedQuizzes));
  requestAnimationFrame(() => {
    loadCompleteQuizzes();
  });
}

export function deleteBtn(event) {
  let btn = event.target.closest('.d-button');
  if (btn) {
    let difficulty = btn.dataset.difficulty;
    if (confirm(`Are you sure you want to delete ${difficulty} quizzes?`)) {
      if (difficulty === 'all') {
        resetAllQuizes();
      } else {
        resetQuizzes(difficulty);
      }
    } else {
      console.log('Nothing deleted');
    }
  }
}
