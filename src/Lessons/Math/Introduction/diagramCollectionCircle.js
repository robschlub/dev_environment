// @flow

import Diagram from '../../../js/diagram/Diagram';
import * as tools from '../../../js/diagram/tools/mathtools';

import { DiagramElementCollection, DiagramElementPrimative }
  from '../../../js/diagram/Element';
import { Point, Transform, Rect } from '../../../js/diagram/tools/g2';
import DiagramGLEquation from '../../../js/diagram/DiagramElements/Equation/GLEquation';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

function makeWheel(shapes: Object) {
  return shapes.polygonFilled(
    layout.wheelPoints, layout.wheelSize, 0,
    layout.wheelPoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.5, 0, 0.5, 0.5),
  );
}

function makeBall(shapes: Object) {
  return shapes.polygonFilled(
    layout.wheelPoints, layout.wheelSize, 0,
    layout.wheelPoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.5, 0.5, 0.5, 0.5),
  );
}

function makeEarth(shapes: Object) {
  return shapes.polygonFilled(
    layout.wheelPoints, layout.wheelSize, 0,
    layout.wheelPoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0, 0.5, 0.5, 0.5),
  );
}

function makeClock(shapes: Object) {
  return shapes.polygonFilled(
    layout.wheelPoints, layout.wheelSize, 0,
    layout.wheelPoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0, 0, 0.5, 0.5),
  );
}

function makeWheelShape(shapes: Object) {
  return shapes.polygon(
    202, layout.wheelSize, layout.linewidth, 0,
    202, colors.circle, new Point(0, 0),
  );
}

function makeShade(shapes: Object) {
  return shapes.polygonFilled(
    layout.wheelPoints, layout.wheelSize, 0, layout.wheelPoints,
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

function makeDiameterDimension(shapes: Object) {
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

function makeCircumferenceDimension(shapes: Object) {
  const radius = layout.wheelSize * 1.2;
  const lineWidth = layout.linewidth / 2;
  const arrowHeight = lineWidth * 5;
  const arrowWidth = lineWidth * 4;
  const arrowHeightInRadians = arrowHeight / radius;

  const halfCircle1 = shapes.polygon(
    layout.wheelPoints, radius, lineWidth, 0,
    layout.wheelPoints,
    colors.dimensions, new Transform().rotate(0).translate(0, 0),
  );
  const halfCircle2 = shapes.polygon(
    layout.wheelPoints, radius, lineWidth, 0,
    layout.wheelPoints,
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
  };
  circumferenceDimension.plotAngle(Math.PI * 0.98);
  circumferenceDimension.appear = (time: number) => {
    halfCircle1.disolveIn(time);
    halfCircle2.disolveIn(time);
    arrow1.disolveIn(time);
    arrow2.disolveIn(time);
    textC.disolveIn(time);
  };

  circumferenceDimension.appearWithDelay = (delay: number, time: number) => {
    halfCircle1.disolveInWithDelay(delay, time);
    halfCircle2.disolveInWithDelay(delay, time);
    arrow1.disolveInWithDelay(delay, time);
    arrow2.disolveInWithDelay(delay, time);
    textC.disolveInWithDelay(delay, time);
  };
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
  _wheel: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _circumferenceDimension: CircumferenceDimensionType;
  _diameterDimension: DiameterDimensionType;
  _shade: DiameterDimensionType;
  diagram: Diagram;
  eqn: DiagramGLEquation;
  _equation: EquationType;
  _earthCalculation: EarthCalculationType;
  propertyLocations: Array<number>;
  propertyLocationIndex: number;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;

    const { shapes } = diagram;

    this.add('wheel', makeWheel(shapes));
    this.add('earth', makeEarth(shapes));
    this.add('ball', makeBall(shapes));
    this.add('clock', makeClock(shapes));
    this.add('wheelShape', makeWheelShape(shapes));
    this.add('shade', makeShade(shapes));
    this.add('diameterDimension', makeDiameterDimension(shapes));
    this.add('circumferenceDimension', makeCircumferenceDimension(shapes));
    this.add('equation', makeEquation(diagram));
    this.add('earthCalculation', makeEarthCalculation(shapes));
    this.eqn = diagram.equation.make(this._equation);
    this.eqn.createEq(['c', 'equals', 'pi', 'd']);

    this.propertyLocations = [-1.8, 0, 1.8];
    this.propertyLocationIndex = 0;
  }

  resize() {
    this.transform.updateTranslation(
      layout.position.x,
      layout.position.y,
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

  pulseProperties() {
    this._diameterDimension._textD.pulseScaleNow(1, 1.5);
    this._circumferenceDimension._textC.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseEquation() {
    this._equation.pulseScaleNow(1, 1.3);
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
    this._shade.show();
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

  showWheelShape(done: ?(?mixed) => void = () => {}) {
    const t = this._wheel.transform.t();
    if (t) {
      this._wheelShape.show();
      this._wheelShape.transform.updateTranslation(t.x, t.y);
      this._wheelShape.animateTranslationToWithDelay(new Point(1, 0), 0.5, 1);
      this._wheel.animateTranslationToWithDelay(new Point(-1, 0), 0.5, 1, tools.easeinout, done);
      this._wheelShape.disolveIn(0.5);
    }
    this.diagram.animateNextFrame();
  }

  resetColors() {
    this._diameterDimension.setColor(colors.dimensions);
    this._circumferenceDimension.setColor(colors.dimensions);
    this._equation.setColor(colors.dimensions);
    this._wheelShape.setColor(colors.circle);
  }
}

export default CircleCollection;
