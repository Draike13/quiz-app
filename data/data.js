export async function getQuiz(category, difficulty) {
  return fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
    .then((response) => response.json())
    .then((data) => {
      fullQuiz = data;
    })
    .catch((error) => console.error('Error fetching affirmation:', error));
}
export let fullQuiz = [];
const numOfQuestions = 3;
