import { CreateShader } from "./WebglHelperFunctions.js";

var canvas= document.getElementById("Canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

var gl = canvas.getContext("webgl");
if(!gl){
    console.log("webgl isnt wbgling");
}

var vertexShader_source=/*glsl*/ ` 
 
        // an attribute will receive data from a buffer
    attribute vec2 a_position;
 
    uniform vec2 u_resolution;
 
    void main() {
    // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;
 
    // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
        vec2 clipSpace = zeroToTwo - 1.0;
 
        gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
    }
          `

var fragmentShader_source= /*glsl*/ `

        // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  uniform vec4 u_color;
 
  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = u_color; // return reddish-purple
  }

`


var program=CreateShader(gl,fragmentShader_source,vertexShader_source);

var positionAttributeLocation=gl.getAttribLocation(program,"a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

var positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


gl.clearColor(1,1,1,1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);


gl.enableVertexAttribArray(resolutionUniformLocation);

// Bind the position buffer.

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


var size=2;
var type=gl.FLOAT;
var normalize=false;
var stride=0;
var offset=0;
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, 
    normalize, stride, offset);

for(let i=0;i<45;i++){
    gl.uniform4f(colorUniformLocation,Math.random(),Math.random(),Math.random(),1);
    DrawRectangle(gl,Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*150,Math.random()*150);
}




//Functions

function DrawRectangle(context,x,y,width,height){
    var x1=x;
    var x2=x+width;

    var y1=y;
    var y2=y+height;

    var positions=[
        x1,y1,
        x2,y1,
        x2,y2,
        x2,y2,
        x1,y1,
        x1,y2

    ]

    context.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 6);


}