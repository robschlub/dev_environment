// @flow
import Polygon from './vertexObjects/Polygon';
import PolygonFilled from './vertexObjects/PolygonFilled';
import { Transform, Point, TransformLimit } from './g2';
// import * as m2 from './m2';
// import { Console } from '../tools/tools';
import { DiagramElementCollection, DiagramElementPrimative, AnimationPhase } from './Element';
// import GlobalVariables from './globals';
import Diagram from './Diagram';
import * as tools from './mathtools';

class ShapesCollection extends DiagramElementCollection {
  _square: DiagramElementPrimative;

  constructor(webgl, transform, diagramLimits) {
    super(transform);

    const square = new Polygon(
      webgl,
      4,
      0.475 * Math.sqrt(2), 0.05 * Math.sqrt(2),
      Math.PI / 4, new Point(0, 0),
    );

    const triangle = new PolygonFilled(
      webgl,
      3,
      0.2,
      0, new Point(0, 0),
    );

    this.add('square', new DiagramElementPrimative(
      square,
      new Transform().scale(0.5, 0.5).rotate(0.1).translate(1, 1),
      [0, 0, 1, 1], diagramLimits,
    ));
    // $FlowFixMe
    const sq = this._square;
    sq.isTouchable = true;
    sq.isMovable = true;

    this.add('triangle', new DiagramElementPrimative(
      triangle,
      new Transform().scale(1.5, 1.5).rotate(0).translate(2, 1),
      [0, 1, 0, 1], diagramLimits,
    ));
    // $FlowFixMe
    const tri = this._triangle;
    tri.isTouchable = true;
    tri.isMovable = true;

    this.isTouchable = true;
  }
}

class Diagram1 extends Diagram {
  elements: ShapesCollection | DiagramElementCollection;

  createDiagramElements() {
    this.elements = new ShapesCollection(
      this.webgl,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      this.limits,
    );
  }
}


function testgl(id: string) {
  /* Step1: Prepare the canvas and get WebGL context */
  const canvas = document.getElementById(id);

  // if (canvas instanceof HTMLCanvasElement) {

  if (canvas instanceof HTMLCanvasElement) {
    const diagram = new Diagram1(canvas, 0, 0, 8, 4);

    // eslint-disable-next-line
    const phase1 = new AnimationPhase(
      new Transform().scale(1, 1).rotate(1).translate(0, 0),
      5, -1, tools.easeinout,
    );
    // eslint-disable-next-line
    const phase2 = new AnimationPhase(
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      5, 1, tools.easeinout,
    );

    diagram.elements.pulse.frequency = 0.25;
    diagram.elements.pulse.A = 1;
    diagram.elements.pulse.B = 0.5;
    diagram.elements.pulse.C = 0;
    diagram.elements.pulse.time = 4;

    diagram.elements.state.movement.velocity = new Transform()
      .scale(0, 0).rotate(0).translate(1, 0);
    // diagram.elements.moveState.previous = diagram.elements.transform;
    diagram.elements.move.freely.deceleration = new TransformLimit(0.1, 0.1, 0.1);


    // diagram.elements.animatePlan([phase1, phase2]);
    // or
    // diagram.elements.pulseNow();
    // or
    // diagram.elements._square.pulseThickNow(5, 1.2, 7);
    // or
    // diagram.elements.startMovingFreely();
    // diagram.elements.animateRotationTo(1, -1, 10);

    // $FlowFixMe
    // diagram.elements._square.animateTranslationTo(new Point(1.5, 0.5), 1);

    if (diagram) {
      diagram.animateNextFrame();

      /* eslint-disable */
      // canvas.onclick = function click(event) {
      //   const box = canvas;
      //   const clip = diagram.pageToClip(new Point(event.pageX, event.pageY));
      //   const str = `Screen ${event.screenX}, ${event.screenY}\n` +
      //   'Offset ' + event.offsetX + ', ' + event.offsetY + '\n' +
      //   'Client ' + event.clientX + ', ' + event.clientY + '\n' +
      //   'Page ' + event.pageX + ', ' + event.pageY + '\n\n' +
      //   'Box:\n' +
      //   'Scroll L/T/W/H ' + box.scrollLeft + ', ' + box.scrollTop + ', ' + box.scrollWidth + ', ' + box.scrollHeight + '\n' +
      //   'Client L/T/W/H ' + box.clientLeft + ', ' + box.clientTop + ', ' + box.clientWidth + ', ' + box.clientHeight + '\n' +
      //   'Offset L/T/W/H ' + box.offsetLeft + ', ' + box.offsetTop + ', ' + box.offsetWidth + ', ' + box.offsetHeight + '\n\n' +
      //   'Clip x/y ' + clip.x + ', ' + clip.y + '\n\n' +
      //   // $FlowFixMe
      //   'square touch: ' + diagram.elements._square.isBeingTouched(clip) + '\n' +
      //   // $FlowFixMe
      //   'tri touch: ' + diagram.elements._triangle.isBeingTouched(clip) + '\n' +
      //   'collection touch: ' + diagram.elements.isBeingTouched(clip);
      //   Console(str);
      //   // Console(event);
      // };
      /* eslint-enable */

      // const globals = new GlobalVariables();
      // shapes.animateRotationTo(1, -1, 10);
      // shapes._square.animateTranslationTo(new Point(0.2, 0.2), 2);
      // // console.log(shapes.transform.scale)
      // const draw = (now: number) => {
      //   const nowSeconds = now * 0.001;

      //   shapes._square.vertices.gl.clearColor(0.5, 0, 0, 0.5);
      //   shapes._square.vertices.gl.clear(shapes._square.vertices.gl.COLOR_BUFFER_BIT);

      //   shapes.draw(m2.identity(), nowSeconds);

      //   if (shapes.isAnimating) {
      //     globals.animateNextFrame();
      //   }
      // };

      // globals.setDrawMethod(diagram.draw.bind(diagram));
      // globals.animateNextFrame();

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
      // polygon.drawWithTransformMatrix(m2.identity(), polygon.numPoints, [1, 0, 0, 1]);
      // polygon2.drawWithTransformMatrix(m2.identity(), polygon2.numPoints, [1, 0, 0, 1]);
      // shapes.draw(m2.identity(), 0);
    }
  }
}
export default testgl;
