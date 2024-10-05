
import { ClearViewport, CreateShader, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var gl = canvas.getContext("webgl");

var vertexShader = /*glsl*/ `
    attribute vec2 a_position;
    attribute vec4 a_color;
    uniform vec2 u_resolution;


    varying vec2 clipSpace;
    varying vec4 color;
    void main(){
        clipSpace= (a_position/u_resolution)*2.0 -1.0;
        color=a_color;
        gl_Position= vec4(clipSpace,0,1);
    }
`
var fragmentShader = /*glsl*/ `
    precision mediump float;
    

    varying vec2 clipSpace;
    varying vec2 resolution;
    varying vec4 color;
    
    void main(){

        
        gl_FragColor = color;

    }

`


var program = CreateShader(gl, fragmentShader, vertexShader);


gl.useProgram(program);

ClearViewport(gl, canvas, [0, 0, 0, 1]);

//Shader attributes

var posAttribute = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0,0);

var colorAttribute = gl.getAttribLocation(program,"a_color");

var colorBuffer= gl.createBuffer();

//Shader uniforms

var resolutionUniform = gl.getUniformLocation(program, "u_resolution");

gl.enableVertexAttribArray(resolutionUniform);
gl.enableVertexAttribArray(colorAttribute);
gl.uniform2f(resolutionUniform, canvas.width, canvas.height);


//Draw
var width=canvas.width/2;
var height= canvas.height/2;
var positions = [
    width+55,height+0,
    width+67,height+36,
    width+109,height+36,
    width+73,height+54,
    width+83,height+96,
    width+55,height+72,
    width+27,height+96,
    width+37,height+54,
    width+1,height+36,
    width+43,height+36,
]
var colors=[
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random(),1,
    Math.random(),Math.random(),Math.random()
]

var indices = [
    0,1,9,
    1,2,3,
    3,4,5,
    5,6,7,
    7,8,9,
    5,7,9,
    9,1,3,
    9,3,5
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);




var elementsArrayBufferID= gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elementsArrayBufferID);


gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);

gl.vertexAttribPointer(colorAttribute, 4, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES,24, gl.UNSIGNED_SHORT, 0);



