function Lesson1Geometry (canvas) {
	"use strict";
	let webgl  = new WebGLInstance(canvas, 
                        "2d-vertex-shader", "2d-fragment-shader",
                       ["a_position", "u_matrix", "u_color"]);

	this.stickLength = 0.9;
	this.stickWidth = 0.01;
	let axisLength = 0.9;
	let traceWidth = 0.002;

	// dashLineLength = 0.9;
	let circleColor = [1.0,0.2,0.2,1];
	let axisColor = [0.9,0.9,0.9,1.0];
	let radialLinesColor = [0.8, 0.8, 0.8, 1];
	let dashedColor = [0.2, 0.7, 0.2, 1.0];
	let anchorColor = [0.9, 0.9, 0, 1.0];

	// this.hintArrowScale = 1.0;
	this.globals = GlobalVariables.getInstance();
	this.hintArrowFrequency = 0.5;
	this.hintArrowDisappearAngle = Math.PI/20;
	this.pulseAnchor = false;
	this.pulseAnchorFrequency = 0.5;
	this.pulseAnchorStartTime = -1;

	this.unitCircle    = new geo.polygon(           webgl.gl, webgl.locations, this.stickLength-traceWidth/2.0, 500, 500, traceWidth*3,         0, 0,0,circleColor);
	// this.xAxis         = new geo.horizontalLine(    webgl.gl, webgl.locations, new geo.coord(-axisLength, 0), axisLength*2.0, 0.005, axisColor);
	// this.yAxis         = new geo.horizontalLine(    webgl.gl, webgl.locations, new geo.coord(-axisLength, 0), axisLength*2.0, 0.005, axisColor);
	this.stick         = new geo.horizontalLine(    webgl.gl, webgl.locations, new geo.coord(0, 0), this.stickLength, this.stickWidth, [0.2,0.2,1.0,1]);
	this.anchor        = new geo.polygonFilled(     webgl.gl, webgl.locations, 0.03, 21, 21, 0, 0,0,anchorColor);
	this.anchor.hide = true;
	// this.xDashLine     = new geo.horizontalLineDash(webgl.gl, webgl.locations, new geo.coord(0,0), 1.0, 0.02, 0.01, 0.005, dashedColor);
	// this.yDashLine     = new geo.horizontalLineDash(webgl.gl, webgl.locations, new geo.coord(0,0), 1.0, 0.02, 0.01, 0.005, dashedColor);
	// this.circleArrow   = new geo.circleArrow(       webgl.gl, webgl.locations, 0.04, 0.04, circleColor);
	// this.radialLines01 = new geo.radialLines(       webgl.gl, webgl.locations, 0.65, 0.75, 0.003, Math.PI/180, Math.PI*2.0, radialLinesColor);
	// this.radialLines10 = new geo.radialLines(       webgl.gl, webgl.locations, 0.0, 0.8, 0.005, Math.PI/18, Math.PI*2.0, radialLinesColor);
	this.hintArrow     = new geo.arrow(             webgl.gl, webgl.locations, 0.14, 0.05, 0.14, 0.04, [1.0,0,0,1]);
	this.hintArrow.hide = true;

	this.drawFullCircle = true;
	let _this = this;

	function pulseAnchor () {
		_this.pulseAnchorStartTime = -1;
		_this.pulseAnchor = true;
	}
	function setDrawFullCircle(flag) {
		_this.drawFullCircle = flag;
	}
	// console.log(abcdefg);
	function draw(now, targetAngle) {

		// let new_animationId = animationId;

		// let stickEnd = new geo.coord(_this.unitCircle.radius*Math.cos(targetAngle),_this.unitCircle.radius*Math.sin(targetAngle))
		// let xDashRot = stickEnd.x >= 0 ? 0 : Math.PI;
		// let yDashRot = stickEnd.y >= 0 ? -Math.PI/2.0 : Math.PI/2.0;

		if (targetAngle < _this.hintArrowDisappearAngle && !_this.drawFullCircle) {
			let hintArrowScale = 0.2*Math.cos(now*_this.hintArrowFrequency*2.0*Math.PI)+0.8;
			_this.hintArrow.color[3] = 1-targetAngle/_this.hintArrowDisappearAngle;
			_this.hintArrow.draw(new geo.coord(_this.unitCircle.radius*0.9,-0.005),0,hintArrowScale);
			_this.globals.animateNextFrame();
		}



		// _this.xAxis.draw(new geo.coord(0,0),0,1);
		// _this.yAxis.draw(new geo.coord(0,0),Math.PI/2.0,1);



		// _this.xDashLine.draw(new geo.coord(0,stickEnd.y),xDashRot,1,Math.abs(stickEnd.x));
		// _this.yDashLine.draw(new geo.coord(stickEnd.x,0),yDashRot,1,Math.abs(stickEnd.y));
		// _this.radialLines01.draw(new geo.coord(0,0),0,1, targetAngle);
		// _this.radialLines10.draw(new geo.coord(0,0),0,1, targetAngle);
		if(_this.drawFullCircle) {
			_this.unitCircle.draw(new geo.coord(0,0), 0,1,Math.PI*2);	
		}
		else {
			_this.unitCircle.draw(new geo.coord(0,0), 0,1,targetAngle);
		}

		// if (targetAngle >= Math.atan2(_this.circleArrow.height, _this.unitCircle.radius)){
		// 	_this.circleArrow.draw(stickEnd, -targetAngle,1);
		// }

		_this.stick.draw(new geo.coord(0,0),targetAngle,1);

		if (_this.pulseAnchor) {
			if(_this.pulseAnchorStartTime == -1) {
				_this.pulseAnchorStartTime = now;
			}

			let deltaTime = now-_this.pulseAnchorStartTime;
			// console.log(_this.pulseAnchorStartTime);
			let anchorScale = 2.0*Math.sin(deltaTime*_this.pulseAnchorFrequency*2.0*Math.PI) + 1.0;
			_this.anchor.draw(new geo.coord(0,0),0,anchorScale,Math.PI*2.0);
			if (deltaTime > 1/_this.pulseAnchorFrequency/2){
				_this.pulseAnchor = false;
			}
			_this.globals.animateNextFrame();

		} else {
			_this.anchor.draw(new geo.coord(0,0),0,1,Math.PI*2.0);	
		}


		// return animationId;
	}
	return {
		draw: draw,
		stickLength: this.stickLength,
		stickWidth: this.stickWidth,
		anchor: this.anchor,
		hintArrow: this.hintArrow,
		unitCircle: this.unitCircle,
		stick: this.stick,
		setDrawFullCircle: setDrawFullCircle,
		pulseAnchor: pulseAnchor,
	}
}