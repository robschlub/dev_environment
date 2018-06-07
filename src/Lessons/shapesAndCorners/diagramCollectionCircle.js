// @flow

import Diagram from '../../js/diagram/Diagram';
import * as tools from '../../js/diagram/tools/mathtools';

import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point, Transform, minAngleDiff, normAngle } from '../../js/diagram/tools/g2';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';

const colors = getScssColors(styles);
const anchorPoints = 50;
const anglePoints = 400;

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

function makeRadius(shapes: Object, layout: Object) {
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

function makeAnchor(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anchorPoints, layout.linewidth * 2, 0,
    anchorPoints, colors.anchor, new Point(0, 0),
  );
}

function makeAngle(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.angleRadius, 0,
    anglePoints, colors.angle, new Point(0, 0),
  );
}

function makeReference(shapes: Object, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

function makeFakeRadius(shapes: Object, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

function makeCorner(shapes: Object, pointOrTransform: Point | Transform, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.cornerLength, layout.linewidth * 3,
    colors.corners, pointOrTransform,
  );
}

function makeArrow(shapes: Object, layout: Object) {
  return shapes.arrow(
    0.1, 0.04, 0.1, 0.04, colors.arrow,
    new Transform().rotate(0).translate(layout.arrow, 0),
  );
}

class CircleCollection extends DiagramElementCollection {
  _anchor: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _fakeRadius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;
  diagram: Diagram;
  layout: Object;
  colors: Object;

  constructor(diagram: Diagram, layout: Object, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.colors = colors;
    this.layout = layout;

    const { shapes } = diagram;

    const origin = new Point(0, 0);

    const arrow = makeArrow(shapes, layout);
    // arrow.pulseScaleNow(0, 1.2, 0.7);
    this.add('arrow', arrow);
    // this.pulseArrow();

    const angle = makeAngle(shapes, layout);
    this.add('angle', angle);

    const reference = makeReference(shapes, layout);
    this.add('reference', reference);

    const fakeRadius = makeFakeRadius(shapes, layout);
    this.add('fakeRadius', fakeRadius);

    const radius = makeRadius(shapes, layout);
    radius.setTransformCallback = this.updateRotation.bind(this);
    this.add('radius', radius);

    const cornerRef = makeCorner(shapes, origin, layout);
    this.add('cornerRef', cornerRef);

    const t = new Transform().rotate(0).translate(
      0,
      0,
    );
    const cornerRad = makeCorner(shapes, t, layout);
    this.add('cornerRad', cornerRad);

    const anchor = makeAnchor(shapes, layout);
    this.add('anchor', anchor);

    this.isTouchable = true;
    this.isMovable = true;
  }

  resize(locations: Object) {
    this.transform.updateTranslation(
      locations.circle.center.x,
      locations.circle.center.y,
    );
  }

  updateRotation() {
    let rotation = this._radius.transform.r();
    if (rotation) {
      if (rotation > Math.PI * 2) {
        rotation -= Math.PI * 2;
      }
      if (rotation < 0) {
        rotation += Math.PI * 2;
      }
      if (this._arrow.show) {
        const angleToDisappear = 0.35;
        if (rotation > angleToDisappear) {
          this._arrow.color[3] = 0;
          // this._arrow.show = false;
        } else {
          // this._arrow.show = true;
          this._arrow.color[3] = (angleToDisappear - rotation) / angleToDisappear;
          this._arrow.transform.updateRotation(rotation);
          this._arrow.transform.updateTranslation(
            this.layout.arrow * Math.cos(rotation),
            this.layout.arrow * Math.sin(rotation),
          );
        }
      }
      const r = normAngle(rotation);
      this._radius.transform.updateRotation(r);
      this._cornerRad.transform.updateRotation(r);
      this._angle.angleToDraw = r * 1.01;
    }
  }

  pulseArrow() {
    this._arrow.pulseScaleNow(0, 1.2, 0.7);
    this.diagram.animateNextFrame();
  }

  pulseAngle() {
    this._angle.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAnchor() {
    this._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseRadius() {
    this._radius.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseReference() {
    this._reference.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseFakeRadius() {
    this._fakeRadius.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseLines() {
    this.pulseRadius();
    this.pulseReference();
    this.pulseFakeRadius();
  }

  pushRadius() {
    const angle = this._radius.transform.r();
    let targetAngle = angle + Math.PI / 6;
    if (targetAngle > Math.PI * 2) {
      targetAngle -= Math.PI * 2;
    }
    this._radius.animateRotationTo(targetAngle, 1, 1);
    this.diagram.animateNextFrame();
  }
  rotateTo(
    angle: number,
    direction: number,
    time: number,
    callback: () => void = () => {},
  ) {
    let d = direction;
    if (d === 0) {
      const r = this._radius.transform.r();
      d = 1;
      if (r) {
        const delta = minAngleDiff(angle, r);
        d = delta / Math.abs(delta);
      }
    }
    this._radius.animateRotationTo(angle, d, time, tools.easeinout, callback);
    this.diagram.animateNextFrame();
  }

  toggleCorners() {
    if (this._cornerRad.show) {
      this._cornerRad.show = false;
      this._cornerRef.show = false;
    } else {
      this._cornerRad.show = true;
      this._cornerRef.show = true;
      this._cornerRad.pulseScaleNow(1, 2);
      this._cornerRef.pulseScaleNow(1, 2);
    }
    this.diagram.animateNextFrame();
  }
}

export default CircleCollection;
