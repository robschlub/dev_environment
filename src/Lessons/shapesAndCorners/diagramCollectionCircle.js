// @flow

import Diagram from '../../js/diagram/Diagram';
import * as tools from '../../js/diagram/tools/mathtools';
import getCssVariables from '../../js/tools/getCssVariables';

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
const anchorRadius = 0.03;
const anchorPoints = 50;
const circleRadius = 0.9;
const lineWidth = 0.02;
const cornerWidth = 0.04;
const cornerLength = 0.2;

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

function makeRadius(shapes: Object, location: Point) {
  const radius = makeLine(
    shapes, location, circleRadius, lineWidth,
    radiusColor, new Transform().rotate(0).translate(location.x, location.y),
  );
  radius.isTouchable = true;
  radius.isMovable = true;
  radius.pulse.transformMethod = s => new Transform().scale(1, s);

  for (let i = 0; i < radius.vertices.border[0].length; i += 1) {
    radius.vertices.border[0][i].y *= 10;
  }
  return radius;
}

function makeAnchor(shapes: Object, location: Point) {
  return shapes.polygonFilled(
    anchorPoints, anchorRadius, 0,
    anchorPoints, anchorColor, location,
  );
}

function makeReference(shapes: Object, location: Point) {
  return makeLine(
    shapes, new Point(0, 0), circleRadius, lineWidth,
    referenceColor, location,
  );
}

function makeCorner(shapes: Object, pointOrTransform: Point | Transform) {
  return makeLine(
    shapes, new Point(0, 0), cornerLength, cornerWidth,
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

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;

    const { shapes } = diagram;

    const origin = new Point(0, 0);

    const reference = makeReference(shapes, origin);
    this.add('reference', reference);

    const radius = makeRadius(shapes, origin);
    radius.setTransformCallback = this.updateRotation.bind(this);
    this.add('radius', radius);

    const cornerRef = makeCorner(shapes, origin);
    this.add('cornerRef', cornerRef);

    const t = new Transform().rotate(0).translate(origin.x, origin.y);
    const cornerRad = makeCorner(shapes, t);
    this.add('cornerRad', cornerRad);

    const anchor = makeAnchor(shapes, origin);
    this.add('anchor', anchor);

    this.isTouchable = true;
    this.isMovable = true;

    const lessonVars = getCssVariables(
      'lesson__container_name',
      [
        'x-min',
        'x-max',
        'y-min',
        'y-max',
        'md-y-max',
      ],
      '--lessonvars-',
    );
    console.log(lessonVars);
    // const elem = document.getElementById('lesson__container_name');
    // console.log(elem);
    // const style = window.getComputedStyle(elem);
    // console.log(style.getPropertyValue('--lessonvar-sm-x-min'))
    // console.log(style.getPropertyValue('--lessonvar-md-x-min'))
    // console.log(style.getPropertyValue('--lessonvar-test'))
    // console.log(style)
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
