// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
// import {
//   removeRandElement, rand,
// } from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';

import makeTriangle from '../../../../LessonsCommon/tools/triangle';
import type {
  TypeTriangle, TypeTriangleAngle, TypeTriangleLabel,
} from '../../../../LessonsCommon/tools/triangle';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

type TypeCorner = {
  _angle: TypeAngle;
  _line: DiagramElementPrimative;
  _side1: TypeLine;
  _side2: TypeLine;
} & DiagramElementCollection;

export default class SASCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _corner1: TypeCorner;
  _corner2: TypeCorner;
  _corner3: TypeCorner;
  _tri: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel;

  makeTri() {
    // const layout = this.layout.triangle;
    const triangle = makeTriangle(
      this.diagram,
      new Point(-1, -1),
      new Point(1, -1),
      new Point(0, 1),
      this.layout.corner.sideWidth,
      this.layout.colors.diagram.disabled,
    );
    // const a = layout.angle;
    // const aColor = this.layout.colors.angleLabels;
    // const lColor = this.layout.colors.lineLabels;
    // triangle.addAngle(1, a.radius, a.lineWidth, a.sides, aColor, 'a');
    // triangle.addAngle(2, a.radius, a.lineWidth, a.sides, aColor, 'b');
    // triangle.addAngle(3, a.radius, a.lineWidth, a.sides, aColor, 'c');
    // triangle.addSideLabel(2, 3, lColor, 'A', 0.05, 'outside', '', 'horizontal');
    // triangle.addSideLabel(3, 1, lColor, 'B', 0.05, 'outside', '', 'horizontal');
    // triangle.addSideLabel(1, 2, lColor, 'C', 0.05, 'outside', '', 'horizontal');
    return triangle;
  }

  makeCorner() {
    const corner = this.diagram.shapes.collection(new Transform('Corner')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0));
    const line = this.diagram.shapes.polyLine(
      this.layout.corner.points, false,
      this.layout.corner.width, this.layout.colors.line,
      'onSharpAnglesOnly',
    );
    const angle = makeAngle(
      this.diagram, this.layout.corner.angleRadius,
      this.layout.corner.angleWidth, this.layout.triangle.angle.sides,
      this.layout.colors.angleA,
    );
    const touchPoint = this.diagram.shapes.polygonFilled(
      10, 0.4, 0, 10, [0, 0, 1, 1], new Transform().translate(0, 0),
    );
    touchPoint.isMovable = true;
    touchPoint.isTouchable = true;
    touchPoint.move.element = corner;
    touchPoint.move.canBeMovedAfterLoosingTouch = true;
    corner.hasTouchableElements = true;
    angle.updateAngle(0, Math.PI / 2);
    angle.setPosition(this.layout.corner.points[1]);
    corner.add('touchPoint', touchPoint);
    corner.add('angle', angle);
    corner.add('line', line);
    return corner;
  }

  recalculateTriangle(index: number) {
    const indeces = [1, 2, 3];
    const opp = indeces.filter(i => i !== index);
    const c = [this._corner1, this._corner2, this._corner3];
    const l = this.layout.corner.AAA;
    const layout = [l.c1, l.c2, l.c3];
    const t1 = c[0].transform.t();
    const t2 = c[1].transform.t();
    const t3 = c[2].transform.t();
    const r1 = c[0].transform.r();
    const r2 = c[1].transform.r();
    const r3 = c[2].transform.r();
    if (t1 != null && t2 != null && t3 != null
      && r1 != null && r2 != null && r3 != null) {
      const t = [t1, t2, t3];
      const r = [r1, r2, r3];
      const oppLine = new Line(t[opp[0] - 1], t[opp[1] - 1]);
      const side1 = new Line(t[index - 1], 1, r[index - 1]);
      const intersect1 = side1.intersectsWith(oppLine).intersect;
      c[index % 3].transform.updateTranslation(intersect1);

      const side2 = new Line(t[index - 1], 1, r[index - 1] + layout[index - 1].angle);
      const intersect2 = side2.intersectsWith(oppLine).intersect;
      c[(index + 1) % 3].transform.updateTranslation(intersect2);
    }
  }

  updateCornerAngle(corner: TypeCorner, newAngle: number) {
    const newPoint = polarToRect(this.layout.corner.length, newAngle);
    // const corners = [this._corner1, this._corner2, this._corner3];
    corner._line.vertices.change([
      ...this.layout.corner.points.slice(0, 2),
      newPoint,
    ]);
    const rotation = corner.transform.r();
    if (rotation != null) {
      corner._angle.updateAngle(0, newAngle, rotation);
    }
    // corner._side2.transform.updateRotation(newAngle);
  }

  // showLineLabels(show: boolean | null = true) {
  //   let toShow = true;
  //   if (show === null || typeof show !== 'boolean') {
  //     if (this._tri1._dimension12.isShown) {
  //       toShow = false;
  //     }
  //   }
  //   if (toShow) {
  //     this._tri1.showDimensions(true);
  //   } else {
  //     this._tri1.hideDimensions();
  //   }
  //   this.diagram.animateNextFrame();
  // }

  // showAngleLabels(show: boolean = true) {
  //   let toShow = true;
  //   if (show === null || typeof show !== 'boolean') {
  //     if (this._tri1._angle1.isShown) {
  //       toShow = false;
  //     }
  //   }
  //   if (toShow) {
  //     this._tri1.showAngles(true);
  //   } else {
  //     this._tri1.hideAngles();
  //   }
  //   this.diagram.animateNextFrame();
  // }

  setCornerScenarios(scenarioName: string) {
    const points = [];
    [this._corner1, this._corner2, this._corner3].forEach((c, index) => {
      const { angle, scenario, limitLine } = this.layout.corner[scenarioName][`c${index + 1}`];
      this.updateCornerAngle(c, angle);
      this.setScenario(c, scenario);
      points.push(scenario.position);
      c.move.limitLine = limitLine;
      // c._side1.setLength(side);
      // c._side2.setLength(side);
    });
    this._tri.updatePoints(...points);
  }

  // setTriangleScenarios(
  //   points1: Array<Point>, points2: Array<Point>,
  //   scenario1: TypeScenario, scenario2: TypeScenario,
  // ) {
  //   this.updateTriangle(this._tri1, points1, scenario1);
  //   this.updateTriangle(this._tri2, points2, scenario2);
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('tri', this.makeTri());
    this.add('corner1', this.makeCorner());
    this.add('corner2', this.makeCorner());
    this.add('corner3', this.makeCorner());
    
    this.hasTouchableElements = true;
  }
}
