
import { ClearViewport, CreateShader, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width=window.innerWidth;

var gl= canvas.getContext("webgl");

var vertexShader = /*glsl*/ `
    attribute vec2 a_position;

    uniform vec2 u_resolution;
    uniform float u_time;

    varying vec2 clipSpace;
    varying float time;
    void main(){
        clipSpace= (a_position/u_resolution) * 2.0 - 1.0;
        clipSpace.x = clipSpace.x *  u_resolution.x/u_resolution.y;
        time= u_time/1000.0;
        gl_Position= vec4(clipSpace,0,1);
    }
`
var fragmentShader = /*glsl*/ `
    precision mediump float;
    
    varying float time;
    varying vec2 clipSpace;
    void main(){

        gl_FragColor=vec4(1,0,0,1);
    }

`
var program = CreateShader(gl,fragmentShader,vertexShader);

gl.useProgram(program);

ClearViewport(gl,canvas,[1,1,1,1]);


var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var timeUniformLocation = gl.getUniformLocation(program, "u_time");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);



gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(resolutionUniformLocation);


gl.uniform2f(resolutionUniformLocation,canvas.width,canvas.height);




function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformLocation, timeStamp);
    
    DrawRectangle(gl,0,0,canvas.width,canvas.height);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);


