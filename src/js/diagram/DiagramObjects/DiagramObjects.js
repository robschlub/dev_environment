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
import DiagramObjectLine from './Line';
import type {
  TypeLineLabelLocation,
  TypeLineLabelSubLocation,
  TypeLineLabelOrientation,
} from './Line';

export default class DiagramObjects {
  webgl: WebGLInstance;
  draw2D: DrawContext2D;
  limits: Rect;
  shapes: Object;
  equation: Object;
  isTouchDevice: boolean;
  animateNextFrame: void => void;

  constructor(
    shapes: Object,
    equation: Object,
    isTouchDevice: boolean,
    animateNextFrame: () => void,
  ) {
    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
    this.isTouchDevice = isTouchDevice;
    this.animateNextFrame = animateNextFrame;
    this.equation = equation;
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

  line(
    referenceOrP1: 'center' | 'end' | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    showLine: boolean = true,
    largerTouchBorder: boolean = true,
  ) {
    return new DiagramObjectLine(
      this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      referenceOrP1, lengthOrP2, width, color, showLine, largerTouchBorder,
    );
  }

  lineArrow(
    referenceOrP1: 'center' | 'end' | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    arrowHeight: number = width * 4,
    arrowWidth: number = width * 4,
    largerTouchBorder: boolean = true,
  ) {
    const line = new DiagramObjectLine(
      this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      referenceOrP1, lengthOrP2, width, color, true, largerTouchBorder,
    );
    line.addArrow(2, arrowWidth, arrowHeight);
    return line;
  }

  lineArrows(
    referenceOrP1: 'center' | 'end' | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    arrowHeight: number = width * 4,
    arrowWidth: number = width * 4,
    largerTouchBorder: boolean = true,
  ) {
    const line = this.lineArrow(
      referenceOrP1, lengthOrP2, width, color, arrowHeight, arrowWidth,
      largerTouchBorder,
    );
    line.addArrow(1, arrowWidth, arrowHeight);
    return line;
  }

  lineLabelOnly(
    referenceOrP1: 'center' | 'end' | Point = 'center',
    lengthOrP2: number | Point,
    color: Array<number>,
    labelText: string,
    offset: number,
    location: TypeLineLabelLocation = 'outside',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'horizontal',
    linePosition: number = 0.5,
  ) {
    const line = new DiagramObjectLine(
      this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      referenceOrP1, lengthOrP2, 0.001, color, false, false,
    );
    line.addLabel(
      labelText, offset, location, subLocation, orientation, linePosition,
    );
  }
}
