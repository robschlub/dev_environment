// @flow
// import * as vertexShapes from './vertexObjects/vertexShapes';
import WebGLInstance from './webgl/webgl';
import getShaders from './webgl/shaders';
// import Polygon from './vertexObjects/Polygon';
import { Rect, Point, Transform } from './tools/g2';
// import * as m2 from './m2';
import { DiagramElementCollection, DiagramElementPrimative } from './Element';
import GlobalAnimation from './webgl/GlobalAnimation';
import Gesture from './Gesture';
import DrawContext2D from './DrawContext2D';
import { PolyLine, PolyLineCorners } from './DiagramElements/PolyLine';
import { Polygon, PolygonFilled } from './DiagramElements/Polygon';
import HorizontalLine from './DiagramElements/HorizontalLine';

function shapes(webgl: WebGLInstance, limits: Rect) {
  function polyLine(
    points: Array<Point>,
    close: boolean,
    lineWidth: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLine(webgl, points, close, lineWidth, color, transform, limits);
  }
  function polyLineCorners(
    points: Array<Point>,
    close: boolean,
    cornerLength: number,
    lineWidth: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolyLineCorners(webgl, points, close, cornerLength, lineWidth, color, transform, limits);
  }
  function polygon(
    numSides: number,
    radius: number,
    lineWidth: number,
    rotation: number,
    numSidesToDraw: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return Polygon(
      webgl, numSides, radius, lineWidth,
      rotation, numSidesToDraw, color, transform, limits,
    );
  }
  function polygonFilled(
    numSides: number,
    radius: number,
    rotation: number,
    numSidesToDraw: number,
    color: Array<number>,
    transform: Transform | Point = new Transform(),
  ) {
    return PolygonFilled(
      webgl, numSides, radius,
      rotation, numSidesToDraw, color, transform, limits,
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
      rotation, color, transform, limits,
    );
  }
  function collection(transformOrPoint: Transform | Point = new Transform()) {
    let transform = new Transform();
    if (transformOrPoint instanceof Point) {
      transform = transform.translate(transformOrPoint.x, transformOrPoint.y);
    } else {
      transform = transformOrPoint.copy();
    }
    return new DiagramElementCollection(transform, limits);
  }
  return {
    polyLine,
    polyLineCorners,
    polygon,
    polygonFilled,
    horizontalLine,
    collection,
  };
}

class Diagram {
  canvas: HTMLCanvasElement;
  webgl: WebGLInstance;
  elements: DiagramElementCollection;
  globalAnimation: GlobalAnimation;
  gesture: Gesture;
  beingMovedElements: Array<DiagramElementPrimative |
                      DiagramElementCollection>;
  limits: Rect;
  draw2D: DrawContext2D;
  textCanvas: HTMLCanvasElement;
  htmlCanvas: HTMLElement;
  shapes: Object;
  backgroundColor: Array<number>;

  constructor(
    // canvas: HTMLCanvasElement,
    containerIdOrWebGLContext: string | WebGLInstance = 'DiagramContainer',
    limitsOrxMin: number | Rect = new Rect(-1, -1, 2, 2),
    yMin: number = -1,
    width: number = 2,
    height: number = 2,
    backgroundColor: Array<number> = [1, 1, 1, 1],
  ) {
    if (typeof containerIdOrWebGLContext === 'string') {
      const container = document.getElementById(containerIdOrWebGLContext);
      if (container instanceof HTMLElement) {
        const { children } = container;
        for (let i = 0; i < children.length; i += 1) {
          const child = children[i];
          if (child instanceof HTMLCanvasElement
            && child.classList.contains('diagram__gl')) {
            this.canvas = child;
          }
          if (child instanceof HTMLCanvasElement
            && child.classList.contains('diagram__text')) {
            this.textCanvas = child;
          }
          if (child.classList.contains('diagram__html')
          ) {
            this.htmlCanvas = child;
          }
        }
        this.backgroundColor = backgroundColor;
        const shaders = getShaders('simple', 'simple');
        const webgl = new WebGLInstance(
          this.canvas,
          shaders.vertexSource,
          shaders.fragmentSource,
          shaders.varNames,
          this.backgroundColor,
        );
        this.webgl = webgl;
      }
    }
    if (containerIdOrWebGLContext instanceof WebGLInstance) {
      this.webgl = containerIdOrWebGLContext;
    }
    if (this instanceof Diagram) {
      this.gesture = new Gesture(this);
    }

    if (limitsOrxMin instanceof Rect) {
      const r = limitsOrxMin;
      this.limits = new Rect(r.left, r.bottom, r.width, r.height);
    } else {
      this.limits = new Rect(limitsOrxMin, yMin, width, height);
    }
    console.log(this.limits)
    this.beingMovedElements = [];
    this.globalAnimation = new GlobalAnimation();
    this.shapes = this.getShapes();
    this.createDiagramElements();

    window.addEventListener('resize', this.resize.bind(this));

    this.animateNextFrame();
  }

  getShapes() {
    return shapes(this.webgl, this.limits);
  }

  destroy() {
    this.gesture.destroy();
    this.webgl.gl.getExtension('WEBGL_lose_context').loseContext();
  }
  resize() {
    this.webgl.resize();
    this.animateNextFrame();
  }
  // Handle touch down, or mouse click events within the canvas.
  // The default behavior is to be able to move objects that are touched
  // and dragged, then when they are released, for them to move freely before
  // coming to a stop.
  touchDownHandler(clientPoint: Point) {
    // Get the touched point in clip space
    const clipPoint = this.clientToClip(clientPoint);

    // Get all the diagram elements that were touched at this point (element
    // must have isTouchable = true to be considered)
    const touchedElements = this.elements.getTouched(clipPoint);
    // Make a list of, and start moving elements that are being moved
    // (element must be touched and have isMovable = true to be in list)
    this.beingMovedElements = [];
    for (let i = 0; i < touchedElements.length; i += 1) {
      const element = touchedElements[i];
      if (element.isMovable) {
        this.beingMovedElements.push(element);
        element.startBeingMoved();
      }
    }
    if (this.beingMovedElements.length > 0) {
      this.animateNextFrame();
    }
  }

  // Handle touch up, or mouse click up events in the canvas. When an UP even
  // happens, the default behavior is to let any elements being moved to move
  // freely until they decelerate to 0.
  touchUpHandler() {
    for (let i = 0; i < this.beingMovedElements.length; i += 1) {
      const element = this.beingMovedElements[i];
      element.stopBeingMoved();
      element.startMovingFreely();
    }
    this.beingMovedElements = [];
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
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    // Get the previous, current and delta between touch points in clip space
    const previousClipPoint = this.clientToClip(previousClientPoint);
    const currentClipPoint = this.clientToClip(currentClientPoint);
    const delta = currentClipPoint.sub(previousClipPoint);

    // Go through each element being moved, get the current translation
    for (let i = 0; i < this.beingMovedElements.length; i += 1) {
      const element = this.beingMovedElements[i];
      const currentTransform = element.transform.copy();
      const currentTranslation = currentTransform.t();
      if (currentTranslation && element.isBeingTouched(previousClipPoint)) {
        const newTranslation = currentTranslation.add(delta);
        currentTransform.updateTranslation(newTranslation);
        element.moved(currentTransform);
      }
    }
    this.globalAnimation.animateNextFrame();
    return true;
  }

  stop() {
    this.elements.stop();
  }

  // To add elements to a diagram, either this method can be overridden,
  // or the `add` method can be used.
  createDiagramElements() {
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
    const bc = this.backgroundColor;
    this.webgl.gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
    this.webgl.gl.clear(this.webgl.gl.COLOR_BUFFER_BIT);

    if (this.draw2D) {
      this.draw2D.ctx.clearRect(0, 0, this.draw2D.ctx.canvas.width, this.draw2D.ctx.canvas.height);
    }
  }

  draw(now: number): void {
    // const measure = Date.now()
    this.clearContext();
    // This transform converts standard gl clip space, to diagram clip space
    // defined in limits.
    const normWidth = 2 / this.limits.width;
    const normHeight = 2 / this.limits.height;
    const clipTransform = new Transform()
      .scale(normWidth, normHeight)
      .translate(
        (-this.limits.width / 2 - this.limits.left) * normWidth,
        (this.limits.height / 2 - this.limits.top) * normHeight,
      );
    this.elements.draw(
      clipTransform.matrix(),
      now,
    );

    if (this.elements.isMoving()) {
      this.animateNextFrame();
    }
    // console.log(Date.now() - measure)
  }

  animateNextFrame() {
    this.globalAnimation.queueNextFrame(this.draw.bind(this));
  }

  isAnimating(): boolean {
    return this.elements.state.isAnimating;
  }

  // clipToPage = function(x,y) { return {
  //     x: canvasL + canvasW*(x - clipL)/clipW,
  //     y: canvasT + canvasH*(clipT - y)/clipH,
  // }}
  clipToClient(clip: Point): Point {
    const canvas = this.canvas.getBoundingClientRect();
    return new Point(
      canvas.left + canvas.width *
        (clip.x - this.limits.left) / this.limits.width,
      canvas.top + canvas.height *
        (this.limits.top - clip.y) / this.limits.height,
    );
  }

  clipToPage(clip: Point): Point {
    const canvas = this.canvas.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || this.canvas.scrollLeft;
    const scrollTop = window.pageYOffset || this.canvas.scrollTop;
    const canvasPage = {
      top: canvas.top + scrollTop,
      left: canvas.left + scrollLeft,
    };

    return new Point(
      canvasPage.left + canvas.width *
        (clip.x - this.limits.left) / this.limits.width,
      canvasPage.top + canvas.height *
        (this.limits.top - clip.y) / this.limits.height,
    );
  }

  // pageToClip = function(x, y) { return {
  //    x: (x - canvasL)/canvasW * clipW + clipL,
  //    y: clipT - (y - canvasT)/canvasH * clipH,
  // }}
  clientToClip(clientLocation: Point): Point {
    const canvas = this.canvas.getBoundingClientRect();
    return new Point(
      (clientLocation.x - canvas.left) / canvas.width *
        this.limits.width + this.limits.left,
      this.limits.top - (clientLocation.y - canvas.top) /
        canvas.height * this.limits.height,
    );
  }

  pageToClip(pageLocation: Point): Point {
    const canvas = this.canvas.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || this.canvas.scrollLeft;
    const scrollTop = window.pageYOffset || this.canvas.scrollTop;
    const canvasPage = {
      top: canvas.top + scrollTop,
      left: canvas.left + scrollLeft,
    };
    return new Point(
      (pageLocation.x - canvasPage.left) / this.canvas.offsetWidth *
        this.limits.width + this.limits.left,
      this.limits.top - (pageLocation.y - canvasPage.top) /
        this.canvas.offsetHeight * this.limits.height,
    );
  }

  clipPerPixel(): Point {
    const x = this.limits.width / this.canvas.offsetWidth / window.devicePixelRatio;
    const y = this.limits.height / this.canvas.offsetHeight / window.devicePixelRatio;
    return new Point(x, y);
  }

  /* eslint-disable */
  // autoResize() {
  //   this.canvas.width = this.canvas.clientWidth * this.devicePixelRatio;
  //   this.canvas.height = this.canvas.clientHeight * this.devicePixelRatio;
  //   this.webgl.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

  //   this.canvasRect = this.canvas.getBoundingClientRect();
  //   this.targetRect = this.getTargetRect();

  //   let newZeroX = this.targetRect.left-this.canvasRect.left+this.targetRect.width / 2;
  //   let newZeroY = this.targetRect.top-this.canvasRect.top+this.targetRect.height/2;
  //   let scale = d2.point(this.globals.dimensions['canvas-width']/this.canvasRect.width,
  //                      this.globals.dimensions['canvas-width']/this.canvasRect.height)
  //   this.geometry.setTransform(tools.Transform(d2.point(newZeroX/this.canvasRect.width*2-1,
  //                             newZeroY/this.canvasRect.height*-2+1),
  //                         scale));
  //   this.geometry.updateBias(scale, 
  //                d2.point(newZeroX/this.canvasRect.width*2-1,
  //                      newZeroY/this.canvasRect.height*-2+1));  
  //   this.globals.updateCanvas(this.canvas);
  //   this.globals.animateNextFrame();
  // }
  /* eslint-enable */
}

export default Diagram;
