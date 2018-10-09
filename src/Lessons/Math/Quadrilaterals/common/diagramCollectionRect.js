// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
// import { Equation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';
// import {
//   removeRandElement, rand,
// } from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';

// import makeTriangle from '../../../../LessonsCommon/tools/triangle';
// import type {
//   TypeTriangle, TypeTriangleAngle, TypeTriangleLabel,
// } from '../../../../LessonsCommon/tools/triangle';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';
import makeAnglesEquation from './equationAngles';
import type { TypeAnglesEquationCollection, TypeAnglesEquation } from './equationAngles';
import makeEquationNavigator from '../../../../LessonsCommon/tools/equationNavigator';

export default class RectCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  rectEqn: TypeAnglesEquation;
  _rectEqn: TypeAnglesEquationCollection;
  _rectEqnDescription: DiagramElementPrimative;
  // _rect: DiagramElementPrimative;
  _rightAngle1: TypeAngle;
  _rightAngle2: TypeAngle;
  _rightAngle3: TypeAngle;
  _rightAngle4: TypeAngle;
  _lineA: TypeLine;
  _lineB: TypeLine;
  _lineC: TypeLine;
  _lineD: TypeLine;
  _lineE: TypeLine;
  _angleA: TypeAngle;
  _angleB: TypeAngle;
  _angleC: TypeAngle;
  _angleD: TypeAngle;

  addRect() {
    // const rect = this.diagram.shapes.polyLine(
    //   this.layout.rect.points, true, this.layout.lineWidth,
    //   this.layout.colors.lines,
    //   'none', new Transform('rect').scale(1, 1).translate(0, 0),
    // );

    // rect.setPosition(this.layout.rect.position);
    // this.add('rect', rect);

    const makeL = (p1, p2, labelText, show) => {
      const line = makeLine(
        this.diagram, 'end', 1, this.layout.lineWidth,
        this.layout.colors.lines, show,
      );
      line.setEndPoints(p1, p2);
      line.setPosition(this.layout.rect.position.add(p1));
      line.addLabel(labelText, 0.05, 'inside', 'top', 'horizontal');
      this.add(`line${labelText}`, line);
    };
    const { points } = this.layout.rect;
    const halfLine = this.layout.lineWidth / 2;
    makeL(points[2].sub(0, halfLine), points[3].add(0, halfLine), 'C', true);
    makeL(points[3].add(halfLine, 0), points[0].sub(halfLine, 0), 'D', true);
    makeL(points[0].add(0, halfLine), points[1].sub(0, halfLine), 'A', true);
    makeL(points[1].sub(halfLine, 0), points[2].add(halfLine, 0), 'B', true);
    makeL(points[0], points[2], 'E', true);
  }

  addRightAngles() {
    const makeA = () => {
      const angle = makeAngle(
        this.diagram, this.layout.angleRadius,
        this.layout.lineWidth, this.layout.angleSides, this.layout.colors.angles,
      );
      angle.addLabel('', this.layout.angleLabelRadius);
      angle.autoRightAngle = true;
      return angle;
    };
    const rightAngle1 = makeA();
    rightAngle1.setPosition(this.layout.rect.points[0]);
    rightAngle1.updateAngle(Math.PI / 2 * 3, Math.PI / 2);

    const rightAngle2 = makeA();
    rightAngle2.setPosition(this.layout.rect.points[1]);
    rightAngle2.updateAngle(0, Math.PI / 2);

    const rightAngle3 = makeA();
    rightAngle3.setPosition(this.layout.rect.points[2]);
    rightAngle3.updateAngle(Math.PI / 2 * 1, Math.PI / 2);

    const rightAngle4 = makeA();
    rightAngle4.setPosition(this.layout.rect.points[3]);
    rightAngle4.updateAngle(Math.PI / 2 * 2, Math.PI / 2);

    this.add('rightAngle1', rightAngle1);
    this.add('rightAngle2', rightAngle2);
    this.add('rightAngle3', rightAngle3);
    this.add('rightAngle4', rightAngle4);
  }

  addAngles() {
    const makeA = (position: Point, start: number, size: number, label: string | Array<string>, radius: number) => {
      const angle = makeAngle(
        this.diagram, radius,
        this.layout.lineWidth, this.layout.angleSides, this.layout.colors.angles,
      );
      angle.addLabel(label, this.layout.angleLabelRadiusOffset + radius);
      angle.setPosition(position);
      angle.updateAngle(start, size);
      return angle;
    };
    const { points } = this.layout.rect;
    const width = points[2].x - points[0].x;
    const height = points[0].y - points[1].y;
    const angleA = makeA(
      points[0], Math.PI / 2 * 3,
      Math.atan(width / height),
      'a', this.layout.angleRadius,
    );
    const angleB = makeA(
      points[2], Math.PI - Math.atan(height / width),
      Math.atan(height / width),
      ['b', 'a - 90º'], this.layout.angleRadius * 1.1,
    );
    const angleC = makeA(
      points[0], Math.PI * 2 - Math.atan(height / width),
      Math.atan(height / width),
      ['d', '90º - a'], this.layout.angleRadius * 1.1,
    );
    const angleD = makeA(
      points[2], Math.PI / 2,
      Math.atan(width / height),
      ['c', 'a'], this.layout.angleRadius,
    );
    this.add('angleA', angleA);
    this.add('angleB', angleB);
    this.add('angleC', angleC);
    this.add('angleD', angleD);
  }

  pulseSideLabels() {
    const scale = 1.8;
    this._lineA._label.pulseScaleNow(1, scale);
    this._lineB._label.pulseScaleNow(1, scale);
    this._lineC._label.pulseScaleNow(1, scale);
    this._lineD._label.pulseScaleNow(1, scale);
    this.diagram.animateNextFrame();
  }

  pulseRightAngles() {
    const scale = 1.5;
    this._rightAngle1.pulseScaleNow(1, scale);
    this._rightAngle2.pulseScaleNow(1, scale);
    this._rightAngle3.pulseScaleNow(1, scale);
    this._rightAngle4.pulseScaleNow(1, scale);
    this.diagram.animateNextFrame();
  }

  addEqn() {
    const eqn = makeAnglesEquation(this.diagram, this.layout);
    // this.add('rectEqn', eqn.collection);
    // this.add('rectEqnDescription', eqn.descriptionElement);
    this.rectEqn = eqn;

    const nav = makeEquationNavigator(
      this.diagram, eqn, 0.07, new Point(0.9, 0),
      this.layout.colors.diagram.disabled,
      this.layout.colors.diagram.disabledDark,
    );
    nav.setPosition(this.layout.rectEqnPosition);
    this.add('nav', nav);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addRightAngles();
    this.addAngles();
    this.addRect();
    this.addEqn();
    this.hasTouchableElements = true;
  }

  resetColors() {
    this._lineA.setColor(this.layout.colors.lines);
    this._lineB.setColor(this.layout.colors.lines);
    this._lineC.setColor(this.layout.colors.lines);
    this._lineD.setColor(this.layout.colors.lines);
    this._angleA.setColor(this.layout.colors.angles);
    this._angleB.setColor(this.layout.colors.angles);
    this._angleC.setColor(this.layout.colors.angles);
    this._angleD.setColor(this.layout.colors.angles);
    this._rightAngle1.setColor(this.layout.colors.angles);
    this._rightAngle2.setColor(this.layout.colors.angles);
    this._rightAngle3.setColor(this.layout.colors.angles);
    this._rightAngle4.setColor(this.layout.colors.angles);
  }
}
