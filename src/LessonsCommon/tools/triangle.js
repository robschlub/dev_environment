// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Line, Rect, normAngle, minAngleDiff,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeAngle from './angle';
import type { TypeAngle } from './angle';
// import makeEquationLabel from './equationLabel';
import { makeLine } from './line';
import type {
  TypeLine, TypeLineLabelLocation, TypeLineLabelSubLocation,
  TypeLineLabelOrientation,
} from './line';

export type TypeTriangle = {
  p1: Point;
  p2: Point;
  p3: Point;
  b1: Point;      // outer border at point 1
  b2: Point;      // outer border at point 1
  b3: Point;      // outer border at point 1
  ib1: Point;     // inner border at point 1
  ib2: Point;     // inner border at point 2
  ib3: Point;     // inner border at point 3
  b12: Line;
  b23: Line;
  b31: Line;
  point1: DiagramElementPrimative;
  point2: DiagramElementPrimative;
  point3: DiagramElementPrimative;
  hasAngles: boolean;
  hasDimensions: boolean;
  hasLabels: boolean;
  labelOffset: number;
  labelsAlignedWithLines: boolean;
  labelsAlwaysOutside: boolean;
  clockwise: boolean;
  updatePoints: (Point, Point, Point) => void;
  updateAngles: () => void;
  addAngle: (number, number, number, number, Array<string>, string, number) => void;
  autoShowAngles: boolean;
  _line: DiagramElementPrimative;
  dimensionList: Array<Array<number>>;
} & DiagramElementCollection;

export type TypeTriangleAngle = {
  _angle1: TypeAngle;
  _angle2: TypeAngle;
  _angle3: TypeAngle;
};

export type TypeTriangleLabel = {
  _label12: DiagramElementCollection;
  _label23: DiagramElementCollection;
  _label31: DiagramElementCollection;
  labelEqn12: Equation;
  labelEqn23: Equation;
  labelEqn31: Equation;
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

  // triangle.p1 = p1._dup();
  // triangle.p2 = p2._dup();
  // triangle.p3 = p3._dup();
  triangle.hasAngles = false;
  triangle.hasDimensions = false;
  triangle.hasLabels = false;
  triangle.labelsAlignedWithLines = true;
  triangle.clockwise = true;
  triangle.labelsAlwaysOutside = true;
  triangle.autoShowAngles = false;
  triangle.dimensionList = [];

  triangle.updatePoints = (newP1: Point, newP2: Point, newP3: Point) => {
    triangle.p1 = newP1._dup();
    triangle.p2 = newP2._dup();
    triangle.p3 = newP3._dup();
    triangle.point1.transform.updateTranslation(newP1._dup());
    triangle.point2.transform.updateTranslation(newP2._dup());
    triangle.point3.transform.updateTranslation(newP3._dup());
    triangle._line.vertices.change([newP1, newP2, newP3]);
    const [b1, b2, b3] = triangle._line.vertices.border[0];
    triangle.b1 = b1;
    triangle.b2 = b2;
    triangle.b3 = b3;
    const [ib1, ib2, ib3] = triangle._line.vertices.holeBorder[0];
    triangle.ib1 = ib1;
    triangle.ib2 = ib2;
    triangle.ib3 = ib3;
    triangle.b12 = new Line(triangle.b2, triangle.b1);
    triangle.b23 = new Line(triangle.b3, triangle.b2);
    triangle.b31 = new Line(triangle.b1, triangle.b3);

    const a13 = normAngle(triangle.b31.angle() + Math.PI);
    const a12 = normAngle(triangle.b12.angle());
    if (minAngleDiff(a12, a13) > 0) {
      triangle.clockwise = true;
    } else {
      triangle.clockwise = false;
    }

    triangle.updateAngles();
    triangle.updateDimensions();
  };

  triangle.makePoint = (index: number) => {
    const point = diagram.shapes.polygonFilled(
      100, 1, 0,
      100, [1, 0, 0, 1], new Transform().scale(1, 1).translate(0, 0),
    );
    const update = () => {
      const t1 = triangle.point1.transform.t();
      const t2 = triangle.point2.transform.t();
      const t3 = triangle.point3.transform.t();
      if (t1 != null && t2 != null && t3 != null) {
        triangle.updatePoints(t1, t2, t3);
      }
    };
    point.setTransformCallback = update.bind(triangle);
    triangle[`point${index}`] = point;
  };

  triangle.makePoint(1);
  triangle.makePoint(2);
  triangle.makePoint(3);

  triangle.addPoint = function addPoint(
    index: number,
    radius: number,
    pointColor: Array<number>,
    movable: boolean = false,
    moveBoundary: Rect = diagram.limits,
  ) {
    const point = triangle[`point${index}`];
    point.setColor(pointColor);
    point.transform.updateScale(radius, radius);
    if (movable) {
      point.isTouchable = true;
      point.isMovable = true;
      point.move.canBeMovedAfterLoosingTouch = true;
      point.move.maxTransform = point.transform._dup();
      point.move.maxTransform.updateTranslation(
        moveBoundary.right,
        moveBoundary.top,
      );
      point.move.minTransform = point.transform._dup();
      point.move.minTransform.updateTranslation(
        moveBoundary.left,
        moveBoundary.bottom,
      );
    }
    triangle.add(`point${index}`, point, 0);
  };

  const line = diagram.shapes.polyLine(
    [p1, p2, p3], true, lineWidth,
    color, 'onSharpAnglesOnly',
  );
  triangle.add('line', line);

  triangle.addSideDimension = function addDimension(
    index1: number,
    index2: number,
    // dimensionText: string,
    dimensionColor: Array<number>,
    offset: number = 0,
    showLine: boolean = false,
    dimensionLineWidth: number = 0.01,
  ) {
    const dimension = makeLine(
      diagram, 'center', 1,
      dimensionLineWidth, dimensionColor, showLine,
    );
    const point1 = triangle[`p${index1}`];
    const point2 = triangle[`p${index2}`];
    dimension.setEndPoints(point1, point2, offset);
    dimension.offset = offset;
    triangle.add(`dimension${index1}${index2}`, dimension);
    triangle.dimensionList.push([index1, index2]);
    return dimension;
  };

  triangle.addSideLabel = function addSideLabel(
    index1: number, index2: number,
    labelColor: Array<number>,
    labelText: string,
    offset: number,
    location: TypeLineLabelLocation = 'outside',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'baseUpright',
    linePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    const dimension = triangle.addSideDimension(index1, index2, labelColor, 0, false);
    dimension.addLabel(labelText, offset, location, subLocation, orientation, linePosition);
  };

  triangle.updateDimensions = () => {
    const updateDimension = (index1: number, index2: number) => {
      const dimension = triangle[`_dimension${index1}${index2}`];
      if (dimension) {
        let point1 = triangle[`p${index1}`];
        let point2 = triangle[`p${index2}`];
        if ((!triangle.clockwise)) {
          point2 = triangle[`p${index1}`];
          point1 = triangle[`p${index2}`];
        }
        dimension.setEndPoints(point1, point2, dimension.offset);
      }
    };
    triangle.dimensionList.forEach((dim) => {
      updateDimension(dim[0], dim[1]);
    });
  };

  triangle.addAngle = function addAngle(
    index: number,
    radius: number,
    width: number,
    sides: number,
    angleColor: Array<number>,
    labelText: string | Equation = '',
    labelRadius: number = radius,
  ) {
    const ang = makeAngle(diagram, radius, width, sides, angleColor);

    ang.addLabel(labelText, labelRadius);
    triangle.add(`angle${index}`, ang);
    triangle.order = [
      ...triangle.order.slice(-1),
      ...triangle.order.slice(0, -1),
    ];
    triangle.hasAngles = true;
    triangle.updateAngles();
  };

  triangle.updateAngles = () => {
    if (triangle.hasAngles) {
      const updateAngle = (ind: number) => {
        const angleElement = triangle[`_angle${ind}`];
        if (angleElement) {
          const index = ind - 1;
          const q = triangle[`p${index + 1}`];
          const r = triangle[`p${(index + 1) % 3 + 1}`];
          const p = triangle[`p${(index + 2) % 3 + 1}`];
          const qp = p.sub(q).toPolar().angle;
          const qr = r.sub(q).toPolar().angle;
          let start = qp;
          let delta = qr - qp;
          if (qp > qr) {
            if (delta < 0) {
              start = qr;
              delta *= -1;
            }
            if (delta > Math.PI) {
              start = qp;
              delta = Math.PI * 2 - delta;
            }
          } else {
            if (delta < 0) {
              start = qp;
              delta *= -1;
            }
            if (delta > Math.PI) {
              start = qr;
              delta = Math.PI * 2 - delta;
            }
          }
          const lineWidthAngle = lineWidth / angleElement.radius * 0.9;
          // delta += lineWidthAngle;
          const innerBorderQ = triangle[`ib${index + 1}`];
          angleElement.setPosition(innerBorderQ);
          angleElement.updateAngle(start, delta + lineWidthAngle, 0, delta);
          if (triangle.autoShowAngles) {
            const rp = q.sub(p).toPolar();
            const rq = r.sub(p).toPolar();
            const angle = minAngleDiff(rp.angle, rq.angle);
            const height = rp.mag * Math.sin(angle);
            if (Math.abs(height) < angleElement.radius) {
              angleElement.hide();
            } else {
              angleElement.show();
            }
          }
        }
      };
      updateAngle(1);
      updateAngle(2);
      updateAngle(3);
    }
  };

  triangle.updatePoints(p1, p2, p3);
  return triangle;
}
