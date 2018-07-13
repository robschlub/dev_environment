// @flow

import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point, Transform, minAngleDiff, normAngle } from '../../js/diagram/tools/g2';
import lessonLayout from './layout';
// import makeSlider from '../../LessonsCommon/slider';
// import type { sliderType } from '../../LessonsCommon/slider';
// import DiagramGLEquation from '../../js/diagram/DiagramElements/Equation/GLEquation';


type lineAngleType = {
  _arc: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  updateRotation: (number) => {};
};

type angleTextType = {
  text: DiagramElementPrimative;
  equals: DiagramElementPrimative;
  angle: DiagramElementPrimative;
  units: DiagramElementPrimative;
  setUnits: (string) => void;
} & DiagramElementCollection;

export type circleType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: lineAngleType;
  // _angleFill: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  // _radialLinesA: DiagramElementPrimative;
  // _radialLinesB: DiagramElementCollection;
  _radialLinesDeg: DiagramElementCollection;
  _radialLinesRad: DiagramElementCollection;
  _compareRadius: DiagramElementPrimative;
  // _straightArc: straightArcType;
  // _radiusOnArc: radiusOnArcType;
  // _radiusToArc: radiusToArcType;
  _circumference: DiagramElementPrimative;
} & DiagramElementCollection;

export type varStateType = {
  radialLines: number;
  rotation: number;
}

export type angleCircleType = {
  layout: Object;
  colors: Object;
  shapes: Object;
  _circle: circleType;
  _angleText: angleTextType;
  +varState: varStateType;
  diagram: Diagram;
};

class AngleCircle extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;

  +_circle: circleType;
  _angleText: angleTextType;
  // _slider: sliderType;
  // _arcEquation: equationType;
  // _circumferenceEquation: circumferenceEquationType;
  // arcEqn: DiagramGLEquation;
  // radiusEqn: DiagramGLEquation;
  // angleEqn: DiagramGLEquation;
  // circEqn: DiagramGLEquation;
  // circEqnShort: DiagramGLEquation;
  // circEqnGeneral: DiagramGLEquation;
  varState: {
    radialLines: number,
    // angleInSections: number,
    rotation: number,
    percentStraight: number,
    straightening: boolean,
  };
  // numSections: Array<number>;
  diagram: Diagram;


  makeLine(
    location: Point,
    length: number,
    width: number,
    color: Array<number>,
    pointOrTransform: Point | Transform,
  ): DiagramElementPrimative {
    const line = this.shapes.horizontalLine(
      location, length, width,
      0, color, pointOrTransform,
    );
    line.pulse.transformMethod = s => new Transform().scale(1, s);
    return line;
  }

  makeRadius() {
    const radius = this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth,
      this.colors.radius, new Transform().rotate(0).translate(
        0,
        0,
      ),
    );
    radius.isTouchable = true;
    radius.isMovable = true;
    radius.pulse.transformMethod = s => new Transform().scale(1, s);

    for (let i = 0; i < radius.vertices.border[0].length; i += 1) {
      radius.vertices.border[0][i].y *= 10;
    }
    return radius;
  }

  makeArc(radius: number) {
    return this.shapes.polygon(
      this.layout.anglePoints, radius, this.layout.linewidth, 0, 1,
      this.layout.circlePoints, this.colors.arc, new Point(0, 0),
    );
  }

  // makeStraightArc() {
  //   const straightArc = this.shapes.collection(new Transform().rotate(0).translate(0, 0));
  //   const arc = this.makeArc(this.layout.radius);
  //   const line = this.makeLine(
  //     new Point(0, 0),
  //     this.layout.radius * 2 * Math.PI, this.layout.linewidth, this.colors.arc,
  //     new Transform().scale(1, 1).rotate(Math.PI / 2)
  //       .translate(this.layout.radius - this.layout.linewidth / 2, 0),
  //   );

  //   arc.angleToDraw = 0;
  //   straightArc.add('arc', arc);
  //   straightArc.add('line', line);

  //   return straightArc;
  // }

  // makeCompareText() {
  //   return this.shapes.htmlText(
  //     'Compare', 'id_compare_text', '',
  //     this.layout.compare.textPosition, 'middle', 'left',
  //   );
  // }

  makeCircumference() {
    return this.shapes.polygon(
      this.layout.anglePoints, this.layout.radius, this.layout.linewidth, 0, 1,
      this.layout.circlePoints, this.colors.arcLight, new Point(0, 0),
    );
  }

  makeAnchor() {
    return this.shapes.polygonFilled(
      this.layout.anchorPoints, this.layout.linewidth * 2, 0,
      this.layout.anchorPoints, this.colors.anchor, new Point(0, 0),
    );
  }

  // makeAngle() {
  //   return this.shapes.polygonFilled(
  //     this.layout.anglePoints, this.layout.angleRadius, 0,
  //     this.layout.anglePoints, this.colors.angle, new Point(0, 0),
  //   );
  // }

  makeAngleLine() {
    const angle = this.shapes.collection(new Transform().translate(0, 0));
    const arc = this.makeArc(this.layout.angle.radius);
    arc.color = this.colors.angle.slice();
    const arrow = this.shapes.arrow(
      this.layout.angle.arrow.width, 0, this.layout.angle.arrow.height, 0,
      this.colors.angle, new Transform().rotate(0).translate(0, 0),
    );
    angle.add('arc', arc);
    angle.add('arrow', arrow);
    const arrowAngleAtArc =
      Math.asin(this.layout.angle.arrow.height / this.layout.angle.radius);

    angle.updateRotation = (r) => {
      if (r < arrowAngleAtArc) {
        arc.angleToDraw = r;
        arrow.color[3] = 0;
      } else {
        arc.angleToDraw = r - arrowAngleAtArc * 0.9;
        arrow.color[3] = 1;
      }
      const arrowTip = new Point(
        (this.layout.angle.radius - this.layout.linewidth / 4) * Math.cos(r),
        (this.layout.angle.radius - this.layout.linewidth / 4) * Math.sin(r),
      );
      arrow.transform.updateTranslation(arrowTip);
      arrow.transform.updateRotation(r - arrowAngleAtArc);
    };
    return angle;
  }


  // makeRadiusToArc() {
  //   const radiusToArc = this.shapes.collection(new Transform()
  //     .scale(1, 1)
  //     .rotate(0)
  //     .translate(this.layout.radiusArc.radius - this.layout.linewidth / 2, 0));

  //   const arc = this.shapes.polygon(
  //     this.layout.anglePoints, this.layout.radiusArc.radius, this.layout.linewidth, 0, 1,
  //     Math.floor(this.layout.anglePoints / Math.PI / 2),
  //     this.colors.radiusLight,
  //     new Point(-this.layout.radiusArc.radius + this.layout.linewidth / 2, 0),
  //   );

  //   const line = this.makeLine(
  //     new Point(0, 0),
  //     this.layout.radiusArc.radius, this.layout.linewidth, this.colors.radiusLight,
  //     new Transform().scale(1, 1).rotate(Math.PI / 2)
  //       .translate(0, 0),
  //   );

  //   arc.angleToDraw = 0;
  //   radiusToArc.add('arc', arc);
  //   radiusToArc.add('line', line);

  //   radiusToArc.toArc = (percent: number) => {
  //     radiusToArc._line.transform.updateScale(1 - percent, 1);
  //     radiusToArc._arc.angleToDraw = percent;
  //     radiusToArc._arc.transform.updateTranslation(
  //       -this.layout.radiusArc.radius + this.layout.linewidth / 2,
  //       (1 - percent) * this.layout.radiusArc.radius,
  //     );
  //   };

  //   return radiusToArc;
  // }

  // makeRadiusOnArc() {
  //   const radiusArc = this.shapes.collection(new Transform().translate(0, 0));
  //   const r1 = this.shapes.polygon(
  //     this.layout.anglePoints, this.layout.radiusArc.radius, this.layout.linewidth, 0, 1,
  //     Math.floor(this.layout.anglePoints / Math.PI / 2), this.colors.radiusLight,
  //     new Transform().rotate(0),
  //   );
  //   const r2 = this.shapes.polygon(
  //     this.layout.anglePoints, this.layout.radiusArc.radius, this.layout.linewidth, 0, 1,
  //     Math.floor(this.layout.anglePoints / Math.PI / 2) - 1, this.colors.radiusLight,
  //     new Transform().rotate(1.02),
  //   );
  //   radiusArc.add('r1', r1);
  //   radiusArc.add('r2', r2);
  //   radiusArc.add('r3', r2.copy(new Transform().rotate(2.02)));
  //   radiusArc.add('r4', r2.copy(new Transform().rotate(3.02)));
  //   radiusArc.add('r5', r2.copy(new Transform().rotate(4.02)));
  //   radiusArc.add('r6', r2.copy(new Transform().rotate(5.02)));

  //   radiusArc.stepIn = (time: number) => {
  //     const timePerSegment = time / 6;
  //     radiusArc.hideAll();
  //     radiusArc.show();
  //     radiusArc._r1.show();
  //     radiusArc._r2.disolveInWithDelay(timePerSegment * 0.01, timePerSegment);
  //     radiusArc._r3.disolveInWithDelay(timePerSegment * 1, timePerSegment);
  //     radiusArc._r4.disolveInWithDelay(timePerSegment * 2, timePerSegment);
  //     radiusArc._r5.disolveInWithDelay(timePerSegment * 3, timePerSegment);
  //     radiusArc._r6.disolveInWithDelay(timePerSegment * 4, timePerSegment);
  //   };

  //   return radiusArc;
  // }

  makeReference() {
    return this.makeLine(
      new Point(0, 0), this.layout.radius, this.layout.linewidth,
      this.colors.reference, new Transform().rotate(0).translate(0, 0),
    );
  }

  makeRadialMarks(num: number, minor: boolean = false) {
    let inner = this.layout.radialLineMajorInner;
    let outer = this.layout.radialLineMajorOuter;
    if (minor) {
      inner = this.layout.radialLineMinorInner;
      outer = this.layout.radialLineMinorOuter;
    }
    return this.shapes.radialLines(
      inner, outer,
      this.layout.radialLineWidth, Math.PI * 2 / num,
      this.colors.radialLines, new Transform().translate(0, 0),
    );
  }

  // makeCircumferenceEquation() {
  //   const equationElements = this.diagram.equation.elements({
  //     circumference: 'circumference',
  //     radius: 'radius',
  //     twoPi: `2${String.fromCharCode(960)} `,
  //     times: ` ${String.fromCharCode(215)} `,
  //     equals: '  =  ',
  //     r: 'r',
  //     c: 'c',
  //     arc: 'arc length',
  //     angle: 'angle',
  //   }, this.colors.diagram.text.base);
  //   equationElements._arc.setColor(this.colors.arc);
  //   equationElements._circumference.setColor(this.colors.arc);
  //   equationElements._c.setColor(this.colors.arc);
  //   equationElements._r.setColor(this.colors.radius);
  //   equationElements._radius.setColor(this.colors.radius);
  //   equationElements._twoPi.setColor(this.colors.angle);
  //   equationElements._angle.setColor(this.colors.angle);

  //   equationElements._radius.isTouchable = true;
  //   equationElements._angle.isTouchable = true;
  //   equationElements._twoPi.isTouchable = true;
  //   equationElements._r.isTouchable = true;
  //   equationElements._c.isTouchable = true;
  //   equationElements._circumference.isTouchable = true;
  //   equationElements._arc.isTouchable = true;
  //   equationElements._equals.isTouchable = true;
  //   equationElements.isTouchable = true;
  //   equationElements.touchInBoundingRect = true;
  //   equationElements.varState = 0;
  //   return equationElements;
  // }

  // makeArcEquation() {
  //   const equationElements = this.diagram.equation.elements({
  //     arc: 'arc length',
  //     radius: 'radius',
  //     angle: 'angle',
  //     times: ` ${String.fromCharCode(215)} `,
  //     equals: '  =  ',
  //     v: this.diagram.equation.vinculum(this.colors.diagram.text.base),
  //   }, this.colors.diagram.text.base);
  //   equationElements._arc.setColor(this.colors.arc);
  //   equationElements._arc.isTouchable = true;
  //   equationElements._arc.animate.transform.translation.style = 'curved';
  //   equationElements._radius.setColor(this.colors.radius);
  //   equationElements._radius.isTouchable = true;
  //   equationElements._radius.animate.transform.translation.style = 'curved';
  //   equationElements._radius.animate.transform.translation.options.direction = 1;
  //   equationElements._angle.setColor(this.colors.angle);
  //   equationElements._angle.isTouchable = true;
  //   equationElements._angle.animate.transform.translation.style = 'curved';
  //   equationElements._angle.animate.transform.translation.options.direction = 1;
  //   equationElements.hasTouchableElements = true;

  //   equationElements.showArc = () => {
  //     equationElements.show();
  //     equationElements._arc.show();
  //     equationElements._radius.show();
  //     equationElements._angle.show();
  //     equationElements._equals.show();
  //     equationElements._v.hide();
  //     equationElements._times.show();
  //   };

  //   equationElements.showRadius = () => {
  //     equationElements.show();
  //     equationElements._arc.show();
  //     equationElements._radius.show();
  //     equationElements._angle.show();
  //     equationElements._equals.show();
  //     equationElements._v.show();
  //     equationElements._times.hide();
  //   };

  //   equationElements.showAngle = () => {
  //     equationElements.show();
  //     equationElements._arc.show();
  //     equationElements._radius.show();
  //     equationElements._angle.show();
  //     equationElements._equals.show();
  //     equationElements._v.show();
  //     equationElements._times.hide();
  //   };

  //   return equationElements;
  // }

  makeMajorAndMinRadialMarks(
    major: number,
    minor: number,
  ) {
    const collection = this.shapes.collection(new Transform().translate(0, 0));
    collection.add('minor', this.makeRadialMarks(minor, true));
    collection.add('major', this.makeRadialMarks(major, false));
    return collection;
  }

  makeAngleText() {
    const angleText = this.shapes.collection(this.layout.angleEqualsText.left);
    angleText.add('text', this.shapes.htmlText(
      'Angle', 'id_angle_text', 'action_word',
      new Point(0, 0), 'middle', 'left',
    ));
    angleText.add('equals', this.shapes.htmlText(
      '=', 'id_angle_equals', '',
      new Point(0.45, 0), 'middle', 'left',
    ));
    angleText.add('angle', this.shapes.htmlText(
      '0', 'id_angle_value', '',
      new Point(0.85, 0), 'middle', 'right',
    ));
    angleText.add('units', this.shapes.htmlText(
      'portions', 'id_angle_units', '',
      new Point(0.87, 0), 'middle', 'left',
    ));
    angleText.setUnits = (units: string) => {
      if (units === '&deg;') {
        angleText._units.transform.updateTranslation(this.layout.angleEqualsText.units.deg, 0);
      } else {
        angleText._units.transform.updateTranslation(this.layout.angleEqualsText.units.text, 0);
      }
      angleText._units.vertices.element.innerHTML = units;
    };
    return angleText;
  }

  makeCircle() {
    const circle = this.shapes.collection(new Transform()
      .scale(1, 1)
      .translate(this.layout.circle.center));
    // circle.add('angleFill', this.makeAngle());
    circle.add('angle', this.makeAngleLine());
    // circle.add('radialLinesA', this.makeRadialMarks(numSections[0]));
    // circle.add('radialLinesB', this.makeMajorAndMinRadialMarks(10, numSections[1]));
    circle.add('radialLinesDeg', this.makeMajorAndMinRadialMarks(36, 360));
    circle.add('radialLinesRad', this.makeRadialMarks(Math.PI * 2));
    circle.add('reference', this.makeReference());
    circle.add('circumference', this.makeCircumference());
    circle.add('arc', this.makeArc(this.layout.radius));
    // circle.add('straightArc', this.makeStraightArc());
    circle.add('radius', this.makeRadius());
    // circle.add('compareRadius', this.makeReference());
    circle.add('anchor', this.makeAnchor());
    // circle.add('radiusOnArc', this.makeRadiusOnArc());
    // circle.add('radiusToArc', this.makeRadiusToArc());
    return circle;
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      // angleInSections: 0,
      rotation: 0,
      percentStraight: 0,
      straightening: false,
    };
    // this.numSections = [12, 100];

    // const { shapes } = diagram;
    this.shapes = diagram.shapes;
    this.layout = lessonLayout();
    this.colors = this.layout.colors;
    // this.add('compareText', this.makeCompareText());
    this.add('circle', this.makeCircle());
    // this.add('sectionTitle', makeSectionTitle(shapes));
    this.add('angleText', this.makeAngleText());
    // this.add('slider', makeSlider(this.shapes, this.layout.slider));
    // this.add('arcEquation', this.makeArcEquation());
    // this.add('circumferenceEquation', this.makeCircumferenceEquation());

    // let eqn;
    // eqn = diagram.equation.make(this._arcEquation);
    // eqn.createEq(['arc', 'equals', 'angle', 'times', 'radius']);

    // this.arcEqn = eqn;
    // eqn = this.diagram.equation.make(this._arcEquation);
    // eqn.createEq(['radius', 'equals', eqn.frac('arc', 'angle', 'v')]);

    // this.radiusEqn = eqn;
    // eqn = this.diagram.equation.make(this._arcEquation);
    // eqn.createEq(['angle', 'equals', eqn.frac('arc', 'radius', 'v')]);

    // this.angleEqn = eqn;

    // eqn = this.diagram.equation.make(this._circumferenceEquation);
    // eqn.createEq(['circumference', 'equals', 'twoPi', 'times', 'radius']);
    // this.circEqn = eqn;

    // eqn = this.diagram.equation.make(this._circumferenceEquation);
    // eqn.createEq(['c', 'equals', 'twoPi', 'r']);
    // this.circEqnShort = eqn;

    // eqn = this.diagram.equation.make(this._circumferenceEquation);
    // eqn.createEq(['arc', 'equals', 'angle', 'times', 'radius']);
    // this.circEqnGeneral = eqn;

    // this._slider.setCallback(this.updateSlider.bind(this));

    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);

    this.isTouchable = true;
    this.isMovable = true;
    this._circle.isTouchable = true;
    this._circle.isMovable = true;
  }

  // updateSlider() {
  //   const percent = 0.5 + this._slider.getValue() * 0.5;
  //   // this._circle._radius.transform.updateScale(percent, 1);
  //   // this._circle._arc.transform.updateScale(percent, percent);
  //   this._circle.transform.updateScale(percent, percent);
  //   this._slider._value.transform.updateScale(1, percent);
  //   if (this._circle._straightArc.isShown) {
  //     this.straighten(this.varState.percentStraight);
  //   }
  //   this.diagram.animateNextFrame();
  // }
  updateRotation() {
    let rotation = this._circle._radius.transform.r();
    if (rotation !== null && rotation !== undefined) {
      if (rotation > Math.PI * 2) {
        rotation -= Math.PI * 2;
      }
      if (rotation < 0) {
        rotation += Math.PI * 2;
      }
      const r = normAngle(rotation);
      this.varState.rotation = r;
      this._circle._radius.transform.updateRotation(r);
      // this._circle._angleFill.angleToDraw = r + 0.01;
      this._circle._arc.angleToDraw = r + 0.01;
      this._circle._angle.updateRotation(r);
      this.updateNumSectionsText();
      // if (this._circle._straightArc.isShown) {
      //   this.straighten(this.varState.percentStraight);
      //   // this._circle._compareRadius.transform.updateRotation(r);
      // }
      // if (this._slider.isShown) {
      //   this._slider.transform.updateRotation(r);
      // }
    }
  }

  hideDegrees() {
    this._circle._radialLinesDeg.hideAll();
  }
  hideRadians() {
    this._circle._radialLinesRad.hide();
  }
  showDegrees() {
    this.varState.radialLines = 360;
    this._angleText.setUnits('&deg;');
    this.updateNumSectionsText();
    this._circle._radialLinesDeg.showAll();
    this._angleText.showAll();
    this.diagram.animateNextFrame();
  }

  showRadians() {
    this.varState.radialLines = Math.PI * 2;
    this._angleText.setUnits('radians');
    this.updateNumSectionsText();
    this._angleText.showAll();
    this._circle._radialLinesRad.show();
    this.diagram.animateNextFrame();
  }


  toggleDegreesRadians(show: 'deg' | 'rad') {
    if (show === 'deg') {
      // this._circle._radiusOnArc.hideAll();
      // this._circle._radiusToArc.hideAll();
      this.hideRadians();
      this.showDegrees();
    } else {
      this.hideDegrees();
      this.showRadians();
      // this._angleText.showAll();
      // this._angleText.setUnits('radius lengths');
      // this.varState.radialLines = Math.PI * 2;
      // this.arcRadius();
    }
    this.updateNumSectionsText();
    this.diagram.animateNextFrame();
  }

  // summaryShowRadiusAsArc() {
  //   this.hideDegrees();
  //   this.showRadians();
  //   this.rotateTo(1, 0, 2);
  //   this.arcRadius();
  //   this.diagram.animateNextFrame();
  // }
  // summaryShowRadians() {
  //   this.hideDegrees();
  //   this._circle._radiusToArc.hideAll();
  //   this._circle._radiusOnArc.hideAll();
  //   this.showRadians();
  // }
  // summaryShowDegrees() {
  //   this._circle._radialLinesRad.hide();
  //   this._circle._radiusToArc.hideAll();
  //   this._circle._radiusOnArc.hideAll();
  //   this.showDegrees();
  // }
  // summaryRotateToDeg(angle: number) {
  //   this.summaryShowDegrees();
  //   this.rotateTo(angle, 2, 2);
  // }
  // summaryRotateToRad(angle: number) {
  //   this.summaryShowRadians();
  //   this.rotateTo(angle, 2, 2);
  // }

  // // eslint-disable-next-line class-methods-use-this
  // summaryAngleToggler(toState: 'deg' | 'rad') {
  //   const deg = document.getElementById('id_deg_toggle');
  //   const rad = document.getElementById('id_rad_toggle');

  //   if (deg == null || rad == null) {
  //     return;
  //   }
  //   if (toState === 'deg') {
  //     if (rad.classList.contains('portions_selected')) {
  //       rad.classList.remove('portions_selected');
  //     }
  //     if (deg.classList.contains('portions_not_selected')) {
  //       deg.classList.remove('portions_not_selected');
  //     }
  //     deg.classList.add('portions_selected');
  //     rad.classList.add('portions_not_selected');
  //     this.summaryShowDegrees();
  //   } else {
  //     if (deg.classList.contains('portions_selected')) {
  //       deg.classList.remove('portions_selected');
  //     }
  //     if (rad.classList.contains('portions_not_selected')) {
  //       rad.classList.remove('portions_not_selected');
  //     }
  //     rad.classList.add('portions_selected');
  //     deg.classList.add('portions_not_selected');
  //     this.summaryShowRadians();
  //   }
  // }


  // toggleCircEquations(scale: number = 1, callback: ?(?mixed) => void = null) {
  //   this.diagram.stop();
  //   let callbackToUse = null;
  //   let scaleToUse = 1;
  //   if (typeof callback === 'function') {
  //     callbackToUse = callback;
  //   }
  //   if (typeof scale === 'number') {
  //     scaleToUse = scale;
  //   }
  //   if (this._circumferenceEquation.varState === 0) {
  //     this._circumferenceEquation.varState += 1;
  //     const t = this._circumferenceEquation._angle.transform.t();
  //     if (t != null) {
  //       this._circumferenceEquation._twoPi.transform
  //         .updateTranslation(t.add(this.layout.circEquation.twoPiOffset));
  //     }
  //     this.circEqn.hideShow(0.5, 0.5, callbackToUse);
  //   } else if (this._circumferenceEquation.varState === 1) {
  //     this._circumferenceEquation.varState += 1;
  //     let t = this._circumferenceEquation._radius.transform.t();
  //     if (t != null) {
  //       this._circumferenceEquation._r.setPosition(t);
  //     }
  //     t = this._circumferenceEquation._circumference.transform.t();
  //     if (t != null) {
  //       this._circumferenceEquation._c.setPosition(t);
  //     }
  //     this._circumferenceEquation._c.show();
  //     this._circumferenceEquation._r.show();
  //     this.circEqnShort.animateTo(
  //       scaleToUse, 2, this._circumferenceEquation._equals,
  //       callbackToUse,
  //     );
  //   } else if (this._circumferenceEquation.varState === 2) {
  //     this._circumferenceEquation.varState = 0;
  //     this.circEqnGeneral.hideShow(0.5, 0.5, callbackToUse);
  //   }
  //   this.diagram.animateNextFrame();
  // }
  // // setAngleUnits(units: string) {
  // //   // $FlowFixMe
  // //   this._angleText._units.vertices.element.innerHTML = units;
  // // }

  updateNumSectionsText() {
    const r = this.varState.rotation;
    let angleInSections =
        Math.round((r / (Math.PI * 2 / this.varState.radialLines) * 100)) / 100;

    if (this.varState.radialLines === 360) {
      angleInSections = Math.round(angleInSections);
    } else if (this.varState.radialLines === Math.PI * 2) {
      angleInSections = angleInSections.toFixed(2);
    } else {
      angleInSections = angleInSections.toFixed(1);
    }
    // $FlowFixMe
    this._angleText._angle.vertices.element.innerHTML = `${angleInSections}`;
  }

  // stepInRadiusOnArc() {
  //   this._circle._radiusOnArc.stepIn(3);
  //   this.diagram.animateNextFrame();
  // }
  // pulseAngleFill() {
  //   this._circle._angleFill.pulseScaleNow(1, 1.3);
  //   this.diagram.animateNextFrame();
  // }

  pulseAngle() {
    this._circle._angle._arc.pulseThickNow(1, 1.04, 7);
    this._circle._angle._arrow.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }
  // pulseRadiusOnArc(numToPulse: number = 1) {
  //   for (let i = 1; i <= numToPulse; i += 1) {
  //     const key = `_r${i}`;
  //     this._circle._radiusOnArc[key].pulseThickNow(1, 1.04, 7);
  //   }
  //   // this._circle._radiusOnArc._r1.pulseThickNow(1, 1.04, 7);
  //   this.diagram.animateNextFrame();
  // }
  pulseAnchor() {
    this._circle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseRadius() {
    this._circle._radius.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseReference() {
    this._circle._reference.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseLines() {
    this._circle._radius.pulseScaleNow(1, 2.5);
    this._circle._reference.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  // pulseRadialLines() {
  //   this._circle._radialLinesA.pulseScaleNow(1, 1.2);
  //   this.diagram.animateNextFrame();
  // }

  pulseArc() {
    this._circle._arc.pulseThickNow(1, 1.04, 7);
    this.diagram.animateNextFrame();
  }

  pulseCircumference() {
    this._circle._circumference.pulseThickNow(1, 1.04, 7);
    this.diagram.animateNextFrame();
  }

  // pulseSlider() {
  //   this._slider._circle.pulseScaleNow(1, 1.5);
  //   this.diagram.animateNextFrame();
  // }

  pushRadius() {
    const angle = this._circle._radius.transform.r();
    let targetAngle = angle + Math.PI / 6;
    if (targetAngle > Math.PI * 2) {
      targetAngle -= Math.PI * 2;
    }
    this._circle._radius.animateRotationTo(targetAngle, 1, 1);
    this.diagram.animateNextFrame();
  }

  setRotation(angle: number) {
    this._circle._radius.transform.updateRotation(angle);
    this.updateRotation();
  }

  rotateToRandom(time: number) {
    const angle = Math.random() * Math.PI * 2;
    this.rotateTo(angle, 1, time, () => {});
    this.diagram.animateNextFrame();
  }

  // toggleRadialLines(toPosition: number = -1) {
  //   if (toPosition > 0) {
  //     this.varState.radialLines = this.numSections[toPosition - 1];
  //   } else if (toPosition === 0) {
  //     // eslint-disable-next-line prefer-destructuring
  //     this.varState.radialLines = this.numSections[1];
  //   }
  //   if (this.varState.radialLines === this.numSections[0]) {
  //     this._circle._radialLinesA.hide();
  //     this._circle._radialLinesB.showAll();
  //     // eslint-disable-next-line prefer-destructuring
  //     this.varState.radialLines = this.numSections[1];
  //   } else if (this.varState.radialLines === this.numSections[1]) {
  //     this._circle._radialLinesB.hideAll();
  //     this._circle._radialLinesA.show();
  //     // eslint-disable-next-line prefer-destructuring
  //     this.varState.radialLines = this.numSections[0];
  //   } else {
  //     this._circle._radialLinesA.show();
  //     // eslint-disable-next-line prefer-destructuring
  //     this.varState.radialLines = this.numSections[0];
  //   }
  //   this.updateNumSectionsText();

  //   this.diagram.animateNextFrame();
  // }

  // arcRadius() {
  //   const r = this._circle._radius.transform.r();
  //   if (r !== null && r !== undefined) {
  //     // need two stops here to stop
  //     this._circle._radiusToArc.stop();
  //     this._circle._radiusOnArc.stop();
  //     this._circle._radiusOnArc.hideAll();
  //     this._circle._radiusToArc.toArc(0);
  //     this._circle._radiusToArc.showAll();
  //     this._circle._radiusToArc.transform.updateRotation(Math.PI / 2);
  //     this._circle._radiusToArc.animateRotationTo(0, 0, 1.5, this.stepInRadiusOnArc.bind(this));
  //     this.animateCustomTo(this.bendRadius.bind(this), 1, 0);
  //     this.diagram.animateNextFrame();
  //   }
  // }
  // bendRadius(percent: number) {
  //   this._circle._radiusToArc.toArc(percent);
  // }


  // straightenArc() {
  //   const currentPercent = this.varState.percentStraight;
  //   if (!this.varState.straightening || currentPercent === 0) {
  //     this.animateCustomTo(this.straighten.bind(this), 1, currentPercent);
  //     this.varState.straightening = true;
  //   } else {
  //     this.animateCustomTo(this.bend.bind(this), 1, 1 - currentPercent);
  //     this.varState.straightening = false;
  //   }
  //   this.diagram.animateNextFrame();
  // }

  // bend(percent: number) {
  //   this.straighten(1 - percent);
  // }

  // straighten(percent: number) {
  //   const r = this._circle._radius.transform.r();
  //   // const s = this._circle.transform.s();
  //   const sArc = this._circle._straightArc;
  //   if (r !== null && r !== undefined) {
  //     const scale = percent * r / (Math.PI * 2);
  //     sArc._line.transform.updateScale(scale, 1);
  //     sArc._arc.angleToDraw = (1 - percent) * r;
  //     sArc._arc.transform.updateTranslation(
  //       0,
  //       scale * this.layout.radius * Math.PI * 2,
  //     );

  //     this._circle._compareRadius.transform
  //       .updateRotation(r + percent * (Math.PI / 2 - r));
  //     this._circle._compareRadius.transform.updateTranslation(
  //       percent * (this.layout.radius + this.layout.compare.radiusOffset),
  //       0,
  //     );
  //     // const totalRot = percent * Math.PI / 2;
  //     // sArc.transform.updateRotation(totalRot);
  //     // sArc.transform.updateTranslation(
  //     //   1 - this.layout.radius * Math.cos(totalRot),
  //     //   - this.layout.radius * Math.sin(totalRot),
  //     // );
  //     sArc.transform.updateTranslation(
  //       this.layout.compare.arcOffset * percent,
  //       0,
  //     );
  //     this.varState.percentStraight = percent;
  //   }
  //   if (percent === 0) {
  //     this.resetColors();
  //   } else {
  //     this._circle._radius.color = this.colors.radiusLight.slice();
  //     this._circle._arc.color = this.colors.arcLight.slice();
  //   }
  // }
  // resetColors() {
  //   this._circle._radius.color = this.colors.radius.slice();
  //   this._circle._arc.color = this.colors.arc.slice();
  // }

  // animateEquation(
  //   leftSide: 'arc' | 'radius' | 'angle',
  //   scale: number,
  //   radiusMag: number,
  //   angleMag: number,
  //   arcMag: number,
  // ) {
  //   const arcOptions =
  //     this._arcEquation._arc.animate.transform.translation.options;
  //   const radiusOptions =
  //     this._arcEquation._radius.animate.transform.translation.options;
  //   const angleOptions =
  //     this._arcEquation._angle.animate.transform.translation.options;

  //   radiusOptions.direction = 'down';
  //   angleOptions.direction = 'down';
  //   angleOptions.magnitude = angleMag;
  //   radiusOptions.magnitude = radiusMag;
  //   arcOptions.magnitude = arcMag;
  //   arcOptions.direction = 'up';

  //   // const { scale } = this.layout.arcEquation;

  //   if (leftSide === 'arc') {
  //     this.arcEqn.animateTo(scale, 2, this._arcEquation._equals);
  //   } else if (leftSide === 'radius') {
  //     this.radiusEqn.animateTo(scale, 2, this._arcEquation._equals);
  //   } else if (leftSide === 'angle') {
  //     this.angleEqn.animateTo(scale, 2, this._arcEquation._equals);
  //   }
  //   this.diagram.animateNextFrame();
  // }

  rotateTo(
    angle: number,
    direction: number,
    time: number,
    callback: () => void = () => {},
  ) {
    let d = 1;
    if (typeof direction === 'number') {
      d = direction;
      if (d === 0) {
        const r = this._circle._radius.transform.r();
        d = 1;
        if (r) {
          const delta = minAngleDiff(angle, r);
          d = delta / Math.abs(delta);
        }
      }
    }
    let t = 1;
    if (typeof time === 'number') {
      t = time;
    }
    this._circle._radius.animateRotationTo(angle, d, t, callback);
    this.diagram.animateNextFrame();
  }

  // toggler(index: number) {
  //   this.toggleRadialLines(index);
  //   const elem12 = document.getElementById('id_12p');
  //   const elem100 = document.getElementById('id_100p');

  //   if (index && elem12 && elem100) {
  //     if (elem12.classList.contains('portions_selected')) {
  //       elem12.classList.remove('portions_selected');
  //     }

  //     elem100.classList.add('portions_selected');
  //   } else {
  //     if (elem100) {
  //       if (elem100.classList.contains('portions_selected')) {
  //         elem100.classList.remove('portions_selected');
  //       }
  //     }
  //     if (elem12) {
  //       elem12.classList.add('portions_selected');
  //     }
  //   }
  // }

  resetCircle(position: string = 'center', angle: ?number) {
    this._circle.transform.updateTranslation(this.layout.circle[position]);
    this._circle.transform.updateScale(1, 1);
    const r = this._circle._radius.transform.r();
    if (r != null && angle == null) {
      let newAngle = r;
      if (r < this.layout.circle.angle.small) {
        newAngle = this.layout.circle.angle.small;
      } else if (r > this.layout.circle.angle.large) {
        newAngle = this.layout.circle.angle.large;
      }
      this.setRotation(newAngle);
    } else if (angle != null) {
      this.setRotation(angle);
    }
  }

  transitionCircle(
    done: () => void,
    toPosition: string = 'center',
    toAngle: number | null = null,
    time: number = 5,
  ) {
    const t = this._circle.transform.t();
    const r = this._circle._radius.transform.r();
    // The time is the time it takes to rotate 360 degrees, or move laterally
    // from (0, 0) to the side edge of the screen
    // Therefore calculate the rotation and translation fractions of these
    // maximums and scale the time accordingly.
    let rTime = time;
    let tTime = time;
    if (t) {
      const tDelta = this.layout.circle[toPosition].sub(t);
      const { mag } = tDelta.toPolar();
      tTime *= mag / this.diagramLimits.width * 2;
    }
    if (tTime === 0) {
      tTime = 0.001;
    }

    let angle = this.layout.circle.angle.small;
    if (r != null && r !== undefined) {
      if (toAngle === null) {
        if (r < this.layout.circle.angle.small) {
          angle = this.layout.circle.angle.small;
        } else if (r > this.layout.circle.angle.large) {
          angle = this.layout.circle.angle.large;
        } else {
          angle = r;
        }
      } else {
        angle = toAngle;
      }
    }

    if (r !== null && r !== undefined) {
      const rStart = r;
      let rotDiff = angle - r;
      if (rStart + rotDiff < 0) {
        rotDiff = Math.PI * 2 + rotDiff;
      } else if (rStart + rotDiff > Math.PI * 2) {
        rotDiff = -(Math.PI * 2 - rotDiff);
      }

      rTime *= Math.abs(rotDiff / Math.PI / 2);
      // console.log(rStart, rotDiff, rTime)
    }
    if (rTime === 0) {
      rTime = 0.001;
    }
    const maxTime = Math.max(rTime, tTime);

    if (t && r !== null && r !== undefined) {
      if (t.isNotEqualTo(this.layout.circle[toPosition]) || r !== angle) {
        this.rotateTo(angle, 2, maxTime);
        this._circle.animateTranslationTo(
          this.layout.circle[toPosition],
          maxTime,
          done,
        );
        return;
      }
    }
    done();
  }
}

export default AngleCircle;
