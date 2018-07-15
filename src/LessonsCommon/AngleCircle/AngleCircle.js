// @flow

import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point, Transform, minAngleDiff, normAngle } from '../../js/diagram/tools/g2';


type lineAngleType = {
  _arc: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  updateRotation: (number) => {};
} & DiagramElementCollection;

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
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _radialLinesDeg: DiagramElementCollection;
  _radialLinesRad: DiagramElementCollection;
  _compareRadius: DiagramElementPrimative;
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
  +varState: {
    radialLines: number,
    rotation: number,
  };
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
    circle.add('radialLinesDeg', this.makeMajorAndMinRadialMarks(36, 360));
    circle.add('radialLinesRad', this.makeRadialMarks(Math.PI * 2));
    circle.add('angle', this.makeAngleLine());
    circle.add('reference', this.makeReference());
    circle.add('circumference', this.makeCircumference());
    circle.add('arc', this.makeArc(this.layout.radius));
    circle.add('radius', this.makeRadius());
    circle.add('anchor', this.makeAnchor());
    return circle;
  }

  constructor(layout: Object, diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      rotation: 0,
      // percentStraight: 0,
      // straightening: false,
    };
    this.shapes = diagram.shapes;
    this.layout = layout;
    this.colors = this.layout.colors;
    this.add('circle', this.makeCircle());
    this.add('angleText', this.makeAngleText());
    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);
    this.isTouchable = true;
    this.isMovable = true;
    this._circle.isTouchable = true;
    this._circle.isMovable = true;
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
      this._circle._arc.angleToDraw = r + 0.01;
      this._circle._angle.updateRotation(r);
      this.updateNumSectionsText();
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
      this.hideRadians();
      this.showDegrees();
    } else {
      this.hideDegrees();
      this.showRadians();
    }
    this.updateNumSectionsText();
    this.diagram.animateNextFrame();
  }

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

  pulseAngle() {
    this._circle._angle._arc.pulseThickNow(1, 1.04, 7);
    this._circle._angle._arrow.pulseScaleNow(1, 1.5);
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

  pulseArc() {
    this._circle._arc.pulseThickNow(1, 1.04, 7);
    this.diagram.animateNextFrame();
  }

  pulseCircumference() {
    this._circle._circumference.pulseThickNow(1, 1.04, 7);
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