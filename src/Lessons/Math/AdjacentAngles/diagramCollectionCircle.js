// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point, minAngleDiff } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
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
} & circleType;

type angleTypes = 'adjacent' | 'complementary' | 'supplementary' | 'explementary';

type varStateExtendedType = {
    angleSelected: angleTypes;
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
      [1, 0, 0, 1],
    );
  }
  makeAngleB() {
    return this.makeAngleAnnotation(
      0,
      Math.PI / 6,
      'b',
      [0, 1, 0, 1],
    );
  }
  // makeRightAngle() {
  //   const rad = this.layout.angleRadius * 0.9;
  //   const rightAngle = this.shapes.collection();
  //   rightAngle.add('vertical', this.makeLine(
  //     new Point(0, 0), rad, this.layout.linewidth,
  //     this.colors.angle, new Transform()
  //       .rotate(Math.PI / 2)
  //       .translate(rad, this.layout.linewidth / 2),
  //   ));
  //   rightAngle.add('horizontal', this.makeLine(
  //     new Point(0, 0), rad, this.layout.linewidth,
  //     this.colors.angle, new Transform()
  //       .translate(this.layout.linewidth / 2, rad),
  //   ));
  //   return rightAngle;
  // }

  addToCircle() {
    this._circle.add('startLine', this.makeMoveableLine());
    this._circle.add('endLine', this.makeMoveableLine());
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
    };
    // this.enableAutoChange = true;
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
        this.setParagraphUnits('rad');
      } else if (unit === 'deg') {
        this.varState.radialLines = 360;
        elemRad.classList.remove('lesson__important_angles_unit_selected');
        elemDeg.classList.add('lesson__important_angles_unit_selected');
        this.setParagraphUnits('deg');
      }
    }
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

  setParagraphUnits(onUnit: 'rad' | 'deg') {
    // const angleType = this.varState.angleSelected;
    this.angleTypes.forEach((angleType) => {
      const offUnit = onUnit === 'rad' ? 'deg' : 'rad';
      const elemOn1 = document.getElementById(`id_${angleType}_${onUnit}1`);
      const elemOn2 = document.getElementById(`id_${angleType}_${onUnit}2`);
      const elemOff1 = document.getElementById(`id_${angleType}_${offUnit}1`);
      const elemOff2 = document.getElementById(`id_${angleType}_${offUnit}2`);
      if (elemOn1 != null) {
        elemOn1.classList.remove('lesson__important_angles_text_hide');
      }
      if (elemOn2 != null) {
        elemOn2.classList.remove('lesson__important_angles_text_hide');
      }
      if (elemOff1 != null) {
        elemOff1.classList.add('lesson__important_angles_text_hide');
      }
      if (elemOff2 != null) {
        elemOff2.classList.add('lesson__important_angles_text_hide');
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
    this.showAngleType('adjacent');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 3);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.diagram.animateNextFrame();
  }

  goToRandomAdjancentAngle() {
    const angle = Math.random() * Math.PI + 0.5 * Math.PI;
    const divider = Math.random() * 0.6 + 0.3;
    this.rotateElementTo(this._circle._endLine, angle);
    this.rotateElementTo(this._circle._radius, angle * divider, this.setTouchable.bind(this));
    this.diagram.animateNextFrame();
  }

  goToComplementary() {
    this.showAngleType('complementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI / 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.diagram.animateNextFrame();
  }

  goToSupplementary() {
    this.showAngleType('supplementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
    this.diagram.animateNextFrame();
  }

  goToExplementary() {
    this.showAngleType('explementary');
    this.setUntouchable();
    this.rotateElementTo(this._circle._endLine, Math.PI * 2);
    this.rotateElementTo(this._circle, 0);
    this.rotateElementTo(this._circle._radius, Math.PI / 6, this.setTouchable.bind(this));
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
