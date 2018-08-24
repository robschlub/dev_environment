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

  // addEquation(name: string) {
  //   const eqn = this.diagram.equation.makeEqn();
  //   eqn.createElements(
  //     {
  //       a: 'a',
  //       a1: 'a',
  //       b: 'b',
  //       c: 'c',
  //       d: 'd',
  //       equals: ' = ',
  //       minus: ' \u2212 ',
  //       minus1: ' \u2212 ',
  //       _180: '180º',
  //       _1801: '180º',
  //       pi: 'π',
  //       pi1: 'π',
  //       plus: ' + ',
  //       lb: '(',
  //       rb: ')',
  //     },
  //     this.layout.colors.diagram.text.base,
  //   );

  //   eqn.formAlignment.fixTo = eqn.collection._equals;
  //   eqn.formAlignment.hAlign = 'center';
  //   eqn.formAlignment.vAlign = 'middle';
  //   eqn.formAlignment.scale = 1.0;

  //   eqn.setElem('a', this.layout.colors.angleA);
  //   eqn.setElem('a1', this.layout.colors.angleA);
  //   eqn.setElem('b', this.layout.colors.angleB);
  //   eqn.setElem('c', this.layout.colors.angleC);
  //   eqn.setElem('d', this.layout.colors.angleD);

  //   eqn.addForm('a_plus_b', ['a', 'plus', 'b', 'equals', '_180', 'deg']);
  //   eqn.addForm('a_plus_b', ['a', 'plus', 'b', 'equals', 'pi'], 'rad');

  //   eqn.addForm('b', ['b', 'equals', '_180', 'minus', 'a1'], 'deg');
  //   eqn.addForm('b', ['b', 'equals', 'pi', 'minus', 'a1'], 'rad');

  //   eqn.addForm('c', ['c', 'equals', '_180', 'minus', 'b'], 'deg');
  //   eqn.addForm('c', ['c', 'equals', 'pi', 'minus', 'b'], 'rad');
  //   eqn.addForm('c_equals_a_full', ['c', 'equals', '_180', 'minus', 'lb', '_1801', 'minus1', 'a', 'rb'], 'deg');
  //   eqn.addForm('c_equals_a_full', ['c', 'equals', 'pi', 'minus', 'lb', 'pi1', 'minus1', 'a', 'rb'], 'rad');
  //   eqn.addForm('c_equals_a', ['c', 'equals', 'a']);

  //   // eqn.addForm('a_plus_d', ['a', 'plus', 'd', 'equals', '_180', 'deg']);
  //   // eqn.addForm('a_plus_d', ['a', 'plus', 'd', 'equals', 'pi'], 'rad');

  //   eqn.addForm('d', ['d', 'equals', '_180', 'minus', 'a'], 'deg');
  //   eqn.addForm('d', ['d', 'equals', 'pi', 'minus', 'a'], 'rad');

  //   eqn.addForm('d_equals_b', ['d', 'equals', 'b']);

  //   eqn.showForm('deg_a_plus_b');
  //   this.add(name, eqn.collection);
  //   this.elements[name].eqn = eqn;

  //   return eqn;
  // }

  // setUnits(units: 'deg' | 'rad') {
  //   // this._equation1.eqn.setUnits(units);
  //   // this._equation2.eqn.setUnits(units);
  //   // this._equation3.eqn.setUnits(units);
  //   // this._angleB.eqn.setUnits(units);
  // }

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
    line3.move.maxTransform.updateRotation(Math.PI - Math.PI / 3.8);
    line3.move.minTransform.updateRotation(Math.PI / 3.8);
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;

    this.addThreeLines();
    // this.add('line1', this.makeLine('1'));
    // this._line1.setPosition(this.layout.line1.corresponding.position);
    // this.add('line2', this.makeLine('2'));
    // this._line2.setPosition(this.layout.line2.corresponding.position);
    // this.add('line3', this.makeLine('2'));
    // this._line3.setPosition(this.layout.line3.corresponding.position);
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

    this.add('supplementary', this.makeSuppAngle());

    this.varState = {
      supplementary: 3,
    };
    this.hasTouchableElements = true;
    this.isMovable = true;
  }

  updateAngle(angle: TypeIndexAngle, intersect: Point, r: number) {
    angle.setPosition(intersect);
    if (angle.angleIndex === 0) {
      angle.updateAngle(0, r);
    } else if (angle.angleIndex === 0) {
      angle.updateAngle(r, Math.PI - r);
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
      this.updateAngle(this._angleA1, intersectT1, r);
    }
  }

  // updateAngles() {
  //   // if (this._line1 && this._line2 && this._angleA) {
  //   //   const r1 = this._line1.transform.r();
  //   //   const r2 = this._line2.transform.r();
  //   //   if (r1 != null && r2 != null) {
  //   //     if (this._angleA.isShown
  //   //       || this._angleB.isShown
  //   //       || this._angleC.isShown
  //   //       || this._angleD.isShown) {
  //   //       const minAngle = minAngleDiff(r2, r1);
  //   //       if (minAngle > 0) {
  //   //         this._angleA.updateAngle(r1, minAngle);
  //   //         this._angleB.updateAngle(r1 + Math.PI - (Math.PI - minAngle), Math.PI - minAngle);
  //   //         this._angleC.updateAngle(r1 + Math.PI, minAngle);
  //   //         this._angleD.updateAngle(r1 + 2 * Math.PI - (Math.PI - minAngle), Math.PI - minAngle);
  //   //       } else {
  //   //         this._angleA.updateAngle(r1, Math.PI - Math.abs(minAngle));
  //   //         this._angleB.updateAngle(r1 + Math.PI - Math.abs(minAngle), Math.abs(minAngle));
  //   //         this._angleC.updateAngle(r1 + Math.PI, Math.PI - Math.abs(minAngle));
  //   //         this._angleD.updateAngle(r1 + 2 * Math.PI - Math.abs(minAngle), Math.abs(minAngle));
  //   //       }
  //   //     }
  //   //     this._line1.updateLabel(r1);
  //   //     this._line2.updateLabel(r2);
  //   //   }
  //   // }
  // }

  pulseLine(index: number = 1) {
    this.elements[`line${index}`].pulseWidth();
    this.diagram.animateNextFrame();
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
    } else if (this._angleD1.isShown) {
      this._angleA1.show();
      this._angleA2.show();
      this._angleB1.hide();
      this._angleB2.hide();
      this._angleC1.hide();
      this._angleC2.hide();
      this._angleD1.hide();
      this._angleD2.hide();
    }
  }
  // toggleOppositeAngles() {
  //   // if (this._angleA.isShown) {
  //   //   this._angleB.eqn.showForm('b');
  //   //   this._angleD.eqn.showForm('b');
  //   //   this._angleB.show();
  //   //   this._angleB._arc.show();
  //   //   this._angleD.show();
  //   //   this._angleD._arc.show();
  //   //   this._angleA.hide();
  //   //   this._angleC.hide();
  //   // } else {
  //   //   this._angleB.hide();
  //   //   this._angleD.hide();
  //   //   this._angleA.eqn.showForm('a');
  //   //   this._angleC.eqn.showForm('a');
  //   //   this._angleA.show();
  //   //   this._angleC.show();
  //   //   this._angleA._arc.show();
  //   //   this._angleC._arc.show();
  //   // }
  //   // this.diagram.animateNextFrame();
  // }
}
