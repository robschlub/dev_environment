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
  hasDimensions: boolean;
  hasLabels: boolean;
  updatePoints: (Point, Point, Point) => void;
  updateAngles: () => void;
  addAngles: (TypeAngleAnnotationLayout, ?TypeAngleAnnotationLayout,
              ?TypeAngleAnnotationLayout) => void;
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
  triangle.hasDimensions = false;

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
    angleColor: Array<number>,
    angle1Layout: TypeAngleAnnotationLayout,
    angle1Label: string = '',
    angle2Label: string = '',
    angle3Label: string = '',
  ) {
    const makeAng = (angleLayout: TypeAngleAnnotationLayout, label: string) => makeAnnotatedAngle(diagram, angleLayout, angleColor, label);
    triangle.add('angle1', makeAng(angle1Layout, angle1Label));
    triangle.add('angle2', makeAng(angle1Layout, angle2Label));
    triangle.add('angle3', makeAng(angle1Layout, angle3Label));
    triangle.order = [
      ...triangle.order.slice(-3),
      ...triangle.order.slice(0, -3),
    ];
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
      };
      updateAngle(1);
      updateAngle(2);
      updateAngle(3);
    }
  };

  return triangle;
}
