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
    


    float random (vec2 st) {
        return fract(sin(dot(st.xy,
                             vec2(42.9898,78.233)))*
            43758.5453123);
    }
    void main(){


        vec3 colorB = vec3(0.113,0.100,0.410);
        vec3 colorA = vec3(0.309,1.000,0.836);

        float rand= random(ul);
        float pct = abs(sin(smoothstep(-1.,0.,ul.x) - smoothstep(0.,1.,ul.x) + time));

        vec3 finalColor=mix(colorA, colorB,(1. - rand) * pct + pct);
        gl_FragColor=vec4(finalColor,1);
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