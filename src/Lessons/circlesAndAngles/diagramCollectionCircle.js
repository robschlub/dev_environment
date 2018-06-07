// @flow

import Diagram from '../../js/diagram/Diagram';
import * as tools from '../../js/diagram/tools/mathtools';
// import HTMLObject from '../../js/diagram/DrawingObjects/HTMLObject/HTMLObject';

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

function makeArc(shapes: Object, layout: Object) {
  return shapes.polygon(
    anglePoints, layout.radius, layout.linewidth, 0,
    anglePoints, colors.arc, new Point(0, 0),
  );
}

function makeCircle(shapes: Object, layout: Object) {
  return shapes.polygon(
    anglePoints, layout.radius, layout.linewidth, 0,
    anglePoints, colors.arc, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anchorPoints, layout.linewidth * 2, 0,
    anchorPoints, colors.anchor, new Point(0, 0),
  );
}

function makeWheel(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0,
    anglePoints, colors.anchor, new Point(0, 0),
    'static/wheel.png',
  );
}

function makeWheelShape(shapes: Object, layout: Object) {
  return shapes.polygon(
    202, layout.wheelSize, layout.linewidth, 0,
    202, colors.arc, new Point(0, 0),
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
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _fakeRadius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
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
    const t = new Transform().rotate(0).translate(0, 0);

    this.add('wheel', makeWheel(shapes, layout));
    this.add('wheelShape', makeWheelShape(shapes, layout));

    this.add('arrow', makeArrow(shapes, layout));
    this.add('angle', makeAngle(shapes, layout));
    this.add('reference', makeReference(shapes, layout));
    this.add('fakeRadius', makeFakeRadius(shapes, layout));
    this.add('arc', makeArc(shapes, layout));
    this.add('circle', makeCircle(shapes, layout));

    const radius = makeRadius(shapes, layout);
    radius.setTransformCallback = this.updateRotation.bind(this);
    this.add('radius', radius);
    this.add('cornerRef', makeCorner(shapes, origin, layout));
    this.add('cornerRad', makeCorner(shapes, t, layout));
    this.add('anchor', makeAnchor(shapes, layout));
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
      this._angle.angleToDraw = r + 0.01;
      this._arc.angleToDraw = r + 0.01;
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

  showWheelShape() {
    const t = this._wheel.transform.t();
    if (t) {
      this._wheelShape.show = true;
      this._wheelShape.transform.updateTranslation(t.x, t.y);
      // this._wheelShape.disolveIn(1);
    }
    this.diagram.animateNextFrame();
  }
}

export default CircleCollection;
