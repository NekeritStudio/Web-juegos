let rows = 3;
let columns = 3;

let currTile;
let otherTile; // en blanco

let turns = 0;
let time = 0;
let timer;

let imgOrder = ["4", "2", "8", "6", "1", "5", "7", "9", "3"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // crear imagen
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/pikachu/" + imgOrder.shift() + ".png";

            //funcion arrastrar
            tile.addEventListener("dragstart", dragStart); //comienza a arrastrar
            tile.addEventListener("dragover", dragOver); //arrastrando sobre otro elemento
            tile.addEventListener("dragenter", dragEnter); //entra en el area de otro elemento
            tile.addEventListener("dragleave", dragLeave); //sale del area de otro elemento
            tile.addEventListener("drop", dragDrop); //deja caer sobre otro elemento
            tile.addEventListener("dragend", dragEnd); //termina de arrastrar

            document.getElementById("board").append(tile);
        }
    }

    // contador de tiempo
    timer = setInterval(function() {
        time++;
        document.getElementById("time").innerText = time;
    }, 1000);
}

function dragStart() {
    currTile = this; // la imagen que se esta arrastrando
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; // la imagen sobre la que se deja caer
}

function dragEnd() {
    if(!otherTile.src.includes("9.png")) {
        return;
    }
    let currCoords = currTile.id.split("-"); // ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-"); // ["0", "0"]
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);
    
    let moveLeft = c2 == c - 1 && r2 == r;
    let moveRight = c2 == c + 1 && r2 == r;
    let moveUp = r2 == r - 1 && c2 == c;
    let moveDown = r2 == r + 1 && c2 == c;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    if(isAdjacent) {
        // intercambiar las imagenes
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;
    }
    
    turns++;
    document.getElementById("turnos").innerText = turns;
    checkWin();

    function checkWin() {
        let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let correct = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let imgNum = tile.src.charAt(tile.src.length - 5);

                if(imgNum == imgOrder.shift()) {
                    correct++;
                }
            }
        }

        if(correct == 9) {
            clearInterval(timer);
            alert("GANASTE! \nTiempo: " + time + " segundos \nTurnos: " + turns);
            location.reload();
        }
    }
}