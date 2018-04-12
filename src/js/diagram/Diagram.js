// @flow

import WebGLInstance from './webgl';
import getShaders from './webgl/shaders';
import Polygon from './vertexObjects/Polygon';
import * as g2 from './g2';
// import * as m2 from './m2';
import { DiagramElementCollection, DiagramElementPrimative } from './Element';
import GlobalAnimation from './webgl/GlobalAnimation';
import Gesture from './Gesture';

class Diagram {
  canvas: HTMLCanvasElement;
  webgl: WebGLInstance;
  elements: DiagramElementPrimative | DiagramElementCollection;
  lesson: Object;
  globalAnimation: GlobalAnimation;
  gesture: Gesture;
  beingMovedElements: Array<DiagramElementPrimative |
                      DiagramElementCollection>;
  // aspectRatio: g2.Point;
  clipRect: g2.Rect;

  constructor(
    lesson: Object,
    canvas: HTMLCanvasElement,
    clipXLeft: number,
    clipYTop: number,
    clipWidth: number,
    clipHeight: number,
  ) {
    this.canvas = canvas;
    if (this instanceof Diagram) {
      this.gesture = new Gesture(this);
    }

    const shaders = getShaders('simple', 'simple');
    const webgl = new WebGLInstance(
      this.canvas,
      shaders.vertexSource,
      shaders.fragmentSource,
      shaders.varNames,
    );
    this.clipRect = new g2.Rect(clipXLeft, clipYTop, clipWidth, clipHeight);

    this.webgl = webgl;
    this.lesson = lesson;
    this.beingMovedElements = [];
    this.globalAnimation = new GlobalAnimation();
    // this.devicePixelRatio = window.devicePixelRatio * 2;
    // this.devicePixelRatio = window.devicePixelRatio;
    this.elements = this.createDiagramElements();
  }

  // Handle touch down, or mouse click events within the canvas.
  // The default behavior is to be able to move objects that are touched
  // and dragged, then when they are released, for them to move freely before
  // coming to a stop.
  touchDownHandler(pagePoint: g2.Point) {
    // Get the touched point in clip space
    const clipPoint = this.screenToClip(pagePoint);

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
  touchMoveHandler(previousPagePoint: g2.Point, currentPagePoint: g2.Point): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    // Get the previous, current and delta between touch points in clip space
    const previousClipPoint = this.screenToClip(previousPagePoint);
    const currentClipPoint = this.screenToClip(currentPagePoint);
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

  getTargetRect() {
    return {
      left: 0,
      top: 0,
      width:
      this.canvas.width,
      height: this.canvas.height,
    };
  }

  // This should be overridden as it is the custom elements of a diagram
  createDiagramElements() {
    const square = new Polygon(this.webgl, 1, 4, 4, 0.01, 0, g2.Point.zero());
    const collection = new DiagramElementCollection();
    collection.add('square', new DiagramElementPrimative(square));
    return collection;
  }

  clearContext() {
    this.webgl.gl.clearColor(0.5, 0, 0, 0.5);
    this.webgl.gl.clear(this.webgl.gl.COLOR_BUFFER_BIT);
  }

  draw(now: number): void {
    this.clearContext();
    // This transform converts standard gl clip space, to diagram clip space
    // defined in clipRect.
    const normWidth = 2 / this.clipRect.width;
    const normHeight = 2 / this.clipRect.height;
    const clipTransform = new g2.Transform()
      .scale(normWidth, normHeight)
      .translate(
        (-this.clipRect.width / 2 - this.clipRect.left) * normWidth,
        (this.clipRect.height / 2 - this.clipRect.top) * normHeight,
      );
    this.elements.draw(
      clipTransform.matrix(),
      now,
    );

    if (this.elements.isMoving()) {
      this.animateNextFrame();
    }
  }

  animateNextFrame() {
    this.globalAnimation.queueNextFrame(this.draw.bind(this));
  }

  isAnimating(): boolean {
    return this.elements.state.isAnimating;
  }

  screenToClip(pageLocation: g2.Point): g2.Point {
    const canvasCenterOnPage = new g2.Point(
      this.canvas.offsetLeft + this.canvas.offsetWidth / 2,
      this.canvas.offsetTop + this.canvas.offsetHeight / 2,
    );

    const pageLocationRelativeToCanvasCenter = new g2.Point(
      pageLocation.x - canvasCenterOnPage.x,
      -(pageLocation.y - canvasCenterOnPage.y),
    );

    const screenPixelToClipRatio = new g2.Point(
      2 / this.canvas.offsetWidth,
      2 / this.canvas.offsetHeight,
    );
    const r = screenPixelToClipRatio;
    const l = pageLocationRelativeToCanvasCenter;
    return new g2.Point(
      r.x * l.x * this.clipRect.width / 2,
      r.y * l.y * this.clipRect.height / 2,
    );
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
