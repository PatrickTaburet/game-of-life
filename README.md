# Game of Life in p5.js

## Overview
This project implements Conway's Game of Life using the p5.js library. The Game of Life is a cellular automaton devised by mathematician John Conway. It consists of a grid of cells that can be either alive or dead. The state of each cell changes based on the states of its eight neighbors according to a set of simple rules.

## Rules of the Game
1. Any live cell with fewer than two live neighbors dies (underpopulation).
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies (overpopulation).
4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction).

## Project Structure
- **src/**
  - **index.js**: Entry point of the application. Initializes the p5.js sketch and sets up the canvas.
  - **gameOfLife.js**: Contains the main logic for the Game of Life. Implements the rules and updates the grid.
  - **utils.js**: Utility functions for counting neighbors and determining the next state of a cell.
  
- **public/**
  - **index.html**: Main HTML document that includes the p5.js library and links to the JavaScript files.

- **package.json**: Configuration file for npm, listing dependencies and scripts.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd game-of-life-p5js
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Project
To run the project, use the following command:
```
npm start
```
This will start a local server and open the Game of Life in your default web browser.

## Implementation Details
The project uses p5.js for rendering the grid and handling the animation. The Game of Life logic is encapsulated in a class that manages the grid state and updates it every second. The utility functions assist in calculating the next state of the cells based on their neighbors.

## Contributing
Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License
This project is licensed under the MIT License.