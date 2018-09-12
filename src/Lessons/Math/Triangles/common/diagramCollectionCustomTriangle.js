// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class CustomTriangleCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line: DiagramElementPrimative;
  _p1: DiagramElementPrimative;
  _p2: DiagramElementPrimative;
  _p3: DiagramElementPrimative;

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

  makeLine() {
    const layout = this.layout.custom;
    const p = layout.pointPositions;
    const line = this.diagram.shapes.polyLine(
      [p.p1, p.p2, p.p3], true,
      layout.lineWidth, this.layout.colors.line,
    );
    return line;
  }

  updatePoints() {
    const p1 = this._p1.transform.t();
    const p2 = this._p2.transform.t();
    const p3 = this._p3.transform.t();
    if (p1 != null && p2 != null && p3 != null) {
      this._line.vertices.change([p1, p2, p3]);
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
    this.add('line', this.makeLine());

    this.hasTouchableElements = true;
  }

  calculateFuturePositions() {
    const quadrants = [0, 1, 2, 3];
    

    this.futurePositions = [
    ]
  }
}
