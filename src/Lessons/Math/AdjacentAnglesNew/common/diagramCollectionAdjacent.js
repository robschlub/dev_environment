// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeAngle, showAngles } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

import { Equation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';
// type TypeAdjacentAngle = 'adjacent' | 'supplementary' | 'complementary' | 'reflex' | 'right' | 'full';

export default class AdjacentCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _angleA: TypeAngle;
  _angleB: TypeAngle;
  eqn: Equation;

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

  makeEqn(
    vAlign: string = 'baseline',
    hAlign: string = 'left',
    fixTo: string | Point = 'equals',
    scale: number = 1,
  ) {
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
        v: this.diagram.equation.vinculum(this.layout.colors.diagram.text),
      },
      this.layout.colors.diagram.text,
    );

    eqn.formAlignment.hAlign = vAlign;
    eqn.formAlignment.vAlign = hAlign;
    eqn.formAlignment.scale = scale;
    if (fixTo instanceof Point) {
      eqn.formAlignment.fixTo = fixTo;
    } else {
      eqn.formAlignment.fixTo = eqn.collection[`_${fixTo}`];
    }

    eqn.addForm('a', ['a']);
    eqn.addForm('b', ['b']);
    eqn.addForm('supp_a_equals', ['a', 'equals', '_180', 'minus', 'b'], 'deg');
    eqn.addForm('supp_a_equals', ['a', 'equals', 'pi', 'minus', 'b'], 'rad');
    eqn.addForm('supp_b_equals', ['b', 'equals', '_180', 'minus', 'a'], 'deg');
    eqn.addForm('supp_b_equals', ['b', 'equals', 'pi', 'minus', 'a'], 'rad');
    eqn.addForm('comp_a_equals', ['a', 'equals', '_90', 'minus', 'b'], 'deg');
    eqn.addForm('comp_a_equals', ['a', 'equals', eqn.frac('pi', '2', 'v'), 'minus', 'b'], 'rad');
    eqn.addForm('comp_b_equals', ['b', 'equals', '_90', 'minus', 'a'], 'deg');
    eqn.addForm('comp_b_equals', ['b', 'equals', eqn.frac('pi', '2', 'v'), 'minus', 'a'], 'rad');
    eqn.addForm('exp_a_equals', ['a', 'equals', '_360', 'minus', 'b'], 'deg');
    eqn.addForm('exp_a_equals', ['a', 'equals', '2', 'pi', 'minus', 'b'], 'rad');
    eqn.addForm('exp_b_equals', ['b', 'equals', '_360', 'minus', 'a'], 'deg');
    eqn.addForm('exp_b_equals', ['b', 'equals', '2', 'pi', 'minus', 'a'], 'rad');
    return eqn;
  }

  makeAdjacentAngle(color: Array<number>) {
    const angle = makeAngle(
      this.diagram,
      this.layout.angle.radius,
      this.layout.angle.width,
      this.layout.angle.sides,
      color,
    );
    const eqn = this.makeEqn('middle', 'center', new Point(0, 0), 0.7);
    angle.addLabel(eqn, this.layout.angle.labelRadius);
    angle.label.autoHideMag = 0.2;
    return angle;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('angleA', this.makeAdjacentAngle(this.layout.colors.angleA));
    this.add('angleB', this.makeAdjacentAngle(this.layout.colors.angleB));
    this.add('line1', this.makeAdjacentLine(1, this.layout.colors.line));
    this._line1.move.element = this;
    this.add('line2', this.makeAdjacentLine(2, this.layout.colors.line));
    this.add('line3', this.makeAdjacentLine(3, this.layout.colors.line));

    this.eqn = this.makeEqn();
    this.add('eqn', this.eqn.collection);
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
      this._angleA.updateAngle(0, r2);
      this._angleB.updateAngle(r2, r3 - r2);
    }
  }

  showAngles(
    angles: Array<[TypeAngle, string, Array<number>]
            | [TypeAngle, string, Array<number>, boolean]>,
    showOnly: boolean = true,
  ) {
    const allAngles = [this._angleA, this._angleB];
    showAngles(allAngles, angles, showOnly);
    this.updateAngles();
    this.diagram.animateNextFrame();
  }

  calculateFuturePositions(scenario: TypeScenario = 'adjacent') {
    this.futurePositions = [];
    this.addFuturePosition(this._line3, scenario);
    this.addFuturePosition(this._line2, scenario);
    this.addFuturePosition(this._line1, scenario);
  }
}
