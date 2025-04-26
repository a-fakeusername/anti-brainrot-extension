const winMessage = 'omg u won!';

const loseMessage = 'u lost 🤓, maybe shud lock in';

const dirs = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0] // Up
];

// -------------------- Sliding Puzzle Game Logic --------------------

function runSlidingPuzzle() {
    const grid = generateSlidingPuzzleGrid();
    const tiles = drawSlidingPuzzle(grid);

    // Find the empty tile position
    let emptyTile = [];
    grid.forEach((row, i) => {
        row.forEach((tile, j) => {
            if (tile === null) {
                emptyTile = [i, j]; // Find the empty tile position
            }
        });
    });

    // Add event listeners for tile clicks
    tiles.forEach((row, i) => {
        row.forEach((tile, j) => {
            tile.addEventListener('click', () => {
                // Check if the clicked tile is adjacent to the empty space
                const di = Math.abs(i - emptyTile[0]);
                const dj = Math.abs(j - emptyTile[1]);
                if (di + dj === 1) {
                    // Swap the clicked tile with the empty space
                    [grid[i][j], grid[emptyTile[0]][emptyTile[1]]] = [grid[emptyTile[0]][emptyTile[1]], grid[i][j]]; // Swap tiles in the grid
                    updateSlidingPuzzle(tiles, [i, j], emptyTile); // Redraw the grid with updated state
                    emptyTile = [i, j]; // Update empty tile position

                    // Check for win condition
                    const isWin = grid.every((row, rowIndex) => row.every((tile, colIndex) => tile === rowIndex * grid[0].length + colIndex || tile === null));
                    if (isWin) {
                        alert(winMessage);
                        window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*'); // Close overlay on win
                    }
                }
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

// locs are in the form [i, j]
function updateSlidingPuzzle(tiles, loc1, loc2) {
    [tiles[loc1[0]][loc1[1]].textContent, tiles[loc2[0]][loc2[1]].textContent] = [tiles[loc2[0]][loc2[1]].textContent, tiles[loc1[0]][loc1[1]].textContent]; // Swap text content
    [tiles[loc1[0]][loc1[1]].style.backgroundColor, tiles[loc2[0]][loc2[1]].style.backgroundColor] = [tiles[loc2[0]][loc2[1]].style.backgroundColor, tiles[loc1[0]][loc1[1]].style.backgroundColor]; // Swap background color
}

function getSlidingPuzzleTileColor(val) {
    if (val === null) {
        return 'gray'; // Empty space color
    }

    // Calculate position in spectrum - value between 0 and 1
    const i = Math.floor(val / 6); // Row index (0-5)
    const j = val % 6; // Column index (0-5)
    const position = Math.min(i, j) / 5; // Normalize to [0, 1]
    
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

// -------------------- Minesweeper Game Logic --------------------

function runMinesweeper() {
    let grid = generateMinesweeperGrid(20, 25, 99);
    let visible = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
    let tiles = drawMinesweeper(grid, visible);

    let enabled = true; // Flag to control click events
    // Add event listeners for cell clicks
    tiles.forEach((row, i) => {
        row.forEach((cell, j) => {
            cell.addEventListener('click', () => {
                if (!enabled) return; // Ignore clicks if disabled

                const cellValue = grid[i][j];
                if (cellValue === -1) {
                    enabled = false; // Disable further clicks
                    alert(loseMessage);

                    grid = generateMinesweeperGrid(20, 25, 99); // Regenerate the grid
                    visible = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false)); // Reset visibility
                    updateMinesweeper(grid, tiles, visible); // Redraw the grid
                    enabled = true; // Re-enable clicks
                } else {
                    revealMinesweeperCell(grid, tiles, visible, i, j); // Reveal the clicked cell
                    updateMinesweeper(grid, tiles, visible); // Redraw the grid with updated visibility
                    if (checkMinesweeperWin(grid, visible)) {
                        alert(winMessage);
                        window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*'); // Close overlay on win
                    }
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

function drawMinesweeper(grid, visible) {
    const container = document.querySelector('.puzzle-container');
    container.innerHTML = ''; // Clear previous content
    container.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`; // Set grid columns
    container.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`; // Set grid rows
    container.id = 'minesweeper-container'; // Set ID for styling

    const tiles = Array.from({length: grid.length }, () => Array(grid[0].length).fill(null)); // Store cell elements

    grid.forEach((row, i) => {
        row.forEach((val, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'puzzle-tile';
            cellElement.style.gridRowStart = i + 1;
            cellElement.style.gridColumnStart = j + 1;
            container.appendChild(cellElement);
            tiles[i][j] = cellElement; // Store the cell element
        });
    });

    updateMinesweeper(grid, tiles, visible);

    return tiles; // Return the array of cell elements for click handling
}

function updateMinesweeper(grid, tiles, visible) {
    tiles.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (visible[i][j]) {
                cell.style.backgroundColor = 'lightgray'; // Update color based on value
                cell.textContent = grid[i][j] > 0 ? grid[i][j] : ''; // Update text content
                cell.style.color = getMinesweeperTileColor(grid[i][j]); // Update text color based on value
            } else {
                cell.style.backgroundColor = 'lightgreen'; // Reset color for hidden cells
                cell.textContent = ''; // Clear text content for hidden cells
            }
        });
    });
}

function revealMinesweeperCell(grid, tiles, visible, i, j) {
    if (grid[i][j] === -1) {
        return;
    } else if (grid[i][j] === 0) {
        // If the cell is empty, reveal adjacent cells
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[0].length && !visible[ni][nj]) {
                    visible[ni][nj] = true; // Mark the cell as visible
                    revealMinesweeperCell(grid, tiles, visible, ni, nj); // Recursively reveal adjacent cells
                }
            }
        }
    } else {
        visible[i][j] = true; // Mark the cell as visible
    }
}

function checkMinesweeperWin(grid, visible) {
    // Check if all non-mine cells are revealed
    return grid.every((row, i) => row.every((cell, j) => cell === -1 || visible[i][j]));
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

// -------------------- Lights Out Game Logic --------------------

function runLightsOut() {
    const grid = generateLightsOutGrid(9, 9);
    const tiles = drawLightsOut(grid);

    // Add event listeners for cell clicks
    tiles.forEach((row, i) => {
        row.forEach((cell, j) => {
            cell.addEventListener('click', () => {
                // Toggle the clicked cell and its neighbors
                grid[i][j] = !grid[i][j];
                for (const [di, dj] of dirs) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[0].length) {
                        grid[ni][nj] = !grid[ni][nj]; // Toggle adjacent lights
                    }
                }

                // Check for win condition
                const isWin = grid.every(row => row.every(cell => !cell)); // Check if all lights are off
                updateLightsOut(grid, tiles); // Redraw the grid with updated state
                if (isWin) {
                    alert(winMessage);
                    window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*'); // Close overlay on win
                }

            });
        });
    });
}

function generateLightsOutGrid(rows, cols) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Toggle the light with a 50% chance
            if (Math.random() < 0.5) {
                grid[i][j] = !grid[i][j];
                for (const [di, dj] of dirs) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                        grid[ni][nj] = !grid[ni][nj]; // Toggle adjacent lights
                    }
                }
            }

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

    const tiles = Array.from({length: grid.length }, () => Array(grid[0].length).fill(null)); // Store cell elements

    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'puzzle-tile';
            cellElement.style.gridRowStart = i + 1;
            cellElement.style.gridColumnStart = j + 1;
            cellElement.style.backgroundColor = cell ? 'yellow' : 'gray'; // Set color based on state
            container.appendChild(cellElement);
            tiles[i][j] = cellElement; // Store the cell element
        });
    });

    return tiles; // Return the array of cell elements for click handling
}
function updateLightsOut(grid, tiles) {
    tiles.forEach((row, i) => {
        row.forEach((cell, j) => {
            cell.style.backgroundColor = grid[i][j] ? 'yellow' : 'gray'; // Update color based on state
        });
    });
}

// Game
runMinesweeper();
// switch (Math.floor(Math.random() * 3)) {
    // case 0:
    //     // 6x6 Sliding Puzzle
    //     console.log('Running Sliding Puzzle...');
    //     runSlidingPuzzle();
    //     break;
    // case 1:
    //     // 20x25 99 Minesweeper
    //     console.log('Running Minesweeper...');
    //     runMinesweeper();
    //     break;
    // case 2:
    //     // 9x9 Lights Out
    //     console.log('Running Lights Out...');
    //     runLightsOut();
    //     break;
// }