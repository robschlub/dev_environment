// @flow
import {
  Point, Transform,
} from '../../tools/g2';
import { joinObjects } from '../../../tools/tools';
import DiagramPrimatives from '../../DiagramPrimatives/DiagramPrimatives';
import Integral from './Symbols/Integral';
// import SuperSub from './Elements/SuperSub';
// import { Brackets, Bar } from './Elements/Brackets';
// import { Annotation, AnnotationInformation } from './Elements/Annotation';

export default class EquationSymbols {
  shapes: DiagramPrimatives;
  defaultColor: Array<number>;

  constructor(
    shapes: DiagramPrimatives,
    defaultColor: Array<number>,
  ) {
    this.shapes = shapes;
    this.defaultColor = defaultColor;
  }

  get(name: string, options: { color?: Array<number>, numLines?: number }) {
    if (name === 'vinculum') {
      return this.vinculum(options);
    }
    if (name === 'strike') {
      return this.strike(options);
    }
    if (name === 'xStrike') {
      return this.xStrike(options);
    }
    if (name === 'integral') {
      console.log(this.integral(options))
      return this.integral(options);
    }
    return null;
  }

  vinculum(options: { color?: Array<number> } = {}) {
    let { color } = options;
    if (color == null) {
      color = this.defaultColor;
    }
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }

  strike(options: { color?: Array<number> } = {}) {
    let { color } = options;
    if (color == null) {
      color = this.defaultColor;
    }
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
  }

  xStrike(options: { color?: Array<number> } = {}) {
    let { color } = options;
    if (color == null) {
      color = this.defaultColor;
    }
    const cross = this.shapes.collection(new Transform('xStrike').scale(1, 1).rotate(0).translate(0, 0));
    cross.color = color;
    const strike1 = this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strikeLine').scale(1, 1).rotate(0).translate(0, 0),
    );
    const strike2 = strike1._dup();
    cross.add('s1', strike1);
    cross.add('s2', strike2);
    return cross;
  }

  integral(options: { color?: Array<number>, numLines?: number}) {
    const defaultOptions = {
      color: this.defaultColor,
      numLines: 1,
    };
    const optionsToUse = joinObjects(defaultOptions, options);
    return new Integral(
      this.shapes.webgl,
      optionsToUse.color,
      optionsToUse.numLines,
      new Transform('integral').scale(1, 1).translate(0, 0),
      this.shapes.limits,
    );
  }

  // bracket(
  //   side: 'left' | 'right' | 'top' | 'bottom',
  //   numLines: number = 1,
  //   color: Array<number> = [1, 1, 1, 1],
  // ) {
  //   return new Bracket(
  //     this.webgl,
  //     color,
  //     side,
  //     numLines,
  //     new Transform('bracket').scale(1, 1).translate(0, 0),
  //     this.limits,
  //   );
  // }
}
