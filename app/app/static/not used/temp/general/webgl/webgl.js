let WebGLGeneral = (function () {
  "use strict";
  function createProgram(gl, vertexShader, fragmentShader) {
    let _program
    _program = gl.createProgram();
    gl.attachShader(_program, vertexShader);
    gl.attachShader(_program, fragmentShader);
    gl.linkProgram(_program);
    var success = gl.getProgramParameter(_program, gl.LINK_STATUS);
    if (success) {
      return _program;
    }

  console.log(gl.getProgramInfoLog(_program));
  gl.deleteProgram(_program);
  }


  function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }


  function createProgramFromScripts(gl, vertexScript, fragScript) {
    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.getElementById(vertexScript).text;
    var fragmentShaderSource = document.getElementById(fragScript).text;
    
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    return createProgram(gl, vertexShader, fragmentShader);
  }

  function getGLLocations(gl, program, locations_list) {
    let i;
    let new_locations = {};
    let loc;
    for (i=0; i<locations_list.length; ++i) {
      loc = locations_list[i]; 
      if (loc[0] == "a"){
        new_locations[loc] = gl.getAttribLocation(program, loc);
      }
      if (loc[0] == "u"){
        new_locations[loc] = gl.getUniformLocation(program, loc);
      }
    }
    return new_locations;
  }

  function resizeCanvasToDisplaySize(canvas, multiplier) {
      multiplier = multiplier || 1;
      multiplier = window.devicePixelRatio*2;
      var width  = canvas.clientWidth  * multiplier | 0;
      var height = canvas.clientHeight * multiplier | 0;
      
      if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
      }
      return false;

    }

  return {
    getGLLocations:             getGLLocations,
    createProgramFromScripts:   createProgramFromScripts,
    resizeCanvasToDisplaySize:  resizeCanvasToDisplaySize,
  }
})();

function WebGLInstance(canvas, vertextScript, fragmentScript, shaderLocations) {
  "use strict";
// console.log(webgl.gl.getContextAttributes().antialias)
//   webgl.gl.setContextAttributes( {antialias:true});
  // canvas.width = canvas.clientWidth* window.devicePixelRatio;
  // canvas.height = canvas.clientheight*window.devicePixelRatio;
  // document.getElementById("headerbar").innerHTML = window.devicePixelRatio;
  this.gl = canvas.getContext("webgl",{antialias:true});
  if (!this.gl) {
    console.log("Could not get webgl instance");
  }
  
  

  this.program = WebGLGeneral.createProgramFromScripts(this.gl, vertextScript, fragmentScript);
  
  this.locations = WebGLGeneral.getGLLocations(this.gl, this.program, shaderLocations);

  function resizeCanvasToDisplaySize(canvas, multiplier) {
    return WebGLGeneral.resizeCanvasToDisplaySize(canvas, multiplier);
  }

  resizeCanvasToDisplaySize(this.gl.canvas);                   // Prep canvas
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);   // Tell WebGL how to convert from clip space to pixels
  // this.gl.viewport(0, 500, 500, 500);   // Tell WebGL how to convert from clip space to pixels
  this.gl.clearColor(0, 0, 0, 0);                              // Clear the canvas
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  // gl.disable(gl.DEPTH_TEST);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  // gl.enable(gl.BLEND);
  this.gl.useProgram(this.program);  

  window.addEventListener('resize', autoResize.bind(this,event));

  return {
    gl:  this.gl,
    program: this.program,
    locations: this.locations,
    resizeCanvasToDisplaySize: resizeCanvasToDisplaySize,
  }
  
}

function autoResize(event) {
    // let contRect = document.getElementById('container').getBoundingClientRect();
    // let diagRect = document.getElementById('diagram').getBoundingClientRect();
    // let textRect = document.getElementById('learning_text_container').getBoundingClientRect();
    // let canvRect = this.gl.canvas.getBoundingClientRect();
    // // console.log(contRect)
    // console.log(this.gl.canvas.getBoundingClientRect());
    // // this.gl.canvas.height = 500;
    // // this.gl.canvas.width = 500;
    // // this.gl.canvas.width=500;
    // // this.gl.viewport(diagRect.left, canvRect.height+canvRect.top, textRect.width, textRect.height); 
    // // this.gl.viewport(0,0,100,100);
    // // console.log(document.getElementById('Diagram').left);
}
