// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import {
  rand,
} from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';

// import makeTriangle from '../../../../LessonsCommon/tools/triangle';
// import type {
//   TypeTriangle, TypeTriangleAngle, TypeTriangleLabel,
// } from '../../../../LessonsCommon/tools/triangle';
// import { makeLine } from '../../../../LessonsCommon/tools/line';
// import type { TypeLine } from '../../../../LessonsCommon/tools/line';

// import { makeLine } from '../../../../LessonsCommon/tools/line';
import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

type TypeCorner = {
  _angle: TypeAngle;
  _line: DiagramElementPrimative;
  side1: number;
  side2: number;
} & DiagramElementCollection;

export default class SASCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _corner1: TypeCorner;
  _corner2: TypeCorner;
  // _corner3: TypeCorner;
  // _tri: TypeTriangle & TypeTriangleAngle & TypeTriangleLabel;

  // makeTri() {
  //   const triangle = makeTriangle(
  //     this.diagram,
  //     new Point(-1, -1),
  //     new Point(1, -1),
  //     new Point(0, 1),
  //     this.layout.corner.sideWidth,
  //     this.layout.colors.line,
  //   );
  //   const lColor = this.layout.colors.diagram.disabled;
  //   triangle.addSideLabel(2, 3, lColor, 'A', 0.05, 'outside', '', 'horizontal');
  //   triangle.addSideLabel(3, 1, lColor, 'B', 0.05, 'outside', '', 'horizontal');
  //   triangle.addSideLabel(1, 2, lColor, 'C', 0.05, 'outside', '', 'horizontal');
  //   triangle._dimension12.showRealLength = true;
  //   triangle._dimension31.showRealLength = true;
  //   triangle._dimension23.showRealLength = true;
  //   return triangle;
  // }

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
    corner.side1 = 1;
    corner.side2 = 1;
    // const touchPoint = this.diagram.shapes.polygonFilled(
    //   10, 0.4, 0, 10, [0, 0, 0, 0], new Transform().translate(0, 0),
    // );
    // touchPoint.move.element = corner;
    // touchPoint.move.canBeMovedAfterLoosingTouch = true;
    corner.hasTouchableElements = true;
    angle.updateAngle(0, Math.PI / 2);
    angle.setPosition(this.layout.corner.points[1]);
    angle.showRealAngle = true;
    angle.addLabel('', this.layout.corner.angleLabelRadius);
    angle.autoRightAngle = true;
    // corner.add('touchPoint', touchPoint);
    corner.add('angle', angle);
    corner.add('line', line);
    return corner;
  }

  // recalculateTriangle(index: number) {
  //   const indeces = [1, 2, 3];
  //   const opp = indeces.filter(i => i !== index);
  //   const c = [this._corner1, this._corner2, this._corner3];
  //   const l = this.layout.corner.AAA;
  //   const layout = [l.c1, l.c2, l.c3];
  //   let t1 = c[0].transform.t();
  //   let t2 = c[1].transform.t();
  //   let t3 = c[2].transform.t();
  //   const r1 = c[0].transform.r();
  //   const r2 = c[1].transform.r();
  //   const r3 = c[2].transform.r();
  //   if (t1 != null && t2 != null && t3 != null
  //     && r1 != null && r2 != null && r3 != null) {
  //     const t = [t1, t2, t3];
  //     const r = [r1, r2, r3];
  //     const oppLine = new Line(t[opp[0] - 1], t[opp[1] - 1]);
  //     const side1 = new Line(t[index - 1], 1, r[index - 1]);
  //     const intersect1 = side1.intersectsWith(oppLine).intersect;
  //     c[index % 3].transform.updateTranslation(intersect1);

  //     const side2 = new Line(t[index - 1], 1, r[index - 1] + layout[index - 1].angle);
  //     const intersect2 = side2.intersectsWith(oppLine).intersect;
  //     c[(index + 1) % 3].transform.updateTranslation(intersect2);
  //   }
  //   t1 = c[0].transform.t();
  //   t2 = c[1].transform.t();
  //   t3 = c[2].transform.t();
  //   if (t1 != null && t2 != null && t3 != null) {
  //     this._tri.updatePoints(t1, t2, t3);
  //   }
  // }


  updateCorner(corner: TypeCorner, angle: number, side1: number, side2: number) {
    const newP1 = polarToRect(side1, 0);
    const newP3 = polarToRect(side2, angle);
    const p2 = this.layout.corner.points[1];
    // eslint-disable-next-line no-param-reassign
    corner.side1 = newP1.sub(p2).distance();
    // eslint-disable-next-line no-param-reassign
    corner.side2 = newP3.sub(p2).distance();
    corner._line.vertices.change([newP1, p2, newP3]);
    const rotation = corner.transform.r();
    if (rotation != null) {
      corner._angle.updateAngle(0, angle, rotation);
    }
  }

  setCornerScenarios(scenarioName: string) {
    const points = [];
    [this._corner1, this._corner2].forEach((c, index) => {
      const {
        angle, scenario, side1, side2,
      } = this.layout.corner[scenarioName][`c${index + 1}`];
      this.setScenario(c, scenario);
      this.updateCorner(c, angle, side1, side2);
      points.push(scenario.position);
    });
  }

  growCorner2(
    fromLength: number | null,
    toLength: number,
    time: number = 1.5,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    let fromLengthToUse;
    if (fromLength != null) {
      fromLengthToUse = fromLength;
    } else {
      fromLengthToUse = this._corner2.side1;
    }
    const func = (percent) => {
      const side1 = percent * (toLength - fromLengthToUse) + fromLengthToUse;
      this.updateCorner(
        this._corner2, this.layout.corner.SAS.c2.angle,
        side1,
        this.layout.corner.SAS.c2.side2,
      );
      this._corner2.side1 = side1;
      // if (percent >= 1) {
      //   this._corner2._angle.showAll();
      //   this._corner2._angle.pulseScaleNow(1, 1.5);
      // }
    };
    const done = () => {
      if (finishOnCancel) {
        func(1);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    this._corner2._angle.hideAll();
    this._corner2.animateCustomTo(func, time, 0, done);
    this.diagram.animateNextFrame();
  }

  rotateCorner2(
    toAngle: number | null,
    time: number,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    const { currentAngle } = this._corner2._angle;
    let toAngleToUse;
    if (toAngle == null) {
      toAngleToUse = rand(0, Math.PI * 2);
    } else {
      toAngleToUse = toAngle;
    }
    const func = (percent) => {
      const angle = percent * (toAngleToUse - currentAngle) + currentAngle;
      this.updateCorner(
        this._corner2, angle,
        this.layout.corner.SAS.c2.side1,
        this.layout.corner.SAS.c2.side2,
      );
    };
    const done = () => {
      if (finishOnCancel) {
        func(1);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    this._corner2._angle.showAll();
    this._corner2._angle.animateCustomTo(func, time, 0, done);
    this.diagram.animateNextFrame();
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('corner1', this.makeCorner());
    this.add('corner2', this.makeCorner());
    // this.add('corner3', this.makeCorner());
    // this.add('tri', this.makeTri());
    this.hasTouchableElements = true;
  }
}
