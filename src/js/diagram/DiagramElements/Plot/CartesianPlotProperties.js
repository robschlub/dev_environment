// @flow

import { Point } from '../../g2';

class CartesianPlotProperties {
  // Clip Space
  start: Point;
  xLength: number;
  yLength: number;


  // Plot Space
  limits: {min: Point, max: Point};

  
  // xMajorTicks: 'on' | 'off' | 'auto';
  // xMajorTickSpacing: number;
  // xMajorTickStart: number;
  // xMajorTickLength: number;
  // xMajorTickWidth: number;
  // xMajorTickColor: Array<number>;
  // xMajorTickLabels: Array<string>;

  // yMajorTicks: 'on' | 'off' | 'auto';
  // yMajorTickSpacing: number;
  // yMajorTickStart: number;
  // yMajorTickLength: number;
  // yMajorTickWidth: number;
  // yMajorTickColor: Array<number>;
  // yMajorTickLabels: Array<string>;

  // xMinorTicks: 'on' | 'off' | 'auto';
  // xMinorTickSpacing: number;
  // xMinorTickStart: number;
  // xMinorTickLength: number;
  // xMinorTickWidth: number;
  // xMinorTickColor: Array<number>;

  // yMinorTicks: 'on' | 'off' | 'auto';
  // yMinorTickSpacing: number;
  // yMinorTickStart: number;
  // yMinorTickLength: number;
  // yMinorTickWidth: number;
  // yMinorTickColor: Array<number>;

  // xMajorGrid: 'on' | 'off';
  // xMajorGridWidth: number;
  // xMajorGridColor: Array<number>;

  // yMajorGrid: 'on' | 'off';
  // yMajorGridWidth: number;
  // yMajorGridColor: Array<number>;

  // xMinorGrid: 'on' | 'off';
  // xMinorGridWidth: number;
  // xMinorGridColor: Array<number>;

  // yMinorGrid: 'on' | 'off';
  // yMinorGridWidth: number;
  // yMinorGridColor: Array<number>;

  // labelOffset: Point;

  constructor() {
    const color = [0.7, 0.7, 0.7, 1];
    this.start = new Point(0, 0);
    this.xLength = 1;
    this.yLength = 1;
    this.limits = { min: new Point(0, 0), max: new Point(1, 1) };

    this.xMajorTicks = 'auto';
    this.xMajorTickSpacing = 0.1;
    this.xMajorTickStart = 0;
    this.xMajorTickLength = 0.05;
    this.xMajorTickWidth = 0.003;
    this.xMajorTickColor = color;
    this.xMajorTickLabels = [];

    this.yMajorTicks = this.xMajorTicks;
    this.yMajorTickSpacing = this.xMajorTickSpacing;
    this.yMajorTickStart = this.xMajorTickStart;
    this.yMajorTickLength = this.xMajorTickLength;
    this.yMajorTickWidth = this.xMajorTickWidth;
    this.yMajorTickColor = this.xMajorTickColor;
    this.yMajorTickLabels = this.xMajorTickLabels;

    this.xMinorTicks = 'auto';
    this.xMinorTickSpacing = 0.02;
    this.xMinorTickStart = 0;
    this.xMinorTickLength = 0.03;
    this.xMinorTickWidth = 0.001;
    this.xMinorTickColor = color;

    this.yMinorTicks = this.xMinorTicks;
    this.yMinorTickSpacing = this.xMinorTickSpacing;
    this.yMinorTickStart = this.xMinorTickStart;
    this.yMinorTickLength = this.xMinorTickLength;
    this.yMinorTickWidth = this.xMinorTickWidth;
    this.yMinorTickColor = this.xMinorTickColor;

    this.xMajorGrid = 'on';
    this.xMajorGridWidth = 0.002;
    this.xMajorGridColor = color;

    this.xMinorGrid = this.xMajorGrid;
    this.xMinorGridWidth = this.xMajorGridWidth;
    this.xMinorGridColor = this.xMajorGridColor;

    this.labelOffset = new Point(0, 0);
  }
}

export default CartesianPlotProperties;
