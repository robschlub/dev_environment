// @flow

import { DiagramElementCollection } from '../../Element';
import { Rect, Transform } from '../../g2';
import WebGLInstance from '../../webgl';

// import AxisProperties from './AxisProperties';
import CartesianPlotProperties from './CartesianPlotProperties';
import DrawContext2D from '../../DrawContext2D';
import Axis from './Axis';

class CartesianPlot extends DiagramElementCollection {
  // props: AxisProperties;

  constructor(
    webgl: WebGLInstance,
    drawContext2D: DrawContext2D,
    plotProperties: CartesianPlotProperties = new CartesianPlotProperties(),
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits: Rect = new Rect(-1, 1, 2, 2),
  ) {
    super(transform, diagramLimits);
    for (let i = 0; i < plotProperties.axes.length; i += 1) {
      const axisProps = plotProperties.axes[i];
      const axis = new Axis(
        webgl, drawContext2D, axisProps,
        new Transform().scale(1, 1).rotate(0).translate(0, 0), diagramLimits,
      );
      this.add(axisProps.name, axis);
    }
  }
}

export default CartesianPlot;

