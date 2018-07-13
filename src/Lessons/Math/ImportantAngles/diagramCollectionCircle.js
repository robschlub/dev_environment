// @flow

import Diagram from '../../../js/diagram/Diagram';
// import { DiagramElementCollection, DiagramElementPrimative }
//   from '../../../js/diagram/Element';
import { Transform } from '../../../js/diagram/tools/g2';
// import DiagramGLEquation from '../../../js/diagram/DiagramElements/Equation/GLEquation';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';


export type extendedCircleType = {
  // _angleFill: DiagramElementPrimative;
  // _radialLinesA: DiagramElementPrimative;
} & circleType;

type angleTypes = 'acute' | 'obtuse' | 'right' | 'reflex' | 'straight';

type varStateExtendedType = {
    angleSelected: angleTypes;
  } & varStateType;

export type ImportantAnglesCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  enableAutoChange: boolean;
};

class ImportantAnglesCollection extends AngleCircle {
  _circle: extendedCircleType;
  // numSections: Array<number>;
  varState: varStateExtendedType;
  enableAutoChange: boolean;

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

  updateNumSectionsText() {
    super.updateNumSectionsText();
    if (this.enableAutoChange) {
      const r = this.varState.rotation;
      if (this.varState.radialLines === 360) {
        this.selectAngle(this.calcAngleTypeDegrees(Math.round(r * 180 / Math.PI)));
      } else if (this.varState.radialLines === Math.PI * 2) {
        this.selectAngle(this.calcAngleTypeRadians(Math.round(r * 100) / 100));
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
      if (r < Math.PI / 4) {
        angle += Math.PI / 4;
      }
      this.rotateToAngleDisablingAutoChange(angle);
    }
    this.selectAngle('acute');
  }

  rotateToAngleDisablingAutoChange(angle: number) {
    this.enableAutoChange = false;
    this.rotateTo(angle, 2, 2, ((result) => {
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
  }

  goToObtuse() {
    const angle45 = Math.random() * Math.PI / 4 * 0.95;
    let angle = angle45;
    const r = this._circle._radius.transform.r();
    if (r != null) {
      if (r < 3 * Math.PI / 4) {
        angle += 3 * Math.PI / 4;
      } else {
        angle += Math.PI / 2;
      }
      this.rotateToAngleDisablingAutoChange(angle);
    }
    this.selectAngle('obtuse');
  }
  goToStraight() {
    const angle = Math.PI;
    this.rotateToAngleDisablingAutoChange(angle);
    this.selectAngle('straight');
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
  }
}

export default ImportantAnglesCollection;
