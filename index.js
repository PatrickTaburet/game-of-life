import { GameOfLife3D } from './gameoflife.js';

let gameOfLife;
let sizeSlider, zoomSlider, speedSlider, densitySlider, canvas;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = window.innerHeight * 0.9; // 90% de la hauteur de l'écran

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
    canvas.parent('canvas-holder');
    sizeSlider = document.getElementById('sizeSlider');
    zoomSlider = document.getElementById('zoomSlider');
    speedSlider = document.getElementById('speedSlider');
    densitySlider = document.getElementById('densitySlider');

    const resetBtn = document.getElementById('resetGridButton');
    resetBtn.onclick = resetGrid;

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

    sizeSlider.oninput = resetGrid;
    zoomSlider.oninput = () => { }; // optionnel
    speedSlider.oninput = () => frameRate(Number(speedSlider.value));
    densitySlider.oninput = resetGrid;

    frameRate(Number(speedSlider.value)); // initialise la vitesse au démarrage

    updateCanvasSize();

    resetGrid();
}

function draw() {
    background(24, 24, 37);
    orbitControl(5, 3);

    const cellSize = Number(zoomSlider.value);
    translate(
        -((gameOfLife.size - 1) * cellSize) / 2,
        -((gameOfLife.size - 1) * cellSize) / 2,
        -((gameOfLife.size - 1) * cellSize) / 2
    );

    gameOfLife.updateGrid();
    gameOfLife.drawGrid3D(cellSize);

    // Affiche le nombre de cubes vivants
    let alive = 0;
    for (let i = 0; i < gameOfLife.size; i++)
        for (let j = 0; j < gameOfLife.size; j++)
            for (let k = 0; k < gameOfLife.size; k++)
                alive += gameOfLife.grid[i][j][k];
}

// Nouvelle fonction pour ajuster la taille du canvas selon la grille
function updateCanvasSize() {
    const cellSize = Math.floor(Math.min(
        window.innerWidth * 0.7 / Number(sizeSlider?.value || 50),
        window.innerHeight * 0.8 / Number(sizeSlider?.value || 50)
    ));
    const w = cellSize * Number(sizeSlider?.value || 50);
    const h = cellSize * Number(sizeSlider?.value || 50);
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(w, h);
    } else {
        canvas = createCanvas(w, h);
    }
}

function resetGrid() {
    const size = Number(sizeSlider.value);
    const density = Number(densitySlider.value);
    gameOfLife = new GameOfLife3D(size, density);
}

window.setup = setup;
window.draw = draw;

GameOfLife3D.prototype.drawGrid3D = function (cellSize = 20) {
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            for (let k = 0; k < this.size; k++) {
                if (this.grid[i][j][k] === 1) {
                    push();
                    translate(j * cellSize, i * cellSize, k * cellSize);
                    fill(0, 255, 255);
                    stroke(255, 0, 255);
                    box(cellSize * 0.9, cellSize * 0.9, cellSize * 0.9);
                    pop();
                }
            }
        }
    }
}

