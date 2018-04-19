// @flow

import { DiagramElementPrimative, DiagramElementCollection } from '../../Element';
import { Rect, Transform, Point } from '../../g2';
import WebGLInstance from '../../webgl';

import VAxis from './VertexObjects/VAxis';
import VTickMarks from './VertexObjects/VTickMarks';
import AxisProperties from './AxisProperties';
import TextObject from '../../TextObject';
import DrawContext2D from '../../DrawContext2D';

class Axis extends DiagramElementCollection {
  props: AxisProperties;
  constructor(
    webgl: WebGLInstance,
    drawContext2D: DrawContext2D,
    axisProperties: AxisProperties = new AxisProperties(),
    transform: Transform = new Transform().scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits: Rect = new Rect(-1, 1, 2, 2),
  ) {
    super(transform, diagramLimits);
    this.props = axisProperties;

    const axisRange = this.props.limits.max - this.props.limits.min;
    const axisLengthToLimit = this.props.length / axisRange;

    if (this.props.minorGrid) {
      const minorGrid = new VTickMarks(
        webgl,
        new Point(
          (this.props.start.x - this.props.minorTicksStart) * axisLengthToLimit,
          this.props.start.y,
        ),
        this.props.rotation,
        Math.floor(this.props.length / this.props.minorTickSpacing) + 1,
        this.props.minorTickSpacing * axisLengthToLimit,
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
    if (this.props.majorGrid) {
      const majorGrid = new VTickMarks(
        webgl,
        new Point(
          (this.props.start.x - this.props.majorTicksStart) * axisLengthToLimit,
          this.props.start.y,
        ),
        this.props.rotation,
        Math.floor(this.props.length / this.props.majorTickSpacing) + 1,
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
    }

    if (this.props.minorTicks) {
      const minorTicks = new VTickMarks(
        webgl,
        new Point(
          this.locationToClip(this.props.minorTicksStart)  - this.props.minorTickWidth / 2,
          this.props.start.y,
        ),
        this.props.rotation,
        Math.floor((this.props.limits.max - this.props.minorTicksStart) /
          this.props.minorTickSpacing) + 1,
        this.toClip(this.props.minorTickSpacing),
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
    }

    if (this.props.majorTicks) {
      const majorTicks = new VTickMarks(
        webgl,
        new Point(
          this.locationToClip(this.props.majorTicksStart) - this.props.majorTickWidth / 2,
          this.props.start.y,
        ),
        this.props.rotation,
        Math.floor((this.props.limits.max - this.props.majorTicksStart) /
          this.props.majorTickSpacing) + 1,
        this.toClip(this.props.majorTickSpacing),
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
    }

    const axis = new VAxis(webgl, axisProperties);
    this.add('line', new DiagramElementPrimative(
      axis,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.color,
      diagramLimits,
    ));

    for (let i = 0; i < axisProperties.majorTickLabels.length; i += 1) {
      const label = new TextObject(
        drawContext2D,
        axisProperties.majorTickLabels[i],
        new Point(
          this.locationToClip(this.props.majorTicksStart + i * this.props.majorTickSpacing),
          0,
        ).transformBy(new Transform().rotate(this.props.rotation).matrix()),
        [this.props.labelHAlign, this.props.labelVAlign],
        this.props.labelOffset,
      );
      this.add(`label_${i}`, new DiagramElementPrimative(
        label,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        [0.5, 0.5, 0.5, 1],
        diagramLimits,
      ));
    }
    // const label = new TextObject(drawContext2D, 'This is a test', new Point(0, 0));
    // this.add('label', new DiagramElementPrimative(
    //   label,
    //   new Transform().scale(1, 1).rotate(0).translate(0, 0),
    //   [1, 0, 0, 1],
    //   diagramLimits,
    // ));
  }
  toClip(value: number) {
    const ratio = this.props.length / (this.props.limits.max - this.props.limits.min);
    return value * ratio;
  }
  locationToClip(value: number) {
    return this.toClip(value - this.props.limits.min) + this.props.start.x;
  }
}

export default Axis;
