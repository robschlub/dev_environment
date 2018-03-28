// @flow

import { roundNum } from './mathtools';
import { Console } from '../tools/tools';

/* eslint-disable comma-dangle */
function Point(x: number, y: number) {
  this.x = x;
  this.y = y;
}
Point.prototype.copy = function pointCopy() {
  return new Point(this.x, this.y);
};
Point.prototype.sub = function pointSub(q: Point) {
  return new Point(this.x - q.x, this.y - q.y);
};
Point.prototype.add = function pointAdd(q: Point) {
  return new Point(this.x + q.x, this.y + q.y);
};
Point.prototype.distance = function pointDistance() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.round = function pointRound(precision: number = 8) {
  return new Point(roundNum(this.x, precision), roundNum(this.y, precision));
};
Point.prototype.rotate = function pointRotate(angle, center?: Point) {
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
};
/* eslint-enable comma-dangle */
Point.prototype.isEqualTo = function pointIsEqualTo(q: Point, precision?: number) {
  let pr = this;
  let qr = q;
  if (precision) {
    pr = this.round(precision);
    qr = qr.round(precision);
  }
  if (pr.x === qr.x && pr.y === qr.y) {
    return true;
  }
  return false;
};
Point.prototype.isNotEqualTo = function pointIsNotEqualTo(q: Point, precision?: number) {
  return !this.isEqualTo(q, precision);
};
/* eslint-disable no-use-before-define */
Point.prototype.isOnLine = function pointIsOnLine(l: Line, precision?: number) {
  return l.hasPointOn(this, precision);
};
Point.prototype.isOnUnboundLine = function pointIsOnUnboundLine(l: Line, precision?: number) {
  return l.hasPointAlong(this, precision);
};
/* eslint-enable no-use-before-define */
Point.prototype.console = function console(text?: string) {
  Console(`${text || ''} + ${this.x}, ${this.y}`);
};
function isLeft(p0: Point, p1: Point, p2: Point) {
  return (
    (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y)
  );
}
Point.prototype.isInPolygon = function pointIsInPolygon(polygonVertices: Array<Point>) {
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
        if (isLeft(v[i], v[i + 1], p) > 0) { // P left of  edge
          windingNumber += 1;                // have  a valid up intersect
        }
      }
    } else if (v[i + 1].y <= p.y) {           // start y > P.y (no test needed)
      // a downward crossing
      if (isLeft(v[i], v[i + 1], p) < 0) {    // P right of  edge
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
};

Point.prototype.isOnPolygon = function pointIsOnPolygon(polygonVertices: Array<Point>) {
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
};

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

function distance(p1, p2) {
  return Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
}
// function deg(angle) {
//   return angle * 180 / Math.PI;
// }
// function minAngleDiff(angle1, angle2) {
//   return Math.atan2(Math.sin(angle1-angle2), Math.cos(angle1-angle2));
// }

// function normAngle (angle) {
//   let newAngle = angle;
//   while (newAngle >= Math.PI*2.0) {
//     newAngle -= Math.PI*2.0;
//   }
//   while (newAngle < 0) {
//     newAngle += Math.PI*2.0;
//   }
//   return newAngle;
// }

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
  if (precision instanceof Number) {
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


export { point, Point, line, Line };

// export {
//   point,
//   // line,
//   // distance,
//   // minAngleDiff,
//   // deg,
//   // normAngle,
// };
