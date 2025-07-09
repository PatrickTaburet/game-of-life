const { GameOfLife } = require('./gameoflife.js');

describe('GameOfLife', () => {
    test('initializeGrid crée une grille de la bonne taille', () => {
        const game = new GameOfLife(4, 3);
        game.initializeGrid(() => 1, Math.floor); // toutes vivantes
        expect(game.grid.length).toBe(4);
        expect(game.grid[0].length).toBe(3);
        expect(game.grid.flat().every(cell => cell === 1)).toBe(true);
    });

    test('countNeighbors compte correctement les voisins (mode tore)', () => {
        const game = new GameOfLife(3, 3);
        game.grid = [
            [1, 1, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        expect(game.countNeighbors(1, 1)).toBe(3);
        expect(game.countNeighbors(0, 0)).toBe(3); // selon la logique de la méthode
        expect(game.countNeighbors(2, 2)).toBe(3);
    });

    test('updateGrid applique les règles du jeu', () => {
        const game = new GameOfLife(3, 3);
        // Blinker vertical
        game.grid = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ];
        game.updateGrid();
        // En mode tore, tout devient vivant
        expect(game.grid).toEqual([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ]);
    });
});

