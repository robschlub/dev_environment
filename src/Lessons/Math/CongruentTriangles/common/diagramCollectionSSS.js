// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect, getDeltaAngle,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import {
  rand,
} from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

// import { makeAngle } from '../../../../LessonsCommon/tools/angle';
// import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

// type TypeCorner = {
//   _angle: TypeAngle;
//   _line: DiagramElementPrimative;
//   side1: number;
//   side2: number;
//   // points: Array<Point>;
// } & DiagramElementCollection;

export default class SSSCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  // _corner1: TypeCorner;
  // _corner2: TypeCorner;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _circ2: DiagramElementPrimative;
  _circ3: DiagramElementPrimative;
  _symmetry: TypeLine;

  addLines() {
    const make = length => makeLine(
      this.diagram,
      'end',
      length, this.layout.corner.width,
      this.layout.colors.line, true,
    );
    const line1 = make(this.layout.corner.SSSProps.length1);
    const line2 = make(this.layout.corner.SSSProps.length2);
    const line3 = make(this.layout.corner.SSSProps.length3);
    line2.move.type = 'rotation';
    line3.move.type = 'rotation';
    // line2.setMovable();
    // line3.setMovable();
    line2.move.canBeMovedAfterLoosingTouch = true;
    line3.move.canBeMovedAfterLoosingTouch = true;

    this.add('line2', line2);
    this.add('line3', line3);
    this.add('line1', line1);
  }

  addCircles() {
    const make = (radius, color) => this.diagram.shapes.polygon(
      this.layout.corner.SSSProps.circleSides,
      radius,
      this.layout.corner.width / 2,
      0,
      1,
      this.layout.corner.SSSProps.circleSides,
      color,
      new Transform('circle').rotate(0).translate(0, 0),
    );
    const circ2 = make(this.layout.corner.SSSProps.length2, this.layout.colors.angleA);
    const circ3 = make(this.layout.corner.SSSProps.length3, this.layout.colors.angleA);
    this.add('circ2', circ2);
    this.add('circ3', circ3);
  }

  drawCircle(index: number) {
    const line = this[`_line${index}`];
    const circ = this[`_circ${index}`];
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
    const complete = (result: boolean) => {
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

  addSymmetryLine() {
    const line = makeLine(
      this.diagram, 'center', this.diagram.limits.width,
      this.layout.corner.width / 3, this.layout.colors.diagram.dimensions,
      true,
    );
    this.add('symmetry', line);
  }

  calcFutureLinePositions(scenarioName: string) {
    this.futurePositions = [];
    const fp = (element, scenario) => {
      this.futurePositions.push({ element, scenario });
    };
    fp(this._line1, this.layout.corner[scenarioName].l1);
    fp(this._line2, this.layout.corner[scenarioName].l2);
    fp(this._line3, this.layout.corner[scenarioName].l3);
    fp(this._circ2, { position: this.layout.corner[scenarioName].l2.position });
    fp(this._circ3, { position: this.layout.corner[scenarioName].l3.position });
    fp(this._symmetry, {
      position: this.layout.corner[scenarioName].l1.position
        .add(this.layout.corner.SSSProps.length1 / 2, 0),
    });
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addSymmetryLine();
    this.addCircles();
    this.addLines();
    this.hasTouchableElements = true;
  }
}
