import element from './elements.js';

export function displayScore(score, numberOfQuestions) {
  element.container.innerHTML = '';

  let resultCard = document.createElement('div');
  resultCard.classList.add('quiz-result');
  let finalScore = Math.round((score / numberOfQuestions) * 100);

  resultCard.innerHTML = `
    <div class="final-score">You Scored: ${finalScore}%</div>`;
  element.container.appendChild(resultCard);
  return finalScore;
}

export function addStar(selectedQuiz, score) {
  const passing = 0;
  if (score >= passing) {
    element.completedQuizzes[selectedQuiz] = true;
    localStorage.setItem('completedQuizzes', JSON.stringify(element.completedQuizzes));
    const quizItem = document.getElementById(selectedQuiz);
    quizItem.classList.replace('fa-regular', 'fa-solid');
  }
}
