import { GameOfLife3D } from './gameoflife.js';

let gameOfLife;
let sizeSlider, zoomSlider, speedSlider, densitySlider, canvas;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = window.innerHeight * 0.9; // 90% de la hauteur de l'écran

let trailMode = false;
let trailDuration = 40; // valeur par défaut
let trailGrid = [];     // pour stocker les trails
let trails = []; // Liste des trails : {x, y, z, age}

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

    // Ajoute des lumières pour effet glossy/reflet
    ambientLight(60, 60, 80);
    directionalLight(180, 180, 255, 0.5, 1, -1);
    pointLight(255, 255, 255, 0, 0, 300);

    const cellSize = Number(zoomSlider.value);
    translate(
        -((gameOfLife.size - 1) * cellSize) / 2,
        -((gameOfLife.size - 1) * cellSize) / 2,
        -((gameOfLife.size - 1) * cellSize) / 2
    );

    gameOfLife.updateGrid();

    // --- TRAIL MODE ---
    if (trailMode) {
        // Initialise trailGrid si vide ou taille différente
        if (!trailGrid.length || trailGrid.length !== gameOfLife.size) {
            trailGrid = [];
            for (let z = 0; z < gameOfLife.size; z++) {
                trailGrid[z] = [];
                for (let y = 0; y < gameOfLife.size; y++) {
                    trailGrid[z][y] = [];
                    for (let x = 0; x < gameOfLife.size; x++) {
                        trailGrid[z][y][x] = 0;
                    }
                }
            }
        }
        // Met à jour trailGrid
        for (let z = 0; z < gameOfLife.size; z++) {
            for (let y = 0; y < gameOfLife.size; y++) {
                for (let x = 0; x < gameOfLife.size; x++) {
                    if (gameOfLife.grid[z][y][x] === 1) {
                        trailGrid[z][y][x] = trailDuration;
                    } else if (trailGrid[z][y][x] > 0) {
                        trailGrid[z][y][x]--;
                    }
                }
            }
        }
        // Dessine les trails
        for (let z = 0; z < gameOfLife.size; z++) {
            for (let y = 0; y < gameOfLife.size; y++) {
                for (let x = 0; x < gameOfLife.size; x++) {
                    if (trailGrid[z][y][x] > 0) {
                        push();
                        translate(x * cellSize, y * cellSize, z * cellSize);
                        let alpha = map(trailGrid[z][y][x], 0, trailDuration, 0, 180);
                        specularMaterial(255, 0, 255, alpha); // couleur trail magenta
                        shininess(40);
                        noStroke();
                        box(cellSize * 0.9);
                        pop();
                    }
                }
            }
        }
    }

    // Dessine les cubes vivants (toujours au-dessus des trails)
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

                    // Effet glossy/reflet
                    specularMaterial(0, 180, 255, 200); // couleur brillante
                    shininess(80); // plus la valeur est haute, plus c'est "miroir"
                    stroke(255, 255, 255, 80); // bord doux

                    box(cellSize * 0.9, cellSize * 0.9, cellSize * 0.9);
                    pop();
                }
            }
        }
    }
}

window.rulesSelect = document.getElementById('rulesSelect');
rulesSelect.oninput = resetGrid;

document.getElementById('trailModeButton').onclick = function () {
    trailMode = !trailMode;
    this.textContent = trailMode ? "Trail Mode: ON" : "Trail Mode: OFF";
    // Réinitialise les trails si désactivé
    if (!trailMode) trailGrid = [];
};

document.getElementById('trailSlider').oninput = function () {
    trailDuration = Number(this.value);
};

