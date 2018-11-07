// @flow
import WebGLInstance from '../webgl/webgl';
import {
  Rect, Point, Transform,
} from '../tools/g2';
import {
  DiagramElementCollection,
} from '../Element';
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

export default function equation(
  webgl: WebGLInstance,
  draw2D: DrawContext2D,
  limits: Rect,
  shapes: Object,
) {
  function elements(
    elems: Object,
    colorOrFont: Array<number> | DiagramFont = [],
    firstTransform: Transform = new Transform('elements'),
  ): DiagramElementCollection {
    return createEquationElements(
      elems,
      draw2D,
      colorOrFont,
      limits,
      firstTransform,
    );
  }

  function vinculum(color: Array<number> = [1, 1, 1, 1]) {
    return shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }

  function strike(color: Array<number> = [1, 1, 1, 1]) {
    return shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
  }

  function xStrike(color: Array<number> = [1, 1, 1, 1]) {
    const cross = shapes.collection(new Transform('strike').scale(1, 1).rotate(0).translate(0, 0));
    cross.color = color;
    const strike1 = shapes.horizontalLine(
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

  function integral(
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Integral(
      webgl,
      color,
      numLines,
      new Transform('integral').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function bracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bracket(
      webgl,
      color,
      side,
      numLines,
      new Transform('bracket').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function bar(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bar(
      webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function squareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new SquareBracket(
      webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function brace(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Brace(
      webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function roundedSquareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new RoundedSquareBracket(
      webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      limits,
    );
  }

  function make(equationCollection: DiagramElementCollection) {
    return new EquationForm(equationCollection);
  }

  function makeHTML(id: string = '', classes: string | Array<string> = []) {
    return new HTMLEquation(id, classes);
  }

  function makeEqn() {
    return new Equation(
      draw2D,
      limits,
      // diagram.diagramToGLSpaceTransform,
    );
  }

  function makeDescription(id: string) {
    return shapes.htmlElement(
      document.createElement('div'),
      id,
      'lesson__equation_description',
      new Point(0, 0), 'middle', 'left',
    );
  }

  return {
    elements,
    vinculum,
    integral,
    make,
    makeHTML,
    makeEqn,
    strike,
    xStrike,
    makeDescription,
    bracket,
    bar,
    squareBracket,
    brace,
    roundedSquareBracket,
  };
}
