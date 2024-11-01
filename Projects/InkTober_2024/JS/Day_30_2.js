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

    vec2 rand (vec2 ul){

        vec2 seed = vec2(dot(ul,vec2(322.23232,532.223232)),dot(ul,vec2(132.23232,722.223232)));
        return -1.0 + 2.0*fract(sin(seed)*43758.23232);
    }
    float interpolate(vec2 a, vec2 b, vec2 c, vec2 d, vec2 s,vec2 f){
        float up = mix(dot(a, f - vec2(0.,0.)) ,dot(b,f-vec2(1.,0.)) ,s.x);
        float down = mix(dot(c, f - vec2(0.,1.)),dot(d, f - vec2(1.,1.)),s.x);
        float final=mix(up,down,s.y);
        return final;
    }
    float noise(vec2 ul){
        vec2 i = floor(ul);
        vec2 f = fract(ul);

        vec2 a = rand(i);
        vec2 b = rand(i + vec2(1.0, 0.0));
        vec2 c = rand(i + vec2(0.0, 1.0));
        vec2 d = rand(i + vec2(1.0, 1.0));

        vec2 s =smoothstep(0.,1.,f);

        return interpolate(a,b,c,d,s,f);
    }
    void main(){

        vec3 color = vec3(0);
        float tex=noise(ul*10.)*.5+.5*
        noise(ul*5.+vec2(cos(u_time*.5)*sin(u_time*0.2)*0.3,sin(u_time*.5)*cos(u_time*.3)*.6)+vec2(u_time*.5,0))  +.3;

        color= vec3(smoothstep(0.,1.,tex));
        vec3 icolor = 1.-color;
        color += icolor * vec3(0.1,0.2,0.4);

        gl_FragColor=vec4(color,1);
    }
`

const program = CreateShader(gl, fragmentShader, vertexShader);
gl.useProgram(program);

var positionAttributeLocationID = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocationID);
//vertex buffer
var vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

gl.vertexAttribPointer(positionAttributeLocationID, 2, gl.FLOAT, false, 0, 0);

ClearViewport(gl, canvas, [.3, .3, .3, 0]);

var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
var timeUniformID = gl.getUniformLocation(program, "u_time");
function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformID, timeStamp / 1000);
    DrawRectangle(gl, 0, 0, 1, 1);
    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);