// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect,
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
// import type {
//   TypeTriangle, TypeTriangleAngle, TypeTriangleLabel,
// } from '../../../../LessonsCommon/tools/triangle';
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
  // _tri1: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel;

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

  makeCorner() {
    const corner = this.diagram.shapes.collection(new Transform('Corner')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0));

    const line = this.diagram.shapes.polyLine(
      this.layout.corner.points, false,
      this.layout.corner.width, this.layout.colors.line,
      'never',
    );
    const angle = makeAngle(
      this.diagram, this.layout.triangle.angle.radius,
      this.layout.triangle.angle.lineWidth, this.layout.triangle.angle.sides,
      this.layout.colors.angleA,
    );
    const side1 = makeLine(
      this.diagram, 'end', 1,
      this.layout.corner.width, this.layout.colors.angleB, true,
    );
    side1.setLength(0);
    const side2 = makeLine(
      this.diagram, 'end', 1,
      this.layout.corner.width, this.layout.colors.angleB, true,
    );
    side2.setLength(0);
    // const { width } = this.layout.corner;
    side2.transform.updateRotation(Math.PI / 2);
    // side2.transform.updateTranslation(0, width / 2);
    // side1.transform.updateTranslation(0, width / 2);
    angle.updateAngle(0, Math.PI / 2);
    angle.setPosition(this.layout.corner.points[1]);
    corner.add('side1', side1);
    corner.add('side2', side2);
    corner.add('angle', angle);
    corner.add('line', line);
    return corner;
  }

  updateCorner(corner: TypeCorner, newAngle: number) {
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
    corner._side2.transform.updateRotation(newAngle);
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
    [this._corner1, this._corner2, this._corner3].forEach((c, index) => {
      const { angle, scenario } = this.layout.corner[scenarioName][`c${index + 1}`];
      console.log(c)
      this.updateCorner(c, angle);
      this.setScenario(c, scenario);
    });
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
    // this.add('tri', this.makeTri());
    this.add('corner1', this.makeCorner());
    this.add('corner2', this.makeCorner());
    this.add('corner3', this.makeCorner());
    this.hasTouchableElements = true;
  }
}
