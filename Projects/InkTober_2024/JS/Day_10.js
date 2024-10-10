import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`
    attribute vec2 a_position;
    
    uniform vec2 u_resolution;
    uniform float u_time;

    varying float time;
    varying vec2 ul;

    void main(){
        ul=a_position/u_resolution *2.0 -1.0;
        time=u_time/1000.;

        gl_Position=vec4(ul,0,1);

    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    varying float time;
    varying vec2 ul;

    float random(vec2 st){
        float d= dot(st,vec2(22.1,32.1));
        float rand=sin(d)*23332.;
        rand=fract(rand);
        return rand;
    }

    void main(){
        vec2 coords= ul*time;
        vec2 i = floor(coords);
        vec2 f = fract(coords);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);

        float finalColor= mix(a, b, u.x) +
        (c - a)* u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
        gl_FragColor=vec4(vec3(finalColor),1);
    }
`

const program = CreateShader(gl, fragmentShader, vertexShader);

gl.useProgram(program);

ClearViewport(gl, canvas, [0, 0, 0, 1]);

var resolutionUniformLocationID = gl.getUniformLocation(program, "u_resolution");

gl.uniform2f(resolutionUniformLocationID, canvas.width, canvas.height);

var positionAttributeLocationID = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.enableVertexAttribArray(positionBuffer);

gl.vertexAttribPointer(positionAttributeLocationID, 2, gl.FLOAT, false, 0, 0);

var timeUniformLocationID = gl.getUniformLocation(program, "u_time");
function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformLocationID, timeStamp);
    DrawRectangle(gl, 0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);