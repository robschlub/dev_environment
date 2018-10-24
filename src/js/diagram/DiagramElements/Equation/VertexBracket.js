// @flow

import {
  Point, Transform, polarToRect,
} from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from '../../DrawingObjects/VertexObject/VertexObject';

function range(start: number, stop: number, step: number) {
  const out = [];
  for (let i = start; i <= stop + step * 0.5; i += step) {
    out.push(i);
  }
  return out;
}

class VertexBracket extends VertexObject {
  height: number;

  constructor(
    webgl: WebGLInstance,
    side: 'left' | 'right',
    numLines: number = 1,
    // serif: boolean = true,
  ) {
    super(webgl);
    this.glPrimative = this.gl.TRIANGLE_STRIP;
    numLines = 2;

    let r1 = 1;
    let r2 = 1.5;
    let w = 1 / 16;

    if (numLines === 2) {
      r1 = 1.5;
      r2 = 2;
      w = 1 / 25;
    }
    // const r1 = 4 / 4 * numLines;
    // const r2 = 6 / 4 * numLines;
    // const w = 0.25 / 4 * widthMultiplier;
    const mainHeight = 1;
    const p1 = new Point(r1, mainHeight / 2);
    const p2 = new Point(r2 + w, mainHeight / 2);
    const r1Angle = Math.asin(mainHeight / 2 / r1);
    const r2Angle = Math.asin(mainHeight / 2 / r2);
    const numSegments = 10;
    const r1AngleStep = r1Angle * 2 / numSegments;
    const r2AngleStep = r2Angle * 2 / numSegments;

    const r1Points = [];
    const r2Points = [];
    for (let i = 0; i <= numSegments; i += 1) {
      r1Points.push(polarToRect(r1, Math.PI - r1Angle + i * r1AngleStep).add(p1));
      r2Points.push(polarToRect(r2, Math.PI - r2Angle + i * r2AngleStep).add(p2));
    }
    console.log(r1Points, r2Points)
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

    // const points = [
    //   new Point(0, 0),
    //   new Point(0.1, 0),
    //   new Point(0.1, 1),
    //   new Point(0, 1),
    // ];
    // this.points = [];
    // points.forEach((p) => {
    //   this.points.push(p.x);
    //   this.points.push(p.y);
    //   this.border[0].push(p);
    // });
    // let mul = 0.5;
    // if (lineHeight === 1) {
    //   mul = 1;
    // }
    // const serif = true;
    // let mul = 0.3;
    // if (lineHeight < 5) {
    //   mul = 1 - Math.log(lineHeight) / 2;
    // }
    // const k = 20;
    // const L = 1;
    // const sigma = 0.07;
    // const a = 0.003 * mul;
    // const bias = 0.01 * mul;
    // const xArray = range(-0.18, 0.18, 0.01);
    // const yArray = xArray.map(x => L / (1 + Math.exp(-k * x)));
    // const normDist = xArray.map(x => a / Math.sqrt(2 * Math.PI * sigma ** 2)
    //                                  * Math.exp(-(x ** 2) / (2 * sigma ** 2)));
    // const xLeft = xArray.map((x, index) => x - normDist[index] - bias);
    // const xRight = xArray.map((x, index) => x + normDist[index] + bias);
    // const serifRadius = 0.03 * mul;
    // const serifPoints = 30;

    // // calculate upper serif properites
    // const num = xLeft.length;
    // const upperSerifPoint = new Point(xLeft[num - 1], yArray[num - 1]);
    // const gradient = k * yArray[num - 1] * (L - yArray[num - 1]);
    // const theta = Math.atan(gradient);
    // const alpha = Math.PI / 2 - theta;

    // const center = upperSerifPoint.add(new Point(
    //   serifRadius * Math.cos(alpha),
    //   -serifRadius * Math.sin(alpha),
    // ));
    // const dAngle = Math.PI * 2 / (serifPoints - 1);
    // const startAngle = Math.PI / 2 + theta;

    // // calculate lower serif properties
    // const lowerSerifCenter = new Point(-center.x, L - center.y);
    // const lowerSerifStartAngle = -alpha;

    // // lower serif
    // if (serif) {
    //   this.border.push([]);
    //   this.border.push([]);
    //   for (let i = 0; i < serifPoints; i += 1) {
    //     this.points.push(lowerSerifCenter.x);
    //     this.points.push(lowerSerifCenter.y);
    //     const angle = lowerSerifStartAngle + dAngle * i;
    //     const perimeterPoint = new Point(
    //       lowerSerifCenter.x + serifRadius * Math.cos(angle),
    //       lowerSerifCenter.y + serifRadius * Math.sin(angle),
    //     );
    //     this.points.push(perimeterPoint.x);
    //     this.points.push(perimeterPoint.y);
    //     this.border[1].push(perimeterPoint);
    //   }
    // }

    // const borderLeft = [];
    // const borderRight = [];
    // yArray.map((y, index) => {
    //   const pLeft = new Point(xLeft[index], y);
    //   const pRight = new Point(xRight[index], y);

    //   this.points.push(pRight.x);
    //   this.points.push(pRight.y);
    //   this.points.push(pLeft.x);
    //   this.points.push(pLeft.y);
    //   borderLeft.push(pLeft._dup());
    //   borderRight.push(pRight._dup());
    //   return undefined;
    // });

    // // upper serif
    // if (serif) {
    //   for (let i = 0; i < serifPoints; i += 1) {
    //     this.points.push(center.x);
    //     this.points.push(center.y);
    //     const angle = startAngle + dAngle * i;
    //     const perimeterPoint = new Point(
    //       center.x + serifRadius * Math.cos(angle),
    //       center.y + serifRadius * Math.sin(angle),
    //     );
    //     this.points.push(perimeterPoint.x);
    //     this.points.push(perimeterPoint.y);
    //     this.border[2].push(perimeterPoint);
    //   }
    // }

    // this.border[0] = borderLeft.concat(borderRight.reverse());
    // this.border[0].push(this.border[0][0]._dup());

    // // normalize all points to have bottom left corner at 0,0
    // // and height to be 1.
    // const bounds = this.getGLBoundingRect(new Transform().matrix());
    // const t = new Transform()
    //   .translate(-bounds.left, -bounds.bottom)
    //   .scale(1 / bounds.height, 1 / bounds.height);

    // for (let i = 0; i < this.border.length; i += 1) {
    //   const border = this.border[i];
    //   for (let j = 0; j < border.length; j += 1) {
    //     this.border[i][j] = this.border[i][j].transformBy(t.matrix());
    //   }
    // }

    // for (let i = 0; i < this.points.length; i += 2) {
    //   const p = new Point(this.points[i], this.points[i + 1]);
    //   const newP = p.transformBy(t.matrix());
    //   this.points[i] = newP.x;
    //   this.points[i + 1] = newP.y;
    // }

    // this.points[0] = new Point(0, 0);
    // this.points[1] = new Point(0, 0.5);
    // this.points[2] = new Point(0.5, 0.5);
    this.setupBuffer();
  }
}
export default VertexBracket;

