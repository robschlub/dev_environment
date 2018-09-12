// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Rect, distance, Line, polarToRect,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeAnnotatedAngle from './angleAnnotation';
import type { TypeAngleAnnotationLayout, TypeAngleAnnotation } from './angleAnnotation';

export type TypeTriangle = {
  p1: Point;
  p2: Point;
  p3: Point;
  hasAngles: boolean;
  updatePoints: (Point, Point, Point) => void;
  updateAngles: () => void;
  addAngles: (TypeAngleAnnotationLayout, ?TypeAngleAnnotationLayout, ?TypeAngleAnnotationLayout) => void;
} & DiagramElementCollection;

export type TypeTriangleAngle = {
  _angle1: TypeAngleAnnotation;
  _angle2: TypeAngleAnnotation;
  _angle3: TypeAngleAnnotation;
};

export default function makeTriangle(
  diagram: Diagram,
  p1: Point,
  p2: Point,
  p3: Point,
  lineWidth: number,
  color: Array<number>,
) {
  const triangle = diagram.shapes.collection(new Transform()
    .scale(1, 1)
    .rotate(0)
    .translate(0, 0));

  triangle.p1 = p1._dup();
  triangle.p2 = p2._dup();
  triangle.p3 = p3._dup();
  triangle.hasAngles = false;

  const line = diagram.shapes.polyLine([p1, p2, p3], true, lineWidth, color);
  triangle.add('line', line);

  triangle.updatePoints = (newP1: Point, newP2: Point, newP3: Point) => {
    triangle.p1 = newP1._dup();
    triangle.p2 = newP2._dup();
    triangle.p3 = newP3._dup();
    line.vertices.change([newP1, newP2, newP3]);
    triangle.updateAngles();
  };

  triangle.addAngles = function addAngles(
    angle1Layout: TypeAngleAnnotationLayout,
    angle2Layout: ?TypeAngleAnnotationLayout,
    angle3Layout: ?TypeAngleAnnotationLayout,
  ) {
    const makeAng = (angleLayout: TypeAngleAnnotationLayout) => makeAnnotatedAngle(diagram, angleLayout, color, '');
    triangle.add('angle1', makeAng(angle1Layout))
    triangle.add('angle2', makeAng(angle2Layout || angle1Layout));
    triangle.add('angle3', makeAng(angle3Layout || angle1Layout));
    triangle.hasAngles = true;
  };

  triangle.updateAngles = () => {
    if (triangle.hasAngles) {
      const updateAngle = (ind: number) => {
        const index = ind - 1;
        const q = triangle[`p${index + 1}`];
        const r = triangle[`p${(index + 1) % 3 + 1}`];
        const p = triangle[`p${(index + 2) % 3 + 1}`];
        const qp = p.sub(q).toPolar().angle;
        const qr = r.sub(q).toPolar().angle;
        let start = qp;
        let delta = qr - qp;
        if (delta < 0) {
          start = qr;
          delta *= -1;
        }
        if (delta > Math.PI) {
          start = qp;
          delta = Math.PI * 2 - delta;
        }
        const angleElement = triangle[`_angle${ind}`];
        angleElement.setPosition(q);
        angleElement.updateAngle(start, delta);
      };
      updateAngle(1);
      updateAngle(2);
      updateAngle(3);
    }
  };

  return triangle;
}


// import LessonDiagram from './diagram';
// import {
//   Transform, Point,
// } from '../../../../js/diagram/tools/g2';
// import {
//   DiagramElementPrimative,
// } from '../../../../js/diagram/Element';
// import {
//   removeRandElement, rand,
// } from '../../../../js/diagram/tools/mathtools';
// import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

// export default class CustomTriangleCollection extends CommonDiagramCollection {
//   diagram: LessonDiagram;
//   _line: DiagramElementPrimative;
//   _p1: DiagramElementPrimative;
//   _p2: DiagramElementPrimative;
//   _p3: DiagramElementPrimative;

//   makePoint(name: string) {
//     const layout = this.layout.custom;
//     const point = this.diagram.shapes.polygonFilled(
//       layout.pointSides, layout.pointRadius, 0,
//       layout.pointSides, this.colors.point, layout.pointPositions[name],
//     );
//     point.isTouchable = true;
//     point.isMovable = true;
//     point.setTransformCallback = this.updatePoints.bind(this);
//     point.move.canBeMovedAfterLoosingTouch = true;
//     point.move.maxTransform = point.transform._dup();
//     point.move.maxTransform.updateTranslation(
//       layout.boundary.right,
//       layout.boundary.top,
//     );
//     point.move.minTransform = point.transform._dup();
//     point.move.minTransform.updateTranslation(
//       layout.boundary.left,
//       layout.boundary.bottom,
//     );
//     return point;
//   }

//   makeLine() {
//     const layout = this.layout.custom;
//     const p = layout.pointPositions;
//     const line = this.diagram.shapes.polyLine(
//       [p.p1, p.p2, p.p3], true,
//       layout.lineWidth, this.layout.colors.line,
//     );
//     return line;
//   }

//   updatePoints() {
//     const p1 = this._p1.transform.t();
//     const p2 = this._p2.transform.t();
//     const p3 = this._p3.transform.t();
//     if (p1 != null && p2 != null && p3 != null) {
//       this._line.vertices.change([p1, p2, p3]);
//     }
//   }

//   constructor(
//     diagram: LessonDiagram,
//     layout: Object,
//     transform: Transform = new Transform().translate(0, 0),
//   ) {
//     super(diagram, layout, transform);
//     this.setPosition(this.layout.position);
//     this.add('p1', this.makePoint('p1'));
//     this.add('p2', this.makePoint('p2'));
//     this.add('p3', this.makePoint('p3'));
//     this.add('line', this.makeLine());

//     this.hasTouchableElements = true;
//   }

//   calculateFuturePositions() {
//     this.futurePositions = [];
//     const layout = this.layout.custom;
//     const quadrants = [0, 1, 2, 3];
//     const points = [this._p1, this._p2, this._p3];
//     points.forEach((p) => {
//       const quadrant = removeRandElement(quadrants);
//       let x = rand(layout.randomBoundary.left, layout.randomBoundary.right);
//       let y = rand(layout.randomBoundary.bottom, layout.randomBoundary.top);
//       if (quadrant === 1 || quadrant === 2) {
//         x *= -1;
//       }
//       if (quadrant === 2 || quadrant === 3) {
//         y *= -1;
//       }
//       this.futurePositions.push({
//         element: p,
//         scenario: {
//           position: new Point(x, y),
//           rotation: 0,
//         },
//       });
//     });
//   }

//   newTriangle() {
//     this.calculateFuturePositions();
//     this.moveToFuturePositions(1.5);
//     this.diagram.animateNextFrame();
//   }
// }
