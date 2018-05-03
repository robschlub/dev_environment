// @flow

import { Point } from './tools/g2';

class DrawingObject {
  numPoints: number;            // Number of primative vertices
  border: Array<Array<Point>>; // Border vertices

  constructor() {
    this.numPoints = 0;
    this.border = [[]];
  }

  // draw() {
  // }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getPointCountForAngle(angle: number): number {
    return 0;
  }
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  drawWithTransformMatrix(transform: Array<number>, numPoints: number, color: Array<number>) {
  }
}

export default DrawingObject;
