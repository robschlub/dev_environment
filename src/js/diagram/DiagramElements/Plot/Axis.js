// @flow

import { DiagramElementPrimative, DiagramElementCollection } from '../../Element';
import { Rect, Transform, Point } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';

import VAxis from './VertexObjects/VAxis';
import VTickMarks from './VertexObjects/VTickMarks';
import { AxisProperties, GridProperties, TickProperties } from './AxisProperties';
import TextObject from '../../textObjects/TextObject';
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
    if (majorTicks.mode === 'auto') {
      this.props.generateAutoMajorTicks();
    }
    if (minorTicks.mode === 'auto') {
      this.props.generateAutoMinorTicks();
    }
    const xRatio = 2 / diagramLimits.width;
    // const yRatio = 2 / diagramLimits.height;
    const cMajorTicksStart = this.props.valueToClip(majorTicks.start);
    const cMinorTicksStart = this.props.valueToClip(minorTicks.start);
    const majorTicksNum = this.props.getMajorNum();
    const minorTicksNum = this.props.getMinorNum();

    // Grid
    this.addTicksOrGrid(
      'minorGrid', webgl, minorGrid, minorTicksNum,
      minorTicks.step, cMinorTicksStart, xRatio, diagramLimits,
    );

    this.addTicksOrGrid(
      'majorGrid', webgl, majorGrid, majorTicksNum,
      majorTicks.step, cMajorTicksStart, xRatio, diagramLimits,
    );

    // Ticks
    this.addTicksOrGrid(
      'minorTicks', webgl, minorTicks, minorTicksNum,
      minorTicks.step, cMinorTicksStart, xRatio, diagramLimits,
    );

    this.addTicksOrGrid(
      'majorTicks', webgl, majorTicks, majorTicksNum,
      majorTicks.step, cMajorTicksStart, xRatio, diagramLimits,
    );

    // Axis Line
    const axis = new VAxis(webgl, axisProperties);
    this.add('line', new DiagramElementPrimative(
      axis,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      axisProperties.color,
      diagramLimits,
    ));

    const title = new TextObject(
      drawContext2D,
      this.props.title,
      new Point(
        0,
        0,
      ).transformBy(new Transform().rotate(this.props.rotation).matrix()),
      ['center', 'middle'],
      this.props.titleOffset,
    );
    title.fontSize = this.props.titleFontSize;
    title.fontFamily = this.props.titleFontFamily;
    title.fontWeight = this.props.titleFontWeight;
    title.rotation = this.props.titleRotation;
    this.add('title', new DiagramElementPrimative(
      title,
      new Transform().scale(1, 1).rotate(0).translate(0, 0),
      [0.5, 0.5, 0.5, 1],
      diagramLimits,
    ));

    // Labels
    this.addTickLabels(
      'major', drawContext2D, majorTicks,
      this.props.generateMajorLabels.bind(this.props), diagramLimits,
    );
    this.addTickLabels(
      'minor', drawContext2D, minorTicks,
      this.props.generateMinorLabels.bind(this.props), diagramLimits,
    );
  }

  toClip(value: number) {
    return this.props.toClip(value);
  }
  valueToClip(value: number) {
    return this.props.valueToClip(value);
  }

  addTicksOrGrid(
    name: string,
    webgl: WebGLInstance,
    ticksOrGrid: GridProperties,
    num: number,
    step: number,
    clipStart: number,
    xRatio: number,
    diagramLimits: Rect,
  ) {
    if (ticksOrGrid.mode !== 'off') {
      const ticks = new VTickMarks(
        webgl,
        new Point(
          clipStart - ticksOrGrid.width / 2 * xRatio,
          this.props.start.y,
        ),
        this.props.rotation,
        num,
        this.toClip(step),
        ticksOrGrid.length,
        ticksOrGrid.width,
        ticksOrGrid.offset,
      );
      this.add(name, new DiagramElementPrimative(
        ticks,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        ticksOrGrid.color,
        diagramLimits,
      ));
    }
  }

  addTickLabels(
    name: string,
    drawContext2D: DrawContext2D,
    ticks: TickProperties,
    labelGenerator: () => void,
    diagramLimits: Rect,
  ) {
    if (ticks.labelMode === 'auto') {
      labelGenerator();
    }
    for (let i = 0; i < ticks.labels.length; i += 1) {
      const label = new TextObject(
        drawContext2D,
        ticks.labels[i],
        new Point(
          this.valueToClip(ticks.start + i * ticks.step),
          0,
        ).transformBy(new Transform().rotate(this.props.rotation).matrix()),
        [ticks.labelsHAlign, ticks.labelsVAlign],
        ticks.labelOffset,
      );
      label.fontSize = ticks.fontSize;
      label.fontFamily = ticks.fontFamily;
      label.fontWeight = ticks.fontWeight;

      this.add(`label_${name}_${i}`, new DiagramElementPrimative(
        label,
        new Transform().scale(1, 1).rotate(0).translate(0, 0),
        [0.5, 0.5, 0.5, 1],
        diagramLimits,
      ));
    }
  }

  // getBorder() {
  //   const length = this.props.length;
  //   const width = this.props.width +
  // }
}

export default Axis;

