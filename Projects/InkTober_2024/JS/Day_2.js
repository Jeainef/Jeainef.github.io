import { CreateShader, DrawRectangle, ClearViewport } from "./WebglHelperFunctions.js"

var canvas = document.getElementById("Canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext("webgl");

//Define shaders

var vertexShader = /*glsl*/`

    uniform vec2 u_resolution;
    uniform float u_time;
    attribute vec2 a_position;

    varying vec2 ul;
    varying float time;
    void main(){

        vec2 clipSpace= (a_position / u_resolution) * 2.0 - 1.0;
        ul=clipSpace;
        time=u_time;
        ul.x = ul.x *  u_resolution.x/u_resolution.y;
        gl_Position = vec4(clipSpace,0,1);
    }

`;

var fragmentShader =  /*glsl*/ `
    precision mediump float;

    uniform vec2 u_resolution;
    varying vec2 ul;
    varying float time;

    void main(){

        vec2 fract_ul = ul;
        vec3 finalColor=vec3(0.0);
        
        fract_ul= fract(fract_ul) - 0.5;
        float distanceToCenter= length(fract_ul);
        distanceToCenter= abs(sin(distanceToCenter *8.0 + time/1000.0)/8.0);

        distanceToCenter = 0.1 / smoothstep(0.0,0.1,distanceToCenter);
        distanceToCenter = fract(distanceToCenter);
        float distanceToTrueCenter=abs(sin(length(ul) *8.0 - time/1000.0)/8.0);
         distanceToTrueCenter= 0.1 / smoothstep(0.0,0.1,length(distanceToTrueCenter));
        vec3 color =vec3(distanceToCenter,distanceToCenter * distanceToTrueCenter,distanceToCenter* distanceToTrueCenter);
        gl_FragColor=vec4(color,1);
    }


`;


//Start program

var program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);

ClearViewport(gl, canvas, [0, 0, 0, 1]);




var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var timeLocation = gl.getUniformLocation(program, "u_time");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.enableVertexAttribArray(resolutionUniformLocation);

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


function DrawLoop(timeStamp) {

    gl.uniform1f(timeLocation, timeStamp);
    DrawRectangle(gl, 0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(DrawLoop);
}

window.requestAnimationFrame(DrawLoop);