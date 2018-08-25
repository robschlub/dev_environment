// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType, angleAnnotationType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

type TypeAnglePairName = 'adjacent' | 'complementary' | 'supplementary' | 'explementary';

type TypeEquationForm = 'add' | 'a' | 'b';

type TypeUnit = 'deg' | 'rad';

type TypeEquationElements = {
  _a: DiagramElementPrimative;
  _b: DiagramElementPrimative;
  _pi: DiagramElementPrimative;
  __2: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _plus: DiagramElementPrimative;
  _minus: DiagramElementPrimative;
  __90: DiagramElementPrimative;
  __180: DiagramElementPrimative;
  __360: DiagramElementPrimative;
  _deg: DiagramElementPrimative;
  _v: DiagramElementPrimative;
} & DiagramElementCollection;

type TypeMainTextEquation = {
  collection: TypeEquationElements;
  showEqn: (TypeAnglePairName, ?TypeEquationForm) => void;
  onclickEqn: (TypeEquationForm) => void;
  getForm: (TypeAnglePairName, string, TypeUnit | null) => Equation;
  showCurrentForm: () => void;
  _dup: () => TypeMainTextEquation;
} & Equation;

type TypeAnglePairNameAnnotationEquation = {
  showCurrentForm: () => void;
} & TypeMainTextEquation;

type TypeAnglePairNameAnnotation = {
  eqn: TypeAnglePairNameAnnotationEquation;
  _equation: TypeEquationElements;
} & angleAnnotationType;

type TypeRightAngle = {
  _horizontal: DiagramElementPrimative;
  _vertical: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeCircleCollectionExtended = {
  _startLine: DiagramElementPrimative;
  _endLine: DiagramElementPrimative;
  _angleA: TypeAnglePairNameAnnotation;
  _angleB: TypeAnglePairNameAnnotation;
  _rightAngle: TypeRightAngle;
  _straightAngle: DiagramElementPrimative;
  _fullAngle: DiagramElementPrimative;
} & circleType;

type TypeVarStateExtended = {
    angleSelected: TypeAnglePairName;
    equationForm: TypeEquationForm;
  } & varStateType;


export type AdjacentAnglesCollectionType = {
  _circle: TypeCircleCollectionExtended;
  varState: TypeVarStateExtended;
  anglePairNames: Array<string>;
  eqn: TypeMainTextEquation;
};

class AdjacentAnglesCollection extends AngleCircle {
  _circle: TypeCircleCollectionExtended;
  varState: TypeVarStateExtended;
  anglePairNames: Array<string>;
  eqn: TypeMainTextEquation;

  makeMoveableLine(): DiagramElementPrimative {
    const line = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth,
      this.colors.outsideLines, new Transform().rotate(0).translate(
        0,
        0,
      ),
    );
    line.isTouchable = true;
    line.isMovable = true;
    line.pulse.transformMethod = s => new Transform().scale(1, s);

    for (let i = 0; i < line.vertices.border[0].length; i += 1) {
      line.vertices.border[0][i].y *= 10;
    }
    return line;
  }

  makeStraightAngle(): DiagramElementPrimative {
    const layout = this.layout.angleAnnotation;
    return this.shapes.polygon(
      layout.arc.sides, layout.arc.radius * 1.0, layout.arc.lineWidth, 0, 1,
      layout.arc.sides / 2, this.colors.angle,
      new Transform(),
    );
  }

  makeFullAngle(): DiagramElementPrimative {
    const layout = this.layout.angleAnnotation;
    return this.shapes.polygon(
      layout.arc.sides, layout.arc.radius * 1.0, layout.arc.lineWidth, 0, 1,
      layout.arc.sides, this.colors.angle,
      new Transform(),
    );
  }

  makeRightAngle(): TypeRightAngle {
    const rad = this.layout.angleAnnotation.arc.radius;
    const rightAngle = this.shapes.collection();
    rightAngle.add('vertical', this.makeLine(
      new Point(0, 0), rad - this.layout.linewidth, this.layout.linewidth,
      this.colors.angle, new Transform()
        .rotate(Math.PI / 2)
        .translate(rad, this.layout.linewidth / 2),
    ));
    rightAngle.add('horizontal', this.makeLine(
      new Point(0, 0), rad, this.layout.linewidth,
      this.colors.angle, new Transform()
        .translate(this.layout.linewidth / 2, rad),
    ));
    return rightAngle;
  }

  makeMainTextEquation(): TypeMainTextEquation {
    const equation = this.diagram.equation.makeEqn();
    equation.createElements(
      {
        a: 'a',
        b: 'b',
        pi: 'π',
        _2: '2',
        equals: '  =  ',
        plus: ' + ',
        minus: ' \u2212 ',
        _90: '90º',
        _180: '180º',
        _360: '360º',
        v: this.diagram.equation.vinculum(this.colors.diagram.text.base),
      },
      this.colors.diagram.text.base,
    );

    equation.setPosition(this.layout.equationPosition);

    equation.setElem('a', this.colors.angleA, true, 'up', 0.65);
    equation.setElem('b', this.colors.angleB, true, 'up', 0.85);
    equation.setElem('pi', null, true, 'down', 1);
    equation.setElem('v', null, true, 'down', 1);
    equation.setElem('_2', null, true, 'down', 1);
    equation.setElem('_90', null, true, 'down', 0.7);
    equation.setElem('_180', null, true, 'down', 0.7);
    equation.setElem('_360', null, true, 'down', 0.7);

    const e = equation;
    e.formAlignment.fixTo = equation.collection._equals;
    e.addForm('comAddDeg', ['_90', 'equals', 'a', 'plus', 'b']);
    e.addForm('comAddRad', [e.frac('pi', '_2', 'v'), 'equals', 'a', 'plus', 'b']);
    e.addForm('comADeg', ['a', 'equals', '_90', 'minus', 'b']);
    e.addForm('comARad', ['a', 'equals', e.frac('pi', '_2', 'v'), 'minus', 'b']);
    e.addForm('comBDeg', ['b', 'equals', '_90', 'minus', 'a']);
    e.addForm('comBRad', ['b', 'equals', e.frac('pi', '_2', 'v'), 'minus', 'a']);

    e.addForm('supAddDeg', ['_180', 'equals', 'a', 'plus', 'b']);
    e.addForm('supAddRad', ['pi', 'equals', 'a', 'plus', 'b']);
    e.addForm('supADeg', ['a', 'equals', '_180', 'minus', 'b']);
    e.addForm('supARad', ['a', 'equals', 'pi', 'minus', 'b']);
    e.addForm('supBDeg', ['b', 'equals', '_180', 'minus', 'a']);
    e.addForm('supBRad', ['b', 'equals', 'pi', 'minus', 'a']);

    e.addForm('expAddDeg', ['_360', 'equals', 'a', 'plus', 'b']);
    e.addForm('expAddRad', ['_2', 'pi', 'equals', 'a', 'plus', 'b']);
    e.addForm('expADeg', ['a', 'equals', '_360', 'minus', 'b']);
    e.addForm('expARad', ['a', 'equals', '_2', 'pi', 'minus', 'b']);
    e.addForm('expBDeg', ['b', 'equals', '_360', 'minus', 'a']);
    e.addForm('expBRad', ['b', 'equals', '_2', 'pi', 'minus', 'a']);

    const { collection } = equation;
    // equation.showCurrentForm = () => {};

    // Get an equation form string (as defined above with `addForm` methods)
    // based on input angle pair name, equation form units.
    // eslint-disable-next-line max-len
    equation.getForm = (inputAnglePairName: TypeAnglePairName = this.varState.angleSelected, inputForm: string = this.varState.equationForm, inputUnits: TypeUnit | null = null) => {
      const anglePairName = inputAnglePairName.slice(0, 3);
      const formString = inputForm;
      const eqnForm = `${formString.charAt(0).toUpperCase()}${formString.slice(1)}`;
      let unitsString = inputUnits;
      if (unitsString == null) {
        unitsString = this.getUnits();
      }
      const units = `${unitsString.charAt(0).toUpperCase()}${unitsString.slice(1)}`;

      return equation.form[`${anglePairName}${eqnForm}${units}`].base;
    };

    // Show equation with input angle pair name and form using current units.
    equation.showEqn = (anglePairName: TypeAnglePairName, form: TypeEquationForm = 'add') => {
      if (anglePairName === 'adjacent') {
        collection.hideAll();
        return;
      }
      const eqnForm = equation.getForm(anglePairName, form);
      eqnForm.showHide();
      eqnForm.setPositions();
      this.varState.equationForm = form;
    };

    const onclickEqn = (form: TypeEquationForm) => {
      equation.getForm(this.varState.angleSelected, form)
        .animateTo(1, 2, collection._equals);
      this.varState.equationForm = form;
      if (form === 'a') {
        this._circle._angleA._arc.pulseScaleNow(1, 1.5);
      }
      if (form === 'b') {
        this._circle._angleB._arc.pulseScaleNow(1, 1.5);
      }
      this.updateAngleAnnotationEquations();
      this.diagram.animateNextFrame();
    };

    collection._a.onClick = onclickEqn.bind(this, 'a');
    collection._b.onClick = onclickEqn.bind(this, 'b');
    collection._pi.onClick = onclickEqn.bind(this, 'add');
    collection.__90.onClick = onclickEqn.bind(this, 'add');
    collection.__180.onClick = onclickEqn.bind(this, 'add');
    collection.__360.onClick = onclickEqn.bind(this, 'add');
    collection.__2.onClick = onclickEqn.bind(this, 'add');
    collection._v.onClick = onclickEqn.bind(this, 'add');
    return equation;
  }

  makeAngle(name: 'a' | 'b', color: Array<number>) {
    const equation = this.eqn._dup();
    const otherName = name === 'a' ? 'b' : 'a';

    equation.formAlignment.fixTo = new Point(0, 0);
    equation.formAlignment.hAlign = 'center';
    equation.formAlignment.vAlign = 'middle';
    equation.formAlignment.scale = 0.7;
    equation.form = {};
    equation.addForm(name, [name]);
    const e = equation;
    equation.formAlignment.scale = 0.5;
    const N = name.toUpperCase();
    e.addForm(`com${N}Deg`, [name, 'equals', '_90', 'minus', otherName]);
    e.addForm(`com${N}Rad`, [name, 'equals', e.sfrac('pi', '_2', 'v', 0.8), 'minus', otherName]);
    e.addForm(`sup${N}Deg`, [name, 'equals', '_180', 'minus', otherName]);
    e.addForm(`sup${N}Rad`, [name, 'equals', 'pi', 'minus', otherName]);
    e.addForm(`exp${N}Deg`, [name, 'equals', '_360', 'minus', otherName]);
    e.addForm(`exp${N}Rad`, [name, 'equals', '_2', 'pi', 'minus', otherName]);
    equation.collection.hasTouchableElements = false;

    equation.showCurrentForm = () => {
      let eqnForm = equation.form[name].base;
      const currentAngle = this.varState.angleSelected;
      const currentForm = this.varState.equationForm;
      const currentUnits = this.getUnits();
      if (currentAngle !== 'adjacent') {
        if (currentForm === name) {
          const angleString = currentAngle.slice(0, 3);
          const formString = N;
          const unitString = `${currentUnits.charAt(0).toUpperCase()}${currentUnits.slice(1)}`;
          eqnForm = equation.form[`${angleString}${formString}${unitString}`];
        }
      }
      equation.showForm(eqnForm);
      // equation.setCurrentForm(eqnForm);
      // equation.render();
    };

    const layout = this.layout.angleAnnotation;
    layout.label.radiusOffset = -0.15;
    layout.arc.radius = 0.7;
    const angleA = this.makeAngleAnnotation(
      0,
      Math.PI / 6,
      '',
      color,
      layout,
    );
    angleA.eqn = equation;
    equation.setPosition(angleA._label.transform.t().scale(1.8));
    angleA.add('equation', equation.collection);

    angleA.updateAngle = (angle: number) => {
      angleA._arc.angleToDraw = angle;

      let labelWidth = 0;
      let labelHeight = 0;
      if (equation.currentForm != null) {
        labelWidth = equation.currentForm.width / 2;
        labelHeight = equation.currentForm.height * 0.4;
      }
      const equationRotation = equation.collection.transform.r();
      if (equationRotation != null) {
        const labelPosition = polarToRect(
          layout.arc.radius
          + Math.max(
            Math.abs(labelWidth * Math.cos(equationRotation - angle / 2)),
            labelHeight,
          ) - layout.label.radiusOffset / 3,
          angle / 2,
        );
        angleA._equation.setPosition(labelPosition);
      }

      if (angle < layout.label.hideAngle) {
        angleA._label.hideAll();
      } else {
        angleA._label.showAll();
      }
    };
    return angleA;
  }

  getUnits() {
    if (this.varState.radialLines === 360) {
      return 'deg';
    }
    return 'rad';
  }

  getEquationForm(): TypeEquationForm {
    return this.varState.equationForm;
  }

  addToCircle() {
    this._circle.add('startLine', this.makeMoveableLine());
    this._circle.add('endLine', this.makeMoveableLine());
    this._circle.add('rightAngle', this.makeRightAngle());
    this._circle.add('straightAngle', this.makeStraightAngle());
    this._circle.add('fullAngle', this.makeFullAngle());
    this._circle.add('angleA', this.makeAngle('a', this.colors.angleA));
    this._circle.add('angleB', this.makeAngle('b', this.colors.angleB));

    this._circle._endLine.setTransformCallback = this.updateEndLineRotation.bind(this);
    this._circle.setTransformCallback = this.updateCircleRotation.bind(this);
    this._circle.order = [
      ...this._circle.order.slice(-2),
      ...this._circle.order.slice(0, -2),
    ];
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      rotation: 0,
      angleSelected: 'adjacent',
      equationForm: 'add',
    };
    // this.enableAutoChange = true;
    this.eqn = this.makeMainTextEquation();
    this.add('eqn', this.eqn.collection);
    this.addToCircle();
    this.anglePairNames = ['adjacent', 'complementary', 'supplementary', 'explementary'];
  }

  toggleUnits(toUnit: TypeUnit | null) {
    const elemDeg = document.getElementById('id_degrees');
    const elemRad = document.getElementById('id_radians');
    let unit = toUnit;
    if (toUnit === null) {
      if (this.varState.radialLines === 360) {
        unit = 'rad';
      } else {
        unit = 'deg';
      }
    }
    if (elemDeg != null && elemRad != null) {
      if (unit === 'rad') {
        this.varState.radialLines = 2 * Math.PI;
        elemDeg.classList.remove('lesson__adjacent_angles_unit_selected');
        elemRad.classList.add('lesson__adjacent_angles_unit_selected');
        // this.setParagraphUnits('rad');
      } else if (unit === 'deg') {
        this.varState.radialLines = 360;
        elemRad.classList.remove('lesson__adjacent_angles_unit_selected');
        elemDeg.classList.add('lesson__adjacent_angles_unit_selected');
        // this.setParagraphUnits('deg');
      }
    }
    this.eqn.collection.stop();
    this.eqn.showEqn(this.varState.angleSelected, this.varState.equationForm);
    // this._circle._angleA.eqn.showCurrentForm();
    // this._circle._angleB.eqn.showCurrentForm();
    this.updateAngleAnnotationEquations();
    this.diagram.animateNextFrame();
  }

  updateAngleAnnotationEquations() {
    this._circle._angleA.eqn.showCurrentForm();
    this._circle._angleB.eqn.showCurrentForm();

    this._circle._angleA.updateAngle(this.varState.rotation);
    const endLineRotation = this._circle._endLine.transform.r();
    if (endLineRotation != null) {
      this._circle._angleB.updateAngle(endLineRotation
        - this.varState.rotation);
      this._circle._angleB.transform.updateRotation(this.varState.rotation);
    }
    this.rotateAngleLabelsToUpright();
  }

  updateCircleRotation() {
    const r = this._circle.transform.r();
    if (r != null) {
      if (r > Math.PI * 2) {
        this._circle.transform.updateRotation(r - Math.PI * 2);
      }
      if (r < 0) {
        this._circle.transform.updateRotation(r + Math.PI * 2);
      }
    }
    this.updateAngleAnnotationEquations();
  }

  updateAngleBRotation() {
    this.updateAngleAnnotationEquations();
  }

  rotateAngleLabelsToUpright() {
    const circleRotation = this._circle.transform.r();
    if (circleRotation != null) {
      this._circle._angleB._equation
        .transform.updateRotation(-this.varState.rotation - circleRotation);
      this._circle._angleA._equation
        .transform.updateRotation(-circleRotation);
    }
  }

  updateRotation() {
    super.updateRotation();
    this._circle._angleA.updateAngle(this.varState.rotation);
    const endLineRotation = this._circle._endLine.transform.r();
    if (endLineRotation != null) {
      this._circle._angleB.updateAngle(endLineRotation - this.varState.rotation);
    }

    this.updateAngleBRotation();
  }

  updateEndLineRotation() {
    let r = this._circle._endLine.transform.r();
    const radiusRot = this._circle._radius.transform.r();
    if (r != null && radiusRot != null) {
      if (r < 0) {
        r = 0;
      }
      if (r > Math.PI * 2) {
        r = Math.PI * 2;
      }
      this.rotationLimits = { min: 0, max: r };
      this._circle._endLine.transform.updateRotation(r);
      if (r < radiusRot) {
        this.setRotation(r);
      } else {
        this.updateAngleBRotation();
      }
    }
  }

  stopRightAngle() {
    this._circle._rightAngle.stop();
    this._circle._rightAngle.stop();
  }

  stopStraightAngle() {
    this._circle._straightAngle.stop();
    this._circle._straightAngle.stop();
  }

  stopFullAngle() {
    this._circle._fullAngle.stop();
    this._circle._fullAngle.stop();
  }

  pulseRightAngle() {
    this._circle._endLine.stop();
    this._circle._endLine.transform.updateRotation(Math.PI / 2);
    this.updateEndLineRotation();
    this._circle._rightAngle.stop();
    this._circle._rightAngle.showAll();
    this._circle._rightAngle.pulseScaleNow(
      2, 1.5, 0.25,
      () => {
        this._circle._rightAngle.disolveElementsOut(2);
      },
    );
    this.diagram.animateNextFrame();
  }

  pulseStraightAngle() {
    this._circle._endLine.stop();
    this._circle._endLine.transform.updateRotation(Math.PI);
    this.updateEndLineRotation();
    this._circle._straightAngle.stop();
    this._circle._straightAngle.show();
    this._circle._straightAngle.pulseScaleNow(
      2, 1.5, 0.25,
      () => {
        this._circle._straightAngle.disolveOut(2);
      },
    );
    this.diagram.animateNextFrame();
  }

  pulseFullAngle() {
    this._circle._endLine.stop();
    this._circle._endLine.transform.updateRotation(Math.PI * 2);
    this.updateEndLineRotation();
    this._circle._fullAngle.stop();
    this._circle._fullAngle.show();
    this._circle._fullAngle.pulseScaleNow(
      2, 1.5, 0.25,
      () => {
        this._circle._fullAngle.disolveOut(2);
      },
    );
    this.diagram.animateNextFrame();
  }

  updateNumSectionsText() {
    super.updateNumSectionsText();
    this.showAnglePairName(this.varState.angleSelected);
  }

  selectAnglePair(anglePairName: TypeAnglePairName) {
    let elem;
    if (anglePairName !== this.varState.angleSelected) {
      elem = document.getElementById(`id_${this.varState.angleSelected}`);
      if (elem != null) {
        elem.classList.remove('lesson__adjacent_angles_table_selected');
      }
    }
    elem = document.getElementById(`id_${anglePairName}`);
    if (elem != null) {
      elem.classList.add('lesson__adjacent_angles_table_selected');
    }
    this.varState.angleSelected = anglePairName;
  }

  showAnglePairName(anglePairName: TypeAnglePairName) {
    this.selectAnglePair(anglePairName);
    this.showText(anglePairName);
  }

  // eslint-disable-next-line class-methods-use-this
  showText(anglePairName: TypeAnglePairName) {
    const ids = [
      'id_adjacent_text',
      'id_complementary_text',
      'id_supplementary_text',
      'id_explementary_text',
    ];
    ids.forEach((id) => {
      if (id !== anglePairName) {
        const elem = document.getElementById(id);
        if (elem != null) {
          elem.classList.add('lesson__adjacent_angles_text_hide');
        }
      }
    });
    const elem = document.getElementById(`id_${anglePairName}_text`);
    if (elem != null) {
      elem.classList.remove('lesson__adjacent_angles_text_hide');
    }
  }

  setEndLineRotation(angle: number) {
    this._circle._endLine.transform.updateRotation(angle);
    this.updateEndLineRotation();
  }

  setUntouchable() {
    this._circle._endLine.isTouchable = false;
    this._circle._startLine.isTouchable = false;
    this._circle._radius.isTouchable = false;
  }

  setTouchable() {
    this._circle._endLine.isTouchable = true;
    this._circle._startLine.isTouchable = true;
    this._circle._radius.isTouchable = true;
  }

  goToRandomAdjancentAngle() {
    this._circle._rightAngle.stop();
    this._circle._straightAngle.stop();
    const angle = Math.random() * Math.PI + 0.5 * Math.PI;
    const divider = Math.random() * 0.6 + 0.3;
    this.rotateElementTo(this._circle._endLine, angle);
    this.rotateElementTo(this._circle._radius, angle * divider, this.setTouchable.bind(this));
    this.diagram.animateNextFrame();
  }

  goToRandomAngle(maxAngle: number = Math.PI * 2) {
    let angle = (Math.random() * maxAngle / 4 + maxAngle / 4) * 0.8;
    const r = this._circle._radius.transform.r();
    if (r != null) {
      if (r < maxAngle / 2) {
        angle += r;
      } else {
        angle = r - angle;
      }
    }
    this.rotateElementTo(this._circle._radius, angle, () => {}, 2, 6, true);
  }

  // eslint-disable-next-line class-methods-use-this
  hideUnitSelection() {
    const element = document.getElementById('id_unit_selection');
    if (element != null) {
      element.classList.add('lesson__adjacent_angles_unit_selection_hide');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showUnitSelection() {
    const element = document.getElementById('id_unit_selection');
    if (element != null) {
      element.classList.remove('lesson__adjacent_angles_unit_selection_hide');
    }
  }

  goToAdjacent() {
    this.hideUnitSelection();
    this.stopRightAngle();
    this.stopFullAngle();
    this.stopStraightAngle();
    this.showAnglePairName('adjacent');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 3);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('adjacent');
    this._circle._angleA.eqn.showCurrentForm();
    this._circle._angleB.eqn.showCurrentForm();
    this.diagram.animateNextFrame();
  }

  goToComplementary() {
    this.showUnitSelection();
    this.stopStraightAngle();
    this.stopFullAngle();
    this.showAnglePairName('complementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('complementary', 'add');
    this._circle._angleA.eqn.showCurrentForm();
    this._circle._angleB.eqn.showCurrentForm();
    this.diagram.animateNextFrame();
  }

  goToSupplementary() {
    this.showUnitSelection();
    this.stopRightAngle();
    this.stopFullAngle();
    this.showAnglePairName('supplementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('supplementary', 'add');
    this._circle._angleA.eqn.showCurrentForm();
    this._circle._angleB.eqn.showCurrentForm();
    this.diagram.animateNextFrame();
  }

  goToExplementary() {
    this.showUnitSelection();
    this.stopRightAngle();
    this.stopStraightAngle();
    this.showAnglePairName('explementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI * 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('explementary', 'add');
    this._circle._angleA.eqn.showCurrentForm();
    this._circle._angleB.eqn.showCurrentForm();
    this.diagram.animateNextFrame();
  }

  rotateElementTo(
    element: DiagramElementPrimative | DiagramElementCollection,
    angle: number,
    callback: () => void = () => {},
    direction: number = 2,
    time: number = 2,
    normalizeTime: boolean = false,
  ) {
    let t = time;
    let d = 1;
    d = direction;
    const r = element.transform.r();
    let delta = 0;
    if (r) {
      delta = minAngleDiff(angle, r);
    }
    if (delta === 0) {
      callback();
      return;
    }

    if (d === 0) {
      d = 1;
      if (delta !== 0) {
        d = delta / Math.abs(delta);
      }
    }

    if (normalizeTime && delta !== 0) {
      t = time * Math.abs(delta) / 2 / Math.PI;
    }

    element.animateRotationTo(angle, d, t, callback);
    this.diagram.animateNextFrame();
  }
}

export default AdjacentAnglesCollection;
