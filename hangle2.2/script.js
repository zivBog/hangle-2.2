import { WORDS1 } from "./words1.js";
import { WORDS2 } from "./words2.js";
import { WORDS3 } from "./words3.js";
import { WORDS } from "./words.js";
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let currentWordList = WORDS; // Default word list
let rightGuessString = currentWordList[Math.floor(Math.random() * currentWordList.length)];

console.log(rightGuessString);

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    toastr.error("Not enough letters!");
    return;
  }

  if (!currentWordList.includes(guessString)) {
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = ["gray", "gray", "gray", "gray", "gray"];

  //check green
  for (let i = 0; i < 5; i++) {
    if (rightGuess[i] == currentGuess[i]) {
      letterColor[i] = "green";
      rightGuess[i] = "#";
    }
  }

  //check yellow
  //checking guess letters
  for (let i = 0; i < 5; i++) {
    if (letterColor[i] == "green") continue;

    //checking right letters
    for (let j = 0; j < 5; j++) {
      if (rightGuess[j] == currentGuess[i]) {
        letterColor[i] = "yellow";
        rightGuess[j] = "#";
        break;
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = letterColor[i];
      shadeKeyBoard(guessString.charAt(i), letterColor[i]);
    }, delay);
  }

  guessesRemaining -= 1;
  currentGuess = [];
  nextLetter = 0;

  document.getElementById("hang-img").src = `images/hangman-${6 - guessesRemaining}.svg`;

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    guessesRemaining = 0;
    return;
  } 

  if (guessesRemaining === 0) {
    toastr.error("You've run out of guesses! Game over!");
    toastr.info(`The right word was: "${rightGuessString}"`);
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

document.getElementById("grade-4").addEventListener("click", () => {
  currentWordList = WORDS1;
  resetGame();
});

document.getElementById("grade-5").addEventListener("click", () => {
  currentWordList = WORDS2;
  resetGame();
});

document.getElementById("grade-6").addEventListener("click", () => {
  currentWordList = WORDS3;
  resetGame();
});

function resetGame() {
  guessesRemaining = NUMBER_OF_GUESSES;
  currentGuess = [];
  nextLetter = 0;
  rightGuessString = currentWordList[Math.floor(Math.random() * currentWordList.length)];
  console.log(rightGuessString);
  document.getElementById("game-board").innerHTML = "";
  initBoard();
  document.getElementById("hang-img").src = "images/hangman-0.svg";
}

initBoard();

function saveCredentials(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
}
  
 




document.addEventListener('DOMContentLoaded', function () {
  // Check if the user is signed in
  const username = localStorage.getItem('username');
  const statsButton = document.getElementById('stats-button');

  if (username == null) {
    classesDropdown.style.display = 'none';
  } else {
    classesDropdown.style.display = 'block';
  }

  }
);

// Define variables for the sign-up form and the greeting message
const signupForm = document.getElementById('signup-form');
const rulesElement = document.querySelector('.rules');

// Event listener for the sign-up form submission
signupForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Save username and password to localStorage (for demonstration purposes)
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);

  // Display greeting message
  const greetingMessage = document.createElement('p');
  greetingMessage.textContent = `שלום, ${username}!`;
  rulesElement.insertAdjacentElement('beforebegin', greetingMessage);

});


