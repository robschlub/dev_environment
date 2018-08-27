// @flow
import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, minAngleDiff, Point, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import { makeLabeledLine, makeLabeledAngle, makeSupplementaryAngle } from './diagramCollectionCommon';
import type { TypeLabeledLine, TypeAngle, TypeSupplementaryAngle } from './diagramCollectionCommon';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

type TypeIndexAngle = {
  lineIndex: number;
  angleIndex: number;
} & TypeAngle;

export default class ThreeLinesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: TypeLabeledLine;
  _line2: TypeLabeledLine;
  _line3: TypeLabeledLine;
  _angleA1: TypeIndexAngle;
  _angleB1: TypeIndexAngle;
  _angleC1: TypeIndexAngle;
  _angleD1: TypeIndexAngle;
  _angleA2: TypeIndexAngle;
  _angleB2: TypeIndexAngle;
  _angleC2: TypeIndexAngle;
  _angleD2: TypeIndexAngle;
  _supplementary: TypeSupplementaryAngle;
  varState: {
    supplementary: number;
  };

  _equation1: {
    eqn: Equation;
  } & DiagramElementCollection;

  _equation2: {
    eqn: Equation;
  } & DiagramElementCollection;

  makeParallelLine(labelText: string) {
    const line = makeLabeledLine(
      this.diagram,
      this.layout.parallelLine,
      this.layout.colors.line,
      labelText,
    );
    line.isMovable = false;
    return line;
  }

  makeIntersectingLine(labelText: string) {
    const line = makeLabeledLine(
      this.diagram,
      this.layout.intersectingLine,
      this.layout.colors.line,
      labelText,
    );
    return line;
  }

  makeSuppAngle() {
    const angle = makeSupplementaryAngle(this.diagram, this.layout);
    // angle.setPosition(this.layout.line1.opposite.position);
    return angle;
  }

  makeAngle(
    name: 'a' | 'b' | 'c' | 'd',
    lineIndex: number,
    angleIndex: number,
  ) {
    const color = this.layout.colors[`angle${name.toUpperCase()}`];
    const arcLayout = this.layout.angle.arc;
    const radius = name === 'a' || name === 'c'
      ? arcLayout.radius : arcLayout.radius * 1.0;
    const angle = makeLabeledAngle(this.diagram, this.layout, radius, color);

    angle.eqn.addForm('b_equals', ['b', 'equals', '_180', 'minus', 'a'], 'deg');
    angle.eqn.addForm('b_equals', ['b', 'equals', 'pi', 'minus', 'a'], 'rad');
    angle.eqn.showForm(name);

    // angle.setPositionToElement(line);
    angle.lineIndex = lineIndex;
    angle.angleIndex = angleIndex;
    // angle.setPosition(this.layout.line1.opposite.position);
    return angle;
  }

  addThreeLines() {
    const line1 = this.makeParallelLine('1');
    const line2 = this.makeParallelLine('2');
    const line3 = this.makeIntersectingLine('3');
    this.add('line1', line1);
    this.add('line2', line2);
    this.add('line3', line3);
    line1.setPosition(this.layout.line3.corresponding.position);
    line2.setPosition(this.layout.line3.corresponding.position);
    line3.setPosition(this.layout.line3.corresponding.position);
    // line1.isMoveable = false;
    // line2.isMoveable = false;
    // line1.movementAllowed = 'translation';
    // line2.movementAllowed = 'translation';
    // line1.move.maxTransform.updateTranslation(
    //   this.layout.line1.corresponding.position.x,
    //   this.layout.line1.corresponding.position.y + 0.2,
    // );
    line3.transform.updateRotation(Math.PI / 2);
    line3.move.maxTransform.updateRotation(Math.PI - Math.PI / 3.7);
    line3.move.minTransform.updateRotation(Math.PI / 3.7);
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0).translate(0, 0),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.position);
    this.addThreeLines();
    this.isMovable = true;
    this.isTouchable = true;
    this.add('angleA1', this.makeAngle('a', 1, 0));
    this.add('angleB1', this.makeAngle('b', 1, 1));
    this.add('angleC1', this.makeAngle('c', 1, 2));
    this.add('angleD1', this.makeAngle('d', 1, 3));
    this.add('angleA2', this.makeAngle('a', 2, 0));
    this.add('angleB2', this.makeAngle('b', 2, 1));
    this.add('angleC2', this.makeAngle('c', 2, 2));
    this.add('angleD2', this.makeAngle('d', 2, 3));
    this._line3.setTransformCallback = (t: Transform) => {
      this._line3.updateTransform(t);
      this.updateIntersectingLineAngle();
    };
    this._line1.setTransformCallback = (t: Transform) => {
      this._line3.updateTransform(t);
      this.updateParallelLineTranlsation();
    };

    this.add('supplementary', this.makeSuppAngle());

    this.varState = {
      supplementary: 3,
    };
    this.hasTouchableElements = true;
    this.isMovable = true;
    this.setTransformCallback = this.updateIntersectingLineAngle.bind(this);
  }

  updateAngle(angle: TypeIndexAngle, intersect: Point, r: number) {
    const threeLinesRotation = this.transform.r();
    if (threeLinesRotation != null) {
      angle.setPosition(intersect);
      if (angle.angleIndex === 0) {
        angle.updateAngle(0, r, threeLinesRotation);
      } else if (angle.angleIndex === 1) {
        angle.updateAngle(r, Math.PI - r, threeLinesRotation);
      } else if (angle.angleIndex === 2) {
        angle.updateAngle(Math.PI, r, threeLinesRotation);
      } else if (angle.angleIndex === 3) {
        angle.updateAngle(r + Math.PI, Math.PI - r, threeLinesRotation);
      }
    }
  }

  updateParallelLineTranlsation() {
    if (this._line1.isMovable) {
      this.updateIntersectingLineAngle();
    }
  }

  updateIntersectingLineAngle() {
    const r = this._line3.transform.r();
    const t1 = this._line1.transform.t();
    const t2 = this._line2.transform.t();
    const t3 = this._line3.transform.t();
    if (r != null && t1 != null && t2 != null && t3 != null) {
      const intersectT1 = new Point(
        (t1.y - t3.y) / Math.tan(r) + t3.x,
        (t1.y - t3.y),
      );
      const intersectT2 = new Point(
        (t2.y - t3.y) / Math.tan(r) + t3.x,
        (t2.y - t3.y),
      );
      this.updateAngle(this._angleA1, intersectT1, r);
      this.updateAngle(this._angleA2, intersectT2, r);
      this.updateAngle(this._angleB1, intersectT1, r);
      this.updateAngle(this._angleB2, intersectT2, r);
      this.updateAngle(this._angleC1, intersectT1, r);
      this.updateAngle(this._angleC2, intersectT2, r);
      this.updateAngle(this._angleD1, intersectT1, r);
      this.updateAngle(this._angleD2, intersectT2, r);
    }
  }

  pulseLine(index: number = 1) {
    this.elements[`line${index}`].pulseWidth();
    this.diagram.animateNextFrame();
  }

  pulseParallel() {
    this.pulseLine(1);
    this.pulseLine(2);
  }

  toggleAngle1() {
    if (this._angleA1.isShown) {
      this._angleA1.hide();
      this._angleB1.show();
      this._angleB1._arc.show();
      this._angleB1.eqn.showForm('b');
      this._angleC1.hide();
      this._angleD1.hide();
    } else if (this._angleB1.isShown) {
      this._angleA1.hide();
      this._angleB1.hide();
      this._angleC1.show();
      this._angleC1._arc.show();
      this._angleC1.eqn.showForm('c');
      this._angleD1.hide();
    } else if (this._angleC1.isShown) {
      this._angleA1.hide();
      this._angleB1.hide();
      this._angleC1.hide();
      this._angleD1.show();
      this._angleD1._arc.show();
      this._angleD1.eqn.showForm('d');
    } else {
      this._angleA1.show();
      this._angleA1._arc.show();
      this._angleA1.eqn.showForm('a');
      this._angleB1.hide();
      this._angleC1.hide();
      this._angleD1.hide();
    }
    this.diagram.animateNextFrame();
  }

  translateLine1() {
    const range = this.layout.line1.corresponding.position
      .sub(this.layout.line2.corresponding.position).y;
    let y = Math.max(Math.random(), 0.7) * range / 2;
    const t = this._line1.transform.t();
    if (t != null) {
      if (t.y >= 0) {
        y *= -1;
      } 
      const position = new Point(
        this.layout.line1.corresponding.position.x,
        y + t.y,
      );
      this._line1.stop();
      this._line1.animateTranslationTo(position, 1);
      this.diagram.animateNextFrame();
    }
  }

  pulseSupplementaryAngle() {
    // if (index != null) {
    //   this.varState.supplementary = index;
    // } else if (this.varState.supplementary === 3) {
    //   this.varState.supplementary = 0;
    // } else {
    //   this.varState.supplementary += 1;
    // }

    // const r1 = this._line1.transform.r();
    // const r2 = this._line2.transform.r();
    // if (r1 != null && r2 != null) {
    //   if (this.varState.supplementary === 0) {
    //     this._supplementary.transform.updateRotation(r1);
    //   }
    //   if (this.varState.supplementary === 1) {
    //     this._supplementary.transform.updateRotation(r2);
    //   }
    //   if (this.varState.supplementary === 2) {
    //     this._supplementary.transform.updateRotation(r1 + Math.PI);
    //   }
    //   if (this.varState.supplementary === 3) {
    //     this._supplementary.transform.updateRotation(r2 + Math.PI);
    //   }
    // }
    this._supplementary.scaleAndDisolve();
    this.diagram.animateNextFrame();
  }

  // nextEquation2Form() {
  //   this._equation2.eqn.nextForm();
  //   this.diagram.animateNextFrame();
  // }

  toggleCorrespondingAngles() {
    if (this._angleA1.isShown) {
      this._angleA1.hide();
      this._angleA2.hide();
      this._angleB1.show();
      this._angleB2.show();
      this._angleB1._arc.show();
      this._angleB2._arc.show();
      this._angleB1.eqn.showForm('b');
      this._angleB2.eqn.showForm('b');
      this._angleC1.hide();
      this._angleC2.hide();
      this._angleD1.hide();
      this._angleD2.hide();
    } else if (this._angleB1.isShown) {
      this._angleA1.hide();
      this._angleA2.hide();
      this._angleB1.hide();
      this._angleB2.hide();
      this._angleC1.show();
      this._angleC2.show();
      this._angleC1._arc.show();
      this._angleC2._arc.show();
      this._angleC1.eqn.showForm('c');
      this._angleC2.eqn.showForm('c');
      this._angleD1.hide();
      this._angleD2.hide();
    } else if (this._angleC1.isShown) {
      this._angleA1.hide();
      this._angleA2.hide();
      this._angleB1.hide();
      this._angleB2.hide();
      this._angleC1.hide();
      this._angleC2.hide();
      this._angleD1.show();
      this._angleD2.show();
      this._angleD1._arc.show();
      this._angleD2._arc.show();
      this._angleD1.eqn.showForm('d');
      this._angleD2.eqn.showForm('d');
    } else {
      this._angleA1.show();
      this._angleA2.show();
      this._angleA1._arc.show();
      this._angleA2._arc.show();
      this._angleA1.eqn.showForm('a');
      this._angleA2.eqn.showForm('a');
      this._angleB1.hide();
      this._angleB2.hide();
      this._angleC1.hide();
      this._angleC2.hide();
      this._angleD1.hide();
      this._angleD2.hide();
    }
    this.diagram.animateNextFrame();
  }
}
