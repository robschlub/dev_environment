// @flow

import Diagram from '../../js/diagram/Diagram';
import * as tools from '../../js/diagram/tools/mathtools';
// import HTMLObject from '../../js/diagram/DrawingObjects/HTMLObject/HTMLObject';

import { DiagramElementCollection, DiagramElementPrimative }
  from '../../js/diagram/Element';
import { Point, Transform, minAngleDiff, normAngle, Rect } from '../../js/diagram/tools/g2';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import DiagramGLEquation from '../../js/diagram/DiagramElements/Equation/GLEquation';

const colors = getScssColors(styles);
const anchorPoints = 50;
const anglePoints = 400;

function makeLine(
  shapes: Object,
  location: Point,
  length: number,
  width: number,
  color: Array<number>,
  pointOrTransform: Point | Transform,
): DiagramElementPrimative {
  const line = shapes.horizontalLine(
    location, length, width,
    0, color, pointOrTransform,
  );
  line.pulse.transformMethod = s => new Transform().scale(1, s);
  return line;
}

function makeRadius(shapes: Object, layout: Object) {
  const radius = makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.radius, new Transform().rotate(0).translate(
      0,
      0,
    ),
  );
  radius.isTouchable = true;
  radius.isMovable = true;
  radius.pulse.transformMethod = s => new Transform().scale(1, s);

  for (let i = 0; i < radius.vertices.border[0].length; i += 1) {
    radius.vertices.border[0][i].y *= 10;
  }
  return radius;
}

function makeArc(shapes: Object, layout: Object) {
  return shapes.polygon(
    anglePoints, layout.radius, layout.linewidth, 0,
    anglePoints, colors.arc, new Point(0, 0),
  );
}

function makeCircle(shapes: Object, layout: Object) {
  return shapes.polygon(
    anglePoints, layout.radius, layout.linewidth, 0,
    anglePoints, colors.arc, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anchorPoints, layout.linewidth * 2, 0,
    anchorPoints, colors.anchor, new Point(-3, 2),
  );
}

function makeWheel(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0,
    anglePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.5, 0, 0.5, 0.5),
  );
}

function makeBall(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0,
    anglePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.5, 0.5, 0.5, 0.5),
  );
}

function makeEarth(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0,
    anglePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0, 0.5, 0.5, 0.5),
  );
}

function makeClock(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0,
    anglePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0, 0, 0.5, 0.5),
  );
}

function makeWheelShape(shapes: Object, layout: Object) {
  return shapes.polygon(
    202, layout.wheelSize, layout.linewidth, 0,
    202, colors.arc, new Point(0, 0),
  );
}

function makeAngle(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.angleRadius, 0,
    anglePoints, colors.angle, new Point(0, 0),
  );
}

function makeReference(shapes: Object, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

function makeFakeRadius(shapes: Object, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

function makeCorner(shapes: Object, pointOrTransform: Point | Transform, layout: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.cornerLength, layout.linewidth * 3,
    colors.corners, pointOrTransform,
  );
}

function makeArrow(shapes: Object, layout: Object) {
  return shapes.arrow(
    0.1, 0.04, 0.1, 0.04, colors.arrow,
    new Transform().rotate(0).translate(layout.arrow, 0),
  );
}

function makeShade(shapes: Object, layout: Object) {
  return shapes.polygonFilled(
    anglePoints, layout.wheelSize, 0, anglePoints,
    [0, 0, 0, 0.7], new Transform().rotate(0).translate(0, 0),
  );
}

function makeEarthCalculation(shapes: Object) {
  const calculation = shapes.text('c = 44,100 km', new Point(1, 0), colors.dimensions);
  const error = shapes.text('Error < 15% only!', new Point(1, -0.4), colors.dimensions);
  error.transform.updateScale(0.6, 0.6);
  const collection = shapes.collection(new Transform().scale(1, 1).translate(0, 0));
  collection.add('calculation', calculation);
  collection.add('error', error);
  return collection;
}

function makeDiameterDimension(shapes: Object, layout: Object) {
  const center = new Point(0, 0);
  const diameter = layout.wheelSize * 2;
  const lineWidth = layout.linewidth / 2;
  const arrowHeight = lineWidth * 5;
  const arrowWidth = lineWidth * 4;
  const line = shapes.horizontalLine(
    new Point(-1, 0),
    2,
    lineWidth,
    0,
    colors.dimensions,
    new Transform().scale(1, 1).rotate(0).translate(0, 0),
  );
  const arrow1 = shapes.arrow(
    arrowWidth, 0, arrowHeight, 0,
    colors.dimensions, new Transform().rotate(-Math.PI / 2).translate(diameter / 2, 0),
  );
  const arrow2 = shapes.arrow(
    arrowWidth, 0, arrowHeight, 0,
    colors.dimensions, new Transform().rotate(Math.PI / 2).translate(-diameter / 2, 0),
  );
  const textD = shapes.text('d', new Point(0, 0.12), colors.dimensions);

  // const textD2 = shapes.text('d', new Point(-0.02, 0.05), colors.dimensions);
  const d = shapes.collection(new Transform()
    .rotate(0)
    .translate(center.x, center.y));
  // d.add('shade', dimensionShade);
  d.add('line', line);
  d.add('arrow1', arrow1);
  d.add('arrow2', arrow2);
  d.add('textD', textD);
  // d.add('textD2', textD2);
  d.appear = (time: number) => {
    line.disolveIn(time);
    arrow1.disolveIn(time);
    arrow2.disolveIn(time);
    textD.disolveIn(time);
    // textD2.disolveIn(time);
  };
  d.appearWithDelay = (delay: number, time: number) => {
    line.disolveInWithDelay(delay, time);
    arrow1.disolveInWithDelay(delay, time);
    arrow2.disolveInWithDelay(delay, time);
    textD.disolveInWithDelay(delay, time);
    // textD2.disolveInWithDelay(delay, time);
  };

  d.plotLength = (diam: number) => {
    // const ratio = diam / (diameter / 2 - arrowHeight);
    line.transform.updateScale((diam / 2 - arrowHeight), 1);
    arrow1.transform.updateTranslation(diam / 2, 0);
    arrow2.transform.updateTranslation(-diam / 2, 0);
  };
  d.grow = (percent: number) => {
    d.plotLength(percent * diameter);
  };
  return d;
}

function makeCircumferenceDimension(shapes: Object, layout: Object) {
  const radius = layout.wheelSize * 1.2;
  const lineWidth = layout.linewidth / 2;
  const arrowHeight = lineWidth * 5;
  const arrowWidth = lineWidth * 4;
  const arrowHeightInRadians = arrowHeight / radius;

  const halfCircle1 = shapes.polygon(
    anglePoints, radius, lineWidth, 0,
    anglePoints,
    colors.dimensions, new Transform().rotate(0).translate(0, 0),
  );
  const halfCircle2 = shapes.polygon(
    anglePoints, radius, lineWidth, 0,
    anglePoints,
    colors.dimensions, new Transform().rotate(0).translate(0, 0),
  );
  const arrow1 = shapes.arrow(
    arrowWidth, 0, arrowHeight, 0,
    colors.dimensions, new Transform().rotate(0).translate(0, 0),
  );
  const arrow2 = shapes.arrow(
    arrowWidth, 0, arrowHeight, 0,
    colors.dimensions, new Transform().rotate(0).translate(0, 0),
  );
  const circumferenceDimension = shapes.collection(new Transform()
    .rotate(0).translate(0, 0));

  const textC = shapes.text('c', new Point(0, -radius - 0.08), colors.dimensions);
  // const textC2 = shapes.text('c', new Point(0, -radius - 0.15), colors.dimensions);
  circumferenceDimension.add('halfCircle1', halfCircle1);
  circumferenceDimension.add('halfCircle2', halfCircle2);
  circumferenceDimension.add('arrow1', arrow1);
  circumferenceDimension.add('arrow2', arrow2);
  circumferenceDimension.add('textC', textC);
  // circumferenceDimension.add('textC2', textC2);
  circumferenceDimension.plotAngle = (angle: number) => {
    halfCircle1.angleToDraw = angle;
    halfCircle1.transform.updateRotation(3 * Math.PI / 2 - angle + 0.03);
    halfCircle2.angleToDraw = angle;
    halfCircle2.transform.updateRotation(-Math.PI / 2);
    const arrow1Tip = new Point(
      radius * Math.sin(angle + 0.05),
      -radius * Math.cos(angle + 0.05),
    );
    const arrow2Tip = new Point(
      -arrow1Tip.x,
      arrow1Tip.y,
    );
    arrow1.transform.updateTranslation(arrow1Tip.x, arrow1Tip.y);
    arrow2.transform.updateTranslation(arrow2Tip.x, arrow2Tip.y);
    arrow1.transform.updateRotation(-(Math.PI / 2 - angle) - arrowHeightInRadians);
    arrow2.transform.updateRotation((Math.PI / 2 - angle) + arrowHeightInRadians);
  };
  circumferenceDimension.grow = (percent: number) => {
    circumferenceDimension.plotAngle(percent * Math.PI * 0.98);
    // console.log(percent)
  };
  circumferenceDimension.plotAngle(Math.PI * 0.98);
  circumferenceDimension.appear = (time: number) => {
    halfCircle1.disolveIn(time);
    halfCircle2.disolveIn(time);
    arrow1.disolveIn(time);
    arrow2.disolveIn(time);
    textC.disolveIn(time);
    // textC2.disolveIn(time);
  };

  circumferenceDimension.appearWithDelay = (delay: number, time: number) => {
    halfCircle1.disolveInWithDelay(delay, time);
    halfCircle2.disolveInWithDelay(delay, time);
    arrow1.disolveInWithDelay(delay, time);
    arrow2.disolveInWithDelay(delay, time);
    textC.disolveInWithDelay(delay, time);
    // textC2.disolveInWithDelay(delay, time);
  };
  // console.log(circumferenceDimension)
  return circumferenceDimension;
}

function makeEquation(diagram: Diagram) {
  const equationElements = diagram.equation.elements({
    c: 'c',
    d: 'd',
    pi: String.fromCharCode(960),
    equals: ' = ',
  }, colors.dimensions);
  return equationElements;
}


type DiameterDimensionType = {
  _textD: DiagramElementPrimative;
  _line: DiagramElementPrimative;
  _arrow1: DiagramElementPrimative;
  _arrow2: DiagramElementPrimative;
  appear: (number) => void;
  grow: (number) => void;
} & DiagramElementCollection ;

type CircumferenceDimensionType = {
  _textC: DiagramElementPrimative;
  _halfCircle1: DiagramElementPrimative;
  _halfCircle2: DiagramElementPrimative;
  _arrow1: DiagramElementPrimative;
  _arrow2: DiagramElementPrimative;
  appear: (number) => void;
  grow: (number) => void;
} & DiagramElementCollection ;

type EquationType = {
  _d: DiagramElementPrimative;
  _c: DiagramElementPrimative;
  _pi: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
} & DiagramElementCollection ;

type EarthCalculationType = {
  _error: DiagramElementPrimative;
  _calculation: DiagramElementPrimative;
} & DiagramElementCollection ;


class CircleCollection extends DiagramElementCollection {
  _anchor: DiagramElementPrimative;
  _arrow: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _fakeRadius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _circumferenceDimension: CircumferenceDimensionType;
  _diameterDimension: DiameterDimensionType;
  _shade: DiameterDimensionType;
  diagram: Diagram;
  layout: Object;
  colors: Object;
  eqn: DiagramGLEquation;
  _equation: EquationType;
  _earthCalculation: EarthCalculationType;
  propertyLocations: Array<number>;
  propertyLocationIndex: number;

  constructor(diagram: Diagram, layout: Object, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.colors = colors;
    this.layout = layout;

    const { shapes } = diagram;

    const origin = new Point(0, 0);
    const t = new Transform().rotate(0).translate(0, 0);

    this.add('wheel', makeWheel(shapes, layout));
    this.add('earth', makeEarth(shapes, layout));
    this.add('ball', makeBall(shapes, layout));
    this.add('clock', makeClock(shapes, layout));
    this.add('wheelShape', makeWheelShape(shapes, layout));
    this.add('shade', makeShade(shapes, layout));
    this.add('diameterDimension', makeDiameterDimension(shapes, layout));
    this.add('circumferenceDimension', makeCircumferenceDimension(shapes, layout));
    this.add('equation', makeEquation(diagram));
    this.add('earthCalculation', makeEarthCalculation(shapes));
    this.eqn = diagram.equation.make(this._equation);
    this.eqn.createEq(['c', 'equals', 'pi', 'd']);

    this.add('arrow', makeArrow(shapes, layout));
    this.add('angle', makeAngle(shapes, layout));
    this.add('reference', makeReference(shapes, layout));
    this.add('fakeRadius', makeFakeRadius(shapes, layout));
    this.add('arc', makeArc(shapes, layout));
    this.add('circle', makeCircle(shapes, layout));

    const radius = makeRadius(shapes, layout);
    radius.setTransformCallback = this.updateRotation.bind(this);
    this.add('radius', radius);
    this.add('cornerRef', makeCorner(shapes, origin, layout));
    this.add('cornerRad', makeCorner(shapes, t, layout));
    this.add('anchor', makeAnchor(shapes, layout));
    this.isTouchable = true;
    this.isMovable = true;
    this.propertyLocations = [-1.8, 0, 1.8];
    this.propertyLocationIndex = 0;
  }

  resize(locations: Object) {
    this.transform.updateTranslation(
      locations.circle.center.x,
      locations.circle.center.y,
    );
  }

  equationTextToInitialPositions() {
    // const t = this.transform.t();
    let td = this._diameterDimension.transform.t();
    let tdt = this._diameterDimension._textD.transform.t();
    let tc = this._circumferenceDimension.transform.t();
    let tct = this._circumferenceDimension._textC.transform.t();
    td = td === null || td === undefined ? new Point(0, 0) : td;
    tdt = tdt === null || tdt === undefined ? new Point(0, 0) : tdt;
    tc = tc === null || tc === undefined ? new Point(0, 0) : tc;
    tct = tct === null || tct === undefined ? new Point(0, 0) : tct;

    if (tdt !== null && td !== null && tc !== null) {
      this._equation._d.transform.updateTranslation(tdt.x + td.x, tdt.y + td.y);
      this._equation._c.transform.updateTranslation(tct.x + tc.x, tct.y + tc.y);
    }
  }

  updateRotation() {
    let rotation = this._radius.transform.r();
    if (rotation) {
      if (rotation > Math.PI * 2) {
        rotation -= Math.PI * 2;
      }
      if (rotation < 0) {
        rotation += Math.PI * 2;
      }
      if (this._arrow.show) {
        const angleToDisappear = 0.35;
        if (rotation > angleToDisappear) {
          this._arrow.color[3] = 0;
        } else {
          this._arrow.color[3] = (angleToDisappear - rotation) / angleToDisappear;
          this._arrow.transform.updateRotation(rotation);
          this._arrow.transform.updateTranslation(
            this.layout.arrow * Math.cos(rotation),
            this.layout.arrow * Math.sin(rotation),
          );
        }
      }
      const r = normAngle(rotation);
      this._radius.transform.updateRotation(r);
      this._cornerRad.transform.updateRotation(r);
      this._angle.angleToDraw = r + 0.01;
      this._arc.angleToDraw = r + 0.01;
    }
  }

  pulseArrow() {
    this._arrow.pulseScaleNow(0, 1.2, 0.7);
    this.diagram.animateNextFrame();
  }

  pulseAngle() {
    this._angle.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAnchor() {
    this._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseRadius() {
    this._radius.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseReference() {
    this._reference.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseFakeRadius() {
    this._fakeRadius.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseLines() {
    this.pulseRadius();
    this.pulseReference();
    this.pulseFakeRadius();
  }

  pulseProperties() {
    this._diameterDimension._textD.pulseScaleNow(1, 1.5);
    this._circumferenceDimension._textC.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseEquation() {
    this._equation.pulseScaleNow(1, 1.3);
    this.diagram.animateNextFrame();
  }

  pushRadius() {
    const angle = this._radius.transform.r();
    let targetAngle = angle + Math.PI / 6;
    if (targetAngle > Math.PI * 2) {
      targetAngle -= Math.PI * 2;
    }
    this._radius.animateRotationTo(targetAngle, 1, 1);
    this.diagram.animateNextFrame();
  }
  rotateTo(
    angle: number,
    direction: number,
    time: number,
    callback: () => void = () => {},
  ) {
    let d = direction;
    if (d === 0) {
      const r = this._radius.transform.r();
      d = 1;
      if (r) {
        const delta = minAngleDiff(angle, r);
        d = delta / Math.abs(delta);
      }
    }
    this._radius.animateRotationTo(angle, d, time, tools.easeinout, callback);
    this.diagram.animateNextFrame();
  }

  calculateEarth() {
    this._circumferenceDimension.showAll();
    this._earthCalculation.showAll();
    this._earthCalculation._error.pulseScaleNow(1, 1.5);
    this._circumferenceDimension.transform.updateTranslation(-1, 0);
    this.resetColors();
    this._circumferenceDimension.appear(0.5);
    this._circumferenceDimension.animateCustomTo(
      this._circumferenceDimension.grow.bind(this),
      0.5,
    );
    this.diagram.animateNextFrame();
  }

  toggleProperties() {
    this.propertyLocationIndex =
      this.propertyLocationIndex < 2 ? this.propertyLocationIndex + 1 : 0;
    const x = this.propertyLocations[this.propertyLocationIndex];
    this._circumferenceDimension.showAll();
    this._diameterDimension.showAll();
    this._equation.showAll();
    this._shade.show = true;
    this._circumferenceDimension.transform.updateTranslation(x, 0);
    this._diameterDimension.transform.updateTranslation(x, 0);
    this._shade.transform.updateTranslation(x, 0);
    this._equation.transform.updateTranslation(x, 0);
    this.resetColors();
    this._diameterDimension.appear(0.5);
    this._diameterDimension.animateCustomTo(
      this._diameterDimension.grow.bind(this),
      0.5,
    );

    this._equation.transform.updateTranslation(x - 0.3, -1.3);
    this._equation._d.disolveIn(1);
    this._equation._c.disolveIn(1);
    this._equation._equals.disolveIn(0.5);
    this._equation._pi.disolveIn(0.5);

    this._circumferenceDimension.appear(0.5);
    this._circumferenceDimension.animateCustomTo(
      this._circumferenceDimension.grow.bind(this),
      0.5,
    );
    this.diagram.animateNextFrame();
  }

  toggleCorners() {
    if (this._cornerRad.show) {
      this._cornerRad.show = false;
      this._cornerRef.show = false;
    } else {
      this._cornerRad.show = true;
      this._cornerRef.show = true;
      this._cornerRad.pulseScaleNow(1, 2);
      this._cornerRef.pulseScaleNow(1, 2);
    }
    this.diagram.animateNextFrame();
  }

  showWheelShape(done: ?(?mixed) => void = () => {}) {
    const t = this._wheel.transform.t();
    if (t) {
      this._wheelShape.show = true;
      this._wheelShape.transform.updateTranslation(t.x, t.y);
      this._wheelShape.animateTranslationToWithDelay(new Point(1, 0), 0.5, 1);
      this._wheel.animateTranslationToWithDelay(new Point(-1, 0), 0.5, 1, tools.easeinout, done);
      this._wheelShape.disolveIn(0.5);
    }
    this.diagram.animateNextFrame();
  }

  resetColors() {
    this._diameterDimension.setColor(this.colors.dimensions);
    this._circumferenceDimension.setColor(this.colors.dimensions);
    this._equation.setColor(this.colors.dimensions);
    this._wheelShape.setColor(this.colors.arc);
  }
}

export default CircleCollection;