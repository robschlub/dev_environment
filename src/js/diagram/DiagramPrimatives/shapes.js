// @flow
import {
  Rect, Point, Transform,
} from '../tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../Element';
import WebGLInstance from '../webgl/webgl';
import DrawContext2D from '../DrawContext2D';
import * as tools from '../tools/mathtools';
import { generateUniqueId } from '../../tools/tools';
import VertexObject from '../DrawingObjects/VertexObject/VertexObject';
import {
  PolyLine, PolyLineCorners,
} from '../DiagramElements/PolyLine';
import Fan from '../DiagramElements/Fan';
import type {
  TypePolyLineBorderToPoint,
} from '../DiagramElements/PolyLine';
import {
  Polygon, PolygonFilled, PolygonLine,
} from '../DiagramElements/Polygon';
import RadialLines from '../DiagramElements/RadialLines';
import HorizontalLine from '../DiagramElements/HorizontalLine';
import RectangleFilled from '../DiagramElements/RectangleFilled';
import type { TypeRectangleFilledReference } from '../DiagramElements/RectangleFilled';
import Lines from '../DiagramElements/Lines';
import Arrow from '../DiagramElements/Arrow';
import { AxisProperties } from '../DiagramElements/Plot/AxisProperties';
import Axis from '../DiagramElements/Plot/Axis';
import {
  DiagramText, DiagramFont, TextObject,
} from '../DrawingObjects/TextObject/TextObject';
import HTMLObject from '../DrawingObjects/HTMLObject/HTMLObject';

export type TypeDiagramPrimatives = {
  polyLine: (
    Array<Point>,               // Points
    boolean,                    // close
    number,                     // lineWidth
    Array<number>,              // color
    TypePolyLineBorderToPoint,  // borderToPoint
    Transform | Point,          // transform
  ) => DiagramElementPrimative;
  // fan(
  //   points: Array<Point>,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // text(
  //   textInput: string,
  //   location: Point,
  //   color: Array<number>,
  //   fontInput: DiagramFont | null = null,
  // )
  // htmlElement(
  //   elementToAdd: HTMLElement | Array<HTMLElement>,
  //   id: string = `id__temp_${Math.round(Math.random() * 10000)}`,
  //   classes: string = '',
  //   location: Point = new Point(0, 0),
  //   alignV: 'top' | 'bottom' | 'middle' = 'middle',
  //   alignH: 'left' | 'right' | 'center' = 'left',
  // )
  // htmlText(
  //   textInput: string,
  //   id: string = generateUniqueId('id__html_text_'),
  //   classes: string = '',
  //   location: Point = new Point(0, 0),
  //   alignV: 'top' | 'bottom' | 'middle' = 'middle',
  //   alignH: 'left' | 'right' | 'center' = 'left',
  // ) {
  // arrow(
  //   width: number = 1,
  //   legWidth: number = 0.5,
  //   height: number = 1,
  //   legHeight: number = 0.5,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  //   tip: Point = new Point(0, 0),
  //   rotation: number = 0,
  // )
  // lines(
  //   linePairs: Array<Array<Point>>,
  //   numLinesThick: number = 1,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // grid(
  //   bounds: Rect,
  //   xStep: number,
  //   yStep: number,
  //   numLinesThick: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // polyLineCorners(
  //   points: Array<Point>,
  //   close: boolean,
  //   cornerLength: number,
  //   lineWidth: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // polygon(
  //   numSides: number,
  //   radius: number,
  //   lineWidth: number,
  //   rotation: number,
  //   direction: -1 | 1,
  //   numSidesToDraw: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // polygonFilled(
  //   numSides: number,
  //   radius: number,
  //   rotation: number,
  //   numSidesToDraw: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  //   textureLocation: string = '',
  //   textureCoords: Rect = new Rect(0, 0, 1, 1),
  // )
  // polygonLine(
  //   numSides: number,
  //   radius: number,
  //   rotation: number,
  //   direction: -1 | 1,
  //   numSidesToDraw: number,
  //   numLines: number,     // equivalent to thickness - integer
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // horizontalLine(
  //   start: Point,
  //   length: number,
  //   width: number,
  //   rotation: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // rectangleFilled(
  //   topLeft: TypeRectangleFilledReference,
  //   width: number,
  //   height: number,
  //   cornerRadius: number,
  //   cornerSides: number,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // radialLines(
  //   innerRadius: number = 0,
  //   outerRadius: number = 1,
  //   width: number = 0.05,
  //   dAngle: number = Math.PI / 4,
  //   color: Array<number>,
  //   transform: Transform | Point = new Transform(),
  // )
  // collection(transformOrPoint: Transform | Point = new Transform())
  // repeatPattern(
  //   element: DiagramElementPrimative,
  //   xNum: number,
  //   yNum: number,
  //   xStep: number,
  //   yStep: number,
  //   transform: Transform | Point = new Transform(),
  // )
  // repeatPatternVertex(
  //   element: DiagramElementPrimative,
  //   xNum: number,
  //   yNum: number,
  //   xStep: number,
  //   yStep: number,
  //   transform: Transform | Point = new Transform(),
  // )
  // axes(
  //   width: number = 1,
  //   height: number = 1,
  //   limits: Rect = new Rect(-1, -1, 2, 2),
  //   yAxisLocation: number = 0,
  //   xAxisLocation: number = 0,
  //   stepX: number = 0.1,
  //   stepY: number = 0.1,
  //   fontSize: number = 0.13,
  //   showGrid: boolean = true,
  //   color: Array<number> = [1, 1, 1, 0],
  //   gridColor: Array<number> = [1, 1, 1, 0],
  //   location: Transform | Point = new Transform(),
  //   decimalPlaces: number = 1,
  // )
};

export default class DiagramPrimatives {
  webgl: WebGLInstance;
  draw2D: DrawContext2D;
  limits: Rect;
  htmlCanvas: HTMLElement;
  high: boolean;
  polyLine: (
    Array<Point>,               // Points
    boolean,                    // close
    number,                     // lineWidth
    Array<number>,              // color
    TypePolyLineBorderToPoint,  // borderToPoint
    Transform | Point,          // transform
  ) => DiagramElementPrimative;

  constructor(
    webglLow: WebGLInstance,
    webglHigh: WebGLInstance,
    draw2DLow: DrawContext2D,
    draw2DHigh: DrawContext2D,
    limits: Rect,
    htmlCanvas: HTMLElement,
    high: boolean = false,
  ) {
    // diagram: Diagram, high: boolean = false) {
    this.webgl = webglLow;
    this.draw2D = draw2DLow;
    if (high) {
      this.webgl = webglHigh;
      this.draw2D = draw2DHigh;
    }
  }

  polyLine(
    points: Array<Point>,
    close: boolean,
    lineWidth: number,
    color: Array<number>,
    borderToPoint: TypePolyLineBorderToPoint = 'never',
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLine(
      this.webgl, points, close, lineWidth,
      color, borderToPoint, transform, this.limits,
    );
  }

  fan(
    points: Array<Point>,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return Fan(
      this.webgl, points,
      color, transform, this.limits,
    );
  }

  text(
    textInput: string,
    location: Point,
    color: Array<number>,
    fontInput: DiagramFont | null = null,
  ) {
    let font = new DiagramFont(
      'Times New Roman',
      'italic',
      0.2,
      '200',
      'center',
      'middle',
      color,
    );
    if (fontInput !== null) {
      font = fontInput;
    }
    const dT = new DiagramText(new Point(0, 0), textInput, font);
    const to = new TextObject(this.draw2D, [dT]);
    return new DiagramElementPrimative(
      to,
      new Transform().scale(1, 1).translate(location.x, location.y),
      color,
      this.limits,
    );
  }

  htmlElement(
    elementToAdd: HTMLElement | Array<HTMLElement>,
    id: string = `id__temp_${Math.round(Math.random() * 10000)}`,
    classes: string = '',
    location: Point = new Point(0, 0),
    alignV: 'top' | 'bottom' | 'middle' = 'middle',
    alignH: 'left' | 'right' | 'center' = 'left',
  ) {
    const element = document.createElement('div');
    if (classes && element) {
      const classArray = classes.split(' ');
      classArray.forEach(c => element.classList.add(c.trim()));
    }
    if (Array.isArray(elementToAdd)) {
      elementToAdd.forEach(e => element.appendChild(e));
    } else {
      element.appendChild(elementToAdd);
    }
    element.style.position = 'absolute';
    element.setAttribute('id', id);
    this.htmlCanvas.appendChild(element);
    const hT = new HTMLObject(this.htmlCanvas, id, new Point(0, 0), alignV, alignH);
    const diagramElement = new DiagramElementPrimative(
      hT,
      new Transform().scale(1, 1).translate(location.x, location.y),
      [1, 1, 1, 1],
      this.limits,
    );
    // diagramElement.setFirstTransform();
    return diagramElement;
  }

  htmlText(
    textInput: string,
    id: string = generateUniqueId('id__html_text_'),
    classes: string = '',
    location: Point = new Point(0, 0),
    alignV: 'top' | 'bottom' | 'middle' = 'middle',
    alignH: 'left' | 'right' | 'center' = 'left',
  ) {
    // const inside = document.createTextNode(textInput);
    const inside = document.createElement('div');
    inside.innerHTML = textInput;
    return this.htmlElement(inside, id, classes, location, alignV, alignH);
  }

  arrow(
    width: number = 1,
    legWidth: number = 0.5,
    height: number = 1,
    legHeight: number = 0.5,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
    tip: Point = new Point(0, 0),
    rotation: number = 0,
  ) {
    return Arrow(
      this.webgl, width, legWidth, height, legHeight,
      tip, rotation, color, transform, this.limits,
    );
  }

  lines(
    linePairs: Array<Array<Point>>,
    numLinesThick: number = 1,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return Lines(this.webgl, linePairs, numLinesThick, color, transform, this.limits);
  }

  grid(
    bounds: Rect,
    xStep: number,
    yStep: number,
    numLinesThick: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    const linePairs = [];
    // const xLimit = tools.roundNum(bounds.righ + xStep);
    if (xStep !== 0) {
      for (let x = bounds.left; tools.roundNum(x, 8) <= bounds.right; x += xStep) {
        linePairs.push([new Point(x, bounds.top), new Point(x, bounds.bottom)]);
      }
    }
    if (yStep !== 0) {
      for (let y = bounds.bottom; tools.roundNum(y, 8) <= bounds.top; y += yStep) {
        linePairs.push([new Point(bounds.left, y), new Point(bounds.right, y)]);
      }
    }
    return this.lines(linePairs, numLinesThick, color, transform);
  }

  polyLineCorners(
    points: Array<Point>,
    close: boolean,
    cornerLength: number,
    lineWidth: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLineCorners(
      this.webgl, points, close,
      cornerLength, lineWidth, color, transform, this.limits,
    );
  }

  polygon(
    numSides: number,
    radius: number,
    lineWidth: number,
    rotation: number,
    direction: -1 | 1,
    numSidesToDraw: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return Polygon(
      this.webgl, numSides, radius, lineWidth,
      rotation, direction, numSidesToDraw, color, transform, this.limits,
    );
  }

  polygonFilled(
    numSides: number,
    radius: number,
    rotation: number,
    numSidesToDraw: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
    textureLocation: string = '',
    textureCoords: Rect = new Rect(0, 0, 1, 1),
  ) {
    return PolygonFilled(
      this.webgl, numSides, radius,
      rotation, numSidesToDraw, color, transform, this.limits, textureLocation, textureCoords,
    );
  }

  polygonLine(
    numSides: number,
    radius: number,
    rotation: number,
    direction: -1 | 1,
    numSidesToDraw: number,
    numLines: number,     // equivalent to thickness - integer
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolygonLine(
      this.webgl, numSides, radius,
      rotation, direction, numSidesToDraw, numLines, color, transform, this.limits,
    );
  }

  horizontalLine(
    start: Point,
    length: number,
    width: number,
    rotation: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return HorizontalLine(
      this.webgl, start, length, width,
      rotation, color, transform, this.limits,
    );
  }

  rectangleFilled(
    topLeft: TypeRectangleFilledReference,
    width: number,
    height: number,
    cornerRadius: number,
    cornerSides: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return RectangleFilled(
      this.webgl, topLeft, width, height,
      cornerRadius, cornerSides, color, transform, this.limits,
    );
  }

  radialLines(
    innerRadius: number = 0,
    outerRadius: number = 1,
    width: number = 0.05,
    dAngle: number = Math.PI / 4,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return RadialLines(
      this.webgl, innerRadius, outerRadius, width,
      dAngle, color, transform, this.limits,
    );
  }

  collection(transformOrPoint: Transform | Point = new Transform()) {
    let transform = new Transform();
    if (transformOrPoint instanceof Point) {
      transform = transform.translate(transformOrPoint.x, transformOrPoint.y);
    } else {
      transform = transformOrPoint._dup();
    }
    return new DiagramElementCollection(transform, this.limits);
  }

  repeatPattern(
    element: DiagramElementPrimative,
    xNum: number,
    yNum: number,
    xStep: number,
    yStep: number,
    transform: Transform | Point = new Transform(),
  ) {
    const group = this.collection(transform);
    let t = element.transform.t();
    let transformToUse = element.transform._dup();
    if (t === null) {
      t = new Point(0, 0);
      transformToUse = transformToUse.translate(0, 0);
    }
    if (t) {
      for (let x = 0; x < xNum; x += 1) {
        for (let y = 0; y < yNum; y += 1) {
          const copy = element._dup();
          copy.transform = transformToUse._dup();
          copy.transform.updateTranslation(t.x + xStep * x, t.y + yStep * y);
          group.add(`xy${x}${y}`, copy);
        }
      }
    }
    return group;
  }

  // eslint-disable-next-line class-methods-use-this
  repeatPatternVertex(
    element: DiagramElementPrimative,
    xNum: number,
    yNum: number,
    xStep: number,
    yStep: number,
    transform: Transform | Point = new Transform(),
  ) {
    const copy = element._dup();
    const { drawingObject } = element;
    // console.log(element.drawingObject.points)
    if (drawingObject instanceof VertexObject) {
      copy.transform = transform._dup();
      const newPoints = [];
      const { points } = drawingObject;
      for (let x = 0; x < xNum; x += 1) {
        for (let y = 0; y < yNum; y += 1) {
          for (let p = 0; p < points.length; p += 2) {
            newPoints.push(new Point(
              points[p] + x * xStep,
              points[p + 1] + y * yStep,
            ));
            // console.log(points[p], points[p+1], newPoints.slice(-1))
          }
        }
      }
      // console.log(newPoints)
      copy.drawingObject.changeVertices(newPoints);
    }
    return copy;
  }

  axes(
    width: number = 1,
    height: number = 1,
    limits: Rect = new Rect(-1, -1, 2, 2),
    yAxisLocation: number = 0,
    xAxisLocation: number = 0,
    stepX: number = 0.1,
    stepY: number = 0.1,
    fontSize: number = 0.13,
    showGrid: boolean = true,
    color: Array<number> = [1, 1, 1, 0],
    gridColor: Array<number> = [1, 1, 1, 0],
    location: Transform | Point = new Transform(),
    decimalPlaces: number = 1,
  ) {
    const lineWidth = 0.01;
    const xProps = new AxisProperties('x', 0);

    xProps.minorTicks.mode = 'off';
    xProps.minorGrid.mode = 'off';
    xProps.majorGrid.mode = 'off';

    xProps.length = width;
    xProps.width = lineWidth;
    xProps.limits = { min: limits.left, max: limits.right };
    xProps.color = color.slice();
    xProps.title = '';

    xProps.majorTicks.start = limits.left;
    xProps.majorTicks.step = stepX;
    xProps.majorTicks.length = lineWidth * 5;
    xProps.majorTicks.offset = -xProps.majorTicks.length / 2;
    xProps.majorTicks.width = lineWidth * 2;
    xProps.majorTicks.labelMode = 'off';
    xProps.majorTicks.labels = tools.range(
      xProps.limits.min,
      xProps.limits.max,
      stepX,
    ).map(v => v.toFixed(decimalPlaces)).map((v) => {
      if (v === yAxisLocation.toString() && yAxisLocation === xAxisLocation) {
        return `${v}     `;
      }
      return v;
    });

    // xProps.majorTicks.labels[xProps.majorTicks.labels / 2] = '   0';
    xProps.majorTicks.labelOffset = new Point(
      0,
      xProps.majorTicks.offset - fontSize * 0.1,
    );
    xProps.majorTicks.labelsHAlign = 'center';
    xProps.majorTicks.labelsVAlign = 'top';
    xProps.majorTicks.fontColor = color.slice();
    xProps.majorTicks.fontSize = fontSize;
    xProps.majorTicks.fontWeight = '400';

    const xAxis = new Axis(
      this.webgl, this.draw2D, xProps,
      new Transform().scale(1, 1).rotate(0)
        .translate(0, xAxisLocation - limits.bottom * height / 2),
      this.limits,
    );

    const yProps = new AxisProperties('x', 0);
    yProps.minorTicks.mode = 'off';
    yProps.minorGrid.mode = 'off';
    yProps.majorGrid.mode = 'off';

    yProps.length = height;
    yProps.width = xProps.width;
    yProps.limits = { min: limits.bottom, max: limits.top };
    yProps.color = xProps.color;
    yProps.title = '';
    yProps.rotation = Math.PI / 2;

    yProps.majorTicks.step = stepY;
    yProps.majorTicks.start = limits.bottom;
    yProps.majorTicks.length = xProps.majorTicks.length;
    yProps.majorTicks.offset = -yProps.majorTicks.length / 2;
    yProps.majorTicks.width = xProps.majorTicks.width;
    yProps.majorTicks.labelMode = 'off';
    yProps.majorTicks.labels = tools.range(
      yProps.limits.min,
      yProps.limits.max,
      stepY,
    ).map(v => v.toFixed(decimalPlaces)).map((v) => {
      if (v === xAxisLocation.toString() && yAxisLocation === xAxisLocation) {
        return '';
      }
      return v;
    });

    // yProps.majorTicks.labels[3] = '';
    yProps.majorTicks.labelOffset = new Point(
      yProps.majorTicks.offset - fontSize * 0.2,
      0,
    );
    yProps.majorTicks.labelsHAlign = 'right';
    yProps.majorTicks.labelsVAlign = 'middle';
    yProps.majorTicks.fontColor = xProps.majorTicks.fontColor;
    yProps.majorTicks.fontSize = fontSize;
    yProps.majorTicks.fontWeight = xProps.majorTicks.fontWeight;

    const yAxis = new Axis(
      this.webgl, this.draw2D, yProps,
      new Transform().scale(1, 1).rotate(0)
        .translate(yAxisLocation - limits.left * width / 2, 0),
      this.limits,
    );

    let transform = new Transform();
    if (location instanceof Point) {
      transform = transform.translate(location.x, location.y);
    } else {
      transform = location._dup();
    }
    const xy = this.collection(transform);
    if (showGrid) {
      const gridLines = this.grid(
        new Rect(0, 0, width, height),
        tools.roundNum(stepX * width / limits.width, 8),
        tools.roundNum(stepY * height / limits.height, 8),
        1,
        gridColor, new Transform().scale(1, 1).rotate(0).translate(0, 0),
      );
      xy.add('grid', gridLines);
    }
    xy.add('y', yAxis);
    xy.add('x', xAxis);
    return xy;
  }
}
