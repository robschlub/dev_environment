// @flow

import TRIParallelLines from '../../../vertexObjects/Triangles/TRIParallelLines';
import { Point, Transform } from '../../../tools/g2';
import WebGLInstance from '../../../webgl/webgl';
import VertexObject from '../../../vertexObjects/vertexObject';

class VTickMarks extends VertexObject {
  constructor(
    webgl: WebGLInstance,
    start: Point,
    rotation: number,
    num: number,
    spacing: number,
    length: number,
    width: number,
    offset: number,
  ): void {
    super(webgl);

    const t = new Transform().rotate(rotation).translate(start.x, start.y + offset).matrix();

    const result = TRIParallelLines(
      num,
      spacing,
      new Point(0, 0),
      length,
      width,
      false,
      false,
    );
    const { points, border } = result;
    this.points = points;
    this.border = border;

    this.transform(t);
    this.setupBuffer();
  }
}

export default VTickMarks;
