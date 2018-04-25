// @flow

import { Point, Transform } from '../tools/g2';
import WebGLInstance from '../webgl/webgl';
import VertexObject from './vertexObject';

class VertexHorizontalLine extends VertexObject {
  start: Point;
  constructor(
    webgl: WebGLInstance,
    start: Point = new Point(0, 0),
    length: number = 1,
    width: number = 0.1,
    rotation: number = 0,
  ): void {
    super(webgl);
    this.glPrimative = this.gl.TRIANGLE_STRIP;

    const cx = 0;
    const cy = 0 - width / 2.0;
    this.points = [
      cx, cy,
      cx, cy + width,
      cx + length, cy,
      cx + length, cy + width,
    ];
    // rotate points
    const t = new Transform().rotate(rotation).translate(start.x, start.y);
    for (let i = 0; i < this.points.length; i += 2) {
      const p = (new Point(this.points[i], this.points[i + 1]))
        .transformBy(t.matrix());
      this.points[i] = p.x;
      this.points[i + 1] = p.y;
    }

    for (let i = 0; i < this.points.length; i += 2) {
      this.border[0].push(new Point(this.points[i], this.points[i + 1]));
    }
    this.border[0].push(this.border[0][0].copy());
    this.setupBuffer();
  }
}

export default VertexHorizontalLine;
