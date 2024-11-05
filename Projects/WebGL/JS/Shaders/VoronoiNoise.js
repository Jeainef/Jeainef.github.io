import { CreateShader, ClearViewport, DrawRectangle, hexToRgb } from "/Projects/WebGL/JS/WebglHelperFunctions.js";

const { vec2, vec3, mat3, mat4 } = glMatrix;

//Get page values
var canvas = document.getElementById("canvas");

var timeSlider = document.getElementById("timeSlider");
var sizeSlider = document.getElementById("sizeSlider");
var repetitionSlider = document.getElementById("fractSlider");

var mainColor = document.getElementById("mainColor");
var secondaryColor = document.getElementById("secondaryColor");

//Values
var timeMultiplier = timeSlider.value/100;
var tileSize = sizeSlider.value;
var repeatingAmount = repetitionSlider.value;
var mainColorRGB = hexToRgb(mainColor.value);
var secondaryColorRGB = hexToRgb(secondaryColor.value);
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
    uniform vec2 u_mousePos;
    uniform vec3 u_mainColor;
    uniform vec3 u_secondaryColor;

    uniform float u_size;
    uniform int u_repeating;
    varying vec2 st;

    vec2 rand2f(vec2 st){
        float x=fract(sin(dot(st,vec2(233.32,155.32)))*(9232.223));
        float y=fract(sin(dot(st,vec2(541.32,212.32)))*9232.223);
        return vec2( x, y);
    }
    void main(){
        //Set aspect ratio
        vec2 coords =st+0.5;
        coords.x *= u_resolution.x/u_resolution.y;



        //Set initial colorS
        vec3 color= vec3(0.);
        
        float minDistance = 1.;
        float finalminDistance = 1.;
        int repetitions = u_repeating;
        for(int z=1; z<=15; z++){

            if(z>u_repeating) break;
            vec2 tiledCoords =coords * u_size * float(z)*0.5;
            vec2 tileCoord = floor(tiledCoords);
            vec2 pixelCoord= fract(tiledCoords);
            for(int x=-1;x<=1; x++){
                for(int y=-1; y<=1; y++){
                    //We set the coords of the adjacent tile
                    vec2 adjacentTile = vec2(x,y);
                    vec2 adjacentPoint = rand2f(tileCoord  + adjacentTile);
                    adjacentPoint =0.5 + 0.5 * sin(u_time + 645.343*adjacentPoint);
                    vec2 diff= adjacentTile + adjacentPoint - pixelCoord;
                    float dist = length(diff);
    
                    minDistance= min(minDistance,dist);
                }
            }
            finalminDistance=min(finalminDistance,minDistance);
            color+=0.5*finalminDistance/(float(z));
            color= min(color,1.);

        }
        vec3 backgroundColor = 1.- color;

        color *= u_mainColor;
        color += backgroundColor*u_secondaryColor;
        //color= color* vec3(239./255.,228./255.,0.) + backgroundColor*vec3(0.,0.05,0.3);
         //color += 1. - step(0.1,minDistance);
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

var repeatUniform = gl.getUniformLocation(program, "u_repeating");
var tileSizeUniform = gl.getUniformLocation(program, "u_size");

var mainColorUniform = gl.getUniformLocation(program, "u_mainColor");
var secondaryColorUniform = gl.getUniformLocation(program, "u_secondaryColor");

gl.uniform1f(tileSizeUniform,tileSize);
gl.uniform1i(repeatUniform,repeatingAmount);
gl.uniform3f(mainColorUniform,mainColorRGB[0],mainColorRGB[1],mainColorRGB[2]);
gl.uniform3f(secondaryColorUniform,secondaryColorRGB[0],secondaryColorRGB[1],secondaryColorRGB[2]);
function DrawLoop(timeStamp) {
    gl.uniform1f(timeUniformID,timeStamp*timeMultiplier/1000);
   
    DrawRectangle(gl,0,0,1,1);
    window.requestAnimationFrame(DrawLoop);
}
window.requestAnimationFrame(DrawLoop);

timeSlider.oninput= function(){
    timeMultiplier=this.value/100;
    console.log(timeMultiplier);
}
sizeSlider.oninput= function(){
    tileSize=this.value;
    gl.uniform1f(tileSizeUniform,tileSize);
    console.log(tileSize);
}

repetitionSlider.oninput= function(){
    repeatingAmount=this.value;
    gl.uniform1i(repeatUniform,repeatingAmount);
    console.log(repeatingAmount);
}

mainColor.oninput= function(){
    mainColorRGB = hexToRgb(this.value);
    gl.uniform3f(mainColorUniform,mainColorRGB[0],mainColorRGB[1],mainColorRGB[2]);

    console.log(mainColorRGB);
}
secondaryColor.oninput= function(){
    secondaryColorRGB = hexToRgb(this.value);
    gl.uniform3f(secondaryColorUniform,secondaryColorRGB[0],secondaryColorRGB[1],secondaryColorRGB[2]);

    console.log(secondaryColorRGB);
}