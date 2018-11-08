// @flow
import WebGLInstance from '../webgl/webgl';
import {
  Rect, Point,
} from '../tools/g2';
// import {
//   DiagramElementCollection,
// } from '../Element';
import DrawContext2D from '../DrawContext2D';
import EquationNavigator from './EquationNavigator';
import { Equation } from '../DiagramElements/Equation/GLEquation';

export default class DiagramObjects {
  webgl: WebGLInstance;
  draw2D: DrawContext2D;
  limits: Rect;
  shapes: Object;
  animateNextFrame: void => void;

  constructor(
    shapes: Object,
    animateNextFrame: () => void,
  ) {
    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
    this.animateNextFrame = animateNextFrame;
  }

  equationNavigator(
    equation: Equation,
    offset: Point,
    navType: 'threeLine' | 'descriptionOnly' | 'equationOnly' | 'oneLine' | 'twoLine' = 'threeLine',
    options: string | Array<string> = '',
    xAlign: 'left' | 'right' | 'center' = 'left',
    vAlign: 'top' | 'bottom' | 'middle' | 'baseline' = 'middle',
    id: string = `id_lesson__equation_navigator_${Math.floor(Math.random() * 10000)}`,
  ) {
    return new EquationNavigator(
      this.shapes, this.animateNextFrame, equation,
      offset, navType, options, xAlign, vAlign, id,
    );
  }
}
