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

export default class OppositeCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _angleA: AngleType;
  _angleB: AngleType;
  _angleC: AngleType;
  _angleD: AngleType;

  makeLine() {
    const line = makeMoveableLine(this.diagram, this.layout);
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.updateOppositeAngles();
    };
    return line;
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
    eqn.setElem('c', this.layout.colors.angleA);
    eqn.setElem('d', this.layout.colors.angleB);

    eqn.addForm('a', ['a']);
    eqn.addForm('b', ['b']);
    eqn.addForm('c', ['c']);
    eqn.addForm('d', ['d']);

    eqn.showForm = (form: string) => {
      eqn.setCurrentForm(form);
      eqn.render();
    };
    eqn.showForm(name);

    const arcLayout = this.layout.angle.arc;

    const color = name === 'a' || name === 'c'
      ? this.layout.colors.angleA : this.layout.colors.angleB;
    const radius = name === 'a' || name === 'c'
      ? arcLayout.radius : arcLayout.radius * 0.9;
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
        labelWidth = eqn.currentForm.width / 2;
        labelHeight = eqn.currentForm.height * 0.4;
      }
      const equationRotation = eqn.collection.transform.r();
      // const equation
      if (equationRotation != null) {
        const labelPosition = polarToRect(
          this.layout.angle.label.radius
          + Math.max(
            Math.abs(labelWidth * Math.cos(start + size / 2)),
            labelHeight,
          ),
          size / 2,
        );
        angle._label.setPosition(labelPosition);
      }
    };
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

    this.add('line1', this.makeLine());
    this._line1.setPosition(this.layout.line1.opposite.position.x, 0);
    this.add('line2', this.makeLine());
    this._line2.setPosition(this.layout.line2.opposite.position.x, 0);
    this.add('angleA', this.makeAngle('a'));
    this.add('angleB', this.makeAngle('b'));
    this.add('angleC', this.makeAngle('c'));
    this.add('angleD', this.makeAngle('d'));

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
            this._angleB.updateAngle(r2, Math.PI - minAngle);
            this._angleC.updateAngle(r1 + Math.PI, minAngle);
            this._angleD.updateAngle(r2 + Math.PI, Math.PI - minAngle);
          } else {
            this._angleA.updateAngle(r1, Math.PI - Math.abs(minAngle));
            this._angleB.updateAngle(r2, Math.abs(minAngle));
            this._angleC.updateAngle(r1 + Math.PI, Math.PI - Math.abs(minAngle));
            this._angleD.updateAngle(r2 + Math.PI, Math.abs(minAngle));
          }
          this._angleA.setPosition(this._line1.transform.t() || new Point(0, 0));
          this._angleB.setPosition(this._line1.transform.t() || new Point(0, 0));
          this._angleC.setPosition(this._line1.transform.t() || new Point(0, 0));
          this._angleD.setPosition(this._line1.transform.t() || new Point(0, 0));
        }
      }
    }
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
