// Each object is either being manually moved, or is animating
// If animating, it is either on a pre-planned animation, or it is following physics.
// Therefore, each object has:
//       isMoveable - manually moveable
//       isBeingMoved - manually
//       isAnimating
//       isBeingTouched

function Lesson1Diagram (lesson, canvas) {
    "use strict";
    Diagram.call(this, lesson, Lesson1Geometry, canvas);

    this.activeObjectList.push(this.geometry._circle._stick);

    this.touchingOffset = 0;
    this.drawFullCircle = false;
    
    let _this = this;
    this.geometry._circle._stick.setTransformCallback = function (transform) {
        _this.setCurrentAngle(transform.rotation);
    }
}
Lesson1Diagram.prototype = Object.create(Diagram.prototype);

Lesson1Diagram.prototype.draw = function(now) {
    now *= 0.001;

    // See if animation is currently happening
    let currentlyAnimating = this.getAllActiveObjectsNextFrame(now);

    // Make sure stick doesn't go past 0 when going backwards
    if(currentlyAnimating && this.geometry._circle._stick.transform.rotation < 0 ) {
        this.geometry._circle._stick.stopAnimating();
        this.geometry._circle._stick.stopMovingFreely();
        this.geometry._circle._stick.transform.rotation = 0;
    }

    // Make hint arrow disappear after some rotation
    let angleToDisappear = Math.PI/10;
    let alpha = 1-this.geometry._circle._stick.transform.rotation/angleToDisappear;
    if (alpha < 0) {
        alpha = 0
    }
    this.geometry._circle._hintArrow.color[3] = alpha;
    if (alpha == 0 ) {
        this.geometry._circle._hintArrow.pulse.pulsing = false;
    }
    else {
        this.geometry._circle._hintArrow.pulse.pulsing = true;  
    }

    this.geometry.draw(now);    
    
    if (currentlyAnimating){
        this.globals.animateNextFrame();
    }
}

// Stick Gestures
Lesson1Diagram.prototype.isTouchingStick = function(point,buffer=1.0) {
    let stick = this.geometry._circle._stick;
    return stick.isBeingTouched(point, this.lesson.diagrams[0].canvas);
};

Lesson1Diagram.prototype.isIntersectingWithStick = function(p1, p2, buffer=1.0) {
    let stick = this.geometry._circle._stick;
    let circle = this.geometry._circle;
    let stickWidth = this.geometry._circle.stickWidth;
    let center = circle.vertexToScreen(this.geometry._circle.transform.translation, this.lesson.diagrams[0].canvas);
    let end = circle.vertexToScreen(this.getStickEnd(), this.lesson.diagrams[0].canvas);
    let stickLine = d2.line(center, end);
    let touchLine = d2.line(p1,p2);
    let result = stickLine.intersectsWith(touchLine);

    return result.inLine;
}

Lesson1Diagram.prototype.getStickEnd = function() {
    return  d2.point(this.geometry._circle.stickLength*Math.cos(this.geometry._circle._stick.transform.rotation), 
                     this.geometry._circle.stickLength*Math.sin(this.geometry._circle._stick.transform.rotation));
    
}
// Lesson1Diagram.prototype.updateGeometryAngle = function(angle) {
//     this.geometry._circle._corner2.transform.rotation = angle;

Lesson1Diagram.prototype.setCurrentAngle = function (newAngle, onlyIfMovable = true) {
    let stick = this.geometry._circle._stick;
    if (stick.isMovable || !onlyIfMovable) {
        let normAngle = d2.normAngle(newAngle);

        while (normAngle > Math.PI*2) {
            normAngle -= Math.PI*2;
        }

        if(!this.drawFullCircle){
            while (normAngle < 0 || (normAngle > stick.transform.rotation && d2.minAngleDiff(normAngle, stick.transform.rotation) < 0)) {
                normAngle = 0;
            }
        }
        if (stick.isBeingMoved) {
            let newTransform = stick.transform.copy();
            newTransform.rotation = normAngle;
            stick.moved(newTransform);
        }

        stick.transform.rotation = normAngle;
        
        this.geometry._circle._rotationAngle.setAngle(normAngle);
        
        this.lesson.director.checkAutoTransition();
        // this.updateGeometryAngle(stick.transform.rotation);
        // this.updateAnnotation();
    }
}

Lesson1Diagram.prototype.resetAngle = function() {
    this.setCurrentAngle(0, false);
}




Lesson1Diagram.prototype.angleFromPoint = function(point) {

    let circle = this.geometry._circle;
    let center = circle.vertexToScreen(circle.transform.translation, this.lesson.diagrams[0].canvas);
    let vector = point.sub(center);

    let angle = Math.atan2(-vector.y, vector.x);
    if (angle < 0) {
        angle += Math.PI*2.0;
    }
    return d2.normAngle(angle);
};

Lesson1Diagram.prototype.touchDownHandler = function(point) {
    // let p = d2.point(point.x, point.y);
    // console.log(this.geometry._triangle._line.isBeingTouched(p, this.lesson.diagrams[0].canvas));
    // console.log(this.geometry._circle.isBeingTouched(p, this.lesson.diagrams[0].canvas));
}
Lesson1Diagram.prototype.touchMoveHandler = function(previousPoint, point) {
        // If not previously touching stick, then check if doing so now
        // console.log(point)
        // this.geometry.group.elements['obj1'].isBeingTouched(point);
        let disableEvent = false;
        let circle = this.geometry._circle;
        let stick = this.geometry._circle._stick;
        
        if (stick.isMovable){
            if (!stick.isBeingMoved) {
                if (this.isTouchingStick(point) || this.isTouchingStick(previousPoint)) {
                    stick.isBeingMoved = true;
                }
                // If moving fast, the touch update might not land on the stick, so check if
                // movement was over the stick
                if (!stick.isBeingMoved) {
                    let intersection = this.isIntersectingWithStick(previousPoint, point);
                    if(intersection) {
                        stick.isBeingMoved = true;
                    }
                }
                // Now, if touching the stick (for the first time), then make the stick track the touch
                // touchingOffset will be -ve when touching the negative side of the stick.
                if(stick.isBeingMoved){
                    let touchAngle = this.angleFromPoint(point);
                    this.touchingOffset = d2.minAngleDiff(touchAngle, stick.transform.rotation);
                    // this.makeFree(false);
                    // this.stopAnimation(false);
                    stick.stopAnimating();
                    stick.startMoving();
                }
                // If not touching the stick, but close, then prevent the default action
                // a mouse/touch drag would have
                else if (this.isTouchingStick(point,50.0)) {
                    disableEvent=true;
                }
            }

            // If the stick is being touched,
            if (stick.isBeingMoved){
                disableEvent = true;
                let angle = this.angleFromPoint(point)-this.touchingOffset*1.001;
                angle = angle;

                // this.stick.calcVelocity(new geoState.OffsetRotationScale(geo.point(0,0),angle,1.0));
                this.setCurrentAngle(angle);
                this.animateFrame();
            }
        }
        return disableEvent;
}
Lesson1Diagram.prototype.stopTouches = function() {

    let stick = this.geometry._circle._stick;
    if (stick.isBeingMoved){
        stick.isBeingMoved = false;
        stick.startMovingFreely();
    }


}

Lesson1Diagram.prototype.animateFrame = function() {
    this.globals.animateNextFrame();
};

// exports.Lesson2State = Lesson2State;