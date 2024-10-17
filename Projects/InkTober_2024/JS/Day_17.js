import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

var canvas = document.getElementById("Canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`

    attribute vec3 a_position;
    attribute vec3 a_color;

    
    uniform mat4 world_matrix;
    uniform mat4 view_matrix;
    uniform mat4 projection_matrix;

    varying vec3 ul;
    varying vec3 color;
    void main(){
        ul= a_position;
        color=a_color;
        gl_Position = projection_matrix * view_matrix * world_matrix * vec4(ul,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    varying vec2 ul;
    varying vec3 color;

    void main(){

        gl_FragColor=vec4(color,1);
    }
`
const program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);
ClearViewport(gl, canvas, [1, 1, 1, 1]);



var triangleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

var positionAttributeLocationID = gl.getAttribLocation(program, "a_position");
var colorAttributeLocationID = gl.getAttribLocation(program, "a_color");


gl.vertexAttribPointer(positionAttributeLocationID, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(colorAttributeLocationID, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

gl.enableVertexAttribArray(positionAttributeLocationID);
gl.enableVertexAttribArray(colorAttributeLocationID);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

var resolutionUniformLocationID = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocationID, canvas.width, canvas.height);


var worldMatLocation = gl.getUniformLocation(program, "world_matrix");

var viewMatLocation = gl.getUniformLocation(program, "view_matrix");

var projectionMatLocation = gl.getUniformLocation(program, "projection_matrix");

var projMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
var worldMatrix = new Float32Array(16);

mat4.identity(worldMatrix);

mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);

mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(worldMatLocation, gl.FALSE, worldMatrix);
gl.uniformMatrix4fv(viewMatLocation, gl.FALSE, viewMatrix);
gl.uniformMatrix4fv(projectionMatLocation, gl.FALSE, projMatrix);

const vertices = [
    // Top
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
    1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
    1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
    1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
    1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
    1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
    1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
    1.0, -1.0, -1.0, 0.5, 0.5, 1.0,

]

const indices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


var angle = 0;
var iMatrix = new Float32Array(16);

var xRotation = new Float32Array(16);
var yRotation = new Float32Array(16);
mat4.identity(iMatrix);

function DrawLoop(timeStamp) {
    angle = timeStamp / 1000 / 6 * 2 * Math.PI;

    mat4.rotate(xRotation, iMatrix, angle / 4, [1, 0, 0]);
    mat4.rotate(yRotation, iMatrix, angle, [0, 1, 0]);
    mat4.mul(worldMatrix, yRotation, xRotation);
    gl.uniformMatrix4fv(worldMatLocation, gl.FALSE, worldMatrix);

    ClearViewport(gl, canvas, [1, 1, 1, 1]);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);