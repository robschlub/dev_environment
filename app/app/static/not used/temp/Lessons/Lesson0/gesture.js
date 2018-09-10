
function Lesson1Gestures (lesson) {
	"use strict";
	this.lesson = lesson;
	this.canvas = this.lesson.canvas;
	this.canvasRect = this.canvas.getBoundingClientRect();
	this.canvasWidth = this.canvas.scrollWidth;
	this.canvasHeight = this.canvas.scrollHeight;
	
	this.mouseDown = false;
	this.previousPoint;
	this.globals = GlobalVariables.getInstance();
}

Lesson1Gestures.prototype.screenToClip = function(point) {
	return {
		x: (point.x-this.canvasRect.left)/this.canvasWidth*2.0-1.0,
		y: -((point.y-this.canvasRect.top)/this.canvasHeight*2.0-1.0),
	}
}

Lesson1Gestures.prototype.getCanvasSize = function() {
	this.canvasRect = this.canvas.getBoundingClientRect();
	this.canvasWidth = this.canvas.scrollWidth;
	this.canvasHeight = this.canvas.scrollHeight;
}

Lesson1Gestures.prototype.setupEventHandlers = function() {
	document.ontouchstart = this.touch_start_handler.bind(this);
	document.onmousedown  = this.mouse_down_handler.bind(this);
	
	document.ontouchend   = this.touch_end_handler.bind(this);
	document.onmouseup    = this.mouse_up_handler.bind(this);
	
	document.onmousemove  = this.mouse_move_handler.bind(this);
	document.ontouchmove  = this.touch_move_handler.bind(this);	
};



Lesson1Gestures.prototype.startHandler = function(point) {
	if(!this.lesson.inTransition) {
		this.previousPoint = point;
		this.mouseDown = true; 
	}
};
Lesson1Gestures.prototype.touch_start_handler = function(event) {
	let touch = event.touches[0];
	this.startHandler(geo.point(touch.pageX, touch.pageY));
};

Lesson1Gestures.prototype.mouse_down_handler = function(event) {
	this.startHandler(geo.point(event.pageX, event.pageY));
};



Lesson1Gestures.prototype.endHandler = function() {
	if(!this.lesson.inTransition) {
		this.mouseDown = false;
		this.lesson.state.stopTouches()
		this.globals.animateNextFrame();
	}
};
Lesson1Gestures.prototype.touch_end_handler = function(event) {
	this.endHandler()
};
Lesson1Gestures.prototype.mouse_up_handler = function(event) {
	this.endHandler()
};



Lesson1Gestures.prototype.moveHandler = function(event, point) {
	if(!this.lesson.inTransition) {
		if (this.mouseDown) {
			// console.log("Moved " + point.x + ", " + point.y);
			let disableEvent = this.lesson.state.touchMoveHandler(this.screenToClip(this.previousPoint), this.screenToClip(point));
			if (disableEvent) {
				event.preventDefault();
			}
			this.previousPoint = point;
		}
	}
}

Lesson1Gestures.prototype.touch_move_handler = function(event) {
	let touch = event.touches[0];
	this.moveHandler(event, geo.point(touch.pageX, touch.pageY));
};
Lesson1Gestures.prototype.mouse_move_handler = function(event) {
	this.moveHandler(event, geo.point(event.pageX, event.pageY));
};

// Lesson1Gestures.prototype.onclick_handler = function(event) {
// 	this.animateFrame();
// };
	
