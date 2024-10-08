import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


// Shader
var gl = canvas.getContext("webgl");

var vertexShader = /*glsl*/ `

    attribute vec2 a_position;
    
    uniform vec2 u_resolution;
    uniform vec2 u_rotation;

    varying vec4 v_color;
    varying vec2 ul;
    void main(){
        
        
        ul = a_position;
        ul = vec2(
            ul.x * u_rotation.y + ul.y * u_rotation.x,
            ul.y * u_rotation.y - ul.x * u_rotation.x);

        v_color=vec4(abs(ul.x + ul.y),abs(ul.y + ul.x),abs(ul.y+ul.y),1);
        gl_Position = vec4(ul,0,1);

    }
`
var fragmentShader = /*glsl*/ `
    precision mediump float;

    varying vec4 v_color;
    varying vec2 ul;
    void main(){
        float distance = 0.3/ smoothstep(0.1,0.6,length(ul));
        vec4 finalColor= normalize(v_color)*distance;
        finalColor = finalColor;
        gl_FragColor = finalColor;

    }
`

let program=CreateShader(gl,fragmentShader,vertexShader);
gl.useProgram(program);

ClearViewport(gl,canvas,[0,0,0,1]);



var u_resolutionID=gl.getUniformLocation(program,"u_resolution");
var rotationLocation = gl.getUniformLocation(program, "u_rotation");



gl.uniform2f(u_resolutionID, canvas.width, canvas.height);



var a_positionID = gl.getAttribLocation(program,"a_position");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
gl.enableVertexAttribArray(positionBuffer);

gl.vertexAttribPointer(a_positionID, 2, gl.FLOAT, false, 0, 0);



function DrawLoop(timeStamp) {

    gl.uniform2f(rotationLocation, Math.cos(timeStamp/1000),Math.sin(timeStamp/1000));
    DrawRectangle(gl,-0.3,-0.3,0.6,0.6);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);

