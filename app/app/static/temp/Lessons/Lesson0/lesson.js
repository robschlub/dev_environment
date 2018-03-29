function Lesson1() {
	"use strict";
	this.canvas         = document.getElementById("c");
	this.globals        = GlobalVariables.getInstance();

  	this.geometry       = new Lesson1Geometry(this.canvas);
  	this.state          = new Lesson1State(this);
  	this.director       = new LessonDirector(this);
  	this.director.addContent( new Lesson1Content(this.director));
  	this.gestureHandler = new Lesson1Gestures(this);
  	this.gestureHandler.setupEventHandlers();
  	
  	this.inTransition = false;
  	this.globals.setDrawMethod(this.state.draw.bind(this.state));
};

