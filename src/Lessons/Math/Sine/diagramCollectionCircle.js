// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point } from '../../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import AngleCircle from '../../../LessonsCommon/AngleCircle/AngleCircle';
import type { circleType, varStateType } from '../../../LessonsCommon/AngleCircle/AngleCircle';
import lessonLayout from './layout';

type rightAngleType = {
  _horizontal: DiagramElementPrimative;
  _vertical: DiagramElementPrimative;
} & DiagramElementCollection;

export type extendedCircleType = {
  _rightAngle: rightAngleType;
  _quad1: DiagramElementPrimative;
  _quad2: DiagramElementPrimative;
  _quad3: DiagramElementPrimative;
  _quad4: DiagramElementPrimative;
  _axes: {
    _x: DiagramElementPrimative;
    _y: DiagramElementPrimative;
  } & DiagramElementCollection;
} & circleType;

type quadrantType = 1 | 2 | 3 | 4;

type varStateExtendedType = {
    quadrant: quadrantType;
  } & varStateType;

export type SineCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
  enableAutoChange: boolean;
  angleTypes: Array<number>;
};

class SineCollection extends AngleCircle {
  _circle: extendedCircleType;
  // numSections: Array<number>;
  varState: varStateExtendedType;
  enableAutoChange: boolean;
  angleTypes: Array<number>;

  makeRightAngle() {
    const rad = this.layout.angleRadius * 0.9;
    const rightAngle = this.shapes.collection();
    rightAngle.add('vertical', this.makeLine(
      new Point(0, 0), rad, this.layout.linewidth,
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

  makeAxes() {
    const xAxis = this.makeLine(
      new Point(0, 0),
      this.layout.axes.length * 2.2,
      this.layout.linewidth / 4,
      this.colors.axes,
      new Transform().translate(-this.layout.axes.length * 1.1, 0),
    );
    const yAxis = this.makeLine(
      new Point(0, 0),
      this.layout.axes.length * 2.2,
      this.layout.linewidth / 4,
      this.colors.axes,
      new Transform()
        .rotate(Math.PI / 2)
        .translate(0, -this.layout.axes.length * 1.1),
    );
    const axes = this.shapes.collection();
    axes.add('x', xAxis);
    axes.add('y', yAxis);
    return axes;
  }

  makeQuad(num: number = 1) {
    return this.shapes.polygonFilled(
      this.layout.anglePoints, this.layout.axes.length, 0,
      this.layout.anglePoints / 4, this.colors.angleArea, new Transform()
        .translate(0, 0)
        .rotate((num - 1) * Math.PI / 2),
    );
  }

  addToCircle() {
    this._circle.add('rightAngle', this.makeRightAngle());
    this._circle.add('axes', this.makeAxes());
    this._circle.add('quad1', this.makeQuad(1));
    this._circle.add('quad2', this.makeQuad(2));
    this._circle.add('quad3', this.makeQuad(3));
    this._circle.add('quad4', this.makeQuad(4));
    this._circle.order = [
      ...this._circle.order.slice(-4),
      // ...this._circle.order.slice(0, 2),
      // ...this._circle.order.slice(-1),
      ...this._circle.order.slice(0, -4),
    ];
    console.log(this._circle.order)
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      rotation: 0,
      quadrant: 1,
    };
    this.enableAutoChange = true;
    this.addToCircle();
    this.angleTypes = [1, 2, 3, 4];
  }

  // eslint-disable-next-line class-methods-use-this
  calcQuadrant(angle: number, thresholds: Object): quadrantType {
    if (angle >= thresholds.quad1.min && angle <= thresholds.quad1.max) {
      return 1;
    }
    if (angle >= thresholds.quad2.min && angle <= thresholds.quad2.max) {
      return 2;
    }
    if (angle >= thresholds.quad3.min && angle <= thresholds.quad3.max) {
      return 3;
    }
    return 4;
  }

  calcQuadrantDegrees(angle: number): quadrantType {
    const thresholds = {
      quad1: {
        min: 0,
        max: 89,
      },
      quad2: {
        min: 90,
        max: 179,
      },
      quad3: {
        min: 180,
        max: 269,
      },
      quad4: {
        min: 270,
        max: 359,
      },
    };
    return this.calcQuadrant(angle, thresholds);
  }

  calcQuadrantRadians(angle: number): quadrantType {
    const thresholds = {
      quad1: {
        min: 0,
        max: 1.56,
      },
      quad2: {
        min: 1.57,
        max: 3.13,
      },
      quad3: {
        min: 3.14,
        max: 4.70,
      },
      quad4: {
        min: 4.71,
        max: 6.27,
      },
    };
    return this.calcQuadrant(angle, thresholds);
  }

  // toggleUnits(toUnit: 'rad' | 'deg' | null) {
  //   const elemDeg = document.getElementById('id_degrees');
  //   const elemRad = document.getElementById('id_radians');
  //   let unit = toUnit;
  //   if (toUnit === null) {
  //     if (this.varState.radialLines === 360) {
  //       unit = 'rad';
  //     } else {
  //       unit = 'deg';
  //     }
  //   }
  //   if (elemDeg != null && elemRad != null) {
  //     if (unit === 'rad') {
  //       this.hideDegrees();
  //       this.showRadians();
  //       elemDeg.classList.remove('lesson__important_angles_unit_selected');
  //       elemRad.classList.add('lesson__important_angles_unit_selected');
  //       this.setParagraphUnits('rad');
  //     } else if (unit === 'deg') {
  //       this.hideRadians();
  //       this.showDegrees();
  //       elemRad.classList.remove('lesson__important_angles_unit_selected');
  //       elemDeg.classList.add('lesson__important_angles_unit_selected');
  //       this.setParagraphUnits('deg');
  //     }
  //   }
  // }


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
    const r = this.varState.rotation;
    if (this.enableAutoChange) {
      if (this.varState.radialLines === 360) {
        const quad = this.calcQuadrantDegrees(Math.round(r * 180 / Math.PI));
        this.showQuadrant(quad);
      } else if (this.varState.radialLines === Math.PI * 2) {
        const quad = this.calcQuadrantRadians(Math.round(r * 100) / 100);
        this.showQuadrant(quad);
      }
    }
  }

  selectAngle(quadrant: quadrantType) {
    // let elem;
    // if (quadrant !== this.varState.quadrant) {
    //   elem = document.getElementById(`id_${this.varState.quadrant}`);
    //   if (elem != null) {
    //     elem.classList.remove('lesson__important_angles_table_selected');
    //   }
    // }
    // elem = document.getElementById(`id_${quadrant}`);
    // if (elem != null) {
    //   elem.classList.add('lesson__important_angles_table_selected');
    // }
    // if (this.varState.quadrant === 'right' && quadrant !== 'right') {
    //   this.toggleRightAngleLine(false);
    // }
    this.varState.quadrant = quadrant;
  }

  showQuadrant(quadrant: quadrantType) {
    this.selectAngle(quadrant);
    this.showText(quadrant);
    const circle = this._circle;
    const quads = [circle._quad1, circle._quad2, circle._quad3, circle._quad4];
    quads.forEach((q, index) => {
      if (quadrant !== index + 1) {
        q.hide();
      } else {
        q.show();
      }
    });
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
  showText(quadrant: quadrantType) {
    // const ids = [
    //   'id_acute_text',
    //   'id_obtuse_text',
    //   'id_right_text',
    //   'id_straight_text',
    //   'id_reflex_text',
    // ];
    // ids.forEach((id) => {
    //   if (id !== angleType) {
    //     const elem = document.getElementById(id);
    //     if (elem != null) {
    //       elem.classList.add('lesson__important_angles_text_hide');
    //     }
    //   }
    // });
    // const elem = document.getElementById(`id_${angleType}_text`);
    // if (elem != null) {
    //   elem.classList.remove('lesson__important_angles_text_hide');
    // }
  }

  rotateToAngleDisablingAutoChange(angle: number) {
    this.enableAutoChange = false;
    this.rotateTo(angle, 2, 1, ((result) => {
      if (result) {
        this.enableAutoChange = true;
      }
    }));
  }

  // goToRight() {
  //   this.enableAutoChange = false;
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

export default SineCollection;
