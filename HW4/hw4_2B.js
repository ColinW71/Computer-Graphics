const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

// Get shader source from HTML
const vertexShaderSource = document.getElementById("vertex-shader").textContent;
const fragmentShaderSource = document.getElementById("fragment-shader").textContent;

// Create shader program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Look up attribute location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Create vertex buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Mouse position variables
let mouseX = 0;
let mouseY = 0;

// Event listener for mouse movement
canvas.addEventListener("mousemove", handleMouseMove);

// Mouse movement handler
function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

// Ball object
const balls = [];

for (let i = 0; i < 10; i++) {
  const ball = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    radius: 0.05,
    velocityX: (Math.random() * 0.02 - 0.01),
    velocityY: (Math.random() * 0.02 - 0.01),
    gravity: 0.001, 
    damping: 0.99, 
  };

  balls.push(ball);
}

// Render loop
function render() {
  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    // Update ball position and velocity
    ball.velocityY -= ball.gravity; 
    ball.velocityX *= ball.damping; 
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Check if ball hits the screen edges
    const hitRight = ball.x + ball.radius > 1;
    const hitLeft = ball.x - ball.radius < -1;
    const hitTop = ball.y + ball.radius > 1;
    const hitBottom = ball.y - ball.radius < -1;

    // Reverse direction when hitting edges
    if (hitRight || hitLeft) {
      ball.velocityX = -ball.velocityX;
    }
    if (hitTop || hitBottom) {
      ball.velocityY = -ball.velocityY;
    }

    // Handle collision with other balls
    for (let j = i + 1; j < balls.length; j++) {
      const otherBall = balls[j];
      const dx = otherBall.x - ball.x;
      const dy = otherBall.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.radius + otherBall.radius) {
        // Balls collide, adjust velocities
        const normalX = dx / distance;
        const normalY = dy / distance;
        const tangentX = -normalY;
        const tangentY = normalX;

        // Dot product of velocities with the normal and tangent vectors
        const v1n = ball.velocityX * normalX + ball.velocityY * normalY;
        const v1t = ball.velocityX * tangentX + ball.velocityY * tangentY;
        const v2n = otherBall.velocityX * normalX + otherBall.velocityY * normalY;
        const v2t = otherBall.velocityX * tangentX + otherBall.velocityY * tangentY;

        // Calculate new normal velocities
        const v1nAfter = (v1n * (ball.radius - otherBall.radius) + 2 * otherBall.radius * v2n) / (ball.radius + otherBall.radius);
        const v2nAfter = (v2n * (otherBall.radius - ball.radius) + 2 * ball.radius * v1n) / (ball.radius + otherBall.radius);

        // Convert velocities back to x and y components
        const v1nX = v1nAfter * normalX;
        const v1nY = v1nAfter * normalY;
        const v1tX = v1t * tangentX;
        const v1tY = v1t * tangentY;

        const v2nX = v2nAfter * normalX;
        const v2nY = v2nAfter * normalY;
        const v2tX = v2t * tangentX;
        const v2tY = v2t * tangentY;

        // Set new velocities for the balls
        ball.velocityX = v1nX + v1tX;
        ball.velocityY = v1nY + v1tY;
        otherBall.velocityX = v2nX + v2tX;
        otherBall.velocityY = v2nY + v2tY;
      }
    }

    // Clamp ball position within screen bounds
    ball.x = Math.max(-1 + ball.radius, Math.min(ball.x, 1 - ball.radius));
    ball.y = Math.max(-1 + ball.radius, Math.min(ball.y, 1 - ball.radius));

    // Draw the ball
    const ballVertices = createCircleVertices(ball.x, ball.y, ball.radius, 20);

    // Bind vertex buffer and update data for the ball
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ballVertices), gl.STATIC_DRAW);

    // Tell WebGL how to read vertex data for the ball
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Draw the ball
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ballVertices.length / 2);
  }

  // Request next frame
  requestAnimationFrame(render);
}

// Utility function to create a shader
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Utility function to create a shader program
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// Utility function to create vertices for a circle
function createCircleVertices(centerX, centerY, radius, segments) {
  const vertices = [];
  const angleIncrement = (2 * Math.PI) / segments;
  for (let i = 0; i <= segments; i++) {
    const angle = i * angleIncrement;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push(x, y);
  }
  return vertices;
}

render();
