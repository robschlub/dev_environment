// @flow

import Diagram from '../../../js/diagram/Diagram';
import * as tools from '../../../js/diagram/tools/mathtools';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../../js/diagram/Element';
// import { DiagramFont } from '../../../js/diagram/DrawingObjects/TextObject/TextObject';
import { Point, Transform, minAngleDiff, normAngle, Rect } from '../../../js/diagram/tools/g2';
import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;


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

function makeWheel(shapes: Object) {
  return shapes.polygonFilled(
    layout.circlePoints, layout.wheel.radius, 0,
    layout.circlePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.3333, 0, 0.2222, 0.2222),
  );
}

function makeBall(shapes: Object) {
  return shapes.polygonFilled(
    layout.circlePoints, layout.ball.radius, 0,
    layout.circlePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.5555, 0, 0.1667, 0.1667),
  );
}

function makeMoon(shapes: Object) {
  return shapes.polygonFilled(
    layout.circlePoints, layout.moon.radius, 0,
    layout.circlePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0, 0, 0.3333, 0.3333),
  );
}

function makeRing(shapes: Object) {
  return shapes.polygonFilled(
    layout.circlePoints, layout.ring.radius, 0,
    layout.circlePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.7222, 0.1481, 0.1481, 0.1481),
  );
}

function makeCircleShape(shapes: Object, radius) {
  return shapes.polygon(
    layout.circlePoints, radius, layout.linewidth, 0, 1,
    layout.circlePoints, colors.circle, new Transform().scale(1, 1).translate(0, 0),
  );
}

function makeRadius(shapes: Object) {
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

function makeDiameter(shapes: Object) {
  const diameter = shapes.collection(new Transform().rotate(0).translate(0, 0));
  diameter.add(
    'radius1',
    makeLine(
      shapes, new Point(0, 0), layout.radius, layout.linewidth,
      colors.radius, new Transform().rotate(0).translate(0, 0),
    ),
  );
  diameter.add(
    'radius2',
    makeLine(
      shapes, new Point(0, 0), layout.radius, layout.linewidth,
      colors.radius, new Transform().rotate(Math.PI).translate(0, 0),
    ),
  );
  diameter.isTouchable = true;
  diameter.isMovable = true;
  diameter._radius2.isTouchable = true;
  diameter._radius2.isMovable = true;
  for (let i = 0; i < diameter._radius2.vertices.border[0].length; i += 1) {
    diameter._radius2.vertices.border[0][i].y *= 10;
  }
  return diameter;
}
function makeArc(shapes: Object) {
  return shapes.polygon(
    layout.circlePoints, layout.radius, layout.linewidth, 0, 1,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeCircumference(shapes: Object, radius: number) {
  return shapes.polygon(
    layout.circlePoints, radius, layout.linewidth, 0, 1,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object, radius: number = layout.linewidth * 2) {
  return shapes.polygonFilled(
    layout.anchorPoints, radius, 0,
    layout.anchorPoints, colors.anchor, new Point(0, 0),
  );
}


type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _circumference: DiagramElementPrimative;
  _diameter: {
    _radius2: DiagramElementPrimative;
    _radius1: DiagramElementPrimative;
  } & DiagramElementCollection;
} & DiagramElementCollection;


function makeCircle(numSections: Array<number>, shapes: Object) {
  const circle = shapes.collection(new Transform().translate(layout.circle.center));
  // circle.add('reference', makeReference(shapes));
  circle.add('arc', makeArc(shapes));
  circle.add('circumference', makeCircumference(shapes, layout.radius));
  circle.add('radius', makeRadius(shapes));
  circle.add('diameter', makeDiameter(shapes));
  circle.add('anchor', makeAnchor(shapes));
  return circle;
}

function makeGridLabels(shapes: Object) {
  const axes = shapes.axes(
    5, 3, new Rect(-2.5, -1.5, 5, 3), 0, 0, 0.5, 0.5,
    0.1, true, colors.axis, colors.grid, new Point(-2.5, -1.5),
  );
  return axes;
}


type locationTextType = {
  _text: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _x: DiagramElementPrimative;
  _y: DiagramElementPrimative;
  _comma: DiagramElementPrimative;
} & DiagramElementCollection;

function makeLocationText(shapes: Object) {
  const locationText = shapes.collection(layout.locationText.top);
  locationText.add('text', shapes.htmlText(
    'Location', 'id_location_text', 'action_word',
    new Point(0, 0), 'middle', 'left',
  ));
  locationText.add('equals', shapes.htmlText(
    '=', 'id_location_equals', '',
    new Point(0.65, 0), 'middle', 'left',
  ));
  locationText.add('x', shapes.htmlText(
    '0', 'id_location_x', '',
    new Point(1.05, 0), 'middle', 'right',
  ));

  locationText.add('comma', shapes.htmlText(
    ',', 'id_location_comma', '',
    new Point(1.07, 0), 'middle', 'left',
  ));

  locationText.add('y', shapes.htmlText(
    '0', 'id_location_y', '',
    new Point(1.4, 0), 'middle', 'right',
  ));
  return locationText;
}


type movingCircleType = {
  _grid: DiagramElementCollection;
  _circle: {
    _touchCircle: DiagramElementPrimative;
    _circumference: DiagramElementPrimative;
    _anchor: DiagramElementPrimative;
  } & DiagramElementCollection;
  _locationText: locationTextType;
} & DiagramElementCollection;

function makeMovingCircle(shapes: Object) {
  const circleSpace = shapes.collection(new Transform().scale(1, 1).translate(
    layout.movingCircle.center.x,
    layout.movingCircle.center.y,
  ));

  const t = new Transform().scale(1, 1).rotate(0).translate(0, 0);
  const movingCircle = shapes.collection(t.copy());

  const circleColor = colors.circle.slice();
  circleColor[3] = 0.1;
  const touchCircle = shapes.polygonFilled(
    layout.circlePoints, layout.movingCircle.radius + layout.linewidth / 2, 0,
    layout.circlePoints, circleColor, t.copy(),
  );
  const circumference = makeCircumference(shapes, layout.movingCircle.radius);
  circumference.transform = t.copy();
  movingCircle.add('touchCircle', touchCircle);
  movingCircle.add('circumference', circumference);
  movingCircle.add('anchor', makeAnchor(shapes, layout.linewidth));
  movingCircle._anchor.transform = t.copy();
  movingCircle.isTouchable = true;
  movingCircle.isMovable = true;
  movingCircle.touchInBoundingRect = true;
  // movingCircle.move.minTransform.updateTranslation(
  //   -2.5 + layout.movingCircle.radius,
  //   -1.5 + layout.movingCircle.radius,
  // );
  // movingCircle.move.maxTransform.updateTranslation(
  //   2.5 - layout.movingCircle.radius,
  //   1.5 - layout.movingCircle.radius,
  // );

  circleSpace.hasTouchableElements = true;
  circleSpace.add('grid', makeGridLabels(shapes));
  circleSpace.add('circle', movingCircle);
  circleSpace.add('locationText', makeLocationText(shapes));

  movingCircle.updateBoundaries = () => {
    const s = movingCircle.transform.s();
    if (s) {
      const percent = s.x;
      movingCircle.move.minTransform.updateTranslation(
        -2.5 + layout.movingCircle.radius * percent,
        -1.5 + layout.movingCircle.radius * percent,
      );
      movingCircle.move.maxTransform.updateTranslation(
        2.5 - layout.movingCircle.radius * percent,
        1.5 - layout.movingCircle.radius * percent,
      );
    }
  };
  movingCircle.updateBoundaries();

  return circleSpace;
}

type StraightCircumferenceType = {
  _leftLine: DiagramElementPrimative;
  _rightLine: DiagramElementPrimative;
  _leftArc: DiagramElementPrimative;
  _rightArc: DiagramElementPrimative;
  straighten: (number) => void;
  bend: (number) => void;
}
function makeStraightCircumference(shapes: Object) {
  const color = colors.circle;
  const centerY = layout.radius;
  const rightLine = makeLine(
    shapes, new Point(0, layout.linewidth / 2), layout.radius * Math.PI, layout.linewidth,
    color, new Transform().scale(1, 1).rotate(0).translate(0, 0),
  );
  const leftLine = makeLine(
    shapes, new Point(0, -layout.linewidth / 2), layout.radius * Math.PI, layout.linewidth,
    color, new Transform().scale(1, 1).rotate(Math.PI).translate(0, 0),
  );
  const leftArc = shapes.polygon(
    layout.circlePoints, layout.radius, layout.linewidth, 0, -1,
    layout.circlePoints / 2, color, new Transform()
      .scale(1, 1).rotate(-Math.PI / 2)
      .translate(0, layout.radius),
  );
  const rightArc = shapes.polygon(
    layout.circlePoints, layout.radius, layout.linewidth, 0, 1,
    layout.circlePoints / 2, color, new Transform()
      .scale(1, 1).rotate(-Math.PI / 2)
      .translate(0, layout.radius),
  );
  const circumference = shapes.collection(new Transform().scale(1, 1)
    .rotate(0).translate(layout.circle.center.x, layout.circle.center.y - layout.radius));
  const dullCircle = makeCircumference(shapes, layout.radius);
  dullCircle.transform.updateTranslation(0, centerY);
  dullCircle.color = colors.grid;
  circumference.add('dullCircle', dullCircle);
  circumference.add('leftLine', leftLine);
  circumference.add('rightLine', rightLine);
  circumference.add('leftArc', leftArc);
  circumference.add('rightArc', rightArc);

  circumference.straighten = (percent: number) => {
    rightLine.transform.updateScale(percent, 1);
    leftLine.transform.updateScale(percent, 1);

    rightArc.transform.updateTranslation(
      percent * layout.radius * Math.PI,
      centerY,
    );
    rightArc.angleToDraw = (1 - percent) * Math.PI;
    if (rightArc.angleToDraw === Math.PI) {
      rightArc.angleToDraw = -1;
    }

    leftArc.transform.updateTranslation(
      -percent * layout.radius * Math.PI,
      centerY,
    );
    leftArc.angleToDraw = (1 - percent) * Math.PI;
    if (leftArc.angleToDraw === Math.PI) {
      leftArc.angleToDraw = -1;
    }
  };
  circumference.bend = (percent: number) => {
    circumference.straighten(1 - percent);
  };
  return circumference;
}

function makeSlider(shapes: Object) {
  const slider = shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(layout.slider.position));
  const travel = layout.slider.length - layout.slider.circleWidth;
  const start = layout.slider.circleWidth / 2;
  slider.travel = travel;
  slider.start = start;

  // const y = -layout.slide.circleWidth / 2;
  const value = makeLine(
    shapes, new Point(0, 0), layout.slider.length, layout.slider.width,
    colors.slider, new Transform().scale(1, 1).rotate(0).translate(0, 0),
  );

  const negValue = makeLine(
    shapes, new Point(0, 0),
    layout.slider.length, layout.slider.width,
    colors.disabled, new Transform().rotate(Math.PI).scale(1, 1).translate(layout.slider.length, 0),
  );
  const circle = makeAnchor(shapes, layout.slider.circleWidth / 2);
  circle.isTouchable = true;
  circle.isMovable = true;
  circle.move.minTransform.updateTranslation(start, 0);
  circle.move.maxTransform.updateTranslation(start + travel, 0);
  circle.move.bounce = false;
  circle.color = colors.slider.slice();
  slider.hasTouchableElements = true;

  slider.add('value', value);
  slider.add('negValue', negValue);
  slider.add('circle', circle);

  slider.set = (percent: number) => {
    slider._circle.transform.updateTranslation(percent * travel + start, 0);
    slider._negValue.transform.updateScale(1 - percent, 1);
  };

  return slider;
}

function makeRadiusText(shapes: Object) {
  const text = shapes.collection(layout.radiusText.position);
  text.add('text', shapes.htmlText(
    'Radius', 'id_radius_text', 'property_text',
    new Point(0, 0), 'middle', 'left',
  ));
  text.add('equals', shapes.htmlText(
    '=', 'id_radius_equals', 'property_text',
    new Point(0.65, 0), 'middle', 'left',
  ));
  text.add('value', shapes.htmlText(
    '0', 'id_radius_value', 'property_text',
    new Point(1.4, 0), 'middle', 'right',
  ));
  return text;
}

function makeDiameterText(shapes: Object) {
  const text = shapes.collection(layout.diameterText.position);
  text.add('text', shapes.htmlText(
    'Diameter', 'id_diameter_text', 'property_text',
    new Point(0, 0), 'middle', 'left',
  ));
  text.add('equals', shapes.htmlText(
    '=', 'id_diameter_equals', 'property_text',
    new Point(0.65, 0), 'middle', 'left',
  ));
  text.add('value', shapes.htmlText(
    '0', 'id_diameter_value', 'property_text',
    new Point(1.4, 0), 'middle', 'right',
  ));
  return text;
}

function makeCircumferenceText(shapes: Object) {
  const text = shapes.collection(layout.circumferenceText.position);
  text.add('text', shapes.htmlText(
    'Circumference', 'id_circumference_text', 'property_text',
    new Point(0, 0), 'middle', 'left',
  ));
  text.add('equals', shapes.htmlText(
    '=', 'id_circumference_equals', 'property_text',
    new Point(1.0, 0), 'middle', 'left',
  ));
  text.add('value', shapes.htmlText(
    '0', 'id_circumference_value', 'property_text',
    new Point(1.4, 0), 'middle', 'right',
  ));
  return text;
}


export type CircleCollectionType = {
  _circle: circleCollectionType;
  _ball: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _moon: DiagramElementPrimative;
  _ring: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _moonShape: DiagramElementPrimative;
  _ringShape: DiagramElementPrimative;
  _ballShape: DiagramElementPrimative;
  _circleShape: DiagramElementPrimative;
  _movingCircle: movingCircleType;
  _straightCircumference: StraightCircumferenceType;
 } & DiagramElementCollection;

class CircleCollection extends DiagramElementCollection {
  _circle: circleCollectionType;
  _ball: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _moon: DiagramElementPrimative;
  _ring: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _moonShape: DiagramElementPrimative;
  _ringShape: DiagramElementPrimative;
  _ballShape: DiagramElementPrimative;
  _circleShape: DiagramElementPrimative;
  _movingCircle: movingCircleType;
  _straightCircumference: StraightCircumferenceType;

  varState: {
    shapeTurn: number,
    rotation: number,
    straightening: boolean,
  };
  numSections: Array<number>;
  diagram: Diagram;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      shapeTurn: 0,
      rotation: 0,
      straightening: false,
    };
    this.numSections = [12, 100];

    const { shapes } = diagram;
    this.add('circle', makeCircle(this.numSections, shapes));
    this.add('ring', makeRing(shapes));
    this.add('ball', makeBall(shapes));
    this.add('moon', makeMoon(shapes));
    this.add('wheel', makeWheel(shapes));
    this.add('wheelShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('moonShape', makeCircleShape(shapes, layout.moon.radius));
    this.add('ballShape', makeCircleShape(shapes, layout.ball.radius));
    this.add('ringShape', makeCircleShape(shapes, layout.ring.radius));
    this.add('circleShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('movingCircle', makeMovingCircle(shapes));
    this.add('straightCircumference', makeStraightCircumference(shapes));
    this.add('radiusText', makeRadiusText(shapes));
    this.add('diameterText', makeDiameterText(shapes));
    this.add('circumferenceText', makeCircumferenceText(shapes));
    this.add('slider', makeSlider(shapes));
    this._movingCircle._circle.setTransformCallback = this.updateLocation.bind(this);
    this._slider._circle.setTransformCallback = this.updateSlider.bind(this);
    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);

    this.hasTouchableElements = true;
    this._circle.hasTouchableElements = true;
  }

  updateRotation() {
    let rotation = this._circle._radius.transform.r();
    if (rotation) {
      if (rotation > Math.PI * 2) {
        rotation -= Math.PI * 2;
      }
      if (rotation < 0) {
        rotation += Math.PI * 2;
      }
      const r = normAngle(rotation);
      this.varState.rotation = r;
      this._circle._radius.transform.updateRotation(r);
      this._circle._arc.angleToDraw = r + 0.01;
      this._circle._diameter.transform.updateRotation(r);
    }
  }

  updateSlider() {
    const t = this._slider._circle.transform.t();
    if (t) {
      const position = t.x;
      const percent = (position - this._slider.start) / this._slider.travel;
      this._slider.set(percent);
      this._movingCircle._circle.transform.updateScale(0.5 + percent, 0.5 + percent);
      this._movingCircle._circle.updateBoundaries();
      this._movingCircle._circle.setTransform(this._movingCircle._circle.transform);
      const newRadius = tools.roundNum((0.5 + percent) * layout.movingCircle.radius, 2);
      this._radiusText._value.vertices.element.innerHTML = `${newRadius.toFixed(2)}`;
      this._diameterText._value.vertices.element.innerHTML = `${(newRadius * 2).toFixed(2)}`;
      this._circumferenceText._value.vertices.element.innerHTML = `${(newRadius * Math.PI * 2).toFixed(2)}`;
    }
  }
  updateLocation() {
    const t = this._movingCircle._circle.transform.t();
    if (t) {
      // $FlowFixMe
      this._movingCircle._locationText._x.vertices.element.innerHTML =
        `${tools.roundNum(t.x, 1).toFixed(1)}`;
      // $FlowFixMe
      this._movingCircle._locationText._y.vertices.element.innerHTML =
        `${tools.roundNum(t.y - layout.movingCircle.center.y, 1).toFixed(1)}`;
    }
  }

  straightenCircumference() {
    const s = this._straightCircumference._rightLine.transform.s();
    let currentPercent = 0;
    if (s) {
      currentPercent = s.x;
    }

    if (!this.varState.straightening) {
      this.animateCustomTo(this._straightCircumference.straighten, 2, currentPercent);
      this.varState.straightening = true;
    } else {
      this.animateCustomTo(this._straightCircumference.bend, 2, 1 - currentPercent);
      this.varState.straightening = false;
    }
    this.diagram.animateNextFrame();
  }

  bendCircumference() {
    this.animateCustomTo(this._straightCircumference.bend, 1);
    this.diagram.animateNextFrame();
  }

  pulseAnchor() {
    this._circle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseMovingCircleAnchor() {
    this._movingCircle._circle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pushMovingCircle() {
    let t = this._movingCircle._circle.transform.t();
    if (t === null || t === undefined) {
      t = new Point(0.001, 0.001);
    }
    if (t.x === 0) {
      t.x = 0.001;
    }
    if (t.y === 0) {
      t.y = 0.001;
    }

    this._movingCircle._circle.state.movement.velocity.updateTranslation(
      Math.random() * 10 * t.x / Math.abs(t.x) * -1,
      Math.random() * 10 * t.y / Math.abs(t.y) * -1,
    );

    this._movingCircle._circle.startMovingFreely();
    this.diagram.animateNextFrame();
  }

  pulseRadius() {
    this._circle._radius.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseDiameter() {
    this._circle._diameter._radius1.pulseScaleNow(1, 2.5);
    this._circle._diameter._radius2.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseArc() {
    this._circle._arc.pulseThickNow(1, 1.01, 3);
    this.diagram.animateNextFrame();
  }

  pulseCircumference() {
    this._circle._circumference.pulseThickNow(1, 1.02, 5);
    this.diagram.animateNextFrame();
  }

  pushRadius() {
    const angle = this._circle._radius.transform.r();
    let targetAngle = angle + Math.PI / 6;
    if (targetAngle > Math.PI * 2) {
      targetAngle -= Math.PI * 2;
    }
    this._circle._radius.animateRotationTo(targetAngle, 1, 1);
    this.diagram.animateNextFrame();
  }

  rotateToRandom(time: number) {
    const angle = Math.random() * Math.PI * 2;
    this.rotateTo(angle, 1, time, () => {});
    this.diagram.animateNextFrame();
  }

  rotateTo(
    angle: number,
    direction: number,
    time: number,
    callback: () => void = () => {},
  ) {
    if (angle === this._circle._radius.transform.r()) {
      callback();
      return;
    }

    let d = direction;
    if (d === 0) {
      const r = this._circle._radius.transform.r();
      d = 1;
      if (r) {
        const delta = minAngleDiff(angle, r);
        d = delta / Math.abs(delta);
      }
    }
    this._circle._radius.animateRotationTo(angle, d, time, tools.easeinout, callback);
    this.diagram.animateNextFrame();
  }

  // eslint-disable-next-line class-methods-use-this
  transitionShape(
    shape: DiagramElementPrimative,
    center: Point,
    radius: number,
  ) {
    // eslint-disable-next-line no-param-reassign
    shape.callback = null;
    shape.stopAnimating(false);
    shape.stopAnimatingColor(false);
    // eslint-disable-next-line no-param-reassign
    shape.color[3] = 1;
    shape.show();
    shape.transform.updateScale(1, 1);
    shape.transform.updateTranslation(center);

    shape.animateTranslationAndScaleTo(
      layout.circleShape.center,
      layout.circleShape.radius / radius,
      2, tools.easeinout,
      shape.disolveOut.bind(
        shape, 1,
        shape.hide.bind(shape),
      ),
    );
  }
  toggleShape() {
    if (this.varState.shapeTurn === 0) {
      this.transitionShape(this._moonShape, layout.moon.center, layout.moon.radius);
    } else if (this.varState.shapeTurn === 1) {
      this.transitionShape(this._wheelShape, layout.wheel.center, layout.wheel.radius);
    } else if (this.varState.shapeTurn === 2) {
      this.transitionShape(this._ballShape, layout.ball.center, layout.ball.radius);
    } else if (this.varState.shapeTurn === 3) {
      this.transitionShape(this._ringShape, layout.ring.center, layout.ring.radius);
    }
    this.varState.shapeTurn += 1;
    if (this.varState.shapeTurn > 3) {
      this.varState.shapeTurn = 0;
    }
    this.diagram.animateNextFrame();
  }

  resetColors() {
    this._circle._radius.color = colors.radius.slice();
    this._circle._anchor.color = colors.anchor.slice();
    this._circle._arc.color = colors.circle.slice();
    this._circle._circumference.color = colors.circle.slice();
  }

  greyColors() {
    this._circle._radius.color = colors.disabled.slice();
    this._circle._anchor.color = colors.disabled.slice();
    this._circle._arc.color = colors.disabled.slice();
    this._circle._circumference.color = colors.disabled.slice();
  }
}

export default CircleCollection;
