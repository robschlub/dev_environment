// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class TriangleCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line: DiagramElementPrimative;
  _p1: DiagramElementPrimative;
  _p2: DiagramElementPrimative;
  _p3: DiagramElementPrimative;

  makePoint(name: string) {
    const point = this.diagram.shapes.polygonFilled(
      this.layout.pointSides, this.layout.pointRadius, 0,
      this.layout.pointSides, this.colors.point, this.layout.pointPositions[name],
    );
    point.isTouchable = true;
    point.isMovable = true;
    point.move.limitToDiagram = true;
    point.setTransformCallback = this.updatePoints.bind(this);
    point.move.canBeMovedAfterLoosingTouch = true;
    return point;
  }

  makeLine() {
    const p = this.layout.pointPositions;
    const line = this.diagram.shapes.polyLine([p.p1, p.p2, p.p3, p.p4, p.p5], true, this.layout.lineWidth, this.layout.colors.line);
    return line;
  }

  updatePoints() {
    const p1 = this._p1.transform.t();
    const p2 = this._p2.transform.t();
    const p3 = this._p3.transform.t();
    const p4 = this._p4.transform.t();
    const p5 = this._p5.transform.t();
    if (p1 != null && p2 != null && p3 != null) {
      this._line.vertices.change([p1, p2, p3, p4, p5]);
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
    this.add('p4', this.makePoint('p4'));
    this.add('p5', this.makePoint('p5'));
    this.add('line', this.makeLine());
    // this.add('l23', this.makeLine());
    // this.add('l13', this.makeLine());

    this.hasTouchableElements = true;
  }
}
