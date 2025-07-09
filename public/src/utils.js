function countNeighbors(grid, x, y) {
    let count = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
            count += grid[newX][newY];
        }
    }

    return count;
}

function nextState(currentState, neighbors) {
    if (currentState === 1 && (neighbors < 2 || neighbors > 3)) {
        return 0; // Cell dies
    }
    if (currentState === 0 && neighbors === 3) {
        return 1; // Cell becomes alive
    }
    return currentState; // Remains the same
}