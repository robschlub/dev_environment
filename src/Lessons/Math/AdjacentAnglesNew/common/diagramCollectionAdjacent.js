// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

// type TypeAdjacentAngle = 'adjacent' | 'supplementary' | 'complementary' | 'reflex' | 'right' | 'full';

export default class AdjacentCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _angle1: TypeAngle;
  _angle2: TypeAngle;

  makeAdjacentLine(index: number, color: Array<number>) {
    const line = makeLine(
      this.diagram,
      'end',
      this.layout.line.length,
      this.layout.line.width,
      color,
      true,
    );
    line.setMovable();
    line.move.type = 'rotation';
    if (index > 1) {
      line.setTransformCallback = this.updateAngles.bind(this);
    }
    return line;
  }

  makeAdjacentAngle(color: Array<number>) {
    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements(
      {
        a: 'a',
        b: 'b',
        equals: ' = ',
        minus: ' \u2212 ',
        plus: ' + ',
        _180: '180º',
        _90: '90º',
        _360: '360º',
        pi: 'π',
        _2: '2',
        v: this.diagram.equation.vinculum(color),
      },
      color,
    );

    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 0.7;

    eqn.addForm('a', ['a']);
    eqn.addForm('b', ['b']);

    const angle = makeAngle(
      this.diagram,
      this.layout.angle.radius,
      this.layout.angle.width,
      this.layout.angle.sides,
      color,
    );
    angle.addLabel(eqn, this.layout.angle.labelRadius);
    return angle;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('angle1', this.makeAdjacentAngle(this.layout.colors.angleA));
    this.add('angle2', this.makeAdjacentAngle(this.layout.colors.angleB));
    this.add('line1', this.makeAdjacentLine(1, this.layout.colors.line));
    this._line1.move.element = this;
    this.add('line2', this.makeAdjacentLine(2, this.layout.colors.line));
    this.add('line3', this.makeAdjacentLine(3, this.layout.colors.line));
    this.hasTouchableElements = true;
  }

  updateAngles() {
    let r2 = this._line2.transform.r();
    let r3 = this._line3.transform.r();
    if (r2 != null && r3 != null) {
      if (r3 > Math.PI * 2) {
        r3 = Math.PI * 2;
      }
      if (r2 > r3) {
        r2 = r3;
      }
      if (r2 < 0) {
        r2 = 0;
      }
      if (r3 < 0) {
        r3 = 0;
      }
      this._line2.transform.updateRotation(r2);
      this._line3.transform.updateRotation(r3);
      this._angle1.updateAngle(0, r2);
      this._angle2.updateAngle(r2, r3 - r2);
    }
  }

  calculateFuturePositions(scenario: TypeScenario = 'adjacent') {
    this.futurePositions = [];
    this.addFuturePosition(this._line3, scenario);
    this.addFuturePosition(this._line2, scenario);
    this.addFuturePosition(this._line1, scenario);
  }
}
