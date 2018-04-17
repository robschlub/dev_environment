// @flow

import { DiagramElementPrimative, DiagramElementCollection } from '../../Element';
import { Point, Rect, Transform } from '../../g2';
import WebGLInstance from '../../webgl';

import VAxis from './VertexObjects/VAxis';
import VTickMarks from './VertexObjects/VTickMarks';
import AxisProperties from './AxisProperties';

class Axis extends DiagramElementCollection {
  props: AxisProperties;
  constructor(
    webgl: WebGLInstance,
    axisProperties: AxisProperties = new AxisProperties(),
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits: Rect = new Rect(-1, 1, 2, 2),
  ) {
    super(transform, diagramLimits);
    this.props = axisProperties;

    const axis = new VAxis(webgl, axisProperties);
    this.add('line', new DiagramElementPrimative(
      axis,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.color,
      diagramLimits,
    ));

    const majorTicks = new VTickMarks(
      webgl,
      this.props.start,
      this.props.rotation,
      Math.floor(this.props.length / this.props.majorTickSpacing),
      this.props.majorTickSpacing,
      this.props.majorTickLength,
      this.props.majorTickWidth,
      this.props.majorTickOffset,
    );
    this.add('majorTicks', new DiagramElementPrimative(
      majorTicks,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.majorTickColor,
      diagramLimits,
    ));

    const minorTicks = new VTickMarks(
      webgl,
      this.props.start,
      this.props.rotation,
      Math.floor(this.props.length / this.props.minorTickSpacing),
      this.props.minorTickSpacing,
      this.props.minorTickLength,
      this.props.minorTickWidth,
      this.props.minorTickOffset,
    );
    this.add('minorTicks', new DiagramElementPrimative(
      minorTicks,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.majorTickColor,
      diagramLimits,
    ));

    const majorGrid = new VTickMarks(
      webgl,
      this.props.start,
      this.props.rotation,
      Math.floor(this.props.length / this.props.majorTickSpacing),
      this.props.majorTickSpacing,
      this.props.majorGridLength,
      this.props.majorGridWidth,
      0,
    );
    this.add('majorGrid', new DiagramElementPrimative(
      majorGrid,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.majorGridColor,
      diagramLimits,
    ));

    const minorGrid = new VTickMarks(
      webgl,
      this.props.start,
      this.props.rotation,
      Math.floor(this.props.length / this.props.minorTickSpacing),
      this.props.minorTickSpacing,
      this.props.minorGridLength,
      this.props.minorGridWidth,
      0,
    );
    this.add('minorGrid', new DiagramElementPrimative(
      minorGrid,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.minorGridColor,
      diagramLimits,
    ));
  }
}

export default Axis;

