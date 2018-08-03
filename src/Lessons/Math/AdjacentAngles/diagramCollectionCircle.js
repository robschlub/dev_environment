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


export type AdjacentAnglesCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  angleTypes: Array<string>;
};

class AdjacentAnglesCollection extends AngleCircle {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  angleTypes: Array<string>;

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
    return this.makeAngleAnnotation(
      0,
      Math.PI / 6,
      'a',
      this.colors.angleA,
    );
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
    const equationElements = this.diagram.equation.elements({
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
      deg: 'º',
      v: this.diagram.equation.vinculum(this.colors.diagram.text.base),
    }, this.colors.diagram.text.base);
    equationElements.setFirstTransform(this.diagram.diagramToGLSpaceTransform);
    equationElements.setPosition(this.layout.equationPosition);
    const ee = equationElements;

    /* eslint-disable no-param-reassign */
    function setElem(
      elem: DiagramElementCollection | DiagramElementPrimative,
      color: Array<number> | null = null,
      direction: 'up' | 'down' = 'up',
      mag: number = 1,
    ) {
      if (color != null) {
        elem.setColor(color);
      }
      elem.isTouchable = true;
      elem.animate.transform.translation.style = 'curved';
      elem.animate.transform.translation.options.direction = direction;
      elem.animate.transform.translation.options.magnitude = mag;
    }
    /* eslint-enable no-param-reassign */

    setElem(ee._a, this.colors.angleA, 'up', 0.65);
    setElem(ee._b, this.colors.angleB, 'up', 0.85);
    setElem(ee._pi, null, 'down', 1);
    setElem(ee._v, null, 'down', 1);
    setElem(ee.__2, null, 'down', 1);
    setElem(ee.__90, null, 'down', 0.7);
    equationElements.hasTouchableElements = true;


    const eqn = this.diagram.equation.make(equationElements);
    const makeEqn = (content) => {
      const e = eqn.createNewEq(content);
      e.arrange(1, 'left', 'baseline', equationElements._equals);
      return e;
    };

    equationElements.complementary = {
      add: {
        deg: makeEqn(['_90', 'equals', 'a', 'plus', 'b']),
        rad: makeEqn([eqn.frac('pi', '_2', 'v'), 'equals', 'a', 'plus', 'b']),
      },
      a: {
        deg: makeEqn(['a', 'equals', '_90', 'minus', 'b']),
        rad: makeEqn(['a', 'equals', eqn.frac('pi', '_2', 'v'), 'minus', 'b']),
      },
      b: {
        deg: makeEqn(['b', 'equals', '_90', 'minus', 'a']),
        rad: makeEqn(['b', 'equals', eqn.frac('pi', '_2', 'v'), 'minus', 'a']),
      },
    };
    equationElements.supplementary = {
      add: {
        deg: makeEqn(['_180', 'equals', 'a', 'plus', 'b']),
        rad: makeEqn(['pi', 'equals', 'a', 'plus', 'b']),
      },
      a: {
        deg: makeEqn(['a', 'equals', '_180', 'minus', 'b']),
        rad: makeEqn(['a', 'equals', 'pi', 'minus', 'b']),
      },
      b: {
        deg: makeEqn(['b', 'equals', '_180', 'minus', 'a']),
        rad: makeEqn(['b', 'equals', 'pi', 'minus', 'a']),
      },
    };
    equationElements.explementary = {
      add: {
        deg: makeEqn(['_360', 'equals', 'a', 'plus', 'b']),
        rad: makeEqn(['_2', 'pi', 'equals', 'a', 'plus', 'b']),
      },
      a: {
        deg: makeEqn(['a', 'equals', '_360', 'minus', 'b']),
        rad: makeEqn(['a', 'equals', '_2', 'pi', 'minus', 'b']),
      },
      b: {
        deg: makeEqn(['b', 'equals', '_360', 'minus', 'a']),
        rad: makeEqn(['b', 'equals', '_2', 'pi', 'minus', 'a']),
      },
    };

    equationElements.showAngle = (angleType: angleTypes) => {
      equationElements.show();
      if (this.varState.radialLines === 360) {
        equationElements._pi.hide();
        equationElements._v.hide();
        equationElements.__2.hide();
        if (angleType === 'complementary') {
          equationElements.__90.show();
          equationElements.__180.hide();
          equationElements.__360.hide();
        }
        if (angleType === 'supplementary') {
          equationElements.__90.hide();
          equationElements.__180.show();
          equationElements.__360.hide();
        }
        if (angleType === 'explementary') {
          equationElements.__90.hide();
          equationElements.__180.hide();
          equationElements.__360.show();
        }
      } else {
        equationElements.__90.hide();
        equationElements.__180.hide();
        equationElements.__360.hide();
        if (angleType === 'complementary') {
          equationElements._pi.show();
          equationElements._v.show();
          equationElements.__2.show();
        }
        if (angleType === 'supplementary') {
          equationElements._pi.show();
          equationElements._v.hide();
          equationElements.__2.hide();
        }
        if (angleType === 'explementary') {
          equationElements._pi.show();
          equationElements._v.hide();
          equationElements.__2.show();
        }
      }
    };

    equationElements.showEqn = (angleType: angleTypes, form: equationFormType = 'add') => {
      if (angleType === 'adjacent') {
        equationElements.hideAll();
        return;
      }

      equationElements.showAngle(angleType);
      const units = this.varState.radialLines === 360 ? 'deg' : 'rad';
      equationElements[angleType][form][units].setPositions();

      equationElements._a.show();
      equationElements._b.show();
      equationElements._equals.show();
      if (form === 'add') {
        equationElements._plus.show();
        equationElements._minus.hide();
      } else {
        equationElements._plus.hide();
        equationElements._minus.show();
      }
      this.varState.equationForm = form;
    };

    const onclickEqn = (form: equationFormType) => {
      equationElements[this.getAngleType()][form][this.getUnits()]
        .animateTo(1, 2, equationElements._equals);

      if (form === 'a') {
        this._circle._angleA.pulseScaleNow(1, 1.5);
      }
      if (form === 'b') {
        this._circle._angleB.pulseScaleNow(1, 1.5);
      }
      this.varState.equationForm = form;
      this.diagram.animateNextFrame();
    };

    equationElements._a.onClick = onclickEqn.bind(this, 'a');
    equationElements._b.onClick = onclickEqn.bind(this, 'b');
    equationElements._pi.onClick = onclickEqn.bind(this, 'add');
    equationElements.__90.onClick = onclickEqn.bind(this, 'add');
    equationElements.__2.onClick = onclickEqn.bind(this, 'add');
    equationElements._v.onClick = onclickEqn.bind(this, 'add');
    return equationElements;
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
    this._circle.add('angleA', this.makeAngleA());
    this._circle.add('angleB', this.makeAngleB());
    this._circle.add('rightAngle', this.makeRightAngle());
    this._circle.add('straightAngle', this.makeStraightAngle());
    this._circle.add('fullAngle', this.makeFullAngle());
    

    this._circle._endLine.setTransformCallback = this.updateEndLineRotation.bind(this);
    this._circle.setTransformCallback = this.updateCircleRotation.bind(this);
    this._circle.order = [
      ...this._circle.order.slice(-5),
      ...this._circle.order.slice(0, -5),
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
    this.addToCircle();
    this.add('eqn', this.makeAnglesEquation());
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
        this.setParagraphUnits('rad');
      } else if (unit === 'deg') {
        this.varState.radialLines = 360;
        elemRad.classList.remove('lesson__important_angles_unit_selected');
        elemDeg.classList.add('lesson__important_angles_unit_selected');
        this.setParagraphUnits('deg');
      }
    }
    this._eqn.stop();
    this._eqn.showEqn(this.varState.angleSelected, this.varState.equationForm);
    this.diagram.animateNextFrame();
  }

  updateCircleRotation() {
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

  setParagraphUnits(onUnit: 'rad' | 'deg') {
    this.angleTypes.forEach((angleType) => {
      const offUnit = onUnit === 'rad' ? 'deg' : 'rad';
      const elemOn1 = document.getElementById(`id_${angleType}_${onUnit}1`);
      const elemOn2 = document.getElementById(`id_${angleType}_${onUnit}2`);
      const elemOn3 = document.getElementById(`id_${angleType}_${onUnit}3`);
      const elemOff1 = document.getElementById(`id_${angleType}_${offUnit}1`);
      const elemOff2 = document.getElementById(`id_${angleType}_${offUnit}2`);
      const elemOff3 = document.getElementById(`id_${angleType}_${offUnit}3`);
      if (elemOn1 != null) {
        elemOn1.classList.remove('lesson__important_angles_text_hide');
      }
      if (elemOn2 != null) {
        elemOn2.classList.remove('lesson__important_angles_text_hide');
      }
      if (elemOn3 != null) {
        elemOn3.classList.remove('lesson__important_angles_text_hide');
      }
      if (elemOff1 != null) {
        elemOff1.classList.add('lesson__important_angles_text_hide');
      }
      if (elemOff2 != null) {
        elemOff2.classList.add('lesson__important_angles_text_hide');
      }
      if (elemOff3 != null) {
        elemOff3.classList.add('lesson__important_angles_text_hide');
      }
    });
  }

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
    this._eqn.showEqn('adjacent');
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
    this._eqn.showEqn('complementary', 'add');
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
    this._eqn.showEqn('supplementary', 'add');
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
    this._eqn.showEqn('explementary', 'add');
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
