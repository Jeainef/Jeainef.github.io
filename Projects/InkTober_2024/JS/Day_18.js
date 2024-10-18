import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

var canvas = document.getElementById("Canvas");
var image = document.getElementById("crate-image");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`

    attribute vec3 a_position;
    attribute vec2 a_textureCoord;

    
    uniform mat4 world_matrix;
    uniform mat4 view_matrix;
    uniform mat4 projection_matrix;

    varying vec3 ul;
    varying vec2 vertTextCoord;
    void main(){
        ul= a_position;
        vertTextCoord=a_textureCoord;
        gl_Position = projection_matrix * view_matrix * world_matrix * vec4(ul,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    varying vec2 ul;
    varying vec2 vertTextCoord;

    uniform sampler2D sampler;

    void main(){

        gl_FragColor=texture2D(sampler,vertTextCoord);
    }
`
const program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);
ClearViewport(gl, canvas, [1, 1, 1, 1]);



var triangleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

var positionAttributeLocationID = gl.getAttribLocation(program, "a_position");
var texColorAttributeLocationID = gl.getAttribLocation(program, "a_textureCoord");


gl.vertexAttribPointer(positionAttributeLocationID, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(texColorAttributeLocationID, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

gl.bindTexture(gl.TEXTURE_2D, null);

gl.enableVertexAttribArray(positionAttributeLocationID);
gl.enableVertexAttribArray(texColorAttributeLocationID);
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
    -1.0, 1.0, -1.0, 0, 0,
    -1.0, 1.0, 1.0, 0, 1,
    1.0, 1.0, 1.0, 1, 1,
    1.0, 1.0, -1.0, 1, 0,

    // Left
    -1.0, 1.0, 1.0, 0, 0,
    -1.0, -1.0, 1.0, 1, 0,
    -1.0, -1.0, -1.0, 1, 1,
    -1.0, 1.0, -1.0, 0, 1,

    // Right
    1.0, 1.0, 1.0, 1, 1,
    1.0, -1.0, 1.0, 0, 1,
    1.0, -1.0, -1.0, 0, 0,
    1.0, 1.0, -1.0, 1, 0,

    // Front
    1.0, 1.0, 1.0, 1, 1,
    1.0, -1.0, 1.0, 1, 0,
    -1.0, -1.0, 1.0, 0, 0,
    -1.0, 1.0, 1.0, 0, 1,

    // Back
    1.0, 1.0, -1.0, 0, 0,
    1.0, -1.0, -1.0, 0, 1,
    -1.0, -1.0, -1.0, 1, 1,
    -1.0, 1.0, -1.0, 1, 0,

    // Bottom
    -1.0, -1.0, -1.0, 1, 1,
    -1.0, -1.0, 1.0, 1, 0,
    1.0, -1.0, 1.0, 0, 0,
    1.0, -1.0, -1.0, 0, 1,

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


gl.bindTexture(gl.TEXTURE_2D, texture);
gl.activeTexture(gl.TEXTURE0);
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