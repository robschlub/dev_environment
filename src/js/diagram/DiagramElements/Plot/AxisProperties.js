// @flow

import { Point } from '../../g2';
import { roundNum } from '../../mathtools';
const defaultColor = [0.7, 0.7, 0.7, 1];

class GridProperties {
  // Clip Space
  length: number;
  width: number;
  offset: number;

  // General
  color: Array<number>;
  mode: 'on' | 'off';

  constructor() {
    this.length = 1;
    this.width = 0.01;
    this.color = defaultColor;
    this.mode = 'on';
    this.offset = 0;
  }
}
class TickProperties {
  // Axis Space
  start: number;
  step: number;

  // Clip Space;
  length: number;
  width: number;
  offset: number;
  labelOffset: Point;

  // General
  color: Array<number>;
  labels: Array<string>;
  labelsHAlign: 'start' | 'end' | 'left' | 'center' | 'right';
  labelsVAlign: 'top' | 'middle' | 'bottom';
  mode: 'on' | 'off' | 'auto';

  constructor() {
    this.start = 0;
    this.step = 0.1;

    this.length = 0.05;
    this.width = 0.01;
    this.offset = 0;
    this.labelOffset = new Point(0, 0);

    this.color = defaultColor;
    this.labels = [];
    this.labelsHAlign = 'center';
    this.labelsVAlign = 'middle';
    this.mode = 'on';
  }
}

class AxisProperties {
  name: string;
  start: Point;
  length: number;
  width: number;
  rotation: number;
  color: Array<number>;
  label: string;
  logarithmic: boolean;
  limits: { max: number, min: number };
  majorTicks: TickProperties;
  minorTicks: TickProperties;
  majorGrid: GridProperties;
  minorGrid: GridProperties;
  // majorTicks: boolean;
  // majorTicksStart: number
  // majorTickSpacing: number;
  // majorTickLength: number;
  // majorTickWidth: number;
  // majorTickColor: Array<number>;
  // majorTickLabels: Array<string>;
  // majorTickOffset: number;
  // majorTickLabelOffset: number;
  // majorGrid: boolean;
  // majorGridLength: number;
  // majorGridWidth: number;
  // majorGridColor: Array<number>;
  // minorTicks: boolean;
  // minorTicksStart: number;
  // minorTickSpacing: number;
  // minorTickLength: number;
  // minorTickWidth: number;
  // minorTickColor: Array<number>;
  // minorTickLabels: Array<string>;
  // minorTickOffset: number;
  // minorTickLabelOffset: number;
  // minorGrid: boolean;
  // minorGridLength: number;
  // minorGridWidth: number;
  // minorGridColor: Array<number>;
  // labelHAlign: string;
  // labelVAlign: string;
  // labelOffset: Point;


  constructor(name: string = '', rotation: number = 0) {
    this.name = name;

    // Clip Space
    this.start = new Point(0, 0);
    this.length = 1;
    this.width = 0.01;
    this.rotation = rotation;


    this.color = [0.5, 0.5, 0.5, 1];
    this.label = '';
    this.limits = { min: 0, max: 1 };
    this.logarithmic = false;

    this.majorTicks = new TickProperties();
    this.minorTicks = new TickProperties();
    this.majorGrid = new GridProperties();
    this.minorGrid = new GridProperties();
    // this.majorTicks =
    // this.majorTicks = true;
    // this.majorTicksStart = 0;
    // this.majorTickSpacing = 0.2;
    // this.majorTickLength = 0.05;
    // this.majorTickWidth = 0.016;
    // this.majorTickColor = [0.5, 0.5, 0.5, 1];
    // this.majorTickLabels = [];
    // this.majorTickOffset = 0;
    // this.majorTickLabelOffset = -0.5;
    // this.majorGrid = true;
    // this.majorGridLength = 1;
    // this.majorGridWidth = 0.008;
    // this.majorGridColor = [0.7, 0.7, 0.7, 1];
    // this.minorTicks = true;
    // this.minorTicksStart = 0;
    // this.minorTickSpacing = 0.04;
    // this.minorTickLength = 0.02;
    // this.minorTickWidth = 0.008;
    // this.minorTickColor = [0.5, 0.5, 0.5, 1];
    // this.minorTickLabels = [];
    // this.minorTickOffset = 0;
    // this.minorTickLabelOffset = -0.5;
    // this.minorGrid = true;
    // this.minorGridLength = 1;
    // this.minorGridWidth = 0.008;
    // this.minorGridColor = [0.9, 0.9, 0.9, 1];
    // this.labelHAlign = 'center';
    // this.labelVAlign = 'top';
    // this.labelOffset = new Point(0, -0.05);
  }
  getNum(start: number, step: number) {
    return Math.floor((this.limits.max - start) /
          step) + 1;
  }
  getMajorNum() {
    return this.getNum(this.majorTicks.start, this.majorTicks.step);
    // return Math.floor((this.limits.max - this.majorTicks.start) /
    //       this.majorTicks.step) + 1;
  }
  getMinorNum() {
    return this.getNum(this.minorTicks.start, this.minorTicks.step);
    // return Math.floor((this.limits.max - this.minorTicks.start) /
    //       this.minorTicks.step) + 1;
  }
  generateAuto(approximateNum: number = 10) {
    // const approximateNum = 10;
    const range = this.limits.max - this.limits.min;
    let step = range / approximateNum;
    const orderOfMagnitude = roundNum(Math.floor(Math.log10(step)), 0);
    step = roundNum(step, -orderOfMagnitude);
    let start = roundNum(this.limits.min, -orderOfMagnitude);
    if (start < this.limits.min) {
      start += 10 ** orderOfMagnitude;
    }
    if (this.getNum(start, step) > 11) {
      step *= 2;
    }
    return { start, step };
  }
  generateAutoMajorNum(approximateNum: number = 10) {
    const { start, step } = this.generateAuto(approximateNum);
    this.majorTicks.start = start;
    this.majorTicks.step = step;
  }
  generateAutoMinorNum(approximateNum: number = 50) {
    const { start, step } = this.generateAuto(approximateNum);
    this.minorTicks.start = start;
    this.minorTicks.step = step;
  }
  toClip(value: number) {
    const ratio = this.length / (this.limits.max - this.limits.min);
    return value * ratio;
  }
  valueToClip(value: number) {
    return this.toClip(value - this.limits.min) + this.start.x;
  }
  getMajorLabels() {
    const labels = [];
    for (let i = 0, j = this.getMajorNum(); i < j; i += 1) {
      const value = this.majorTicks.start + i * this.majorTicks.step;
      labels.push(value.toString());
    }
    return labels;
  }
}

export default AxisProperties;
