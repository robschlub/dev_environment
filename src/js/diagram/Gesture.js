// @flow
import { Point } from './g2';
import Diagram from './Diagram';

class Gesture {
  previousPoint: Point;
  diagram: Diagram;
  mouseDown: boolean;

  constructor(diagram: Diagram) {
    // canvas.ontouchstart = this.touch_start_handler.bind(this);
    this.diagram = diagram;
    this.diagram.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.diagram.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.diagram.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    // this.diagram.canvas.ontouchmove = this.touchMoveHandler.bind(this);
    // this.diagram.canvas.touchstart = this.touchStartHandler.bind(this);
    this.diagram.canvas.addEventListener('touchstart', this.touchStartHandler.bind(this), false);
    this.diagram.canvas.addEventListener('touchend', this.touchEndHandler.bind(this), false);
    this.diagram.canvas.addEventListener('touchmove', this.touchMoveHandler.bind(this), false);

    // document.ontouchend   = this.touch_end_handler.bind(this);
    // document.onmouseup    = this.mouse_up_handler.bind(this);

    // document.onmousemove  = this.mouse_move_handler.bind(this);
    // document.ontouchmove  = this.touch_move_handler.bind(this);
  }

  startHandler(point: Point) {
    // if(!this.lesson.inTransition) {
    //     this.previousPoint = point;
    //     this.mouseDown = true;
    // }
    this.mouseDown = true;
    this.previousPoint = point;
    this.diagram.touchDownHandler(point);
  }
  touchStartHandler(event: TouchEvent) {
    const touch = event.touches[0];
    this.startHandler(new Point(touch.pageX, touch.pageY));
  }
  mouseDownHandler(event: MouseEvent) {
    this.startHandler(new Point(event.pageX, event.pageY));
  }

  endHandler() {
    this.mouseDown = false;
    this.diagram.touchUpHandler();
  }

  mouseUpHandler() {
    this.endHandler();
  }
  touchEndHandler() {
    this.endHandler();
  }

  moveHandler(event: MouseEvent | TouchEvent, point: Point) {
    // eslint-disable
    // $FlowFixMe
    // eslint-enable
    if (this.mouseDown) {
      // console.log(`${this.mouseDown}, ${this.previousPoint}, ${point}`);
      const disableEvent = this.diagram.touchMoveHandler(this.previousPoint, point);
      if (disableEvent) {
        event.preventDefault();
      }
      this.previousPoint = point;
    }
  }

  touchMoveHandler(event: TouchEvent) {
    const touch = event.touches[0];
    // alert(touch.pageX);
    this.moveHandler(event, new Point(touch.pageX, touch.pageY));
  }

  mouseMoveHandler(event: MouseEvent) {
    this.moveHandler(event, new Point(event.pageX, event.pageY));
  }
}

export default Gesture;
