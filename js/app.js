/*
 * Create a list that holds all of your cards
 */

const li = document.getElementById("card-list");
const scorePanel = document.getElementById("score-panel");
const movesSpan = document.querySelector(".score-panel span.moves");
const scorePanelStarList = document.querySelector(".score-panel .stars")
const timerSpan = document.querySelector("#score-panel .timer");
const cards = li.children;
const restart = document.querySelector(".restart");
const modal = document.querySelector('.modal');
const modalRestart = document.querySelector('.modal .restart');
const modalStars = document.querySelector('.modal .stars');
const modalMoves = document.querySelector('.modal .moves');

let gameState = {
    clicksInCurrentMove: 0,
    moves: 0,
    cardMatch: [],
    matchesRemaining: 8,
    timer: 0,
    gameActive: false,
 };

function stopWatch() {
    if (gameState.gameActive) {
        gameState.timer += 1;
        timerSpan.textContent = `${gameState.timer} s`; 
    }
}

function initializeGame() {
    /* Re-shuffle the cards. HTMLCollection must be converted to an array
     * in order for the shuffle function to work.
     */
    const shuffled_cards = shuffle(Array.from(cards));

    // Remove all 'open', 'show', and 'match' classes to cards back over.
    // Then append the card elements to update the position of the 
    // shuffled cards
    for (card of shuffled_cards) {
        card.classList.remove("open");
        card.classList.remove("show");
        card.classList.remove("match");
        li.append(card);
    }

    // Reset game state to initial value
    gameState.clicksInCurrentMove = 0;
    gameState.moves = 0;
    gameState.cardMatch = [];
    gameState.matchesRemaining = 8;
    gameState.timer = 0;
    gameState.gameActive = false;

    // Reset stars and moves counter.
    for (let starItem of scorePanelStarList.children) {
        const star = starItem;
        star.classList.add("fa-star");
        star.classList.remove("fa-star-o");
    }
    // Reset timer
    timerSpan.textContent = `${gameState.timer} s`;
    updateScore();
}

initializeGame();


function resolveGameState() {
        gameState.moves += 1;
        gameState.clicksInCurrentMove = 0;
        card1 = gameState.cardMatch.shift();
        card2 = gameState.cardMatch.shift();
        // Matching condition
        if (card1.firstElementChild.classList[1] == card2.firstElementChild.classList[1]) {
            // If match, restyle elements and subtract a match!
            card1.classList.add("match")
            card2.classList.add("match")

            gameState.matchesRemaining -= 1;
        }

        updateScore();
        // Either way, remove open and show classes.
        card1.classList.remove("open");
        card1.classList.remove("show");
        card2.classList.remove("open");
        card2.classList.remove("show");

        if (gameState.matchesRemaining == 0) {
            winGame();
        }
}

function winGame() {
    gameState.gameActive = false;
    updateStars(modalStars);
    modalMoves.textContent = `It took ${gameState.moves} moves and ${gameState.timer} seconds!`;
    modal.style.display = "block";
}

function updateStars(starList) {
    if ((gameState.moves + gameState.matchesRemaining) >= 13) {
        const star = starList.children[2];
        star.classList.remove("fa-star");
        star.classList.add("fa-star-o");
    }
    if ((gameState.moves + gameState.matchesRemaining) >= 15) {
        const star = starList.children[1];
        star.classList.remove("fa-star");
        star.classList.add("fa-star-o");
    }
    if ((gameState.moves + gameState.matchesRemaining) >= 18) {
        const star = starList.children[0];
        star.classList.remove("fa-star");
        star.classList.add("fa-star-o");
    }
}


function updateScore() {
    movesSpan.textContent = `${gameState.moves} moves`;
    updateStars(scorePanelStarList);
}

function clickBoard(event) {
    let target = event.target;
    if ((target.tagName == "LI") && (target.classList.length == 1) && (gameState.clicksInCurrentMove < 2)) {
        target.classList.add("open");
        target.classList.add("show");
        gameState.clicksInCurrentMove += 1;
        gameState.gameActive = true;
        gameState.cardMatch.push(target);
        // Wait for a while before resolving the game state
        // so the user can see the cards.
        if (gameState.clicksInCurrentMove == 2) {
            setTimeout(resolveGameState, 1250);
        }
    }
}


li.addEventListener('click', clickBoard);
restart.addEventListener('click', initializeGame);
modalRestart.addEventListener('click', () => {
    modal.style.display = 'none';
    initializeGame();
})


/*
 * Inlined from shuffle-array
 * https://github.com/pazguille/shuffle-array
 *
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Boolean} [options.copy] - Sets if should return a shuffled copy of the given array. By default it's a falsy value.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle expect an array as parameter.');
  }

  options = options || {};

  var collection = arr,
      len = arr.length,
      rng = options.rng || Math.random,
      random,
      temp;

  if (options.copy === true) {
    collection = arr.slice();
  }

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
};

setInterval(stopWatch, 1000);