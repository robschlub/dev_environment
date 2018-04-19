// @flow

import { Point } from '../../g2';

// class Properties {
//   start: Point;
//   length: number;
//   width: number;
//   rotation: number;
//   color: Array<number>;
//   label: string | Array<string>;
// }

class AxisProperties {
  start: Point;
  length: number;
  width: number;
  rotation: number;
  color: Array<number>;
  label: string;
  logarithmic: boolean;
  majorTicks: boolean;
  majorTickSpacing: number;
  majorTickLength: number;
  majorTickWidth: number;
  majorTickColor: Array<number>;
  majorTickLabels: Array<string>;
  majorTickOffset: number;
  majorTickLabelOffset: number;
  majorGrid: boolean;
  majorGridLength: number;
  majorGridWidth: number;
  majorGridColor: Array<number>;
  minorTicks: boolean;
  minorTickSpacing: number;
  minorTickLength: number;
  minorTickWidth: number;
  minorTickColor: Array<number>;
  minorTickLabels: Array<string>;
  minorTickOffset: number;
  minorTickLabelOffset: number;
  minorGrid: boolean;
  minorGridLength: number;
  minorGridWidth: number;
  minorGridColor: Array<number>;
  labelHAlign: string;
  labelVAlign: string;
  labelOffset: Point;


  constructor() {
    this.start = new Point(0, 0);
    this.length = 1;
    this.width = 0.01;
    this.rotation = 0;
    this.color = [0.5, 0.5, 0.5, 1];
    this.label = '';
    this.logarithmic = false;
    this.majorTicks = true;
    this.majorTickSpacing = 0.2;
    this.majorTickLength = 0.05;
    this.majorTickWidth = 0.016;
    this.majorTickColor = [0.5, 0.5, 0.5, 1];
    this.majorTickLabels = [];
    this.majorTickOffset = 0;
    this.majorTickLabelOffset = -0.5;
    this.majorGrid = true;
    this.majorGridLength = 1;
    this.majorGridWidth = 0.008;
    this.majorGridColor = [0.7, 0.7, 0.7, 1];
    this.minorTicks = true;
    this.minorTickSpacing = 0.04;
    this.minorTickLength = 0.02;
    this.minorTickWidth = 0.008;
    this.minorTickColor = [0.5, 0.5, 0.5, 1];
    this.minorTickLabels = [];
    this.minorTickOffset = 0;
    this.minorTickLabelOffset = -0.5;
    this.minorGrid = true;
    this.minorGridLength = 1;
    this.minorGridWidth = 0.008;
    this.minorGridColor = [0.9, 0.9, 0.9, 1];
    this.labelHAlign = 'center';
    this.labelVAlign = 'top';
    this.labelOffset = new Point(0, -0.05);
  }
}

export default AxisProperties;
