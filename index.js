import { GameOfLife } from './gameoflife.js';

let gameOfLife;
let resetButton;
let speedSlider;
let rowsSlider, colsSlider;
let canvas;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = window.innerHeight * 0.9; // 90% de la hauteur de l'écran

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-holder');

    rowsSlider = document.getElementById('rowsSlider');
    colsSlider = document.getElementById('colsSlider');
    speedSlider = document.getElementById('speedSlider');
    resetButton = document.getElementById('resetButton');

    resetButton.onclick = resetGrid;

    updateCanvasSize(); // <-- maintenant que le canvas existe, on peut resize

    gameOfLife = new GameOfLife(Number(rowsSlider.value), Number(colsSlider.value));
    gameOfLife.initializeGrid();
    frameRate(Number(speedSlider.value));
}

function draw() {
    // Si la taille de la grille a changé, on la recrée et on ajuste le canvas
    if (gameOfLife.rows !== Number(rowsSlider.value) || gameOfLife.cols !== Number(colsSlider.value)) {
        gameOfLife = new GameOfLife(Number(rowsSlider.value), Number(colsSlider.value));
        gameOfLife.initializeGrid();
        updateCanvasSize();
    }

    background(24, 24, 37); // fond foncé

    frameRate(Number(speedSlider.value));

    gameOfLife.updateGrid();
    gameOfLife.drawGrid();

    // Affichage des valeurs des sliders
    fill(0, 255, 255);
    noStroke();
    textSize(14);
    text('Lignes: ' + rowsSlider.value, 20, height - 60);
    text('Colonnes: ' + colsSlider.value, 20, height - 40);
    text('Vitesse: ' + speedSlider.value + ' FPS', 20, height - 20);
}

// Nouvelle fonction pour ajuster la taille du canvas selon la grille
function updateCanvasSize() {
    const cellSize = Math.floor(Math.min(
        window.innerWidth * 0.7 / Number(colsSlider?.value || 50),
        window.innerHeight * 0.8 / Number(rowsSlider?.value || 50)
    ));
    const w = cellSize * Number(colsSlider?.value || 50);
    const h = cellSize * Number(rowsSlider?.value || 50);
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(w, h);
    } else {
        canvas = createCanvas(w, h);
    }
}

function resetGrid() {
    gameOfLife = new GameOfLife(Number(rowsSlider.value), Number(colsSlider.value));
    gameOfLife.initializeGrid();
}


window.setup = setup;
window.draw = draw;

