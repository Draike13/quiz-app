export async function getQuiz(category, difficulty) {
  return fetch(`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`)
    .then((response) => response.json())
    .then((data) => {
      quizBook = data;
    })
    .catch((error) => console.error('Error fetching affirmation:', error));
}
export let quizBook = [];
