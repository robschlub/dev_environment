// @flow
import { Point } from './g2';
import Diagram from './Diagram';

class Gesture {
  previousPoint: Point;
  diagram: Diagram;
  mouseDown: boolean;
  enable: boolean;
  start: (Point) => void;
  end: void => void;
  move: (Point, Point) => boolean;

  constructor(diagram: Diagram) {
    this.diagram = diagram;
    // console.log(diagram.canvas.offsetWidth)
    this.diagram.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.diagram.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.diagram.canvas.onmousemove = this.mouseMoveHandler.bind(this);

    this.diagram.canvas.addEventListener(
      'touchstart',
      this.touchStartHandler.bind(this), false,
    );
    this.diagram.canvas.addEventListener(
      'touchend',
      this.touchEndHandler.bind(this), false,
    );
    this.diagram.canvas.addEventListener(
      'touchmove',
      this.touchMoveHandler.bind(this), false,
    );
    this.enable = true;

    // Override these if you want to use your own touch handlers
    this.start = this.diagram.touchDownHandler.bind(this.diagram);
    this.end = this.diagram.touchUpHandler.bind(this.diagram);
    this.move = this.diagram.touchMoveHandler.bind(this.diagram);
  }


  startHandler(point: Point) {
    if (this.enable) {
      this.mouseDown = true;
      this.previousPoint = point;
      this.start(point);
    }
  }

  endHandler() {
    this.mouseDown = false;
    this.end();
  }

  moveHandler(event: MouseEvent | TouchEvent, point: Point) {
    if (this.enable && this.mouseDown) {
      const disableEvent = this.move(this.previousPoint, point);
      if (disableEvent) {
        event.preventDefault();
      }
      this.previousPoint = point;
    }
  }

  touchStartHandler(event: TouchEvent) {
    const touch = event.touches[0];
    this.startHandler(new Point(touch.pageX, touch.pageY));
  }
  mouseDownHandler(event: MouseEvent) {
    this.startHandler(new Point(event.pageX, event.pageY));
  }

  touchMoveHandler(event: TouchEvent) {
    const touch = event.touches[0];
    this.moveHandler(event, new Point(touch.pageX, touch.pageY));
  }
  mouseMoveHandler(event: MouseEvent) {
    this.moveHandler(event, new Point(event.pageX, event.pageY));
  }

  mouseUpHandler() {
    this.endHandler();
  }
  touchEndHandler() {
    this.endHandler();
  }
}

export default Gesture;
