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

function makeRadialLines(shapes: Object, num: number) {
  return shapes.radialLines(
    0, layout.radius, layout.radialLineWidth, Math.PI * 2 / num,
    colors.radialLines, new Transform().translate(0, 0),
  );
}
// function makeSectionTitle(shapes: Object) {
//   const font = new DiagramFont('Helvetica', 'normal', 0.15, '200', 'left', 'middle');
//   return shapes.text('sections', layout.sectionText.position, colors.radialLinesText, font);
// }

// function makeAngleEqualsText(shapes: Object) {
//   const font = new DiagramFont('Helvetica', 'normal', 0.15, '200', 'left', 'middle');
//   return shapes.text('Angle = ', layout.angleEqualsText.position, colors.radialLinesText, font);
// }

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
    'sections', 'id_angle_units', '',
    new Point(0.9, 0), 'middle', 'left',
  ));
  return angleText;
}

function makeSectionTitle(shapes: Object) {
  // const angleText = shapes.collection(layout.angleEqualsText.position.add(new Point(0, -0.5)));
  return shapes.htmlText(
    'Total Sections = 4', 'id_total_sections_text', '',
    layout.sectionText.position, 'middle', 'left',
  );
  // return angleText;
}

type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _radialLinesA: DiagramElementPrimative;
  _radialLinesB: DiagramElementPrimative;
  _radialLinesC: DiagramElementPrimative;
} & DiagramElementCollection;


function makeCircle(numSections: Array<number>, shapes: Object) {
  const circle = shapes.collection(new Transform().translate(layout.circle.center));
  circle.add('angle', makeAngle(shapes));
  circle.add('radialLines12', makeRadialLines(shapes, 12));
  circle.add('radialLinesA', makeRadialLines(shapes, numSections[0]));
  circle.add('radialLinesB', makeRadialLines(shapes, numSections[1]));
  circle.add('radialLinesC', makeRadialLines(shapes, numSections[2]));
  circle.add('reference', makeReference(shapes));
  circle.add('arc', makeArc(shapes));
  circle.add('circumference', makeCircumference(shapes));
  circle.add('radius', makeRadius(shapes));
  circle.add('anchor', makeAnchor(shapes));
  return circle;
}

class CircleCollection extends DiagramElementCollection {
  _circle: circleCollectionType;
  _sectionTitle: DiagramElementPrimative;
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
    this.numSections = [4, 8, 12];

    const { shapes } = diagram;
    this.add('circle', makeCircle(this.numSections, shapes));
    this.add('sectionTitle', makeSectionTitle(shapes));
    this.add('angleText', makeAngleText(shapes));

    this._circle._radius.setTransformCallback = this.updateRotation.bind(this);

    this.isTouchable = true;
    this.isMovable = true;
    this._circle.isTouchable = true;
    this._circle.isMovable = true;
  }

  // resize() {
  //   this.transform.updateTranslation(
  //     layout.circle.center.x,
  //     layout.circle.center.y,
  //   );
  // }

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
    // $FlowFixMe
    this._sectionTitle.vertices.element.innerHTML = `Total sections = ${this.varState.radialLines}`;
    const angleInSections =
        Math.round((r / (Math.PI * 2 / this.varState.radialLines) * 10)) / 10;

    // $FlowFixMe
    this._angleText._angle.vertices.element.innerHTML = `${angleInSections}`;
  }
  pulseAngle() {
    this._circle._angle.pulseScaleNow(1, 1.3);
    this.diagram.animateNextFrame();
  }

  // pulseSectionedAngle() {
  //   const scale = 1.3;
  //   this._circle._angle.pulseScaleNow(1, scale);
  //   this._circle._radialLinesA.pulseScaleNow(1, scale);
  //   this._circle._radialLinesB.pulseScaleNow(1, scale);
  //   this._circle._radialLinesC.pulseScaleNow(1, scale);
  //   this.diagram.animateNextFrame();
  // }

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
    if (toPosition > -1) {
      this.varState.radialLines = this.numSections[toPosition];
    }
    if (this.varState.radialLines === this.numSections[0]) {
      this._circle._radialLinesA.hide();
      this._circle._radialLinesB.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[1];
    } else if (this.varState.radialLines === this.numSections[1]) {
      this._circle._radialLinesB.hide();
      this._circle._radialLinesC.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[2];
    } else if (this.varState.radialLines === this.numSections[2]) {
      this._circle._radialLinesC.hide();
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    } else {
      this._circle._radialLinesA.show();
      // eslint-disable-next-line prefer-destructuring
      this.varState.radialLines = this.numSections[0];
    }

    // this._sectionTitle.vertices.text[0].text = `Max = ${this.varState.radialLines} sections`;

    // this._angle
    // this._angleEqualsText.show();
    // this._angleEqualsText.vertices.text[0].text =
    //     `Angle = ${this.varState.angleInSections} sections`;
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

  // resetColors() {
  //   // this._sectionTitle.setColor(colors.radialLinesText);
  //   // this._angleEqualsText.setColor(colors.radialLinesText);
  // }
}

export default CircleCollection;
