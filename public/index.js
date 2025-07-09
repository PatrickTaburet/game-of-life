let gameOfLife;

function setup() {
    createCanvas(500, 500);
    gameOfLife = new GameOfLife(50, 50);
    gameOfLife.initializeGrid();
    frameRate(1);
}

function draw() {
    background(255);
    gameOfLife.updateGrid();
    gameOfLife.drawGrid();
}

class GameOfLife {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
    }

    initializeGrid() {
        this.grid = [];
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = floor(random(2)); // cellules vivantes ou mortes aléatoirement
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

                if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[i][j] = 0; // Cell dies
                } else if (state === 0 && neighbors === 3) {
                    newGrid[i][j] = 1; // Cell becomes alive
                } else {
                    newGrid[i][j] = state; // Cell remains the same
                }
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
}
