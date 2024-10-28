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

    float Square(vec2 ul, float width){
        ul -= vec2(0.5);
        vec2 c =1.- smoothstep(width, width+0.002, abs(ul));
        return c.x * c.y;
    }
    float Pattern_1(vec2 ul,float width){
        ul *=3.;
        ul=fract(ul);
        return Square(ul,width);
    }
    float Pattern_2(vec2 ul,float width){
        ul *=2.;
        ul=fract(ul);
        return Square(ul,width);
    }
    void main(){
        vec2 coords_pattern_1 = ul*3.;
        coords_pattern_1 = fract(coords_pattern_1);

        vec3 color = vec3(0);

        color+= Pattern_1(ul,0.1);

        color += Pattern_1(coords_pattern_1,0.4);
        color *= vec3(0,0,0.5);
       
        color +=vec3(0.,0.7,0) * Pattern_2(coords_pattern_1,0.4);
        color -=vec3(0.,0.7,0) * Pattern_1(coords_pattern_1,0.4) ;
        

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