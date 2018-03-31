// @flow
import WebGLInstance from './webgl';
import Polygon from './vertexObject';
import * as g2 from './g2';
import * as m2 from './m2';

function testgl(id: string) {
  /* Step1: Prepare the canvas and get WebGL context */
  const canvas = document.getElementById(id);

  if (canvas instanceof HTMLCanvasElement) {
    // const gl = canvas.getContext('webgl', { antialias: true });

    const vertexShaderSource = 'attribute vec2 coordinates;' +
        'void main(void) {gl_Position = vec4(coordinates,0.0, 1.0);}';
    const fragmentShaderSource = 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);}';

    const varName = 'coordinates';
    const webgl = new WebGLInstance(
      canvas,
      vertexShaderSource,
      fragmentShaderSource,
      [varName],
    );
    const { gl } = webgl;

    if (gl instanceof WebGLRenderingContext) {
      const polygon = new Polygon(webgl, 0.5, 5, 5, 0.01, 0, new g2.Point(0, 0));
      /* Step2: Define the geometry and store it in buffer objects */
      // const vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5];

      // // Create a new buffer object
      // const vertexBuffer = gl.createBuffer();

      // // Bind an empty array buffer to it
      // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      // // Pass the vertices data to the buffer
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      // // Unbind the buffer
      // gl.bindBuffer(gl.ARRAY_BUFFER, null);


      //  Step 4: Associate the shader programs to buffer objects

      // // Bind vertex buffer object
      // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      // // Get the attribute location
      // // const coord = gl.getAttribLocation(shaderProgram, 'coordinates');

      // // point an attribute to the currently bound VBO
      // gl.vertexAttribPointer(webgl.locations[varName], 2, gl.FLOAT, false, 0, 0);

      // // Enable the attribute
      // gl.enableVertexAttribArray(webgl.locations[varName]);

      /* Step5: Drawing the required object (triangle) */

      // // Clear the canvas
      // gl.clearColor(0.5, 0.5, 0.5, 0.9);

      // // Enable the depth test
      // gl.enable(gl.DEPTH_TEST);

      // // Clear the color buffer bit
      // gl.clear(gl.COLOR_BUFFER_BIT);

      // // Set the view port
      // gl.viewport(0, 0, canvas.width, canvas.height);

      // Draw the triangle
      // gl.drawArrays(gl.TRIANGLES, 0, 3);
      polygon.drawWithTransformMatrix(m2.identity(), 12, [1, 0, 0, 1]);
    }
  }
}
export default testgl;
