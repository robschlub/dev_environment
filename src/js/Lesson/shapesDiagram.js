// @flow
import getColors from '../diagram/colors';
import Diagram from '../diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
import { Point } from '../diagram/tools/g2';

const colors = getColors();
const lineColor = colors.colorBlue;
const cornerColor = colors.colorCyanMedium;
const moreSharpColor = colors.colorRed;
const lessSharpColor = colors.colorGreenMedium;
const lineWidth = 0.02;
const cornerWidth = 0.04;
const cornerLength = 0.1;

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
  const vertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.2),
    new Point(0.2, 0.2),
    new Point(0.5, 0.5),
    new Point(-0.2, 0.4),
  ];
  const lines = shapes.polyLine(vertices, true, lineWidth, lineColor);
  const corners = shapes.polyLineCorners(
    vertices, true, cornerLength,
    cornerWidth, cornerColor,
  );

  // const moreSharpCorners = shapes.collection(location);
  // const sharpCorner1 = shapes.polyLineCorners(
  //   [pentVertices[4], pentVertices[0], pentVertices[1]],
  //   false,
  //   0.1,
  //   0.04,
  //   colors.colorRed
  // moreSharpCorners.add()

  const pent: typeShape = shapes.collection(location);
  pent.add('lines', lines);
  pent.add('corners', corners);
  return pent;
}


type typeDiagramCollection = {
  _square: typeShape,
  _triangle: typeShape,
  _pent: typeShape,
} & DiagramElementCollection;

class ShapesDiagram extends Diagram {
  elements: typeDiagramCollection;

  constructor(id: string) {
    super(`${id}_container`, 0, 0, 4, 2);
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
    } else {
      this.elements._triangle._moreSharpCorners.show = show;
    }

    if (this.elements._triangle._moreSharpCorners.show) {
      this.elements._triangle._moreSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleLessSharpCorners(false, false);
    }
    this.animateNextFrame();
  }

  toggleLessSharpCorners(toggle: boolean = true, show: boolean = true) {
    if (toggle) {
      this.elements._square._lessSharpCorners.show =
        !this.elements._square._lessSharpCorners.show;
    } else {
      this.elements._square._lessSharpCorners.show = show;
    }

    if (this.elements._square._lessSharpCorners.show) {
      this.elements._square._lessSharpCorners.pulseScaleNow(1, 1.08);
      this.toggleCorners(false, false);
      this.toggleMoreSharpCorners(false, false);
    }
    this.animateNextFrame();
  }
  // toggleCorners() {
  //   this.elements._square._corners.show = !this.elements._square._corners.show;
  //   this.elements._triangle._corners.show = !this.elements._triangle._corners.show;
  //   this.elements._pent._corners.show = !this.elements._pent._corners.show;
  //   if (this.elements._square._corners.show) {
  //     this.elements._square._corners.pulseScaleNow(1, 1.08);
  //     this.elements._triangle._corners.pulseScaleNow(1, 1.08);
  //     this.elements._pent._corners.pulseScaleNow(1, 1.08);
  //   }
  //   this.animateNextFrame();
  // }

  // toggleMoreSharpCorners() {
  //   if (this.elements._square._corners.show) {
  //     this.toggleCorners();
  //   }
  //   this.elements._triangle._moreSharpCorners.show =
  //     !this.elements._triangle._moreSharpCorners.show;
  //   if (this.elements._triangle._moreSharpCorners.show) {
  //     this.elements._triangle._moreSharpCorners.pulseScaleNow(1, 1.08);
  //   }
  //   this.animateNextFrame();
  // }

  // toggleLessSharpCorners() {
  //   if (this.elements._square._corners.show) {
  //     this.toggleCorners();
  //   }
  //   if (this.elements._triangle._moreSharpCorners.show) {
  //     this.toggleMoreSharpCorners();
  //   }
  //   this.elements._square._lessSharpCorners.show =
  //     !this.elements._square._lessSharpCorners.show;
  //   if (this.elements._square._lessSharpCorners.show) {
  //     this.elements._square._lessSharpCorners.pulseScaleNow(1, 1.08);
  //   }
  //   this.animateNextFrame();
  // }
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
