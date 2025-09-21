// Configuración del juego
        const BOARD_WIDTH = 21;
        const BOARD_HEIGHT = 21;
        
        // Mapa del laberinto (1 = pared, 0 = punto, 2 = power pellet, 3 = vacío)
        const maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,2,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,2,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,0,1,3,3,3,3,3,3,3,1,0,1,1,1,1,1],
            [1,1,1,1,1,0,1,3,1,1,3,1,1,3,1,0,1,1,1,1,1],
            [3,3,3,3,3,0,3,3,1,3,3,3,1,3,3,0,3,3,3,3,3],
            [1,1,1,1,1,0,1,3,1,3,3,3,1,3,1,0,1,1,1,1,1],
            [1,1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1,1],
            [1,1,1,1,1,0,1,3,3,3,3,3,3,3,1,0,1,1,1,1,1],
            [1,1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
            [1,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1],
            [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        // Variables del juego
        let gameBoard = document.getElementById('gameBoard');
        let score = 0;
        let lives = 3;
        let gameRunning = false;
        let powerPelletActive = false;
        let powerPelletTimer = 0;

        // Posición de Pac-Man
        let pacman = {
            x: 10,
            y: 15,
            direction: 'right'
        };

        // Fantasmas iniciales con comportamientos únicos
        let ghosts = [
            { x: 10, y: 8, direction: 'up', color: 'red', scared: false, name: 'blinky', mode: 'chase' },
            { x: 8, y: 8, direction: 'left', color: 'pink', scared: false, name: 'pinky', mode: 'chase' },
            { x: 12, y: 8, direction: 'right', color: 'cyan', scared: false, name: 'inky', mode: 'scatter' },
            { x: 10, y: 12, direction: 'down', color: 'orange', scared: false, name: 'clyde', mode: 'scatter' }
        ];

        let modeTimer = 0;
        let currentMode = 'scatter'; // scatter o chase
        let ghostMoveCounter = 0; // Contador para ralentizar fantasmas

        // Crear el tablero
        function createBoard() {
            gameBoard.innerHTML = '';
            
            for (let row = 0; row < BOARD_HEIGHT; row++) {
                for (let col = 0; col < BOARD_WIDTH; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.id = `cell-${col}-${row}`;
                    
                    switch (maze[row][col]) {
                        case 1:
                            cell.classList.add('wall');
                            break;
                        case 0:
                            cell.classList.add('dot');
                            break;
                        case 2:
                            cell.classList.add('power-pellet');
                            break;
                        case 3:
                            break;
                    }
                    
                    gameBoard.appendChild(cell);
                }
            }
        }

        // Dibujar Pac-Man
        function drawPacman() {
            // Limpiar Pac-Man anterior
            document.querySelectorAll('.pacman').forEach(el => {
                el.classList.remove('pacman', 'up', 'down', 'left', 'right');
            });
            
            const cell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
            cell.classList.add('pacman', pacman.direction);
        }

        // Dibujar fantasmas
        function drawGhosts() {
            // Limpiar fantasmas anteriores
            document.querySelectorAll('.ghost').forEach(el => {
                el.classList.remove('ghost', 'red', 'pink', 'cyan', 'orange', 'scared');
            });
            
            ghosts.forEach(ghost => {
                const cell = document.getElementById(`cell-${ghost.x}-${ghost.y}`);
                cell.classList.add('ghost', ghost.color);
                if (ghost.scared) {
                    cell.classList.add('scared');
                }
            });
        }

        // Mover Pac-Man
        function movePacman(direction) {
            if (!gameRunning) return;
            
            let newX = pacman.x;
            let newY = pacman.y;
            
            switch (direction) {
                case 'up': newY--; break;
                case 'down': newY++; break;
                case 'left': newX--; break;
                case 'right': newX++; break;
            }
            
            // Túnel lateral
            if (newX < 0) newX = BOARD_WIDTH - 1;
            if (newX >= BOARD_WIDTH) newX = 0;
            
            // Verificar colisión con paredes
            if (newY >= 0 && newY < BOARD_HEIGHT && maze[newY][newX] !== 1) {
                pacman.x = newX;
                pacman.y = newY;
                pacman.direction = direction;
                
                // Comer puntos
                if (maze[pacman.y][pacman.x] === 0) {
                    score += 10;
                    maze[pacman.y][pacman.x] = 3;
                    updateScore();
                    checkWin();
                }
                
                // Comer power pellet
                if (maze[pacman.y][pacman.x] === 2) {
                    score += 50;
                    maze[pacman.y][pacman.x] = 3;
                    powerPelletActive = true;
                    powerPelletTimer = 100;
                    ghosts.forEach(ghost => ghost.scared = true);
                    updateScore();
                    checkWin();
                }
            }
        }

        // Obtener objetivo para cada fantasma según su personalidad
        function getGhostTarget(ghost) {
            if (ghost.scared) {
                // Fantasmas asustados huyen a esquinas aleatorias
                const corners = [{x: 1, y: 1}, {x: 19, y: 1}, {x: 1, y: 19}, {x: 19, y: 19}];
                return corners[Math.floor(Math.random() * corners.length)];
            }

            switch (ghost.name) {
                case 'blinky': // Rojo - Persigue directamente a Pac-Man
                    if (currentMode === 'chase') {
                        return {x: pacman.x, y: pacman.y};
                    } else {
                        return {x: 18, y: 1}; // Esquina superior derecha
                    }

                case 'pinky': // Rosa - Embosca 4 casillas adelante de Pac-Man
                    if (currentMode === 'chase') {
                        let targetX = pacman.x;
                        let targetY = pacman.y;
                        switch (pacman.direction) {
                            case 'up': targetY -= 4; break;
                            case 'down': targetY += 4; break;
                            case 'left': targetX -= 4; break;
                            case 'right': targetX += 4; break;
                        }
                        // Mantener dentro del mapa
                        targetX = Math.max(0, Math.min(BOARD_WIDTH - 1, targetX));
                        targetY = Math.max(0, Math.min(BOARD_HEIGHT - 1, targetY));
                        return {x: targetX, y: targetY};
                    } else {
                        return {x: 2, y: 1}; // Esquina superior izquierda
                    }

                case 'inky': // Cian - Comportamiento complejo basado en Blinky y Pac-Man
                    if (currentMode === 'chase') {
                        const blinky = ghosts.find(g => g.name === 'blinky');
                        let pacmanAhead = {x: pacman.x, y: pacman.y};
                        switch (pacman.direction) {
                            case 'up': pacmanAhead.y -= 2; break;
                            case 'down': pacmanAhead.y += 2; break;
                            case 'left': pacmanAhead.x -= 2; break;
                            case 'right': pacmanAhead.x += 2; break;
                        }
                        // Vector desde Blinky hasta punto adelante de Pac-Man, duplicado
                        let targetX = pacmanAhead.x + (pacmanAhead.x - blinky.x);
                        let targetY = pacmanAhead.y + (pacmanAhead.y - blinky.y);
                        targetX = Math.max(0, Math.min(BOARD_WIDTH - 1, targetX));
                        targetY = Math.max(0, Math.min(BOARD_HEIGHT - 1, targetY));
                        return {x: targetX, y: targetY};
                    } else {
                        return {x: 18, y: 19}; // Esquina inferior derecha
                    }

                case 'clyde': // Naranja - Persigue si está lejos, huye si está cerca
                    if (currentMode === 'chase') {
                        const distance = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
                        if (distance > 8) {
                            return {x: pacman.x, y: pacman.y}; // Perseguir como Blinky
                        } else {
                            return {x: 2, y: 19}; // Huir a esquina inferior izquierda
                        }
                    } else {
                        return {x: 2, y: 19}; // Esquina inferior izquierda
                    }

                default:
                    return {x: pacman.x, y: pacman.y};
            }
        }

        // Mover fantasmas con IA real
        function moveGhosts() {
            ghosts.forEach(ghost => {
                const target = getGhostTarget(ghost);
                
                // Obtener movimientos válidos
                const directions = ['up', 'down', 'left', 'right'];
                let validMoves = [];
                
                directions.forEach(dir => {
                    let testX = ghost.x;
                    let testY = ghost.y;
                    
                    switch (dir) {
                        case 'up': testY--; break;
                        case 'down': testY++; break;
                        case 'left': testX--; break;
                        case 'right': testX++; break;
                    }
                    
                    // Túnel lateral
                    if (testX < 0) testX = BOARD_WIDTH - 1;
                    if (testX >= BOARD_WIDTH) testX = 0;
                    
                    // Verificar si es movimiento válido y no retroceder
                    const opposite = {
                        'up': 'down', 'down': 'up',
                        'left': 'right', 'right': 'left'
                    };
                    
                    if (testY >= 0 && testY < BOARD_HEIGHT && 
                        maze[testY][testX] !== 1 && 
                        dir !== opposite[ghost.direction]) {
                        
                        const distance = Math.abs(testX - target.x) + Math.abs(testY - target.y);
                        validMoves.push({
                            direction: dir, 
                            x: testX, 
                            y: testY, 
                            distance: distance
                        });
                    }
                });
                
                // Si no hay movimientos válidos (solo retroceder), permitir retroceder
                if (validMoves.length === 0) {
                    directions.forEach(dir => {
                        let testX = ghost.x;
                        let testY = ghost.y;
                        
                        switch (dir) {
                            case 'up': testY--; break;
                            case 'down': testY++; break;
                            case 'left': testX--; break;
                            case 'right': testX++; break;
                        }
                        
                        if (testX < 0) testX = BOARD_WIDTH - 1;
                        if (testX >= BOARD_WIDTH) testX = 0;
                        
                        if (testY >= 0 && testY < BOARD_HEIGHT && maze[testY][testX] !== 1) {
                            const distance = Math.abs(testX - target.x) + Math.abs(testY - target.y);
                            validMoves.push({
                                direction: dir, 
                                x: testX, 
                                y: testY, 
                                distance: distance
                            });
                        }
                    });
                }
                
                if (validMoves.length > 0) {
                    // Elegir el movimiento que se acerque más al objetivo
                    validMoves.sort((a, b) => {
                        if (ghost.scared) {
                            return b.distance - a.distance; // Alejarse del objetivo si está asustado
                        }
                        return a.distance - b.distance; // Acercarse al objetivo
                    });
                    
                    const bestMove = validMoves[0];
                    ghost.x = bestMove.x;
                    ghost.y = bestMove.y;
                    ghost.direction = bestMove.direction;
                }
            });
        }

        // Verificar colisiones
        function checkCollisions() {
            ghosts.forEach((ghost, index) => {
                if (ghost.x === pacman.x && ghost.y === pacman.y) {
                    if (ghost.scared) {
                        // Comer fantasma
                        score += 200;
                        ghost.scared = false;
                        // Resetear fantasma al centro
                        ghost.x = 10;
                        ghost.y = 10;
                        updateScore();
                    } else {
                        // Pac-Man muere
                        lives--;
                        updateLives();
                        if (lives <= 0) {
                            gameOver();
                        } else {
                            resetPositions();
                        }
                    }
                }
            });
        }

        // Resetear posiciones
        function resetPositions() {
            pacman.x = 10;
            pacman.y = 15;
            pacman.direction = 'right';
            
            // Fantasmas con comportamientos únicos
            ghosts[0] = { x: 10, y: 8, direction: 'up', color: 'red', scared: false, name: 'blinky', mode: 'scatter' };
            ghosts[1] = { x: 8, y: 8, direction: 'left', color: 'pink', scared: false, name: 'pinky', mode: 'scatter' };
            ghosts[2] = { x: 12, y: 8, direction: 'right', color: 'cyan', scared: false, name: 'inky', mode: 'scatter' };
            ghosts[3] = { x: 10, y: 12, direction: 'down', color: 'orange', scared: false, name: 'clyde', mode: 'scatter' };
            
            powerPelletActive = false;
            powerPelletTimer = 0;
            modeTimer = 0;
            currentMode = 'scatter';
            ghostMoveCounter = 0;
        }

        // Verificar victoria
        function checkWin() {
            let dotsLeft = 0;
            for (let row = 0; row < BOARD_HEIGHT; row++) {
                for (let col = 0; col < BOARD_WIDTH; col++) {
                    if (maze[row][col] === 0 || maze[row][col] === 2) {
                        dotsLeft++;
                    }
                }
            }
            
            if (dotsLeft === 0) {
                alert('¡GANASTE! 🎉');
                startGame();
            }
        }

        // Actualizar puntuación
        function updateScore() {
            document.getElementById('score').textContent = score;
        }

        // Actualizar vidas
        function updateLives() {
            document.getElementById('lives').textContent = lives;
        }

        // Game Over
        function gameOver() {
            gameRunning = false;
            document.getElementById('startBtn').textContent = 'INICIAR JUEGO';
            alert(`GAME OVER! Puntuación final: ${score}`);
        }

        // Iniciar juego
        function startGame() {
            score = 0;
            lives = 3;
            gameRunning = true;
            powerPelletActive = false;
            powerPelletTimer = 0;
            
            // Cambiar texto del botón
            document.getElementById('startBtn').textContent = 'REINICIAR JUEGO';
            
            // Restaurar maze original
            for (let row = 0; row < BOARD_HEIGHT; row++) {
                for (let col = 0; col < BOARD_WIDTH; col++) {
                    if (maze[row][col] === 3) {
                        // Restaurar puntos originales (excepto en pasillos de fantasmas)
                        if (row >= 7 && row <= 13 && col >= 7 && col <= 13) {
                            maze[row][col] = 3; // Mantener vacío en zona fantasmas
                        } else {
                            maze[row][col] = 0; // Restaurar punto
                        }
                    }
                }
            }
            
            // Restaurar power pellets
            maze[2][1] = 2; maze[2][19] = 2;
            maze[16][1] = 2; maze[16][19] = 2;
            
            resetPositions();
            createBoard();
            updateScore();
            updateLives();
            gameLoop();
        }

        // Loop principal del juego
        function gameLoop() {
            if (!gameRunning) return;
            
            // Alternar entre modo scatter y chase cada 20 segundos
            modeTimer++;
            if (modeTimer >= 60) { // 60 * 300ms = 18 segundos aprox
                currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
                modeTimer = 0;
                // Forzar cambio de dirección cuando cambia el modo
                ghosts.forEach(ghost => {
                    const opposite = {
                        'up': 'down', 'down': 'up',
                        'left': 'right', 'right': 'left'
                    };
                    ghost.direction = opposite[ghost.direction] || ghost.direction;
                });
            }
            
            // Manejar power pellet
            if (powerPelletActive) {
                powerPelletTimer--;
                if (powerPelletTimer <= 0) {
                    powerPelletActive = false;
                    ghosts.forEach(ghost => ghost.scared = false);
                }
            }
            
            // Los fantasmas se mueven solo cada 2 frames (mitad de velocidad)
            ghostMoveCounter++;
            if (ghostMoveCounter >= 2) {
                moveGhosts();
                ghostMoveCounter = 0;
            }
            
            checkCollisions();
            
            createBoard();
            drawPacman();
            drawGhosts();
            
            setTimeout(gameLoop, 300);
        }

        // Controles
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return; // Solo permitir movimiento si el juego está corriendo
            
            switch (e.key) {
                case 'ArrowUp': movePacman('up'); break;
                case 'ArrowDown': movePacman('down'); break;
                case 'ArrowLeft': movePacman('left'); break;
                case 'ArrowRight': movePacman('right'); break;
            }
        });

        // Inicializar el juego (sin empezar)
        createBoard();
        drawPacman();
        drawGhosts();
        updateScore();
        updateLives();