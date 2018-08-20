// @flow
import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, minAngleDiff, Point, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import makeMoveableLine from './diagramCollectionCommon';
import type { MoveableLineType } from './diagramCollectionCommon';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

type AngleType = {
  _label: DiagramElementCollection;
  _arc: DiagramElementPrimative;
  eqn: {
    showForm: (string) => void;
  } & Equation;
  updateAngle: (number, number) => void;
} & DiagramElementCollection;

type labeledLineType = {
  _label: DiagramElementCollection;
  eqn: Equation;
  updateLabel: (number) => void;
} & MoveableLineType;

export default class OppositeCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: labeledLineType;
  _line2: labeledLineType;
  _angleA: AngleType;
  _angleB: AngleType;
  _angleC: AngleType;
  _angleD: AngleType;
  _supplementary: DiagramElementPrimative;
  varState: {
    supplementary: number;
  };

  _equation1: {
    eqn: Equation;
  } & DiagramElementCollection;

  _equation2: {
    eqn: Equation;
  } & DiagramElementCollection;

  makeLine(labelText: string) {
    // $FlowFixMe
    const line: labeledLineType = makeMoveableLine(this.diagram, this.layout);
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.updateOppositeAngles();
    };
    line._end1.movementAllowed = 'rotation';
    line._end2.movementAllowed = 'rotation';
    line._mid.movementAllowed = 'rotation';

    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements({ label: labelText }, this.layout.colors.line);

    eqn.formAlignment.fixTo = new Point(0, 0);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 0.6;

    eqn.addForm('base', ['label']);
    eqn.setCurrentForm('base');

    line.eqn = eqn;
    line.add('label', eqn.collection);

    line.updateLabel = (newAngle: number) => {
      line._label.transform.updateRotation(-newAngle);
      let labelWidth = 0;
      let labelHeight = 0;
      if (eqn.currentForm != null) {
        labelWidth = eqn.currentForm.width / 2 + 0.04;
        labelHeight = eqn.currentForm.height / 2 + 0.04;
      }
      // const labelDistance = Math.min(
      //   labelHeight / Math.abs(Math.sin(newAngle)),
      //   labelWidth / Math.abs(Math.cos(newAngle)),
      // ) + this.layout.moveableLine.label.length;
      const a = labelWidth + this.layout.moveableLine.label.length;
      const b = labelHeight + this.layout.moveableLine.label.length;
      const r = a * b / Math.sqrt((b * Math.cos(newAngle)) ** 2 + (a * Math.sin(newAngle)) ** 2);
      line._label.setPosition(r, 0);
    };

    return line;
  }

  makeSupplementaryAngle() {
    const arcLayout = this.layout.angle.arc;
    const arc = this.diagram.shapes.polygon(
      arcLayout.sides, arcLayout.radius, arcLayout.width * 2,
      0, 1, arcLayout.sides / 2, this.layout.colors.supplementary,
      new Transform().rotate(0).translate(0, 0),
    );
    arc.setPosition(this.layout.line1.opposite.position);
    return arc;
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

    // eqn.addForm('a_plus_d', ['a', 'plus', 'd', 'equals', '_180', 'deg']);
    // eqn.addForm('a_plus_d', ['a', 'plus', 'd', 'equals', 'pi'], 'rad');

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
    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
        equals: ' = ',
        minus: ' \u2212 ',
        _180: '180º',
        pi: 'π',
      },
      this.layout.colors.diagram.text.base,
    );

    eqn.formAlignment.fixTo = new Point(0, 0);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 0.7;


    eqn.setElem('a', this.layout.colors.angleA);
    eqn.setElem('b', this.layout.colors.angleB);
    eqn.setElem('c', this.layout.colors.angleC);
    eqn.setElem('d', this.layout.colors.angleD);

    eqn.addForm('a', ['a']);
    eqn.addForm('b', ['b']);
    eqn.addForm('b_equals', ['b', 'equals', '_180', 'minus', 'a'], 'deg');
    eqn.addForm('b_equals', ['b', 'equals', 'pi', 'minus', 'a'], 'rad');
    eqn.addForm('c', ['c']);
    eqn.addForm('d', ['d']);

    const arcLayout = this.layout.angle.arc;

    const color = this.layout.colors[`angle${name.toUpperCase()}`];
    const radius = name === 'a' || name === 'c'
      ? arcLayout.radius : arcLayout.radius * 1.0;
    const label = eqn.collection;
    const arc = this.diagram.shapes.polygon(
      arcLayout.sides, radius, arcLayout.width,
      0, 1, arcLayout.sides, color,
      new Transform(),
    );
    const angle = this.diagram.shapes.collection(new Transform()
      .scale(1, 1).rotate(0).translate(0, 0));
    angle.add('arc', arc);
    angle.add('label', label);
    angle.eqn = eqn;

    angle.updateAngle = (start: number, size: number) => {
      angle._arc.angleToDraw = size;
      angle.transform.updateRotation(start);
      angle._label.transform.updateRotation(-start);
      let labelWidth = 0;
      let labelHeight = 0;
      if (eqn.currentForm != null) {
        labelWidth = eqn.currentForm.width / 2 + 0.04;
        labelHeight = eqn.currentForm.height / 2 + 0.04;
      }
      const a = labelWidth + this.layout.angle.label.radius;
      const b = labelHeight + this.layout.angle.label.radius;
      const r = a * b / Math.sqrt((b * Math.cos(start + size / 2)) ** 2
        + (a * Math.sin(start + size / 2)) ** 2);
      const labelPosition = polarToRect(r, size / 2);
      angle._label.setPosition(labelPosition);
    };

    eqn.showForm = (form: string) => {
      Object.getPrototypeOf(eqn).showForm.call(eqn, form);
      // eqn.render();
      const start = angle.transform.r();
      const size = angle._arc.angleToDraw;
      if (start != null) {
        angle.updateAngle(start, size);
      }
    };
    eqn.showForm(name);

    angle.setPosition(this.layout.line1.opposite.position);
    return angle;
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform(),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;

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

    this.add('supplementary', this.makeSupplementaryAngle());

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
    // $FlowFixMe
    this.elements[`line${index}`]._end1.pulseScaleNow(1, 3);
    this.elements[`line${index}`]._end2.pulseScaleNow(1, 3);
    this.elements[`line${index}`]._mid.pulseScaleNow(1, 3);
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
    this._supplementary.stop();
    this._supplementary.stop();
    this._supplementary.show();
    this._supplementary.pulseScaleNow(2, 1.2, 0.25,
      () => {
        this._supplementary.disolveOut(2);
      });
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
