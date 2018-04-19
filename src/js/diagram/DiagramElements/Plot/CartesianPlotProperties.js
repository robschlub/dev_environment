// @flow

import { Point } from '../../g2';
import { AxisProperties } from './AxisProperties';

class CartesianPlotProperties {
  // Clip Space
  start: Point;
  length: number;
  width: number;

  // // Plot Space
  // limits: {min: Point, max: Point};

  axes: Array<AxisProperties>;

  // traces: Array<TraceProperties>;

  constructor() {
    this.start = new Point(0, 0);
    this.length = 1;
    this.width = 1;

    this.axes = [
      new AxisProperties('x', 0),
      new AxisProperties('y', Math.PI / 2),
    ];
  }
}

export default CartesianPlotProperties;
