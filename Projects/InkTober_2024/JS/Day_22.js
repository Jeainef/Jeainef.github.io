import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

var canvas = document.getElementById("Canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`

    attribute vec3 a_position;
  

    uniform mat4 u_world_matrix;
    uniform mat4 u_projection_matrix;
    uniform mat4 u_view_matrix;

    varying vec3 ul;

    void main(){

        gl_Position = u_projection_matrix * u_view_matrix * u_world_matrix * vec4(a_position,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    varying vec3 ul;



    void main(){
        gl_FragColor = vec4(1,0,0,1);
    }
`
const vertices = [
    // Top
    -1.0, 1.0, -1.0, 
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 
    1.0, 1.0, -1.0, 

    // Left
    -1.0, 1.0, 1.0, 
    -1.0, -1.0, 1.0,  
    -1.0, -1.0, -1.0, 
    -1.0, 1.0, -1.0, 

    // Right
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,  
    1.0, -1.0, -1.0, 
    1.0, 1.0, -1.0,

    // Front
    1.0, 1.0, 1.0, 
    1.0, -1.0, 1.0, 
    -1.0, -1.0, 1.0, 
    -1.0, 1.0, 1.0, 

    // Back
    1.0, 1.0, -1.0, 
    1.0, -1.0, -1.0, 
    -1.0, -1.0, -1.0, 
    -1.0, 1.0, -1.0, 

    // Bottom
    -1.0, -1.0, -1.0, 
    -1.0, -1.0, 1.0, 
    1.0, -1.0, 1.0, 
    1.0, -1.0, -1.0, 

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

const program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);


//BUFFERS

//Vertex data buffer
var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//Texture2D buffer



//Element data buffer
var elementArrayBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArrayBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


//VERTEX ATTRIBUTES

//Position
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(positionAttributeLocation);



//STATIC UNIFORMS


let world_matrix = new Float32Array(16);
mat4.identity(world_matrix);

let world_matrix_location = gl.getUniformLocation(program, "u_world_matrix");
gl.uniformMatrix4fv(world_matrix_location, gl.FALSE, world_matrix);

let projection_matrix = new Float32Array(16);
mat4.perspective(projection_matrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
let projection_matrix_location = gl.getUniformLocation(program, "u_projection_matrix");
gl.uniformMatrix4fv(projection_matrix_location, gl.FALSE, projection_matrix);

let view_matrix = new Float32Array(16);
mat4.lookAt(view_matrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
let view_matrix_location = gl.getUniformLocation(program, "u_view_matrix");
gl.uniformMatrix4fv(view_matrix_location, gl.FALSE, view_matrix);







let dragging=false;
let mouseDragStart=[
    0,0
]
let moveCoords=[
    0,0
]
window.addEventListener("mousedown", (event) => {

    dragging=true;
    mouseDragStart=[event.x,event.y];
    console.log("dragging");


});

window.addEventListener("mouseup", (event) => {

    dragging=false;
    moveCoords=[0,0]
    console.log("Dropped");


});
window.addEventListener("mousemove", (event) => {

    if(!dragging) return;
    moveCoords=[ (event.x - mouseDragStart[0])/canvas.width ,(event.y - mouseDragStart[1])/canvas.height]
    console.log(moveCoords);


});

var angle = [2 * Math.PI ,2*Math.PI];

;
var iMatrix = new Float32Array(16);
mat4.identity(iMatrix);

var xRotation = new Float32Array(16);
var yRotation = new Float32Array(16);

function DrawLoop(timeStamp) {
    angle[0] += moveCoords[0]/10;
    angle[1] -= moveCoords[1]/10;
    mat4.rotate(xRotation, iMatrix, angle[1], [1, 0, 0]);

    mat4.rotate(yRotation, iMatrix, angle[0] , [0, 1, 0]);

    mat4.mul(world_matrix, yRotation, xRotation);

    gl.uniformMatrix4fv(world_matrix_location, gl.FALSE, world_matrix);

    ClearViewport(gl, canvas, [1, 1, 1, 1]);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);