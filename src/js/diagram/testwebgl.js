// @flow
import Polygon from './vertexObjects/Polygon';
import PolygonFilled from './vertexObjects/PolygonFilled';
import PolyLineCorners from './vertexObjects/PolyLineCorners';
import PolyLine from './vertexObjects/PolyLine';
import Arrow from './vertexObjects/Arrow';
import RadialLines from './vertexObjects/RadialLines';
// import HorizontalLine from './vertexObjects/HorizontalLine';
import { Transform, Point, TransformLimit } from './g2';
import GLParallelLines from './vertexObjects/glParallelLines';
// import * as m2 from './m2';
// import { Console } from '../tools/tools';
import { DiagramElementCollection, DiagramElementPrimative, AnimationPhase } from './Element';
// import GlobalVariables from './globals';
import Diagram from './Diagram';
import * as tools from './mathtools';
import TickMarks from './DiagramElements/TickMarks';
import Axis from './DiagramElements/Plot/Axis';
import AxisProperties from './DiagramElements/Plot/AxisProperties';

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

    const corners = new PolyLineCorners(
      webgl,
      [
        new Point(1, 0),
        new Point(0, 0),
        new Point(0, 1),
        new Point(1, 1),
      ],
      true,
      0.25,
      0.1,
    );

    const polyLine = new PolyLine(
      webgl,
      [
        new Point(0, 0),
        new Point(0.5, 0.5),
        new Point(0.5, 1),
        new Point(0, 0.75),
      ],
      false,
      0.1,
    );

    const radialVertices = new RadialLines(
      webgl,
      0,
      0.5,
      0.01,
      Math.PI / 9,
      Math.PI * 2,
    );

    const xTicks = new GLParallelLines(webgl, 20, 1, new Point(0, 0), 2, 0.004, true, false);

    // const xMinorTicks = new GLParallelLines(webgl, 50,)

    const arrowVertices = new Arrow(webgl);

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

    this.add('corners', new DiagramElementPrimative(
      corners,
      new Transform().scale(1, 1).rotate(0).translate(0.5, 0.5),
      [1, 0, 0, 1], diagramLimits,
    ));
    // $FlowFixMe
    const corn = this._corners;
    corn.isTouchable = true;
    corn.isMovable = true;

    this.add('pline', new DiagramElementPrimative(
      polyLine,
      new Transform().scale(1, 1).rotate(0).translate(1, 2),
      [1, 1, 0, 1], diagramLimits,
    ));
    // $FlowFixMe
    const pline = this._pline;
    pline.isTouchable = true;
    pline.isMovable = true;

    this.add('arrow', new DiagramElementPrimative(
      arrowVertices,
      new Transform().scale(0.7, 0.4).rotate(0).translate(0.5, 1),
      [1, 1, 0, 1], diagramLimits,
    ));
    // $FlowFixMe
    const arrow = this._arrow;
    arrow.isTouchable = true;
    arrow.isMovable = true;

    this.add('radial', new DiagramElementPrimative(
      radialVertices,
      new Transform().scale(1, 1).rotate(0).translate(2, 1),
      [1, 1, 0, 1], diagramLimits,
    ));
    // $FlowFixMe
    const radial = this._radial;
    radial.isTouchable = true;
    radial.isMovable = true;

    this.add('tickMarksY', new TickMarks(webgl, 10, 0.2, new Point(1.0, 0.5), 0.1, 0.01, [0.8, 0.8, 0.8, 1], diagramLimits, Math.PI / 2));
    this.add('minorTickMarksY', new TickMarks(webgl, 50, 0.2 / 5, new Point(1.0, 0.5), 0.04, 0.007, [0.8, 0.8, 0.8, 1], diagramLimits, Math.PI / 2));
    this.add('tickMarksX', new TickMarks(webgl, 10, 0.2, new Point(1, 0.4), 0.1, 0.01, [0.8, 0.8, 0.8, 1], diagramLimits, 0));
    this.add('majorTickMarksY', new TickMarks(webgl, 50, 0.2 / 5, new Point(1.0, 0.46), 0.04, 0.007, [0.8, 0.8, 0.8, 1], diagramLimits, 0));

    this.add('xAxis', new DiagramElementPrimative(
      xTicks,
      new Transform().scale(1, 1).rotate(0).translate(0.2, 0.2),
      [0.5, 0.5, 0.5, 1],
      diagramLimits,
    ));
    this.isTouchable = true;

    const xProps = new AxisProperties();
    xProps.length = 2;
    xProps.rotation = 0;
    xProps.majorTickOffset = -xProps.majorTickLength;
    xProps.majorGridLength = 2;
    xProps.minorGridLength = 2;
    const axis1 = new Axis(
      webgl, xProps,
      new Transform().scale(1, 1).rotate(0).translate(3, 1), diagramLimits,
    );

    this.add('xAxis1', axis1);

    const yProps = new AxisProperties();
    yProps.length = 2;
    yProps.rotation = Math.PI / 2;
    yProps.majorGridLength = -2;
    yProps.minorGridLength = -2;
    const axis2 = new Axis(
      webgl, yProps,
      new Transform().scale(1, 1).rotate(0).translate(3, 1),
      diagramLimits,
    );

    this.add('yAxis1', axis2);
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
    // console.log(diagram.clipPerPixel());
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
    // diagram.elements._xAxis1._majorTicks.pulseScaleNow(2, 1.4)
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
