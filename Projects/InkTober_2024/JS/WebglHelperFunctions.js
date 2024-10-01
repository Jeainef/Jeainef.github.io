


function CreateShader_source(gl,type,source){

    var shader = gl.createShader(type); //Create a shader

    gl.shaderSource(shader,source); //Specify the source (code of the shader)
    gl.compileShader(shader); //Compile the shader

    //test if it compiled correctly
    var success= gl.getShaderParameter(shader,gl.COMPILE_STATUS);
    if(success) return shader;
    else console.log("There was an error creating the shader: " + source);
}

function CreateProgram(gl,vertex_shader,fragment_shader){

    var program = gl.createProgram(); //Create a new program

    //Attack the fragment and vertex shader
    gl.attachShader(program,vertex_shader);
    gl.attachShader(program,fragment_shader);

    gl.linkProgram(program); //Link the shaders to the program

    //Check if it works correctly
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;
    else console.log("The program failed to link. Check if the shaders are correct");
}


/**
 * Creates and compiles a shader.
 *
 *  context = The WebGL Context.
 * frag = the fragment shader code
 * vert = the vertex shader code
 * returns the program
 */
export function CreateShader(context, frag, vert){
    var fragmentShader = CreateShader_source(context,context.FRAGMENT_SHADER,frag);
    var vertexShader = CreateShader_source(context,context.VERTEX_SHADER,vert);

    var program=CreateProgram(context,vertexShader,fragmentShader);
    return program;
}
