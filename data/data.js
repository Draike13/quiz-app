export async function getQuiz(API) {
  return fetch(API)
    .then((response) => response.json())
    .then((data) => {
      quizBookEasy.push(data);
    })
    .catch((error) => console.error('Error fetching affirmation:', error));
}
export let quizBookEasy = [];
// document.addEventListener('DOMContentLoaded', getQuiz);
