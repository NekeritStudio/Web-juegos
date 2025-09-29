const botonIniciar = document.getElementById('botonIniciar');

const pantallaInicio = document.getElementById('pantallaInicio');

const areaJuego = document.getElementById('areaJuego');

const plantillaJuego = document.getElementById('plantillaJuego');
const plantillaDerrota = document.getElementById('pantallaDerrota');

const tetrominos = ['I','J','L','O','S','T','Z'];
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
const anchoCelda = ancho / columnas;
const alturaCelda = altura / filas;

botonIniciar.addEventListener('click', iniciarJuego);
function iniciarJuego() {
    pantallaInicio.remove();

    const juego = plantillaJuego.content.cloneNode(true);

    areaJuego.appendChild(juego);

    crearCeldas();
}

function crearCeldas() {
    const tablero = document.getElementById('tablero');
    tablero.width = tablero.offsetWidth;
    tablero.height = tablero.offsetHeight;

    const altura = tablero.height;
    const ancho = tablero.width;

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

    iniciarJuego();
}


function desplazarMedioPixel(posicion){
    return Math.round(posicion) + 0.5;
}