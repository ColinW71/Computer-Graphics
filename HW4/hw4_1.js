const canvas = document.getElementById('mazeCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const numRows = 10;
const numCols = 10;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = maze[row][col];
      const x = col * cellSize;
      const y = row * cellSize;

      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
}

renderMaze();

const circleRadius = cellSize / 2;
let circleX = circleRadius;
let circleY = circleRadius;

function drawCircle() {
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.stroke();
}

drawCircle();

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
  const { key } = event;

  let newCircleX = circleX;
  let newCircleY = circleY;

  if (key === 'ArrowUp' && circleY - cellSize >= circleRadius && !hasTopWall(circleX, circleY)) {
    newCircleY -= cellSize;
  } else if (key === 'ArrowDown' && circleY + cellSize <= (numRows - 0.5) * cellSize && !hasBottomWall(circleX, circleY)) {
    newCircleY += cellSize;
  } else if (key === 'ArrowLeft' && circleX - cellSize >= circleRadius && !hasLeftWall(circleX, circleY)) {
    newCircleX -= cellSize;
  } else if (key === 'ArrowRight' && circleX + cellSize <= (numCols - 0.5) * cellSize && !hasRightWall(circleX, circleY)) {
    newCircleX += cellSize;
  }

  if (newCircleX !== circleX || newCircleY !== circleY) {
    circleX = newCircleX;
    circleY = newCircleY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderMaze();
    drawCircle();
  }
}

function hasTopWall(x, y) {
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);
  return maze[cellRow][cellCol].walls.top;
}

function hasRightWall(x, y) {
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);
  return maze[cellRow][cellCol].walls.right;
}

function hasBottomWall(x, y) {
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);
  return maze[cellRow][cellCol].walls.bottom;
}

function hasLeftWall(x, y) {
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);
  return maze[cellRow][cellCol].walls.left;
}
