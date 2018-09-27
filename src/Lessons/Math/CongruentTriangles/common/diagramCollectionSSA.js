// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect, normAngle,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

type TypeCorner = {
  _angle: TypeAngle;
  _line: DiagramElementPrimative;
  side1: number;
  side2: number;
} & DiagramElementCollection;

export default class SSACollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _circ: DiagramElementPrimative;
  _angle: TypeAngle;

  addLines() {
    const make = length => makeLine(
      this.diagram,
      'end',
      length, this.layout.corner.width,
      this.layout.colors.line, true,
    );
    const line1 = make(1);
    const line2 = make(1);
    const line3 = make(1);
    line2.move.type = 'rotation';
    line3.move.type = 'rotation';
    line2.move.canBeMovedAfterLoosingTouch = true;
    line3.move.canBeMovedAfterLoosingTouch = true;
    this.add('line1', line1);
    this.add('line2', line2);
    this.add('line3', line3);
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
      2, this.layout.colors.angleA,
      new Transform().scale(0.5, 0.5).rotate(0).translate(0, 0),
    );
    this.add('circ1', circle1);
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

  // calcFuturePositions(scenarioName: string) {
  //   const fp = (element, scenario) => {
  //     if (scenario) {
  //       this.futurePositions.push({ element, scenario: scenario.scenario });
  //     }
  //   };
  //   this.futurePositions = [];
  //   const cornerScenario = this.layout.corner[scenarioName];
  //   fp(this._line, cornerScenario.line);
  //   fp(this._corner, cornerScenario.c1);
  //   fp(this._line2, cornerScenario.line2);
  //   fp(this._circ, cornerScenario.circ);
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addCircle();
    this.addLines();
    // this.addCorner();
    this.hasTouchableElements = true;
  }
}
