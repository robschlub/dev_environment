// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
// import {
//   DiagramElementPrimative, DiagramElementCollection,
// } from '../../../../js/diagram/Element';
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

// import { makeLine } from '../../../../LessonsCommon/tools/line';
// import { makeAngle } from '../../../../LessonsCommon/tools/angle';
// import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';


export default class TriangleCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _tri1: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel;
  _tri2: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel;

  makeTri() {
    const layout = this.layout.triangle;
    const triangle = makeTriangle(
      this.diagram,
      new Point(-1, -1),
      new Point(1, -1),
      new Point(0, 1),
      layout.lineWidth,
      this.layout.colors.line,
    );
    const a = layout.angle;
    const aColor = this.layout.colors.angleLabels;
    const lColor = this.layout.colors.lineLabels;
    triangle.addAngle(1, a.radius, a.lineWidth, a.sides, aColor, 'a');
    triangle.addAngle(2, a.radius, a.lineWidth, a.sides, aColor, 'b');
    triangle.addAngle(3, a.radius, a.lineWidth, a.sides, aColor, 'c');
    triangle.addSideLabel(2, 3, lColor, 'A', 0.05, 'outside', '', 'horizontal');
    triangle.addSideLabel(3, 1, lColor, 'B', 0.05, 'outside', '', 'horizontal');
    triangle.addSideLabel(1, 2, lColor, 'C', 0.05, 'outside', '', 'horizontal');
    return triangle;
  }

  updateTriangle(
    element: TypeTriangleAngle & TypeTriangle,
    points: Array<Point>,
    scenario: TypeScenario,
  ) {
    // console.log(element, points, scenario)
    element.updatePoints(...points);
    this.setScenario(element, scenario);
    this.diagram.animateNextFrame();
  }

  showLineLabels(show: boolean | null = true) {
    let toShow = true;
    if (show === null || typeof show !== 'boolean') {
      if (this._tri1._dimension12.isShown) {
        toShow = false;
      }
    }
    if (toShow) {
      this._tri1.showDimensions(true);
      this._tri2.showDimensions(true);
    } else {
      this._tri1.hideDimensions();
      this._tri2.hideDimensions();
    }
    this.diagram.animateNextFrame();
  }

  showAngleLabels(show: boolean = true) {
    let toShow = true;
    if (show === null || typeof show !== 'boolean') {
      if (this._tri1._angle1.isShown) {
        toShow = false;
      }
    }
    if (toShow) {
      this._tri1.showAngles(true);
      this._tri2.showAngles(true);
    } else {
      this._tri1.hideAngles();
      this._tri2.hideAngles();
    }
    this.diagram.animateNextFrame();
  }

  calcTriFuturePositions(
    scenario1: TypeScenario, scenario2: TypeScenario,
  ) {
    this.futurePositions = [
      { element: this._tri1, scenario: scenario1 },
      { element: this._tri2, scenario: scenario2 },
    ];
  }

  setTriangleScenarios(
    points1: Array<Point>, points2: Array<Point>,
    scenario1: TypeScenario, scenario2: TypeScenario,
  ) {
    this.updateTriangle(this._tri1, points1, scenario1);
    this.updateTriangle(this._tri2, points2, scenario2);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('tri1', this.makeTri());
    this.add('tri2', this.makeTri());
    this.hasTouchableElements = true;
  }
}
