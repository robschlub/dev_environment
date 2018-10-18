// @flow
// import * as vertexShapes from './DrawingObjects/VertexObject/vertexShapes';
import WebGLInstance from './webgl/webgl';
import getShaders from './webgl/shaders';

import {
  Rect, Point, Transform,
  spaceToSpaceTransform, minAngleDiff,
} from './tools/g2';
import * as tools from './tools/mathtools';
import { isTouchDevice } from '../tools/tools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from './Element';
import GlobalAnimation from './webgl/GlobalAnimation';
// eslint-disable-next-line import/no-cycle
import Gesture from './Gesture';
import DrawContext2D from './DrawContext2D';
import VertexObject from './DrawingObjects/VertexObject/VertexObject';
import {
  PolyLine, PolyLineCorners,
} from './DiagramElements/PolyLine';
import type {
  TypePolyLineBorderToPoint,
} from './DiagramElements/PolyLine';
import {
  Polygon, PolygonFilled, PolygonLine,
} from './DiagramElements/Polygon';
import RadialLines from './DiagramElements/RadialLines';
import HorizontalLine from './DiagramElements/HorizontalLine';
import RectangleFilled from './DiagramElements/RectangleFilled';
import type { TypeRectangleFilledReference } from './DiagramElements/RectangleFilled';
import Lines from './DiagramElements/Lines';
import Arrow from './DiagramElements/Arrow';
import { AxisProperties } from './DiagramElements/Plot/AxisProperties';
import Axis from './DiagramElements/Plot/Axis';

import {
  DiagramText, DiagramFont, TextObject,
} from './DrawingObjects/TextObject/TextObject';
import HTMLObject from './DrawingObjects/HTMLObject/HTMLObject';
import Integral from './DiagramElements/Equation/Integral';
import {
  EquationForm, createEquationElements, Equation,
} from './DiagramElements/Equation/GLEquation';
// import type { EquationElementsType } from './DiagramElements/Equation/GLEquation';
import HTMLEquation from './DiagramElements/Equation/HTMLEquation';
// import { DiagramEquationNew } from './Equation';

// There are several coordinate spaces that need to be considered for a
// diagram.
//
// In the simplest diagram, there will be in hierarchy:
//  - GL Canvas
//    - Diagram
//      - Element Collection
//        - Element Primative
//          - Drawing Object (e.g. shape, text) from primative vertices
//
// A shape is defined in Drawing Object space.
// It is then transformed by the element primative
// It is then transformed by the element colleciton
// It is then transformed by the diagram
// it is then transformed into GL Space

// eslint-disable-next-line no-use-before-define
function equation(diagram: Diagram, high: boolean = false) {
  let webgl = diagram.webglLow;
  let draw2D = diagram.draw2DLow;
  if (high) {
    webgl = diagram.webglHigh;
    draw2D = diagram.draw2DHigh;
  }
  function elements(
    elems: Object,
    colorOrFont: Array<number> | DiagramFont = [],
    firstTransform: Transform = new Transform('elements'),
  ): DiagramElementCollection {
    return createEquationElements(
      elems,
      draw2D,
      colorOrFont,
      diagram.limits,
      firstTransform,
    );
  }

  function vinculum(color: Array<number> = [1, 1, 1, 1]) {
    return diagram.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }

  function strike(color: Array<number> = [1, 1, 1, 1]) {
    return diagram.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
  }

  function xStrike(color: Array<number> = [1, 1, 1, 1]) {
    const cross = diagram.shapes.collection(new Transform('strike').scale(1, 1).rotate(0).translate(0, 0));
    const strike1 = diagram.shapes.horizontalLine(
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
      diagram.limits,
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
      diagram.limits,
      // diagram.diagramToGLSpaceTransform,
    );
  }

  function makeDescription(id: string) {
    return diagram.shapes.htmlElement(
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
  };
}

// eslint-disable-next-line no-use-before-define
function shapes(diagram: Diagram, high: boolean = false) {
  let webgl = diagram.webglLow;
  let draw2D = diagram.draw2DLow;
  if (high) {
    webgl = diagram.webglHigh;
    draw2D = diagram.draw2DHigh;
  }

  function polyLine(
    points: Array<Point>,
    close: boolean,
    lineWidth: number,
    color: Array<number>,
    borderToPoint: TypePolyLineBorderToPoint = 'never',
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLine(
      webgl, points, close, lineWidth,
      color, borderToPoint, transform, diagram.limits,
    );
  }

  function text(
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
    const to = new TextObject(draw2D, [dT]);
    return new DiagramElementPrimative(
      to,
      new Transform().scale(1, 1).translate(location.x, location.y),
      color,
      diagram.limits,
    );
  }

  function htmlElement(
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
    diagram.htmlCanvas.appendChild(element);
    const hT = new HTMLObject(diagram.htmlCanvas, id, new Point(0, 0), alignV, alignH);
    const diagramElement = new DiagramElementPrimative(
      hT,
      new Transform().scale(1, 1).translate(location.x, location.y),
      [1, 1, 1, 1],
      diagram.limits,
    );
    // diagramElement.setFirstTransform();
    return diagramElement;
  }

  function htmlText(
    textInput: string,
    id: string = `id__temp_${Math.round(Math.random() * 10000)}`,
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

  function arrow(
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
      webgl, width, legWidth, height, legHeight,
      tip, rotation, color, transform, diagram.limits,
    );
  }
  function lines(
    linePairs: Array<Array<Point>>,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return Lines(webgl, linePairs, color, transform, diagram.limits);
  }

  function grid(
    bounds: Rect,
    xStep: number,
    yStep: number,
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
    return lines(linePairs, color, transform);
  }

  function polyLineCorners(
    points: Array<Point>,
    close: boolean,
    cornerLength: number,
    lineWidth: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLineCorners(
      webgl, points, close,
      cornerLength, lineWidth, color, transform, diagram.limits,
    );
  }
  function polygon(
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
      webgl, numSides, radius, lineWidth,
      rotation, direction, numSidesToDraw, color, transform, diagram.limits,
    );
  }
  function polygonFilled(
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
      webgl, numSides, radius,
      rotation, numSidesToDraw, color, transform, diagram.limits, textureLocation, textureCoords,
    );
  }
  function polygonLine(
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
      webgl, numSides, radius,
      rotation, direction, numSidesToDraw, numLines, color, transform, diagram.limits,
    );
  }
  function horizontalLine(
    start: Point,
    length: number,
    width: number,
    rotation: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return HorizontalLine(
      webgl, start, length, width,
      rotation, color, transform, diagram.limits,
    );
  }
  function rectangleFilled(
    topLeft: TypeRectangleFilledReference,
    width: number,
    height: number,
    cornerRadius: number,
    cornerSides: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return RectangleFilled(
      webgl, topLeft, width, height,
      cornerRadius, cornerSides, color, transform, diagram.limits,
    );
  }
  function radialLines(
    innerRadius: number = 0,
    outerRadius: number = 1,
    width: number = 0.05,
    dAngle: number = Math.PI / 4,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return RadialLines(
      webgl, innerRadius, outerRadius, width,
      dAngle, color, transform, diagram.limits,
    );
  }
  function collection(transformOrPoint: Transform | Point = new Transform()) {
    let transform = new Transform();
    if (transformOrPoint instanceof Point) {
      transform = transform.translate(transformOrPoint.x, transformOrPoint.y);
    } else {
      transform = transformOrPoint._dup();
    }
    return new DiagramElementCollection(transform, diagram.limits);
  }
  function repeatPattern(
    element: DiagramElementPrimative,
    xNum: number,
    yNum: number,
    xStep: number,
    yStep: number,
    transform: Transform | Point = new Transform(),
  ) {
    const group = collection(transform);
    const t = element.transform.t();
    if (t) {
      for (let x = 0; x < xNum; x += 1) {
        for (let y = 0; y < yNum; y += 1) {
          const copy = element._dup();
          copy.transform.updateTranslation(t.x + xStep * x, t.y + yStep * y);
          group.add(`xy${x}${y}`, copy);
        }
      }
    }
    return group;
  }
  function repeatPatternVertex(
    element: DiagramElementPrimative,
    xNum: number,
    yNum: number,
    xStep: number,
    yStep: number,
    transform: Transform | Point = new Transform(),
  ) {
    const copy = element._dup();
    const drawingObject = element.vertices;
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
          }
        }
      }
      copy.vertices.change(newPoints);
    }
    return copy;
  }
  function axes(
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
      webgl, draw2D, xProps,
      new Transform().scale(1, 1).rotate(0)
        .translate(0, xAxisLocation - limits.bottom * height / 2),
      diagram.limits,
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
      webgl, draw2D, yProps,
      new Transform().scale(1, 1).rotate(0)
        .translate(yAxisLocation - limits.left * width / 2, 0),
      diagram.limits,
    );

    let transform = new Transform();
    if (location instanceof Point) {
      transform = transform.translate(location.x, location.y);
    } else {
      transform = location._dup();
    }
    const xy = collection(transform);
    if (showGrid) {
      const gridLines = grid(
        new Rect(0, 0, width, height),
        tools.roundNum(stepX * width / limits.width, 8),
        tools.roundNum(stepY * height / limits.height, 8),
        gridColor, new Transform().scale(1, 1).rotate(0).translate(0, 0),
      );
      xy.add('grid', gridLines);
    }
    xy.add('y', yAxis);
    xy.add('x', xAxis);
    return xy;
  }

  return {
    polyLine,
    polyLineCorners,
    polygon,
    polygonFilled,
    polygonLine,
    horizontalLine,
    arrow,
    collection,
    lines,
    grid,
    text,
    radialLines,
    htmlText,
    htmlElement,
    axes,
    rectangleFilled,
    repeatPattern,
    repeatPatternVertex,
  };
}

class Diagram {
  canvasLow: HTMLCanvasElement;
  canvasHigh: HTMLCanvasElement;
  textCanvasLow: HTMLCanvasElement;
  textCanvasHigh: HTMLCanvasElement;
  draw2DLow: DrawContext2D;
  draw2DHigh: DrawContext2D;
  htmlCanvas: HTMLElement;
  webglLow: WebGLInstance;
  webglHigh: WebGLInstance;

  +elements: DiagramElementCollection;
  globalAnimation: GlobalAnimation;
  gesture: Gesture;
  inTransition: boolean;
  beingMovedElements: Array<DiagramElementPrimative |
                      DiagramElementCollection>;

  beingTouchedElements: Array<DiagramElementPrimative |
                        DiagramElementCollection>;

  moveTopElementOnly: boolean;

  limits: Rect;

  // gestureElement: HTMLElement;
  shapes: Object;
  shapesLow: Object;
  shapesHigh: Object;
  equation: Object;
  equationLow: Object;
  equationHigh: Object;
  backgroundColor: Array<number>;
  fontScale: number;
  layout: Object;

  glToDiagramSpaceTransform: Transform;
  diagramToGLSpaceTransform: Transform;
  pixelToDiagramSpaceTransform: Transform;
  diagramToPixelSpaceTransform: Transform;
  pixelToGLSpaceTransform: Transform;
  glToPixelSpaceTransform: Transform;
  diagramToCSSPercentSpaceTransform: Transform;

  drawQueued: boolean;

  isTouchDevice: boolean;

  constructor(
    // canvas: HTMLCanvasElement,
    containerIdOrWebGLContext: string | WebGLInstance = 'DiagramContainer',
    limitsOrxMin: number | Rect = new Rect(-1, -1, 2, 2),
    yMin: number = -1,
    width: number = 2,
    height: number = 2,
    backgroundColor: Array<number> = [1, 1, 1, 1],
    layout: Object = {},
    vertexShader: string = 'simple',
    fragmentShader: string = 'simple',
  ) {
    this.layout = layout;
    if (typeof containerIdOrWebGLContext === 'string') {
      const container = document.getElementById(containerIdOrWebGLContext);
      if (container instanceof HTMLElement) {
        const { children } = container;
        for (let i = 0; i < children.length; i += 1) {
          const child = children[i];
          if (child instanceof HTMLCanvasElement
            && child.classList.contains('diagram__gl')) {
            if (child.id === 'id_diagram__gl__low') {
              this.canvasLow = child;
            }
            if (child.id === 'id_diagram__gl__high') {
              this.canvasHigh = child;
            }
          }
          if (child instanceof HTMLCanvasElement
            && child.classList.contains('diagram__text')) {
            if (child.id === 'id_diagram__text__low') {
              this.textCanvasLow = child;
            }
            if (child.id === 'id_diagram__text__high') {
              this.textCanvasHigh = child;
            }
          }
          if (child.classList.contains('diagram__html')
          ) {
            this.htmlCanvas = child;
          }
          // if (child.classList.contains('diagram__gesture')) {
          //   this.gestureElement = child;
          // }
        }
        this.backgroundColor = backgroundColor;
        const shaders = getShaders(vertexShader, fragmentShader);
        const webglLow = new WebGLInstance(
          this.canvasLow,
          shaders.vertexSource,
          shaders.fragmentSource,
          shaders.varNames,
          this.backgroundColor,
        );
        const webglHigh = new WebGLInstance(
          this.canvasHigh,
          shaders.vertexSource,
          shaders.fragmentSource,
          shaders.varNames,
          this.backgroundColor,
        );
        this.webglLow = webglLow;
        this.webglHigh = webglHigh;
        // const draw2D = this.textCanvas.getContext('2d');
        this.draw2DLow = new DrawContext2D(this.textCanvasLow);
        this.draw2DHigh = new DrawContext2D(this.textCanvasHigh);
      }
    }
    if (containerIdOrWebGLContext instanceof WebGLInstance) {
      this.webglLow = containerIdOrWebGLContext;
    }
    // if (this.textCanvas instanceof HTMLCanvasElement) {
    //   this.draw2D = new DrawContext2D(this.textCanvas);
    // }
    if (this instanceof Diagram) {
      this.gesture = new Gesture(this);
    }

    this.fontScale = 1;
    let limits;
    if (limitsOrxMin instanceof Rect) {
      const r = limitsOrxMin;
      limits = new Rect(r.left, r.bottom, r.width, r.height);
    } else {
      limits = new Rect(limitsOrxMin, yMin, width, height);
    }
    this.updateLimits(limits);
    this.drawQueued = false;
    this.inTransition = false;
    // console.log(this.limits)
    this.beingMovedElements = [];
    this.beingTouchedElements = [];
    this.moveTopElementOnly = true;
    this.globalAnimation = new GlobalAnimation();
    this.shapesLow = this.getShapes(false);
    this.shapesHigh = this.getShapes(true);
    this.shapes = this.shapesLow;
    this.equationLow = this.getEquations(false);
    this.equationHigh = this.getEquations(true);
    this.equation = this.equationLow;
    this.createDiagramElements();
    if (this.elements.name === '') {
      this.elements.name = 'diagramRoot';
    }

    window.addEventListener('resize', this.resize.bind(this));
    this.sizeHtmlText();
    this.initialize();
    this.isTouchDevice = isTouchDevice();
    this.animateNextFrame();
  }

  getShapes(high: boolean = false) {
    return shapes(this, high);
  }

  getEquations(high: boolean = false) {
    return equation(this, high);
  }

  sizeHtmlText() {
    const scale = this.fontScale * 1 / 35;
    const size = this.htmlCanvas.offsetWidth * scale - 1;
    this.htmlCanvas.style.fontSize = `${size}px`;

    const style = window.getComputedStyle(document.documentElement);
    if (style) {
      const prop = '--lesson__diagram-font-size';
      const docElem = document.documentElement;
      if (docElem) {
        docElem.style.setProperty(prop, `${size}px`);
      }
    }
  }

  destroy() {
    this.gesture.destroy();
    this.webglLow.gl.getExtension('WEBGL_lose_context').loseContext();
    this.webglHigh.gl.getExtension('WEBGL_lose_context').loseContext();
  }

  // setGLDiagramSpaceTransforms() {
  //   const glSpace = {
  //     x: { bottomLeft: -1, width: 2 },
  //     y: { bottomLeft: -1, height: 2 },
  //   };
  //   const diagramSpace = {
  //     x: { bottomLeft: this.limits.left, width: this.limits.width },
  //     y: { bottomLeft: this.limits.bottom, height: this.limits.height },
  //   };

  //   this.diagramToGLSpaceTransformMatrix =
  //     spaceToSpaceTransformMatrix(glSpace, diagramSpace);
  //   this.glToDiagramSpaceTransformMatrix =
  //     spaceToSpaceTransformMatrix(diagramSpace, glSpace);
  // }

  setSpaceTransforms() {
    const glSpace = {
      x: { bottomLeft: -1, width: 2 },
      y: { bottomLeft: -1, height: 2 },
    };
    const diagramSpace = {
      x: { bottomLeft: this.limits.left, width: this.limits.width },
      y: { bottomLeft: this.limits.bottom, height: this.limits.height },
    };

    const canvasRect = this.canvasLow.getBoundingClientRect();
    const pixelSpace = {
      x: { bottomLeft: 0, width: canvasRect.width },
      y: { bottomLeft: canvasRect.height, height: -canvasRect.height },
    };

    const percentSpace = {
      x: { bottomLeft: 0, width: 1 },
      y: { bottomLeft: 1, height: -1 },
    };

    this.diagramToGLSpaceTransform =
      spaceToSpaceTransform(diagramSpace, glSpace, 'Diagram');

    this.glToDiagramSpaceTransform =
      spaceToSpaceTransform(glSpace, diagramSpace);

    this.pixelToDiagramSpaceTransform =
      spaceToSpaceTransform(pixelSpace, diagramSpace);

    this.diagramToPixelSpaceTransform =
      spaceToSpaceTransform(diagramSpace, pixelSpace);

    this.pixelToGLSpaceTransform =
      spaceToSpaceTransform(pixelSpace, glSpace);

    this.glToPixelSpaceTransform =
      spaceToSpaceTransform(glSpace, pixelSpace);

    this.diagramToCSSPercentSpaceTransform =
      spaceToSpaceTransform(diagramSpace, percentSpace);
  }

  initialize() {
    // this.setSpaceTransforms();
    this.elements.setFirstTransform(this.diagramToGLSpaceTransform);
  }

  updateLimits(limits: Rect) {
    this.limits = limits._dup();
    this.setSpaceTransforms();
  }

  resize() {
    this.webglLow.resize();
    this.webglHigh.resize();
    this.draw2DLow.resize();
    this.draw2DHigh.resize();
    this.setSpaceTransforms();
    this.sizeHtmlText();
    this.elements.resizeHtmlObject();
    this.animateNextFrame();
  }

  // Handle touch down, or mouse click events within the canvas.
  // The default behavior is to be able to move objects that are touched
  // and dragged, then when they are released, for them to move freely before
  // coming to a stop.
  touchDownHandler(clientPoint: Point) {
    if (this.inTransition) {
      return false;
    }

    // Get the touched point in clip space
    const pixelPoint = this.clientToPixel(clientPoint);
    // console.log(pixelPoint)
    const glPoint = pixelPoint.transformBy(this.pixelToGLSpaceTransform.matrix());
    // console.log(glPoint.transformBy(this.glToDiagramSpaceTransform.matrix()))
    // const clipPoint = this.clientToClip(clientPoint);

    // Get all the diagram elements that were touched at this point (element
    // must have isTouchable = true to be considered)
    this.beingTouchedElements = this.elements.getTouched(glPoint);
    if (this.moveTopElementOnly) {
      if (this.beingTouchedElements.length > 0) {
        this.beingTouchedElements[0].click();
      }
    } else {
      this.beingTouchedElements.forEach(e => e.click());
    }

    // Make a list of, and start moving elements that are being moved
    // (element must be touched and have isMovable = true to be in list)
    this.beingMovedElements = [];
    for (let i = 0; i < this.beingTouchedElements.length; i += 1) {
      const element = this.beingTouchedElements[i];
      if (element.isMovable) {
        this.beingMovedElements.push(element);
        element.startBeingMoved();
      }
    }
    if (this.beingMovedElements.length > 0) {
      this.animateNextFrame();
    }
    if (this.beingTouchedElements.length > 0) {
      return true;
    }
    return false;
  }

  // Handle touch up, or mouse click up events in the canvas. When an UP even
  // happens, the default behavior is to let any elements being moved to move
  // freely until they decelerate to 0.
  touchUpHandler() {
    // console.log("before", this.elements._circle.transform.t())
    // console.log(this.beingMovedElements)
    for (let i = 0; i < this.beingMovedElements.length; i += 1) {
      const element = this.beingMovedElements[i];
      if (element.state.isBeingMoved) {
        element.stopBeingMoved();
        element.startMovingFreely();
      }
    }
    this.beingMovedElements = [];
    this.beingTouchedElements = [];
    // console.log("after", this.elements._circle.transform.t())
  }

  rotateElement(
    element: DiagramElementPrimative | DiagramElementCollection,
    previousClientPoint: Point,
    currentClientPoint: Point,
  ) {
    let center = element.getDiagramPosition();
    if (center == null) {
      center = new Point(0, 0);
    }
    const previousPixelPoint = this.clientToPixel(previousClientPoint);
    const currentPixelPoint = this.clientToPixel(currentClientPoint);

    const previousDiagramPoint =
      previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
    const currentDiagramPoint =
      currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
    const currentAngle = Math.atan2(
      currentDiagramPoint.y - center.y,
      currentDiagramPoint.x - center.x,
    );
    const previousAngle = Math.atan2(
      previousDiagramPoint.y - center.y,
      previousDiagramPoint.x - center.x,
    );
    const diffAngle = minAngleDiff(previousAngle, currentAngle);
    const transform = element.transform._dup();
    let rot = transform.r();
    if (rot == null) {
      rot = 0;
    }
    const newAngle = rot - diffAngle;
    // if (newAngle < 0) {
    //   newAngle += 2 * Math.PI;
    // }
    // if (newAngle > 2 * Math.PI) {
    //   newAngle -= 2 * Math.PI;
    // }
    transform.updateRotation(newAngle);
    element.moved(transform._dup());
  }

  translateElement(
    element: DiagramElementPrimative | DiagramElementCollection,
    previousClientPoint: Point,
    currentClientPoint: Point,
  ) {
    const previousPixelPoint = this.clientToPixel(previousClientPoint);
    const currentPixelPoint = this.clientToPixel(currentClientPoint);

    const previousDiagramPoint =
      previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
    const currentDiagramPoint =
      currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());

    const delta = currentDiagramPoint.sub(previousDiagramPoint);
    const currentTransform = element.transform._dup();
    const currentTranslation = currentTransform.t();
    if (currentTranslation != null) {
      const newTranslation = currentTranslation.add(delta);
      currentTransform.updateTranslation(newTranslation);
      element.moved(currentTransform);
    }
  }

  scaleElement(
    element: DiagramElementPrimative | DiagramElementCollection,
    previousClientPoint: Point,
    currentClientPoint: Point,
    type: 'x' | 'y' | '' = '',
  ) {
    const previousPixelPoint = this.clientToPixel(previousClientPoint);
    const currentPixelPoint = this.clientToPixel(currentClientPoint);

    const previousDiagramPoint =
      previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
    const currentDiagramPoint =
      currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());

    const center = element.getDiagramPosition();
    const previousMag = previousDiagramPoint.sub(center).distance();
    const currentMag = currentDiagramPoint.sub(center).distance();
    const currentScale = element.transform.s();
    if (currentScale != null) {
      const currentTransform = element.transform._dup();
      const newScaleX = currentScale.x * currentMag / previousMag;
      const newScaleY = currentScale.y * currentMag / previousMag;
      if (type === 'x') {
        currentTransform.updateScale(newScaleX, 1);
      } else if (type === 'y') {
        currentTransform.updateScale(1, newScaleY);
      } else {
        currentTransform.updateScale(newScaleX, newScaleY);
      }
      element.moved(currentTransform);
    }
  }

  // Handle touch/mouse move events in the canvas. These events will only be
  // sent if the initial touch down happened in the canvas.
  // The default behavior is to drag (move) any objects that were touched in
  // the down event to the new location.
  // This function should return true if the move event should NOT be processed
  // by the system. For example, on a touch device, a touch and drag would
  // normally scroll the screen. Typically, you would want to move the diagram
  // element and not the screen, so a true would be returned.
  touchMoveHandler(previousClientPoint: Point, currentClientPoint: Point): boolean {
    if (this.inTransition) {
      return false;
    }
    if (this.beingMovedElements.length === 0) {
      return false;
    }

    const previousPixelPoint = this.clientToPixel(previousClientPoint);
    // const currentPixelPoint = this.clientToPixel(currentClientPoint);

    const previousGLPoint =
      previousPixelPoint.transformBy(this.pixelToGLSpaceTransform.matrix());
    // Go through each element being moved, get the current translation
    for (let i = 0; i < this.beingMovedElements.length; i += 1) {
      const element = this.beingMovedElements[i];
      if (element !== this.elements) {
        if (element.isBeingTouched(previousGLPoint)
              || element.move.canBeMovedAfterLoosingTouch) {
          const elementToMove = element.move.element == null ? element : element.move.element;
          if (elementToMove.state.isBeingMoved === false) {
            elementToMove.startBeingMoved();
          }
          if (this.beingMovedElements.indexOf(elementToMove) === -1) {
            this.beingMovedElements.push(elementToMove);
          }
          if (element.move.type === 'rotation') {
            this.rotateElement(
              elementToMove,
              previousClientPoint,
              currentClientPoint,
            );
          } else if (element.move.type === 'scale') {
            this.scaleElement(
              elementToMove,
              previousClientPoint,
              currentClientPoint,
            );
          } else if (element.move.type === 'scaleX') {
            this.scaleElement(
              elementToMove,
              previousClientPoint,
              currentClientPoint,
              'x',
            );
          } else if (element.move.type === 'scaleY') {
            this.scaleElement(
              elementToMove,
              previousClientPoint,
              currentClientPoint,
              'y',
            );
          } else {
            this.translateElement(
              elementToMove,
              previousClientPoint,
              currentClientPoint,
            );
          }
        }
      }
      if (this.moveTopElementOnly) {
        i = this.beingMovedElements.length;
      }
    }
    this.animateNextFrame();
    return true;
  }

  stop(flag: ?mixed) {
    this.elements.stop(flag);
  }

  // To add elements to a diagram, either this method can be overridden,
  // or the `add` method can be used.
  createDiagramElements() {
    // $FlowFixMe
    this.elements = new DiagramElementCollection();
    this.elements.diagramLimits = this.limits;
  }

  add(
    name: string,
    diagramElement: DiagramElementPrimative | DiagramElementCollection,
  ) {
    this.elements.add(name, diagramElement);
  }

  clearContext() {
    // const bc = this.backgroundColor;
    // this.webgl.gl.clearColor(bc[0], bc[1], bc[2], bc[3]);

    this.webglLow.gl.clearColor(0, 0, 0, 0);
    this.webglLow.gl.clear(this.webglLow.gl.COLOR_BUFFER_BIT);
    this.webglHigh.gl.clearColor(0, 0, 0, 0);
    this.webglHigh.gl.clear(this.webglHigh.gl.COLOR_BUFFER_BIT);
    if (this.draw2DLow) {
      this.draw2DLow.ctx.clearRect(
        0, 0, this.draw2DLow.ctx.canvas.width,
        this.draw2DLow.ctx.canvas.height,
      );
    }
    if (this.draw2DHigh) {
      this.draw2DHigh.ctx.clearRect(
        0, 0, this.draw2DHigh.ctx.canvas.width,
        this.draw2DHigh.ctx.canvas.height,
      );
    }
  }

  draw(now: number): void {
    this.drawQueued = false;
    this.clearContext();
    // This transform converts standard gl clip space, to diagram clip space
    // defined in limits.
    // const normWidth = 2 / this.limits.width;
    // const normHeight = 2 / this.limits.height;
    // const clipTransform = new Transform()
    //   .scale(normWidth, normHeight)
    //   .translate(
    //     (-this.limits.width / 2 - this.limits.left) * normWidth,
    //     (this.limits.height / 2 - this.limits.top) * normHeight,
    //   );
    // const t1 = performance.now();
    this.elements.draw(
      this.diagramToGLSpaceTransform,
      now,
    );

    if (this.elements.isMoving()) {
      this.animateNextFrame();
    }
    // console.log(performance.now() - t1)
    // console.log(Date.now() - measure)
  }

  animateNextFrame() {
    if (!this.drawQueued) {
      this.drawQueued = true;
      this.globalAnimation.queueNextFrame(this.draw.bind(this));
    }
  }

  isAnimating(): boolean {
    return this.elements.state.isAnimating;
  }

  clientToPixel(clientLocation: Point): Point {
    const canvas = this.canvasLow.getBoundingClientRect();
    return new Point(
      clientLocation.x - canvas.left,
      clientLocation.y - canvas.top,
    );
  }
}

export default Diagram;
