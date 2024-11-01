import { CreateShader, ClearViewport, DrawRectangle } from "/Projects/WebGL/JS/WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

//Get page values
var canvas = document.getElementById("canvas");

//Set Canvas size and context
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");


//Vertex Shader

var vertexShader= /*glsl*/ `
    attribute vec2 a_position;

    varying vec2 st;
    void main(){
        st = (a_position -0.5) * 2.;
        gl_Position= vec4(st,0.,1.);
    }
`
//Fragment Shader

var fragmentShader= /*glsl*/ `
    precision mediump float;

    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mousePos;

    varying vec2 st;

    vec2 rand2f(vec2 st){
        float x=fract(sin(dot(st,vec2(233.32,155.32)))*9232.223);
        float y=fract(sin(dot(st,vec2(541.32,212.32)))*9232.223);
        return vec2( x, y);
    }
    void main(){
        //Set aspect ratio
        vec2 coords =st;
        coords.x *= u_resolution.x/u_resolution.y;

        coords *=5.;
        vec2 tileCoord = floor(coords);
        vec2 pixelCoord= fract(coords);

        //Set initial colorS
        vec3 color= vec3(0.);
        
        float minDistance = 1.;
        for(int x=-1;x<=1; x++){
            for(int y=-1; y<=1; y++){
                //We set the coords of the adjacent tile
                vec2 adjacentTile = vec2(x,y);
                vec2 adjacentPoint = rand2f(tileCoord + adjacentTile);
                vec2 diff= adjacentTile + adjacentPoint - pixelCoord;
                float dist = length(diff);

                minDistance= min(minDistance,dist);
            }
        }
        color+=minDistance;
        gl_FragColor= vec4(color,1);
    }
`

//Create program
const program = CreateShader(gl,fragmentShader,vertexShader);
gl.useProgram(program);

//Create buffers
var vertexPositionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
gl.bindBuffer(gl.ARRAY_BUFFER,vertexPositionBuffer);

//Assign attributes

let positionAttributeID=gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeID);
gl.vertexAttribPointer(positionAttributeID, 2, gl.FLOAT, false, 0, 0);

ClearViewport(gl,canvas,[0.,0.,0.,1]);

var timeUniformID = gl.getUniformLocation(program, "u_time");
var resolutionUniformID = gl.getUniformLocation(program,"u_resolution");
gl.uniform2f(resolutionUniformID,canvas.width,canvas.height);


function DrawLoop(timeStamp) {

    gl.uniform1f(timeUniformID,timeStamp/1000);
    DrawRectangle(gl,0,0,1,1);
    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);