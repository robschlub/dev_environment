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
  _circ: DiagramElementPrimative;
  _angle: TypeAngle;

  addLines() {
    const make = (length, width) => makeLine(
      this.diagram,
      'end',
      length, width,
      this.layout.colors.line, true,
    );
    const line1 = make(1, this.layout.corner.width);
    const line2 = make(1, this.layout.corner.width);
    const line3 = make(1, this.layout.corner.width * 0.8);
    line1.move.type = 'scaleX';
    line3.move.type = 'rotation';
    line2.move.type = 'rotation';
    line2.move.canBeMovedAfterLoosingTouch = true;
    line3.move.canBeMovedAfterLoosingTouch = true;
    line1.setLength(this.layout.SSA.line1.length);
    line2.setLength(this.layout.SSA.line2.length);
    line3.setLength(this.layout.SSA.line3.length);
    line3.setColor(this.colors.construction);
    line1.setTransformCallback = this.update.bind(this);
    line2.setTransformCallback = this.update.bind(this);
    line3.setTransformCallback = this.update.bind(this);
    this.add('line3', line3);
    this.add('line1', line1);
    this.add('line2', line2);
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

  update() {
    const p1 = this._line1.transform.t();
    // const l1 = this._line1.currentLength;
    const s1 = this._line1.transform.s();
    const r3 = this._line3.transform.r();
    if (p1 != null && r3 != null && s1 != null) {
      const p3 = p1.add(new Point(-this.layout.SSA.line1.length * s1.x, 0));
      this._line2.transform.updateTranslation(p1);
      this._line3.transform.updateTranslation(p3);
      this._line3.setLength(1.7 / Math.sin(r3));
      this._circ.setPosition(p1);
      const circRadius = this.layout.SSA.line2.length;
      this._circ.transform.updateScale(circRadius, circRadius); // as circle radius is 1
      this._angle.setPosition(p3);
      this._angle.updateAngle(0, r3);
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
      3, this.layout.colors.construction1,
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
    const line = this._line;
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
    const complete = (result: boolean = false) => {
      if (result) {
        line.setTransformCallback = originalCallback;
        circ.angleToDraw = -1;
        circ.transform.updateRotation(0);
        line.setMovable(true);
      }
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
