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

function makeArc(shapes: Object) {
  return shapes.polygon(
    layout.circlePoints, layout.radius, layout.linewidth, 0,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeCircumference(shapes: Object) {
  return shapes.polygon(
    layout.circlePoints, layout.radius, layout.linewidth, 0,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object) {
  return shapes.polygonFilled(
    layout.anchorPoints, layout.linewidth * 2, 0,
    layout.anchorPoints, colors.anchor, new Point(0, 0),
  );
}

function makeReference(shapes: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _radialLinesA: DiagramElementPrimative;
  _radialLinesB: DiagramElementCollection;
  _radialLinesDeg: DiagramElementCollection;
  // _radialLinesC: DiagramElementPrimative;
} & DiagramElementCollection;


function makeCircle(numSections: Array<number>, shapes: Object) {
  const circle = shapes.collection(new Transform().translate(layout.circle.center));
  circle.add('reference', makeReference(shapes));
  circle.add('arc', makeArc(shapes));
  circle.add('circumference', makeCircumference(shapes));
  circle.add('radius', makeRadius(shapes));
  circle.add('anchor', makeAnchor(shapes));
  return circle;
}

class CircleCollection extends DiagramElementCollection {
  _circle: circleCollectionType;
  // _sectionTitle: DiagramElementPrimative;
  _ball: DiagramElementPrimative;
  _wheel: DiagramElementPrimative;
  _moon: DiagramElementPrimative;
  _clock: DiagramElementPrimative;
  _wheelShape: DiagramElementPrimative;
  _moonShape: DiagramElementPrimative;
  _clockShape: DiagramElementPrimative;
  _ballShape: DiagramElementPrimative;
  _circleShape: DiagramElementPrimative;

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
    this.add('circleShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('wheelShape', makeCircleShape(shapes, layout.wheel.radius));
    this.add('moonShape', makeCircleShape(shapes, layout.moon.radius));
    this.add('ballShape', makeCircleShape(shapes, layout.ball.radius));
    this.add('clockShape', makeCircleShape(shapes, layout.clock.radius));

    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);

    this.isTouchable = true;
    this.isMovable = true;
    this._circle.isTouchable = true;
    this._circle.isMovable = true;
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
    }
  }

  pulseAnchor() {
    this._circle._anchor.pulseScaleNow(1, 2);
    this.diagram.animateNextFrame();
  }

  pulseRadius() {
    this._circle._radius.pulseScaleNow(1, 2.5);
    this.diagram.animateNextFrame();
  }

  pulseReference() {
    this._circle._reference.pulseScaleNow(1, 2);
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
        shape, 2,
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

  // resetColors() {
  //   this._moonShape.color[3] = 1;
  //   this._wheelShape.color[3] = 1;
  //   this._clockShape.color[3] = 1;
  //   this._ballShape.color[3] = 1;
  // }
}

export default CircleCollection;
