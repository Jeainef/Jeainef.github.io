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

    float circle(vec2 ul, float radius, float width){
        float d = length(ul);
        return step(radius-width,d)- step(radius,d) ;
    }
    float satellite(vec2 position, float radius){
        return 1.-step(radius,dot(position,position));
    }
    mat2 rotation_matrix(float angle){
        return mat2(cos(angle),-sin(angle),
    sin(angle),cos(angle));
    }
    void main(){

        vec3 color = vec3(0);
        //sun
        color.rg += 1.-smoothstep(0.,0.2,length(ul));
        color +=  1.-smoothstep(0.,0.2+ cos(u_time*3.14)/25.,length(ul));

        //Lines
        color += circle(ul,0.3,0.005);
        color += circle(ul,0.6,0.005);
        color += circle(ul,0.9,0.005);

        //Planets
        vec2 planetRotation_1= vec2(sin(u_time*6.),cos(u_time*6.));
        vec2 planetRotation_2= vec2(sin(u_time*3.),cos(u_time*3.));
        vec2 planetRotation_3= vec2(sin(u_time),cos(u_time));

        color.gb -= satellite(planetRotation_1*0.3+ul,0.002);
        color.r += satellite(planetRotation_1*0.3+ul,0.002);
      
        color.b -= satellite(planetRotation_2*0.6+ul,0.002);
        color.rg += satellite(planetRotation_2*0.6+ul,0.002);

        color.rg -= satellite(planetRotation_3*0.9+ul,0.002);
        color.b += satellite(planetRotation_3*0.9+ul,0.002);

        color += vec3(0.1,0,0.15);
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