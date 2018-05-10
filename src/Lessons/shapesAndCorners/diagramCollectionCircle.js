// @flow

import Diagram from '../../js/diagram/Diagram';
import * as tools from '../../js/diagram/tools/mathtools';

import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point, Transform, minAngleDiff, normAngle } from '../../js/diagram/tools/g2';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';

const colors = getScssColors(styles);
const anchorColor = colors.anchor;
const radiusColor = colors.radius;
const cornerColor = colors.corners;
const referenceColor = colors.reference;
// const anchorRadius = 0.03;
const anchorPoints = 50;
// const circleRadius = 0.9;
// const lineWidth = 0.02;
// const cornerWidth = 0.04;
// const cornerLength = 0.2;

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
    radiusColor, new Transform().rotate(0).translate(
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
    anchorPoints, layout.linewidth * 3, 0,
    anchorPoints, anchorColor, new Point(0, 0),
  );
}

function makeReference(shapes: Object, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    referenceColor, new Point(0, 0),
  );
}

function makeCorner(shapes: Object, pointOrTransform: Point | Transform, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius * 0.1, layout.linewidth * 3,
    cornerColor, pointOrTransform,
  );
}

// $FlowFixMe
class CircleCollection extends DiagramElementCollection {
  // elements: typeCircleDiagramCollection;
  _anchor: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;

  constructor(diagram: Diagram, layout: Object, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;

    const { shapes } = diagram;

    const origin = new Point(0, 0);

    const reference = makeReference(shapes, layout);
    this.add('reference', reference);

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
    const rotation = this._radius.transform.r();
    if (rotation) {
      const r = normAngle(rotation);
      this._radius.transform.updateRotation(r);
      this._cornerRad.transform.updateRotation(r);
    }
  }

  // touchMoveHandler(
  //   previousClientPoint: Point,
  //   currentClientPoint: Point,
  // ): boolean {
  //   if (this.beingMovedElements.length === 0) {
  //     return false;
  //   }
  //   const previousClipPoint = this.clientToClip(previousClientPoint);
  //   const currentClipPoint = this.clientToClip(currentClientPoint);
  //   const currentAngle = Math.atan2(currentClipPoint.y, currentClipPoint.x);
  //   const previousAngle = Math.atan2(previousClipPoint.y, previousClipPoint.x);
  //   const diffAngle = minAngleDiff(previousAngle, currentAngle);
  //   const transform = this._radius.transform.copy();
  //   const rot = transform.r();
  //   if (rot != null) {
  //     transform.updateRotation(rot - diffAngle);
  //     this._radius.moved(transform);
  //   }
  //   this.diagram.animateNextFrame();
  //   return true;
  // }

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

  pulseLines() {
    this.pulseRadius();
    this.pulseReference();
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