import { GameOfLife } from './gameoflife.js';

let gameOfLife;
let resetButton;
let speedSlider;
let rowsSlider, colsSlider;
let canvas;
let rulesSelect, patternSelect;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = window.innerHeight * 0.9; // 90% de la hauteur de l'écran

let camX = 0, camY = 0, camZ = 600;

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL); // <-- mode 3D
    canvas.parent('canvas-holder');

    rowsSlider = document.getElementById('rowsSlider');
    colsSlider = document.getElementById('colsSlider');
    speedSlider = document.getElementById('speedSlider');
    resetButton = document.getElementById('resetButton');
    rulesSelect = document.getElementById('rulesSelect');
    patternSelect = document.getElementById('patternSelect');

    resetButton.onclick = resetGrid;
    patternSelect.onchange = applyPattern;
    rulesSelect.onchange = () => {
        gameOfLife.rule = rulesSelect.value;
        resetGrid();
    };

    updateCanvasSize(); // <-- maintenant que le canvas existe, on peut resize

    gameOfLife = new GameOfLife(Number(rowsSlider.value), Number(colsSlider.value));
    gameOfLife.initializeGrid();
    frameRate(Number(speedSlider.value));
}

function draw() {
    background(24, 24, 37);

    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
    orbitControl(2, 2);

    translate(
        -((gameOfLife.cols - 1) * 20) / 2,
        -((gameOfLife.rows - 1) * 20) / 2,
        0
    );

    gameOfLife.updateGrid();
    gameOfLife.drawGrid3D();
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
    applyPattern();
}

function applyPattern() {
    const rows = Number(rowsSlider.value);
    const cols = Number(colsSlider.value);
    const rule = rulesSelect.value;
    gameOfLife = new GameOfLife(rows, cols, rule);
    gameOfLife.initializeGrid();

    // Efface la grille
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            gameOfLife.grid[i][j] = 0;
        }
    }

    switch (patternSelect.value) {
        case 'seeds':
            // Deux cellules vivantes côte à côte au centre
            gameOfLife.grid[Math.floor(rows / 2)][Math.floor(cols / 2)] = 1;
            gameOfLife.grid[Math.floor(rows / 2)][Math.floor(cols / 2) + 1] = 1;
            break;
        case 'block':
            // Bloc 2x2 au centre
            gameOfLife.grid[Math.floor(rows / 2)][Math.floor(cols / 2)] = 1;
            gameOfLife.grid[Math.floor(rows / 2)][Math.floor(cols / 2) + 1] = 1;
            gameOfLife.grid[Math.floor(rows / 2) + 1][Math.floor(cols / 2)] = 1;
            gameOfLife.grid[Math.floor(rows / 2) + 1][Math.floor(cols / 2) + 1] = 1;
            break;
        case 'beacon':
            // Beacon 4x4 au centre
            let r = Math.floor(rows / 2) - 1, c = Math.floor(cols / 2) - 1;
            gameOfLife.grid[r][c] = 1;
            gameOfLife.grid[r][c + 1] = 1;
            gameOfLife.grid[r + 1][c] = 1;
            gameOfLife.grid[r + 1][c + 1] = 1;
            gameOfLife.grid[r + 2][c + 2] = 1;
            gameOfLife.grid[r + 2][c + 3] = 1;
            gameOfLife.grid[r + 3][c + 2] = 1;
            gameOfLife.grid[r + 3][c + 3] = 1;
            break;
        case 'glider':
            // Glider en haut à gauche
            gameOfLife.grid[1][2] = 1;
            gameOfLife.grid[2][3] = 1;
            gameOfLife.grid[3][1] = 1;
            gameOfLife.grid[3][2] = 1;
            gameOfLife.grid[3][3] = 1;
            break;
        default:
            // Random (déjà fait par initializeGrid)
            gameOfLife.initializeGrid();
    }
}

function keyPressed() {
    const step = 40;
    if (key === 'a') camX -= step;
    if (key === 'd') camX += step;
    if (key === 'w') camY -= step;
    if (key === 's') camY += step;
    if (key === 'q') camZ += step;
    if (key === 'e') camZ -= step;
}
window.keyPressed = keyPressed;

window.setup = setup;
window.draw = draw;

