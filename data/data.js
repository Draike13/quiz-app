// export async function getQuiz(category, difficulty) {
//   return fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
//     .then((response) => response.json())
//     .then((data) => {
//       fullQuiz = data;
//     })
//     .catch((error) => console.error('Error fetching affirmation:', error));
// }
export let fullQuiz = [];
const numOfQuestions = 3;

export async function getQuiz(category, difficulty) {
  let URL = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    fullQuiz = data;
  } catch (error) {
    console.error('Error fectching quiz', error);
    return null;
  }
}
