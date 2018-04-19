// @flow

import TRIHorizontalLine from '../../../vertexObjects/Triangles/TRIHoriztonalLine';
import AxisProperties from '../AxisProperties';
import { Point, Transform } from '../../../g2';
import WebGLInstance from '../../../webgl';
import VertexObject from '../../../vertexObjects/vertexObject';

class VAxis extends VertexObject {
  constructor(
    webgl: WebGLInstance,
    axisProperties: AxisProperties = new AxisProperties(),
  ): void {
    super(webgl);

    const a = axisProperties;
    const t = new Transform().rotate(a.rotation).translate(a.start.x, a.start.y).matrix();

    if (a.width > 0) {
      const result = TRIHorizontalLine(
        new Point(0, 0),
        a.length,
        a.width,
        0,
      );
      const { points, border } = result;
      this.points = points;
      this.border = [border];
    }
    this.transform(t);
    this.setupBuffer();
  }
}

export default VAxis;