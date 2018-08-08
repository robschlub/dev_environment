// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType, angleAnnotationType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';
import type { EquationType } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

// type rightAngleType = {
//   _horizontal: DiagramElementPrimative;
//   _vertical: DiagramElementPrimative;
// } & DiagramElementCollection;

export type extendedCircleType = {
  _startLine: DiagramElementPrimative;
  _endLine: DiagramElementPrimative;
  _angleA: angleAnnotationType;
  _angleB: angleAnnotationType;
  _rightAngle: {
    _horizontal: DiagramElementPrimative;
    _vertical: DiagramElementPrimative;
  } & DiagramElementCollection;
  _straightAngle: DiagramElementPrimative;
  _fullAngle: DiagramElementPrimative;
} & circleType;

type angleTypes = 'adjacent' | 'complementary' | 'supplementary' | 'explementary';

type equationFormType = 'add' | 'a' | 'b';

type varStateExtendedType = {
    angleSelected: angleTypes;
    equationForm: equationFormType;
  } & varStateType;

type equationElementsType = {
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

type anglesEquationType = {
  collection: equationElementsType;
  showEqn: (angleTypes, ?equationFormType) => void;
  onclickEqn: (equationFormType) => void;
  getForm: (angleTypes, string, 'deg' | 'rad' | null) => EquationType;
} & EquationType;

export type AdjacentAnglesCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  angleTypes: Array<string>;
  eqn: anglesEquationType;
};

class AdjacentAnglesCollection extends AngleCircle {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  angleTypes: Array<string>;
  eqn: anglesEquationType;

  makeMoveableLine() {
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


  makeAngleA() {
    const equation = this.eqn._dup();

    equation.formAlignment.fixTo = new Point(0, 0);
    equation.formAlignment.hAlign = 'center';
    equation.formAlignment.vAlign = 'middle';
    equation.formAlignment.scale = 0.5;
    equation.form = {};
    equation.addForm('a', ['a']);
    const e = equation;
    e.addForm('comADeg', ['_90', 'minus', 'b']);
    e.addForm('comARad', ['a', 'equals', e.frac('pi', '_2', 'v'), 'minus', 'b']);
    e.addForm('supADeg', ['a', 'equals', '_180', 'minus', 'b']);
    e.addForm('supARad', ['a', 'equals', 'pi', 'minus', 'b']);
    e.addForm('expADeg', ['a', 'equals', '_360', 'minus', 'b']);
    e.addForm('expARad', ['a', 'equals', '_2', 'pi', 'minus', 'b']);
    equation.collection.hasTouchableElements = false;
    // console.log(equation.collection._minus.vertices.text[0])
    equation.showCurrentForm = () => {
      let eqnForm = equation.form['a'];
      const currentAngle = this.varState.angleSelected;
      const currentForm = this.varState.equationForm;
      const currentUnits = this.getUnits();
      if (currentAngle !== 'adjacent') {
        if (currentForm === 'a') {
          const angleString = currentAngle.slice(0, 3);
          const formString = 'A';
          const unitString = `${currentUnits.charAt(0).toUpperCase()}${currentUnits.slice(1)}`;
          eqnForm = equation.form[`${angleString}${formString}${unitString}`];
        }
      }
      eqnForm.showHide();
      eqnForm.setPositions();
    };

    const layout = this.layout.angleAnnotation;
    layout.label.radiusOffset = 0.15;
    const angleA = this.makeAngleAnnotation(
      0,
      Math.PI / 6,
      equation.collection,
      this.colors.angleA,
      layout,
    );
    angleA.eqn = equation;
    // angleA.add('temp', equation.collection);
    // angleA._temp.show();
    return angleA;
  }

  makeAngleB() {
    return this.makeAngleAnnotation(
      0,
      Math.PI / 6,
      'b',
      this.colors.angleB,
    );
  }

  makeStraightAngle() {
    const layout = this.layout.angleAnnotation;
    return this.shapes.polygon(
      layout.arc.sides, layout.arc.radius * 1.0, layout.arc.lineWidth, 0, 1,
      layout.arc.sides / 2, this.colors.angle,
      new Transform(),
    );
  }

  makeFullAngle() {
    const layout = this.layout.angleAnnotation;
    return this.shapes.polygon(
      layout.arc.sides, layout.arc.radius * 1.0, layout.arc.lineWidth, 0, 1,
      layout.arc.sides, this.colors.angle,
      new Transform(),
    );
  }

  makeRightAngle() {
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

  makeAnglesEquation() {
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
    // e.addForm('a', ['a']);
    // e.addForm('aa', ['a']);

    const { collection } = equation;

    equation.getForm = (inputAngleType: angleTypes = this.varState.angleSelected, inputForm: string = this.varState.equationForm, inputUnits: 'deg' | 'rad' | null = null) => {
      const angleType = inputAngleType.slice(0, 3);
      const formString = inputForm;
      const eqnForm = `${formString.charAt(0).toUpperCase()}${formString.slice(1)}`;
      let unitsString = inputUnits;
      if (unitsString == null) {
        unitsString = this.getUnits();
      }
      const units = `${unitsString.charAt(0).toUpperCase()}${unitsString.slice(1)}`;

      return equation.form[`${angleType}${eqnForm}${units}`];
    };

    equation.showEqn = (angleType: angleTypes, form: equationFormType = 'add') => {
      if (angleType === 'adjacent') {
        collection.hideAll();
        return;
      }
      const eqnForm = equation.getForm(angleType, form);
      eqnForm.showHide();
      eqnForm.setPositions();
      this.varState.equationForm = form;
    };

    const onclickEqn = (form: equationFormType) => {
      equation.getForm(this.varState.angleSelected, form)
        .animateTo(1, 2, collection._equals);
      this.varState.equationForm = form;
      if (form === 'a') {
        this._circle._angleA.pulseScaleNow(1, 1.5);
      }
      if (form === 'b') {
        this._circle._angleB.pulseScaleNow(1, 1.5);
      }
      this._circle._angleA.eqn.showCurrentForm();
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

  getUnits() {
    if (this.varState.radialLines === 360) {
      return 'deg';
    }
    return 'rad';
  }

  getAngleType(): angleTypes {
    return this.varState.angleSelected;
  }

  getEquationForm(): equationFormType {
    return this.varState.equationForm;
  }

  addToCircle() {
    this._circle.add('startLine', this.makeMoveableLine());
    this._circle.add('endLine', this.makeMoveableLine());
    this._circle.add('rightAngle', this.makeRightAngle());
    this._circle.add('straightAngle', this.makeStraightAngle());
    this._circle.add('fullAngle', this.makeFullAngle());
    this._circle.add('angleA', this.makeAngleA());
    this._circle.add('angleB', this.makeAngleB());

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
    this.eqn = this.makeAnglesEquation();
    this.add('eqn', this.eqn.collection);
    this.addToCircle();
    this.angleTypes = ['adjacent', 'complementary', 'supplementary', 'explementary'];
  }

  toggleUnits(toUnit: 'rad' | 'deg' | null) {
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
        elemDeg.classList.remove('lesson__important_angles_unit_selected');
        elemRad.classList.add('lesson__important_angles_unit_selected');
        // this.setParagraphUnits('rad');
      } else if (unit === 'deg') {
        this.varState.radialLines = 360;
        elemRad.classList.remove('lesson__important_angles_unit_selected');
        elemDeg.classList.add('lesson__important_angles_unit_selected');
        // this.setParagraphUnits('deg');
      }
    }
    this.eqn.collection.stop();
    this.eqn.showEqn(this.varState.angleSelected, this.varState.equationForm);
    this._circle._angleA.eqn.showCurrentForm();
    // this._circle._angleA.showEqn();
    this.diagram.animateNextFrame();
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
    this.rotateAngleLabelsToUpright();
  }

  updateAngleBRotation() {
    const endLineRotation = this._circle._endLine.transform.r();
    if (endLineRotation != null) {
      this._circle._angleB.updateAngle(endLineRotation - this.varState.rotation);
      this._circle._angleB.transform.updateRotation(this.varState.rotation);
      this.rotateAngleLabelsToUpright();
    }
  }

  rotateAngleLabelsToUpright() {
    const circleRotation = this._circle.transform.r();
    if (circleRotation != null) {
      this._circle._angleB._label.transform
        .updateRotation(-this.varState.rotation - circleRotation);
      this._circle._angleA._label.transform.updateRotation(-circleRotation);
    }
  }

  updateRotation() {
    super.updateRotation();
    this._circle._angleA.updateAngle(this.varState.rotation);
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

  // setParagraphUnits(onUnit: 'rad' | 'deg') {
  //   this.angleTypes.forEach((angleType) => {
  //     const offUnit = onUnit === 'rad' ? 'deg' : 'rad';
  //     const elemOn1 = document.getElementById(`id_${angleType}_${onUnit}1`);
  //     const elemOn2 = document.getElementById(`id_${angleType}_${onUnit}2`);
  //     const elemOn3 = document.getElementById(`id_${angleType}_${onUnit}3`);
  //     const elemOff1 = document.getElementById(`id_${angleType}_${offUnit}1`);
  //     const elemOff2 = document.getElementById(`id_${angleType}_${offUnit}2`);
  //     const elemOff3 = document.getElementById(`id_${angleType}_${offUnit}3`);
  //     if (elemOn1 != null) {
  //       elemOn1.classList.remove('lesson__important_angles_text_hide');
  //     }
  //     if (elemOn2 != null) {
  //       elemOn2.classList.remove('lesson__important_angles_text_hide');
  //     }
  //     if (elemOn3 != null) {
  //       elemOn3.classList.remove('lesson__important_angles_text_hide');
  //     }
  //     if (elemOff1 != null) {
  //       elemOff1.classList.add('lesson__important_angles_text_hide');
  //     }
  //     if (elemOff2 != null) {
  //       elemOff2.classList.add('lesson__important_angles_text_hide');
  //     }
  //     if (elemOff3 != null) {
  //       elemOff3.classList.add('lesson__important_angles_text_hide');
  //     }
  //   });
  // }

  updateNumSectionsText() {
    super.updateNumSectionsText();
    this.showAngleType(this.varState.angleSelected);
  }

  selectAngle(angleType: angleTypes) {
    let elem;
    if (angleType !== this.varState.angleSelected) {
      elem = document.getElementById(`id_${this.varState.angleSelected}`);
      if (elem != null) {
        elem.classList.remove('lesson__important_angles_table_selected');
      }
    }
    elem = document.getElementById(`id_${angleType}`);
    if (elem != null) {
      elem.classList.add('lesson__important_angles_table_selected');
    }
    this.varState.angleSelected = angleType;
  }

  showAngleType(angleType: angleTypes) {
    this.selectAngle(angleType);
    this.showText(angleType);
    // if (angleType !== 'adjacent') {
    //   // this._circle._acuteRange.hide();
    // }
    // if (angleType !== 'complementary') {
    //   // this._circle._obtuseRange.hide();
    // }
    // if (angleType !== 'supplementary') {
    //   // this._circle._reflexRange.hide();
    // }
    // if (angleType === 'explementary') {
    //   // this._circle._acuteRange.show();
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  showText(angleType: angleTypes) {
    const ids = [
      'id_adjacent_text',
      'id_complementary_text',
      'id_supplementary_text',
      'id_explementary_text',
    ];
    ids.forEach((id) => {
      if (id !== angleType) {
        const elem = document.getElementById(id);
        if (elem != null) {
          elem.classList.add('lesson__important_angles_text_hide');
        }
      }
    });
    const elem = document.getElementById(`id_${angleType}_text`);
    if (elem != null) {
      elem.classList.remove('lesson__important_angles_text_hide');
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

  goToAdjacent() {
    this.stopRightAngle();
    this.stopFullAngle();
    this.stopStraightAngle();
    this.showAngleType('adjacent');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 3);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('adjacent');
    this.diagram.animateNextFrame();
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

  goToComplementary() {
    this.stopStraightAngle();
    this.stopFullAngle();
    this.showAngleType('complementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('complementary', 'add');
    this.diagram.animateNextFrame();
  }

  goToSupplementary() {
    this.stopRightAngle();
    this.stopFullAngle();
    this.showAngleType('supplementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('supplementary', 'add');
    this.diagram.animateNextFrame();
  }

  goToExplementary() {
    this.stopRightAngle();
    this.stopStraightAngle();
    this.showAngleType('explementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI * 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.eqn.showEqn('explementary', 'add');
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
