// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
import { Point, Transform, minAngleDiff } from '../diagram/tools/g2';
import styles from './lessonStyle.scss';
import getSCSSColors from '../tools/css';

const colors = getSCSSColors(styles);
const anchorColor = colors.colorAnchor;
const radiusColor = colors.colorRadius;
const cornerColor = colors.colorCorners;
const referenceColor = colors.colorReference;
const anchorRadius = 0.03;
const anchorPoints = 50;
const circleRadius = 0.8;
const lineWidth = 0.02;
const cornerWidth = 0.04;
const cornerLength = 0.2;

type typeCircleDiagramCollection = {
  _anchor: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;
} & DiagramElementCollection ;

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
  // const radius = shapes.horizontalLine(
  //   new Point(0, 0), circleRadius, lineWidth,
  //   0, radiusColor, new Transform().rotate(0).translate(location.x, location.y),
  // );
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
class CircleDiagram extends Diagram {
  elements: typeCircleDiagramCollection;

  constructor(id: string) {
    super(`${id}_container`, -1, -1, 2, 2);
  }

  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();
    this.elements.isTouchable = true;
    this.elements.isMovable = true;

    const origin = new Point(0, 0);

    const reference = makeReference(shapes, origin);
    this.add('reference', reference);

    const radius = makeRadius(shapes, origin);
    radius.setTransformCallback = this.updateRotation.bind(this);
    this.add('radius', radius);

    const cornerRef = makeCorner(shapes, origin);
    this.add('cornerRef', cornerRef);

    const transform = new Transform().rotate(0).translate(origin.x, origin.y);
    const cornerRad = makeCorner(shapes, transform);
    this.add('cornerRad', cornerRad);

    const anchor = makeAnchor(shapes, origin);
    this.add('anchor', anchor);
  }

  updateRotation() {
    const rotation = this.elements._radius.transform.r();
    if (rotation) {
      this.elements._cornerRad.transform.updateRotation(rotation);
    }
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    const previousClipPoint = this.clientToClip(previousClientPoint);
    const currentClipPoint = this.clientToClip(currentClientPoint);
    const currentAngle = Math.atan2(currentClipPoint.y, currentClipPoint.x);
    const previousAngle = Math.atan2(previousClipPoint.y, previousClipPoint.x);
    const diffAngle = minAngleDiff(previousAngle, currentAngle);
    const transform = this.elements._radius.transform.copy();
    const rot = transform.r();
    if (rot != null) {
      transform.updateRotation(rot - diffAngle);
      this.elements._radius.moved(transform);
    }
    this.animateNextFrame();
    return true;
  }

  pulseAnchor() {
    this.elements._anchor.pulseScaleNow(1, 2);
    this.animateNextFrame();
  }

  pulseRadius() {
    this.elements._radius.pulseScaleNow(1, 2.5);
    this.animateNextFrame();
  }

  pulseReference() {
    this.elements._reference.pulseScaleNow(1, 2);
    this.animateNextFrame();
  }

  pulseLines() {
    this.pulseRadius();
    this.pulseReference();
  }

  toggleCorners() {
    if (this.elements._cornerRad.show) {
      this.elements._cornerRad.show = false;
      this.elements._cornerRef.show = false;
    } else {
      this.elements._cornerRad.show = true;
      this.elements._cornerRef.show = true;
      this.elements._cornerRad.pulseScaleNow(1, 2);
      this.elements._cornerRef.pulseScaleNow(1, 2);
    }
    this.animateNextFrame();
  }
}

export default CircleDiagram;
