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
  props: CartesianPlotProperties;
  boundingBox: { min: Point, max: Point };

  constructor(
    webgl: WebGLInstance,
    drawContext2D: DrawContext2D,
    plotProperties: CartesianPlotProperties = new CartesianPlotProperties(),
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits: Rect = new Rect(-1, 1, 2, 2),
  ) {
    super(transform, diagramLimits);
    this.props = plotProperties;
    for (let i = 0; i < plotProperties.axes.length; i += 1) {
      const axisProps = plotProperties.axes[i];
      const axis = new Axis(
        webgl, drawContext2D, axisProps,
        new Transform().scale(1, 1).rotate(0).translate(0, 0), diagramLimits,
      );
      this.add(axisProps.name, axis);
    }

    for (let i = 0; i < this.props.traces.length; i += 1) {
      const trace = this.props.traces[i];
      const line = [];
      for (let j = 0; j < trace.points.length; j += 1) {
        line.push(new Point(
          this.props.axes[0].valueToClip(trace.points[j].x),
          this.props.axes[1].valueToClip(trace.points[j].y),
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

    this.boundingBox = this.getRelativeBoundingBox();
    this.updateMoveTranslationBoundary();
  }

  isBeingTouched(clipLocation: Point) {
    if (!this.isTouchable) {
      return false;
    }
    let { min, max } = this.boundingBox;
    const t = this.transform.t();

    if (t instanceof Point) {
      min = min.add(t);
      max = max.add(t);
    }
    if (clipLocation.x <= max.x
      && clipLocation.x >= min.x
      && clipLocation.y <= max.y
      && clipLocation.y >= min.y) {
      return true;
    }
    return false;
  }

  getTouched(clipLocation: Point): Array<DiagramElementPrimative | DiagramElementCollection> {
    if (!this.isTouchable) {
      return [];
    }
    let touched = [];
    if (this.isBeingTouched(clipLocation)) {
      touched.push(this);
      const additionalTouched = super.getTouched(clipLocation);
      touched = touched.concat(additionalTouched);
      return touched;
    }
    // for (let i = 0; i < this.order.length; i += 1) {
    //   const element = this.elements[this.order[i]];
    //   if (element.show === true) {
    //     touched = touched.concat(element.getTouched(clipLocation));
    //   }
    // }
    // // If there is an element that is touched, then this collection should
    // // also be touched.
    // if (touched.length > 0) {
    //   touched = [this].concat(touched);
    // }
    return touched;
  }
}

export default CartesianPlot;

