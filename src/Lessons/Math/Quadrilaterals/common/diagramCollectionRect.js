// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
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

export default class RectCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _rect: DiagramElementPrimative;
  _line: TypeLine;
  _rightAngle1: TypeAngle;
  _rightAngle2: TypeAngle;
  _rightAngle3: TypeAngle;
  _rightAngle4: TypeAngle;

  addRect() {
    const rect = this.diagram.shapes.polyLine(
      this.layout.rect.points, true, this.layout.lineWidth,
      this.layout.colors.lines,
      'none', new Transform('rect').scale(1, 1).translate(0, 0),
    );

    rect.setPosition(this.layout.rect.position);
    
    this.add('rect', rect);
  }

  addLine() {
    const line = makeLine(
      this.diagram, 'end', 1, this.layout.lineWidth / 2,
      this.layout.colors.lines,
    );
    line.setEndPoints(this.layout.rect.points[0], this.layout.rect.points[2]);
    line.setPosition(this.layout.rect.position.add(this.layout.rect.points[0]));

    this.add('line', line);
  }

  addRightAngles() {
    const makeA = () => {
      const angle = makeAngle(
        this.diagram, this.layout.angleRadius,
        this.layout.lineWidth, this.layout.angleSides, this.layout.colors.angles,
        )
      angle.addLabel('', this.layout.angleLabelRadius);
      angle.autoRightAngle = true;
      return angle;
    };
    const rightAngle1 = makeA();
    rightAngle1.setPosition(this.layout.rect.points[0])
    rightAngle1.updateAngle(Math.PI / 2 * 3, Math.PI / 2);

    const rightAngle2 = makeA();
    rightAngle2.setPosition(this.layout.rect.points[1])
    rightAngle2.updateAngle(0, Math.PI / 2);

    const rightAngle3 = makeA();
    rightAngle3.setPosition(this.layout.rect.points[2])
    rightAngle3.updateAngle(Math.PI / 2 * 1, Math.PI / 2);

    const rightAngle4 = makeA();
    rightAngle4.setPosition(this.layout.rect.points[3])
    rightAngle4.updateAngle(Math.PI / 2 * 2, Math.PI / 2);

    this.add('rightAngle1', rightAngle1);
    this.add('rightAngle2', rightAngle2);
    this.add('rightAngle3', rightAngle3);
    this.add('rightAngle4', rightAngle4);
  }

  addEqn() {
    const eqn = this.diagram.equation.makeEqn();
    eqn.createElements(
      {
        a: 'a',
        a_1: 'a',
        b: 'b',
        b_1: 'b',
        test: 'test',
        n: 'n',
        v: this.diagram.equation.vinculum(),
        _90: '90º',
        _90_1: '90º',
        _90_2: '90º',
        _90_3: '90º',
        _180: '180º',
        _180_1: '180º',
        equals: ' = ',
        m: ' \u2212 ',
        m1: ' \u2212 ',
        p: ' + ',
        p1: ' + ',
        p2: ' + ',
        s: this.diagram.equation.strike(this.layout.colors.diagram.warning),
        s1: this.diagram.equation.strike(this.layout.colors.diagram.warning),
        s2: this.diagram.equation.strike(this.layout.colors.diagram.warning),
        s3: this.diagram.equation.strike(),
      },
      this.layout.colors.diagram.text.base,
    );

    eqn.formAlignment.fixTo = eqn.collection._equals;
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 1.0;

    eqn.addForm('1', ['a', 'p', 'b', 'p1', '_90', 'equals', '_180']);
    eqn.addForm('2', [eqn.strike('a', 's'), eqn.strike(['p', 'b'], 's1'), 'p1', '_90', 'equals', '_180']);
    eqn.addForm('3', [
      eqn.annotation(
        eqn.strike('a', 's', true),
        eqn.frac('test', 'n', 'v'),
        0.3, 1,
        'right', 'middle',
        0.5, true,
      ),
      '_180_1',
      eqn.strike(['p', 'b'], 's1', true),
      '_90_3', 'p1', '_90', 'equals', '_180',
    ]);
    eqn.addForm('4', ['m', '_90_1', 'p2', 'a', 'p', 'b', 'p1', '_90',
      'equals', '_180', 'm1', '_90_2']);
    eqn.addForm('5', ['a', 'p', 'b', 'equals', '_90_3']);
    eqn.setFormSeries(['1', '2', '3']);
    const nextForm = () => {
      eqn.nextForm();
      this.diagram.animateNextFrame();
    }
    eqn.collection.onClick = nextForm.bind(this);
    eqn.collection.isTouchable = true;
    eqn.collection._a.isTouchable = true;
    this.add('eqn', eqn.collection);
    this._eqn.eqn = eqn;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addRightAngles();
    this.addRect();
    this.addLine();
    this.addEqn();
    this.hasTouchableElements = true;
  }
}
