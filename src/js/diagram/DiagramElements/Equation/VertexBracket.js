// @flow
import {
  Point, Transform, polarToRect,
} from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from '../../DrawingObjects/VertexObject/VertexObject';

// function range(start: number, stop: number, step: number) {
//   const out = [];
//   for (let i = start; i <= stop + step * 0.5; i += step) {
//     out.push(i);
//   }
//   return out;
// }

class VertexBracket extends VertexObject {
  height: number;

  constructor(
    webgl: WebGLInstance,
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
  ) {
    super(webgl);
    this.glPrimative = this.gl.TRIANGLE_STRIP;

    let r1 = 1;
    let r2 = 1.5;
    let w = 1 / 16;

    if (numLines === 2) {
      r1 = 1.5;
      r2 = 2;
      w = 1 / 25;
    }
    const mainHeight = 1;
    const p1 = new Point(r1, mainHeight / 2);
    const p2 = new Point(r2 + w, mainHeight / 2);
    const r1Angle = Math.asin(mainHeight / 2 / r1);
    const r2Angle = Math.asin(mainHeight / 2 / r2);
    const numSegments = 10;
    const r1AngleStep = r1Angle * 2 / numSegments;
    const r2AngleStep = r2Angle * 2 / numSegments;

    let r1Points = [];
    let r2Points = [];
    for (let i = 0; i <= numSegments; i += 1) {
      r1Points.push(polarToRect(r1, Math.PI - r1Angle + i * r1AngleStep).add(p1));
      r2Points.push(polarToRect(r2, Math.PI - r2Angle + i * r2AngleStep).add(p2));
    }

    if (side === 'right' || side === 'top' || side === 'bottom') {
      let t;
      const maxX = polarToRect(r2, Math.PI - r2Angle).add(p2).x;
      if (side === 'right') {
        t = new Transform().scale(-1, 1).translate(maxX, 0);
      }
      if (side === 'top') {
        t = new Transform()
          .translate(0, -mainHeight / 2)
          .rotate(-Math.PI / 2)
          .translate(mainHeight / 2, maxX);
      }
      if (side === 'bottom') {
        t = new Transform()
          .translate(0, -mainHeight / 2)
          .rotate(Math.PI / 2)
          .translate(mainHeight / 2, -maxX);
      }
      r1Points = r1Points.map(p => p.transformBy(t.m()));
      r2Points = r2Points.map(p => p.transformBy(t.m()));
    }

    this.points = [];
    r1Points.forEach((r1p, index) => {
      const r2p = r2Points[index];
      this.points.push(r1p.x);
      this.points.push(r1p.y);
      this.points.push(r2p.x);
      this.points.push(r2p.y);
    });

    this.border[0] = [];
    r1Points.forEach((p) => {
      this.border[0].push(p);
    });
    for (let i = r2Points.length - 1; i >= 0; i -= 1) {
      this.border[0].push(r2Points[i]);
    }

    this.setupBuffer();
  }
}
export default VertexBracket;

