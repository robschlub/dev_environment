// @flow

import { Point } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';
import VertexObject from './VertexObject';
import polyLineTriangles from './PolyLineTriangles';


class VertexPolyLine extends VertexObject {
  constructor(
    webgl: WebGLInstance,
    coords: Array<Point>,
    close: boolean,
    width: number,
  ): void {
    super(webgl);
    const lineTriangles = polyLineTriangles(coords, close, width);

    this.points = lineTriangles.points;
    this.border[0] = lineTriangles.border;

    this.setupBuffer();
  }
}

export default VertexPolyLine;
