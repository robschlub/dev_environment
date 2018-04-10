// @flow
import { Point } from './g2';
import Diagram from './Diagram';

class Gesture {
  previousPoint: Point;
  diagram: Diagram;

  constructor(diagram: Diagram) {
    // canvas.ontouchstart = this.touch_start_handler.bind(this);
    this.diagram = diagram;
    this.diagram.canvas.onmousedown = this.mouseDownHandler.bind(this);

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
    this.diagram.touchDownHandler(point);
  }
  // touchStartHandler(event) {
  //   let touch = event.touches[0];
  //   this.startHandler(d2.point(touch.pageX, touch.pageY));
  // }
  mouseDownHandler(event: MouseEvent) {
    this.startHandler(new Point(event.pageX, event.pageY));
  }
}

export default Gesture;
