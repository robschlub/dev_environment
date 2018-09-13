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

export default class CustomTriangleCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  // _line: DiagramElementPrimative;
  _p1: DiagramElementPrimative;
  _p2: DiagramElementPrimative;
  _p3: DiagramElementPrimative;
  _triangle: TypeTriangle & TypeTriangleAngle;

  makePoint(name: string) {
    const layout = this.layout.custom;
    const point = this.diagram.shapes.polygonFilled(
      layout.pointSides, layout.pointRadius, 0,
      layout.pointSides, this.colors.point, layout.pointPositions[name],
    );
    point.isTouchable = true;
    point.isMovable = true;
    point.setTransformCallback = this.updatePoints.bind(this);
    point.move.canBeMovedAfterLoosingTouch = true;
    point.move.maxTransform = point.transform._dup();
    point.move.maxTransform.updateTranslation(
      layout.boundary.right,
      layout.boundary.top,
    );
    point.move.minTransform = point.transform._dup();
    point.move.minTransform.updateTranslation(
      layout.boundary.left,
      layout.boundary.bottom,
    );
    return point;
  }

  makeTri() {
    const layout = this.layout.custom;
    const p = layout.pointPositions;
    // const line = this.diagram.shapes.polyLine(
    //   [p.p1, p.p2, p.p3], true,
    //   layout.lineWidth, this.layout.colors.line,
    // );
    const triangle = makeTriangle(
      this.diagram,
      p.p1,
      p.p2,
      p.p3,
      layout.lineWidth,
      this.layout.colors.line,
    );
    triangle.addAngles(
      this.layout.colors.angle,
      {
        arc: {
          radius: 0.3,
          width: 0.03,
          sides: 100,
        },
        label: {
          radius: 0.35,
        },
      },
      'A', 'B', 'C',
    );
    triangle.addLabels(
      'AB',
      'BC',
      'CA this is a really long test',
      0.15,
    );
    triangle._angle1.autoRightAngle = true;
    return triangle;
  }

  updatePoints() {
    const p1 = this._p1.transform.t();
    const p2 = this._p2.transform.t();
    const p3 = this._p3.transform.t();
    if (p1 != null && p2 != null && p3 != null) {
      // this._line.vertices.change([p1, p2, p3]);
      this._triangle.updatePoints(p1, p2, p3);
    }
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.position);
    this.add('p1', this.makePoint('p1'));
    this.add('p2', this.makePoint('p2'));
    this.add('p3', this.makePoint('p3'));
    this.add('triangle', this.makeTri());

    this.hasTouchableElements = true;
  }

  calculateFuturePositions() {
    this.futurePositions = [];
    const layout = this.layout.custom;
    const quadrants = [0, 1, 2, 3];
    const points = [this._p1, this._p2, this._p3];
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
