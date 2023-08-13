const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// Compile and link the shaders
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShaderSource = document.getElementById('vertex-shader').textContent;
const fragmentShaderSource = document.getElementById('fragment-shader').textContent;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Create buffer for lines
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [
  // Square border
  -0.50, -0.50,
   0.50, -0.50,
   0.50,  0.50,
  -0.50,  0.50,

  // Horizontal lines
  -0.5, -0.17,
   0.5, -0.17,
  -0.5,  0.17,
   0.5,  0.17,

  // Vertical lines
  -0.18, -0.50,
  -0.18,  0.50,
   0.18, -0.50,
   0.18,  0.50
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Specify vertex position attribute
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Set viewport and clear color
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1, 1, 1, 1); // Set clear color to white
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw lines
gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw the square border
gl.drawArrays(gl.LINES, 4, positions.length / 2); 

