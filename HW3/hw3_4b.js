const canvas = document.getElementById('mazeCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('2d');

// added input from user to specific for NxM maze.
const numRows = parseInt(prompt("Enter the number of rows (N):"));
const numCols = parseInt(prompt("Enter the number of columns (M):"));
const cellSize = 40;

const maze = [];

for (let row = 0; row < numRows; row++) {
  maze[row] = [];
  for (let col = 0; col < numCols; col++) {
    maze[row][col] = {
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true
      }
    };
  }
}





const stack = [];
const visited = new Set();

function generateMaze() {
  const startRow = 0;
  const startCol = 0;
  stack.push([startRow, startCol]);
  visited.add(`${startRow}-${startCol}`);

  while (stack.length > 0) {
    const [row, col] = stack.pop();
    const neighbors = getUnvisitedNeighbors(row, col);

    if (neighbors.length > 0) {
      stack.push([row, col]);

      const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
      visited.add(`${nextRow}-${nextCol}`);

      removeWall(row, col, nextRow, nextCol);
      stack.push([nextRow, nextCol]);
    }
  }
}

function getUnvisitedNeighbors(row, col) {
  const neighbors = [];

  if (row > 0 && !visited.has(`${row - 1}-${col}`)) {
    neighbors.push([row - 1, col]);
  }
  if (col < numCols - 1 && !visited.has(`${row}-${col + 1}`)) {
    neighbors.push([row, col + 1]);
  }
  if (row < numRows - 1 && !visited.has(`${row + 1}-${col}`)) {
    neighbors.push([row + 1, col]);
  }
  if (col > 0 && !visited.has(`${row}-${col - 1}`)) {
    neighbors.push([row, col - 1]);
  }

  return neighbors;
}

function removeWall(currentRow, currentCol, nextRow, nextCol) {
  if (currentRow < nextRow) {
    maze[currentRow][currentCol].walls.bottom = false;
    maze[nextRow][nextCol].walls.top = false;
  } else if (currentRow > nextRow) {
    maze[currentRow][currentCol].walls.top = false;
    maze[nextRow][nextCol].walls.bottom = false;
  } else if (currentCol < nextCol) {
    maze[currentRow][currentCol].walls.right = false;
    maze[nextRow][nextCol].walls.left = false;
  } else if (currentCol > nextCol) {
    maze[currentRow][currentCol].walls.left = false;
    maze[nextRow][nextCol].walls.right = false;
  }
}

generateMaze();


function renderMaze() {
  gl.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = maze[row][col];
      const x = col * cellSize;
      const y = row * cellSize;

      if (cell.walls.top) {
        gl.beginPath();
        gl.moveTo(x, y);
        gl.lineTo(x + cellSize, y);
        gl.stroke();
      }
      if (cell.walls.right) {
        gl.beginPath();
        gl.moveTo(x + cellSize, y);
        gl.lineTo(x + cellSize, y + cellSize);
        gl.stroke();
      }
      if (cell.walls.bottom) {
        gl.beginPath();
        gl.moveTo(x + cellSize, y + cellSize);
        gl.lineTo(x, y + cellSize);
        gl.stroke();
      }
      if (cell.walls.left) {
        gl.beginPath();
        gl.moveTo(x, y + cellSize);
        gl.lineTo(x, y);
        gl.stroke();
      }
    }
  }
}

renderMaze();

const entranceSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
const exitSide = (entranceSide + 2) % 4;

if (entranceSide === 0) {
  maze[0][Math.floor(Math.random() * numCols)].walls.top = false;
} else if (entranceSide === 1) {
  maze[Math.floor(Math.random() * numRows)][numCols - 1].walls.right = false;
} else if (entranceSide === 2) {
  maze[numRows - 1][Math.floor(Math.random() * numCols)].walls.bottom = false;
} else if (entranceSide === 3) {
  maze[Math.floor(Math.random() * numRows)][0].walls.left = false;
}

if (exitSide === 0) {
  maze[0][Math.floor(Math.random() * numCols)].walls.top = false;
} else if (exitSide === 1) {
  maze[Math.floor(Math.random() * numRows)][numCols - 1].walls.right = false;
} else if (exitSide === 2) {
  maze[numRows - 1][Math.floor(Math.random() * numCols)].walls.bottom = false;
} else if (exitSide === 3) {
  maze[Math.floor(Math.random() * numRows)][0].walls.left = false;
}

renderMaze();