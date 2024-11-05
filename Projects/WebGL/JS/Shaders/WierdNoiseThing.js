import { CreateShader, ClearViewport, DrawRectangle, hexToRgb } from "/Projects/WebGL/JS/WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

//Get page values
var canvas = document.getElementById("canvas");


//Values

//Set Canvas size and context
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");


//Vertex Shader

var vertexShader= /*glsl*/ `
    attribute vec2 a_position;

    varying vec2 st;
    void main(){
        vec2 centeredCoords = (a_position -0.5) * 2.;
        st=a_position;
        gl_Position= vec4(centeredCoords,0.,1.);
    }
`
//Fragment Shader

var fragmentShader= /*glsl*/ `
    precision mediump float;

    
    uniform float u_time;
    uniform vec2 u_resolution;

    uniform float u_size;
    uniform int u_repeating;
    varying vec2 st;
    
    float Random(vec2 st){
        return fract(sin(dot(st,vec2(12.23232,75.343)))*42516.4343);
    }
    float BilinearInterpolation(float a, float b, float c, float d, vec2 s){
        float up= mix(a,b,s.y);
        float down= mix(c,d,s.y);
        return mix(up,down,s.x);
    }
    float perlinNoise(vec2 st){

        vec2 tile = floor(st);
        vec2 tileValues = fract(st);

        float a = Random(tile);
        float b = Random(tile+vec2(0,1.));
        float c = Random(tile+vec2(1.,0.));
        float d = Random(tile+vec2(1.,1.));

        vec2 s = smoothstep(0.,1.,tileValues);
        return BilinearInterpolation(a,b,c,d,s);
    }
    float fbm(vec2 coords){
        float value=0.;
        float lacunarity = 2.0;
        float gain = 0.5;
        //
        // Initial values
        float amplitude = 0.5 ;
        float frequency = 1.;

        vec2 icoords=coords;

        mat2 rot= mat2(cos(0.5),-sin(0.5),cos(0.5),sin(0.5));
        for(int i=1;i<17;i++){
            
            value += amplitude * perlinNoise(icoords);

            amplitude *=gain;
            frequency*=lacunarity;
            icoords+=rot*icoords*2. + vec2(100.);
        }
        return value;
    }
    void main(){
        //Set aspect ratio
        vec2 coords =st*4.;
        
        vec2 initialWrap =vec2(fbm(coords));
        //Set initial colorS
        vec3 color= vec3(fbm(initialWrap+vec2(u_time,0)));
        

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
