// @flow

// Import colors from project scss files
import getColors from './colors';

// Singleton class that contains projects global variables
class GlobalVariables {
  // Method for requesting the next animation frame
  requestNextAnimationFrame: (()=>mixed) => AnimationFrameID;
  animationId: AnimationFrameID;    // used to cancel animation frames
  drawScene: (number) => void;      // method passed to animate next frame
  canvas: HTMLCanvasElement | null;       // canvas html element to draw to
  isTouchDevice: boolean;           // whether the device is PC or not
  animateNextFrameFlag: boolean;    // whether a frame is queued for animation
  colors: Object;                   // colors from the scss project files
  canvasRect: ClientRect | null;    // canvas rectangle
  canvasWidth: number;              // canvas scroll width
  canvasHeight: number;             // canvas scroll height
  static instance: Object;

  constructor() {
    // If the instance alread exists, then don't create a new instance.
    // If it doesn't, then setup some default values.
    if (!GlobalVariables.instance) {
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

  // Set a new draw method used by animation frames
  setDrawMethod(drawMethod: (number) => void) {
    this.drawScene = drawMethod;
  }

  // Queue up an animation frame
  animateNextFrame() {
    cancelAnimationFrame(this.animationId);
    // $FlowFixMe
    const nextFrame = this.requestNextAnimationFrame.call(window, this.drawScene);
    this.animationId = nextFrame;
  }

  // Update the canvas with an HTML element
  updateCanvas(canvas: HTMLCanvasElement | null) {
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
}

// Do not automatically create and instance and return it otherwise can't
// mock elements in jest
// // const globalvars: Object = new GlobalVariables();
// // Object.freeze(globalvars);

export default GlobalVariables;
