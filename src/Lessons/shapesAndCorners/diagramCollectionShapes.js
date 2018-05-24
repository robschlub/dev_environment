// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { TextObject, DiagramText, DiagramFont } from '../../js/diagram/DrawingObjects/TextObject/TextObject';
import HTMLObject from '../../js/diagram/DrawingObjects/HTMLObject/HTMLObject';
import { AxisProperties } from '../../js/diagram/DiagramElements/Plot/AxisProperties';
import { CartesianPlotProperties, TraceProperties } from '../../js/diagram/DiagramElements/Plot/CartesianPlotProperties';
import CartesianPlot from '../../js/diagram/DiagramElements/Plot/CartesianPlot';
import { Point, Transform, Rect } from '../../js/diagram/tools/g2';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import { Equation, EquationText, EquationElement, EquationFraction } from '../../js/diagram/Equation';

const colors = getScssColors(styles);
const lineColor = colors.lines;
const cornerColor = colors.corners;
const moreSharpColor = colors.moreSharp;
const lessSharpColor = colors.lessSharp;
const lineWidth = 0.02;
const cornerWidth = 0.06;
const cornerLength = 0.15;

type typeShape = {
  _lines: DiagramElementPrimative;
  _corners: DiagramElementPrimative;
  _lessSharpCorners: DiagramElementPrimative;
  _moreSharpCorners: DiagramElementPrimative;
} & DiagramElementCollection ;

function makePlot(diagram: Diagram) {
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
  xProps.titleOffset = new Point(2, -0.3);
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
  yProps.majorTicks.labelOffset = new Point(-0.07, 0);
  yProps.majorTicks.labelsHAlign = 'right';
  yProps.majorTicks.labelsVAlign = 'middle';
  yProps.majorGrid.width = xProps.majorGrid.width;
  yProps.minorGrid.width = xProps.minorGrid.width;
  yProps.title = 'This is a title\nThat is two lines';
  yProps.titleRotation = 3 * Math.PI / 2;
  yProps.titleOffset = new Point(-0.3, 1);
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
    diagram.webgl, diagram.draw2D, plotProps,
    new Transform().translate(-1.5, -1),
    diagram.limits,
  );
  // plot._trace1.isTouchable = true;
  // plot._trace1.isMovable = true;

  plot.isTouchable = true;
  plot.isMovable = true;
  return plot;
}
function makeSquare(shapes: Object, location: Point) {
  const vertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.5),
    new Point(0.5, 0.5),
    new Point(-0.5, 0.5),
  ];

  const lines = shapes.polyLine(vertices, true, lineWidth, lineColor);
  const corners = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, cornerColor,
  );
  const lessSharp = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, lessSharpColor,
  );

  const square: typeShape = shapes.collection(location);
  square.add('lines', lines);
  square.add('corners', corners);
  square.add('lessSharpCorners', lessSharp);
  return square;
}

function makeTriangle(shapes: Object, location: Point) {
  const vertices = [
    new Point(0, 0.65),
    new Point(0, 0.65).rotate(2 * Math.PI / 3),
    new Point(0, 0.65).rotate(4 * Math.PI / 3),
  ];
  const lines = shapes.polyLine(vertices, true, lineWidth, lineColor);
  const corners = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, cornerColor,
  );

  const moreSharp = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, moreSharpColor,
  );

  const triangle: typeShape = shapes.collection(location);
  triangle.add('lines', lines);
  triangle.add('corners', corners);
  triangle.add('moreSharpCorners', moreSharp);
  return triangle;
}

function makePent(shapes: Object, location: Point) {
  function makeCorner(v, color) {
    return shapes.polyLineCorners(v, false, cornerLength, cornerWidth, color);
  }
  const vertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.2),
    new Point(0.3, 0.1),
    new Point(0.5, 0.5),
    new Point(-0.2, 0.4),
  ];

  const lines = shapes.polyLine(vertices, true, lineWidth, lineColor);
  const corners = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, cornerColor,
  );

  const v = vertices;
  const moreSharpCorners = shapes.collection();
  const sharpCorner1 = makeCorner([v[4], v[0], v[1]], moreSharpColor);
  const sharpCorner2 = makeCorner([v[0], v[1], v[2]], moreSharpColor);
  const sharpCorner3 = makeCorner([v[2], v[3], v[4]], moreSharpColor);
  moreSharpCorners.add('sharpCorner1', sharpCorner1);
  moreSharpCorners.add('sharpCorner2', sharpCorner2);
  moreSharpCorners.add('sharpCorner3', sharpCorner3);

  const lessSharpCorners = shapes.collection();
  const lessCorner1 = makeCorner([v[1], v[2], v[3]], lessSharpColor);
  const lessCorner2 = makeCorner([v[3], v[4], v[0]], lessSharpColor);
  lessSharpCorners.add('lessCorner1', lessCorner1);
  lessSharpCorners.add('lessCorner2', lessCorner2);

  const pent: typeShape = shapes.collection(location);
  pent.add('lines', lines);
  pent.add('corners', corners);
  pent.add('moreSharpCorners', moreSharpCorners);
  pent.add('lessSharpCorners', lessSharpCorners);
  return pent;
}

function makeGrid(shapes: Object) {
  return shapes.grid(new Rect(-10, -10, 20, 20), 0.2, 0.2, colors.grid, new Transform().rotate(0));
}

// type typeShapesDiagramCollection = {
//   _square: typeShape,
//   _triangle: typeShape,
//   _pent: typeShape,
// } & DiagramElementCollection;

class ShapesCollection extends DiagramElementCollection {
  _square: typeShape;
  _triangle: typeShape;
  _pent: typeShape;
  diagram: Diagram;

  constructor(diagram: Diagram, locations: Object, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    const { shapes } = diagram;

    const grid = makeGrid(shapes);
    this.add('grid', grid);
    // grid.pulseScaleNow(0, 1.05, 0.4);

    const square = makeSquare(shapes, locations.square.center);
    this.add('square', square);

    const triangle = makeTriangle(shapes, locations.tri.center);
    this.add('triangle', triangle);

    const pent = makePent(shapes, locations.pent.center);
    this.add('pent', pent);

    const anchor = shapes.polygonFilled(
      12, 0.5, 0,
      12, cornerColor, new Point(0, 0),
    );
    anchor.isTouchable = true;
    anchor.isMovable = true;
    this.add('anchor', anchor);

    const s1 = shapes.polygonFilled(8, 0.3, 0, 8, lineColor, new Point(0, 0));
    const s2 = shapes.polygonFilled(8, 0.2, 0, 8, lineColor, new Point(0.4, 0.4));
    s1.isTouchable = true;
    s2.isTouchable = true;
    const c = shapes.collection(new Point(-1, -1));
    c.add('s1', s1);
    c.add('s2', s2);
    c.isTouchable = true;
    c.isMovable = true;
    this.add('c', c);

    const font = new DiagramFont(
      'Helvetica',
      'italic',
      0.2,
      '200',
      'center',
      'middle',
      [0, 1, 0, 1],
    );
    const dText = [
      new DiagramText(new Point(-1, 0), '-1', font),
      new DiagramText(new Point(0, 0), '0 this is a test', font),
      new DiagramText(new Point(1, 0), '1', font),
      new DiagramText(new Point(0, 1), 'i', font),
      new DiagramText(new Point(0, -1), '-i', font),
    ];

    const to = new TextObject(this.diagram.draw2D, dText);

    const text = new DiagramElementPrimative(
      to,
      new Transform().scale(0.5, 0.5).rotate(1).translate(1, 0),
      [1, 0, 0, 1],
      this.diagram.limits,
    );
    text.isMovable = true;
    text.isTouchable = true;
    this.add('text', text);
    this.isTouchable = true;
    this.isMovable = true;

    const element = document.createElement('div');
    const inside = document.createTextNode('Hi there');
    element.appendChild(inside);
    element.style.position = 'absolute';
    element.style.left = '200px';
    element.style.top = '200px';
    element.setAttribute('id', 'html_test_element');
    this.diagram.htmlCanvas.appendChild(element);
    const h = new HTMLObject(this.diagram.htmlCanvas, 'html_test_element', new Point(0, 0), 'middle', 'center');
    const hp = new DiagramElementPrimative(
      h,
      new Transform().rotate(Math.PI / 2 * 0).translate(0, 0),
      [1, 0, 0, 1],
      this.diagram.limits,
    );
    hp.isTouchable = true;
    hp.isMovable = true;
    this.add('html', hp);

    const plot = makePlot(this.diagram);
    this.add('plot', plot);

    const n = new EquationText('a + b');
    const d = new EquationText('c');
    const f = new EquationFraction(n, d);
    const ee = new EquationElement([f, new EquationText('='),new EquationText('c') ])
    const e = new Equation('eq1', [ee]);
    this.diagram.htmlCanvas.appendChild(e.htmlElement());
    const eh = new HTMLObject(this.diagram.htmlCanvas, 'eq1', new Point(-0.5, -0.5), 'middle', 'center');
    const ehp = new DiagramElementPrimative(
      eh,
      new Transform().translate(0, 0),
      [1, 0, 0, 1],
      this.diagram.limits,
    );
    ehp.isTouchable = true;
    ehp.isMovable = true;
    this.add('equation', ehp);
  }

  resize(locations: Object) {
    this._square.transform.updateTranslation(
      locations.square.center.x,
      locations.square.center.y,
    );
    this._triangle.transform.updateTranslation(
      locations.tri.center.x,
      locations.tri.center.y,
    );
    this._pent.transform.updateTranslation(
      locations.pent.center.x,
      locations.pent.center.y,
    );
  }

  toggleCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this._square._corners.show =
        !this._square._corners.show;
      this._triangle._corners.show =
        !this._triangle._corners.show;
      this._pent._corners.show =
        !this._pent._corners.show;
    } else {
      this._square._corners.show = show;
      this._triangle._corners.show = show;
      this._pent._corners.show = show;
    }

    if (this._square._corners.show) {
      this._square._corners.pulseScaleNow(1, 1.08);
      this._triangle._corners.pulseScaleNow(1, 1.08);
      this._pent._corners.pulseScaleNow(1, 1.08);
      this.toggleMoreSharpCorners(false, false);
      this.toggleLessSharpCorners(false, false);
    }
    this.diagram.animateNextFrame();
    // this._text.vertices.calcBorder()
  }

  toggleMoreSharpCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this._triangle._moreSharpCorners.show =
        !this._triangle._moreSharpCorners.show;
      this._pent._moreSharpCorners.show =
        !this._pent._moreSharpCorners.show;
    } else {
      this._triangle._moreSharpCorners.show = show;
      this._pent._moreSharpCorners.show = show;
    }

    if (this._triangle._moreSharpCorners.show) {
      this._triangle._moreSharpCorners.pulseScaleNow(1, 1.08);
      this._pent._moreSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleLessSharpCorners(false, false);
    }
    this.diagram.animateNextFrame();
  }

  toggleLessSharpCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this._square._lessSharpCorners.show =
        !this._square._lessSharpCorners.show;
      this._pent._lessSharpCorners.show =
        !this._pent._lessSharpCorners.show;
    } else {
      this._square._lessSharpCorners.show = show;
      this._pent._lessSharpCorners.show = show;
    }

    if (this._square._lessSharpCorners.show) {
      this._square._lessSharpCorners.pulseScaleNow(1, 1.08);
      this._pent._lessSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleMoreSharpCorners(false, false);
    }
    this.diagram.animateNextFrame();
  }

  pulseShapes() {
    const mag = 1.05;
    const lines = 5;
    const time = 1;
    this._square._lines.pulseThickNow(time, mag, lines);
    this._triangle._lines.pulseThickNow(time, mag, lines);
    this._pent._lines.pulseThickNow(time, mag, lines);
    this.diagram.animateNextFrame();
  }
}


// function shapesDiagram(id: string) {
//   // const diagram = new Diagram(`${id}_container`, 0, 0, 4, 2);
//   // const { shapes } = diagram;

//   // const square = makeSquare(shapes, new Point(0.65, 1));
//   // diagram.add('square', square);

//   // const triangle = makeTriangle(shapes, new Point(2, 0.9));
//   // diagram.add('triangle', triangle);

//   // const pent = makePent(shapes, new Point(3.2, 1));
//   // diagram.add('pent', pent);
//   const diagram = new ShapesDiagram(id);
//   return diagram;
// }

export default ShapesCollection;
