// @flow

import WebGLInstance from './webgl';
import getShaders from './webgl/shaders';
import Polygon from './vertexObjects/Polygon';
import * as g2 from './g2';
import * as m2 from './m2';
import { DiagramElementCollection, DiagramElementPrimative } from './Element';
// import GlobalVariables from './globals';
import GlobalAnimation from './webgl/GlobalAnimation';

class Diagram {
  canvas: HTMLCanvasElement;
  webgl: WebGLInstance;
  elements: DiagramElementPrimative | DiagramElementCollection;
  activeElementsList: Array<DiagramElementPrimative | DiagramElementCollection>;
  lesson: Object;
  globalAnimation: GlobalAnimation;

  constructor(
    lesson: Object,
    canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;

    const shaders = getShaders('simple', 'simple');
    const webgl = new WebGLInstance(
      this.canvas,
      shaders.vertexSource,
      shaders.fragmentSource,
      shaders.varNames,
    );

    this.webgl = webgl;

    this.lesson = lesson;
    // this.elements = new DiagramElements(this.webgl);

    this.activeElementsList = [];
    this.globalAnimation = new GlobalAnimation();
    // this.devicePixelRatio = window.devicePixelRatio * 2;
    // this.devicePixelRatio = window.devicePixelRatio;
    this.elements = this.createDiagramElements();
    // this.counter=0;
  }

  stopAnimating() {
    for (let i = 0; i < this.activeElementsList.length; i += 1) {
      this.activeElementsList[i].stopAnimating();
    }
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
    this.elements.draw(m2.identity(), now);
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
