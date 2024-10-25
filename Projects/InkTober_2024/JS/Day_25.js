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
        ul= a_position  * 2. - 1.;
        gl_Position=vec4(ul,0,1);
    }

`

var fragmentShader = /*glsl*/`
    precision mediump float;

    uniform float u_time;
    varying  vec2 ul;

    float box(vec2 ul, vec2 size){
        vec2 box =1.-smoothstep(size,size+vec2(0.001),abs(ul));

        return box.x*box.y;
    }
    float cross(vec2 ul,float size){
        return box(ul,vec2(size,size/4.)) + box(ul,vec2(size/4.,size));
    }
    
    void main(){
        vec2 transformation=vec2(0,0);
        transformation.x= sin(u_time*12.)/3. * cos(u_time)*2.;
        transformation.y=sin(u_time)*0.8;
        float box= cross(ul + transformation ,0.1);
        vec3 color=vec3(box);
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


var timeUniformID=gl.getUniformLocation(program,"u_time");
function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformID,timeStamp/1000);
    DrawRectangle(gl,0,0,1,1);
    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);