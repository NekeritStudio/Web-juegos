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

        let noEstaAlFinal = tetromino.posicion[1] !== posicionMaximaActual;
        let movimiento = false;

        if(event.key === 'ArrowLeft' && noEstaAlFinal ){
            movimiento = tetromino.moverIzquierda();
        }
        else if(event.key === 'ArrowRight' && noEstaAlFinal){
            movimiento = tetromino.moverDerecha();
        }
        else if(event.key === 'ArrowDown' && noEstaAlFinal){
            tetromino.moverAbajo();
            dibujarTablero(tetromino);
        }
        else if(event.key === 'ArrowUp' && noEstaAlFinal){
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

function calcularColision(tetrominoActual) {
    const matriz = tetrominoActual.matriz;
    
    const posX = tetrominoActual.posicion[0];
    const posY = tetrominoActual.posicion[1];
    
    const anchoTetromino = matriz[0].length;
    const altoTetromino = matriz.length;

    let posicionesMaximas = [];

    for (let col = 0; col < anchoTetromino; col++) {
        //Encuentra el bloque más bajo en esta columna del tetromino
        let filaBloqueTetromino = -1;
        for (let fila = altoTetromino - 1; fila >= 0; fila--) {
            if (matriz[fila][col] === 1) {
                filaBloqueTetromino = fila;
                break;
            }
        }
        
        if (filaBloqueTetromino === -1) {
            continue; // No hay bloque en esta columna
        }

        //Busca la primera celda ocupada en el tablero debajo del bloque más bajo
        let filaColisionTablero = filas; //Por defecto, sera el fondo del tablero
        for (let y = posY + filaBloqueTetromino + 1; y < filas; y++) {
            if (tablero["matriz"][y][posX + col] !== null) {
                filaColisionTablero = y;
                break;
            }
        }

        // La posición máxima para este bloque es:
        let maxPos = filaColisionTablero - filaBloqueTetromino - 1;
        posicionesMaximas.push(maxPos);
    }

    const posicionMaxima = Math.min(...posicionesMaximas);
    console.log("Posición máxima calculada: " + posicionMaxima);
    return posicionMaxima;
}

//Insertar la matriz del tetromino dentro de la matriz del tablero
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
    //terminar esto
    moverIzquierda(){
        const posicionX = this.posicion[0];
        const posicionY = this.posicion[1];

        const matriz = this.matriz;

        let numFilas = matriz.length;
        let numColumnas = matriz[0].length;
        
        let puedeMover = true;

        //Recorre todas las filas del tetromino
        for(let fila = 0; fila < numFilas ;fila++){
            let columnaBloque = -1;
            for(let columna = 0; columna < numColumnas; columna++){// Recorre las columnas de una fila del tetromino
                if(matriz[fila][columna] === 1){ //Encuentra el primer bloque en la fila
                    columnaBloque = columna; 
                    break;
                }
            }
            console.log("Fila: "+fila+"\n");
            if(columnaBloque === -1){
                console.log("No habia bloques en la fila: "+fila);
                continue; //No hay bloques en esta fila
            }
            console.log("Columna donde hay bloque: "+columnaBloque);

            // Comprobar si la posicion donde estara no esta disponible o fuera del mapa
            let posicionXBloque = posicionX + columnaBloque -1 ;
            console.log("Posicion izquierda del bloque en el tablero: "+posicionXBloque);
            let posicionYBloque = posicionY + fila;
            console.log("Posicion Y del bloque en el tablero: "+posicionYBloque);

            let posicionFutura = tablero["matriz"][posicionYBloque][posicionXBloque];
            console.log("La posicion futura a estar es: "+posicionFutura);
            if(posicionFutura !== null || posicionXBloque < 0 || posicionFutura === undefined){
                puedeMover = false;
                break;
            }
            console.log("No hay colision, continuando con siguiente fila...");
        }
        if(puedeMover){
            this.posicion[0]--;
            dibujarTablero(tetromino);
            return true
        }
        console.log("Se ha detectado colision")
        return false;
    }
    moverDerecha(){
        const posicionX = this.posicion[0];
        const posicionY = this.posicion[1];

        const matriz = this.matriz;

        let numFilas = matriz.length;
        let numColumnas = matriz[0].length;
        
        let puedeMover = true;

        //Recorre todas las filas del tetromino
        for(let fila = 0; fila < numFilas ;fila++){
            let columnaBloque = -1;
            for(let columna = numColumnas-1; columna >= 0; columna--){// Recorre las columnas de una fila del tetromino
                if(matriz[fila][columna] === 1){ //Encuentra el primer bloque en la fila
                    columnaBloque = columna; 
                    break;
                }
            }
            console.log("Fila: "+fila+"\n");
            if(columnaBloque === -1){
                console.log("No habia bloques en la fila: "+fila);
                continue; //No hay bloques en esta fila
            }
            console.log("Columna donde hay bloque: "+columnaBloque);

            // Comprobar si la posicion donde estara no esta disponible o fuera del mapa
            let posicionXBloque = posicionX + columnaBloque +1 ;
            console.log("Posicion izquierda del bloque en el tablero: "+posicionXBloque);
            let posicionYBloque = posicionY + fila;
            console.log("Posicion Y del bloque en el tablero: "+posicionYBloque);

            let posicionFutura = tablero["matriz"][posicionYBloque][posicionXBloque];
            console.log("La posicion futura a estar es: "+posicionFutura);
            if(posicionFutura !== null || posicionXBloque > columnas || posicionFutura === undefined){
                puedeMover = false;
                break;
            }
            console.log("No hay colision, continuando con siguiente fila...");
        }
        if(puedeMover){
            this.posicion[0]++;
            dibujarTablero(tetromino);
            return true
        }
        console.log("Se ha detectado colision")
        return false;
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
