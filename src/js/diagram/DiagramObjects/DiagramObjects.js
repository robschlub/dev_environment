// @flow
import WebGLInstance from '../webgl/webgl';
import {
  Rect, Point, Line,
} from '../tools/g2';
// import {
//   DiagramElementCollection,
// } from '../Element';
import DrawContext2D from '../DrawContext2D';
import EquationNavigator from './EquationNavigator';
import { Equation } from '../DiagramElements/Equation/GLEquation';
import { DiagramObjectLine } from './Line';
import type {
  TypeLineLabelLocation,
  TypeLineLabelSubLocation,
  TypeLineLabelOrientation,
  TypeVertexOrigin,
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

  // line(
  //   p1OrPosition: Point,
  //   p2OrLength: number | Point,
  //   angle: number,
  //   reference:
  //   )
  lineNew(
    position: Point,
    length: number,
    angle: number,
    width: number,
    color: Array<number>,
    vertexOrigin: 'start' | 'end' | 'center' | number | Point = 'start',
    showLine: boolean,
    largerTouchBorder: boolean,
  ) {
    return new DiagramObjectLine(
      this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      position, length, angle, vertexOrigin, width, color, showLine,
      largerTouchBorder,
    );
  }

  // linePoints(
  //   p1: Point,
  //   p2: Point,
  //   width: number,
  //   color: Array<number>,
  //   vertexOrigin: 'start' | 'end' | 'center' | number | Point = 'start',
  //   showLine: boolean,
  //   largerTouchBorder: boolean,
  //   ) {

  // }

  // length
  // width
  // color
  // vertexOrigin


  line(
    p1OrPositionOrLength: Point | number,
    p2OrLengthOrWidth: Point | number,
    widthOrAngleOrColor: number | Array<number>,
    colorOrWidthOrVertexOrigin: Array<number> | number | TypeVertexOrigin | null = null,
    vertexOriginOrColor: TypeVertexOrigin | Array<number> | null = null,
    showLineOrVertexOrigin: boolean | TypeVertexOrigin | null = null,
    largerTouchBorderOrShowLine: boolean | null = null,
    largerTouchBorder: boolean | null = null,
  ) {
    let position;
    let length;
    let angle;
    let width;
    let color;
    let vertexOrigin;
    let showLine;
    let largerTouchBorderToUse;
    if (p1OrPositionOrLength instanceof Point
      && p2OrLengthOrWidth instanceof Point) {
      const p1 = p1OrPositionOrLength;
      const p2 = p2OrLengthOrWidth;
      const line = new Line(p1, p2);
      position = p1OrPositionOrLength;
      length = line.length();
      angle = line.angle();
      width = widthOrAngleOrColor;
      color = colorOrWidthOrVertexOrigin;
      vertexOrigin = vertexOriginOrColor;
      showLine = showLineOrVertexOrigin;
      largerTouchBorderToUse = largerTouchBorderOrShowLine;
    } else if (p1OrPositionOrLength instanceof Point
      && typeof p2OrLengthOrWidth === 'number'
    ) {
      position = p1OrPositionOrLength;
      length = p2OrLengthOrWidth;
      angle = widthOrAngleOrColor;
      width = colorOrWidthOrVertexOrigin;
      color = vertexOriginOrColor;
      vertexOrigin = showLineOrVertexOrigin;
      showLine = largerTouchBorderOrShowLine;
      largerTouchBorderToUse = largerTouchBorder;
    } else {
      position = new Point(0, 0);
      length = p1OrPositionOrLength;
      width = p2OrLengthOrWidth;
      color = widthOrAngleOrColor;
      vertexOrigin = colorOrWidthOrVertexOrigin;
      showLine = true;
      largerTouchBorderToUse = true;
    }
    if (vertexOrigin == null) {
      vertexOrigin = 'start';
    }
    if (showLine == null) {
      showLine = true;
    }
    if (largerTouchBorderToUse == null) {
      largerTouchBorderToUse = true;
    }
    console.log(color,)
    return new DiagramObjectLine(
      // $FlowFixMe
      this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      // $FlowFixMe
      position, length, angle, vertexOrigin, width, color, showLine,
      // $FlowFixMe
      largerTouchBorder,
    );
  }

  lineOld(
    referenceOrP1: TypeVertexOrigin | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    showLine: boolean = true,
    largerTouchBorder: boolean = true,
  ) {
    let line;
    if (referenceOrP1 instanceof Point && lengthOrP2 instanceof Point) {
      line = new DiagramObjectLine(
        this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
        referenceOrP1, 1, 0, 'end', width, color, showLine,
        largerTouchBorder,
      );
      line.setEndPoints(referenceOrP1, lengthOrP2);
      // return line;
    } else if (referenceOrP1 instanceof Point && typeof lengthOrP2 === 'number') {
      line = this.lineNew(
        referenceOrP1, lengthOrP2, 0, width, color, 'start', showLine,
        largerTouchBorder,
      );
      // return line;
      // const line = new DiagramObjectLine(
      //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      //   referenceOrP1, lengthOrP2, width, 'end', width, color, showLine,
      //   largerTouchBorder,
      // )
      // return new DiagramObjectLine(
      //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
      //   referenceOrP1, lengthOrP2, width, color, showLine, largerTouchBorder,
      // );
    } else if (typeof lengthOrP2 === 'number') {
      line = this.lineNew(
        new Point(0, 0), lengthOrP2, 0, width, color, referenceOrP1, showLine,
        largerTouchBorder,
      );
    } else {
      line = this.lineNew(
        new Point(0, 0), 1, 0, 0.01, [1, 0, 0, 1], 'start', true, true,
      );
    }
    return line;
  }

  lineArrow(
    referenceOrP1: TypeVertexOrigin | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    arrowHeight: number = width * 4,
    arrowWidth: number = width * 4,
    largerTouchBorder: boolean = true,
  ) {
    const line = this.lineOld(
      referenceOrP1, lengthOrP2, width, color,
      true, largerTouchBorder,
    );
    // const line = new DiagramObjectLine(
    //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   referenceOrP1, lengthOrP2, width, color, true, largerTouchBorder,
    // );
    line.addArrow(2, arrowWidth, arrowHeight);
    return line;
  }

  lineArrows(
    referenceOrP1: TypeVertexOrigin | Point = 'center',
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
    referenceOrP1: TypeVertexOrigin | Point = 'center',
    lengthOrP2: number | Point,
    color: Array<number>,
    labelText: string | Equation | Array<string>,
    offset: number,
    location: TypeLineLabelLocation = 'outside',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'horizontal',
    linePosition: number = 0.5,
  ) {
    const line = this.lineOld(
      referenceOrP1, lengthOrP2, 0.001, color,
      false, false,
    );
    // const line = new DiagramObjectLine(
    //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   referenceOrP1, lengthOrP2, 0.001, color, false, false,
    // );
    line.addLabel(
      labelText, offset, location, subLocation, orientation, linePosition,
    );
    return line;
  }

  lineLabel(
    referenceOrP1: TypeVertexOrigin | Point = 'center',
    lengthOrP2: number | Point,
    width: number,
    color: Array<number>,
    labelText: string | Equation | Array<string>,
    offset: number,
    location: TypeLineLabelLocation = 'outside',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'horizontal',
    linePosition: number = 0.5,
  ) {
    // const line = new DiagramObjectLine(
    //   this.shapes, this.equation, this.isTouchDevice, this.animateNextFrame,
    //   referenceOrP1, lengthOrP2, width, color, true, false,
    // );
    const line = this.lineOld(
      referenceOrP1, lengthOrP2, width, color,
      true, false,
    );
    line.addLabel(
      labelText, offset, location, subLocation, orientation, linePosition,
    );
    return line;
  }
}
