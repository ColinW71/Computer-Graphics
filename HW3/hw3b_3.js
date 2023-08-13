var canvas;
var gl;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    // Vertices for three rectangles, two boxes, and two squares
    var vertices = [
        // Rectangle 1 (top)
        vec2(-0.9, 0.5),
        vec2(-0.9, 0.9),
        vec2(0.9, 0.9),
        vec2(0.9, 0.5),

        // Rectangle 2 (left)
        vec2(-0.9, -0.2),
        vec2(-0.9, 0.7),
        vec2(-0.4, 0.7),
        vec2(-0.4, -0.2),

        // Rectangle 3 (right)
        vec2(0.4, -0.2),
        vec2(0.4, 0.7),
        vec2(0.9, 0.7),
        vec2(0.9, -0.2),

        // Box 1 (bottom-left)
        vec2(-0.9, -0.8),
        vec2(-0.9, -0.6),
        vec2(-0.5, -0.6),
        vec2(-0.5, -0.8),

        // Box 2 (bottom-right)
        vec2(0.5, -0.8),
        vec2(0.5, -0.6),
        vec2(0.9, -0.6),
        vec2(0.9, -0.8),

        // Square 1 (bottom-left)
        vec2(-0.6, -0.9),
        vec2(-0.6, -0.8),
        vec2(-0.8, -0.8),
        vec2(-0.8, -0.85),

        // Square 2 (bottom-right)
        vec2(0.8, -0.85),
        vec2(0.8, -0.65),
        vec2(0.6, -0.8),
        vec2(0.8, -0.8)
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variable with the data buffer
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the first rectangle (top)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw the second rectangle (left)
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);

    // Draw the third rectangle (right)
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);

    // Draw the first box (bottom-left)
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);

    // Draw the second box (bottom-right)
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);

    // Draw the first square (bottom-left)
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

    // Draw the second square (bottom-right)
    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
}