// @flow

import Diagram from '../../../js/diagram/Diagram';
// import * as tools from '../../../js/diagram/tools/mathtools';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../../js/diagram/Element';
// import { DiagramFont } from '../../../js/diagram/DrawingObjects/TextObject/TextObject';
import { Point, Transform, minAngleDiff, normAngle } from '../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import makeSlider from '../../../LessonsCommon/slider';
import type { sliderType } from '../../../LessonsCommon/slider';

const layout = lessonLayout();
const { colors } = layout;


function makeLine(
  shapes: Object,
  location: Point,
  length: number,
  width: number,
  color: Array<number>,
  pointOrTransform: Point | Transform,
): DiagramElementPrimative {
  const line = shapes.horizontalLine(
    location, length, width,
    0, color, pointOrTransform,
  );
  line.pulse.transformMethod = s => new Transform().scale(1, s);
  return line;
}

function makeRadius(shapes: Object) {
  const radius = makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.radius, new Transform().rotate(0).translate(
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

function makeArc(shapes: Object, radius: number) {
  return shapes.polygon(
    layout.anglePoints, radius, layout.linewidth, 0, 1,
    layout.circlePoints, colors.arc, new Point(0, 0),
  );
}

type straightArcType = {
  _arc: DiagramElementPrimative;
  _line: DiagramElementPrimative;
} & DiagramElementCollection;

function makeStraightArc(shapes: Object) {
  const straightArc = shapes.collection(new Transform().rotate(0).translate(0, 0));
  const arc = makeArc(shapes, layout.radius);
  const line = makeLine(
    shapes, new Point(0, 0),
    layout.radius * 2 * Math.PI, layout.linewidth, colors.arc,
    new Transform().scale(1, 1).rotate(Math.PI / 2)
      .translate(layout.radius - layout.linewidth / 2, 0),
  );

  arc.angleToDraw = 0;
  straightArc.add('arc', arc);
  straightArc.add('line', line);

  return straightArc;
}

function makeCompareText(shapes: Object) {
  return shapes.htmlText(
    'Compare', 'id_compare_text', '',
    layout.compare.textPosition, 'middle', 'left',
  );
}

function makeCircumference(shapes: Object) {
  return shapes.polygon(
    layout.anglePoints, layout.radius, layout.linewidth, 0, 1,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object) {
  return shapes.polygonFilled(
    layout.anchorPoints, layout.linewidth * 2, 0,
    layout.anchorPoints, colors.anchor, new Point(0, 0),
  );
}

function makeAngle(shapes: Object) {
  return shapes.polygonFilled(
    layout.anglePoints, layout.angleRadius, 0,
    layout.anglePoints, colors.angle, new Point(0, 0),
  );
}

type lineAngleType = {
  _arc: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  updateRotation: (number) => {};
};

function makeAngleLine(shapes: Object) {
  const angle = shapes.collection(new Transform().translate(0, 0));
  const arc = makeArc(shapes, layout.angle.radius);
  arc.color = colors.angle.slice();
  const arrow = shapes.arrow(
    layout.angle.arrow.width, 0, layout.angle.arrow.height, 0,
    colors.angle, new Transform().rotate(0).translate(0, 0),
  );
  angle.add('arc', arc);
  angle.add('arrow', arrow);
  const arrowAngleAtArc =
    Math.asin(layout.angle.arrow.height / layout.angle.radius);

  angle.updateRotation = (r) => {
    if (r < arrowAngleAtArc) {
      arc.angleToDraw = r;
      arrow.color[3] = 0;
    } else {
      arc.angleToDraw = r - arrowAngleAtArc * 0.9;
      arrow.color[3] = 1;
    }
    const arrowTip = new Point(
      (layout.angle.radius - layout.linewidth / 4) * Math.cos(r),
      (layout.angle.radius - layout.linewidth / 4) * Math.sin(r),
    );
    arrow.transform.updateTranslation(arrowTip);
    arrow.transform.updateRotation(r - arrowAngleAtArc);
  };
  return angle;
}

type radiusToArcType = {
  _arc: DiagramElementPrimative;
  _line: DiagramElementPrimative;
  toArc: (number) => void;
} & DiagramElementCollection;
function makeRadiusToArc(shapes: Object) {
  const radiusToArc = shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(layout.radiusArc.radius - layout.linewidth / 2, 0));

  const arc = shapes.polygon(
    layout.anglePoints, layout.radiusArc.radius, layout.linewidth, 0, 1,
    Math.floor(layout.anglePoints / Math.PI / 2),
    colors.radiusLight, new Point(-layout.radiusArc.radius + layout.linewidth / 2, 0),
  );

  const line = makeLine(
    shapes, new Point(0, 0),
    layout.radiusArc.radius, layout.linewidth, colors.radiusLight,
    new Transform().scale(1, 1).rotate(Math.PI / 2)
      .translate(0, 0),
  );

  arc.angleToDraw = 0;
  radiusToArc.add('arc', arc);
  radiusToArc.add('line', line);

  radiusToArc.toArc = (percent: number) => {
    radiusToArc._line.transform.updateScale(1 - percent, 1);
    radiusToArc._arc.angleToDraw = percent;
    radiusToArc._arc.transform.updateTranslation(
      -layout.radiusArc.radius + layout.linewidth / 2,
      (1 - percent) * layout.radiusArc.radius,
    );
  };

  return radiusToArc;
}

type radiusOnArcType = {
  _r1: DiagramElementPrimative;
  _r2: DiagramElementPrimative;
  _r3: DiagramElementPrimative;
  _r4: DiagramElementPrimative;
  _r5: DiagramElementPrimative;
  _r6: DiagramElementPrimative;
  stepIn: (number) => void;
} & DiagramElementCollection;

function makeRadiusOnArc(shapes: Object) {
  const radiusArc = shapes.collection(new Transform().translate(0, 0));
  const r1 = shapes.polygon(
    layout.anglePoints, layout.radiusArc.radius, layout.linewidth, 0, 1,
    Math.floor(layout.anglePoints / Math.PI / 2) - 1, colors.radiusLight,
    new Transform().rotate(0),
  );
  radiusArc.add('r1', r1);
  radiusArc.add('r2', r1.copy(new Transform().rotate(1)));
  radiusArc.add('r3', r1.copy(new Transform().rotate(2)));
  radiusArc.add('r4', r1.copy(new Transform().rotate(3)));
  radiusArc.add('r5', r1.copy(new Transform().rotate(4)));
  radiusArc.add('r6', r1.copy(new Transform().rotate(5)));

  radiusArc.stepIn = (time: number) => {
    const timePerSegment = time / 6;
    radiusArc.hideAll();
    radiusArc.show();
    radiusArc._r1.show();
    radiusArc._r2.disolveInWithDelay(timePerSegment * 0.01, timePerSegment);
    radiusArc._r3.disolveInWithDelay(timePerSegment * 1, timePerSegment);
    radiusArc._r4.disolveInWithDelay(timePerSegment * 2, timePerSegment);
    radiusArc._r5.disolveInWithDelay(timePerSegment * 3, timePerSegment);
    radiusArc._r6.disolveInWithDelay(timePerSegment * 4, timePerSegment);
  };

  return radiusArc;
}

function makeReference(shapes: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

function makeRadialMarks(shapes: Object, num: number, minor: boolean = false) {
  let inner = layout.radialLineMajorInner;
  let outer = layout.radialLineMajorOuter;
  if (minor) {
    inner = layout.radialLineMinorInner;
    outer = layout.radialLineMinorOuter;
  }
  return shapes.radialLines(
    inner, outer,
    layout.radialLineWidth, Math.PI * 2 / num,
    colors.radialLines, new Transform().translate(0, 0),
  );
}

function makeMajorAndMinRadialMarks(
  shapes: Object,
  major: number,
  minor: number,
) {
  const collection = shapes.collection(new Transform().translate(0, 0));
  collection.add('minor', makeRadialMarks(shapes, minor, true));
  collection.add('major', makeRadialMarks(shapes, major, false));

  return collection;
}

type angleTextType = {
  text: DiagramElementPrimative;
  equals: DiagramElementPrimative;
  angle: DiagramElementPrimative;
  units: DiagramElementPrimative;
  setUnits: (string) => void;
} & DiagramElementCollection;
function makeAngleText(shapes: Object) {
  const angleText = shapes.collection(layout.angleEqualsText.left);
  angleText.add('text', shapes.htmlText(
    'Angle', 'id_angle_text', 'action_word',
    new Point(0, 0), 'middle', 'left',
  ));
  angleText.add('equals', shapes.htmlText(
    '=', 'id_angle_equals', '',
    new Point(0.45, 0), 'middle', 'left',
  ));
  angleText.add('angle', shapes.htmlText(
    '0', 'id_angle_value', '',
    new Point(0.85, 0), 'middle', 'right',
  ));
  angleText.add('units', shapes.htmlText(
    'portions', 'id_angle_units', '',
    new Point(0.87, 0), 'middle', 'left',
  ));
  angleText.setUnits = (units: string) => {
    if (units === '&deg;') {
      angleText._units.transform.updateTranslation(layout.angleEqualsText.units.deg, 0);
    } else {
      angleText._units.transform.updateTranslation(layout.angleEqualsText.units.text, 0);
    }
    angleText._units.vertices.element.innerHTML = units;
  };
  return angleText;
}

export type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: lineAngleType;
  _angleFill: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _radialLinesA: DiagramElementPrimative;
  _radialLinesB: DiagramElementCollection;
  _radialLinesDeg: DiagramElementCollection;
  _radialLinesRad: DiagramElementCollection;
  _compareRadius: DiagramElementPrimative;
  _straightArc: straightArcType;
  _radiusOnArc: radiusOnArcType;
  _radiusToArc: radiusToArcType;
} & DiagramElementCollection;


function makeCircle(numSections: Array<number>, shapes: Object) {
  const circle = shapes.collection(new Transform().scale(1, 1).translate(layout.circle.center));
  circle.add('angleFill', makeAngle(shapes));
  circle.add('angle', makeAngleLine(shapes));
  circle.add('radialLinesA', makeRadialMarks(shapes, numSections[0]));
  circle.add('radialLinesB', makeMajorAndMinRadialMarks(shapes, 10, numSections[1]));
  circle.add('radialLinesDeg', makeMajorAndMinRadialMarks(shapes, 36, 360));
  circle.add('radialLinesRad', makeRadialMarks(shapes, Math.PI * 2));
  circle.add('reference', makeReference(shapes));
  circle.add('arc', makeArc(shapes, layout.radius));
  circle.add('straightArc', makeStraightArc(shapes));
  circle.add('circumference', makeCircumference(shapes));
  circle.add('radius', makeRadius(shapes));
  circle.add('compareRadius', makeReference(shapes));
  circle.add('anchor', makeAnchor(shapes));
  circle.add('radiusOnArc', makeRadiusOnArc(shapes));
  circle.add('radiusToArc', makeRadiusToArc(shapes));
  return circle;
}

class CircleCollection extends DiagramElementCollection {
  _circle: circleCollectionType;
  // _sectionTitle: DiagramElementPrimative;
  _angleText: angleTextType;
  _slider: sliderType;
  varState: {
    radialLines: number,
    angleInSections: number,
    rotation: number,
    percentStraight: number,
    straightening: boolean,
  };
  numSections: Array<number>;
  diagram: Diagram;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      angleInSections: 0,
      rotation: 0,
      percentStraight: 0,
      straightening: false,
    };
    this.numSections = [12, 100];

    const { shapes } = diagram;
    this.add('compareText', makeCompareText(shapes));
    this.add('circle', makeCircle(this.numSections, shapes));
    // this.add('sectionTitle', makeSectionTitle(shapes));
    this.add('angleText', makeAngleText(shapes));
    this.add('slider', makeSlider(shapes, layout.slider));
    this._slider.setCallback(this.updateSlider.bind(this));

    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);

    this.isTouchable = true;
    this.isMovable = true;
    this._circle.isTouchable = true;
    this._circle.isMovable = true;
  }

  updateSlider() {
    const percent = 0.5 + this._slider.getValue() * 0.5;
    // this._circle._radius.transform.updateScale(percent, 1);
    // this._circle._arc.transform.updateScale(percent, percent);
    this._circle.transform.updateScale(percent, percent);
    this._slider._value.transform.updateScale(1, percent);
    if (this._circle._straightArc.isShown) {
      this.straighten(this.varState.percentStraight);
    }
    this.diagram.animateNextFrame();
  }
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
      this._circle._angleFill.angleToDraw = r + 0.01;
      this._circle._arc.angleToDraw = r + 0.01;
      this._circle._angle.updateRotation(r);
      this.updateNumSectionsText();
      if (this._circle._straightArc.isShown) {
        this.straighten(this.varState.percentStraight);
        // this._circle._compareRadius.transform.updateRotation(r);
      }
      // if (this._slider.isShown) {
      //   this._slider.transform.updateRotation(r);
      // }
    }
  }

  hideDegrees() {
    this._circle._radialLinesDeg.hideAll();
  }
  showDegrees() {
    this._circle._radialLinesDeg.showAll();
    this._angleText.showAll();
    this.varState.radialLines = 360;
    // this.setAngleUnits('&deg;');
    this._angleText.setUnits('&deg;');
    // this._angleText._units.vertices.element.innerHTML = ;
  }


  toggleDegreesRadians(show: 'deg' | 'rad') {
    if (show === 'deg') {
      this._circle._radiusOnArc.hideAll();
      this._circle._radiusToArc.hideAll();
      this.showDegrees();
    } else {
      this.hideDegrees();
      this._angleText.showAll();
      this._angleText.setUnits('radius lengths');
      this.varState.radialLines = Math.PI * 2;
      this.arcRadius();
    }
    this.updateNumSectionsText();
    this.diagram.animateNextFrame();
  }

  // setAngleUnits(units: string) {
  //   // $FlowFixMe
  //   this._angleText._units.vertices.element.innerHTML = units;
  // }

  updateNumSectionsText() {
    const r = this.varState.rotation;
    let angleInSections =
        Math.round((r / (Math.PI * 2 / this.varState.radialLines) * 10)) / 10;

    if (this.varState.radialLines === 360) {
      angleInSections = Math.floor(angleInSections);
    }
    // $FlowFixMe
    this._angleText._angle.vertices.element.innerHTML = `${angleInSections}`;
  }

  stepInRadiusOnArc() {
    this._circle._radiusOnArc.stepIn(3);
    this.diagram.animateNextFrame();
  }
  pulseAngleFill() {
    this._circle._angleFill.pulseScaleNow(1, 1.3);
    this.diagram.animateNextFrame();
  }

  pulseAngle() {
    this._circle._angle._arc.pulseThickNow(1, 1.04, 7);
    this._circle._angle._arrow.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }
  pulseRadiusOnArc() {
    this._circle._radiusOnArc._r1.pulseThickNow(1, 1.04, 7);
    this.diagram.animateNextFrame();
  }
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

  pulseRadialLines() {
    this._circle._radialLinesA.pulseScaleNow(1, 1.2);
    this.diagram.animateNextFrame();
  }

  pulseArc() {
    this._circle._arc.pulseThickNow(1, 1.04, 7);
    this.diagram.animateNextFrame();
  }

  pulseSlider() {
    this._slider._circle.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

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

  toggleRadialLines(toPosition: number = -1) {
    if (toPosition > 0) {
      this.varState.radialLines = this.numSections[toPosition - 1];
    } else if (toPosition === 0) {
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[1];
    }
    if (this.varState.radialLines === this.numSections[0]) {
      this._circle._radialLinesA.hide();
      this._circle._radialLinesB.showAll();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[1];
    } else if (this.varState.radialLines === this.numSections[1]) {
      this._circle._radialLinesB.hideAll();
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    } else {
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    }
    this.updateNumSectionsText();

    this.diagram.animateNextFrame();
  }

  arcRadius() {
    const r = this._circle._radius.transform.r();
    if (r !== null && r !== undefined) {
      this._circle._radiusOnArc.hideAll();
      this._circle._radiusToArc.stop();
      this._circle._radiusOnArc.stop();
      this._circle._radiusToArc.toArc(0);
      this._circle._radiusToArc.showAll();
      this._circle._radiusToArc.transform.updateRotation(Math.PI / 2);
      this._circle._radiusToArc.animateRotationTo(0, 0, 1.5, this.stepInRadiusOnArc.bind(this));
      this.animateCustomTo(this.bendRadius.bind(this), 1, 0);
      this.diagram.animateNextFrame();
    }
  }
  bendRadius(percent: number) {
    this._circle._radiusToArc.toArc(percent);
  }


  straightenArc() {
    const currentPercent = this.varState.percentStraight;
    if (!this.varState.straightening || currentPercent === 0) {
      this.animateCustomTo(this.straighten.bind(this), 1, currentPercent);
      this.varState.straightening = true;
    } else {
      this.animateCustomTo(this.bend.bind(this), 1, 1 - currentPercent);
      this.varState.straightening = false;
    }
    this.diagram.animateNextFrame();
  }

  bend(percent: number) {
    this.straighten(1 - percent);
  }

  straighten(percent: number) {
    const r = this._circle._radius.transform.r();
    // const s = this._circle.transform.s();
    const sArc = this._circle._straightArc;
    if (r !== null && r !== undefined) {
      const scale = percent * r / (Math.PI * 2);
      sArc._line.transform.updateScale(scale, 1);
      sArc._arc.angleToDraw = (1 - percent) * r;
      sArc._arc.transform.updateTranslation(
        0,
        scale * layout.radius * Math.PI * 2,
      );

      this._circle._compareRadius.transform
        .updateRotation(r + percent * (Math.PI / 2 - r));
      this._circle._compareRadius.transform.updateTranslation(
        percent * (layout.radius + layout.compare.radiusOffset),
        0,
      );
      // const totalRot = percent * Math.PI / 2;
      // sArc.transform.updateRotation(totalRot);
      // sArc.transform.updateTranslation(
      //   1 - layout.radius * Math.cos(totalRot),
      //   - layout.radius * Math.sin(totalRot),
      // );
      sArc.transform.updateTranslation(
        layout.compare.arcOffset * percent,
        0,
      );
      this.varState.percentStraight = percent;
    }
    if (percent === 0) {
      this.resetColors();
    } else {
      this._circle._radius.color = colors.radiusLight.slice();
      this._circle._arc.color = colors.arcLight.slice();
    }
  }
  resetColors() {
    this._circle._radius.color = colors.radius.slice();
    this._circle._arc.color = colors.arc.slice();
  }

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

  toggler(index: number) {
    this.toggleRadialLines(index);
    const elem12 = document.getElementById('id_12p');
    const elem100 = document.getElementById('id_100p');

    if (index && elem12 && elem100) {
      if (elem12.classList.contains('portions_selected')) {
        elem12.classList.remove('portions_selected');
      }

      elem100.classList.add('portions_selected');
    } else {
      if (elem100) {
        if (elem100.classList.contains('portions_selected')) {
          elem100.classList.remove('portions_selected');
        }
      }
      if (elem12) {
        elem12.classList.add('portions_selected');
      }
    }
  }

  resetCircle(position: string = 'center') {
    this._circle.transform.updateTranslation(layout.circle[position]);
    this._circle.transform.updateScale(1, 1);
  }

  transitionCircle(
    done: () => void,
    toPosition: string = 'center',
    toAngle: number = layout.circle.angle.small,
    time: number = 1,
  ) {
    const t = this._circle.transform.t();
    const r = this._circle._radius.transform.r();
    if (t && r !== null && r !== undefined) {
      if (t.isNotEqualTo(layout.circle[toPosition]) || r !== toAngle) {
        this.rotateTo(toAngle, 2, time);
        this._circle.animateTranslationTo(
          layout.circle[toPosition],
          time,
          done,
        );
        return;
      }
    }
    done();
  }
}

export default CircleCollection;
