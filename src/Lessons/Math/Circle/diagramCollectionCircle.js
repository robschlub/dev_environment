// @flow

import Diagram from '../../../js/diagram/Diagram';
import * as tools from '../../../js/diagram/tools/mathtools';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../../js/diagram/Element';
// import { DiagramFont } from '../../../js/diagram/DrawingObjects/TextObject/TextObject';
import { Point, Transform, minAngleDiff, normAngle, Rect } from '../../../js/diagram/tools/g2';
import { AxisProperties } from '../../../js/diagram/DiagramElements/Plot/AxisProperties';
import Axis from '../../../js/diagram/DiagramElements/Plot/Axis';
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

function makeClock(shapes: Object) {
  return shapes.polygonFilled(
    layout.circlePoints, layout.clock.radius, 0,
    layout.circlePoints, colors.anchor, new Point(0, 0),
    '/static/circles.png', new Rect(0.7222, 0, 0.1481, 0.1481),
  );
}

function makeCircleShape(shapes: Object, radius) {
  return shapes.polygon(
    layout.circlePoints, radius, layout.linewidth, 0,
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
    layout.circlePoints, layout.radius, layout.linewidth, 0,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeCircumference(shapes: Object, radius: number) {
  return shapes.polygon(
    layout.circlePoints, radius, layout.linewidth, 0,
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
  circle.add('anchor', makeAnchor(shapes));
  circle.add('diameter', makeDiameter(shapes));
  return circle;
}

function makeGridLabels(diagram: Diagram, shapes: Object) {
  const axes = shapes.axes(
    5, 3, new Rect(-2.5, -1.5, 5, 3), 0, 0, 0.5, 0.5,
    0.1, true, colors.axis, colors.grid, new Point(-2.5, -1.8),
  );
  return axes;
}

function makeMovingCircle(shapes: Object) {
  const circleSpace = shapes.collection(new Transform().translate(0, 0));
  const circleColor = colors.circle.slice();
  circleColor[3] = 0.1;
  const touchCircle = shapes.polygonFilled(
    layout.circlePoints, layout.movingCircle.radius + layout.linewidth / 2, 0,
    layout.circlePoints, circleColor, new Point(0, 0),
  );
  const circumference = makeCircumference(shapes, layout.movingCircle.radius);
  circleSpace.add('touchCircle', touchCircle);
  circleSpace.add('circumference', circumference);
  circleSpace.add('anchor', makeAnchor(shapes, layout.linewidth));

  circleSpace.isTouchable = true;
  circleSpace.isMovable = true;
  circleSpace._touchCircle.isTouchable = true;
  circleSpace.move.limitToDiagram = true;
  // circleSpace.setMoveBoundaryToDiagram([-2.5, -1.5, 2.5, 1.5]);
  // circleSpace._touchCircle.isMovable = true;
  return circleSpace;
}

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

class CircleCollection extends DiagramElementCollection {
  _circle: circleCollectionType;
  _ball: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _moon: DiagramElementPrimative;
  _clock: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _moonShape: DiagramElementPrimative;
  _clockShape: DiagramElementPrimative;
  _ballShape: DiagramElementPrimative;
  _circleShape: DiagramElementPrimative;
  _movingCircle: {
    _touchCircle: DiagramElementPrimative;
    _circumference: DiagramElementPrimative;
  } & DiagramElementCollection

  varState: {
    shapeTurn: number,
    rotation: number,
  };
  numSections: Array<number>;
  diagram: Diagram;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      shapeTurn: 0,
      rotation: 0,
    };
    this.numSections = [12, 100];

    const { shapes } = diagram;
    this.add('circle', makeCircle(this.numSections, shapes));
    this.add('clock', makeClock(shapes));
    this.add('ball', makeBall(shapes));
    this.add('moon', makeMoon(shapes));
    this.add('wheel', makeWheel(shapes));
    this.add('wheelShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('moonShape', makeCircleShape(shapes, layout.moon.radius));
    this.add('ballShape', makeCircleShape(shapes, layout.ball.radius));
    this.add('clockShape', makeCircleShape(shapes, layout.clock.radius));
    this.add('circleShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('grid', makeGridLabels(diagram, shapes));
    this.add('movingCircle', makeMovingCircle(shapes));
    this.add('locationText', makeLocationText(shapes));
    this._movingCircle.setTransformCallback = this.updateLocation.bind(this);
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

  updateLocation() {
    const t = this._movingCircle.transform.t();
    if (t) {
      this._locationText._x.vertices.element.innerHTML =
        `${tools.roundNum(t.x, 1).toFixed(1)}`;
      this._locationText._y.vertices.element.innerHTML =
        `${tools.roundNum(t.y - layout.movingCircle.center.y, 1).toFixed(1)}`;
    }
  }

  pulseAnchor() {
    this._circle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseMovingCircleAnchor() {
    this._movingCircle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pushMovingCircle() {
    let t = this._movingCircle.transform.t();
    // console.log(this._movingCircle.state.movement.velocity)
    if (t === null || t === undefined) {
      t = new Point(0.001, 0.001);
    }
    if (t.x === 0) {
      t.x = 0.001;
    }
    if (t.y === 0) {
      t.y = 0.001;
    }

    this._movingCircle.state.movement.velocity.updateTranslation(
      Math.random() * 10 * t.x / Math.abs(t.x) * -1,
      Math.random() * 10 * t.y / Math.abs(t.y) * -1,
    );
    // console.log(this._movingCircle.state.movement.velocity)
    this._movingCircle.startMovingFreely();
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

  // pulseReference() {
  //   this._circle._reference.pulseScaleNow(1, 2);
  //   this.diagram.animateNextFrame();
  // }

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
      this.transitionShape(this._clockShape, layout.clock.center, layout.clock.radius);
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
