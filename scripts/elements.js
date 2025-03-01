let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || {};
let score = 0;
let currentQuizId = null;
let overlay = document.querySelector('.menu-overlay');
let header2 = document.getElementById('header2');
let menu = document.querySelector('.header-icon');
const container = document.querySelector('.blurb-container');
let removalDirection = 1;
let animating = false;

export default {
  completedQuizzes,
  score,
  currentQuizId,
  overlay,
  header2,
  menu,
  container,
  removalDirection,
  animating,
};
