/* eslint-disable */
import * as g2 from './g2';
import * as m2 from './m2';
//***************************************************************
// Base Geometry or Geometry Collection Object
//***************************************************************


function GeometryObjectOrCollection(translation, rotation, scale, name) {
        this.transform = new g2.Transform(translation, rotation, scale);
        this.setTransformCallback = false;
        this.show = false;
        this.globals = GlobalVariables.getInstance();
        this.lastDrawTransformMatrix = m2.identity();
        this.name = name;
        
        this.isBeingMoved = false;
        this.isMovable = false;
        this.isMovingFreely = false;
        this.isTouchable = false;

        this.isFollowing = false;

        this.isAnimatingPlan = false;
        this.animationPlanPhases = [];
        this.isAnimating = false;
        this.animationState = {
                elapsedTime:    0,
                startTime:     -1,
                deltaTime:      0, 
                initialTransform: new g2.Transform(),
                deltaTransform:   new g2.Transform(),
                style:          tools.easeout,
                callback:       false,
                index:          0,
            }
        this.presetTransforms = [];

        this.pulse = {
                        pulsing: false,
                        time:   1,
                        frequency: 0.5,
                        startTime: -1,
                        A: 1,           // Magnitude base for sinusoid
                        B: 0,           // Magnitude delta for sinusoid
                        C: 0,           // Time/Phase offset for sinusoid
                        pulsePattern: tools.sinusoid,
                    };
        this.move = {
                        previousTime: -1,
                        stopTime:      1,
                        time:          0,
                        deceleration: new g2.Transform(g2.point(1,1),1,g2.point(1,1)),
                        previous: new g2.Transform(),
                        velocity: new g2.Transform(),
                        maxVelocity: new g2.Transform(),
                        stopMovingVelocity: new g2.Transform(),
        }
        
    }
GeometryObjectOrCollection.prototype.vertexToScreen = function(vertex, canvas) {
        let canvasRect = canvas.getBoundingClientRect();
        let canvasWidth = canvas.scrollWidth;
        let canvasHeight = canvas.scrollHeight;
        let transformedVertex = m2.pointTransform(this.lastDrawTransformMatrix, vertex);
        return g2.point((transformedVertex.x+1.0)*canvasWidth/2.0 + canvasRect.left,
                        (-transformedVertex.y+1.0)*canvasHeight/2.0 + canvasRect.top);
    }
GeometryObjectOrCollection.prototype.isBeingTouched = function(location, canvas) {
        
        for(let m=0, n=this.vertices.border.length; m<n; ++m) {
            let border = [];
            for(let i=0, j=this.vertices.border[m].length; i<j;i++) {
                border[i] = this.vertexToScreen(this.vertices.border[m][i], canvas);
            }
            if(location.isInPolygon(border)) {
                return true;
            }
        }
        return false;
    }
GeometryObjectOrCollection.prototype.calcNextAnimationTransform= function(deltaTime) {
        let progress = this.animationState.style(deltaTime/this.animationState.deltaTime);
        let nextTransform = new g2.Transform();
        nextTransform.translation.x = this.animationState.initialTransform.translation.x + progress*this.animationState.deltaTransform.translation.x;
        nextTransform.translation.y = this.animationState.initialTransform.translation.y + progress*this.animationState.deltaTransform.translation.y;
        nextTransform.scale.x = this.animationState.initialTransform.scale.x + progress*this.animationState.deltaTransform.scale.x;
        nextTransform.scale.y = this.animationState.initialTransform.scale.y + progress*this.animationState.deltaTransform.scale.y;
        nextTransform.rotation = this.animationState.initialTransform.rotation + progress*this.animationState.deltaTransform.rotation;
        return nextTransform;
    }
GeometryObjectOrCollection.prototype.calcNextMovementTransform= function(deltaTime, velocity) {
    let nextTransform = this.transform.copy();
    // console.log("last: " + nextTransform.rotation + ", deltaTime: " + deltaTime + ", v: " + velocity.rotation)
    nextTransform.rotation += deltaTime*velocity.rotation;
    // console.log("next: " + nextTransform.rotation)
    nextTransform.translation.x += deltaTime*velocity.translation.x;
    nextTransform.translation.y += deltaTime*velocity.translation.y;
    nextTransform.scale.x += deltaTime*velocity.scale.x;
    nextTransform.scale.y += deltaTime*velocity.scale.y;
    return nextTransform;
}
GeometryObjectOrCollection.prototype.setNextTransform = function(now) {
    let nextTransform = this.getNextTransform(now);
    this.setTransform(nextTransform);
}
GeometryObjectOrCollection.prototype.setTransform = function(transform) {
    this.transform = transform.copy();
    if (this.setTransformCallback) {
        this.setTransformCallback(this.transform);
    }
}
GeometryObjectOrCollection.prototype.getNextTransform = function (now) {
        if (this.isAnimating) {
            if (this.animationState.startTime < 0) {
                this.animationState.startTime = now;
                return this.transform;
            }
            let deltaTime = now-this.animationState.startTime;
            if (deltaTime > this.animationState.deltaTime){
                if (this.animationState.index < this.animationPlanPhases.length-1) {
                    this.animationState.index += 1;
                    this.animatePhase(this.animationPlanPhases[this.animationState.index]);
                    return this.calcNextAnimationTransform(0);
                }
                // This needs to go before StopAnimating, incase stopAnimating calls a callback that 
                // changes the animation properties
                let returnPos = this.calcNextAnimationTransform(this.animationState.deltaTime);
                this.stopAnimating(true);
                return returnPos;
            }
            return this.calcNextAnimationTransform( deltaTime);
        }
        if (this.isMovingFreely) {
            if (this.move.previousTime < 0) {
                this.move.previousTime = now;
                return this.transform.copy();
            }
            else {
                let deltaTime = now-this.move.previousTime;                
                this.move.previousTime = now;
                this.move.velocity = this.changeVelocity(deltaTime);
                if(this.isVelocityZero(this.move.velocity)) {
                    this.move.velocity = new g2.Transform();
                    this.stopMovingFreely();
                    return this.transform.copy();
                }
                let nextTransform = this.calcNextMovementTransform(deltaTime, this.move.velocity);
                return nextTransform;
            } 
        }
        return new g2.Transform();
    }
GeometryObjectOrCollection.prototype.isVelocityZero=function(transform) {
    let threshold = new g2.Transform(g2.point(0.001, 0.001), 0.001, g2.point(0.001, 0.001));
    if (Math.abs(transform.rotation) > threshold.rotation) {
        return false;
    }
    if (Math.abs(transform.translation.x) > threshold.translation.x){
        return false;
    }
    if (Math.abs(transform.translation.y) > threshold.translation.y){
        return false;
    }
    if (Math.abs(transform.scale.x) > threshold.scale.x){
        return false;
    }
    if (Math.abs(transform.scale.y) > threshold.scale.y){
        return false;
    }
    return true;
}

GeometryObjectOrCollection.prototype.changeVelocity=function(deltaTime) {
    let velocity = this.move.velocity.copy();
    // let deceleration = 0.5;
    let slowdown = 0.8;
    // console.log(this.move.velocity);
    // velocity.rotation += -(velocity.rotation/Math.abs(velocity.rotation))*deceleration*deltaTime;
    velocity.rotation = tools.decelerate(velocity.rotation, this.move.deceleration.rotation, deltaTime);
    velocity.translation.x *= slowdown;
    velocity.translation.y *= slowdown;
    velocity.scale.x *= slowdown;
    velocity.scale.y *= slowdown;
    return velocity;
}
GeometryObjectOrCollection.prototype.getTransformMatrix = function(transformMatrix, now) {
        if (transformMatrix == false) {
                transformMatrix = m2.identity();
            }
        if (this.isAnimating) {
                this.setTransform(this.getNextTransform(now));
                this.globals.animateNextFrameFlag = true;
            }
        transformMatrix = m2.translate(transformMatrix, this.transform.translation.x, this.transform.translation.y);
        transformMatrix = m2.rotate(transformMatrix, this.transform.rotation);
        transformMatrix = m2.scale(transformMatrix, this.transform.scale.x, this.transform.scale.y);
        this.lastDrawTransformMatrix = m2.copy(transformMatrix);

        return transformMatrix;
    }
// Planned Animation
GeometryObjectOrCollection.prototype.animationPhase = function(transform, time, rotDirection=0, animationStyle = tools.easeinout) {
        let copy = transform.copy()
        return {
            transform: copy,
            time: time,
            rotDirection: rotDirection,
            animationStyle: animationStyle,
        }
    }
GeometryObjectOrCollection.prototype.animatePlan = function(phases, callback=false) {
        this.animationPlanPhases = []
        for (let i=0, j=phases.length;i<j;++i){
            this.animationPlanPhases.push(phases[i]);
        }
        if (this.animationPlanPhases.length > 0) {
            this.animationState.callback = callback;
            this.animationState.index = 0;
            this.animatePhase(this.animationPlanPhases[this.animationState.index]);
        }
    }
GeometryObjectOrCollection.prototype.animatePhase = function(phase) {
        let targetTransform = phase.transform;
        let time = phase.time;
        let rotDirection = phase.rotDirection;
        let animationStyle = phase.animationStyle;

        this.animationState.initialTransform =  this.transform.copy();
        let translationDiff = targetTransform.translation.sub(this.transform.translation);
        let scaleDiff = targetTransform.scale.sub(this.transform.scale);
        let rotDiff = tools.minAngleDiff(targetTransform.rotation, this.transform.rotation);
        
        if (rotDiff*rotDirection < 0){
            rotDiff = rotDirection * Math.PI*2.0 + rotDiff;
        }
        
        this.animationState.deltaTransform = new g2.Transform(translationDiff, rotDiff, scaleDiff);
        this.animationState.deltaTime = time;
        this.animationState.style = animationStyle;
        this.stopMoving(false);
        this.isAnimating = true;
        this.animationState.startTime = -1;
    }
GeometryObjectOrCollection.prototype.animateTo = function(transform, time=1, rotDirection=0, easeFunction = tools.easeinout, callback = false) {
    let phase = tools.animationPhase(transform,time,rotDirection,easeFunction);
    this.animatePlan([phase], callback);
}
GeometryObjectOrCollection.prototype.animateTranslationTo = function(translation, time=1, easeFunction = tools.easeinout, callback = false) {
    let transform = this.transform.copy();
    transform.translation = translation.copy();
    let phase = tools.animationPhase(transform,time,0,easeFunction);
    this.animatePlan([phase], callback);
}
GeometryObjectOrCollection.prototype.animateRotationTo = function(rotation, rotDirection, time=1, easeFunction = tools.easeinout, callback = false) {
    let transform = this.transform.copy();
    transform.rotation = rotation;
    let phase = tools.animationPhase(transform,time,rotDirection,easeFunction);
    this.animatePlan([phase], callback);
}
GeometryObjectOrCollection.prototype.animateTranslationAndRotationTo = function(translation, rotation, rotDirection, time=1, easeFunction = tools.easeinout, callback = false) {
    let transform = this.transform.copy();
    transform.rotation = rotation;
    transform.translation = translation.copy();
    let phase = tools.animationPhase(transform,time,rotDirection,easeFunction);
    this.animatePlan([phase], callback);
}

GeometryObjectOrCollection.prototype.stopAnimating = function(result) {
        this.isAnimating = false;
        this.animationPlanPhases = [];
        if (this.animationState.callback) {
            this.animationState.callback(result);
        }
        this.animationState.callback = false;
    }
// Movement
GeometryObjectOrCollection.prototype.startMoving= function() {
    this.stopAnimating();
    this.stopMovingFreely();
    this.move.velocity = new g2.Transform();
    this.move.previous = this.transform.copy();
    this.move.previousTime = Date.now()/1000;
    this.isBeingMoved = true;
}
GeometryObjectOrCollection.prototype.moved = function(newTransform) {
    this.calcVelocity(newTransform);
    // console.log(this.move.velocity.rotation)
}
GeometryObjectOrCollection.prototype.startMovingFreely = function() {
    this.isBeingMoved = false;
    this.isMovingFreely = true;
    this.move.previousTime = -1;
    // console.log(this.move.velocity.rotation);
}
GeometryObjectOrCollection.prototype.stopMovingFreely = function() {
    this.isMovingFreely = false;
    this.move.previousTime = -1;
}
GeometryObjectOrCollection.prototype.stopMoving = function() {
    this.isBeingMoved = false;
    this.move.previousTime = -1;
}
// GeometryObjectOrCollection.prototype.isVelocityZero = function() {
//     if (this.move.velocity.translation.x != 0 || this.move.velocity.translation.y != 0)
//         return false;
//     if (this.move.velocity.scale.x != 0 || this.move.velocity.scale.y != 0)
//         return false;
//     if (this.move.velocity.rotation != 0)
//         return false;
//     return true;
// }
GeometryObjectOrCollection.prototype.calcVelocity= function(newTransform) {
    let currentTime = Date.now()/1000;
    if (this.move.previousTime < 0) {
        this.move.previousTime = currentTime;
        return;
    }
    let deltaTime = currentTime - this.move.previousTime;
    // console.log("time: " + deltaTime)
    this.move.velocity = tools.calcAllVelocities(newTransform, this.transform, deltaTime, this.move.maxVelocity, this.move.stopMovingVelocity);
    this.move.previousTime = currentTime;
}


GeometryObjectOrCollection.prototype.transformWithPulse = function(now, transformMatrix) {
    let pulseTransformMatrix = m2.copy(transformMatrix);
    if (this.pulse.pulsing) {
        if(this.pulse.startTime == -1) {
            this.pulse.startTime = now;
        }

        let deltaTime = now-this.pulse.startTime;

        let scale = this.pulse.pulsePattern(deltaTime, this.pulse.frequency, this.pulse.A, this.pulse.B, this.pulse.C);
        let pulseTransform = this.getPulseTransform(scale);
        pulseTransformMatrix = m2.translate(pulseTransformMatrix, pulseTransform.translation.x, pulseTransform.translation.y);
        pulseTransformMatrix = m2.rotate(pulseTransformMatrix, pulseTransform.rotation);
        pulseTransformMatrix = m2.scale(pulseTransformMatrix, pulseTransform.scale.x, pulseTransform.scale.y);

        if (deltaTime > this.pulse.time && this.pulse.time != 0) {
            this.pulse.pulsing = false;
        }
        this.globals.animateNextFrame()
    }
    
    this.lastDrawTransformMatrix = m2.copy(pulseTransformMatrix);
    return pulseTransformMatrix;
}
GeometryObjectOrCollection.prototype.pulseNow = function() {
        this.pulse.pulsing = true;
        this.pulse.startTime = -1;
    }
GeometryObjectOrCollection.prototype.getPulseTransform = function(scale) {
    return new g2.Transform(g2.point(0,0),0,g2.point(scale,scale));
}

//***************************************************************
// Geometry Object
//***************************************************************
function GeometryObject (vertexObject, translation, rotation, scale, color) {
        "use strict"
        GeometryObjectOrCollection.call(this,translation, rotation, scale);
        this.vertices = vertexObject;
        this.color = color;
        this.pointsToDraw = -1;
        this.angleToDraw = -1;
    }
GeometryObject.prototype = Object.create(GeometryObjectOrCollection.prototype)
GeometryObject.prototype.draw = function(transformMatrix = false, now) {
        if(this.show) {
            // console.log(this.name)
            // if (transformMatrix == false) {
            //     transformMatrix = m2.identity();
            // }
            // if (this.isAnimating) {
            //     this.setTransform(this.getNextTransform(now));
            //     this.globals.animateNextFrameFlag = true;
            // }
            // transformMatrix = m2.translate(transformMatrix, this.transform.translation.x, this.transform.translation.y);
            // transformMatrix = m2.rotate(transformMatrix, this.transform.rotation);
            // transformMatrix = m2.scale(transformMatrix, this.transform.scale.x, this.transform.scale.y);
            // this.lastDrawTransformMatrix = m2.copy(transformMatrix);
            transformMatrix = this.getTransformMatrix(transformMatrix, now);
            transformMatrix = this.transformWithPulse(now, transformMatrix);
            let pointCount = this.vertices.numPoints;
            if(this.angleToDraw != -1) {
                pointCount = this.vertices.getPointCountForAngle(this.angleToDraw);
            }
            if(this.pointsToDraw != -1) {
                pointCount = this.pointsToDraw;
            }
            this.vertices.drawWithTransformMatrix(transformMatrix, pointCount, this.color);
        }
    }
GeometryObject.prototype.drawCustom = function(translation, rotation, scale, color) {
        if(this.show) {
            let transformMatrix = m2.identity();
            transformMatrix = m2.translate(transformMatrix, translation.x, translation.y);
            transformMatrix = m2.rotate(transformMatrix, rotation);
            transformMatrix = m2.scale(transformMatrix, scale.x, scale.y);
            this.vertices.drawWithTransformMatrix(transformMatrix, this.vertices.numPoints, color);
        }
    }

//***************************************************************
// Collection of Geometry Objects or Collections
//***************************************************************
function GeometryCollection(translation, rotation, scale) {
        GeometryObjectOrCollection.call(this,translation, rotation, scale);
        this.elements = {};
        this.order = []
    }
GeometryCollection.prototype = Object.create(GeometryObjectOrCollection.prototype)
GeometryCollection.prototype.add = function(name, geoObject) {
        this.elements[name] = geoObject;
        this.elements[name].name = name
        this['_' + name] = this.elements[name];
        this.order.push(name);
    }
GeometryCollection.prototype.draw = function(transformMatrix = false, now) {
        if(this.show) {
            // if (transformMatrix == false) {
            //     transformMatrix = m2.identity();
            // }
            // if (this.isAnimating) {
            //     this.setTransform(this.getNextTransform(now));
            //     this.globals.animateNextFrameFlag = true;
            // }
            // transformMatrix = m2.translate(transformMatrix, this.transform.translation.x, this.transform.translation.y);
            // transformMatrix = m2.rotate(transformMatrix, this.transform.rotation);
            // transformMatrix = m2.scale(transformMatrix, this.transform.scale.x, this.transform.scale.y);
            // this.lastDrawTransformMatrix = m2.copy(transformMatrix);

            transformMatrix = this.getTransformMatrix(transformMatrix, now);
            transformMatrix = this.transformWithPulse(now, transformMatrix);
            for (let i=0,j=this.order.length; i<j;++i) {
                let element = this.elements[this.order[i]];
                this.elements[this.order[i]].draw(transformMatrix, now)
            }
        }
    }
GeometryCollection.prototype.showAll = function() {
        for (let i=0,j=this.order.length; i<j;++i) {
            element = this.elements[this.order[i]]
            element.show = true;
            if (typeof element.hideAll == 'function') {
                element.showAll();
            }
        }
    }
GeometryCollection.prototype.hideAll = function() {
        for (let i=0,j=this.order.length; i<j;++i) {
            element = this.elements[this.order[i]]
            element.show = false;
            // console.log(element.name)
            if (typeof element.hideAll == 'function') {
                element.hideAll();
            }
        }
    }
GeometryCollection.prototype.showOnly = function(listToShow) {
        this.hideAll();
        for (let i=0,j=listToShow.length; i<j;++i) {
            let element = listToShow[i]
            element.show = true;

        }
    }
GeometryCollection.prototype.hideOnly = function(listToHide) {
        this.showAll();
        for (let i=0,j=listToHide.length; i<j;++i) {
            let element = listToShow[i]
            element.show = false;  
        }
    }

GeometryCollection.prototype.updateBias = function(scale, offset) {
    this.bias_transform = (new g2.Transform(offset, 0, scale)).matrix();
}
GeometryCollection.prototype.isBeingTouched = function(location, canvas) {
    for (let i=0,j=this.order.length; i<j;++i) {
        let element = this.elements[this.order[i]]
        if (element.show == true) {
            if (element.isBeingTouched(location, canvas)) {
                return true;
            }
        }
    }
    return false;
}

export { GeometryObject, GeometryCollection };
