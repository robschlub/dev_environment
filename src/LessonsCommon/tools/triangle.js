// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Line, polarToRect, normAngle, minAngleDiff,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeAngle from './angle';
import type { TypeAngle } from './angle';
import makeEquationLabel from './equationLabel';
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

  const line = diagram.shapes.polyLine(
    [p1, p2, p3], true, lineWidth,
    color, 'onSharpAnglesOnly',
  );
  triangle.add('line', line);

  triangle.updatePoints = (newP1: Point, newP2: Point, newP3: Point) => {
    triangle.p1 = newP1._dup();
    triangle.p2 = newP2._dup();
    triangle.p3 = newP3._dup();
    line.vertices.change([newP1, newP2, newP3]);
    const [b1, b2, b3] = line.vertices.border[0];
    triangle.b1 = b1;
    triangle.b2 = b2;
    triangle.b3 = b3;
    const [ib1, ib2, ib3] = line.vertices.holeBorder[0];
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
    // triangle.updateLabels();
  };

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
      // console.log(dimension)
      if (dimension) {
        const point1 = triangle[`p${index1}`];
        const point2 = triangle[`p${index2}`];
        // console.log(triangle)
        dimension.setEndPoints(point1, point2, dimension.offset);
      }
    };
    triangle.dimensionList.forEach((dim) => {
      updateDimension(dim[0], dim[1]);
    });
    // updateDimension(1, 2);
    // updateDimension(2, 3);
    // updateDimension(3, 1);
  };

  // triangle.addSideLabels = (label12: string = '', label23: string = '', label31: string = '', offset: number) => {
  //   const addEqn = (index1: number, index2: number, labelText: string) => {
  //     const { eqn } = makeEquationLabel(diagram, labelText, color);
  //     triangle.add(`label${index1}${index2}`, eqn.collection);
  //     triangle[`labelEqn${index1}${index2}`] = eqn;
  //   };
  //   addEqn(1, 2, label12);
  //   addEqn(2, 3, label23);
  //   addEqn(3, 1, label31);
  //   triangle.hasLabels = true;
  //   triangle.labelOffset = offset;
  // };

  // triangle.updateLabels = () => {
  //   if (triangle.hasLabels) {
  //     const updateLabel = (index1: number, index2: number) => {
  //       const borderLine = triangle[`b${index1}${index2}`];
  //       let offset = triangle.labelOffset;
  //       if (triangle.labelsAlwaysOutside) {
  //         if (triangle.clockwise) {
  //           offset = Math.abs(offset) * -1;
  //         } else {
  //           offset = Math.abs(offset);
  //         }
  //       }
  //       const offsetdelta = polarToRect(offset, borderLine.angle() + Math.PI / 2);
  //       const labelElement = triangle[`_label${index1}${index2}`];
  //       labelElement.setPosition(borderLine.midpoint().add(offsetdelta));
  //       if (triangle.labelsAlignedWithLines) {
  //         let rotAngle = borderLine.angle();
  //         if (rotAngle < -Math.PI / 2) {
  //           rotAngle += Math.PI;
  //         }
  //         if (rotAngle > Math.PI / 2 && rotAngle < Math.PI * 3 / 2) {
  //           rotAngle -= Math.PI;
  //         }
  //         labelElement.transform.updateRotation(rotAngle);
  //       }
  //     };
  //     updateLabel(1, 2);
  //     updateLabel(2, 3);
  //     updateLabel(3, 1);
  //   }
  // };

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
          delta += lineWidthAngle;
          const innerBorderQ = triangle[`ib${index + 1}`];
          angleElement.setPosition(innerBorderQ);
          angleElement.updateAngle(start, delta);
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
