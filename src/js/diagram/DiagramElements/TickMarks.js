// @flow

import { DiagramElementPrimative } from '../Element';
import * as g2 from '../tools/g2';
import * as m2 from '../tools/m2';
import WebGLInstance from '../webgl/webgl';
import VertexHorizontalLine from '../vertexObjects/VertexHorizontalLine';

class TickMarks extends DiagramElementPrimative {
  num: number;
  spacing: number;
  rotation: number;
  start: g2.Point;

  constructor(
    webgl: WebGLInstance,
    num: number = 10,
    spacing: number = 0.1,
    start: g2.Point = new g2.Point(0, 0),
    length: number = 0.5,
    width: number = 0.01,
    color: Array<number> = [1, 0, 0, 1],
    limits: g2.Rect = new g2.Rect(-1, -1, 2, 2),
    rotation: number = 0,
  ) {
    const vertexObject = new VertexHorizontalLine(
      webgl,
      new g2.Point(0, 0),
      length, width,
      Math.PI / 2,
    );
    super(
      vertexObject,
      new g2.Transform().scale(1, 1).rotate(0).translate(0, 0),
      color,
      limits,
    );
    this.spacing = spacing;
    this.num = num;
    this.rotation = rotation;
    this.start = start;
  }
  draw(
    transformMatrix: Array<number> = m2.identity(),
    now: number = 0,
  ) {
    for (let i = 0; i < this.num; i += 1) {
      const tickTransform = new g2.Transform()
        .translate(this.spacing * i, 0)
        .rotate(this.rotation)
        .translate(this.start.x, this.start.y);
      const t = m2.mul(transformMatrix, tickTransform.matrix());
      super.draw(t, now);
    }
  }
}

export default TickMarks;
