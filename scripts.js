const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
  seconds: 0,
  minutes: 0,
  clearTime: -1
};

// Difficulty settings (max number of moves for each star)
var hard = 15;
var medium = 20;

var modal = $("#win-modal");

//Start time first card is clicked

//Start timer
var startTimer = function() {
  if (timer.seconds === 59) {
    timer.minutes++;
    timer.seconds = 0;
  } else {
    timer.seconds++;
  }

  // Ensure that single digit seconds are preceded with a 0
  var formattedSec = "0";
  if (timer.seconds < 10) {
    formattedSec += timer.seconds;
  } else {
    formattedSec = String(timer.seconds);
  }

  var time = String(timer.minutes) + ":" + formattedSec;
  $(".timer").text(time);
};
// Resets timer state and restarts timer
function resetTimer() {
  clearInterval(timer.clearTime);
  timer.seconds = 0;
  timer.minutes = 0;
  $(".timer").text("0:00");

  timer.clearTime = setInterval(startTimer, 1000);
}

// Toggles win modal on
function showModal() {
  modal.css("display", "block");
}

// Removes last start from remaining stars, updates modal HTML
function removeStar() {
  $(".fa-star")
    .last()
    .attr("class", "fa fa-star-o");
  numStars--;
  $(".num-stars").text(String(numStars));
}

// Restores star icons to 3 stars, updates modal HTML
function resetStars() {
  $(".fa-star-o").attr("class", "fa fa-star");
  numStars = 3;
  $(".num-stars").text(String(numStars));
}

// Updates number of moves in the HTML, removes star if necessary based on difficulty variables
function updateMoveCounter() {
  $(".moves").text(moveCounter);

  if (moveCounter === hard || moveCounter === medium) {
    removeStar();
  }
}

// Returns win condition
function hasWon() {
  if (matched === 16) {
    return true;
  } else {
    return false;
  }
}

// Sets currently open cards to the match state, checks win condition
var setMatch = function() {
  open.forEach(function(card) {
    card.addClass("match");
  });
  open = [];
  matched += 2;

  if (hasWon()) {
    clearInterval(timer.clearTime);
    showModal();
  }
};

// Resets all game state variables and resets all required HTML to default state
var resetGame = function() {
  open = [];
  matched = 0;
  moveCounter = 0;
  resetTimer();
  updateMoveCounter();
  $(".card").attr("class", "card");
  shuffle();
  resetStars();
  resetBoard();
};

// Resets game state and toggles win modal display off
var playAgain = function() {
  resetGame();
  modal.css("display", "none");
};

// Provides a randomized game board on page load
$(updateCards);
