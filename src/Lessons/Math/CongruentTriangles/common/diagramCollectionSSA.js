// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect, normAngle, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

// type TypeCorner = {
//   _angle: TypeAngle;
//   _line: DiagramElementPrimative;
//   side1: number;
//   side2: number;
// } & DiagramElementCollection;

export default class SSACollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _line3Temp: TypeLine;
  _lineCorner: TypeLine;
  _circ: DiagramElementPrimative;
  _angle: TypeAngle;

  addLines() {
    const ssa = this.layout.SSA;
    const make = (length, width) => makeLine(
      this.diagram,
      'end',
      length, width,
      this.layout.colors.line, true,
    );
    const line1 = make(1, this.layout.corner.width);
    const line2 = make(1, this.layout.corner.width);
    const line3 = make(1, this.layout.corner.width * 0.5);
    const line3Temp = make(1, this.layout.corner.width);
    const lineCorner = make(1, this.layout.corner.width);
    line1.move.type = 'scaleX';
    line3.move.type = 'rotation';
    line2.move.type = 'rotation';
    line2.move.canBeMovedAfterLoosingTouch = true;
    line3.move.canBeMovedAfterLoosingTouch = true;
    line1.setLength(this.layout.SSA.line1.length);
    line2.setLength(this.layout.SSA.line2.length);
    line3.setLength(this.layout.SSA.line3.length);
    lineCorner.setLength(this.layout.SSA.cornerLength);
    line3.setColor(this.colors.construction);
    line1.setTransformCallback = this.update.bind(this);
    line2.setTransformCallback = this.update.bind(this);
    line3.setTransformCallback = this.update.bind(this);
    line1.move.maxTransform.updateScale(ssa.line1.maxScale, 1);
    line1.move.minTransform.updateScale(ssa.line1.minScale, 1);
    line3.move.minTransform.updateRotation(Math.PI / 9);
    line3.move.maxTransform.updateRotation(Math.PI / 9 * 8);
    this.add('line3', line3);
    this.add('line1', line1);
    this.add('line2', line2);
    this.add('line3Temp', line3Temp);
    this.add('lineCorner', lineCorner);
  }

  addAngle() {
    const angle = makeAngle(
      this.diagram,
      this.layout.SSA.angleRadius,
      this.layout.corner.width,
      this.layout.SSA.angleSides,
      this.layout.colors.angleA,
    );
    angle.addLabel('a', this.layout.SSA.labelRadius);
    angle.showRealAngle = true;
    angle.autoRightAngle = true;
    angle.realAngleDecimals = 0;
    this.add('angle', angle);
  }

  growLine3(callback: ?(?mixed) => void = null) {
    this._line3.setLength(0.1);
    this._line3.animateLengthTo(this.getTargetLine3Length(), 1, true, callback);
    this.diagram.animateNextFrame();
  }

  getTargetLine3Length() {
    const r3 = this._line3.transform.r();
    if (r3 != null) {
      return 1.7 / Math.sin(r3);
    }
    return 0;
  }

  update() {
    const p1 = this._line1.transform.t();
    // const l1 = this._line1.currentLength;
    const s1 = this._line1.transform.s();
    const r3 = this._line3.transform.r();
    if (p1 != null && r3 != null && s1 != null) {
      const p3 = p1.add(new Point(-this.layout.SSA.line1.length * s1.x, 0));
      this._line2.transform.updateTranslation(p1);
      this._line3.transform.updateTranslation(p3);
      this._line3.setLength(this.getTargetLine3Length());
      this._lineCorner.transform.updateTranslation(p3);
      this._lineCorner.transform.updateRotation(r3);
      this._circ.setPosition(p1);
      const circRadius = this.layout.SSA.line2.length;
      this._circ.transform.updateScale(circRadius, circRadius); // as circle radius is 1
      this._angle.setPosition(p3);
      this._angle.updateAngle(0, r3);
    }
  }

  calculateInterseptAngles() {
    const s1 = this._line1.transform.s();
    const l2 = this.layout.SSA.line2.length;
    const r3 = this._line3.transform.r();
    const interceptAngles = [];
    if (s1 != null && r3 != null) {
      const l1 = this.layout.SSA.line1.length * s1.x;
      const angleThreshold = Math.asin(l2 / l1);
      const b = Math.asin(l1 * Math.sin(r3) / l2);
      const c = r3 + b;
      if (l1 <= l2) {
        // one root
        interceptAngles.push(c);
      } else if (r3 < angleThreshold) {
        // two roots
        interceptAngles.push(c);
        interceptAngles.push(r3 + (Math.PI - b));
      } else if (r3 === angleThreshold) {
        // one root
        interceptAngles.push(c);
      }
    }
    return interceptAngles;
  }

  toggleInterceptAngles() {
    const interceptAngles = this.calculateInterseptAngles();
    let r2 = this._line2.transform.r();
    let targetAngle: null | number = null;
    if (r2 != null) {
      r2 = normAngle(r2);
      this._line2.transform.updateRotation(r2);
      if (interceptAngles.length === 2) {
        const min = Math.min(...interceptAngles);
        const max = Math.max(...interceptAngles);
        const midAngle = (max - min) / 2 + min;
        if (r2 > midAngle) {
          targetAngle = min;
        } else {
          targetAngle = max;
        }
      } else if (interceptAngles.length === 1) {
        if (r2 !== interceptAngles[0]) {
          [targetAngle] = interceptAngles;
        }
      }
      if (targetAngle != null) {
        this._line2.animateRotationTo(
          targetAngle, 0,
          new Transform().scale(5, 5).rotate(1).translate(5, 5),
        );
        this.diagram.animateNextFrame();
      }
    }
  }

  // addCorner() {
  //   const corner = this.diagram.shapes.collection(new Transform('Corner')
  //     .scale(1, 1)
  //     .rotate(0)
  //     .translate(0, 0));
  //   const line = this.diagram.shapes.polyLine(
  //     this.layout.corner.points, false,
  //     this.layout.corner.width, this.layout.colors.line,
  //     'onSharpAnglesOnly',
  //   );
  //   const angle = makeAngle(
  //     this.diagram, this.layout.corner.angleRadius,
  //     this.layout.corner.angleWidth, this.layout.triangle.angle.sides,
  //     this.layout.colors.angleA,
  //   );
  //   corner.side1 = 1;
  //   corner.side2 = 1;
  //   corner.hasTouchableElements = true;
  //   angle.updateAngle(0, Math.PI / 2);
  //   angle.setPosition(this.layout.corner.points[1]);
  //   angle.showRealAngle = true;
  //   angle.addLabel('', this.layout.corner.angleLabelRadius);
  //   angle.autoRightAngle = true;
  //   corner.add('angle', angle);
  //   corner.add('line', line);
  //   this.updateCorner(
  //     corner,
  //     this.layout.corner.SSAStart.c1.angle,
  //     this.layout.corner.SSAStart.c1.side1,
  //     this.layout.corner.SSAStart.c1.side2,
  //   );
  //   this.add('corner', corner);
  // }

  // updateCorner(corner: TypeCorner, angle: number, side1: number, side2: number) {
  //   const newP1 = polarToRect(side1, 0);
  //   const newP3 = polarToRect(side2, angle);
  //   const p2 = this.layout.corner.points[1];
  //   corner.side1 = newP1.sub(p2).distance();
  //   corner.side2 = newP3.sub(p2).distance();
  //   corner._line.vertices.change([newP1, p2, newP3]);
  //   const rotation = corner.transform.r();
  //   if (rotation != null) {
  //     corner._angle.updateAngle(0, angle, rotation);
  //   }
  // }

  addCircle() {
    const circle = this.diagram.shapes.polygonLine(
      this.layout.SSA.circleSides, 1, 0, 1, this.layout.SSA.circleSides,
      2, this.layout.colors.construction,
      new Transform().scale(0.5, 0.5).rotate(0).translate(0, 0),
    );
    this.add('circ', circle);
  }

  // toggleTriangle() {
  //   const r = this._line.transform.r();
  //   const { smallAngle, largeAngle } = this.layout.corner.SSAJoin.line2;
  //   const midAngle = (largeAngle - smallAngle) / 2 + smallAngle;
  //   if (r != null) {
  //     this._line.transform.updateRotation(normAngle(r));
  //     let goToAngle = smallAngle;
  //     if (r < midAngle) {
  //       goToAngle = largeAngle;
  //     }
  //     this._line.animateRotationTo(goToAngle, 0, new Transform().rotate(4));
  //   }
  //   this.diagram.animateNextFrame();
  // }

  drawCircle() {
    // $FlowFixMe
    const line = this._line2;
    // $FlowFixMe
    const circ = this._circ;
    const startR = line.transform.r() || 0;
    circ.transform.updateRotation(startR);
    circ.angleToDraw = 0;
    circ.show();
    const originalCallback = line.setTransformCallback;
    line.setTransformCallback = (transform: Transform) => {
      const tr = transform.r() || 0;
      let angleToDraw = tr - startR;
      if (angleToDraw < 0) {
        angleToDraw += Math.PI * 2;
      }
      circ.angleToDraw = angleToDraw;
    };
    line.setMovable(false);
    const complete = () => {
      line.setTransformCallback = originalCallback;
      circ.angleToDraw = -1;
      circ.transform.updateRotation(0);
      line.setMovable(true);
      this.diagram.animateNextFrame();
    };
    let targetRotation = startR - 0.0001;
    if (targetRotation < 0) {
      targetRotation += Math.PI * 2;
    }
    line.animateRotationTo(targetRotation, 1, 1.5, complete);
    this.diagram.animateNextFrame();
  }

  calcFuturePositions(scenarioName: string) {
    const fp = (element, scenario) => {
      if (scenario) {
        if (scenario.scenario) {
          this.futurePositions.push({ element, scenario: scenario.scenario });
        }
      }
    };
    this.futurePositions = [];
    const cornerScenario = this.layout[scenarioName];
    fp(this._line1, cornerScenario.line1);
    fp(this._line2, cornerScenario.line2);
    fp(this._line3, cornerScenario.line3);
    fp(this._circ, cornerScenario.circ);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addCircle();
    this.addAngle();
    this.addLines();
    // this._line2.setTransformCallback = this.update.bind(this);
    // this.addCorner();
    this.hasTouchableElements = true;
  }
}
