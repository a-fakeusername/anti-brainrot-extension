
const dirs = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0] // Up
];

// --- Sliding Puzzle Game Logic ---

function runSlidingPuzzle() {
    const grid = generateSlidingPuzzleGrid();
    const tiles = drawSlidingPuzzle(grid);

    // Add event listeners for tile clicks
    tiles.forEach((row, i) => {
        row.forEach((tile, j) => {
            tile.addEventListener('click', () => {
                // Check if the clicked tile is adjacent to the empty space
            });
        });
    });
}

function generateSlidingPuzzleGrid() {
    // Create a 6x6 sliding puzzle game
    const gridSize = 6;
    const grid = Array.from({ length: gridSize }, (_, i) => Array.from({ length: gridSize }, (_, j) => i * gridSize + j));
    grid[gridSize - 1][gridSize - 1] = null; // Empty space
    
    let i = gridSize - 1;
    let j = gridSize - 1;
    // Shuffle the grid
    for (let x = 0; x < 500; x++) {
        const dir = dirs[Math.floor(Math.random() * 4)];
        const ni = i + dir[0];
        const nj = j + dir[1];
        if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize) {
            // Swap the empty space with the adjacent tile
            [grid[i][j], grid[ni][nj]] = [grid[ni][nj], grid[i][j]];
            i = ni;
            j = nj;
        } else {
            x--; // Retry if the move is invalid
        }
    }
    return grid;
}

function drawSlidingPuzzle(grid) {
    const container = document.querySelector('.puzzle-container');
    container.innerHTML = ''; // Clear previous content
    container.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`; // Set grid columns
    container.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`; // Set grid rows
    container.id = 'sliding-puzzle-container'; // Set ID for styling

    const tiles = Array.from({length: grid.length }, () => Array(grid[0].length).fill(null)); // Store tile elements

    grid.forEach((row, i) => {
        row.forEach((tile, j) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'puzzle-tile';
            tileElement.textContent = tile !== null ? tile + 1 : ''; // Show number or empty
            tileElement.style.gridRowStart = i + 1;
            tileElement.style.gridColumnStart = j + 1;
            tileElement.style.backgroundColor = getSlidingPuzzleTileColor(tile); // Set color based on position
            tileElement.style.color = "black"; // Set text color to black for better visibility
            container.appendChild(tileElement);
            tiles[i][j] = tileElement; // Store the tile element
        });
    });

    return tiles;
}

function getSlidingPuzzleTileColor(val) {
    if (val === null) {
        return 'gray'; // Empty space color
    }

    // Calculate position in spectrum - value between 0 and 1
    const i = Math.floor(val / 6); // Row index (0-5)
    const j = val % 6; // Column index (0-5)
    const position = (i + j) / 10; // Normalize to [0, 1]
    
    // Red to Yellow to Green gradient
    let r, g;
    if (position < 0.5) {
        // Red to Yellow (0 to 0.5)
        r = 255;
        g = Math.round(255 * (position * 2));
    } else {
        // Yellow to Green (0.5 to 1)
        r = Math.round(255 * (1 - (position - 0.5) * 2));
        g = 255;
    }
    
    return `rgb(${r}, ${g}, 0)`;
}

// --- Minesweeper Game Logic ---

function runMinesweeper() {
    const grid = generateMinesweeperGrid(20, 25, 99);
    const tiles = drawMinesweeper(grid);

    // Add event listeners for cell clicks
    tiles.forEach((row, i) => {
        row.forEach((cell, j) => {
            cell.addEventListener('click', () => {
                const cellValue = grid[i][j];
                if (cellValue === -1) {
                    alert('Game Over! You hit a mine!');
                    // Handle game over logic here
                } else {
                    // Handle cell click logic here (e.g., reveal the cell)
                    console.log(`Cell (${i}, ${j}) clicked! Value: ${cellValue}`);
                }
            });
        });
    });
}
function generateMinesweeperGrid(rows, cols, mines) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    let mineCount = 0;

    while (mineCount < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (grid[row][col] !== -1) {
            grid[row][col] = -1; // Place a mine
            mineCount++;
            // Update adjacent cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols && grid[row + i][col + j] !== -1) {
                        grid[row + i][col + j]++;
                    }
                }
            }
        }
    }
    return grid;
}
function drawMinesweeper(grid) {
    const container = document.querySelector('.puzzle-container');
    container.innerHTML = ''; // Clear previous content
    container.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`; // Set grid columns
    container.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`; // Set grid rows
    container.id = 'minesweeper-container'; // Set ID for styling

    const tiles = Array.from({length: grid.length }, () => Array(grid[0].length).fill(null)); // Store cell elements

    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'puzzle-tile';
            cellElement.textContent = cell > 0 ? cell : ''; // Show number or empty
            cellElement.style.gridRowStart = i + 1;
            cellElement.style.gridColumnStart = j + 1;
            cellElement.style.backgroundColor = cell == -1 ? 'red' : (cell == '0' ? 'lightgreen' : 'lightgray');
            cellElement.style.color = getMinesweeperTileColor(cell); // Set color based on value
            container.appendChild(cellElement);
            tiles[i][j] = cellElement; // Store the cell element
        });
    });

    return tiles; // Return the array of cell elements for click handling
}

const mineSweeperTileColors = ['lightgray', 'blue', 'green', 'red', 'purple', 'orange', 'teal', 'navy', 'black'];
function getMinesweeperTileColor(val) {
    if (val === -1) {
        return 'black'; // Mine color
    } else if (val === 0) {
        return 'lightgray'; // Empty cell color
    } else {
        return mineSweeperTileColors[val]; // Numbered cell color
    }
}

// --- Lights Out Game Logic ---

function runLightsOut() {
    const grid = generateLightsOutGrid(9, 9);
    drawLightsOut(grid);
}
function generateLightsOutGrid(rows, cols) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.5; // Randomly turn on/off lights
        }
    }
    return grid;
}
function drawLightsOut(grid) {
    const container = document.querySelector('.puzzle-container');
    container.innerHTML = ''; // Clear previous content
    container.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`; // Set grid columns
    container.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`; // Set grid rows
    container.id = 'lightsout-container'; // Set ID for styling

    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'puzzle-tile';
            cellElement.style.gridRowStart = i + 1;
            cellElement.style.gridColumnStart = j + 1;
            cellElement.style.backgroundColor = cell ? 'yellow' : 'gray'; // Set color based on state
            container.appendChild(cellElement);
        });
    });
}

// Game
switch (Math.floor(Math.random() * 3)) {
    case 0:
        // 6x6 Sliding Puzzle
        console.log('Running Sliding Puzzle...');
        runSlidingPuzzle();
        break;
    case 1:
        // 20x25 99 Minesweeper
        console.log('Running Minesweeper...');
        runMinesweeper();
        break;
    case 2:
        // 9x9 Lights Out
        console.log('Running Lights Out...');
        runLightsOut();
        break;
}