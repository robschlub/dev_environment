// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point } from '../../js/diagram/tools/g2';
import getSCSSColors from '../../js/tools/css';
import styles from './style.scss';

const colors = getSCSSColors(styles);
const lineColor = colors.colorLines;
const cornerColor = colors.colorCorners;
const moreSharpColor = colors.colorMoreSharp;
const lessSharpColor = colors.colorLessSharp;
const lineWidth = 0.02;
const cornerWidth = 0.06;
const cornerLength = 0.15;
const backgroundColor = colors.colorBackground;

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
    new Point(0, 0.5),
    new Point(0, 0.5).rotate(2 * Math.PI / 3),
    new Point(0, 0.5).rotate(4 * Math.PI / 3),
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


type typeDiagramCollection = {
  _square: typeShape,
  _triangle: typeShape,
  _pent: typeShape,
} & DiagramElementCollection;

// $FlowFixMe
class ShapesDiagram extends Diagram {
  elements: typeDiagramCollection;

  constructor(id: string) {
    super(`${id}`, 0, 0.1, 4, 4 * 0.4, backgroundColor);
  }
  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();

    const square = makeSquare(shapes, new Point(0.65, 1));
    this.add('square', square);

    const triangle = makeTriangle(shapes, new Point(2, 0.9));
    this.add('triangle', triangle);

    const pent = makePent(shapes, new Point(3.2, 1));
    this.add('pent', pent);
  }

  toggleCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this.elements._square._corners.show =
        !this.elements._square._corners.show;
      this.elements._triangle._corners.show =
        !this.elements._triangle._corners.show;
      this.elements._pent._corners.show =
        !this.elements._pent._corners.show;
    } else {
      this.elements._square._corners.show = show;
      this.elements._triangle._corners.show = show;
      this.elements._pent._corners.show = show;
    }

    if (this.elements._square._corners.show) {
      this.elements._square._corners.pulseScaleNow(1, 1.08);
      this.elements._triangle._corners.pulseScaleNow(1, 1.08);
      this.elements._pent._corners.pulseScaleNow(1, 1.08);
      this.toggleMoreSharpCorners(false, false);
      this.toggleLessSharpCorners(false, false);
    }
    this.animateNextFrame();
  }

  toggleMoreSharpCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this.elements._triangle._moreSharpCorners.show =
        !this.elements._triangle._moreSharpCorners.show;
      this.elements._pent._moreSharpCorners.show =
        !this.elements._pent._moreSharpCorners.show;
    } else {
      this.elements._triangle._moreSharpCorners.show = show;
      this.elements._pent._moreSharpCorners.show = show;
    }

    if (this.elements._triangle._moreSharpCorners.show) {
      this.elements._triangle._moreSharpCorners.pulseScaleNow(1, 1.08);
      this.elements._pent._moreSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleLessSharpCorners(false, false);
    }
    this.animateNextFrame();
  }

  toggleLessSharpCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this.elements._square._lessSharpCorners.show =
        !this.elements._square._lessSharpCorners.show;
      this.elements._pent._lessSharpCorners.show =
        !this.elements._pent._lessSharpCorners.show;
    } else {
      this.elements._square._lessSharpCorners.show = show;
      this.elements._pent._lessSharpCorners.show = show;
    }

    if (this.elements._square._lessSharpCorners.show) {
      this.elements._square._lessSharpCorners.pulseScaleNow(1, 1.08);
      this.elements._pent._lessSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleMoreSharpCorners(false, false);
    }
    this.animateNextFrame();
  }

  pulseShapes() {
    const mag = 1.05;
    const lines = 5;
    const time = 1;
    this.elements._square._lines.pulseThickNow(time, mag, lines);
    this.elements._triangle._lines.pulseThickNow(time, mag, lines);
    this.elements._pent._lines.pulseThickNow(time, mag, lines);
    this.animateNextFrame();
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

export default ShapesDiagram;
