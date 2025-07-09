class GameOfLife {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.initializeGrid();
    }

    initializeGrid() {
        let grid = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            grid[i] = new Array(this.cols).fill(0);
        }
        return grid;
    }

    updateGrid() {
        let newGrid = this.initializeGrid();
        for (let i = 0; i < this.rows; i++) {
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
                if (i === 0 && j === 0) continue; // Skip the cell itself
                const ni = (x + i + this.rows) % this.rows; // Wrap around
                const nj = (y + j + this.cols) % this.cols; // Wrap around
                count += this.grid[ni][nj];
            }
        }
        return count;
    }

    drawGrid(p) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                p.fill(this.grid[i][j] === 1 ? 255 : 0);
                p.rect(j * 10, i * 10, 10, 10); // Draw each cell
            }
        }
    }
}

export default GameOfLife;