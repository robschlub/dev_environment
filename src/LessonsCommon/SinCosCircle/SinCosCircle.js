// @flow

import Diagram from '../../js/diagram/Diagram';
import { Transform, Point, polarToRect } from '../../js/diagram/tools/g2';
import { DiagramElementCollection, DiagramElementPrimative } from '../../js/diagram/Element';
import AngleCircle from '../AngleCircle/AngleCircle';
import type { circleType, varStateType } from '../AngleCircle/AngleCircle';

type rightAngleType = {
  _horizontal: DiagramElementPrimative;
  _vertical: DiagramElementPrimative;
} & DiagramElementCollection;

type quadAngle = {
  _arc: DiagramElementPrimative;
  _text: DiagramElementPrimative;
  updateRotation: (number, number) => void;
} & DiagramElementCollection;

export type SinCosCircleType = {
  _rightAngle: rightAngleType;
  _quad1: DiagramElementPrimative;
  _quad2: DiagramElementPrimative;
  _quad3: DiagramElementPrimative;
  _quad4: DiagramElementPrimative;
  _quad1Angle: quadAngle;
  _quad2Angle: quadAngle;
  _quad3Angle: quadAngle;
  _quad4Angle: quadAngle;
  _sineLine: {
    _line: DiagramElementPrimative;
    _text: DiagramElementPrimative;
    updateRotation: (number, number) => void;
  } & DiagramElementCollection;
  _axes: {
    _x: DiagramElementPrimative;
    _y: DiagramElementPrimative;
  } & DiagramElementCollection;
} & circleType;

type quadrantType = 1 | 2 | 3 | 4;

export type SinCosVarStateType = {
    quadrant: quadrantType;
  } & varStateType;

export type SineCollectionType = {
  _circle: SinCosCircleType;
  varState: SinCosVarStateType;
  enableAutoChange: boolean;
  quadrants: Array<number>;
};

class SinCosCircle extends AngleCircle {
  _circle: SinCosCircleType;
  varState: SinCosVarStateType;
  enableAutoChange: boolean;
  quadrants: Array<number>;

  makeAngle(
    radius: number,
    name: string,
    label: string,
    startAngle: number = 0,
    direction: -1 | 1 = 1,
    textOffset: number = 0.15,
  ) {
    const angle = this.shapes.collection(new Transform().translate(0, 0));
    const arc = this.shapes.polygon(
      this.layout.anglePoints,
      radius, this.layout.quadAngles.lineWidth,
      startAngle, direction, this.layout.anglePoints,
      this.layout.colors.quadAngles, new Transform()
        .rotate(0)
        .translate(0, 0),
    );
    const text = this.shapes.htmlText(
      label, `id_diagram_quadAngles_${name}`, 'diagram__quad_angles',
      new Point(0, 0), 'middle', 'center',
    );

    angle.add('arc', arc);
    angle.add('text', text);

    angle.updateRotation = (r: number, quad: number) => {
      if (angle.isShown) {
        let angleToDraw = r;
        if (quad === 2) {
          angleToDraw = Math.PI - r;
        }
        if (quad === 3) {
          angleToDraw = r - Math.PI;
        }
        if (quad === 4) {
          angleToDraw = Math.PI * 2 - r;
        }
        arc.angleToDraw = angleToDraw;
        text.setPosition(polarToRect(
          radius + textOffset,
          startAngle + direction * angleToDraw / 2,
        ));
      }
    };
    return angle;
  }

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

  makeQuad(num: number = 1) {
    // return this.shapes.polygonFilled(
    //   this.layout.anglePoints, this.layout.radius, 0,
    //   this.layout.anglePoints / 4, this.colors.angleArea, new Transform()
    //     .translate(0, 0)
    //     .rotate((num - 1) * Math.PI / 2),
    // );
    let xSign = 1;
    let ySign = 1;
    if (num === 2 || num === 3) {
      xSign = -1;
    }
    if (num === 3 || num === 4) {
      ySign = -1;
    }

    return this.shapes.polygonFilled(
      4, this.layout.radius / 2 * Math.sqrt(2), 0,
      4, this.colors.quadrant, new Transform()
        .rotate(Math.PI / 4)
        .translate(
          xSign * this.layout.radius / 2,
          ySign * this.layout.radius / 2,
        ),
    );
  }

  makeAxesAndGrid() {
    const grid = this.shapes.axes(
      this.layout.grid.width, this.layout.grid.height, this.layout.grid.range,
      0, 0, this.layout.grid.step, this.layout.grid.step,
      0.08, true, this.colors.axes, this.colors.grid, this.layout.grid.position,
    );
    grid._x.props.majorTicks.fontColor = this.colors.grid;
    grid._x.props.majorTicks.color = this.colors.grid;
    grid._x.props.majorTicks.labelOffset = new Point(-0.07, 0);
    grid._x.props.majorTicks.labels[5] = '0';
    grid._x.props.majorTicks.width = 0.005;
    grid._x.rebuild();
    grid._y.props.majorTicks.fontColor = this.colors.grid;
    grid._y.props.majorTicks.color = this.colors.grid;
    grid._y.props.majorTicks.labelOffset = new Point(-0.02, -0.05);
    grid._y.props.majorTicks.labels[5] = '';
    grid._y.props.majorTicks.width = 0.005;
    grid._y.rebuild();
    // console.log(grid._grid)
    return grid;
  }

  makeSineLine() {
    const line = this.makeLine(
      new Point(0, 0),
      this.layout.radius,
      this.layout.sine.lineWidth,
      this.colors.sine,
      new Transform().scale(1, 1).rotate(Math.PI / 2).translate(0, 0),
    );
    const text = this.shapes.htmlText(
      'sin', 'id_diagram_sin', '',
      new Point(0, 0), 'middle', 'center',
    );
    const sine = this.shapes.collection();
    sine.add('line', line);
    sine.add('text', text);
    sine.updateRotation = (radius: number, angle: number) => {
      if (sine.isShown) {
        const endX = radius * Math.cos(angle);
        const endY = radius * Math.sin(angle);
        sine._line.setPosition(endX, 0);
        sine._line.transform.updateScale(endY / radius, 1);
        if (sine._text.isShown) {
          sine._text.setPosition(endX + endX / Math.abs(endX) * this.layout.sine.offset, endY / 2);
        }
      }
    };
    return sine;
  }


  addToSinCosCircle() {
    this._circle.add('rightAngle', this.makeRightAngle());
    this._circle.add('sineLine', this.makeSineLine());
    const rad = this.layout.quadAngles.radius;
    this._circle.add('quad1Angle', this.makeAngle(rad, '1', 'θ', 0, 1, 0.08));
    this._circle.add('quad2Angle', this.makeAngle(rad, '2', 'π - θ', Math.PI, -1, 0.12));
    this._circle.add('quad3Angle', this.makeAngle(rad, '3', 'θ - π', Math.PI, 1));
    this._circle.add('quad4Angle', this.makeAngle(rad, '4', '2π - θ', 0, -1));
    this._circle.add('quad1', this.makeQuad(1));
    this._circle.add('quad2', this.makeQuad(2));
    this._circle.add('quad3', this.makeQuad(3));
    this._circle.add('quad4', this.makeQuad(4));
    this._circle.add('grid', this.makeAxesAndGrid());

    this._circle.order = [
      ...this._circle.order.slice(-5),
      ...this._circle.order.slice(0, -5),
    ];
  }

  showDegrees() {
    this.varState.radialLines = 360;
    this._angleText.setUnits('&deg;');
    this.updateNumSectionsText();
    this._angleText.showAll();
    this.diagram.animateNextFrame();
  }

  showRadians() {
    this.varState.radialLines = Math.PI * 2;
    this._angleText.setUnits('radians');
    this.updateNumSectionsText();
    this._angleText.showAll();
    this.diagram.animateNextFrame();
  }

  constructor(layout: Object, diagram: Diagram, transform: Transform = new Transform()) {
    super(layout, diagram, transform);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      rotation: 0,
      quadrant: 1,
    };
    this.enableAutoChange = true;
    this.addToSinCosCircle();
    this.quadrants = [1, 2, 3, 4];
  }

  updateRotation() {
    super.updateRotation();
    this._circle._sineLine.updateRotation(
      this.layout.radius,
      this.varState.rotation,
    );
    this._circle._quad1Angle.updateRotation(
      this.varState.rotation,
      this.varState.quadrant,
    );
    this._circle._quad2Angle.updateRotation(
      this.varState.rotation,
      this.varState.quadrant,
    );
    this._circle._quad3Angle.updateRotation(
      this.varState.rotation,
      this.varState.quadrant,
    );
    this._circle._quad4Angle.updateRotation(
      this.varState.rotation,
      this.varState.quadrant,
    );
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


  // setParagraphUnits(onUnit: 'rad' | 'deg') {
  //   // const angleType = this.varState.angleSelected;
  //   this.quadrants.forEach((angleType) => {
  //     const offUnit = onUnit === 'rad' ? 'deg' : 'rad';
  //     const elemOn1 = document.getElementById(`id_${angleType}_${onUnit}1`);
  //     const elemOn2 = document.getElementById(`id_${angleType}_${onUnit}2`);
  //     const elemOff1 = document.getElementById(`id_${angleType}_${offUnit}1`);
  //     const elemOff2 = document.getElementById(`id_${angleType}_${offUnit}2`);
  //     if (elemOn1 != null) {
  //       elemOn1.classList.remove('lesson__important_angles_text_hide');
  //     }
  //     if (elemOn2 != null) {
  //       elemOn2.classList.remove('lesson__important_angles_text_hide');
  //     }
  //     if (elemOff1 != null) {
  //       elemOff1.classList.add('lesson__important_angles_text_hide');
  //     }
  //     if (elemOff2 != null) {
  //       elemOff2.classList.add('lesson__important_angles_text_hide');
  //     }
  //   });
  // }

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

export default SinCosCircle;
