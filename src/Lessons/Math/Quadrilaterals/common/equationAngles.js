// @flow
import {
  Point,
} from '../../../../js/diagram/tools/g2';
import Diagram from '../../../../js/diagram/Diagram';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import { Equation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';
import * as html from '../../../../js/tools/htmlGenerator';

export type TypeAnglesEquationCollection = {
  _a: DiagramElementPrimative;
  _b: DiagramElementPrimative;
  __90: DiagramElementPrimative;
  __180: DiagramElementPrimative;
  _plus1: DiagramElementPrimative;
  _plus2: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _m90l: DiagramElementPrimative;
  _m90r: DiagramElementPrimative;
  _mal: DiagramElementPrimative;
  _mar: DiagramElementPrimative;
  _strike1: DiagramElementPrimative;
  _strike2: DiagramElementPrimative;
  _strike3: DiagramElementPrimative;
  _strike4: DiagramElementPrimative;
  _calc0: DiagramElementPrimative;
  _calc90: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeAnglesEquation = {
  collection: TypeAnglesEquationCollection;
} & Equation;

export default function makeAnglesEquation(diagram: Diagram, layout: Object) {
  const eqn = diagram.equation.makeEqn();
  const eqnDescription = diagram.equation.makeDescription('id__rectangles_equation_desctription');
  const strikeColor = layout.colors.diagram.warning;

  const colAngle = layout.colors.angles;
  const colText = layout.colors.diagram.text.base;
  const colDis = layout.colors.diagram.disabled;
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
      mar: [' - a', colAngle],

      strike1: diagram.equation.strike(strikeColor),
      strike2: diagram.equation.strike(strikeColor),
      strike3: diagram.equation.strike(strikeColor),
      strike4: diagram.equation.strike(strikeColor),

      calc0: ['0', colDis],
      calc90: '90º',
    },
    layout.colors.diagram.text.base,
    eqnDescription,
    new Point(0.9, -0.052).add(layout.rectEqnPosition),
  );
  eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    'a', 'plus1', 'b', 'plus2', '_90',
    'equals',
    '_180',
  ]);

  eqn.addForm('1', [
    eqn.annotation(
      ['a', 'plus1', 'b', 'plus2', '_90'],
      [eqn.ann('m90l', 'center', -0.4, 'center', 'top')],
    ),
    'equals',
    eqn.annotation(
      '_180',
      [eqn.ann('m90r', 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('2', [
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
  ]);

  eqn.addForm('3', [
    'a', 'plus1', 'b',
    'equals',
    'calc90',
  ]);

  eqn.addForm('4', [
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

  eqn.addForm('5', [
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

  eqn.addForm('6', [
    'b',
    'equals',
    'calc90',
    'mar',
  ]);

  eqn.setFormSeries(['0', '1', '2', '3', '4', '5', '6']);

  const nextForm = () => {
    eqn.nextForm();
    diagram.animateNextFrame();
  };
  eqn.collection.onClick = nextForm.bind(this);
  eqn.collection.isTouchable = true;
  eqn.collection.touchInBoundingRect = true;
  eqn.collection.setPosition(layout.rectEqnPosition);
  // eqn.description = eqnDescription;
  return eqn;
  // this.add('eqn', eqn.collection);
  // this.add('eqnDescription', eqnDescription);
  // this._eqn.eqn = eqn;
}
