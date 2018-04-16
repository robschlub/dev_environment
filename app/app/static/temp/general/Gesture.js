// var Lesson2Gestures = {}
// Lesson2Gestures.Lesson2Gestures = function(lesson) {
function Gesture (lesson) {
    "use strict";
    this.lesson = lesson;
    
    this.mouseDown = false;
    this.previousPoint;
    this.globals = GlobalVariables.getInstance();
}

Gesture.prototype.setupEventHandlers = function() {
    document.ontouchstart = this.touch_start_handler.bind(this);
    document.onmousedown  = this.mouse_down_handler.bind(this);
    
    document.ontouchend   = this.touch_end_handler.bind(this);
    document.onmouseup    = this.mouse_up_handler.bind(this);
    
    document.onmousemove  = this.mouse_move_handler.bind(this);
    document.ontouchmove  = this.touch_move_handler.bind(this); 
};
Gesture.prototype.startHandler = function(point) {
    if(!this.lesson.inTransition) {
        this.previousPoint = point;
        this.mouseDown = true; 
    }
    this.lesson.diagrams[0].touchDownHandler(point);
};
Gesture.prototype.touch_start_handler = function(event) {
    let touch = event.touches[0];
    this.startHandler(d2.point(touch.pageX, touch.pageY));
};
Gesture.prototype.mouse_down_handler = function(event) {
    this.startHandler(d2.point(event.pageX, event.pageY));
};
Gesture.prototype.endHandler = function() {
    if(!this.lesson.inTransition) {
        this.mouseDown = false;
        this.lesson.diagrams[0].stopTouches()
        this.globals.animateNextFrame();
    }
};
Gesture.prototype.touch_end_handler = function(event) {
    this.endHandler()
};
Gesture.prototype.mouse_up_handler = function(event) {
    this.endHandler()
};
Gesture.prototype.moveHandler = function(event, point) {
    if(!this.lesson.inTransition) {
        if (this.mouseDown) {
            let disableEvent = this.lesson.diagrams[0].touchMoveHandler(this.previousPoint, point);
            if (disableEvent) {
                event.preventDefault();
            }
            this.previousPoint = point;
        }
    }
}
Gesture.prototype.touch_move_handler = function(event) {
    let touch = event.touches[0];
    this.moveHandler(event, d2.point(touch.pageX, touch.pageY));
};
Gesture.prototype.mouse_move_handler = function(event) {
    this.moveHandler(event, d2.point(event.pageX, event.pageY));
};

// Gesture.prototype.onclick_handler = function(event) {
//  this.animateFrame();
// };
    
