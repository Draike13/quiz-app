import element from './elements.js';

export function loadCompleteQuizzes() {
  let allQuizzes = document.querySelectorAll('.item');

  allQuizzes.forEach((icon) => {
    if (icon.classList.contains('fa-solid')) {
      icon.classList.replace('fa-solid', 'fa-regular');
    }
  });
  for (let quizID in element.completedQuizzes) {
    if (element.completedQuizzes[quizID]) {
      let quizItem = document.getElementById(quizID);
      quizItem.classList.replace('fa-regular', 'fa-solid');
    }
  }
}
