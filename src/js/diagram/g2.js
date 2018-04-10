// @flow

// 2D geometry functions including:
//  - Point
//  - Line
//  - minAngleDiff
//  - normAngle

import { roundNum, decelerate } from './mathtools';
import { Console } from '../tools/tools';
import * as m2 from './m2';

// export type PointType = {
//   x: number;
//   y: number;
//   copy(): PointType;
//   // sub(): PointType;
//   // add(): PointType;
//   // distance(): number;
//   // round(): PointType;
//   // rotate(): PointType;
//   // isEqualTo: boolean;
//   // isNotEqualTo: boolean;
//   // isOnLine: boolean;
//   // isOnUnboundLine: boolean;
//   // console: void;
//   // isInPolygon: boolean;
//   // isOnPolygon: boolean;
// };

/* eslint-disable comma-dangle */
class Point {
  x: number;
  y: number;

  static zero() {
    return new Point(0, 0);
  }
  static Unity() {
    return new Point(1, 1);
  }
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy() {
    return new Point(this.x, this.y);
  }
  scale(scalar: number) {
    return new Point(this.x * scalar, this.y * scalar);
  }
  sub(q: Point) {
    return new Point(this.x - q.x, this.y - q.y);
  }
  add(q: Point) {
    return new Point(this.x + q.x, this.y + q.y);
  }
  distance() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  round(precision: number = 8) {
    return new Point(roundNum(this.x, precision), roundNum(this.y, precision));
  }

  transformBy(matrix: Array<number>) {
    const transformedPoint = m2.transform(matrix, this.x, this.y);
    return new Point(transformedPoint[0], transformedPoint[1]);
  }

  rotate(angle: number, center?: Point) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const matrix = [c, -s,
                    s, c]; // eslint-disable-line indent
    const centerPoint = center || new Point(0, 0);
    const pt = this.sub(centerPoint);
    return new Point(
      matrix[0] * pt.x + matrix[1] * pt.y + centerPoint.x,
      matrix[2] * pt.x + matrix[3] * pt.y + centerPoint.y
    );
  }
  /* eslint-enable comma-dangle */
  isEqualTo(q: Point, precision?: number) {
    let pr = this;
    let qr = q;

    if (typeof precision === 'number') {
      pr = this.round(precision);
      qr = qr.round(precision);
    }
    if (pr.x === qr.x && pr.y === qr.y) {
      return true;
    }
    return false;
  }
  isNotEqualTo(q: Point, precision?: number) {
    return !this.isEqualTo(q, precision);
  }
  /* eslint-disable no-use-before-define */
  isOnLine(l: Line, precision?: number) {
    return l.hasPointOn(this, precision);
  }
  isOnUnboundLine(l: Line, precision?: number) {
    return l.hasPointAlong(this, precision);
  }
  /* eslint-enable no-use-before-define */
  console(text?: string) {
    Console(`${text || ''} + ${this.x}, ${this.y}`);
  }

  static isLeft(p0: Point, p1: Point, p2: Point) {
    return (
      (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y)
    );
  }

  isInPolygon(polygonVertices: Array<Point>) {
    let windingNumber = 0;
    let n = polygonVertices.length - 1;
    const v = polygonVertices.slice();
    const p = this;
    let popLastPoint = false;
    // polygonVertices needs to have the last vertex the same as the first vertex
    if (v[0].isNotEqualTo(v[n])) {
      v.push(v[0]);
      popLastPoint = true;
      n += 1;
    }
    for (let i = 0; i < n; i += 1) {
      if (v[i].y <= p.y) {
        if (v[i + 1].y > p.y) {                // an upward crossing
          if (Point.isLeft(v[i], v[i + 1], p) > 0) { // P left of  edge
            windingNumber += 1;                // have  a valid up intersect
          }
        }
      } else if (v[i + 1].y <= p.y) {           // start y > P.y (no test needed)
        // a downward crossing
        if (Point.isLeft(v[i], v[i + 1], p) < 0) {    // P right of  edge
          windingNumber -= 1;      // have  a valid down intersect
        }
      }
    }
    if (popLastPoint) {
      v.pop();
    }
    if (windingNumber === 0) {
      return false;
    }
    return true;
  }

  isOnPolygon(polygonVertices: Array<Point>) {
    let popLastPoint = false;
    const p = this;
    let n = polygonVertices.length - 1;   // Number of sides
    const v = polygonVertices.slice();

    // polygonVertices needs to have the last vertex the same as the first vertex
    if (v[0].isNotEqualTo(v[n])) {
      v.push(v[0]);
      popLastPoint = true;
      n += 1;
    }

    for (let i = 0; i < n; i += 1) {
      // if(p.isEqualTo(v[i])) {
      //   return true;
      // }
      /* eslint-disable-next-line  no-use-before-define */
      const l = line(v[i], v[i + 1]);
      if (p.isOnLine(l)) {
        return true;
      }
    }
    if (p.isInPolygon(polygonVertices)) {
      return true;
    }

    if (popLastPoint) {
      v.pop();
    }
    return false;
  }
}

function point(x: number, y: number) {
  return new Point(x, y);
}

function pointinRect(q: Point, p1: Point, p2: Point, precision?: number) {
  if (precision === undefined || precision === null) {
    if (q.x >= Math.min(p1.x, p2.x) &&
       q.x <= Math.max(p1.x, p2.x) &&
       q.y >= Math.min(p1.y, p2.y) &&
       q.y <= Math.max(p1.y, p2.y)) {
      return true;
    }
  } else if (
    roundNum(q.x, precision) >= roundNum(Math.min(p1.x, p2.x), precision) &&
    roundNum(q.x, precision) <= roundNum(Math.max(p1.x, p2.x), precision) &&
    roundNum(q.y, precision) >= roundNum(Math.min(p1.y, p2.y), precision) &&
    roundNum(q.y, precision) <= roundNum(Math.max(p1.y, p2.y), precision)) {
    return true;
  }
  return false;
}

function distance(p1: Point, p2: Point) {
  return Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
}
function deg(angle: number) {
  return angle * 180 / Math.PI;
}

function minAngleDiff(angle1: number, angle2: number) {
  if (angle1 === angle2) {
    return 0;
  }
  return Math.atan2(Math.sin(angle1 - angle2), Math.cos(angle1 - angle2));
}

function normAngle(angle: number) {
  let newAngle = angle;
  while (newAngle >= Math.PI * 2.0) {
    newAngle -= Math.PI * 2.0;
  }
  while (newAngle < 0) {
    newAngle += Math.PI * 2.0;
  }
  return newAngle;
}

function Line(p1: Point, p2: Point) {
  this.p1 = p1.copy();
  this.p2 = p2.copy();
  this.A = p2.y - p1.y;
  this.B = p1.x - p2.x;
  this.C = this.A * p1.x + this.B * p1.y;
}
Line.prototype.round = function lineround(precision?: number = 8) {
  const lineRounded = new Line(this.p1, this.p2);
  lineRounded.A = roundNum(lineRounded.A, precision);
  lineRounded.B = roundNum(lineRounded.B, precision);
  lineRounded.C = roundNum(lineRounded.C, precision);
  return lineRounded;
};

Line.prototype.length = function linelength() {
  // return this.p1.sub(this.p2).distance();
  return distance(this.p1, this.p2);
};
/* eslint-disable comma-dangle */
Line.prototype.midpoint = function linemidpoint() {
  const length = this.length();
  const direction = this.p2.sub(this.p1);
  const angle = Math.atan2(direction.y, direction.x);
  const midpoint = point(
    this.p1.x + length / 2 * Math.cos(angle),
    this.p1.y + length / 2 * Math.sin(angle)
  );
  return midpoint;
};
/* eslint-enable comma-dangle */
Line.prototype.hasPointAlong = function linehasPointAlong(p: Point, precision?: number) {
  if (precision === undefined || precision === null) {
    if (this.C === this.A * p.x + this.B * p.y) {
      return true;
    }
  } else if (
    roundNum(this.C, precision) === roundNum(this.A * p.x + this.B * p.y, precision)
  ) {
    return true;
  }
  return false;
};

Line.prototype.hasPointOn = function linehasPointOn(p: Point, precision?: number) {
  if (this.hasPointAlong(p, precision)) {
    if (pointinRect(p, this.p1, this.p2, precision)) {
      return true;
    }
  }
  return false;
};

Line.prototype.isEqualTo = function lineisEqualTo(line2: Line, precision?: number) {
  let l1 = this;
  let l2 = line2;
  if (typeof precision === 'number') {
    l1 = l1.round(precision);
    l2 = l2.round(precision);
    l1.p1 = l1.p1.round(precision);
    l1.p2 = l1.p2.round(precision);
    l2.p1 = l2.p1.round(precision);
    l2.p2 = l2.p2.round(precision);
  }
  if (l1.A !== l2.A) {
    return false;
  }
  if (l1.B !== l2.B) {
    return false;
  }
  if (l1.C !== l2.C) {
    return false;
  }
  if (l1.p1.isNotEqualTo(l2.p1) && l1.p1.isNotEqualTo(l2.p2)) {
    return false;
  }
  if (l1.p2.isNotEqualTo(l2.p1) && l1.p2.isNotEqualTo(l2.p2)) {
    return false;
  }
  return true;
};

Line.prototype.isOnSameLineAs = function lineisOnSameLineAs(line2: Line, precision: number = 8) {
  const l1 = this.round(precision);
  const l2 = line2.round(precision);
  // If A and B are zero, then this is not a line
  if ((l1.A === 0 && l1.B === 0)
    ||
    (l2.A === 0 && l2.B === 0)) {
    return false;
  }
  // If A is 0, then it must be 0 on the other line. Similar with B
  if (l1.A !== 0) {
    const scale = l2.A / l1.A;
    if (l1.B * scale !== l2.B) {
      return false;
    }
    if (l1.C * scale !== l2.C) {
      return false;
    }
    return true;
  }
  if (l2.A !== 0) {
    const scale = l1.A / l2.A;
    if (l2.B * scale !== l1.B) {
      return false;
    }
    if (l2.C * scale !== l1.C) {
      return false;
    }
    return true;
  }
  if (l1.B !== 0) {
    const scale = l2.B / l1.B;
    if (l1.A * scale !== l2.A) {
      return false;
    }
    if (l1.C * scale !== l2.C) {
      return false;
    }
    return true;
  }
  if (l2.B !== 0) {
    const scale = l1.B / l2.B;
    if (l2.A * scale !== l1.A) {
      return false;
    }
    if (l2.C * scale !== l1.C) {
      return false;
    }
    return true;
  }
  return true;
};

Line.prototype.intersectsWith = function lineintersectsWith(line2: Line, precision: number = 8) {
  const l2 = line2; // line2.round(precision);
  const l1 = this;  // this.round(precision);
  const det = l1.A * l2.B - l2.A * l1.B;
  if (roundNum(det, precision) !== 0) {
    const i = point(0, 0);
    i.x = (l2.B * l1.C - l1.B * l2.C) / det;
    i.y = (l1.A * l2.C - l2.A * l1.C) / det;
    if (
      pointinRect(i, l1.p1, l1.p2, precision)
      &&
      pointinRect(i, l2.p1, l2.p2, precision)
    ) {
      return {
        onLine: true,
        inLine: true,
        intersect: i,
      };
    }
    return {
      onLine: true,
      inLine: false,
      intersect: i,
    };
  }
  if (det === 0 && (l1.isOnSameLineAs(l2, precision))) {
    // if the lines are colliner then:
    //   - if overlapping,
    //   - if partially overlapping: the intersect point is halfway between
    //     overlapping ends
    //   - if one line is within the other line, the intersect point is
    //     halfway between the midpoints
    //   - if not overlapping, the intersect point is halfway between the nearest ends
    // let l1 = this;
    if (
      !l1.p1.isOnLine(l2, precision) &&
      !l1.p2.isOnLine(l2, precision) &&
      !l2.p1.isOnLine(l1, precision) &&
      !l2.p2.isOnLine(l1, precision)
    ) {
      const line11 = new Line(l1.p1, l2.p1);
      const line12 = new Line(l1.p1, l2.p2);
      const line21 = new Line(l1.p2, l2.p1);
      const line22 = new Line(l1.p2, l2.p2);

      let i = line11.midpoint();
      let len = line11.length();
      if (line12.length() < len) {
        i = line12.midpoint();
        len = line12.length();
      }
      if (line21.length() < len) {
        i = line21.midpoint();
        len = line21.length();
      }
      if (line22.length() < len) {
        i = line22.midpoint();
        len = line22.length();
      }
      return {
        onLine: true,
        inLine: false,
        intersect: i,
      };
    }
    if (
      (
        l1.p1.isOnLine(l2, precision) &&
        l1.p2.isOnLine(l2, precision) &&
        (!l2.p1.isOnLine(l1, precision) || !l2.p2.isOnLine(l1, precision))
      )
      ||
      (
        l2.p1.isOnLine(l1, precision) &&
        l2.p2.isOnLine(l1, precision) &&
        (!l1.p1.isOnLine(l2, precision) || !l1.p2.isOnLine(l2, precision))
      )
    ) {
      const midLine = new Line(l1.midpoint(), l2.midpoint());
      return {
        onLine: true,
        inLine: true,
        intersect: midLine.midpoint(),
      };
    }
    let midLine;
    if (
      l1.p1.isOnLine(l2, precision) &&
      !l1.p2.isOnLine(l2, precision) &&
      l2.p1.isOnLine(l1, precision) &&
      !l2.p2.isOnLine(l1, precision)
    ) {
      midLine = new Line(l1.p1, l2.p1);
    }
    if (
      l1.p1.isOnLine(l2, precision) &&
      !l1.p2.isOnLine(l2, precision) &&
      !l2.p1.isOnLine(l1, precision) &&
      l2.p2.isOnLine(l1, precision)
    ) {
      midLine = new Line(l1.p1, l2.p2);
    }
    if (
      !l1.p1.isOnLine(l2, precision) &&
      l1.p2.isOnLine(l2, precision) &&
      l2.p1.isOnLine(l1, precision) &&
      !l2.p2.isOnLine(l1, precision)
    ) {
      midLine = new Line(l1.p2, l2.p1);
    }
    if (
      !l1.p1.isOnLine(l2, precision) &&
      l1.p2.isOnLine(l2, precision) &&
      !l2.p1.isOnLine(l1, precision) &&
      l2.p2.isOnLine(l1, precision)
    ) {
      midLine = new Line(l1.p2, l2.p2);
    }

    let i;

    if (midLine instanceof Line) {
      i = midLine.midpoint();
    }

    return {
      onLine: true,
      inLine: true,
      intersect: i,
    };
  }
  return {
    onLine: false,
    inLine: false,
    intersect: undefined,
  };
};

function line(p1: Point, p2: Point) {
  return new Line(p1, p2);
}

// function TransformCopy(transform) {
//     return new _transform(new point(transform.translation.x, transform.translation.y),
//                           transform.rotation,
//                           new point(transform.scale.x, transform.scale.y));
//     // return new _transformCopy (transform);
// }
// function OldTransform(translation = {x:0,y:0}, rotation = 0, scale = {x:0,y:0}) {
//     return new _transform(translation, rotation, scale);
// }
// function TransformZero() {
//     return new _transform(d2.point(0,0), 0, d2.point(1,1));
// }
// function _transformCopy (transform) {
//     return {
//         translation: new point(transform.translation.x, transform.translation.y),
//         rotation: transform.rotation,
//         scale: new point(transform.scale.x, transform.scale.y),
//     }
// }

// function normVelocityValue(velocity: number, max: number, min: number) {
//   let result = velocity;
//   if (velocity > -min && velocity < min) {
//     result = 0;
//   }
//   if (velocity > max) {
//     result = max;
//   }
//   if (velocity < -max) {
//     result = -max;
//   }
//   return result;
// }

// Clip a value to either max velocity, or 0 once under the minimum
// threashold.
//  * velocity: can be positive or negative
//  * maxVelocity will clip velocity to:
//      * |maxVelocity| if velocity > 0
//      * -|maxVelocity| if velcity < 0
//  * zeroThreshold will clip velocity to:
//       * 0 if velocity is larger than -|zeroThreshold| and smaller than
//         |zeroThreshold|.
function clipValue(
  value: number,
  zeroThreshold: number,
  maxValue: number,
) {
  let result = value;
  let zeroT = zeroThreshold;
  let maxV = maxValue;

  if (zeroT < 0) {
    zeroT = -zeroT;
  }
  if (maxV < 0) {
    maxV = -maxV;
  }
  if (value >= -zeroT && value <= zeroT) {
    result = 0;
  }
  if (value > maxV) {
    result = maxV;
  }
  if (value < -maxV) {
    result = -maxV;
  }
  return result;
}

class Rotation {
  r: number;
  constructor(angle) {
    this.r = angle;
  }
  matrix(): Array<number> {
    return m2.rotationMatrix(this.r);
  }
  sub(rotToSub: Rotation = new Rotation(0)): Rotation {
    return new Rotation(this.r - rotToSub.r);
  }

  round(precision: number = 8): Rotation {
    return new Rotation(roundNum(this.r, precision));
  }

  add(rotToAdd: Rotation = new Rotation(0)): Rotation {
    return new Rotation(this.r + rotToAdd.r);
  }

  mul(rotToMul: Rotation = new Rotation(1)): Rotation {
    return new Rotation(this.r * rotToMul.r);
  }
}

class Translation {
  x: number;
  y: number;

  constructor(tx: Point | number, ty: number) {
    if (tx instanceof Point) {
      this.x = tx.x;
      this.y = tx.y;
    } else {
      this.x = tx;
      this.y = ty;
    }
  }
  matrix(): Array<number> {
    return m2.translationMatrix(this.x, this.y);
  }

  sub(translationToSub: Translation = new Translation(0, 0)): Translation {
    return new Translation(
      this.x - translationToSub.x,
      this.y - translationToSub.y,
    );
  }

  add(translationToAdd: Translation = new Translation(0, 0)): Translation {
    return new Translation(
      this.x + translationToAdd.x,
      this.y + translationToAdd.y,
    );
  }

  mul(translationToMul: Translation = new Translation(1, 1)): Translation {
    return new Translation(
      this.x * translationToMul.x,
      this.y * translationToMul.y,
    );
  }

  round(precision: number = 8): Translation {
    return new Translation(
      roundNum(this.x, precision),
      roundNum(this.y, precision),
    );
  }
}

class Scale {
  x: number;
  y: number;

  constructor(sx: Point | number, sy: number) {
    if (sx instanceof Point) {
      this.x = sx.x;
      this.y = sx.y;
    } else {
      this.x = sx;
      this.y = sy;
    }
  }
  matrix(): Array<number> {
    return m2.scaleMatrix(this.x, this.y);
  }
  sub(scaleToSub: Scale = new Scale(0, 0)): Scale {
    return new Scale(
      this.x - scaleToSub.x,
      this.y - scaleToSub.y,
    );
  }

  round(precision: number = 8): Scale {
    return new Scale(
      roundNum(this.x, precision),
      roundNum(this.y, precision),
    );
  }

  add(scaleToAdd: Scale = new Scale(0, 0)): Scale {
    return new Scale(
      this.x + scaleToAdd.x,
      this.y + scaleToAdd.y,
    );
  }

  mul(scaleToMul: Scale = new Scale(1, 1)): Scale {
    return new Scale(
      this.x * scaleToMul.x,
      this.y * scaleToMul.y,
    );
  }
}

class Transform {
  order: Array<Translation | Rotation | Scale>;
  mat: Array<number>;
  index: number;

  constructor(order: Array<Translation | Rotation | Scale> = []) {
    this.order = order.slice();
    this.index = this.order.length;
    this.calcMatrix();
  }

  translate(x: number, y: number) {
    const translation = new Translation(x, y);
    const order = this.order.slice();

    if (this.index === this.order.length) {
      order.push(translation);
    } else {
      this.order[this.index] = translation;
      this.index += 1;
      this.calcMatrix();
      return this;
    }
    return new Transform(order);
  }

  rotate(r: number) {
    const rotation = new Rotation(r);
    const order = this.order.slice();
    if (this.index === this.order.length) {
      order.push(rotation);
    } else {
      this.order[this.index] = rotation;
      this.index += 1;
      this.calcMatrix();
      return this;
    }
    // this.order.push(new Rotation(r));
    // this.calcMatrix();
    return new Transform(order);
  }

  scale(x: number, y: number) {
    const scale = new Scale(x, y);
    const order = this.order.slice();

    if (this.index === this.order.length) {
      order.push(scale);
    } else {
      this.order[this.index] = scale;
      this.index += 1;
      this.calcMatrix();
      return this;
    }
    return new Transform(order);
  }

  calcMatrix() {
    let m = m2.identity();
    for (let i = this.order.length - 1; i >= 0; i -= 1) {
      m = m2.mul(m, this.order[i].matrix());
    }
    this.mat = m2.copy(m);
    return m;
  }

  update(index: number) {
    if (index < this.order.length) {
      this.index = index;
    }
    return this;
  }

  t(index: number = 0): ?Point {
    let count = 0;
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Translation) {
        if (count === index) {
          return new Point(t.x, t.y);
        }
        count += 1;
      }
    }
    return null;
  }

  updateTranslation(x: number | Point, yOrIndex: number = 0, index: number = 0) {
    let count = 0;
    let actualIndex = index;
    if (x instanceof Point) {
      actualIndex = yOrIndex;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Translation) {
        if (count === actualIndex) {
          this.order[i] = new Translation(x, yOrIndex);
          this.calcMatrix();
          return;
        }
        count += 1;
      }
    }
  }

  s(index: number = 0): ?Point {
    let count = 0;
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Scale) {
        if (count === index) {
          return new Point(t.x, t.y);
        }
        count += 1;
      }
    }
    return null;
  }

  updateScale(x: number | Point, yOrIndex: number = 0, index: number = 0) {
    let count = 0;
    let actualIndex = index;
    if (x instanceof Point) {
      actualIndex = yOrIndex;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Scale) {
        if (count === actualIndex) {
          this.order[i] = new Scale(x, yOrIndex);
          this.calcMatrix();
          return;
        }
        count += 1;
      }
    }
  }

  r(index: number = 0): ?number {
    let count = 0;
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Rotation) {
        if (count === index) {
          return t.r;
        }
        count += 1;
      }
    }
    return null;
  }

  updateRotation(r: number, index: number = 0): void {
    let count = 0;
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Rotation) {
        if (count === index) {
          this.order[i] = new Rotation(r);
          this.calcMatrix();
          return;
        }
        count += 1;
      }
    }
  }

  m(): Array<number> {
    return this.mat;
  }

  matrix(): Array<number> {
    return this.mat;
  }

  isSimilarTo(transformToCompare: Transform): boolean {
    if (transformToCompare.order.length !== this.order.length) {
      return false;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      if (this.order[i].constructor.name !==
          transformToCompare.order[i].constructor.name) {
        return false;
      }
    }
    return true;
  }

  // Subtract a transform from the current one.
  // If the two transforms have different order types, then just return
  // the current transform.
  sub(transformToSubtract: Transform = new Transform()): Transform {
    if (!this.isSimilarTo(transformToSubtract)) {
      return new Transform(this.order);
    }
    const order = [];
    for (let i = 0; i < this.order.length; i += 1) {
      // $FlowFixMe (this is already fixed in isSimilarTo check above)
      order.push(this.order[i].sub(transformToSubtract.order[i]));
    }
    return new Transform(order);
  }

  // Add a transform to the current one.
  // If the two transforms have different order types, then just return
  // the current transform.
  add(transformToAdd: Transform = new Transform()): Transform {
    if (!this.isSimilarTo(transformToAdd)) {
      return new Transform(this.order);
    }
    const order = [];
    for (let i = 0; i < this.order.length; i += 1) {
      // $FlowFixMe (this is already fixed in isSimilarTo check above)
      order.push(this.order[i].add(transformToAdd.order[i]));
    }
    return new Transform(order);
  }

  // Add a transform to the current one.
  // If the two transforms have different order types, then just return
  // the current transform.
  mul(transformToMul: Transform = new Transform()): Transform {
    if (!this.isSimilarTo(transformToMul)) {
      return new Transform(this.order);
    }
    const order = [];
    for (let i = 0; i < this.order.length; i += 1) {
      // $FlowFixMe (this is already fixed in isSimilarTo check above)
      order.push(this.order[i].mul(transformToMul.order[i]));
    }
    return new Transform(order);
  }


  round(precision: number = 8): Transform {
    const order = [];
    for (let i = 0; i < this.order.length; i += 1) {
      order.push(this.order[i].round(precision));
    }
    return new Transform(order);
  }

  clip(zeroThresholdTransform: Transform, maxTransform: Transform): Transform {
    // const min = 0.00001;
    // const max = 1 / min;
    // const zeroS = zeroThresholdTransform.s() || new Point(min, min);
    // const zeroR = zeroThresholdTransform.r() || min;
    // const zeroT = zeroThresholdTransform.t() || new Point(min, min);
    // const maxS = maxTransform.s() || new Point(max, max);
    // const maxR = maxTransform.r() || max;
    // const maxT = maxTransform.t() || new Point(max, max);
    // if (!this.isSimilarTo(zeroThresholdTransform) ||
    //     !this.isSimilarTo(maxTransform)) {
    //   return new Transform(this.order);
    // }
    const order = [];

    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      const z = zeroThresholdTransform.order[i];
      const max = maxTransform.order[i];
      if (t instanceof Translation &&
          z instanceof Translation &&
          max instanceof Translation) {
        const x = clipValue(t.x, z.x, max.x);
        const y = clipValue(t.y, z.y, max.y);
        order.push(new Translation(x, y));
      } else if (t instanceof Rotation &&
                 z instanceof Rotation &&
                 max instanceof Rotation) {
        const r = clipValue(t.r, z.r, max.r);
        order.push(new Rotation(r));
      } else if (t instanceof Scale &&
                 z instanceof Scale &&
                 max instanceof Scale) {
        const x = clipValue(t.x, z.x, max.x);
        const y = clipValue(t.y, z.y, max.y);
        order.push(new Scale(x, y));
      }
    }
    return new Transform(order);
  }

  constant(constant: number = 0): Transform {
    const order = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Translation) {
        order.push(new Translation(constant, constant));
      } else if (t instanceof Rotation) {
        order.push(new Rotation(constant));
      } else if (t instanceof Scale) {
        order.push(new Scale(constant, constant));
      }
    }
    return new Transform(order);
  }

  zero(): Transform {
    return this.constant(0);
  }

  isZero(): boolean {
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      if (t instanceof Translation || t instanceof Scale) {
        if (t.x !== 0 || t.y !== 0) {
          return false;
        }
      } else if (t instanceof Rotation) {
        if (t.r !== 0) {
          return false;
        }
      }
    }
    return true;
  }
  copy(): Transform {
    return new Transform(this.order);
  }

  decelerate(
    velocity: Transform,
    deceleration: Transform,
    deltaTime: number,
    zeroThreshold: Transform,
  ): { v: Transform, t: Transform } {
    let nextV = new Transform();
    let nextT = new Transform();
    for (let i = 0; i < this.order.length; i += 1) {
      const t = this.order[i];
      const v = velocity.order[i];
      const z = zeroThreshold.order[i];
      const d = deceleration.order[i];
      if (t instanceof Translation && v instanceof Translation &&
          d instanceof Translation && z instanceof Translation) {
        const x = decelerate(t.x, v.x, d.x, deltaTime, z.x);
        const y = decelerate(t.y, v.y, d.y, deltaTime, z.y);
        nextV = nextV.translate(x.v, y.v);
        nextT = nextT.translate(x.p, y.p);
      } else if (t instanceof Rotation && v instanceof Rotation &&
                 d instanceof Rotation && z instanceof Rotation) {
        const r = decelerate(t.r, v.r, d.r, deltaTime, z.r);
        nextV = nextV.rotate(r.v);
        nextT = nextT.rotate(r.p);
      } else if (t instanceof Scale && v instanceof Scale &&
                 d instanceof Scale && z instanceof Scale) {
        const x = decelerate(t.x, v.x, d.x, deltaTime, z.x);
        const y = decelerate(t.y, v.y, d.y, deltaTime, z.y);
        nextV = nextV.scale(x.v, y.v);
        nextT = nextT.scale(x.p, y.p);
      } else {
        return { v: new Transform(), t: new Transform() };
      }
    }
    return { v: nextV, t: nextT };
  }

  // Return the velocity of each element in the transform
  // If the current and previous transforms are inconsistent in type order,
  // then a transform of value 0, but with the same type order as "this" will
  // be returned.
  velocity(
    previousTransform: Transform,
    deltaTime: number,
    zeroThreshold: Transform,
    maxTransform: Transform,
  ): Transform {
    const order = [];
    if (!this.isSimilarTo(previousTransform)) {
      return this.zero();
    }

    const deltaTransform = this.sub(previousTransform);
    for (let i = 0; i < deltaTransform.order.length; i += 1) {
      const t = deltaTransform.order[i];
      if (t instanceof Translation) {
        order.push(new Translation(t.x / deltaTime, t.y / deltaTime));
      } else if (t instanceof Rotation) {
        order.push(new Rotation(t.r / deltaTime));
      } else if (t instanceof Scale) {
        order.push(new Scale(t.x / deltaTime, t.y / deltaTime));
      }
    }
    const v = new Transform(order);

    let z = zeroThreshold;
    let m = maxTransform;
    if (!this.isSimilarTo(zeroThreshold)) {
      z = this.constant(0);
    }
    if (!this.isSimilarTo(maxTransform)) {
      m = v.copy();
    }
    return v.clip(z, m);
  }
}

class OldTransform {
  translation: Point;
  rotation: number;
  scale: Point;
  // tx: number;
  // ty: number;
  // r: number;
  // sx: number;
  // sy: number;

  static Zero() {
    return new OldTransform(Point.zero(), 0, new Point(0, 0));
  }
  static Unity() {
    return new OldTransform(Point.zero(), 0, new Point(1, 1));
  }

  constructor(
    translation: Point = Point.zero(),
    rotation: number = 0,
    scale: Point = Point.zero(),
  ) {
    this.translation = new Point(translation.x, translation.y);
    this.rotation = rotation;
    this.scale = new Point(scale.x, scale.y);
    // this.tx = this.translation.x;
    // this.ty = this.translation.y;
    // this.sx = this.scale.x;
    // this.sy = this.scale.y;
    // this.r = this.rotation;
  }

  add(transformToAdd: OldTransform = OldTransform.Zero()) {
    return new OldTransform(
      this.translation.add(transformToAdd.translation),
      this.rotation + transformToAdd.rotation,
      this.scale.add(transformToAdd.scale),
    );
  }

  sub(transformToSubtract: OldTransform = OldTransform.Zero()) {
    return new OldTransform(
      this.translation.sub(transformToSubtract.translation),
      minAngleDiff(this.rotation, transformToSubtract.rotation),
      this.scale.sub(transformToSubtract.scale),
    );
  }

  copy() {
    return new OldTransform(
      new Point(this.translation.x, this.translation.y),
      this.rotation,
      new Point(this.scale.x, this.scale.y),
    );
  }

  matrix() {
    let transformMatrix = m2.identity();
    transformMatrix = m2.translate(transformMatrix, this.translation.x, this.translation.y);
    transformMatrix = m2.rotate(transformMatrix, this.rotation);
    transformMatrix = m2.scale(transformMatrix, this.scale.x, this.scale.y);
    return transformMatrix;
  }

  clip(zeroThresholdTransform: OldTransform, maxTransform: OldTransform) {
    const mt = maxTransform;
    const ztt = zeroThresholdTransform;
    const result = new OldTransform();
    result.translation.x =
      clipValue(this.translation.x, ztt.translation.x, mt.translation.x);
    result.translation.y =
      clipValue(this.translation.y, ztt.translation.y, mt.translation.y);
    result.rotation = clipValue(this.rotation, ztt.rotation, mt.rotation);
    result.scale.x =
      clipValue(this.scale.x, ztt.scale.x, mt.scale.x);
    result.scale.y =
      clipValue(this.scale.y, ztt.scale.y, mt.scale.y);
    return result;
  }

  velocity(
    oldTransform: OldTransform,
    deltaTime: number,
    zeroThreshold: OldTransform,
    maxTransform: OldTransform,
  ) {
    const deltaTransform = this.sub(oldTransform);
    deltaTransform.translation.x /= deltaTime;
    deltaTransform.translation.y /= deltaTime;
    deltaTransform.scale.x /= deltaTime;
    deltaTransform.scale.y /= deltaTime;
    deltaTransform.rotation /= deltaTime;
    return deltaTransform.clip(zeroThreshold, maxTransform);
  }

  map(func: (number)=> number) {
    const result = this.copy();
    result.translation.x = func(this.translation.x);
    result.translation.y = func(this.translation.y);
    result.rotation = func(this.rotation);
    result.scale.x = func(this.scale.x);
    result.scale.y = func(this.scale.y);
    return result;
  }
  round(precision: number = 8) {
    const result = this.copy();
    result.translation = result.translation.round(precision);
    result.scale = result.scale.round(precision);
    result.rotation = roundNum(result.rotation, precision);
    return result;
  }
}

export {
  point,
  Point,
  line,
  Line,
  minAngleDiff,
  deg,
  normAngle,
  OldTransform,
  clipValue,
  Transform,
};
