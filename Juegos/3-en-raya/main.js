let board = ['', '', '', '', '', '', '', '', ''];
let turn = 'X';
let gameOver = false;
const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
];

function showModal() {
    document.getElementById('welcomeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('welcomeModal').style.display = 'none';
}

function empezar() {
    showModal();
}

function reset() {


    board = ['', '', '', '', '', '', '', '', ''];
    turn = 'X';
    gameOver = false;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('occupied', 'x', 'o');
            // Resetear estilos de las casillas ganadoras
        cell.style.background = '';
        cell.style.transform = '';
        cell.style.boxShadow = '';
    });

    document.getElementById('message').innerHTML = '';
    document.getElementById('message').classList.remove('winner', 'draw');
    document.getElementById('turn').innerHTML = turn;

    // Animación de reset
    document.querySelectorAll('.cell').forEach((cell, index) => {
        setTimeout(() => {
            cell.style.animation = 'placeMarker 0.3s ease-out';
            setTimeout(() => {
                cell.style.animation = '';
            }, 300);
        }, index * 50);
    });
}

function handleClick(id) {
    if (gameOver || board[id] !== '') {
        return;
    }

    const cell = document.getElementById(id);
    cell.innerHTML = turn;
    cell.classList.add('occupied', turn.toLowerCase());
    board[id] = turn;

    if (checkWin()) {
        gameOver = true;
        const messageEl = document.getElementById('message');
        messageEl.innerHTML = `🎉 ¡${turn} ha ganado!`;
        messageEl.classList.add('winner');

        // Efecto de confeti (simulado con partículas)
        setTimeout(() => {
            createConfetti();
        }, 100);

        return;
    }

    if (board.every(cell => cell !== '')) {
        gameOver = true;
        const messageEl = document.getElementById('message');
        messageEl.innerHTML = '🤝 ¡Empate!';
        messageEl.classList.add('draw');
        return;
    }

    switchTurn();
}

function switchTurn() {
    turn = turn === 'X' ? 'O' : 'X';
    document.getElementById('turn').innerHTML = turn;
}

function checkWin() {
    for (let i = 0; i < winCombinations.length; i++) {
        const [a, b, c] = winCombinations[i];
        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            // Resaltar la combinación ganadora
            setTimeout(() => {
                [a, b, c].forEach(index => {
                    document.getElementById(index).style.background =
                        'linear-gradient(45deg, #4ecdc4, #44a08d)';
                    document.getElementById(index).style.transform = 'scale(1.1)';
                    document.getElementById(index).style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.6)';
                });
            }, 100);
            return true;
        }
    }
    return false;
}

function createConfetti() {
    const colors = ['#f093fb', '#f5576c', '#4ecdc4', '#667eea', '#764ba2'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '1000';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';

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

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    const modal = document.getElementById('welcomeModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Inicializar el juego
window.onload = empezar;