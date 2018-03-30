// @flow

import getColors from './colors';

class GlobalVariables {
  animationId: AnimationFrameID;
  drawScene: () => mixed;
  canvas: HTMLElement | null;
  isTouchDevice: boolean;
  colors: {};
  animateNextFrameFlag: boolean;
  requestNextAnimationFrame: (()=>mixed) => AnimationFrameID;
  colors: Object;
  canvasRect: ClientRect | null;
  canvasWidth: number;
  canvasHeight: number;
  static instance: Object;

  constructor() {
    if (!GlobalVariables.instance) {
      // this.animationId = 0;
      this.drawScene = () => {};
      this.updateCanvas(null);
      this.isTouchDevice = (
        'ontouchstart' in window            // works on most browsers
        || navigator.maxTouchPoints > 1     // works on IE10/11 and Surface
      );
      this.requestNextAnimationFrame = (
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame
      );
      this.colors = getColors();
      this.animateNextFrameFlag = false;
      GlobalVariables.instance = this;
    }

    return GlobalVariables.instance;
  }

  setDrawMethod(drawMethod: () => mixed) {
    this.drawScene = drawMethod;
  }

  animateNextFrame() {
    cancelAnimationFrame(this.animationId);
    const nextFrame = this.requestNextAnimationFrame(this.drawScene);
    this.animationId = nextFrame;
  }

  updateCanvas(canvas: HTMLElement | null) {
    this.canvas = canvas;
    if (canvas instanceof HTMLElement) {
      this.canvasRect = canvas.getBoundingClientRect();
      this.canvasWidth = canvas.scrollWidth;
      this.canvasHeight = canvas.scrollHeight;
    } else {
      this.canvasRect = null;
      this.canvasWidth = 0;
      this.canvasHeight = 0;
    }
  }

  // getColors() {
  //   this.colors = getColors();
  // }
}

// const globalvars: Object = new GlobalVariables();
// Object.freeze(globalvars);

export default GlobalVariables;
