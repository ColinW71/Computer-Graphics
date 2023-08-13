const canvas = document.getElementById("myCanvas");
const gl = canvas.getContext("webgl");

// Define the vertices of the octagon
const vertices = [
  0.5, 0.0, 0.0,
  0.3536, 0.3536, 0.0,
  0.0, 0.5, 0.0,
  -0.3536, 0.3536, 0.0,
  -0.5, 0.0, 0.0,
  -0.3536, -0.3536, 0.0,
  0.0, -0.5, 0.0,
  0.3536, -0.3536, 0.0
];

// Create a buffer to store the vertices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Create a vertex shader
const vertexShaderSource = document.getElementById("vertexShader").textContent;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// Create a fragment shader
const fragmentShaderSource = document.getElementById("fragmentShader").textContent;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create a shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Bind the vertex buffer to the shader program
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aPosition");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Set the background color to white
gl.clearColor(1.0, 1.0, 1.0, 1.0);

// Clear the canvas
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the line color to black
gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColor"), 0.0, 0.0, 0.0, 1.0);

// Draw the octagon
gl.drawArrays(gl.LINE_LOOP, 0, 8);
