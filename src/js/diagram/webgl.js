// @flow

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  // console.log(gl.getProgramInfoLog(_program));
  gl.deleteProgram(program);
  return null;
}


function createShader(gl: WebGLRenderingContext, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}


function createProgramFromScripts(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) {
  // Get the strings for our GLSL shaders
  // const vertexShaderSource = document.getElementById(vertexScript).text;
  // const fragmentShaderSource = document.getElementById(fragScript).text;
  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  if (vertexShader && fragmentShader) {
    return createProgram(gl, vertexShader, fragmentShader);
  }
  return null;
}

function getGLLocations(gl, program, locationsList) {
  let i;
  const newLocations = {};
  let loc;
  for (i = 0; i < locationsList.length; i += 1) {
    loc = locationsList[i];
    if (loc[0] === 'a') {
      newLocations[loc] = gl.getAttribLocation(program, loc);
    }
    if (loc[0] === 'u') {
      newLocations[loc] = gl.getUniformLocation(program, loc);
    }
  }
  return newLocations;
}

function resizeCanvasToDisplaySize(canvas) {
  // const mul = multiplier || 1;
  const mul = window.devicePixelRatio * 2;
  const width = canvas.clientWidth * mul || 0;
  const height = canvas.clientHeight * mul || 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;     // eslint-disable-line no-param-reassign
    canvas.height = height;   // eslint-disable-line no-param-reassign
    return true;
  }
  return false;
}

/* eslint-disable */
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


class WebGLInstance {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  locations: Object;

  constructor(
  canvas: HTMLCanvasElement,
  vertexSource: string,
  fragmentSource: string,
  shaderLocations: Array<string>,
) {
    // console.log(canvas.getContext('webgl', { antialias: true }))
    const gl = canvas.getContext('webgl', { antialias: true });
    // let program = null;
    // let locations = {};
    console.log("GL: ", typeof gl)
    console.log(gl)
    if (gl instanceof WebGLRenderingContext) {
      this.gl = gl;
      this.program = createProgramFromScripts(
        this.gl,
        vertexSource,
        fragmentSource,
      );

      this.locations = getGLLocations(this.gl, this.program, shaderLocations);

      // Prep canvas
      resizeCanvasToDisplaySize(this.gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      // this.gl.viewport(0, 500, 500, 500);   // Tell WebGL how to convert from clip space to pixels

      // Clear the canvas
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.clear(gl.COLOR_BUFFER_BIT);
      this.gl.disable(this.gl.DEPTH_TEST);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      // gl.enable(gl.BLEND);
      this.gl.useProgram(this.program);

      // window.addEventListener('resize', autoResize.bind(this, event));
  }

  // return {
  //   gl:  gl,
  //   program: program,
  //   locations: locations,
    // resizeCanvasToDisplaySize: resizeCanvasToDisplaySize,
  }
}


export default WebGLInstance;
