// @flow

import Diagram from '../../../js/diagram/Diagram';
import * as tools from '../../../js/diagram/tools/mathtools';
import { DiagramElementCollection, DiagramElementPrimative }
  from '../../../js/diagram/Element';
// import { DiagramFont } from '../../../js/diagram/DrawingObjects/TextObject/TextObject';
import { Point, Transform, minAngleDiff, normAngle } from '../../../js/diagram/tools/g2';
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
    layout.anglePoints, layout.radius, layout.linewidth, 0,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeCircumference(shapes: Object) {
  return shapes.polygon(
    layout.anglePoints, layout.radius, layout.linewidth, 0,
    layout.circlePoints, colors.circle, new Point(0, 0),
  );
}

function makeAnchor(shapes: Object) {
  return shapes.polygonFilled(
    layout.anchorPoints, layout.linewidth * 2, 0,
    layout.anchorPoints, colors.anchor, new Point(0, 0),
  );
}

function makeAngle(shapes: Object) {
  return shapes.polygonFilled(
    layout.anglePoints, layout.angleRadius, 0,
    layout.anglePoints, colors.angle, new Point(0, 0),
  );
}

function makeReference(shapes: Object) {
  return makeLine(
    shapes, new Point(0, 0), layout.radius, layout.linewidth,
    colors.reference, new Transform().rotate(0).translate(0, 0),
  );
}

// function makeRadialLines(shapes: Object, num: number) {
//   return shapes.radialLines(
//     0, layout.radius, layout.radialLineWidth, Math.PI * 2 / num,
//     colors.radialLines, new Transform().translate(0, 0),
//   );
// }

function makeRadialMarks(shapes: Object, num: number, minor: boolean = false) {
  let inner = layout.radialLineMajorInner;
  let outer = layout.radialLineMajorOuter;
  if (minor) {
    inner = layout.radialLineMinorInner;
    outer = layout.radialLineMinorOuter;
  }
  return shapes.radialLines(
    inner, outer,
    layout.radialLineWidth, Math.PI * 2 / num,
    colors.palette.grey.light, new Transform().translate(0, 0),
  );
}

function makeMajorAndMinRadialMarks(
  shapes: Object,
  major: number,
  minor: number,
) {
  const collection = shapes.collection(new Transform().translate(0, 0));
  collection.add('minor', makeRadialMarks(shapes, major, true));
  collection.add('major', makeRadialMarks(shapes, minor, false));

  return collection;
}

function makeAngleText(shapes: Object) {
  const angleText = shapes.collection(layout.angleEqualsText.position);
  angleText.add('text', shapes.htmlText(
    'Angle', 'id_angle_text', 'action_word',
    new Point(0, 0), 'middle', 'left',
  ));
  angleText.add('equals', shapes.htmlText(
    '=', 'id_angle_equals', '',
    new Point(0.45, 0), 'middle', 'left',
  ));
  angleText.add('angle', shapes.htmlText(
    '0', 'id_angle_value', '',
    new Point(0.6, 0), 'middle', 'left',
  ));
  angleText.add('units', shapes.htmlText(
    'portions', 'id_angle_units', '',
    new Point(0.9, 0), 'middle', 'left',
  ));
  return angleText;
}

type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _radialLinesA: DiagramElementPrimative;
  _radialLinesB: DiagramElementCollection
  // _radialLinesC: DiagramElementPrimative;
} & DiagramElementCollection;


function makeCircle(numSections: Array<number>, shapes: Object) {
  const circle = shapes.collection(new Transform().translate(layout.circle.center));
  circle.add('angle', makeAngle(shapes));
  // circle.add('radialLines12', makeRadialLines(shapes, 12));
  circle.add('radialLinesA', makeRadialMarks(shapes, numSections[0]));
  circle.add('radialLinesB', makeMajorAndMinRadialMarks(shapes, 10, numSections[1]));
  // circle.add('radialLinesC', makeRadialLines(shapes, numSections[2]));
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
  _angleText: DiagramElementCollection;
  varState: {
    radialLines: number,
    angleInSections: number,
    rotation: number,
  };
  numSections: Array<number>;
  diagram: Diagram;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.varState = {
      radialLines: 4,
      angleInSections: 0,
      rotation: 0,
    };
    this.numSections = [12, 100];

    const { shapes } = diagram;
    this.add('circle', makeCircle(this.numSections, shapes));
    // this.add('sectionTitle', makeSectionTitle(shapes));
    this.add('angleText', makeAngleText(shapes));

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
      this._circle._angle.angleToDraw = r + 0.01;
      this._circle._arc.angleToDraw = r + 0.01;
      this.updateNumSectionsText();
    }
  }

  updateNumSectionsText() {
    const r = this.varState.rotation;
    const angleInSections =
        Math.round((r / (Math.PI * 2 / this.varState.radialLines) * 10)) / 10;

    // $FlowFixMe
    this._angleText._angle.vertices.element.innerHTML = `${angleInSections}`;
  }
  pulseAngle() {
    this._circle._angle.pulseScaleNow(1, 1.3);
    this.diagram.animateNextFrame();
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

  toggleRadialLines(toPosition: number = -1) {
    if (toPosition > 0) {
      this.varState.radialLines = this.numSections[toPosition - 1];
    } else if (toPosition === 0) {
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[1];
    }
    if (this.varState.radialLines === this.numSections[0]) {
      this._circle._radialLinesA.hide();
      this._circle._radialLinesB.showAll();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[1];
    } else if (this.varState.radialLines === this.numSections[1]) {
      this._circle._radialLinesB.hideAll();
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    } else {
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    }
    this.updateNumSectionsText();

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
}

export default CircleCollection;
