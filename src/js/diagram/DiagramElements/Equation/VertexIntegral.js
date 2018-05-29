// @flow

import { Point } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from '../../DrawingObjects/VertexObject/VertexObject';

function range(start: number, stop: number, step: number) {
  const out = [];
  for (let i = start; i <= stop; i += step) {
    out.push(i);
  }
  return out;
}

class VertexIntegral extends VertexObject {
  height: number;

  constructor(webgl: WebGLInstance) {
    super(webgl);
    this.glPrimative = this.gl.TRIANGLE_STRIP;

    const k = 20;
    const L = 1;
    const sigma = 0.06;
    const a = 0.005;
    const bias = 0.01;
    const xArray = range(-0.2, 0.2, 0.01);
    const yArray = xArray.map(x => L / (1 + Math.exp(-k * x)));
    const normDist = xArray.map(x => a /
      Math.sqrt(2 * Math.PI * sigma ** 2) *
      Math.exp(-(x ** 2) / (2 * sigma ** 2)));
    const xLeft = xArray.map((x, index) => x - normDist[index] - bias);
    const xRight = xArray.map((x, index) => x + normDist[index] + bias);

    const borderLeft = [];
    const borderRight = [];
    yArray.map((y, index) => {
      const pLeft = new Point(xLeft[index], y);
      const pRight = new Point(xRight[index], y);

      this.points.push(pLeft.x);
      this.points.push(pLeft.y);
      this.points.push(pRight.x);
      this.points.push(pRight.y);
      borderLeft.push(pLeft.copy());
      borderRight.push(pRight.copy());
      return undefined;
    });
    this.border[0] = borderLeft.concat(borderRight.reverse());
    this.border[0].push(this.border[0][0].copy());
    this.points[0] = new Point(0, 0);
    this.points[1] = new Point(0, 0.5);
    this.points[2] = new Point(0.5, 0.5);
    this.setupBuffer();
  }
}
export default VertexIntegral;

