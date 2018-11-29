// @flow
import WebGLInstance from '../webgl/webgl';
import {
  Rect, Point, Transform,
} from '../tools/g2';
import {
  DiagramElementCollection,
} from '../Element';
import { joinObjects } from '../../tools/tools';
import DrawContext2D from '../DrawContext2D';
import {
  DiagramFont,
} from '../DrawingObjects/TextObject/TextObject';
import Integral from '../DiagramElements/Equation/Integral';
import Bracket from '../DiagramElements/Equation/Bracket';
import Bar from '../DiagramElements/Equation/Bar';
import SquareBracket from '../DiagramElements/Equation/SquareBracket';
import Brace from '../DiagramElements/Equation/Brace';
import RoundedSquareBracket from '../DiagramElements/Equation/RoundedSquareBracket';

import {
  EquationForm, createEquationElements, Equation,
} from '../DiagramElements/Equation/GLEquation';
import HTMLEquation from '../DiagramElements/Equation/HTMLEquation';

export default class DiagramEquation {
  webgl: WebGLInstance;
  draw2D: DrawContext2D;
  limits: Rect;
  shapes: Object;

  constructor(
    shapes: Object,
  ) {
    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
  }

  elements(
    elems: Object,
    colorOrFont: Array<number> | DiagramFont = [],
    firstTransform: Transform = new Transform('elements'),
  ): DiagramElementCollection {
    return createEquationElements(
      elems,
      this.draw2D,
      colorOrFont,
      this.limits,
      firstTransform,
    );
  }

  vinculum(color: Array<number> = [1, 1, 1, 1]) {
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }

  strike(color: Array<number> = [1, 1, 1, 1]) {
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
  }

  xStrike(color: Array<number> = [1, 1, 1, 1]) {
    const cross = this.shapes.collection(new Transform('strike').scale(1, 1).rotate(0).translate(0, 0));
    cross.color = color;
    const strike1 = this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
    const strike2 = strike1._dup();
    cross.add('s1', strike1);
    cross.add('s2', strike2);
    return cross;
  }

  integral(
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Integral(
      this.webgl,
      color,
      numLines,
      new Transform('integral').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  bracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bracket(
      this.webgl,
      color,
      side,
      numLines,
      new Transform('bracket').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  bar(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bar(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  squareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new SquareBracket(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  brace(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Brace(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  roundedSquareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new RoundedSquareBracket(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  make(equationCollection: DiagramElementCollection) {
    return new EquationForm(equationCollection);
  }

  // eslint-disable-next-line class-methods-use-this
  makeHTML(id: string = '', classes: string | Array<string> = []) {
    return new HTMLEquation(id, classes);
  }

  makeEqn() {
    return new Equation(
      this.draw2D,
      this.limits,
      // diagram.diagramToGLSpaceTransform,
    );
  }

  makeDescription(id: string) {
    return this.shapes.htmlElement(
      document.createElement('div'),
      id,
      'lesson__equation_description',
      new Point(0, 0), 'middle', 'left',
    );
  }

  fraction(...options: Array<{
      numerator?: string,
      denominotor?: string,
      color?: Array<number>,
      scale?: number,
    }>) {
    const defaultOptions = {
      numerator: '1',
      denominator: 'NOT DEFINED',
      color: [1, 0, 0, 1],
      scale: 0.5,
    };
    const optionsToUse = joinObjects(defaultOptions, ...options);

    const eqn = this.makeEqn();
    eqn.createElements({
      num: optionsToUse.numerator,
      den: optionsToUse.denominator,
      v: this.vinculum(optionsToUse.color),
    }, optionsToUse.color);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'baseline';
    eqn.formAlignment.scale = optionsToUse.scale;
    eqn.addForm('base', [eqn.frac('num', 'den', 'v')]);
    eqn.setCurrentForm('base');
    return eqn;
  }

  fractionPre(...options: Array<{
      numerator?: string,
      denominotor?: string,
      main?: string,
      color?: Array<number>,
      scale?: number,
      fracScale?: number,
    }>) {
    const defaultOptions = {
      numerator: '1',
      denominator: 'NOT DEFINED',
      main: 'NOT DEFINED',
      color: [1, 0, 0, 1],
      scale: 0.5,
      fracScale: 0.6,
    };
    const optionsToUse = joinObjects(defaultOptions, ...options);

    const eqn = this.makeEqn();
    eqn.createElements({
      num: optionsToUse.numerator,
      den: optionsToUse.denominator,
      main: optionsToUse.main,
      v: this.vinculum(optionsToUse.color),
    }, optionsToUse.color);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'baseline';
    eqn.formAlignment.scale = optionsToUse.scale;
    eqn.addForm('base', [eqn.sfrac('num', 'den', 'v', optionsToUse.fracScale), 'space', 'main']);
    eqn.setCurrentForm('base');
    return eqn;
  }
}
