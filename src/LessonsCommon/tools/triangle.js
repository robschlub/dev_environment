// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Rect, distance, Line, polarToRect, normAngle, minAngleDiff,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeAnnotatedAngle from './angleAnnotation';
import type { TypeAngleAnnotationLayout, TypeAngleAnnotation } from './angleAnnotation';
import makeEquationLabel from './equationLabel';

export type TypeTriangle = {
  p1: Point;
  p2: Point;
  p3: Point;
  b1: Point;
  b2: Point;
  b3: Point;
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
  addAngles: (TypeAngleAnnotationLayout, ?TypeAngleAnnotationLayout,
              ?TypeAngleAnnotationLayout) => void;
  autoShowAngles: boolean;
} & DiagramElementCollection;

export type TypeTriangleAngle = {
  _angle1: TypeAngleAnnotation;
  _angle2: TypeAngleAnnotation;
  _angle3: TypeAngleAnnotation;
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

  triangle.p1 = p1._dup();
  triangle.p2 = p2._dup();
  triangle.p3 = p3._dup();
  triangle.hasAngles = false;
  triangle.hasDimensions = false;
  triangle.hasLabels = false;
  triangle.labelsAlignedWithLines = true;
  triangle.clockwise = true;
  triangle.labelsAlwaysOutside = true;
  triangle.autoShowAngles = true;

  const line = diagram.shapes.polyLine([p1, p2, p3], true, lineWidth, color);
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
    triangle.updateLabels();
  };

  triangle.addLabels = (label12: string = '', label23: string = '', label31: string = '', offset: number) => {
    const addEqn = (index1: number, index2: number, labelText: string) => {
      const eqn = makeEquationLabel(diagram, labelText, color);
      triangle.add(`label${index1}${index2}`, eqn.collection);
      triangle[`labelEqn${index1}${index2}`] = eqn;
    };
    addEqn(1, 2, label12);
    addEqn(2, 3, label23);
    addEqn(3, 1, label31);
    triangle.hasLabels = true;
    triangle.labelOffset = offset;
  };

  triangle.updateLabels = () => {
    if (triangle.hasLabels) {
      const updateLabel = (index1: number, index2: number) => {
        const borderLine = triangle[`b${index1}${index2}`];
        let offset = triangle.labelOffset;
        if (triangle.labelsAlwaysOutside) {
          if (triangle.clockwise) {
            offset = Math.abs(offset) * -1;
          } else {
            offset = Math.abs(offset);
          }
        }
        const offsetdelta = polarToRect(offset, borderLine.angle() + Math.PI / 2);
        const labelElement = triangle[`_label${index1}${index2}`];
        labelElement.setPosition(borderLine.midpoint().add(offsetdelta));
        if (triangle.labelsAlignedWithLines) {
          let rotAngle = borderLine.angle();
          if (rotAngle < -Math.PI / 2) {
            rotAngle += Math.PI;
          }
          if (rotAngle > Math.PI / 2 && rotAngle < Math.PI * 3 / 2) {
            rotAngle -= Math.PI;
          }
          labelElement.transform.updateRotation(rotAngle);
        }
      };
      updateLabel(1, 2);
      updateLabel(2, 3);
      updateLabel(3, 1);
    }
  };

  triangle.addAngles = function addAngles(
    angleColor: Array<number>,
    angleLayout: TypeAngleAnnotationLayout,
    angle1Label: string = '',
    angle2Label: string = '',
    angle3Label: string = '',
  ) {
    const makeAng = (layout: TypeAngleAnnotationLayout, label: string) => makeAnnotatedAngle(diagram, layout, angleColor, label);
    triangle.add('angle1', makeAng(angleLayout, angle1Label));
    triangle.add('angle2', makeAng(angleLayout, angle2Label));
    triangle.add('angle3', makeAng(angleLayout, angle3Label));
    triangle.order = [
      ...triangle.order.slice(-3),
      ...triangle.order.slice(0, -3),
    ];
    triangle.hasAngles = true;
    // triangle.angleArcRadius = angleLayout.arc.radius;
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
        const angleElement = triangle[`_angle${ind}`];
        angleElement.setPosition(q);
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
      };
      updateAngle(1);
      updateAngle(2);
      updateAngle(3);
    }
  };

  return triangle;
}
