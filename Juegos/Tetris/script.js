const botonIniciar = document.getElementById('botonIniciar');

const pantallaInicio = document.getElementById('pantallaInicio');

const areaJuego = document.getElementById('areaJuego');

const plantillaJuego = document.getElementById('plantillaJuego');
const plantillaDerrota = document.getElementById('pantallaDerrota');

const indice = ['I','J','L','O','S','T','Z'];

const tetrominos = {
    'I':[[1,1,1,1]],
    'J':[[1,0,0],
         [1,1,1]],
    'L':[[0,0,1],
         [1,1,1]],
    'O':[[1,1],
         [1,1]],
    'S':[[0,1,1],
         [1,1,0]],
    'T':[[0,1,0],
         [1,1,1]],
    'Z':[[1,1,0],
         [0,1,1]]
};
const colores = {
    'I': '#00FFFF',
    'J': '#0000FF',
    'L': '#FFA500',
    'O': '#FFFF00',
    'S': '#00FF00',
    'T': '#800080',
    'Z': '#FF0000'
};

const filas = 20;
const columnas = 10;

botonIniciar.addEventListener('click', iniciarJuego);
function iniciarJuego() {
    pantallaInicio.remove();

    const juego = plantillaJuego.content.cloneNode(true);
    plantillaJuego.remove();
    
    areaJuego.appendChild(juego);

    crearCeldas();

    const claveTetromino = tetrominoAleatorio();
    const tetrominoContenido = tetrominos[claveTetromino];
    console.log(tetrominoContenido);
    console.log(girarTetromino(tetrominoContenido));
    console.log(posicionXTableroAleatoria(tetrominoContenido));
    dibujarTetromino(claveTetromino, posicionXTableroAleatoria(tetrominoContenido));
}

function crearCeldas() {
    const tablero = document.getElementById('tablero');
    tablero.width = tablero.offsetWidth;
    tablero.height = tablero.offsetHeight;

    const altura = tablero.height;
    const ancho = tablero.width;

    const anchoCelda = ancho / columnas;
    const alturaCelda = altura / filas;

    const contexto = tablero.getContext('2d');
    contexto.strokeStyle = 'white';
    contexto.lineWidth = 1;
    contexto.imageSmoothingEnabled = false;

    for (let posicionX = anchoCelda; posicionX < ancho; posicionX += anchoCelda) {
        contexto.beginPath();
        contexto.moveTo(desplazarMedioPixel(posicionX), 0);
        contexto.lineTo(desplazarMedioPixel(posicionX), altura);
        contexto.stroke();
    }
    
    for (let posicionY = alturaCelda; posicionY < altura; posicionY += alturaCelda) {
        contexto.beginPath();
        contexto.moveTo(0, desplazarMedioPixel(posicionY));
        contexto.lineTo(ancho, desplazarMedioPixel(posicionY));
        contexto.stroke();
    }

}



function desplazarMedioPixel(posicion){
    return Math.round(posicion) + 0.5;
}

function tetrominoAleatorio(){
    const indiceAleatorio = Math.floor(Math.random() * indice.length);
    const claveTetromino = indice[indiceAleatorio];
    return claveTetromino;
}

function girarTetromino(matriz) {
    return matriz[0].map((_, indiceColumna) => matriz.map(fila => fila[indiceColumna]));
}


function posicionXTableroAleatoria(tetromino){
    const ancho = document.getElementById('tablero').width;
    const anchoTetromino = tetromino[0].length;
    const columnaAleatoria = Math.floor(Math.random() * (columnas - anchoTetromino));
    const anchoCelda = ancho / columnas;
    const posicionX = columnaAleatoria * anchoCelda;
    return posicionX;
}

function dibujarTetromino(claveTetromino, posicionX){
    const tablero = document.getElementById('tablero');
    const contexto = tablero.getContext('2d');
    const tamañoCelda = tablero.width / columnas;
    const tetromino = tetrominos[claveTetromino];
    const color = colores[claveTetromino];

    contexto.fillStyle = color;
    for (let fila = 0; fila < tetromino.length; fila++) {
        for (let columna = 0; columna < tetromino[fila].length; columna++) {
            if(tetromino[fila][columna] === 1){
                const x = posicionX + columna * tamañoCelda;
                const y = fila * tamañoCelda;
                contexto.fillRect(x, y, tamañoCelda, tamañoCelda);
            }
        }
    }
}
