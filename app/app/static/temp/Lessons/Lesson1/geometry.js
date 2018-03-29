
function Lesson1RotationAngleCollection (webgl, translation, rotation, scale, radius, traceWidth) {
    GeometryCollection.call(this, translation, rotation, scale);
    let rotationColor = this.globals.colors['rotation'];
    this.traceWidth = traceWidth;
    this.radius = radius;
    this.name = "Lesson1RotationAngleCollection";

    let rotationAngleVertices = new vertices.Polygon(webgl, this.radius-this.traceWidth/2.0, 500, 500,this.traceWidth*2,0,d2.point(0,0));
    this.add('line', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));    
    this.add('innerline', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));    
    this.add('outerline', new GeometryObject(rotationAngleVertices, d2.point(0,0),0,d2.point(1,1), rotationColor));
    this._innerline.pulse.A = 1;
    this._innerline.pulse.B = 0.013;
    this._innerline.pulse.C = Math.PI;
    this._outerline.pulse.A = 1;
    this._outerline.pulse.B = 0.013;
}
Lesson1RotationAngleCollection.prototype = Object.create(GeometryCollection.prototype);

Lesson1RotationAngleCollection.prototype.setAngle = function(angle) {
    this._line.angleToDraw = angle;
    this._innerline.angleToDraw = angle;
    this._outerline.angleToDraw = angle;
}

function Lesson1CircleCollection(webgl, translation, rotation, scale) {
    GeometryCollection.call(this, translation, rotation, scale);
    this.name = "Lesson1CircleCollection";
    let stickColor = this.globals.colors['stick'];
    let anchorColor = this.globals.colors['anchor'];
    let hintArrowColor = this.globals.colors['hint_arrow'];
    let rotationColor = this.globals.colors['rotation'];
    
    this.stickLength = 0.8;
    this.stickWidth = 0.01;
    this.circleRadius = 0.8;
    this.traceWidth = 0.002;

    let arrowVertices = new vertices.Arrow(webgl, d2.point(0,0), 0.14, 0.05, 0.14, 0.04);
    this.add('hintArrow',new GeometryObject(arrowVertices, d2.point(this.stickLength*0.8,0), 0, d2.point(1,1),hintArrowColor));
    this._hintArrow.pulse.A = 1;
    this._hintArrow.pulse.B = 0.3;
    this._hintArrow.pulse.time = 0;
    this._hintArrow.pulse.frequency = 0.5;
    this._hintArrow.pulseNow();

    this.add('rotationAngle', new Lesson1RotationAngleCollection(webgl, d2.point(0,0), 0, d2.point(1,1), this.stickLength, this.traceWidth));
    let circleVertices = new vertices.Polygon(webgl, this.rotationRadius-this.traceWidth/2.0, 500, 500,this.traceWidth*2,0,d2.point(0,0));
    
    let stickVertices = new vertices.HorizontalLine(webgl, d2.point(0,0), this.stickLength, this.stickWidth);
    this.add('stick',new GeometryObject(stickVertices, d2.point(0,0), 0, d2.point(1,1),stickColor));
    this._stick.pulse.A = 1;
    this._stick.pulse.B = 1.5;
    this._stick.getPulseTransform = function(scale) {
        return tools.Transform(d2.point(0,0),0,d2.point(1.0,scale));
    }
    this._stick.move.maxVelocity.rotation=10
    this._stick.move.deceleration = tools.Transform(d2.point(1,1),20,d2.point(1,1));

    let anchorVertices = new vertices.PolygonFilled(webgl, 0.03, 21, 21, 0, d2.point(0,0));
    this.add('anchor',new GeometryObject(anchorVertices, d2.point(0,0), 0, d2.point(1,1),anchorColor));
    this._anchor.pulse.A = 1;
    this._anchor.pulse.B = 1;
}
Lesson1CircleCollection.prototype = Object.create(GeometryCollection.prototype);


function Lesson1Geometry (webgl, translation = d2.point(0,0), rotation = 0, scale = d2.point(1,1)) {
    GeometryCollection.call(this, translation, rotation, scale);
    this.name = "Lesson1Geometry";
    this.add('circle', new Lesson1CircleCollection(webgl, d2.point(0,0), 0, d2.point(1,1)));
    this.webgl = webgl;

    this.bias_transform = m3.identity();
    this.drawFullCircle = false;
}
Lesson1Geometry.prototype = Object.create(GeometryCollection.prototype);
Lesson1Geometry.prototype.draw = function(now) {
    this.elements['circle'].draw(this.bias_transform, now);
}
Lesson1Geometry.prototype.toggleCorners = function() {
    this._triangle.toggleCorners();
    this._shapes.toggleCorners();
    }



