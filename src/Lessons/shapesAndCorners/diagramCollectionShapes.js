// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { TextObject, DiagramText, DiagramFont } from '../../js/diagram/textObjects/TextObjectSimple';
import { Point, Transform, Rect } from '../../js/diagram/tools/g2';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';

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

    const to = new TextObject(this.diagram.draw2D, dText, this.diagram.limits);

    const text = new DiagramElementPrimative(
      to,
      new Transform().rotate(Math.PI / 2 * 0.5)
        .translate(0, 0),
      [1, 0, 0, 1],
      this.diagram.limits,
    );
    text.isMovable = true;
    text.isTouchable = true;
    this.add('text', text);
    this.isTouchable = true;
    this.isMovable = true;
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
