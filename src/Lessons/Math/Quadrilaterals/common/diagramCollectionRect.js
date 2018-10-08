// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
// import { AnnotationInformation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';
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

  addEqn() {
    const eqn = this.diagram.equation.makeEqn();
    const eqnDescription = this.diagram.equation.makeDescription();
    const strikeColor = this.layout.colors.diagram.warning;

    const colAngle = this.layout.colors.angles;
    const colText = this.layout.colors.diagram.text.base;
    const colDis = this.layout.colors.diagram.disabled;
    eqn.createElements(
      {
        a: ['a', colAngle],
        b: ['b', colAngle],
        _90: ['90º', colText],
        _180: '180º',
        plus1: '  + ',
        plus2: '  + ',
        equals: ' = ',

        m90l: ['- 90º', colText],
        m90r: ['- 90º', colText],
        mal: ['- a', colAngle],
        mar: ['  - a', colAngle],

        strike1: this.diagram.equation.strike(strikeColor),
        strike2: this.diagram.equation.strike(strikeColor),
        strike3: this.diagram.equation.strike(strikeColor),
        strike4: this.diagram.equation.strike(strikeColor),

        calc0: ['0', colDis],
        calc90: '90º',
      },
      this.layout.colors.diagram.text.base,
      eqnDescription,
      new Point(0.7, 0),
    );
    eqn.formAlignment.fixTo = eqn.collection._equals;
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 1.0;

    eqn.addForm('1', [
      'a', 'plus1', 'b', 'plus2', '_90',
      'equals',
      '_180',
    ], 'base', 'All angles in a triangle add to 180º.');

    eqn.addForm('2', [
      eqn.annotation(
        ['a', 'plus1', 'b', 'plus2', '_90'],
        [eqn.ann('m90l', 'center', -0.4, 'center', 'top')],
      ),
      'equals',
      eqn.annotation(
        '_180',
        [eqn.ann('m90r', 'center', -0.4, 'center', 'top')],
      ),
    ], 'base', '|Subtract| 90º from both sides of the equation.');

    eqn.addForm('3', [
      eqn.annotation(
        ['a', 'plus1', 'b', 'plus2', eqn.strike('_90', 'strike1')],
        [
          eqn.ann(
            eqn.strike('m90l', 'strike3'),
            'center', -0.4, 'center', 'top',
          ),
          eqn.ann(
            'calc0',
            'right', 1.4, 'left', 'bottom',
          ),
        ],
      ),
      'equals',
      eqn.annotation(
        eqn.strike('_180', 'strike2'),
        [
          eqn.ann(
            eqn.strike('m90r', 'strike4'),
            'center', -0.4, 'center', 'top',
          ),
          eqn.ann(
            'calc90',
            'right', 1.4, 'left', 'bottom',
          ),
        ],
      ),
    ], 'base', 'Peform subtraction');

    eqn.addForm('4', [
      'a', 'plus1', 'b',
      'equals',
      'calc90',
    ]);

    eqn.addForm('5', [
      eqn.annotation(
        ['a', 'plus1', 'b'],
        [eqn.ann('mal', 'center', -0.4, 'center', 'top')],
      ),
      'equals',
      eqn.annotation(
        'calc90',
        [eqn.ann('mar', 'center', -0.4, 'center', 'top')],
      ),
    ]);

    eqn.addForm('6', [
      eqn.annotation(
        [eqn.strike('a', 'strike1'), 'plus1', 'b'],
        [eqn.ann(
          eqn.strike('mal', 'strike2'),
          'center', -0.4, 'center', 'top',
        )],
      ),
      'equals',
      eqn.annotation(
        'calc90',
        [eqn.ann('mar', 'center', -0.4, 'center', 'top')],
      ),
    ]);

    eqn.addForm('7', [
      'b',
      'equals',
      'calc90',
      'mar',
    ]);

    eqn.setFormSeries(['1', '2', '3', '4', '5', '6', '7']);

    // const description = this.diagram.shapes.htmlElement(
    //   document.createElement('div'),
    //   'id__rectangles_equation_desctription',
    //   '',
    //   new Point(1, 0), 'middle', 'left',
    // );
    // description.vertices.element.innerHTML = eqn.getForm('1').description;
    const nextForm = () => {
      eqn.nextForm();
      // description.vertices.element.innerHTML = eqn.currentForm.base.description;
      this.diagram.animateNextFrame();
    };
    eqn.collection.onClick = nextForm.bind(this);
    eqn.collection.isTouchable = true;
    eqn.collection.touchInBoundingRect = true;
    this.add('eqn', eqn.collection);
    this.add('eqnDescription', eqnDescription);
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
