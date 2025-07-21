export class GameOfLife {
    constructor(rows, cols, rule = "conway") {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.rule = rule;
    }

    initializeGrid() {
        this.grid = [];
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = Math.floor(Math.random() * 2);
            }
        }
    }

    updateGrid() {
        let newGrid = [];
        for (let i = 0; i < this.rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                const state = this.grid[i][j];
                const neighbors = this.countNeighbors(i, j);

                if (this.rule === "conway") {
                    // Règle standard
                    if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                        newGrid[i][j] = 0;
                    } else if (state === 0 && neighbors === 3) {
                        newGrid[i][j] = 1;
                    } else {
                        newGrid[i][j] = state;
                    }
                } else if (this.rule === "seeds") {
                    // Seeds: une cellule morte avec 2 voisins naît, tout le reste meurt
                    if (state === 0 && neighbors === 2) {
                        newGrid[i][j] = 1;
                    } else {
                        newGrid[i][j] = 0;
                    }
                }
                // Ajoute d'autres variantes ici si besoin
            }
        }
        this.grid = newGrid;
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const ni = (x + i + this.rows) % this.rows;
                const nj = (y + j + this.cols) % this.cols;
                count += this.grid[ni][nj];
            }
        }
        return count;
    }

    drawGrid() {
        let cellSize = width / this.cols;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                fill(this.grid[i][j] === 1 ? 0 : 255);
                stroke(200);
                rect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    drawGrid3D() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] === 1) {
                    push();
                    translate(j * 20, i * 20, 0);
                    fill(0, 255, 255);
                    stroke(255, 0, 255);
                    box(18, 18, 18);
                    pop();
                }
            }
        }
    }
}

export class GameOfLife3D {
    constructor(size, density = 0.15) {
        this.size = size;
        this.density = density;
        this.grid = [];
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = [];
                for (let k = 0; k < this.size; k++) {
                    this.grid[i][j][k] = Math.random() < this.density ? 1 : 0;
                }
            }
        }
    }

    countNeighbors(x, y, z) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 && dy === 0 && dz === 0) continue;
                    const nx = (x + dx + this.size) % this.size;
                    const ny = (y + dy + this.size) % this.size;
                    const nz = (z + dz + this.size) % this.size;
                    count += this.grid[nx][ny][nz];
                }
            }
        }
        return count;
    }

    updateGrid() {
        let newGrid = [];
        for (let i = 0; i < this.size; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.size; j++) {
                newGrid[i][j] = [];
                for (let k = 0; k < this.size; k++) {
                    const state = this.grid[i][j][k];
                    const neighbors = this.countNeighbors(i, j, k);

                    // Récupère la règle depuis le select
                    let rule = window.rulesSelect?.value || "classic3d";
                    if (rule === "classic3d") {
                        // Naissance si 6 voisins, survie si 5-7 voisins
                        if (state === 1 && (neighbors >= 5 && neighbors <= 7)) {
                            newGrid[i][j][k] = 1;
                        } else if (state === 0 && neighbors === 6) {
                            newGrid[i][j][k] = 1;
                        } else {
                            newGrid[i][j][k] = 0;
                        }
                    } else if (rule === "chaos3d") {
                        // Naissance si 5, 6 ou 7 voisins, survie si 4-8 voisins
                        if (state === 1 && (neighbors >= 4 && neighbors <= 8)) {
                            newGrid[i][j][k] = 1;
                        } else if (state === 0 && (neighbors >= 5 && neighbors <= 7)) {
                            newGrid[i][j][k] = 1;
                        } else {
                            newGrid[i][j][k] = 0;
                        }
                    } else if (rule === "stable3d") {
                        // Naissance si 6 voisins, survie si 6-8 voisins
                        if (state === 1 && (neighbors >= 6 && neighbors <= 8)) {
                            newGrid[i][j][k] = 1;
                        } else if (state === 0 && neighbors === 6) {
                            newGrid[i][j][k] = 1;
                        } else {
                            newGrid[i][j][k] = 0;
                        }
                    }
                }
            }
        }
        this.grid = newGrid;
    }

    drawGrid3D(cellSize = 20) {
        for (let z = 0; z < this.size; z++) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (this.grid[z][y][x] === 1) {
                        push();
                        translate(x * cellSize, y * cellSize, z * cellSize);
                        fill(0, 255, 255, 180);
                        stroke(255, 0, 255);
                        box(cellSize * 0.9);
                        pop();
                    }
                }
            }
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = { GameOfLife, GameOfLife3D };
}