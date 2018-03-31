// @flow

import * as g2 from '../g2';
import WebGLInstance from '../webgl';
import VertexObject from './vertexObject';
// import type { PointType } from '../g2';

class Polygon extends VertexObject {
  radius: number;
  glPrimitive: number;
  outRad: number;
  inRad: number;
  center: g2.Point;
  dAngle: number;

  constructor(
    webgl: WebGLInstance,
    radius: number,
    numSides: number,
    numSidesToDraw: number,
    thickness: number,
    rotation: number,
    center: g2.Point,
  ) {
    super(webgl);
    this.glPrimative = webgl.gl.TRIANGLE_STRIP;
    this.radius = radius;

    const inRad = radius - thickness;
    const outRad = radius + thickness;
    this.outRad = outRad;
    this.inRad = inRad;
    this.center = center;
    if (numSides < 3) {
      this.dAngle = Math.PI / numSides;
    } else {
      this.dAngle = Math.PI * 2.0 / numSides;
    }
    let i;
    let j = 0;
    for (i = 0; i <= numSidesToDraw; i += 1) {
      this.points[j] = center.x + inRad * Math.cos(i * this.dAngle + rotation);
      this.points[j + 1] =
        center.y + inRad * Math.sin(i * this.dAngle + rotation);
      this.points[j + 2] =
        center.x + outRad * Math.cos(i * this.dAngle + rotation);
      this.points[j + 3] =
        center.y + outRad * Math.sin(i * this.dAngle + rotation);
      j += 4;
    }

    // Make the encapsulating border
    if (numSidesToDraw < numSides) {
      for (i = 0; i <= numSidesToDraw; i += 1) {
        this.border[0].push(new g2.Point(
          center.x + outRad * Math.cos(i * this.dAngle + rotation),
          center.y + outRad * Math.sin(i * this.dAngle + rotation),
        ));
      }
      for (i = numSidesToDraw; i >= 0; i -= 1) {
        this.border[0].push(g2.point(
          center.x + inRad * Math.cos(i * this.dAngle + rotation),
          center.y + inRad * Math.sin(i * this.dAngle + rotation),
        ));
      }
      this.border[0].push(this.border[0][0].copy());
    } else {
      for (i = 0; i <= numSidesToDraw; i += 1) {
        this.border[0].push(g2.point(
          center.x + outRad * Math.cos(i * this.dAngle + rotation),
          center.y + outRad * Math.sin(i * this.dAngle + rotation),
        ));
      }
    }
    this.setupBuffer();
  }
  // Polygon.prototype = Object.create(VertexObject.prototype);
  drawToAngle(
    offset: Object,
    rotate: number,
    scale: Object,
    drawAngle: number,
    color: Array<number>,
  ) {
    let count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;
    if (drawAngle >= Math.PI * 2.0) {
      count = this.numPoints;
    }
    this.draw(offset, rotate, scale, count, color);
  }
  getPointCountForAngle(drawAngle: number) {
    let count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;
    if (drawAngle >= Math.PI * 2.0) {
      count = this.numPoints;
    }
    return count;
  }
}

export default Polygon;
