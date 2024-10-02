import { CreateShader,DrawRectangle,ClearViewport } from "./WebglHelperFunctions.js"

var canvas= document.getElementById("Canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var gl= canvas.getContext("webgl");

//Define shaders

var vertexShader = /*glsl*/`

    uniform vec2 u_resolution;

    attribute vec2 a_position;

    varying vec2 ul;
    void main(){

        ul = (a_position/u_resolution);
        ul = ul*2.0;
        ul = ul - 1.0;
        gl_Position = vec4(ul,0,1);
    }

`;

var fragmentShader =  /*glsl*/ `
    precision mediump float;

    varying vec2 ul;

    void main(){

        gl_FragColor=vec4(ul,0,1);
    }


`;


//Start program

var program= CreateShader(gl,fragmentShader,vertexShader);
gl.useProgram(program);

ClearViewport(gl,canvas,[1,1,1,1]);




var positionAttributeLocation=gl.getAttribLocation(program,"a_position");
var resolutionUniformLocation=gl.getUniformLocation(program,"u_resolution");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.enableVertexAttribArray(resolutionUniformLocation);

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.vertexAttribPointer(positionAttributeLocation,2,gl.FLOAT, false,0,0)

DrawRectangle(gl,0,0,canvas.width,canvas.height);