const cellSize = 40;
const gridWidth = 10;
const gridHeight = 10;
const wallColor = "#000"; 
const backgroundColor = "#fff"; 

// Initialize the canvas.
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Initialize the grid.
const grid = createGrid(gridWidth, gridHeight);

// Function to create the initial grid state
function createGrid(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const walls = {
        top: false,
        right: false,
        bottom: false,
        left: false,
      };
      row.push(walls); // Object with flags for each wall
    }
    grid.push(row);
  }
  // Manually set walls so you can remove perimeters 
  // top
  grid[0][1].top = true;
  grid[0][2].top = true;
  grid[0][3].top = true;
  grid[0][4].top = true;
  grid[0][5].top = true;
  grid[0][6].top = true;
  grid[0][7].top = true;
  grid[0][8].top = true;
  grid[0][9].top = true;

  // bottom
  grid[2][1].bottom = true;
  grid[2][2].bottom = true;
  grid[2][8].bottom = true;
  grid[2][9].bottom = true;

  grid[9][1].bottom = true;
  grid[9][2].bottom = true;
  grid[9][3].bottom = true;
  grid[9][4].bottom = true;
  grid[9][5].bottom = true;
  grid[9][6].bottom = true;
  grid[9][7].bottom = true;
  grid[9][8].bottom = true;
  grid[9][9].bottom = true;

  grid[4][6].bottom = true;
  grid[4][7].bottom = true;

  //right
  // right perimeter wall
  grid[0][9].right = true;
  grid[1][9].right = true;
  grid[2][9].right = true;
  grid[3][9].right = true;
  grid[4][9].right = true;
  grid[5][9].right = true;
  grid[6][9].right = true;
  grid[7][9].right = true;

  //left
  // left perimeter wall
  grid[0][1].left = true;
  grid[1][1].left = true;
  grid[2][1].left = true;
  grid[3][1].left = true;
  grid[4][1].left = true;
  grid[7][1].left = true;
  grid[8][1].left = true;
  grid[9][1].left = true;

  grid[5][3].left = true;
  grid[6][3].left = true;
  grid[7][3].left = true;
  grid[8][3].left = true;
  grid[9][3].left = true;

  grid[0][6].left = true;
  grid[1][6].left = true;
  grid[2][6].left = true;
  grid[3][6].left = true;
  grid[4][6].left = true;

  grid[7][6].left = true;
  grid[8][6].left = true;
  grid[9][6].left = true;

  grid[7][8].left = true;
  grid[8][8].left = true;
  grid[9][8].left = true;
 
  return grid;
}

// Function to draw the grid
function drawGrid() {
  // Clear the canvas
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the grid lines
  context.lineWidth = 1;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const cellX = x * cellSize;
      const cellY = y * cellSize;

      const walls = grid[y][x];

      // Draw top line
      if (walls.top) {
        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(cellX, cellY);
        context.lineTo(cellX + cellSize, cellY);
        context.stroke();
      }

      // Draw right line
      if (walls.right) {
        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(cellX + cellSize, cellY);
        context.lineTo(cellX + cellSize, cellY + cellSize);
        context.stroke();
      }

      // Draw bottom line
      if (walls.bottom) {
        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(cellX + cellSize, cellY + cellSize);
        context.lineTo(cellX, cellY + cellSize);
        context.stroke();
      }

      // Draw left line
      if (walls.left) {
        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(cellX, cellY + cellSize);
        context.lineTo(cellX, cellY);
        context.stroke();
      }
    }
  }
}
drawGrid(); // Initial draw of the grid
