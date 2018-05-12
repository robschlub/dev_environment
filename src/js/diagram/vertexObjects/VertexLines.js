// @flow

import { Point } from '../tools/g2';
import WebGLInstance from '../webgl/webgl';
import VertexObject from './vertexObject';

class VertexLines extends VertexObject {
  start: Point;
  constructor(
    webgl: WebGLInstance,
    linePairs: Array<Array<Point>>,
  ): void {
    super(webgl);
    this.glPrimative = this.gl.LINES;

    this.points = [];
    linePairs.forEach((line) => {
      const [p, q] = line;
      this.points.push(p.x);
      this.points.push(p.y);
      this.points.push(q.x);
      this.points.push(q.y);
    });

    this.border = [];

    this.setupBuffer();
  }
}

export default VertexLines;
