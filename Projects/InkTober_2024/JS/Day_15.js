import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";


var canvas = document.getElementById("Canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`

    attribute vec2 a_position;

    uniform vec2 u_resolution;

    varying vec2 ul;
    void main(){
        ul= a_position/u_resolution *2.0 -1.0;
        gl_Position = vec4(ul,1,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;


    uniform float u_time;

    varying vec2 ul;


    void main(){

        vec3 color=vec3(0.0);
        float distance = length(ul)*1.5;
        float a = atan(ul.x,ul.y);

        float f =abs(cos(a*20.+u_time)*sin(a*3.-u_time*2.))*.8+.1;

        float innerCircle = 1.- step(0.3 + cos(5.*u_time)*0.1,length(ul)*10.);
        f = f - innerCircle ;

        color= vec3(1.- smoothstep(f,f+0.05,distance));

        color *= vec3(1.-distance*3.,distance*distance*2.,1.-distance*distance);

        gl_FragColor=vec4(color,1);
    }
`
const program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);
ClearViewport(gl, canvas, [0, 0, 0, 1]);

var positionAttributeLocationID = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer();

gl.enableVertexAttribArray(positionBuffer);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocationID, 2, gl.FLOAT, false, 0, 0);


var resolutionUniformLocationID = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocationID, canvas.width, canvas.height);

var timeUniformLocationID = gl.getUniformLocation(program, "u_time");

function DrawLoop(timeStamp) {
    gl.uniform1f(timeUniformLocationID, timeStamp / 1000);
    DrawRectangle(gl, 0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);