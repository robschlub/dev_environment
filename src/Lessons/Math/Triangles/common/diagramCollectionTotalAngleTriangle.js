// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';
import {
  removeRandElement, rand,
} from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import makeTriangle from '../../../../LessonsCommon/tools/triangle';
import type { TypeTriangle, TypeTriangleAngle } from '../../../../LessonsCommon/tools/triangle';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

export default class TotalAngleTriangleCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _angleA: TypeAngle;
  _angleB: TypeAngle;
  _angleC: TypeAngle;
  _triangle: {
    _point1: DiagramElementPrimative;
    _point2: DiagramElementPrimative;
    _point3: DiagramElementPrimative;
  } & TypeTriangle & TypeTriangleAngle;

  makeTri() {
    const layout = this.layout.totalAngle;
    const p = layout.pointPositions;
    const triangle = makeTriangle(
      this.diagram,
      p.p1,
      p.p2,
      p.p3,
      layout.lineWidth,
      this.layout.colors.line,
    );

    const a = layout.angle;
    const aColor = this.layout.colors.angleA;
    const bColor = this.layout.colors.angleB;
    // const cColor = this.layout.colors.angleC;
    triangle.addAngle(1, a.radius, a.lineWidth, a.sides, aColor, 'a');
    triangle.addAngle(2, a.radius, a.lineWidth, a.sides, bColor, 'b');
    // triangle.addAngle(3, a.radius, a.lineWidth, a.sides, cColor, 'c');
    return triangle;
  }

  pulseAlternateA() {
    this._angleA.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAlternateB() {
    this._angleB.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAlternateC() {
    this._angleC.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  resetColors() {
    this._angleA.setColor(this.layout.colors.angleA);
    this._angleB.setColor(this.layout.colors.angleB);
    this._angleC.setColor(this.layout.colors.angleC);
    this._triangle._angle1.setColor(this.layout.colors.angleA);
    this._triangle._angle2.setColor(this.layout.colors.angleB);
  }

  addParallelLines() {
    const layout = this.layout.totalAngle.parallelLine;
    const line1 = makeLine(
      this.diagram, 'center', layout.length, layout.width,
      this.layout.colors.parallelLines, true,
    );
    const line2 = makeLine(
      this.diagram, 'center', layout.length, layout.width,
      this.layout.colors.parallelLines, true,
    );
    this.add('line1', line1);
    this.add('line2', line2);
  }

  addAlternateAngles() {
    const layout = this.layout.totalAngle.angle;
    const angleA = makeAngle(
      this.diagram, layout.radius, layout.lineWidth, layout.sides,
      this.layout.colors.angleA,
    );
    angleA.addLabel('a', layout.labelRadius);
    const angleB = makeAngle(
      this.diagram, layout.radius, layout.lineWidth, layout.sides,
      this.layout.colors.angleB,
    );
    angleB.addLabel('b', layout.labelRadius);
    const angleC = makeAngle(
      this.diagram, layout.radius, layout.lineWidth, layout.sides,
      this.layout.colors.angleC,
    );
    angleC.addLabel('c', layout.labelRadius);
    this.add('angleA', angleA);
    this.add('angleB', angleB);
    this.add('angleC', angleC);
  }

  updatePositions() {
    this._line1.setPosition(0, this._triangle.p1.y);
    this._line2.setPosition(0, this._triangle.p3.y);

    const angle13 = this._triangle.p3.sub(this._triangle.p1).toPolar().angle;
    const angle23 = this._triangle.p3.sub(this._triangle.p2).toPolar().angle;
    const angleC = Math.PI - (angle13 + Math.PI - angle23);
    this._angleA.updateAngle(Math.PI, angle13);
    this._angleB.updateAngle(Math.PI + angle13 + angleC, Math.PI - angle23);
    this._angleC.updateAngle(Math.PI + angle13, angleC);
    this._angleA.setPosition(this._triangle.p3);
    this._angleB.setPosition(this._triangle.p3);
    this._angleC.setPosition(this._triangle.p3);
  }

  updatePoints() {
    const p1 = this._triangle._point1.transform.t();
    const p2 = this._triangle._point2.transform.t();
    const p3 = this._triangle._point3.transform.t();
    if (p1 != null && p2 != null && p3 != null) {
      this._triangle.updatePoints(p1, p2, p3);
    }
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('triangle', this.makeTri());
    this.addParallelLines();
    this.addAlternateAngles();
    this.updatePositions();
    this.hasTouchableElements = true;
  }

  calculateFuturePositions() {
    this.futurePositions = [];
    const layout = this.layout.totalAngle;
    const quadrants = [0, 1, 2, 3];
    const points = [this._triangle._point1, this._triangle._point2, this._triangle._point3];
    points.forEach((p) => {
      const quadrant = removeRandElement(quadrants);
      let x = rand(layout.randomBoundary.left, layout.randomBoundary.right);
      let y = rand(layout.randomBoundary.bottom, layout.randomBoundary.top);
      if (quadrant === 1 || quadrant === 2) {
        x *= -1;
      }
      if (quadrant === 2 || quadrant === 3) {
        y *= -1;
      }
      this.futurePositions.push({
        element: p,
        scenario: {
          position: new Point(x, y),
          rotation: 0,
        },
      });
    });
  }

  newTriangle() {
    this.calculateFuturePositions();
    this.moveToFuturePositions(1.5);
    this.diagram.animateNextFrame();
  }
}
