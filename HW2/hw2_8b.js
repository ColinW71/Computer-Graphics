var canvas = document.getElementById("mazeCanvas");
var gl = canvas.getContext("webgl");

// vertex shader.
var vertexShaderSource = document.getElementById("vertex-shader").textContent;
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// fragment shader.
var fragmentShaderSource = document.getElementById("fragment-shader").textContent;
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create shader program.
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Create a buffer.
var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Take input from user for NxM generated maze.
var N = parseInt(prompt("Enter the number of rows (N):"));
var M = parseInt(prompt("Enter the number of columns (M):"));

// Create maze grid.
var grid = [];
for (var i = 0; i < N; i++) {
  var row = [];
  for (var j = 0; j < M; j++) {
    row.push({ visited: false, walls: { top: true, right: true, bottom: true, left: true } });
  }
  grid.push(row);
}

// Add entrances on left and right sides.
grid[0][0].walls.left = false; // left side.
grid[N - 1][M - 1].walls.right = false; // right side.

// Recursive Backtracking algorithm.
var stack = []; // stack to keep track of visited cells.
var currentCell = { x: 0, y: 0 }; 
while (true) {
  var { x, y } = currentCell;
  grid[y][x].visited = true;

  // Find neighboring cells
  var neighbors = [];
  if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ x, y: y - 1 }); // top neighbor.
  if (y < N - 1 && !grid[y + 1][x].visited) neighbors.push({ x, y: y + 1 }); // bottom neighbor.
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ x: x - 1, y }); // left neighbor.
  if (x < M - 1 && !grid[y][x + 1].visited) neighbors.push({ x: x + 1, y }); // right neighbor.

  if (neighbors.length > 0) {
    var randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    stack.push(currentCell); // push the current cell onto the stack
    removeWall(currentCell, randomNeighbor); 
    currentCell = randomNeighbor; // move to the chosen neighbor
  } else if (stack.length > 0) {
    currentCell = stack.pop(); // backtrack to the previous cell
  } else {
    break; 
  }
}

// Function to remove walls between cells.
function removeWall(cell1, cell2) {
  var dx = cell2.x - cell1.x;
  var dy = cell2.y - cell1.y;
  if (dx === 1) {
    grid[cell1.y][cell1.x].walls.right = false; 
    grid[cell2.y][cell2.x].walls.left = false; 
  } else if (dx === -1) {
    grid[cell1.y][cell1.x].walls.left = false; 
    grid[cell2.y][cell2.x].walls.right = false; 
  } else if (dy === 1) {
    grid[cell1.y][cell1.x].walls.bottom = false; 
    grid[cell2.y][cell2.x].walls.top = false; 
  } else if (dy === -1) {
    grid[cell1.y][cell1.x].walls.top = false; 
    grid[cell2.y][cell2.x].walls.bottom = false; 
  }
}

// Create maze vertices.
var vertices = [];
for (var i = 0; i < N; i++) {
  for (var j = 0; j < M; j++) {
    var x1 = 2 * j / M - 1;
    var y1 = 2 * i / N - 1;
    var x2 = x1 + 2 / M;
    var y2 = y1 + 2 / N;

    if (grid[i][j].walls.top) {
      vertices.push(x1, y1);
      vertices.push(x2, y1);
    }
    if (grid[i][j].walls.right) {
      vertices.push(x2, y1);
      vertices.push(x2, y2);
    }
    if (grid[i][j].walls.bottom) {
      vertices.push(x1, y2);
      vertices.push(x2, y2);
    }
    if (grid[i][j].walls.left) {
      vertices.push(x1, y1);
      vertices.push(x1, y2);
    }
  }
}

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Enable vertex attributes.
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw maze.
gl.drawArrays(gl.LINES, 0, vertices.length / 2);
