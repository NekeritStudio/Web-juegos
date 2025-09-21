// ===== VARIABLES GLOBALES =====
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let gameMode = 'pvp'; // 'pvp' o 'pve'
let aiDifficulty = 'medium';

const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6] // diagonales
];

// ===== FUNCIONES DE INTERFAZ =====
function showModal() {
    document.getElementById('welcomeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

function setGameMode(mode) {
    gameMode = mode;

    // Actualizar botones
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}-btn`).classList.add('active');

    // Mostrar/ocultar selector de dificultad
    const difficultySelector = document.getElementById('difficulty-selector');
    difficultySelector.style.display = mode === 'pve' ? 'block' : 'none';

    resetGame();
}

function setDifficulty(difficulty) {
    aiDifficulty = difficulty;
}

// ===== LÓGICA DEL JUEGO =====
function playerMove(position) {
    // Verificar si el movimiento es válido
    if (gameOver || board[position] !== '') {
        return;
    }

    // En modo IA, solo permitir movimientos cuando es turno del jugador humano
    if (gameMode === 'pve' && currentPlayer === 'O') {
        return;
    }

    // Hacer el movimiento
    makeMove(position, currentPlayer);

    // Verificar fin del juego
    if (checkWin()) {
        endGame(`🎉 ¡${currentPlayer} ha ganado!`);
        return;
    }

    if (checkDraw()) {
        endGame('🤝 ¡Empate!');
        return;
    }

    // Cambiar turno
    switchPlayer();

    // Si es modo IA y ahora toca a la IA
    if (gameMode === 'pve' && currentPlayer === 'O') {
        setTimeout(aiMove, 800);
    }
}

function makeMove(position, player) {
    board[position] = player;
    const cell = document.getElementById(`cell-${position}`);
    cell.textContent = player;
    cell.classList.add('occupied', player.toLowerCase());
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('turn').textContent = currentPlayer;
}

function checkWin() {
    return winCombinations.some(combination => {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            // Resaltar combinación ganadora
            [a, b, c].forEach(pos => {
                const cell = document.getElementById(`cell-${pos}`);
                cell.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                cell.style.transform = 'scale(1.1)';
                cell.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.6)';
            });
            return true;
        }
        return false;
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function endGame(message) {
    gameOver = true;
    document.getElementById('message').textContent = message;
    document.getElementById('message').classList.add(message.includes('ganado') ? 'winner' : 'draw');

    if (message.includes('ganado')) {
        setTimeout(createConfetti, 200);
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;

    // Limpiar tablero
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('occupied', 'x', 'o');
        cell.style.background = '';
        cell.style.transform = '';
        cell.style.boxShadow = '';
    });

    // Limpiar mensaje
    document.getElementById('message').textContent = '';
    document.getElementById('message').classList.remove('winner', 'draw');

    // Actualizar turno
    document.getElementById('turn').textContent = currentPlayer;
}

// ===== LÓGICA DE IA =====
function aiMove() {
    if (gameOver || currentPlayer !== 'O') {
        return;
    }

    let position = -1;

    switch (aiDifficulty) {
        case 'easy':
            position = getRandomMove();
            break;
        case 'medium':
            position = getMediumMove();
            break;
        case 'hard':
            position = getHardMove();
            break;
    }

    if (position >= 0 && position < 9 && board[position] === '') {
        makeMove(position, 'O');

        if (checkWin()) {
            endGame('🤖 ¡La IA ha ganado!');
            return;
        }

        if (checkDraw()) {
            endGame('🤝 ¡Empate!');
            return;
        }

        switchPlayer();
    }
}

function getRandomMove() {
    const availableMoves = board
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1);

    if (availableMoves.length === 0) return -1;

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove() {
    // 1. Intentar ganar
    let move = findWinningMove('O');
    if (move !== -1) return move;

    // 2. Bloquear al jugador
    move = findWinningMove('X');
    if (move !== -1) return move;

    // 3. Centro
    if (board[4] === '') return 4;

    // 4. Esquinas
    const corners = [0, 2, 6, 8].filter(i => board[i] === '');
    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Cualquier movimiento
    return getRandomMove();
}

function getHardMove() {
    return getMediumMove(); // Por simplicidad, usar la misma lógica
}

function findWinningMove(player) {
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        const line = [board[a], board[b], board[c]];

        // Si tiene 2 fichas del jugador y 1 vacía
        const playerCount = line.filter(cell => cell === player).length;
        const emptyCount = line.filter(cell => cell === '').length;

        if (playerCount === 2 && emptyCount === 1) {
            if (board[a] === '') return a;
            if (board[b] === '') return b;
            if (board[c] === '') return c;
        }
    }
    return -1;
}

// ===== EFECTOS VISUALES =====
function createConfetti() {
    const colors = ['#f093fb', '#f5576c', '#4ecdc4', '#667eea', '#764ba2'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                        position: fixed;
                        width: 10px;
                        height: 10px;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        left: ${Math.random() * window.innerWidth}px;
                        top: -10px;
                        z-index: 1000;
                        border-radius: 50%;
                        pointer-events: none;
                    `;

            document.body.appendChild(confetti);

            confetti.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(720deg)`, opacity: 0 }
            ], {
                duration: 3000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 100);
    }
}

// ===== INICIALIZACIÓN =====
window.onload = showModal;

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    const modal = document.getElementById('welcomeModal');
    if (event.target === modal) {
        closeModal();
    }
}