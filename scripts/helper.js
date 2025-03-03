import element from './elements.js';

export function loadCompleteQuizzes() {
  //checks all quizes if they are completed and reloads them for update
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

//awesome reusable async function that can be called to use instead of setTimeout
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
