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
var colorAttributeLocationID= gl.getAttribLocation(program, "a_color");


gl.vertexAttribPointer(positionAttributeLocationID, 3, gl.FLOAT, false, 6* Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(colorAttributeLocationID, 3, gl.FLOAT, false,6* Float32Array.BYTES_PER_ELEMENT, 3* Float32Array.BYTES_PER_ELEMENT);

gl.enableVertexAttribArray(positionAttributeLocationID);
gl.enableVertexAttribArray(colorAttributeLocationID);


var resolutionUniformLocationID = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocationID, canvas.width, canvas.height);


var worldMatLocation=gl.getUniformLocation(program,"world_matrix");

var viewMatLocation=gl.getUniformLocation(program,"view_matrix");

var projectionMatLocation=gl.getUniformLocation(program,"projection_matrix");

var projMatrix= new Float32Array(16);
var viewMatrix= new Float32Array(16);
var worldMatrix= new Float32Array(16);

mat4.identity(worldMatrix);

mat4.lookAt(viewMatrix,[0,0,-2],[0,0,0],[0,1,0]);

mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);

gl.uniformMatrix4fv(worldMatLocation,gl.FALSE,worldMatrix);
gl.uniformMatrix4fv(viewMatLocation,gl.FALSE,viewMatrix);
gl.uniformMatrix4fv(projectionMatLocation,gl.FALSE,projMatrix);

const vertices=[
    0,0.5,0,        1,0,0,
    -0.5,-0.5,0,    0,1,0,
    0.5,-0.5,0,     0,0,1

]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

gl.drawArrays(gl.TRIANGLES, 0, 3);
