import { CreateShader, ClearViewport, DrawRectangle } from "./WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

var canvas = document.getElementById("Canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext("webgl");


var vertexShader = /*glsl*/`

   attribute vec2 a_position;

varying vec2 ul;
    void main(){
        ul= a_position-0.5;
        ul *=2.;
        gl_Position=vec4(ul,0,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    uniform float u_time;
    uniform vec2 u_resolution;
    varying  vec2 ul;

    float rand (vec2 ul){
        return fract(sin(dot(ul,vec2(12.23232,72.223232)))*43758.23232);
    }
    float interpolate(float a, float b, float c, float d, vec2 s){
        float up = mix(a,b,s.x);
        float down = mix(c,d,s.x);
        return mix(up,down,s.y);
    }
    float noise(vec2 ul){
        vec2 i = floor(ul);
        vec2 f = fract(ul);

        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));

        vec2 s =smoothstep(0.,1.,f);

        return interpolate(a,b,c,d,s);
    }
    void main(){

        vec3 color = vec3(0);
        float noise=noise(ul+vec2(u_time*0.2)*5.)*noise(ul*5.+vec2(cos(u_time)*0.5,sin(u_time)));

        color= vec3(smoothstep(0.,1.,noise));
        vec3 icolor = 1.-color;
        color += icolor * vec3(0.1,0.2,0.4);
        

        gl_FragColor=vec4(color,1);
    }
`

const program= CreateShader(gl,fragmentShader,vertexShader);
gl.useProgram(program);

var positionAttributeLocationID=gl.getAttribLocation(program,"a_position");
gl.enableVertexAttribArray(positionAttributeLocationID);
//vertex buffer
var vertexBuffer=gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

gl.vertexAttribPointer(positionAttributeLocationID,2,gl.FLOAT,false,0,0);

ClearViewport(gl,canvas,[.3,.3,.3,0]);

var resolutionUniformLocation= gl.getUniformLocation(program,"u_resolution");
gl.uniform2f(resolutionUniformLocation,canvas.width,canvas.height);
var timeUniformID=gl.getUniformLocation(program,"u_time");
function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformID,timeStamp/1000);
    DrawRectangle(gl,0,0,1,1);
    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);