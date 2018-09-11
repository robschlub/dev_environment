// @flow

import { Point } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from './VertexObject';
import polyLineTriangles3 from './PolyLineTriangles3';


class VertexPolyLine extends VertexObject {
  width: number;
  close: boolean;

  constructor(
    webgl: WebGLInstance,
    coords: Array<Point>,
    close: boolean,
    width: number,
  ): void {
    super(webgl);
    this.width = width;
    this.close = close;
    this.setupPoints(coords);
    this.setupBuffer();
  }

  change(coords: Array<Point>) {
    this.setupPoints(coords);
    this.resetBuffer();
  }

  setupPoints(coords: Array<Point>) {
    const lineTriangles = polyLineTriangles3(coords, this.close, this.width);
    this.points = lineTriangles.points;
    this.border[0] = lineTriangles.border;
  }
}

export default VertexPolyLine;
