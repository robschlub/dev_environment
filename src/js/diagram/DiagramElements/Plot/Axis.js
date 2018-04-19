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
    const {
      minorTicks, majorTicks,
      minorGrid, majorGrid,
    } = this.props;

    const xRatio = 2 / diagramLimits.width;
    // const yRatio = 2 / diagramLimits.height;
    const cMajorTicksStart = this.props.valueToClip(majorTicks.start);
    const cMinorTicksStart = this.props.valueToClip(minorTicks.start);
    // const cMajorTicksStart = this.locationToClip(majorTicks.start);
    // const cMinorTicksStart = this.locationToClip(minorTicks.start);
    const majorTicksNum = this.props.getMajorNum();
    // Math.floor((this.props.limits.max - majorTicks.start) /
    //     majorTicks.step) + 1;
    const minorTicksNum = this.props.getMinorNum();
    // Math.floor((this.props.limits.max - minorTicks.start) /
    //     minorTicks.step) + 1;

    if (minorGrid.mode === 'on') {
      const grid = new VTickMarks(
        webgl,
        new Point(
          cMinorTicksStart - minorGrid.width / 2 * xRatio,
          this.props.start.y,
        ),
        this.props.rotation,
        minorTicksNum,
        this.toClip(minorTicks.step),
        minorGrid.length,
        minorGrid.width,
        minorGrid.offset,
      );
      this.add('minorGrid', new DiagramElementPrimative(
        grid,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        minorGrid.color,
        diagramLimits,
      ));
    }
    if (majorGrid.mode === 'on') {
      const grid = new VTickMarks(
        webgl,
        new Point(
          cMajorTicksStart - majorGrid.width / 2 * xRatio,
          this.props.start.y,
        ),
        this.props.rotation,
        majorTicksNum,
        this.toClip(majorTicks.step),
        majorGrid.length,
        majorGrid.width,
        majorGrid.offset,
      );
      this.add('majorGrid', new DiagramElementPrimative(
        grid,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        majorGrid.color,
        diagramLimits,
      ));
    }

    if (minorTicks.mode !== 'off') {
      const ticks = new VTickMarks(
        webgl,
        new Point(
          cMinorTicksStart - minorTicks.width / 2 * xRatio,
          this.props.start.y,
        ),
        this.props.rotation,
        minorTicksNum,
        this.toClip(minorTicks.step),
        minorTicks.length,
        minorTicks.width,
        minorTicks.offset,
      );
      this.add('minorTicks', new DiagramElementPrimative(
        ticks,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        majorTicks.color,
        diagramLimits,
      ));
    }

    if (majorTicks.mode !== 'off') {
      const ticks = new VTickMarks(
        webgl,
        new Point(
          cMajorTicksStart - majorTicks.width / 2 * xRatio,
          this.props.start.y,
        ),
        this.props.rotation,
        majorTicksNum,
        this.toClip(majorTicks.step),
        majorTicks.length,
        majorTicks.width,
        majorTicks.offset,
      );
      this.add('majorTicks', new DiagramElementPrimative(
        ticks,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        majorTicks.color,
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

    for (let i = 0; i < majorTicks.labels.length; i += 1) {
      const label = new TextObject(
        drawContext2D,
        majorTicks.labels[i],
        new Point(
          this.valueToClip(majorTicks.start + i * majorTicks.step),
          0,
        ).transformBy(new Transform().rotate(this.props.rotation).matrix()),
        [majorTicks.labelsHAlign, majorTicks.labelsVAlign],
        majorTicks.labelOffset,
      );
      this.add(`label_${i}`, new DiagramElementPrimative(
        label,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        [0.5, 0.5, 0.5, 1],
        diagramLimits,
      ));
    }
  }
  // toClip(value: number) {
  //   const ratio = this.props.length / (this.props.limits.max - this.props.limits.min);
  //   return value * ratio;
  // }
  toClip(value: number) {
    return this.props.toClip(value);
  }
  valueToClip(value: number) {
    return this.props.valueToClip(value);
    // return this.toClip(value - this.props.limits.min) + this.props.start.x;
  }
}

export default Axis;

