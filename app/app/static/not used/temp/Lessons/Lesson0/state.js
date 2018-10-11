
function Lesson1State (lesson) {
	"use strict";
	this.currentAngle = 0;          // radians
	this.previousAngle = 0;			// radians
	this.currentVelocity = 0;		// radians / s
	this.maxVelocity = 10;			// radians / s
	this.stopTime = 2;				// s
	this.currentStopTime = 0;		// s
	this.stopMovingVelocity = 0.01; // radians / s
	this.previousTime= -1 ; 		
	this.free = false;
	this.touchingStick = false;
	this.touchingOffset = 0;
	this.drawFullCircle = false;
	this.lesson = lesson;
	this.previousAngleTime = -1; 
	this.globals = GlobalVariables.getInstance();
	this.moveable = false;
	this.animation = false;
	this.animationStartAngle=0;
	this.animationStopAngle = 0;
	this.animationTime=0;
	this.animationCurrentTime=0;
	this.animationAngleDelta = 0;
	this.animationCompletion;
	this.previousAnimationTime = -1;
}

Lesson1State.prototype.isTouchingStick = function(point,buffer=1.0) {
	let zeroRotationPoint = geo.rotate(point, -this.currentAngle);
	if ((zeroRotationPoint.x > 0) && (zeroRotationPoint.x < this.lesson.geometry.stickLength) &&
	   (zeroRotationPoint.y >= -this.lesson.geometry.stickWidth/2.0*buffer) && (zeroRotationPoint.y <= this.lesson.geometry.stickWidth/2.0*buffer)) {
		return true;
	}
	return false;
};

Lesson1State.prototype.normVelocity = function() {
		if (this.currentVelocity > -this.stopMovingVelocity && this.currentVelocity < this.stopMovingVelocity) {
			this.currentVelocity = 0;
		}
		if (this.currentVelocity > this.maxVelocity) {
			this.currentVelocity = this.maxVelocity;
		}
		if (this.currentVelocity < -this.maxVelocity) {
			this.currentVelocity = -this.maxVelocity;
		}
	}

Lesson1State.prototype.getStickEnd = function() {
	return {
		x:this.lesson.geometry.stickLength*Math.cos(this.currentAngle), 
		y:this.lesson.geometry.stickLength*Math.sin(this.currentAngle)
	};
}

Lesson1State.prototype.calcVelocity = function(newAngle) {
		let currentAngleTime = Date.now()/1000;
		if (this.previousAngleTime<0) {
			this.previousAngleTime = currentAngleTime;
			return;
		}
		let deltaTime = currentAngleTime - this.previousAngleTime;
		this.previousAngleTime = currentAngleTime
		this.currentVelocity = (newAngle-this.currentAngle)/deltaTime;
		this.normVelocity();

		this.currentStopTime = 0;
		this.previousTime = -1;
}

Lesson1State.prototype.setCurrentAngle = function (newAngle) {
	if (this.moveable) {
		let normAngle = geo.normAngle(newAngle);
		
		if (this.currentAngle >= Math.PI*2.0*0.9 && normAngle <= Math.PI/8) {
			this.drawFullCircle = true;
		}
		while (normAngle > Math.PI*2) {
			normAngle -= Math.PI*2;
		}

		if(!this.drawFullCircle){
			while (normAngle < 0 || (normAngle > this.currentAngle && geo.minAngleDiff(normAngle, this.currentAngle) < 0)) {
				normAngle = 0;
			}
		}
		this.currentAngle = normAngle;

		this.lesson.director.checkAutoTransition();
	}
	
}

Lesson1State.prototype.getCurrentAngle = function(){
	return this.currentAngle;
}


Lesson1State.prototype.resetAngle = function() {
	this.setCurrentAngle(0);
}

Lesson1State.prototype.animateGoToAngle = function(targetAngle, direction, time, animationCompletion=false) {
	this.animationStartAngle = this.currentAngle;
	if (direction > 0) {		// Clockwise
		if(targetAngle > this.animationStartAngle) {
			this.animationAngleDelta = targetAngle-this.animationStartAngle;
		}
		if(targetAngle < this.animationStartAngle) {
			this.animationAngleDelta = targetAngle + Math.PI*2 - this.animationStartAngle;
		}
	}
	else if (direction < 0) {
		if(targetAngle > this.animationStartAngle) {
			this.animationAngleDelta = this.animationStartAngle + targetAngle - Math.PI*2
		}
		if(targetAngle < this.animationStartAngle) {
			this.animationAngleDelta = targetAngle-this.animationStartAngle;
		}
	}
	else {
		this.animationAngleDelta = geo.minAngleDiff(targetAngle, this.currentAngle);
	}
	
	this.animationTime = time;
	this.animationCurrentTime = 0;
	this.animationCompletion = animationCompletion;
	this.previousAnimationTime=-1;
	this.animation = true;
}
Lesson1State.prototype.stopAnimation = function (completed) {
	this.animation = false;
	if(this.animationCompletion) {
		this.animationCompletion(completed);
	}
}

Lesson1State.prototype.easeinout = function (percentTime) {
	let x = percentTime;
	let power = 2;
	let percentDistance = Math.pow(x,power) / (Math.pow(x,power) + Math.pow((1-x),power));
	return percentDistance;
}
Lesson1State.prototype.animateNextAngle = function(deltaTime) {
	this.animationCurrentTime += deltaTime;
	if (this.animationCurrentTime > this.animationTime) {
		this.animationCurrentTime = this.animationTime
	}
	
	let percentTime = this.animationCurrentTime / this.animationTime;
	let percentDistance = this.easeinout(percentTime);
	let newAngle = this.animationStartAngle + this.animationAngleDelta*percentDistance;

	this.setCurrentAngle(newAngle); 
	if (this.animationCurrentTime >= this.animationTime) {
		this.stopAnimation(true);
	}
}

Lesson1State.prototype.calculateCurrentAngle = function(deltaTime) {
	this.currentStopTime += deltaTime;
	let percentageStopTime = this.currentStopTime/this.stopTime;
	if (percentageStopTime > 1){
		percentageStopTime = 1;
	}
	this.currentVelocity -= this.currentVelocity*percentageStopTime;
	this.normVelocity();
	this.setCurrentAngle(this.currentAngle + this.currentVelocity*deltaTime);
}

Lesson1State.prototype.draw = function(now) {
	now *= 0.001;
	if ( (this.currentVelocity != 0) && (this.free) && !this.animation) {
		if (this.previousTime < 0) {
			this.previousTime = now;
		}
		let deltaTime = now-this.previousTime;
		this.previousTime = now;
		this.calculateCurrentAngle(deltaTime);
	}

	if (this.animation) {
		if (this.previousAnimationTime < 0) {
			this.previousAnimationTime = now;
		}
		this.animateNextAngle(now-this.previousAnimationTime);
		this.previousAnimationTime = now;

	}
	
	this.lesson.geometry.setDrawFullCircle(this.drawFullCircle);
	this.lesson.geometry.draw(now, this.currentAngle);	

	
	if ((this.currentVelocity !=0 && this.free) || this.animation) {
		this.globals.animateNextFrame();
	}
}

Lesson1State.prototype.makeFree = function(state) {
	if(state && !this.drawFullCircle && this.currentAngle == 0) {
		this.currentVelocity = 0;
	} 
	this.free = state;
}

Lesson1State.prototype.angleFromPoint = function(point) {
	let targetDistance = Math.sqrt(point.x*point.x + point.y*point.y);
	let angle = Math.atan2(point.y, point.x);
	if (angle < 0) {
		angle += Math.PI*2.0;
	}
	return geo.normAngle(angle);
};

Lesson1State.prototype.touchMoveHandler = function(previousPoint, point) {
		// If not previously touching stick, then check if doing so now
		let disableEvent = false;
	  	if (!this.touchingStick) {
			if (this.isTouchingStick(point)) {
	  			this.touchingStick = true;
			}
			// If moving fast, the touch update might not land on the stick, so check if
			// movement was over the stick
	  		if (!this.touchingStick) {
	  			let intersection = geo.intersection(previousPoint, point, {x:0,y:0}, this.getStickEnd() )
	  			if(intersection.result) {
	  				this.touchingStick = true;
	  			}
	  		}
	  		// Now, if touching the stick (for the first time), then make the stick track the touch
	  		// touchingOffset will be -ve when touching the negative side of the stick.
	  		if(this.touchingStick){
	  			let touchAngle = this.angleFromPoint(point);
	  			this.touchingOffset = geo.minAngleDiff(touchAngle, this.currentAngle);
	  			this.makeFree(false);
	  			this.stopAnimation(false);
	  		}
	  		// If not touching the stick, but close, then prevent the default action
	  		// a mouse/touch drag would have
	  		else if (this.isTouchingStick(point,50.0)) {
	  			disableEvent=true;
	  		}
	  	}

	  	// If the stick is being touched,
	  	if (this.touchingStick){
	  		disableEvent = true;
	  		let angle = this.angleFromPoint(point)-this.touchingOffset*1.001;
	  		angle = angle;

	  		this.calcVelocity(angle);
	  		this.setCurrentAngle(angle);
	    	this.animateFrame();
	  	}
	  	return disableEvent;
}
Lesson1State.prototype.stopTouches = function() {
	this.touchingStick = false;
	this.makeFree(true);
}

Lesson1State.prototype.animateFrame = function() {
	this.globals.animateNextFrame();
};

// exports.lesson1State = Lesson1State;