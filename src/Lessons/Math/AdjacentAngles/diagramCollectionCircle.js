// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';

// type rightAngleType = {
//   _horizontal: DiagramElementPrimative;
//   _vertical: DiagramElementPrimative;
// } & DiagramElementCollection;

export type extendedCircleType = {
  _startLine: DiagramElementPrimative;
  _endLine: DiagramElementPrimative;
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
    line.pulse.transformMethod = s => new Transform().scale(1, s);

    for (let i = 0; i < line.vertices.border[0].length; i += 1) {
      line.vertices.border[0][i].y *= 10;
    }
    return line;
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

    this._circle._endLine.setTransformCallback = this.updateEndLineRotation.bind(this);
    // this._circle._startLine.setTransformCallback = this.updateEndLineRotation.bind(this);
    // this._circle.add('rightAngle', this.makeRightAngle());
    // this._circle.add('acuteRange', this.makeAcuteRange());
    // this._circle.add('obtuseRange', this.makeObtuseRange());
    // this._circle.add('reflexRange', this.makeReflexRange());
    // this._circle.add('axes', this.makeAxes());
    this._circle.order = [
      ...this._circle.order.slice(-2),
      ...this._circle.order.slice(0, -2),
      // ...this._circle.order.slice(2, -4),
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

  updateEndLineRotation() {
    const r = this._circle._endLine.transform.r();
    if (r != null) {
      this.rotationLimits = { min: 0, max: r };
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
    // if (this.varState.angleSelected === 'right' && angleType !== 'right') {
    //   this.toggleRightAngleLine(false);
    // }
    this.varState.angleSelected = angleType;
  }

  showAngleType(angleType: angleTypes) {
    this.selectAngle(angleType);
    this.showText(angleType);
    if (angleType !== 'adjacent') {
      // this._circle._acuteRange.hide();
    }
    if (angleType !== 'complementary') {
      // this._circle._obtuseRange.hide();
    }
    if (angleType !== 'supplementary') {
      // this._circle._reflexRange.hide();
    }
    if (angleType === 'explementary') {
      // this._circle._acuteRange.show();
    }
  }

  // goToAcute() {
  //   const angle45 = Math.random() * Math.PI / 4 * 0.95;
  //   let angle = angle45;
  //   const r = this._circle._radius.transform.r();
  //   if (r != null) {
  //     if (this.varState.angleSelected !== 'acute') {
  //       angle = Math.PI / 4;
  //     } else if (r < Math.PI / 4) {
  //       angle += Math.PI / 4;
  //     }
  //     this.rotateToAngleDisablingAutoChange(angle);
  //   }
  //   // this.selectAngle('acute');
  //   // this.showText('acute');
  //   // this._circle._acuteRange.show();
  //   this.showAngleType('acute');
  // }

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

  rotateToAngleDisablingAutoChange(angle: number) {
    // this.enableAutoChange = false;
    this.rotateTo(angle, 2, 1, ((result) => {
      if (result) {
        // this.enableAutoChange = true;
      }
    }));
  }

  goToAdjacent() {
    this.showAngleType('adjacent');
    this._circle._startLine.transform.updateRotation(0);
    this._circle._endLine.transform.updateRotation(Math.PI / 3);
    this.setRotation(Math.PI / 6);
    this.diagram.animateNextFrame();
    this.rotationLimits = { min: 0, max: 2 * Math.PI };
    this._circle._endLine.isTouchable = true;
    this._circle._endLine.isMovable = true;
  }

  goToComplementary() {
    this.showAngleType('complementary');
    this._circle._startLine.transform.updateRotation(0);
    this._circle._endLine.transform.updateRotation(Math.PI / 2);
    this.setRotation(Math.PI / 6);
    this.diagram.animateNextFrame();
    this.rotationLimits = { min: 0, max: Math.PI / 2 };
    this._circle._endLine.isTouchable = false;
    this._circle._endLine.isMovable = false;
  }

  goToSupplementary() {
    this.showAngleType('supplementary');
    this._circle._startLine.transform.updateRotation(0);
    this._circle._endLine.transform.updateRotation(Math.PI);
    this.setRotation(Math.PI / 6);
    this.diagram.animateNextFrame();
    this.rotationLimits = { min: 0, max: Math.PI };
    this._circle._endLine.isTouchable = false;
    this._circle._endLine.isMovable = false;
  }

  goToExplementary() {
    this.showAngleType('explementary');
    this._circle._startLine.transform.updateRotation(0);
    this._circle._endLine.transform.updateRotation(Math.PI * 2);
    this.setRotation(Math.PI / 6);
    this.diagram.animateNextFrame();
    this.rotationLimits = { min: 0, max: Math.PI * 2 * 0.999 };
    this._circle._endLine.isTouchable = false;
    this._circle._endLine.isMovable = false;
  }

  // goToRight() {
  //   // this.enableAutoChange = false;
  //   const angle = Math.PI / 2;
  //   this.rotateToAngleDisablingAutoChange(angle);
  //   // this.selectAngle('right');
  //   // this.showText('right');
  //   this.showAngleType('right');
  // }

  // goToObtuse() {
  //   const angle45 = Math.random() * Math.PI / 4 * 0.95;
  //   let angle = angle45;
  //   const r = this._circle._radius.transform.r();
  //   if (r != null) {
  //     if (this.varState.angleSelected !== 'obtuse') {
  //       angle = 3 * Math.PI / 4;
  //     } else if (r < 3 * Math.PI / 4) {
  //       angle += 3 * Math.PI / 4;
  //     } else {
  //       angle += Math.PI / 2;
  //     }
  //     this.rotateToAngleDisablingAutoChange(angle);
  //   }
  //   // this.selectAngle('obtuse');
  //   // this.showText('obtuse');
  //   this.showAngleType('obtuse');
  // }
  // goToStraight() {
  //   const angle = Math.PI;
  //   this.rotateToAngleDisablingAutoChange(angle);
  //   // this.selectAngle('straight');
  //   // this.showText('straight');
  //   this.showAngleType('straight');
  // }

  // goToReflex() {
  //   const angle90 = Math.random() * Math.PI / 2 * 0.95;
  //   let angle = angle90;
  //   const r = this._circle._radius.transform.r();
  //   if (r != null) {
  //     if (r < 3 * Math.PI / 2) {
  //       angle += 3 * Math.PI / 2;
  //     } else {
  //       angle += Math.PI;
  //     }
  //     this.rotateToAngleDisablingAutoChange(angle);
  //   }
  //   // this.selectAngle('reflex');
  //   // this.showText('reflex');
  //   this.showAngleType('reflex');
  // }

  // goToFull() {
  //   const angle = 2 * Math.PI * 0.999;
  //   this.rotateToAngleDisablingAutoChange(angle);
  //   this.showAngleType('full');
  // }

  // pulseAngle() {
  //   if (this._circle._rightAngle.isShown) {
  //     this._circle._rightAngle._horizontal.pulseScaleNow(1, 2);
  //     this._circle._rightAngle._vertical.pulseScaleNow(1, 2);
  //   } else {
  //     this._circle._angle._arc.pulseThickNow(1, 1.04, 7);
  //     this._circle._angle._arrow.pulseScaleNow(1, 1.5);
  //   }
  //   this.diagram.animateNextFrame();
  // }
  // toggleRightAngleLine(show: boolean | null) {
  //   let toShow = show;
  //   if (show === null) {
  //     if (this._circle._rightAngle.isShown) {
  //       toShow = false;
  //     } else {
  //       toShow = true;
  //     }
  //   }
  //   if (toShow) {
  //     this._circle._rightAngle.showAll();
  //     this._circle._angle.hideAll();
  //     this._circle._rightAngle._horizontal.pulseScaleNow(1, 2);
  //     this._circle._rightAngle._vertical.pulseScaleNow(1, 2);
  //   } else {
  //     this._circle._rightAngle.hideAll();
  //     this._circle._angle.showAll();
  //   }
  //   this.diagram.animateNextFrame();
  // }
}

export default AdjacentAnglesCollection;
