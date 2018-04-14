// @flow

import { Point } from '../g2';
import WebGLInstance from '../webgl';
import VertexObject from './vertexObject';

class Polygon extends VertexObject {
  radius: number;       // radius from center to middle polygon vertex
  glPrimitive: number;  // WebGL primitive used
  // outRad: number;       // radius from center to polygon vertex + 1/2 linewidth
  // inRad: number;        // radius from center to polygon vertex - 1/2 linewidth
  center: Point;     // center point
  dAngle: number;       // angle between adjacent verteces to center lines

  constructor(
    webgl: WebGLInstance,
    numSides: number,       // Must be 3 or greater (def: 3 if smaller)
    radius: number,
    lineWidth: number,
    rotation: number = 0,
    center: Point = new Point(0, 0),
    numSidesToDraw: number = numSides, // Must be <= numSides (def: numSides if greater)
  ) {
    // setup webgl stuff
    super(webgl);
    this.glPrimative = webgl.gl.TRIANGLE_STRIP;

    // Check potential errors in constructor input
    let sides = numSides;
    let sidesToDraw = numSidesToDraw;
    if (sides < 3) {
      sides = 3;
    }

    if (sidesToDraw < 0) {
      sidesToDraw = 0;
    } else if (sidesToDraw > sides) {
      sidesToDraw = sides;
    }
    // setup shape geometry
    this.radius = radius;
    const inRad = radius - lineWidth;
    // const outRad = radius + lineWidth / 2.0;
    // this.outRad = outRad;
    // this.inRad = inRad;
    this.center = center;
    this.dAngle = Math.PI * 2.0 / sides;

    // Setup shape primative vertices
    let i;
    let j = 0;
    for (i = 0; i <= sidesToDraw; i += 1) {
      this.points[j] = center.x + inRad * Math.cos(i * this.dAngle + rotation);
      this.points[j + 1] =
        center.y + inRad * Math.sin(i * this.dAngle + rotation);
      this.points[j + 2] =
        center.x + radius * Math.cos(i * this.dAngle + rotation);
      this.points[j + 3] =
        center.y + radius * Math.sin(i * this.dAngle + rotation);
      j += 4;
    }

    // Make the encapsulating border
    if (sidesToDraw < sides) {
      for (i = 0; i <= sidesToDraw; i += 1) {
        this.border[0].push(new Point(
          center.x + radius * Math.cos(i * this.dAngle + rotation),
          center.y + radius * Math.sin(i * this.dAngle + rotation),
        ));
      }
      for (i = sidesToDraw; i >= 0; i -= 1) {
        this.border[0].push(new Point(
          center.x + inRad * Math.cos(i * this.dAngle + rotation),
          center.y + inRad * Math.sin(i * this.dAngle + rotation),
        ));
      }
      this.border[0].push(this.border[0][0].copy());
    } else {
      for (i = 0; i <= sidesToDraw; i += 1) {
        this.border[0].push(new Point(
          center.x + radius * Math.cos(i * this.dAngle + rotation),
          center.y + radius * Math.sin(i * this.dAngle + rotation),
        ));
      }
    }
    this.setupBuffer();
    // console.log(this.numPoints);
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
  getPointCountForAngle(drawAngle: number = Math.PI * 2) {
    let count = Math.floor(drawAngle / this.dAngle) * 2.0 + 2;
    if (drawAngle >= Math.PI * 2.0) {
      count = this.numPoints;
    }
    return count;
  }
}

export default Polygon;
