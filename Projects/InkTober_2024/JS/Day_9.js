import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


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

    varying vec2 ul;
    varying vec2 resolution;
    varying vec2 mousePos;
    void main(){
        mousePos=u_mouse;
        ul = a_position/u_resolution * 2.0 -1.0;
        resolution=u_resolution;
        gl_Position = vec4(ul,0,1);

    }
`
var fragmentShader = /*glsl*/ `
    precision mediump float;

    varying vec2 ul;
    varying vec2 resolution;
    varying vec2 mousePos;
    float random(vec2 st){
        float d= dot(st,mousePos);
        float rand=sin(d)*23232.;
        rand=fract(rand);
        return rand;
    }

    void main(){
        vec2 st = ul*25.0; //Scale the coord
        vec2 ipos = floor(st);  // get the integer coords
        vec2 fpos = fract(st);  // get the fractional coords

        vec3 color = vec3(random( ipos ));

        gl_FragColor = vec4(color,1);

    }
`

let program=CreateShader(gl,fragmentShader,vertexShader);
gl.useProgram(program);

ClearViewport(gl,canvas,[0,0,0,1]);



var u_resolutionID=gl.getUniformLocation(program,"u_resolution");
gl.uniform2f(u_resolutionID, canvas.width, canvas.height);



var a_positionID = gl.getAttribLocation(program,"a_position");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
gl.enableVertexAttribArray(positionBuffer);

gl.vertexAttribPointer(a_positionID, 2, gl.FLOAT, false, 0, 0);

var mousePosID=gl.getUniformLocation(program,"u_mouse");


function DrawLoop(timeStamp) {

    gl.uniform2f(mousePosID, mouseCoords[0], mouseCoords[1]);
    DrawRectangle(gl,0,0,canvas.width,canvas.height);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);