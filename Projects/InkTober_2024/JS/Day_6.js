import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


//Events

window.addEventListener("mousemove", getMouseCoords);

var mouseCoords = [
    0, 0
]

function getMouseCoords(event) {
    mouseCoords[0] = event.clientX;
    mouseCoords[1] = event.clientY;
    console.log(mouseCoords[1] / canvas.height * 2 - 1);
}

// Shader
var gl = canvas.getContext("webgl");

var vertexShader = /*glsl*/ `

    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;


    varying vec2 clipSpace;
    varying vec2 mousePosition;
    varying float time;
    void main(){
        float aspectRatio=u_resolution.x/u_resolution.y;
        mousePosition=(u_mouse/u_resolution) *2.0 - 1.0;
        mousePosition.y=-mousePosition.y;
        time=u_time/1000.0;
        clipSpace = (a_position/u_resolution) * 2.0 - 1.0;
        clipSpace.x*aspectRatio;
        gl_Position = vec4(clipSpace,0,1);
    }

`

var fragmentShader = /*glsl*/ `
    precision mediump float;

    varying vec2 clipSpace;
    varying vec2 mousePosition;
    varying float time;
    void main(){
        float mouselenght= distance(clipSpace,mousePosition);
        mouselenght = smoothstep(0.01,0.7, mouselenght);
        mouselenght += abs(sin(mouselenght*16. + time))/16.;
        mouselenght = 0.05/ mouselenght;

        
        gl_FragColor=vec4(0,mouselenght,mouselenght,1);
    }
`

var program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);

ClearViewport(gl, canvas, [1, 1, 1, 1]);

var resolutionLocationID = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionLocationID, canvas.width, canvas.height);


//attributes

var a_positionLocationID = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionBuffer);

gl.vertexAttribPointer(a_positionLocationID, 2, gl.FLOAT, false, 0, 0);

DrawRectangle(gl, 0, 0, canvas.width, canvas.height);

var timeUniformID = gl.getUniformLocation(program, "u_time");
var mousePosID = gl.getUniformLocation(program, "u_mouse");





function DrawLoop(timeStamp) {

    gl.uniform2f(mousePosID, mouseCoords[0], mouseCoords[1]);
    gl.uniform1f(timeUniformID, timeStamp);

    DrawRectangle(gl, 0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);

