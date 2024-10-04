
import { ClearViewport, CreateShader, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var gl = canvas.getContext("webgl");

var vertexShader = /*glsl*/ `
    attribute vec2 a_position;

    uniform vec2 u_resolution;


    varying vec2 clipSpace;
    varying vec2 resolution;

    void main(){
        clipSpace= (a_position/u_resolution)*2.0 -1.0;
        clipSpace.x = clipSpace.x *  u_resolution.x/u_resolution.y;

        resolution = u_resolution;
        
        gl_Position= vec4(clipSpace,0,1);
    }
`
var fragmentShader = /*glsl*/ `
    precision mediump float;
    

    varying vec2 clipSpace;
    varying vec2 resolution;
    
    float circleShape(vec2 position, float radius){
        return 
        step(radius, length(position)) - step(radius +0.1, length(position))
        + step(radius+0.2, length(position))  - step(radius +0.3, length(position))
        ;
    }
    void main(){

        float circle =  circleShape(clipSpace,0.4);
        vec3 color = vec3(circle);

        gl_FragColor = vec4(color,1);

    }

`


var program = CreateShader(gl, fragmentShader, vertexShader);


gl.useProgram(program);

ClearViewport(gl, canvas, [0, 0, 0, 1]);

//Shader attributes

var posAttribute = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0, 0);


//Shader uniforms

var resolutionUniform = gl.getUniformLocation(program, "u_resolution");

gl.enableVertexAttribArray(resolutionUniform);

gl.uniform2f(resolutionUniform, canvas.width, canvas.height);


//Draw

DrawRectangle(gl, 0, 0, canvas.width, canvas.height);