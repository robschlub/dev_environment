// @flow

import {
  Point, Transform,
} from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from './VertexObject';

function makeDash(
  start: Point,
  length: number,
  width: number,
) {
  const p1 = start._dup();
  const p2 = start.add(new Point(0, width));
  const p3 = start.add(new Point(length, width));
  const p4 = start.add(new Point(length, 0));
  return [
    p1, p2, p3,
    p1, p3, p4,
  ];
}

class VertexHorizontalLine extends VertexObject {
  start: Point;
  constructor(
    webgl: WebGLInstance,
    start: Point = new Point(0, 0),
    length: number = 1,
    width: number = 0.1,
    rotation: number = 0,
    dashStyle: Array<number> = [],
  ): void {
    super(webgl);
    const cx = 0;
    const cy = 0 - width / 2.0;
    const points = [];
    if (dashStyle.length === 0
      || (dashStyle.length === 1 && dashStyle[0] === 1)
    ) {
      this.glPrimative = this.gl.TRIANGLE_STRIP;
      points.push(new Point(cx, cy));
      points.push(new Point(cx, cy + width));
      points.push(new Point(cx + length, cy));
      points.push(new Point(cx + length, cy + width));
      // this.points = [
      //   cx, cy,
      //   cx, cy + width,
      //   cx + length, cy,
      //   cx + length, cy + width,
      // ];
    } else {
      this.glPrimative = this.gl.TRIANGLES;
    }

    // rotate points
    const t = new Transform().rotate(rotation).translate(start.x, start.y);
    const transformedPoints = points.map(p => p.transformBy(t.matrix()));

    transformedPoints.forEach((p) => {
      this.points.push(p.x);
      this.points.push(p.y);
    });
    // for (let i = 0; i < this.points.length; i += 2) {
    //   const p = (new Point(this.points[i], this.points[i + 1]))
    //     .transformBy(t.matrix());
    //   this.points[i] = p.x;
    //   this.points[i + 1] = p.y;
    // }

    // const p = this.points;
    this.border[0] = [
      transformedPoints[0],
      transformedPoints[1],
      transformedPoints[transformedPoints.length - 1],
      transformedPoints[transformedPoints.length - 2],
      // new Point(p[0], p[1]),
      // new Point(p[2], p[3]),
      // new Point(p[6], p[7]),
      // new Point(p[4], p[5]),
    ];
    // for (let i = 0; i < this.points.length; i += 2) {
    //   this.border[0].push(new Point(this.points[i], this.points[i + 1]));
    // }
    this.border[0].push(this.border[0][0]._dup());
    this.setupBuffer();
  }
}

export default VertexHorizontalLine;
