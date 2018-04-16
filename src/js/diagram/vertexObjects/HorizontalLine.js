// @flow

import { Point } from '../g2';
import WebGLInstance from '../webgl';
import VertexObject from './vertexObject';

class HorizontalLine extends VertexObject {
  start: Point;
  constructor(
    webgl: WebGLInstance,
    start: Point = new Point(0, 0),
    length: number = 1,
    width: number = 0.1,
  ): void {
    super(webgl);
    this.glPrimative = this.gl.TRIANGLE_STRIP;
    const cx = start.x;
    const cy = start.y - width / 2.0;
    this.start = start.copy();
    this.points = [
      cx, cy,
      cx, cy + width,
      cx + length, cy,
      cx + length, cy + width,
    ];
    for (let i = 0; i < this.points.length; i += 2) {
      this.border[0].push(new Point(this.points[i], this.points[i + 1]));
    }
    this.border[0].push(this.border[0][0].copy());
    this.setupBuffer();
  }
}

export default HorizontalLine;
