// @flow

import { DiagramElementCollection, DiagramElementPrimative } from '../../Element';
import { Rect, Transform, Point } from '../../g2';
import WebGLInstance from '../../webgl';

// import AxisProperties from './AxisProperties';
import { CartesianPlotProperties } from './CartesianPlotProperties';
import DrawContext2D from '../../DrawContext2D';
import Axis from './Axis';
import PolyLine from '../../vertexObjects/PolyLine';

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
    const props = plotProperties;
    for (let i = 0; i < plotProperties.axes.length; i += 1) {
      const axisProps = plotProperties.axes[i];
      const axis = new Axis(
        webgl, drawContext2D, axisProps,
        new Transform().scale(1, 1).rotate(0).translate(0, 0), diagramLimits,
      );
      this.add(axisProps.name, axis);
    }

    for (let i = 0; i < props.traces.length; i += 1) {
      const trace = props.traces[i];
      const line = [];
      for (let j = 0; j < trace.points.length; j += 1) {
        line.push(new Point(
          props.axes[0].valueToClip(trace.points[j].x),
          props.axes[1].valueToClip(trace.points[j].y),
        ));
      }
      const polyLine = new PolyLine(webgl, line, false, 0.01);
      this.add(trace.name, new DiagramElementPrimative(
        polyLine,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        trace.color,
        diagramLimits,
      ));
    }
  }
}

export default CartesianPlot;

