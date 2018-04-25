// // @ flow
/* eslint-disable */

function triangleCollection(webgl, translation, rotation, scale, traceWidth) {
    GeometryCollection.call(this, translation, rotation, scale);

    let lessSharpColor = this.globals.colors['corners_less_sharp'];
    let moreSharpColor = this.globals.colors['corners_more_sharp'];
    let cornerColor = this.globals.colors['corners'];
    let shapesColor = this.globals.colors['shapes'];

    let cornerWidth = traceWidth*10;
    let cornerLength = 0.1;

    let trianglePoints = [d2.point(-0.7,-0.2),d2.point(0,0.2),d2.point(0.7,-0.2)];
    let triangleVertices = new vertices.PolyLine(webgl, trianglePoints, true, traceWidth*3);
    let triangleCornerVertices = new vertices.Corner(webgl, trianglePoints, true, cornerLength, cornerWidth);
    let triangleMoreSharpCornerVertices = new vertices.Corner(webgl, [trianglePoints[1],trianglePoints[0],trianglePoints[2],trianglePoints[1]], false, cornerLength*2, cornerWidth);
    let triangleLessSharpCornerVertices = new vertices.Corner(webgl, [trianglePoints[0],trianglePoints[1],trianglePoints[2]], false, cornerLength*2, cornerWidth);
    
    this.add('line', new GeometryObject(triangleVertices, d2.point(0,0), 0, d2.point(1,1), shapesColor));
    this.add('corners', new GeometryObject(triangleCornerVertices, d2.point(0,0), 0, d2.point(1,1), cornerColor))
    this.add('cornersMoreSharp', new GeometryObject(triangleMoreSharpCornerVertices, d2.point(0,0), 0, d2.point(1,1), moreSharpColor))
    this.add('cornersLessSharp', new GeometryObject(triangleLessSharpCornerVertices, d2.point(0,0), 0, d2.point(1,1), lessSharpColor))
}
triangleCollection.prototype = Object.create(GeometryCollection.prototype);
triangleCollection.prototype.toggleLessSharpCorners  = function() {
    this._cornersLessSharp.show = !this._cornersLessSharp.show;
}
triangleCollection.prototype.toggleSharpCorners  = function() {
    this._cornersMoreSharp.show = !this._cornersMoreSharp.show;
}
triangleCollection.prototype.toggleCorners = function() {
    this._corners.show = !this._corners.show;
};
triangleCollection.prototype.getPulseTransform = function(scale) {
    return tools.Transform(d2.point(0,0),0,d2.point(scale,scale));
}

function shapesCollection(webgl, translation, rotation, scale, traceWidth) {
    GeometryCollection.call(this, translation, rotation, scale);

    let cornerColor = this.globals.colors['corners'];
    let shapesColor = this.globals.colors['shapes'];

    let cornerWidth = traceWidth*10;
    let cornerLength = 0.1;

    let squareSize = 0.3;
    let squarePoints = [d2.point(-squareSize, -squareSize),d2.point(squareSize, -squareSize),
                        d2.point(squareSize, squareSize),d2.point(-squareSize, squareSize)];
    let squareVertices = new vertices.PolyLine(webgl, squarePoints, true, traceWidth*3);
    let squareCornerVertices = new vertices.Corner(webgl, squarePoints, true, cornerLength, cornerWidth);
    this.add('square', new GeometryObject(squareVertices, d2.point(0.5, 0.6), Math.PI/3.5, d2.point(1,1), shapesColor))
    this.add('squareCorners', new GeometryObject(squareCornerVertices, d2.point(0.5, 0.6), Math.PI/3.5, d2.point(1,1), cornerColor))

    let octagonPoints = [];
    for(let i=0;i<8;++i) {
        octagonPoints.push(d2.point(0.4*Math.cos(i*Math.PI*2/8),0.4*Math.sin(i*Math.PI*2/8)));
    }
    let octagonVertices = new vertices.PolyLine(webgl, octagonPoints, true, traceWidth*3);
    let octagonCornerVertices = new vertices.Corner(webgl, octagonPoints, true, cornerLength, cornerWidth);
    this.add('octagon', new GeometryObject(octagonVertices, d2.point(0.5, -0.6), 0, d2.point(1,1), shapesColor))
    this.add('octagonCorners', new GeometryObject(octagonCornerVertices, d2.point(0.5, -0.6), 0, d2.point(1,1), cornerColor));

    let penPoints = [d2.point(-0.1,-0.1),d2.point(0.7,0.1),d2.point(0.5,0.6),d2.point(0.05,0.6),d2.point(0.2,0.3)];
    let pentVertices = new vertices.PolyLine(webgl, penPoints, true, traceWidth*3);
    let pentCornerVertices = new vertices.Corner(webgl, penPoints, true, cornerLength, cornerWidth);
    this.add('pent', new GeometryObject(pentVertices, d2.point(-0.8,0.4), 0, d2.point(1,1), shapesColor))
    this.add('pentCorners', new GeometryObject(pentCornerVertices, d2.point(-0.8,0.4), 0, d2.point(1,1), cornerColor));
}
shapesCollection.prototype = Object.create(GeometryCollection.prototype);
shapesCollection.prototype.toggleCorners = function() {
    this._squareCorners.show = !this._squareCorners.show;
    this._pentCorners.show = !this._pentCorners.show;
    this._octagonCorners.show = !this._octagonCorners.show;
};

function rotationAngleCollection (webgl, translation, rotation, scale, radius, traceWidth) {
    GeometryCollection.call(this, translation, rotation, scale);
    let rotationColor = this.globals.colors['rotation'];
    let arrowColor = tools.copy(rotationColor);
    let portionsColor = this.globals.colors['portions'];
    let angleColor = this.globals.colors['angle'];
    this.traceWidth = traceWidth;
    this.rotationRadius = radius*0.8;
    this.radius = radius;

    let angleFillVertices = new vertices.PolygonFilled(webgl, this.rotationRadius*0.5, 500, 500, 0, d2.point(0,0));
    this.add('angleFill', new GeometryObject(angleFillVertices, d2.point(0,0),0,d2.point(1,1),angleColor));
    this._angleFill.pulse.A = 1;
    this._angleFill.pulse.B = 0.1;

    let portions12Vertices = new vertices.RadialLines(webgl, 0, this.rotationRadius*1.1, 0.003, Math.PI*2.0/12.0, Math.PI*2.0);
    let portions100Vertices = new vertices.RadialLines(webgl, 0, this.rotationRadius*1.1, 0.003, Math.PI*2.0/100.0, Math.PI*2.0);
    let portions36Vertices = new vertices.RadialLines(webgl, 0, this.rotationRadius*1.1, 0.003, Math.PI*2.0/36.0, Math.PI*2.0);
    let portions360Vertices = new vertices.RadialLines(webgl, this.rotationRadius*0.9, this.rotationRadius*1.1, 0.003, Math.PI*2.0/360.0, Math.PI*2.0);
    let portionsRadVertices = new vertices.RadialLines(webgl, 0, this.radius*1.1, 0.003, 1, Math.PI*2.0);
    this.add('portions12', new GeometryObject(portions12Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portions100', new GeometryObject(portions100Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portions360', new GeometryObject(portions360Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portions360Fixed', new GeometryObject(portions360Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portions36', new GeometryObject(portions36Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portions36Fixed', new GeometryObject(portions36Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    this.add('portionsRad', new GeometryObject(portionsRadVertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    // this.addObject('portions12',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/12, Math.PI*2.0, portionsColor))
    // this.addObject('portions36',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/36, Math.PI*2.0, portionsColor));
    // this.addObject('portions360',new geo.radialLines(webgl.gl, webgl.locations, this.circleRadius*0.9, this.circleRadius*1, 0.003, Math.PI*2/360, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions12',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/12, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions100',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/100, Math.PI*2.0, portionsColor));
    

    let arrowHeadVertices = new vertices.ArrowHeadTriangle(webgl, d2.point(0,0), this.traceWidth*25,this.traceWidth*25,0);
    this.add('arrow1', new GeometryObject(arrowHeadVertices, d2.point(this.rotationRadius-this.traceWidth/2.0,0),Math.PI,d2.point(1,1), arrowColor));
    this.add('arrow2', new GeometryObject(arrowHeadVertices, d2.point(this.rotationRadius-this.traceWidth/2.0,0),0,d2.point(1,1), arrowColor));
    this._arrow2.pulse.A = 1;
    this._arrow2.pulse.B = 0.5;
    this._arrow1.pulse.A = 1;
    this._arrow1.pulse.B = 0.5;

    let arcVertices = new vertices.Polygon(webgl, this.radius-this.traceWidth/2.0, 1000, 1000,this.traceWidth*2,0,d2.point(0,0));
    this.add('arc', new GeometryObject(arcVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this.add('innerarc', new GeometryObject(arcVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this.add('outerarc', new GeometryObject(arcVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this._innerarc.pulse.A = 1;
    this._innerarc.pulse.B = 0.01;
    this._innerarc.pulse.C = Math.PI;
    this._outerarc.pulse.A = 1;
    this._outerarc.pulse.B = 0.01;
    this.add('straightCircle',new GeometryObject(arcVertices, d2.point(0,0), 0, d2.point(1,1), rotationColor));
    this._straightCircle.pulse.time=4;
    this._straightCircle.pulse.frequency=1/this._straightCircle.pulse.time/2;
    this._straightCircle.pulse.A = 0;
    this._straightCircle.pulse.B = 1;
    this._straightCircle.pulse.C = 0;
    this._straightCircle.currentPulse = {percentChange: 0, transform: tools.Transform()}
    let _this = this;
    this._straightCircle.getPulseTransform = function(percentChange) {
        _this.nextComparePulse(percentChange);
        return _this._straightCircle.currentPulse.transform.copy();
    }
    let arcLinePoints = [];
    let numPoints = 500;
    this.circumference = this.radius*2*Math.PI;
    this.circumferenceLineStep = this.circumference/(numPoints-1);
    for(let i=0;i<numPoints;++i) {
        arcLinePoints.push(d2.point(this.radius,this.circumferenceLineStep*i));
    }
    let arcLineVertices = new vertices.PolyLine(webgl, arcLinePoints, false, this.traceWidth*4);
    this.add('arcLine', new GeometryObject(arcLineVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this._arcLine.pulse.time=this._straightCircle.pulse.time;
    this._arcLine.pulse.frequency=this._straightCircle.pulse.frequency;
    this._arcLine.pulse.A = this._straightCircle.pulse.A;
    this._arcLine.pulse.B = this._straightCircle.pulse.B;
    this._arcLine.pulse.C = this._straightCircle.pulse.C;
    this._arcLine.currentPulse = {percentChange: 0, transform: tools.Transform()}
    this._arcLine.getPulseTransform = function(percentChange) {
        _this.nextComparePulse(percentChange);
        return _this._arcLine.transform.copy();
    }
    this._arcLine.pointsToDraw = 0;
    // console.log(this._straightCircle.transform.copy());
    // this.add('arcLine', new GeometryObject(arcVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));

    let rotationAngleVertices = new vertices.Polygon(webgl, this.rotationRadius-this.traceWidth/2.0, 500, 500,this.traceWidth*2,0,d2.point(0,0));
    this.add('line', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));    
    this.add('innerline', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));    
    this.add('outerline', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this._innerline.pulse.A = 1;
    this._innerline.pulse.B = 0.013;
    this._innerline.pulse.C = Math.PI;
    this._outerline.pulse.A = 1;
    this._outerline.pulse.B = 0.013;
}
rotationAngleCollection.prototype = Object.create(GeometryCollection.prototype);
rotationAngleCollection.prototype.nextComparePulse = function(percentChange) {
    if (this._straightCircle.currentPulse.percentChange != percentChange) {
        // console.log(percentChange);
        let rotation = (1-percentChange) * this._arc.angleToDraw;
        if (rotation < 0){
            rotation = 0;
        }
        let arcLength = this._arc.angleToDraw*this.radius;
        let straightHeight = percentChange*arcLength;
        
        let circleRotation = rotation*1.0;
        if (circleRotation > Math.PI*2) {
            circleRotation = Math.PI*2;
        }
        // debugger;
        this._straightCircle.currentPulse.transform = tools.Transform(d2.point(this._straightCircle.transform.translation.x,
                                                                               this._straightCircle.transform.translation.y+straightHeight*0.99),
                                                                               0, this._straightCircle.transform.scale.copy());
        this._straightCircle.currentPulse.percentChange = percentChange;
        this._straightCircle.angleToDraw = circleRotation;

        // _this.straightCircle.draw(geo.point(_this.straightCircle.offset.x, _this.straightCircle.offset.y+straightHeight*0.99), 0, _this.stick.scale, circleRotation);
        if (percentChange < 0.95)
            straightHeight*=1.02;

        let numPoints = Math.floor(straightHeight/this.circumference*this._arcLine.vertices.numPoints)
        if (numPoints < 0)
            numPoints = 0;
        
        if (numPoints > this._arcLine.vertices.numPoints)
            numPoints = this._arcLine.vertices.numPoints;
        // console.log(percentChange, straightHeight, numPoints);
        this._arcLine.pointsToDraw = numPoints;    
        this._arcLine.currentPulse.percentChange = percentChange;    
        // _this.arcLine.draw(_this.arcLine.offset,0, _this.stick.scale,numPoints);

        // _this.straightCircle.currentPulse.percentChange = percentChange;
        // _this.arcLine.currentPulse.percentChange = percentChange;
    }
}
rotationAngleCollection.prototype.setAngle = function(angle) {
    this._line.angleToDraw = angle;
    this._arc.angleToDraw = angle;
    this._innerarc.angleToDraw = angle;
    this._outerarc.angleToDraw = angle;
    this._portions12.angleToDraw = angle;
    this._portions100.angleToDraw = angle;
    this._portions36.angleToDraw = angle;
    this._portions360.angleToDraw = angle;
    this._portionsRad.angleToDraw = angle;
    this._innerline.angleToDraw = angle;
    this._outerline.angleToDraw = angle;
    this._arrow2.transform.rotation = angle;
    this._angleFill.angleToDraw = angle;
    this._straightCircle.angleToDraw = angle;
    this._arrow2.transform.translation = d2.point(this.rotationRadius * Math.cos(angle), this.rotationRadius * Math.sin(angle));
    if(angle < Math.PI/20) {
        this._arrow1.color[3] = 0;
        this._arrow2.color[3] = 0;
    }
    else {
        this._arrow1.color[3] = 1;  
        this._arrow2.color[3] = 1; 
    }
}

function circleCollection(webgl, translation, rotation, scale) {
    GeometryCollection.call(this, translation, rotation, scale);
    
    let stickColor = this.globals.colors['stick'];
    let startStickColor = this.globals.colors['start_stick'];
    let anchorColor = this.globals.colors['anchor'];
    let hintArrowColor = this.globals.colors['hint_arrow'];
    let cornerColor = this.globals.colors['corners'];
    
    let rotationColor = this.globals.colors['rotation'];
    let portionsColor = this.globals.colors['portions'];
    
    this.stickLength = 0.8;
    this.stickWidth = 0.01;
    this.circleRadius = 0.8;
    let axisLength = 0.9;
    this.traceWidth = 0.002;
    this.rotationRadius = this.stickLength * 0.8;
    // this.rotation = 0;

    let arrowVertices = new vertices.Arrow(webgl, d2.point(0,0), 0.14, 0.05, 0.14, 0.04);
    this.add('hintArrow',new GeometryObject(arrowVertices, d2.point(this.stickLength*0.8,0), 0, d2.point(1,1),hintArrowColor));
    this._hintArrow.pulse.A = 1;
    this._hintArrow.pulse.B = 0.3;
    this._hintArrow.pulse.time = 0;
    this._hintArrow.pulse.frequency = 0.5;
    this._hintArrow.pulseNow();

    this.add('rotationAngle', new rotationAngleCollection(webgl, d2.point(0,0), 0, d2.point(1,1), this.stickLength, this.traceWidth));
    let circleVertices = new vertices.Polygon(webgl, this.rotationRadius-this.traceWidth/2.0, 500, 500,this.traceWidth*2,0,d2.point(0,0));
    this.add('fullCircle', new GeometryObject(circleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
  
    
    

    let portions12Vertices = new vertices.RadialLines(webgl, 0, this.circleRadius*1.1, 0.003, Math.PI*2.0/12.0, Math.PI*2.0);
    this.add('portions12', new GeometryObject(portions12Vertices, d2.point(0,0), 0, d2.point(1,1), portionsColor));
    // this.addObject('portions12',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/12, Math.PI*2.0, portionsColor))
    // this.addObject('portions36',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/36, Math.PI*2.0, portionsColor));
    // this.addObject('portions360',new geo.radialLines(webgl.gl, webgl.locations, this.circleRadius*0.9, this.circleRadius*1, 0.003, Math.PI*2/360, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions12',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/12, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions100',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/100, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions36',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, Math.PI*2/36, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortions360',new geo.radialLines(webgl.gl, webgl.locations, this.circleRadius*0.9, this.circleRadius*1, 0.003, Math.PI*2/360, Math.PI*2.0, portionsColor));
    // this.addObject('anglePortionsRad',new geo.radialLines(webgl.gl, webgl.locations, 0, this.circleRadius*1.1, 0.003, 1, Math.PI*2.0, portionsColor));

    let startLineVertices = new vertices.HorizontalLine(webgl, d2.point(0,0), this.circleRadius*1.1, 0.003);
    this.add('startLine', new GeometryObject(startLineVertices, d2.point(0,0), 0, d2.point(1,1),startStickColor));
    this._startLine.presetTransforms = {
                            onScreenCenter:     tools.Transform(d2.point(-0.5,0),      0, d2.point(1,1)),
                            onScreen:           tools.Transform(d2.point(0,0),      0, d2.point(1,1)),
                            offScreen:          tools.Transform(d2.point(-1.5, -2), 0, d2.point(1,1))};
    this._startLine.pulse.A = 1;
    this._startLine.pulse.B = 1.5;
    this._startLine.getPulseTransform = function(scale) {
        return tools.Transform(d2.point(0,0),0,d2.point(1.0,scale));
    }
    
    let stickVertices = new vertices.HorizontalLine(webgl, d2.point(0,0), this.stickLength, this.stickWidth);
    this.add('stick',new GeometryObject(stickVertices, d2.point(0,0), 0, d2.point(1,1),stickColor));
    this._stick.pulse.A = 1;
    this._stick.pulse.B = 1.5;
    this._stick.getPulseTransform = function(scale) {
        return tools.Transform(d2.point(0,0),0,d2.point(1.0,scale));
    }
    this.add('comparisonStick',new GeometryObject(stickVertices, d2.point(0,0), 0, d2.point(1,1),stickColor));

    this._stick.move.maxVelocity.rotation=10
    this._stick.move.deceleration = tools.Transform(d2.point(1,1),20,d2.point(1,1));

    let anchorVertices = new vertices.PolygonFilled(webgl, 0.03, 21, 21, 0, d2.point(0,0));
    this.add('anchor',new GeometryObject(anchorVertices, d2.point(0,0), 0, d2.point(1,1),anchorColor));
    this._anchor.pulse.A = 1;
    this._anchor.pulse.B = 1;
 
    let cornerVertices = new vertices.HorizontalLine(webgl, d2.point(0,0), this.stickLength*0.3, this.stickWidth);
    // this.addObject('corner1',new geo.horizontalLine(webgl.gl, webgl.locations, new geo.coord(0, 0), this.stickLength*0.3, this.stickWidth, cornerColor));
    // this.addObject('corner2',new geo.horizontalLine(webgl.gl, webgl.locations, new geo.coord(0, 0), this.stickLength*0.3, this.stickWidth, cornerColor));
    this.add('corner1', new GeometryObject(cornerVertices, d2.point(0,0), 0, d2.point(1,1), cornerColor));
    this.add('corner2', new GeometryObject(cornerVertices, d2.point(0,0), 0, d2.point(1,1), cornerColor));
    this._corner1.pulse.A = 1;
    this._corner1.pulse.B = 1.5;
    this._corner1.getPulseTransform = function(scale) {
        return tools.Transform(d2.point(0,0),0,d2.point(1.0,scale));
    }
    this._corner2.pulse.A = 1;
    this._corner2.pulse.B = 1.5;
    this._corner2.getPulseTransform = function(scale) {
        return tools.Transform(d2.point(0,0),0,d2.point(1.0,scale));
    }

    // let arcLinePoints = [];
    // let numPoints = 500;
    // this.circumference = this.stickLength*2*Math.PI;
    // this.circumferenceLineStep = this.circumference/(numPoints-1);
    // for(let i=0;i<numPoints;++i) {
    //     arcLinePoints.push(d2.point(this.stickLength,this.circumferenceLineStep*i));
    // }
    // let arcLineVertices = new vertices.PolyLine(webgl, arcLinePoints, false, this.traceWidth*4);
    // this.add('arcLine', new GeometryObject(arcLineVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    // this.addObject('arcLine',new geo.polyLine(webgl.gl, webgl.locations, arcLinePoints,false,this.traceWidth*4,rotationColor));
}
circleCollection.prototype = Object.create(GeometryCollection.prototype);


function Lesson2Geometry (webgl, translation = d2.point(0,0), rotation = 0, scale = d2.point(1,1)) {
    GeometryCollection.call(this, translation, rotation, scale);
    this.name = "Lesson2Geometry"
    this.stickLength = 0.8;
    this.stickWidth = 0.01;
    this.circleRadius = 0.8;
    let axisLength = 0.9;
    this.traceWidth = 0.002;
    this.rotationRadius = this.stickLength * 0.8;

    // let rotationColor = this.globals.colors['rotation'];
    // let circleColor = this.globals.colors['arc'];
    // let axisColor = this.globals.colors['axes'];
    // let anchorColor = this.globals.colors['anchor'];
    // let cornerColor = this.globals.colors['corners'];
    
    // let portionsColor = this.globals.colors['portions'];
    // let stickColor = this.globals.colors['stick'];
    // let startStickColor = this.globals.colors['start_stick'];
    // let shapesColor = this.globals.colors['shapes'];
    // let angleColor = this.globals.colors['angle'];
    // let hintArrowColor = this.globals.colors['hint_arrow'];

    // let cornerWidth = this.traceWidth*10;
    // let cornerLength = 0.1;
    this.add('shapes', new shapesCollection(webgl, d2.point(0,0), 0, d2.point(1,1), this.traceWidth)); 
    this.add('triangle', new triangleCollection(webgl, d2.point(-0.5,-0.2), Math.PI/4, d2.point(1,1), this.traceWidth));
    this._triangle.presetTransforms = {
                            onScreenSmall:  tools.Transform(d2.point(-0.5,-0.2), Math.PI/4.0, d2.point(  1,  1)),
                            onScreenCenter: tools.Transform(d2.point(   0,   0),  0, d2.point(1.2,1.2)),
                            offScreen:      tools.Transform(d2.point( 4, 0),  Math.PI/3.0, d2.point(  1,  1))};
    // this._shapes.showAll();
    this.add('circle', new circleCollection(webgl, d2.point(0,0), 0, d2.point(1,1)));
    this.webgl = webgl;

    this.bias_transform = m3.identity();
    this.drawFullCircle = false;
}
Lesson2Geometry.prototype = Object.create(GeometryCollection.prototype);
Lesson2Geometry.prototype.draw = function(now) {
    this.elements['shapes'].draw(this.bias_transform, now);
    this.elements['triangle'].draw(this.bias_transform, now);
    this.elements['circle'].draw(this.bias_transform, now);
}
Lesson2Geometry.prototype.toggleCorners = function() {
    this._triangle.toggleCorners();
    this._shapes.toggleCorners();
    }



