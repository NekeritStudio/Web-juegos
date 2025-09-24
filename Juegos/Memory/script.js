const cards = ['🍎', '🍏', '🍊', '🍋', '🍇', '🍉', '🍌', '🍓'];
const gameBoard = document.getElementById('game-board');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');

let gameCards = [...cards, ...cards];
let flippedCards = [];
let matchedCards = 0;
let lockBoard = false;
let score = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    shuffle(gameCards);
    gameBoard.innerHTML = '';
    gameCards.forEach(cardValue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        // Correcto: sumar 10 puntos
        score += 10;
        updateScore();
        disableCards();
    } else {
        // Incorrecto: restar 5 puntos y voltear
        score -= 5;
        updateScore();
        unflipCards();
    }
}

function disableCards() {
    const [card1, card2] = flippedCards;
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchedCards++;
    resetBoard();
    if (matchedCards === cards.length) {
        messageEl.textContent = '¡Ganaste!';
    }
}

function unflipCards() {
    setTimeout(() => {
        const [card1, card2] = flippedCards;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    flippedCards = [];
    lockBoard = false;
}

function updateScore() {
    scoreEl.textContent = `Puntaje: ${score}`;
}

function startGame() {
    score = 0;
    matchedCards = 0;
    messageEl.textContent = '';
    updateScore();
    resetBoard();
    createBoard();
}

startGame();