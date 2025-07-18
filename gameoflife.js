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

if (typeof module !== 'undefined') {
    module.exports = { GameOfLife };
}