const botonIniciar = document.getElementById('botonIniciar');

const pantallaInicio = document.getElementById('pantallaInicio');

const areaJuego = document.getElementById('areaJuego');

const plantillaJuego = document.getElementById('plantillaJuego');
const plantillaDerrota = document.getElementById('pantallaDerrota');

//Indices de los tetrominos
const indice = ['I','J','L','O','S','T','Z'];

//Definicion de los tetrominos
const tetrominos = {
    'I':[[0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]],
    'J':[[0,0,0],
         [1,0,0],
         [1,1,1]],
    'L':[[0,0,0],
         [0,0,1],
         [1,1,1]],
    'O':[[0,0,0,0],
         [0,1,1,0],
         [0,1,1,0],
         [0,0,0,0]],
    'S':[[0,0,0],
         [0,1,1],
         [1,1,0]],
    'T':[[0,0,0],
         [0,1,0],
         [1,1,1]],
    'Z':[[0,0,0],
         [1,1,0],
         [0,1,1]]
};

//Colores de los tetrominos
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

const tablero = {
    //Elemento en el DOM
    "elemento": null,
    "matriz": Array.from({length: filas}, () => Array(columnas).fill(null)),
    "ancho": 0,
    "alto": 0,
    "ladoCelda": 0,
    "contexto": function(){
        return this.elemento.getContext('2d');
    }
};

let posicionMaximaActual;

let juegoTerminado = false;

botonIniciar.addEventListener('click', iniciarJuego);
//Todo lo necesario para iniciar el juego
function iniciarJuego() {
    //Eliminar la pantalla de inicio
    pantallaInicio.remove();

    //Clonar la plantilla del juego y eliminarla
    const juego = plantillaJuego.content.cloneNode(true);
    plantillaJuego.remove();
    
    //Agregar la plantilla clonada al area de juego
    areaJuego.appendChild(juego);
    
    //Configurar el tablero
    tablero["elemento"] = document.getElementById('tablero');
    tablero["ancho"] = tablero["elemento"].offsetWidth;
    tablero["alto"] = tablero["elemento"].offsetHeight;
    tablero["ladoCelda"] = tablero["ancho"] / columnas;
    tablero["elemento"].width = tablero["ancho"];
    tablero["elemento"].height = tablero["alto"];
    
    crearNuevoTetromino();
}

let tetromino;

document.addEventListener('keydown', (event) => {
        if(!tetromino){
            return;
        }
        let movimiento = false;
        if(event.key === 'ArrowLeft' && tetromino.posicion[0] > 0 && tetromino.posicion[1] !== posicionMaximaActual ){
            tetromino.moverIzquierda();
            dibujarTablero(tetromino);
            movimiento = true;
        }
        else if(event.key === 'ArrowRight' && tetromino.posicion[0] + tetromino.matriz[0].length < columnas && tetromino.posicion[1] !== posicionMaximaActual){
            tetromino.moverDerecha();
            dibujarTablero(tetromino);
            movimiento = true;
        }
        else if(event.key === 'ArrowDown' && tetromino.posicion[1] !== posicionMaximaActual){
            tetromino.moverAbajo();
            dibujarTablero(tetromino);
            
        }
        else if(event.key === 'ArrowUp' && tetromino.posicion[1] !== posicionMaximaActual){
            tetromino.girar();
            dibujarTablero(tetromino);
            movimiento = true;
        }
        if(movimiento){
            posicionMaximaActual = calcularColision(tetromino);
        }
});

function crearNuevoTetromino(){
    const indice = tetrominoAleatorio();

    tetromino = new Tetromino(indice, 
        tetrominos[indice], 
        colores[indice], 
        [3,-1]
    );

    tetromino.informacion();

    tetromino.dibujar(tablero["contexto"]());
    
    crearCeldas();
    posicionMaximaActual = calcularColision(tetromino);
    requestAnimationFrame(() => actualizarJuego(tetromino, 0));
}

//Dibuja las celdas del tablero
function crearCeldas() {
    const contexto = tablero["contexto"]();
    contexto.strokeStyle = 'white';
    contexto.lineWidth = 1;

    for (let posicionX = tablero["ladoCelda"]; posicionX < tablero["ancho"]; posicionX += tablero["ladoCelda"]) {
        contexto.beginPath();
        contexto.moveTo(desplazarMedioPixel(posicionX), 0);
        contexto.lineTo(desplazarMedioPixel(posicionX), tablero["alto"]);
        contexto.stroke();
    }
    
    for (let posicionY = tablero["ladoCelda"]; posicionY < tablero["alto"]; posicionY += tablero["ladoCelda"]) {
        contexto.beginPath();
        contexto.moveTo(0, desplazarMedioPixel(posicionY));
        contexto.lineTo(tablero["ancho"], desplazarMedioPixel(posicionY));
        contexto.stroke();
    }

}
let ultimaActualizacion = 0;
const intervaloCaida = 1000;


function actualizarJuego(tetrominoActual, tiempoActual = 0) {

    const contexto = tablero["contexto"]();
    
    if(tiempoActual - ultimaActualizacion > intervaloCaida){
        if(tetrominoActual.posicion[1] < posicionMaximaActual){
            tetrominoActual.moverAbajo();
            ultimaActualizacion = tiempoActual;
            dibujarTablero(tetrominoActual);
        }
        else{
            console.log("Colision detectada");
            const columna = tetrominoActual.posicion[0];
            const fila = tetrominoActual.posicion[1];
            console.log(`Columna: ${columna}, Fila: ${fila}`);
            insertarMatrizEnTablero(tetrominoActual);
            console.log(tablero["matriz"]);
            crearNuevoTetromino();
            return;
        }
    }
    
    requestAnimationFrame((nuevoTiempo) => actualizarJuego(tetrominoActual, nuevoTiempo));
    
}

function dibujarTablero(tetrominoActual) {
    const contexto = tablero["contexto"]();
    contexto.clearRect(0, 0, tablero["ancho"], tablero["alto"]);
    crearCeldas();
    tablero["matriz"].forEach((fila, indiceFila) => {
        fila.forEach((valor, indiceColumna) => {
            if(valor !== null){
                contexto.fillStyle = valor;

                let posicionX = indiceColumna * tablero["ladoCelda"];
                let posicionY = indiceFila * tablero["ladoCelda"];
                
                contexto.fillRect(desplazarMedioPixel(posicionX), desplazarMedioPixel(posicionY), tablero["ladoCelda"], tablero["ladoCelda"]);
            }
        })
    })
    tetrominoActual.dibujar(contexto);
}

//funcion que por el momento solo sirve para detectar el final (y esta mal hecha)
/*function revisarColision(tetromino) {
    if(tetromino.matriz.forEach((fila, indiceFila) => {
        fila.forEach((valor, indiceColumna) => {
            if(valor !== 0){
                if(tablero["matriz"][tetromino.posicion[1] + indiceFila] === undefined ||
                   tablero["matriz"][tetromino.posicion[1] + indiceFila][tetromino.posicion[0] + indiceColumna] !== null){
                    return true;
                }
            }
        });
    })){
        return true;
    }
    return false;
}*/
//calcula la posicion para que caiga el tetromino terminarlo?
function calcularColision(tetrominoActual) {

    let filaTableroColision = 20;
    let filaColisionableTetromino = -1;

    for(let fila = tetrominoActual.matriz.length-1; fila > 0; fila--){
        tetrominoActual.matriz[fila].forEach((valor, indiceColumna) => {
            if(valor === 1){
                filaColisionableTetromino = fila+1;
                return;
            }
        });
        if(filaColisionableTetromino !== -1){
            break;
        }
    }

    console.log("Fila colisionable del tetromino: "+filaColisionableTetromino);

    for(let fila = tetrominoActual.posicion[1] + tetrominoActual.matriz.length; fila < filas; fila++){
        for(let columna = tetrominoActual.posicion[0]; columna < tetrominoActual.posicion[0] + tetrominoActual.matriz[0].length; columna++){
            if(tablero["matriz"][fila] !== undefined && tablero["matriz"][fila][columna] !== null){
                filaTableroColision = fila;
                break;
            }
        }
        if(filaTableroColision !== 20){
            break;
        }
    }
    console.log("Fila colisionable del tablero: "+filaTableroColision)
    const posicionMaxima = filaTableroColision - filaColisionableTetromino;
    console.log("Posicion que deberia terminar: "+posicionMaxima)
    return posicionMaxima;
}


function insertarMatrizEnTablero(tetrominoActual) {
    tetrominoActual.matriz.forEach((fila, indiceFila) => {
        fila.forEach((valor, indiceColumna) => {
            if(valor !== 0){
                tablero["matriz"][tetrominoActual.posicion[1] + indiceFila][tetrominoActual.posicion[0] + indiceColumna] = tetromino.color;
            }
        });
    });
}

//Evita que las lineas se vean borrosas
function desplazarMedioPixel(posicion){
    return Math.round(posicion) + 0.5;
}

//Selecciona un tetromino aleatorio
function tetrominoAleatorio(){
    const indiceAleatorio = Math.floor(Math.random() * indice.length);
    const claveTetromino = indice[indiceAleatorio];
    return claveTetromino;
}

//Clase Tetromino
class Tetromino{
    constructor(indice, matriz, color, posicion){
        this.indice = indice;
        this.matriz = matriz;
        this.color = color;
        //Posicion X,Y (columna, fila) en el tablero
        this.posicion = posicion
    }
    informacion(){
        console.log(`Indice: ${this.indice}`);
        console.log(`Matriz: ${this.matriz}`);
        console.log(`Color: ${this.color}`);
        console.log(`Posicion: ${this.posicion}`);
    }
    girar(){
        this.matriz = this.matriz[0].map((_, indiceColumna) => this.matriz.map(fila => fila[indiceColumna])).reverse();
    }
    moverAbajo(){
        this.posicion[1]++;
    }
    moverIzquierda(){
        this.posicion[0]--;
    }
    moverDerecha(){
        this.posicion[0]++;
    }

    //Dibuja el tetromino en el tablero
    dibujar(contexto){
        
        const posicionY = this.posicion[1] * tablero["ladoCelda"];
        const posicionX = this.posicion[0] * tablero["ladoCelda"];
        contexto.fillStyle = this.color;
        for (let fila = 0; fila < this.matriz.length; fila++) {
            for (let columna = 0; columna < this.matriz[fila].length; columna++) {
                if(this.matriz[fila][columna] === 1){
                    const x = posicionX + columna * tablero["ladoCelda"];
                    const y = posicionY + fila * tablero["ladoCelda"];
                    contexto.fillRect(desplazarMedioPixel(x), desplazarMedioPixel(y), tablero["ladoCelda"], tablero["ladoCelda"]);
                }
            }
        }
    }
}
