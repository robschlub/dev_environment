// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform } from '../../../js/diagram/tools/g2';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';


export type extendedCircleType = {
  // _angleFill: DiagramElementPrimative;
} & circleType;

type angleTypes = 'acute' | 'obtuse' | 'right' | 'reflex' | 'straight';

type varStateExtendedType = {
    angleSelected: angleTypes;
  } & varStateType;

export type ImportantAnglesCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  enableAutoChange: boolean;
  angleTypes: Array<string>;
};

class ImportantAnglesCollection extends AngleCircle {
  _circle: extendedCircleType;
  // numSections: Array<number>;
  varState: varStateExtendedType;
  enableAutoChange: boolean;
  angleTypes: Array<string>;

  addToCircle() {
    // this._circle.add('compareRadius', this.makeReference());
    // this._circle.add('radiusOnArc', this.makeRadiusOnArc());
    // this._circle.add('radiusToArc', this.makeRadiusToArc());
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      rotation: 0,
      angleSelected: 'acute',
    };
    this.enableAutoChange = true;
    this.addToCircle();
    this.angleTypes = ['acute', 'obtuse', 'right', 'reflex', 'straight'];
  }

  // eslint-disable-next-line class-methods-use-this
  calcAngleType(angle: number, thresholds: Object): angleTypes {
    if (angle >= thresholds.acute.min && angle <= thresholds.acute.max) {
      return 'acute';
    }
    if (angle >= thresholds.right.min && angle <= thresholds.right.max) {
      return 'right';
    }
    if (angle >= thresholds.obtuse.min && angle <= thresholds.obtuse.max) {
      return 'obtuse';
    }
    if (angle >= thresholds.straight.min && angle <= thresholds.straight.max) {
      return 'straight';
    }
    return 'reflex';
  }

  calcAngleTypeDegrees(angle: number): angleTypes {
    const thresholds = {
      acute: {
        min: 0,
        max: 89,
      },
      right: {
        min: 90,
        max: 90,
      },
      obtuse: {
        min: 91,
        max: 179,
      },
      straight: {
        min: 180,
        max: 180,
      },
      reflex: {
        min: 181,
        max: 360,
      },
    };
    return this.calcAngleType(angle, thresholds);
  }

  calcAngleTypeRadians(angle: number): angleTypes {
    const thresholds = {
      acute: {
        min: 0,
        max: 1.56,
      },
      right: {
        min: 1.57,
        max: 1.57,
      },
      obtuse: {
        min: 1.58,
        max: 3.13,
      },
      straight: {
        min: 3.14,
        max: 3.14,
      },
      reflex: {
        min: 3.15,
        max: 6.28,
      },
    };
    return this.calcAngleType(angle, thresholds);
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
        this.hideDegrees();
        this.showRadians();
        elemDeg.classList.remove('lesson__important_angles_unit_selected');
        elemRad.classList.add('lesson__important_angles_unit_selected');
        this.setParagraphUnits('rad');
      } else if (unit === 'deg') {
        this.hideRadians();
        this.showDegrees();
        elemRad.classList.remove('lesson__important_angles_unit_selected');
        elemDeg.classList.add('lesson__important_angles_unit_selected');
        this.setParagraphUnits('deg');
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
    if (this.enableAutoChange) {
      const r = this.varState.rotation;
      if (this.varState.radialLines === 360) {
        const angleType = this.calcAngleTypeDegrees(Math.round(r * 180 / Math.PI));
        this.selectAngle(angleType);
        this.showText(angleType);
      } else if (this.varState.radialLines === Math.PI * 2) {
        const angleType = this.calcAngleTypeRadians(Math.round(r * 100) / 100);
        this.selectAngle(angleType);
        this.showText(angleType);
      }
    }
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

  goToAcute() {
    const angle45 = Math.random() * Math.PI / 4 * 0.95;
    let angle = angle45;
    const r = this._circle._radius.transform.r();
    if (r != null) {
      if (this.varState.angleSelected !== 'acute') {
        angle = Math.PI / 4;
      } else if (r < Math.PI / 4) {
        angle += Math.PI / 4;
      }
      this.rotateToAngleDisablingAutoChange(angle);
    }
    this.selectAngle('acute');
    this.showText('acute');
  }

  // eslint-disable-next-line class-methods-use-this
  showText(angleType: angleTypes) {
    const ids = [
      'id_acute_text',
      'id_obtuse_text',
      'id_right_text',
      'id_straight_text',
      'id_reflex_text',
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
    this.enableAutoChange = false;
    this.rotateTo(angle, 2, 1, ((result) => {
      if (result) {
        this.enableAutoChange = true;
      }
    }));
  }

  goToRight() {
    this.enableAutoChange = false;
    const angle = Math.PI / 2;
    this.rotateToAngleDisablingAutoChange(angle);
    this.selectAngle('right');
    this.showText('right');
  }

  goToObtuse() {
    const angle45 = Math.random() * Math.PI / 4 * 0.95;
    let angle = angle45;
    const r = this._circle._radius.transform.r();
    if (r != null) {
      if (this.varState.angleSelected !== 'obtuse') {
        angle = 3 * Math.PI / 4;
      } else if (r < 3 * Math.PI / 4) {
        angle += 3 * Math.PI / 4;
      } else {
        angle += Math.PI / 2;
      }
      this.rotateToAngleDisablingAutoChange(angle);
    }
    this.selectAngle('obtuse');
    this.showText('obtuse');
  }
  goToStraight() {
    const angle = Math.PI;
    this.rotateToAngleDisablingAutoChange(angle);
    this.selectAngle('straight');
    this.showText('straight');
  }
  goToReflex() {
    const angle90 = Math.random() * Math.PI / 2 * 0.95;
    let angle = angle90;
    const r = this._circle._radius.transform.r();
    if (r != null) {
      if (r < 3 * Math.PI / 2) {
        angle += 3 * Math.PI / 2;
      } else {
        angle += Math.PI;
      }
      this.rotateToAngleDisablingAutoChange(angle);
    }
    this.selectAngle('reflex');
    this.showText('reflex');
  }
}

export default ImportantAnglesCollection;
