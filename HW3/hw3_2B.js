"use strict";

var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    //
    //  Initialize our data for a triangle fan
    //

    // First, initialize the points.

    points = new Float32Array([
        0.0, 0.0,  // Central vertex
        0.0, 0.5,  // Vertex 1
        0.35, 0.35, // Vertex 2
        0.5, 0.0,  // Vertex 3
        0.35, -0.35, // Vertex 4
        0.0, -0.5, // Vertex 5
        -0.35, -0.35, // Vertex 6
        -0.5, 0.0,  // Vertex 7
        -0.35, 0.35, // Vertex 8
        0.0, 0.5   // Vertex 9
    ]);

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

    // Associate our shader variables with the data buffer

    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
}
