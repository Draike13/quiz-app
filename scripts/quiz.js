import element from './elements.js';
import { getQuiz, fullQuiz } from '../data/data.js';
import { addStar, displayScore } from './score.js';

class Question {
  constructor(question) {
    this.question = question.question;
    this.cAnswer = question.correct_answer;
    this.iAnswers = question.incorrect_answers;
    this.answers = this.#calcAllAnswers([...this.iAnswers], this.cAnswer);
    this.difficulty = question.difficulty;
    this.category = question.category;
  }

  #calcAllAnswers(iAnswers, cAnswer) {
    const randomIndex = Math.floor(Math.random() * (iAnswers.length + 1));
    iAnswers.splice(randomIndex, 0, cAnswer);
    return iAnswers;
  }
}

function buildQuestions(question) {
  return new Question(question);
}

export function selectQuiz(event) {
  //determines which quiz was selected from the header2
  let menuItem = event.target.closest('.item');
  let difficultyParent = event.target.closest('.difficulty');
  if (menuItem && difficultyParent) {
    let difficulty = difficultyParent.dataset.difficulty;
    let category = menuItem.value;
    element.currentQuizId = menuItem.id;
    return { category, difficulty };
  }
}

export function displayQuiz(category, difficulty) {
  //checks if quiz has been completed then calls the api and start quiz functions
  if (document.getElementById(element.currentQuizId).classList.contains('fa-solid')) {
    document.querySelector('.blurb-container').innerHTML = "You've already completed this one, why not try a different quiz?";
  } else {
    getQuiz(category, difficulty).then(() => {
      let quizQuestions = fullQuiz.results.map((question) => buildQuestions(question));
      startQuiz(quizQuestions);
      element.header2.classList.remove('open');
      element.overlay.classList.remove('active');
    });
  }
}

function activateQuiz(quizArray) {
  //sets blurb container and other values to active quiz
  element.container.classList.add('quiz-active');
  element.score = 0;
  const quizLength = quizArray.length;
  return quizLength;
}

function buildQuizContainer(quizArray) {
  //creates the quiz container and card stack
  let quizContainer = document.createElement('div');
  quizContainer.classList.add('quiz-container');
  element.container.appendChild(quizContainer);

  let cardStack = document.createElement('div');
  cardStack.classList.add('card-stack');
  quizContainer.appendChild(cardStack);

  quizArray.forEach((quiz, index) => {
    const card = document.createElement('div');
    card.classList.add('quiz-card');

    if (index !== 0) {
      card.classList.add('hidden');
    }
    card.dataset.correct = quiz.cAnswer;
    card.innerHTML = `
    <div class="question-bubble">${quiz.question}</div>
    <div class="answer-bubble">${quiz.answers[0]}</div>
    <div class="answer-bubble">${quiz.answers[1]}</div>
    <div class="answer-bubble">${quiz.answers[2]}</div>
    <div class="answer-bubble">${quiz.answers[3]}</div>
  `;
    cardStack.appendChild(card);
  });
}

function checkAnswer(selected, correct, target) {
  //checks to see if the selected answer is correct
  if (selected === correct) {
    target.classList.add('correct');
    element.score++;
  } else {
    target.classList.add('wrong');
    showAnswer(correct);
  }
}

function showAnswer(correct) {
  //highlights the correct answer bubble in green
  const bubbles = document.querySelectorAll('.quiz-card:not(.hidden) .answer-bubble');
  bubbles.forEach((bubble) => {
    if (bubble.innerHTML === correct) {
      bubble.classList.add('correct');
    }
  });
}

async function nextQuestion(topCard, quizLength) {
  // helper to remove the current card and make the next one down visible
  element.animating = true;
  await delay(2000);
  await removeCard(topCard);
  await nextCard(quizLength);
  element.animating = false;
}

async function removeCard(topCard) {
  //removed the current visible card in alternating directions
  if (element.removalDirection === 1) {
    topCard.classList.add('remove-card-right');
  } else {
    topCard.classList.add('remove-card-left');
  }
  element.removalDirection = -element.removalDirection;
  await delay(700);
  topCard.remove();
}

async function nextCard(quizLength) {
  //loads the next card in the stack
  const nextCard = document.querySelector('.quiz-card.hidden');
  if (nextCard) {
    nextCard.classList.remove('hidden');
  } else {
    await delay(700);
    const finalScore = displayScore(element.score, quizLength);
    addStar(element.currentQuizId, finalScore);
  }
}

async function startQuiz(quizArray) {
  //launches the function chain that opens a quiz to play
  const quizLength = activateQuiz(quizArray);
  delay(700);
  element.container.innerHTML = '';
  buildQuizContainer(quizArray);
  let quizContainer = document.querySelector('.quiz-container');
  let cardStack = document.querySelector('.card-stack');
  delay(250);
  quizContainer.classList.add('show');

  cardStack.addEventListener('click', (event) => {
    if (element.animating) return;
    if (event.target.classList.contains('answer-bubble')) {
      const topCard = document.querySelector('.quiz-card:not(.hidden)');
      if (!topCard) return;

      const correctAnswer = topCard.dataset.correct;
      const selectedAnswer = event.target.innerHTML;

      checkAnswer(selectedAnswer, correctAnswer, event.target);
      nextQuestion(topCard, quizLength);
    }
  });
}

//awesome reusable async function that can be called to g
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
