// @flow
import Diagram from '../../../../js/diagram/Diagram';
import {
  Transform, minAngleDiff,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import { makeLabeledAngle, makeSupplementaryAngle } from './tools';
import { makeLabeledLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLabeledLine } from '../../../../LessonsCommon/tools/line';
import type { TypeAngle, TypeSupplementaryAngle } from './tools';
import { Equation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';

export default class OppositeCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: TypeLabeledLine;
  _line2: TypeLabeledLine;
  _angleA: TypeAngle;
  _angleB: TypeAngle;
  _angleC: TypeAngle;
  _angleD: TypeAngle;
  _supplementary: TypeSupplementaryAngle;
  varState: {
    supplementary: number;
  };

  _equation1: {
    eqn: Equation;
  } & DiagramElementCollection;

  _equation2: {
    eqn: Equation;
  } & DiagramElementCollection;

  _equation3: {
    eqn: Equation;
  } & DiagramElementCollection;

  makeLine(labelText: string) {
    const line = makeLabeledLine(
      this.diagram, this.layout.parallelLine,
      this.layout.colors.line, labelText,
    );
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.updateOppositeAngles();
    };
    return line;
  }

  makeSuppAngle() {
    const angle = makeSupplementaryAngle(this.diagram, this.layout);
    angle.setPosition(this.layout.line1.opposite.position);
    return angle;
  }

  addEquation(name: string) {
    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements(
      {
        a: 'a',
        a1: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
        equals: ' = ',
        minus: ' \u2212 ',
        minus1: ' \u2212 ',
        _180: '180º',
        _1801: '180º',
        pi: 'π',
        pi1: 'π',
        plus: ' + ',
        lb: '(',
        rb: ')',
      },
      this.layout.colors.diagram.text.base,
    );

    eqn.formAlignment.fixTo = eqn.collection._equals;
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 1.0;

    eqn.setElem('a', this.layout.colors.angleA);
    eqn.setElem('a1', this.layout.colors.angleA);
    eqn.setElem('b', this.layout.colors.angleB);
    eqn.setElem('c', this.layout.colors.angleC);
    eqn.setElem('d', this.layout.colors.angleD);

    eqn.addForm('a_plus_b', ['a', 'plus', 'b', 'equals', '_180', 'deg']);
    eqn.addForm('a_plus_b', ['a', 'plus', 'b', 'equals', 'pi'], 'rad');

    eqn.addForm('b', ['b', 'equals', '_180', 'minus', 'a1'], 'deg');
    eqn.addForm('b', ['b', 'equals', 'pi', 'minus', 'a1'], 'rad');

    eqn.addForm('c', ['c', 'equals', '_180', 'minus', 'b'], 'deg');
    eqn.addForm('c', ['c', 'equals', 'pi', 'minus', 'b'], 'rad');
    eqn.addForm('c_equals_a_full', ['c', 'equals', '_180', 'minus', 'lb', '_1801', 'minus1', 'a', 'rb'], 'deg');
    eqn.addForm('c_equals_a_full', ['c', 'equals', 'pi', 'minus', 'lb', 'pi1', 'minus1', 'a', 'rb'], 'rad');
    eqn.addForm('c_equals_a', ['c', 'equals', 'a']);

    eqn.addForm('d', ['d', 'equals', '_180', 'minus', 'a'], 'deg');
    eqn.addForm('d', ['d', 'equals', 'pi', 'minus', 'a'], 'rad');

    eqn.addForm('d_equals_b', ['d', 'equals', 'b']);

    eqn.showForm('deg_a_plus_b');
    this.add(name, eqn.collection);
    this.elements[name].eqn = eqn;

    return eqn;
  }

  setUnits(units: 'deg' | 'rad') {
    this._equation1.eqn.setUnits(units);
    this._equation2.eqn.setUnits(units);
    this._equation3.eqn.setUnits(units);
    this._angleB.eqn.setUnits(units);
  }

  makeAngle(name: 'a' | 'b' | 'c' | 'd') {
    const color = this.layout.colors[`angle${name.toUpperCase()}`];
    const arcLayout = this.layout.angle.arc;
    const radius = name === 'a' || name === 'c'
      ? arcLayout.radius : arcLayout.radius * 1.0;
    const angle = makeLabeledAngle(this.diagram, this.layout, radius, color);

    angle.eqn.addForm('b_equals', ['b', 'equals', '_180', 'minus', 'a'], 'deg');
    angle.eqn.addForm('b_equals', ['b', 'equals', 'pi', 'minus', 'a'], 'rad');
    angle.eqn.showForm(name);
    angle.setPosition(this.layout.line1.opposite.position);
    return angle;
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.position);
    this.add('line1', this.makeLine('1'));
    this._line1.setPosition(this.layout.line1.opposite.position.x, 0);
    this.add('line2', this.makeLine('2'));
    this._line2.setPosition(this.layout.line2.opposite.position.x, 0);
    this.add('angleA', this.makeAngle('a'));
    this.add('angleB', this.makeAngle('b'));
    this.add('angleC', this.makeAngle('c'));
    this.add('angleD', this.makeAngle('d'));
    this.addEquation('equation1');
    this.addEquation('equation2');
    this.addEquation('equation3');

    this.add('supplementary', this.makeSuppAngle());

    this.varState = {
      supplementary: 3,
    };
    this.hasTouchableElements = true;
  }

  updateOppositeAngles() {
    if (this._line1 && this._line2 && this._angleA) {
      const r1 = this._line1.transform.r();
      const r2 = this._line2.transform.r();
      if (r1 != null && r2 != null) {
        if (this._angleA.isShown
          || this._angleB.isShown
          || this._angleC.isShown
          || this._angleD.isShown) {
          const minAngle = minAngleDiff(r2, r1);
          if (minAngle > 0) {
            this._angleA.updateAngle(r1, minAngle);
            this._angleB.updateAngle(r1 + Math.PI - (Math.PI - minAngle), Math.PI - minAngle);
            this._angleC.updateAngle(r1 + Math.PI, minAngle);
            this._angleD.updateAngle(r1 + 2 * Math.PI - (Math.PI - minAngle), Math.PI - minAngle);
          } else {
            this._angleA.updateAngle(r1, Math.PI - Math.abs(minAngle));
            this._angleB.updateAngle(r1 + Math.PI - Math.abs(minAngle), Math.abs(minAngle));
            this._angleC.updateAngle(r1 + Math.PI, Math.PI - Math.abs(minAngle));
            this._angleD.updateAngle(r1 + 2 * Math.PI - Math.abs(minAngle), Math.abs(minAngle));
          }
        }
        this._line1.updateLabel(r1);
        this._line2.updateLabel(r2);
      }
    }
  }

  pulseLine(index: number = 1) {
    this.elements[`line${index}`].pulseWidth();
    this.diagram.animateNextFrame();
  }

  pulseSupplementaryAngle(index: number | null = null) {
    if (index != null) {
      this.varState.supplementary = index;
    } else if (this.varState.supplementary === 3) {
      this.varState.supplementary = 0;
    } else {
      this.varState.supplementary += 1;
    }

    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    if (r1 != null && r2 != null) {
      if (this.varState.supplementary === 0) {
        this._supplementary.transform.updateRotation(r1);
      }
      if (this.varState.supplementary === 1) {
        this._supplementary.transform.updateRotation(r2);
      }
      if (this.varState.supplementary === 2) {
        this._supplementary.transform.updateRotation(r1 + Math.PI);
      }
      if (this.varState.supplementary === 3) {
        this._supplementary.transform.updateRotation(r2 + Math.PI);
      }
    }
    this._supplementary.scaleAndDisolve();
    this.diagram.animateNextFrame();
  }

  nextEquation2Form() {
    this._equation2.eqn.nextForm();
    this.diagram.animateNextFrame();
  }

  toggleOppositeAngles() {
    if (this._angleA.isShown) {
      this._angleB.eqn.showForm('b');
      this._angleD.eqn.showForm('b');
      this._angleB.show();
      this._angleB._arc.show();
      this._angleD.show();
      this._angleD._arc.show();
      this._angleA.hide();
      this._angleC.hide();
    } else {
      this._angleB.hide();
      this._angleD.hide();
      this._angleA.eqn.showForm('a');
      this._angleC.eqn.showForm('a');
      this._angleA.show();
      this._angleC.show();
      this._angleA._arc.show();
      this._angleC._arc.show();
    }
    this.diagram.animateNextFrame();
  }
}
