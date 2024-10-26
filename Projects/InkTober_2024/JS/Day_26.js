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
        vec2 box =1.-step(size,abs(ul));

        return box.x*box.y;
    }
    float cross(vec2 ul,float size){
        return box(ul,vec2(size,size/4.)) + box(ul,vec2(size/4.,size));
    }
    mat2 rotationMatrix(float angle){
        return mat2(cos(angle),-sin(angle),
        sin(angle),cos(angle));
    }
    mat2 scaleMatrix(vec2 scale){
        return mat2(scale.x,0,0,scale.y);
    }
    void main(){
        mat2 rotation_matrix = rotationMatrix( u_time*3.141516);
        mat2 scale_matrix = scaleMatrix(vec2(sin(u_time),sin(u_time)));
        vec2 translation_vector = vec2(sin(u_time),cos(u_time))*0.35;
        vec2 coords= ul+translation_vector;
        vec2 coords2 = ul-translation_vector;
        coords= rotation_matrix*scale_matrix*coords;
        coords2=  rotation_matrix*coords2;
        float crossColor=cross(coords,0.2) + cross(coords2,0.2) ;
        vec3 color = vec3(0);
         color +=vec3(crossColor);
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