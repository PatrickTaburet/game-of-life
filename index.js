import { GameOfLife } from './gameoflife.js';

let gameOfLife;
let resetButton;
let speedSlider;
let rowsSlider, colsSlider;
let canvas;
let rulesSelect, patternSelect;
let zoomSlider;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = window.innerHeight * 0.9; // 90% de la hauteur de l'écran

let camX = 0, camY = 0, camZ = 600;

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
    canvas.parent('canvas-holder');

    rowsSlider = document.getElementById('rowsSlider');
    colsSlider = document.getElementById('colsSlider');
    speedSlider = document.getElementById('speedSlider');
    resetButton = document.getElementById('resetButton');
    rulesSelect = document.getElementById('rulesSelect');
    patternSelect = document.getElementById('patternSelect');
    zoomSlider = document.getElementById('zoomSlider');

    // Ajoute le contrôle du zoom à la molette
    canvas.elt.addEventListener('wheel', function (e) {
        e.preventDefault();
        let zoom = Number(zoomSlider.value);
        // Sensibilité du zoom
        const step = 2;
        if (e.deltaY < 0) {
            zoom = Math.min(zoom + step, Number(zoomSlider.max));
        } else {
            zoom = Math.max(zoom - step, Number(zoomSlider.min));
        }
        zoomSlider.value = zoom;
    }, { passive: false });

    resetButton.onclick = resetGrid;
    patternSelect.onchange = applyPattern;
    rulesSelect.onchange = () => {
        gameOfLife.rule = rulesSelect.value;
        resetGrid();
    };

    // Ajout : mise à jour dynamique sur changement des sliders
    rowsSlider.oninput = resetGrid;
    colsSlider.oninput = resetGrid;
    speedSlider.oninput = () => frameRate(Number(speedSlider.value));

    updateCanvasSize();

    gameOfLife = new GameOfLife(Number(rowsSlider.value), Number(colsSlider.value));
    gameOfLife.initializeGrid();
    frameRate(Number(speedSlider.value));
}

function draw() {
    background(24, 24, 37);

    orbitControl(5, 3); // Sensibilité augmentée

    const cellSize = Number(zoomSlider.value);

    translate(
        -((gameOfLife.cols - 1) * cellSize) / 2,
        -((gameOfLife.rows - 1) * cellSize) / 2,
        0
    );

    gameOfLife.updateGrid();
    gameOfLife.drawGrid3D(cellSize);
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

window.setup = setup;
window.draw = draw;

GameOfLife.prototype.drawGrid3D = function (cellSize = 20) {
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            if (this.grid[i][j] === 1) {
                push();
                translate(j * cellSize, i * cellSize, 0);
                fill(0, 255, 255);
                stroke(255, 0, 255);
                box(cellSize * 0.9, cellSize * 0.9, cellSize * 0.9);
                pop();
            }
        }
    }
}

