export async function getQuiz(API) {
  return fetch(API)
    .then((response) => response.json())
    .then((data) => {
      quizBook.push(data);
    })
    .catch((error) => console.error('Error fetching affirmation:', error));
}
export let quizBook = [];
// document.addEventListener('DOMContentLoaded', getQuiz);
