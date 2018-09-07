let tools = (function(){
    function Point (x,y) {
        return new point(x,y);
    }
    function Point0 () {
        return new point(0,0);
    }
    function Point1() {
        return new point(1,1);
    }
    function point (x, y) {
        this.x = x;
        this.y = y;
    }
    point.prototype.sub = function(p2) {
        return new point(this.x-p2.x,this.y-p2.y);        
    }
    point.prototype.add = function(p2) {
        return new point(this.x+p2.x,this.y+p2.y);
    }

    function transformToMatrix(transform) {
        let transformMatrix = m3.identity();
        transformMatrix = m3.translate(transformMatrix, transform.translation.x, transform.translation.y);
        transformMatrix = m3.rotate(transformMatrix, transform.rotation);
        transformMatrix = m3.scale(transformMatrix, transform.scale.x, transform.scale.y);
        return transformMatrix;
    }

    function TransformCopy(transform) {
        return new _transform(new point(transform.translation.x, transform.translation.y),
                              transform.rotation,
                              new point(transform.scale.x, transform.scale.y));
        // return new _transformCopy (transform);
    }
    function Transform(translation = {x:0,y:0}, rotation = 0, scale = {x:0,y:0}) {
        return new _transform(translation, rotation, scale);
    }
    function TransformZero() {
        return new _transform(d2.point(0,0), 0, d2.point(1,1));
    }
    // function _transformCopy (transform) {
    //     return {
    //         translation: new point(transform.translation.x, transform.translation.y),
    //         rotation: transform.rotation,
    //         scale: new point(transform.scale.x, transform.scale.y),
    //     }
    // }
    function _transform (translation = {x:0,y:0}, rotation = 0, scale = {x:0,y:0}) {
        // return {
            this.translation = d2.point(translation.x, translation.y);
            this.rotation = rotation;
            this.scale = d2.point(scale.x, scale.y);
        // }
    }
    _transform.prototype.sub = function(transformToSubtract) {
        return new _transform(this.translation.sub(transformToSubtract.translation),
                              minAngleDiff(this.rotation, transformToSubtract.rotation),
                              this.scale.sub(transformToSubtract.scale));
    }
    _transform.prototype.copy = function() {
        return new _transform(d2.point(this.translation.x, this.translation.y),
                              this.rotation,
                              d2.point(this.scale.x, this.scale.y));
    }

    function normVelocityValue (velocity, max, min) {
        let result = velocity;
        if (velocity > -min && velocity < min) {
            result = 0;
        }
        if (velocity > max) {
            result = max;
        }
        if (velocity < -max) {
            result = -max;
        }
        return result;
    }


    function calcAllVelocities(curr, old, deltaTime, max, min) {
        let result = Transform();
        result.translation.x = normVelocityValue((curr.translation.x-old.translation.x)/deltaTime,max.translation.x, min.translation.x);
        result.translation.y = normVelocityValue((curr.translation.y-old.translation.y)/deltaTime,max.translation.y, min.translation.y);
        result.scale.x  = normVelocityValue((curr.scale.x - old.scale.x)/deltaTime,max.scale.x,  min.scale.x);
        result.scale.y  = normVelocityValue((curr.scale.y - old.scale.y)/deltaTime,max.scale.y,  min.scale.y);
        result.rotation = normVelocityValue((curr.rotation-old.rotation)/deltaTime,max.rotation, min.rotation);
        // console.log("curr: " + curr.rotation + ", old: " + old.rotation + ', time: ' + deltaTime + ", v: " + result.rotation)
        return result;
    }

    function minAngleDiff(angle1, angle2) {
        return Math.atan2(Math.sin(angle1-angle2), Math.cos(angle1-angle2));
    }

    function normAngle (angle) {
        let newAngle = angle;
        while (newAngle >= Math.PI*2.0) {
            newAngle -= Math.PI*2.0;
        }
        while (newAngle < 0) {
            newAngle += Math.PI*2.0;    
        }
        return newAngle;
    }

    // function rotate(point, angle) {
    //     let out = new coord(0,0)
    //     c = Math.cos(angle);
    //     s = Math.sin(angle);
    //     matrix = [c,-s,
    //               s, c];
    //     out.x = matrix[0]*point.x + matrix[1]*point.y;
    //     out.y = matrix[2]*point.x + matrix[3]*point.y;
    //     return out;
    // }

    // function line(p1, p2) {
    //     let A = p2.y-p1.y;
    //     let B = p1.x-p2.x; 
    //     return {
    //         A: A,
    //         B: B,
    //         C: A*p1.x + B*p1.y,
    //     }
    // }

    // function pointinRect(q, p1, p2) {
    //     if ( q.x >= Math.min(p1.x, p2.x) && 
    //          q.x <= Math.max(p1.x, p2.x) && 
    //          q.y >= Math.min(p1.y, p2.y) && 
    //          q.y <= Math.max(p1.y, p2.y)    )
    //         return true;
    //     return false;
    // }
    // function intersection(p1, p2, q1, q2) {
    //     let line1 = line(p1, p2);
    //     let line2 = line(q1, q2);
    //     let det = line1.A*line2.B - line2.A*line1.B;
    //     if(det != 0){
    //         let i = {x:0,y:0};
    //         i.x = (line2.B*line1.C - line1.B*line2.C)/det;
    //         i.y = (line1.A*line2.C - line2.A*line1.C)/det;
    //         if (pointinRect(i, p1, p2) && 
    //             pointinRect(i, q1, q2)){
    //             return {
    //                 result: true,
    //                 point: i,
    //             }
    //         }
    //         else {
    //             return {
    //                 result: false,
    //                 point: i,
    //             }
    //         }
    //     }
    //     return {
    //         result: false,
    //         point: undefined,
    //     }
    // }

    // function lineIntersection(line1, line2) {
    //     let det = line1.A*line2.B - line2.A*line1.B;
    //     if(det == 0){
    //         return {
    //             result: false,
    //             point: undefined,
    //         }
    //     }else{
    //         let x = (line2.B*line1.C - line1.B*line2.C)/det;
    //         let y = (line1.A*line2.C - line2.A*line1.C)/det;
    //         return {
    //             result: true,
    //             point: {x:x, y:y}
    //         }
    //     }
    // }
    function easeinout (percentTime) {
        let x = percentTime;
        let percentDistance = Math.pow(x,2) / (Math.pow(x,2) + Math.pow((1-x),2));
        return percentDistance;
    } 
    function easeout (percentTime) {
        let x = 0.5+percentTime/2;
        let power = 2;
        let percentDistance = Math.pow(x,power) / (Math.pow(x,power) + Math.pow((1-x),power));
        return (percentDistance-0.5)*2;
    }
    function easein (percentTime) {
        let x = percentTime/2;
        let power = 2;
        let percentDistance = Math.pow(x,power) / (Math.pow(x,power) + Math.pow((1-x),power));
        return percentDistance*2;
    }
    function linear (percentTime) {
        let percentDistance = percentTime;
        return percentDistance;
    }

    function animationPhase (transform, time, rotDirection=0, animationStyle = easeinout) {
        let copy = tools.TransformCopy(transform);
        return {
            transform: copy,
            time: time,
            rotDirection: rotDirection,
            animationStyle: animationStyle,
        }
    }
    function round(value, precision) {
        let multiplier = Math.pow(10, precision)
        return Math.round(value*multiplier)/multiplier;
    }
    function sinusoid(deltaTime, frequency, magBase, magDelta, phaseOffset) {
        return magBase + magDelta*Math.sin(deltaTime * frequency*2.0*Math.PI + phaseOffset);
    }
    // function linear(deltaTime, frequency, A, B, C) {
    //     return A + B*deltaTime/C;
    // }

    // function isLeft(p0, p1, p2) {
    // return ( (p1.x - p0.x) * (p2.y - p0.y)
    //         - (p2.x -  p0.x) * (p1.y - p0.y) );
    // }

    // // polygonVertices needs to have the last vertex the same as the first vertex
    // function isInPolygon(p, polygonVertices) {
    //     let windingNumber = 0;
    //     let n = polygonVertices.length-1;
    //     let v = polygonVertices;
    //     for (let i=0;i<n;++i) {
    //         if (v[i].y <= p.y) {
    //             if (v[i+1].y  > p.y)      // an upward crossing
    //                 if (isLeft( v[i], v[i+1], p) > 0)  // P left of  edge
    //                     ++windingNumber;            // have  a valid up intersect
    //         }
    //         else {                        // start y > P.y (no test needed)
    //             if (v[i+1].y  <= p.y)     // a downward crossing
    //                  if (isLeft( v[i], v[i+1], p) < 0)  // P right of  edge
    //                      --windingNumber;            // have  a valid down intersect
    //         }
    //     }
    //     if(windingNumber ==0 ){
    //         return false;
    //     }
    //     return true;
    // }
    function decelerate(velocity, deceleration, time) {
        let sign = velocity/Math.abs(velocity);
        let newVelocity = velocity - sign*deceleration * time;
        let newSign = newVelocity/Math.abs(newVelocity);
        if (newSign != sign) {
            return 0;
        }
        return newVelocity;
    }
    function copy(toCopy) {
        let result = false;
        if(toCopy.constructor == Array) {
            result = []
            for(let i=0,j=toCopy.length; i<j; ++i) {
                result.push(toCopy[i]);
            }
        }
        return result;
    }
    return {
        // Point0: Point0,
        // Point1: Point1,
        // Point: Point,
        Transform: Transform,
        TransformCopy: TransformCopy,
        minAngleDiff: minAngleDiff,
        normAngle: normAngle,
        // rotate: rotate,
        // line: line,  
        // pointinRect: pointinRect,
        // intersection: intersection,
        // lineIntersection: lineIntersection,
        easeinout:easeinout,
        easeout:easeout,
        easein:easein,
        linear: linear,
        animationPhase:animationPhase,
        // isInPolygon:isInPolygon,        
        transformToMatrix:transformToMatrix,
        sinusoid: sinusoid,
        calcAllVelocities: calcAllVelocities,
        decelerate: decelerate,
        copy: copy,
        round: round,
    }
})();