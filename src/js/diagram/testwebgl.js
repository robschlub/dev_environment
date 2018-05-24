// @flow
import VertexPolygon from './vertexObjects/VertexPolygon';
import VertexPolygonFilled from './vertexObjects/VertexPolygonFilled';
import VertexPolyLineCorners from './vertexObjects/VertexPolyLineCorners';
import VertexPolyLine from './vertexObjects/VertexPolyLine';
import VertexArrow from './vertexObjects/VertexArrow';
import VertexRadialLines from './vertexObjects/VertexRadialLines';
import { Transform, Point, TransformLimit } from './tools/g2';
import { DiagramElementCollection, DiagramElementPrimative, AnimationPhase } from './Element';
import Diagram from './Diagram';
import * as tools from './tools/mathtools';
import { AxisProperties } from './DiagramElements/Plot/AxisProperties';
import { CartesianPlotProperties, TraceProperties } from './DiagramElements/Plot/CartesianPlotProperties';
import CartesianPlot from './DiagramElements/Plot/CartesianPlot';
import getScssColors from '../tools/getScssColors';
import styles from '../../css/style.scss';

const colors = getScssColors(styles);

class ShapesCollection extends DiagramElementCollection {
  _square: DiagramElementPrimative;
  _triangle: DiagramElementPrimative;
  _corners: DiagramElementPrimative;
  _pline: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  _radial: DiagramElementPrimative;
  _helloText: DiagramElementPrimative;

  constructor(webgl, ctx, transform, diagramLimits) {
    super(transform);

    const square = new VertexPolygon(
      webgl,
      4,
      0.475 * Math.sqrt(2), 0.05 * Math.sqrt(2),
      Math.PI / 4, new Point(0, 0),
    );

    const triangle = new VertexPolygonFilled(
      webgl,
      3,
      0.2,
      0, new Point(0, 0),
    );

    const corners = new VertexPolyLineCorners(
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

    const polyLine = new VertexPolyLine(
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

    const radialVertices = new VertexRadialLines(
      webgl,
      0,
      0.5,
      0.01,
      Math.PI / 9,
      Math.PI * 2,
    );

    // const xTicks = new GLParallelLines(webgl, 20, 1, new Point(0, 0), 2, 0.004, true, false);

    // const xMinorTicks = new GLParallelLines(webgl, 50,)

    const arrowVertices = new VertexArrow(webgl);

    // const textObject = new TextObject(ctx,
    //   'Hello World!', new Point(0.5, 1), ['left', 'top'], new Point(0.5, 0.5));

    // this.add('helloText', new DiagramElementPrimative(
    //   textObject,
    //   new Transform().translate(1, 1),
    //   colors.primary, diagramLimits,
    // ));
    // const hw = this._helloText;
    // hw.isTouchable = true;
    // hw.isMovable = true;

    this.add('square', new DiagramElementPrimative(
      square,
      new Transform().scale(0.5, 0.5).rotate(0.1).translate(1, 1),
      colors.primary, diagramLimits,
    ));

    const sq = this._square;
    sq.isTouchable = true;
    sq.isMovable = true;

    this.add('triangle', new DiagramElementPrimative(
      triangle,
      new Transform().scale(1.5, 1.5).translate(2, 1),
      colors.safe, diagramLimits,
    ));

    const tri = this._triangle;
    tri.isTouchable = true;
    tri.isMovable = true;

    this.add('corners', new DiagramElementPrimative(
      corners,
      new Transform().translate(0.5, 0.5),
      colors.passive, diagramLimits,
    ));

    const corn = this._corners;
    corn.isTouchable = true;
    corn.isMovable = true;

    this.add('pline', new DiagramElementPrimative(
      polyLine,
      new Transform().translate(1, 2),
      colors.danger, diagramLimits,
    ));

    const pline = this._pline;
    pline.isTouchable = true;
    pline.isMovable = true;

    this.add('arrow', new DiagramElementPrimative(
      arrowVertices,
      new Transform().scale(0.7, 0.4).translate(0.5, 1),
      colors.danger, diagramLimits,
    ));

    const arrow = this._arrow;
    arrow.isTouchable = true;
    arrow.isMovable = true;

    this.add('radial', new DiagramElementPrimative(
      radialVertices,
      new Transform().translate(2, 1),
      colors.primary, diagramLimits,
    ));

    const radial = this._radial;
    radial.isTouchable = true;
    radial.isMovable = true;

    /* eslint-disable */
    // this.add('tickMarksY', new TickMarks(webgl, 10, 0.2, new Point(1.0, 0.5), 0.1, 0.01, [0.8, 0.8, 0.8, 1], diagramLimits, Math.PI / 2));
    // this.add('minorTickMarksY', new TickMarks(webgl, 50, 0.2 / 5, new Point(1.0, 0.5), 0.04, 0.007, [0.8, 0.8, 0.8, 1], diagramLimits, Math.PI / 2));
    // this.add('tickMarksX', new TickMarks(webgl, 10, 0.2, new Point(1, 0.4), 0.1, 0.01, [0.8, 0.8, 0.8, 1], diagramLimits, 0));
    // this.add('majorTickMarksY', new TickMarks(webgl, 50, 0.2 / 5, new Point(1.0, 0.46), 0.04, 0.007, [0.8, 0.8, 0.8, 1], diagramLimits, 0));
    /* eslint-enable */
    // this.add('xAxis', new DiagramElementPrimative(
    //   xTicks,
    //   new Transform().translate(0.2, 0.2),
    //   [0.5, 0.5, 0.5, 1],
    //   diagramLimits,
    // ));
    this.isTouchable = true;

    const xProps = new AxisProperties('x', 0);
    xProps.length = 4;
    xProps.limits = { min: 0, max: 100 };
    xProps.majorTicks.start = 0;
    xProps.minorTicks.start = 0;
    xProps.minorTicks.step = 2;
    xProps.majorTicks.step = 10;
    xProps.minorTicks.length = 0.02;
    xProps.majorTicks.length = 0.05;
    xProps.majorTicks.offset = -xProps.majorTicks.length;
    xProps.minorTicks.offset = -xProps.minorTicks.length;
    xProps.majorGrid.length = 2;
    xProps.minorGrid.length = 2;
    xProps.majorTicks.width = 0.01;
    xProps.majorTicks.labelMode = 'auto';
    xProps.majorTicks.labels = ['0', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    xProps.majorTicks.labelOffset = new Point(0, -0.05);
    xProps.majorTicks.labelsHAlign = 'center';
    xProps.majorTicks.labelsVAlign = 'top';
    xProps.minorTicks.labelOffset = new Point(0, -0.1);
    xProps.minorTicks.labelsHAlign = 'center';
    xProps.minorTicks.labelsVAlign = 'top';
    xProps.minorTicks.fontSize = '10px';
    xProps.majorGrid.width = 0.008;
    xProps.minorGrid.width = 0.004;
    xProps.title = 'This is a title that is really long';
    xProps.titleOffset = new Point(0.5, -0.2);
    // const axis1 = new Axis(
    //   webgl, ctx, xProps,
    //   new Transform().scale(1, 1).rotate(0).translate(3, 1), diagramLimits,
    // );

    // this.add('xAxis1', axis1);

    const yProps = new AxisProperties('y', Math.PI / 2);
    yProps.length = 2;
    yProps.limits = { min: 0, max: 25 };
    yProps.majorTicks.start = 0;
    yProps.minorTicks.start = 0;
    yProps.majorTicks.step = 5;
    yProps.minorTicks.step = 1;
    yProps.majorGrid.length = -xProps.length;
    yProps.minorGrid.length = -xProps.length;
    yProps.majorTicks.length = xProps.majorTicks.length;
    yProps.minorTicks.length = xProps.minorTicks.length;
    yProps.majorTicks.width = 0.01;
    yProps.majorTicks.labels = ['0', 'A', '10', '15', '20', '25'];
    yProps.majorTicks.labelOffset = new Point(-0.025, 0);
    yProps.majorTicks.labelsHAlign = 'right';
    yProps.majorTicks.labelsVAlign = 'middle';
    yProps.majorGrid.width = xProps.majorGrid.width;
    yProps.minorGrid.width = xProps.minorGrid.width;
    yProps.title = 'This is a title\nThat is two lines';
    yProps.titleRotation = 3 * Math.PI / 2;
    yProps.titleOffset = new Point(0.25, 0.2);
    // const axis2 = new Axis(
    //   webgl, ctx, yProps,
    //   new Transform().scale(1, 1).rotate(0).translate(3, 1),
    //   diagramLimits,
    // );

    // this.add('yAxis1', axis2);
    const trace = new TraceProperties(
      'trace1',
      colors.colorBlue,
      [new Point(0, 0), new Point(10, 5), new Point(50, 10), new Point(80, 20)],
    );
    const plotProps = new CartesianPlotProperties();
    plotProps.axes = [xProps, yProps];
    plotProps.traces = [trace];
    const plot = new CartesianPlot(
      webgl, ctx, plotProps,
      new Transform().translate(3, 1),
      diagramLimits,
    );
    // plot._trace1.isTouchable = true;
    // plot._trace1.isMovable = true;

    plot.isTouchable = true;
    plot.isMovable = true;
    this.add('plot', plot);
  }
}

class Diagram1 extends Diagram {
  elements: ShapesCollection | DiagramElementCollection;

  createDiagramElements() {
    this.elements = new ShapesCollection(
      this.webgl,
      this.draw2D,
      new Transform().rotate(0).translate(0, 0),
      this.limits,
    );
  }
}


function testgl(id: string) {
  /* Step1: Prepare the canvas and get WebGL context */
  // const canvas = document.getElementById(id);

  // if (canvas instanceof HTMLCanvasElement) {

  // if (canvas instanceof HTMLCanvasElement) {

  const diagram = new Diagram1(`${id}_container`, 0, 0, 8, 4);
  // console.log(diagram.clipPerPixel());
  // eslint-disable-next-line
  const phase1 = new AnimationPhase(
    new Transform().rotate(1),
    5, -1, tools.easeinout,
  );
  // eslint-disable-next-line
  const phase2 = new AnimationPhase(
    new Transform().rotate(0),
    5, 1, tools.easeinout,
  );

  diagram.elements.pulse.frequency = 0.25;
  diagram.elements.pulse.A = 1;
  diagram.elements.pulse.B = 0.5;
  diagram.elements.pulse.C = 0;
  diagram.elements.pulse.time = 4;

  diagram.elements.state.movement.velocity = new Transform()
    .rotate(0).translate(1, 0);
  // diagram.elements.moveState.previous = diagram.elements.transform;
  diagram.elements.move.freely.deceleration = new TransformLimit(0.1, 0.1, 0.1);

  // const overlay = document.getElementById(`${id}_overlay`);
  // if (overlay instanceof HTMLElement) {
  //   overlay.innerHTML = `<span id=${id}_text>qwerty</span>`;
  //   const text = document.getElementById(`${id}_text`);
  //   if (text instanceof HTMLElement) {
  //     text.style.position = 'absolute';
  //     let p = new Point(3, 1);
  //     p = diagram.clipToPage(p);
  //     const x = p.x - text.offsetWidth;
  //     text.style.left = `${x}px`;
  //     text.style.top = `${p.y}px`;
  //     console.log(text.offsetWidth, text.offsetHeight)
  //   }
  // }
  // const text2D = document.getElementById(`${id}_text`);

  // diagram.elements.animatePlan([phase1, phase2]);
  // or
  // diagram.elements.pulseNow();
  // diagram.elements._xAxis1.pulseNow(2, 1.5);
  // diagram.elements._xAxis1._majorTicks.pulseScaleNow(2, 1.4)
  // or
  // diagram.elements._plot._trace1.pulseThickNow(5, 1.05, 7);
  // diagram.elements._plot._trace1.pulseNow(2, 1.5);
  // or
  // diagram.elements.startMovingFreely();
  // diagram.elements.animateRotationTo(1, -1, 10);

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

    //   'square touch: ' + diagram.elements._square.isBeingTouched(clip) + '\n' +

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
export default testgl;
