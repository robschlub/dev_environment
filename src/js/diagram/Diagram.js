// @flow

import WebGLInstance from './webgl';
import getShaders from './webgl/shaders';
import Polygon from './vertexObjects/Polygon';
import * as g2 from './g2';
import { DiagramElementCollection, DiagramElementPrimative } from './Element';

class Diagram {
  canvas: HTMLCanvasElement;
  webgl: WebGLInstance;
  elements: DiagramElementPrimative | DiagramElementCollection;
  activeElementsList: Array<DiagramElementPrimative | DiagramElementCollection>;
  lesson: Object;

  constructor(
    lesson: Object,
    // DiagramElements: DiagramElementPrimative | DiagramElementCollection,
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
    // this.globals = new GlobalVariables();
    // this.devicePixelRatio = window.devicePixelRatio * 2;
    // this.devicePixelRatio = window.devicePixelRatio;
    this.elements = this.createDiagramElements();
  }

  stopAnimating() {
    for (let i = 0; i < this.activeElementsList.length; i += 1) {
      this.activeElementsList[i].stopAnimating();
    }
  }

  getAllActiveObjectsNextFrame(now: number) {
    let currentlyAnimating = false;
    for (let i = 0, j = this.activeElementsList.length; i < j; i += 1) {
      const activeObject = this.activeElementsList[i];
      if (activeObject.show) {
        if (activeObject.isAnimating || activeObject.isMovingFreely) {
          activeObject.setNextTransform(now);
          currentlyAnimating = true;
        }
      }
    }
    return currentlyAnimating;
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

  createDiagramElements() {
    const square = new Polygon(this.webgl, 1, 4, 4, 0.01, 0, g2.Point.zero());
    const collection = new DiagramElementCollection();
    collection.add('square', new DiagramElementPrimative(square));
    return collection;
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
