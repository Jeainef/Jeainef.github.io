
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
        step(radius, length(position));
    }
    float squareShape(vec2 position, vec2 scale){
        scale = vec2(0.5) - scale*0.5;
        position += 0.5;
        vec2 shaper = vec2(step(scale.x,position.x), step(scale.y,position.y));

        shaper *= vec2(step(scale.x, 1.0 - position.x), step(scale.y,1.0-position.y));

        return shaper.x * shaper.y;
    }
    void main(){

        float square =  squareShape(clipSpace,vec2(.5));
        vec3 color = vec3(1.0-square) * 0.3;

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