// @flow
import {
  Point,
} from '../../../../../js/diagram/tools/g2';
import Diagram from '../../../../../js/diagram/Diagram';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../../js/diagram/Element';
import { Equation } from '../../../../../js/diagram/DiagramElements/Equation/GLEquation';
// import * as html from '../../../../../js/tools/htmlGenerator';

export type TypeRectquationCollection = {
  _a: DiagramElementPrimative;
  _b: DiagramElementPrimative;
  __90: DiagramElementPrimative;
  __180: DiagramElementPrimative;
  _plus1: DiagramElementPrimative;
  _plus2: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _m90l: DiagramElementPrimative;
  _m90r: DiagramElementPrimative;
  _ml: DiagramElementPrimative;
  _al: DiagramElementPrimative;
  _mr: DiagramElementPrimative;
  _ar: DiagramElementPrimative;
  _strike1: DiagramElementPrimative;
  _strike2: DiagramElementPrimative;
  _strike3: DiagramElementPrimative;
  _strike4: DiagramElementPrimative;
  _calc0: DiagramElementPrimative;
  _calc90: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeRectEquation = {
  collection: TypeRectquationCollection;
} & Equation;

export function makeRectEquation(diagram: Diagram, layout: Object) {
  const eqn = diagram.equation.makeEqn();
  const eqnDescription = diagram.equation.makeDescription('id__rectangles_equation_desctription');
  const strikeColor = layout.colors.diagram.disabledDark;

  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      _6: '6',
      _10: '10',
      _60: '60',
      _1: '1',
      _1_: '1',
      _2: '2',
      m: ['m', colUnit],
      m_: ['m', colUnit],
      mul: '  \u00D7  ',
      mul_: ' \u00D7 ',
      mul__: ' \u00D7 ',
      x: diagram.equation.xStrike(strikeColor),
      x_: diagram.equation.xStrike(strikeColor),
      equals: ' = ',
    },
    colText,
    eqnDescription,
    new Point(0.9, -0.052).add(layout.rectEqnPosition),
  );
  eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 1.0;
  eqn.collection.__1.asdf = true;
  eqn.addForm('0', [
    'Area',
    'equals',
    '_6', 'm', 'mul_', '_10', 'm_', '_60',
  ]);

  eqn.addForm('0a', [
    'Area',
    'equals',
    '_6', 'm', 'mul_', '_10', 'm_',
  ]);

  eqn.addForm('1', [
    'Area',
    'equals',
    '_6', 'mul', '_1', 'm', 'mul_', '_10', 'mul__', '_1_', 'm_',
  ], 'base', true, {
    m: [null, 'linear'],
    _1: [null, 'linear'],
    mul: [null, 'linear'],
  }, '1');

  eqn.addForm('2', [
    'Area',
    'equals',
    '_6', 'mul_', '_10', 'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], 'base', true, {
    m: [colUnit, 'curved', 'up', 0.7],
    _1: [null, 'curved', 'up', 0.7],
    mul: [null, 'curved', 'up', 0.7],
  }, '2');

  eqn.addForm('3', [
    'Area',
    'equals',
    eqn.annotation(
      eqn.strike(['_6', 'mul_', '_10'], 'x'),
      [eqn.ann('_60', 'center', 'top', 'center', 'bottom')],
    ),
    'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], 'base', true, {
    m: [null, 'linear'],
    _1: [null, 'linear'],
    mul: [null, 'linear'],
  }, '3');

  eqn.addForm('4', [
    'Area',
    'equals',
    '_60', 'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ]);

  eqn.addForm('5', [
    'Area',
    'equals',
    '_60',
    'mul__',
    eqn.strike('_1_', 'x'),
    'm_',
    'mul',
    eqn.strike('_1', 'x_'),
    'm',
  ]);

  eqn.addForm('6', [
    'Area',
    'equals',
    '_60', 'mul__',
    'm_', 'mul', 'm',
  ]);

  eqn.addForm('7', [
    'Area',
    'equals',
    '_60', 'mul__',
    eqn.strike('m_', 'x_'), 'mul', eqn.sup('m', '_2'),
  ]);

  eqn.addForm('8', [
    'Area',
    'equals',
    '_60',
    eqn.sup('m', '_2'),
  ]);

  const nextForm = () => {
    eqn.nextForm(2);
    diagram.animateNextFrame();
  };

  eqn.collection.onClick = nextForm.bind(this);
  eqn.collection.isTouchable = true;
  eqn.collection.touchInBoundingRect = true;
  eqn.collection.setPosition(layout.rectEqnPosition);
  eqn.setCurrentForm('0');
  return eqn;
}


export type TypeADEquationCollection = {
  _a: DiagramElementPrimative;
  _d: DiagramElementPrimative;
  __90: DiagramElementPrimative;
  _plus1: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _ml: DiagramElementPrimative;
  _al: DiagramElementPrimative;
  _mr: DiagramElementPrimative;
  _ar: DiagramElementPrimative;
  _strike1: DiagramElementPrimative;
  _strike2: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeADEquation = {
  collection: TypeABEquationCollection;
} & Equation;

export function makeADEquation(diagram: Diagram, layout: Object) {
  const eqn = diagram.equation.makeEqn();
  const eqnDescription = diagram.equation.makeDescription('id__rectangles_equation_desctription');
  const strikeColor = layout.colors.diagram.disabledDark;

  const colAngle = layout.colors.angles;
  const colText = layout.colors.diagram.text.base;
  eqn.createElements(
    {
      a: ['a', colAngle],
      d: ['d', colAngle],
      _90: '90º',
      plus1: '  + ',
      equals: ' = ',

      ml: ['- ', colText],
      al: ['a', colAngle],
      mr: [' - ', colText],
      ar: ['a', colAngle],

      strike1: diagram.equation.xStrike(strikeColor),
      strike2: diagram.equation.xStrike(strikeColor),
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
    'a', 'plus1', 'd',
    'equals',
    '_90',
  ]);

  eqn.addForm('1', [
    eqn.annotation(
      ['a', 'plus1', 'd'],
      [eqn.ann(['ml', 'al'], 'center', -0.4, 'center', 'top')],
    ),
    'equals',
    eqn.annotation(
      '_90',
      [eqn.ann(['mr', 'ar'], 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('2', [
    eqn.annotation(
      [eqn.strike('a', 'strike1'), 'plus1', 'd'],
      [eqn.ann(
        eqn.strike(['ml', 'al'], 'strike2'),
        'center', -0.4, 'center', 'top',
      )],
    ),
    'equals',
    eqn.annotation(
      '_90',
      [eqn.ann(['mr', 'ar'], 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('3', [
    'd',
    'equals',
    eqn.annotation(
      '_90',
      [eqn.ann(['mr', 'ar'], 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('4', [
    'd',
    'equals',
    '_90', 'mr', 'ar',
  ]);

  const nextForm = () => {
    eqn.nextForm(2);
    diagram.animateNextFrame();
  };

  eqn.collection.onClick = nextForm.bind(this);
  eqn.collection.isTouchable = true;
  eqn.collection.touchInBoundingRect = true;
  eqn.collection.setPosition(layout.rectEqnPosition);
  eqn.setCurrentForm('0');
  return eqn;
}

export type TypeBCEquationCollection = {
  _a: DiagramElementPrimative;
  _c: DiagramElementPrimative;
  _l90: DiagramElementPrimative;
  _r90: DiagramElementPrimative;
  _minus: DiagramElementPrimative;
  _plus: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _lm90: DiagramElementPrimative;
  _rm90: DiagramElementPrimative;
  _lcalc0: DiagramElementPrimative;
  _rcalc0: DiagramElementPrimative;
  _lplus: DiagramElementPrimative;
  _la: DiagramElementPrimative;
  _rplus: DiagramElementPrimative;
  _ra: DiagramElementPrimative;
  _strike1: DiagramElementPrimative;
  _strike2: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeBCEquation = {
  collection: TypeABEquationCollection;
} & Equation;

export function makeBCEquation(diagram: Diagram, layout: Object) {
  const eqn = diagram.equation.makeEqn();
  const eqnDescription = diagram.equation.makeDescription('id__rectangles_equation_desctription');
  const strikeColor = layout.colors.diagram.disabledDark;

  const colAngle = layout.colors.angles;
  const colText = layout.colors.diagram.text.base;
  eqn.createElements(
    {
      a: ['a', colAngle],
      c: ['c', colAngle],
      l90: ['90º', colAngle],
      r90: '90º',
      minus: [' - ', colAngle],
      plus: ' + ',
      equals: ' = ',

      lm90: '- 90º',
      rm90: '- 90º',

      lcalc0: '0º',
      rcalc0: '0º',

      lplus: ['+ ', colText],
      la: ['a', colAngle],
      rplus: [' + ', colText],
      ra: ['a', colAngle],

      strike1: diagram.equation.xStrike(strikeColor),
      strike2: diagram.equation.xStrike(strikeColor),
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
    'l90', 'minus', 'a', 'plus', 'c',
    'equals',
    'r90',
  ]);

  eqn.addForm('1', [
    eqn.annotation(
      ['l90', 'minus', 'a', 'plus', 'c'],
      [eqn.ann('lm90', 'center', -0.4, 'center', 'top')],
    ),
    'equals',
    eqn.annotation(
      'r90',
      [eqn.ann('rm90', 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('2', [
    eqn.annotation(
      [eqn.annotation(
        eqn.strike('l90', 'strike1'),
        [eqn.ann(
          'lcalc0',
          'right', 1.4, 'left', 'bottom',
        )],
      ), 'minus', 'a', 'plus', 'c'],
      [eqn.ann(
        eqn.strike('lm90', 'strike2'),
        'center', -0.4, 'center', 'top',
      )],
    ),
    'equals',
    eqn.annotation(
      'r90',
      [eqn.ann('rm90', 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('3', [
    'minus', 'a', 'plus', 'c',
    'equals',
    eqn.annotation(
      'r90',
      [eqn.ann('rm90', 'center', -0.4, 'center', 'top')],
    ),
  ]);

  eqn.addForm('4', [
    'minus', 'a', 'plus', 'c',
    'equals',
    eqn.annotation(
      eqn.annotation(
        eqn.strike('r90', 'strike1'),
        [eqn.ann(
          'rcalc0',
          'right', 1.4, 'left', 'bottom',
        )],
      ),
      [eqn.ann(
        eqn.strike('rm90', 'strike2'),
        'center', -0.4, 'center', 'top',
      )],
    ),
  ]);

  eqn.addForm('5', [
    'minus', 'a', 'plus', 'c',
    'equals',
    'rcalc0',
  ]);

  eqn.addForm('6', [
    eqn.annotation(
      ['minus', 'a', 'plus', 'c'],
      [
        eqn.ann(
          ['lplus', 'la'],
          'center', -0.4, 'center', 'top',
        ),
      ],
    ),
    'equals',
    eqn.annotation(
      'rcalc0',
      [
        eqn.ann(
          ['rplus', 'ra'],
          'center', -0.4, 'center', 'top',
        ),
      ],
    ),
  ]);

  eqn.addForm('7', [
    eqn.annotation(
      [eqn.strike(['minus', 'a'], 'strike1'), 'plus', 'c'],
      [
        eqn.ann(
          eqn.strike(['lplus', 'la'], 'strike2'),
          'center', -0.4, 'center', 'top',
        ),
      ],
    ),
    'equals',
    eqn.annotation(
      'rcalc0',
      [
        eqn.ann(
          ['rplus', 'ra'],
          'center', -0.4, 'center', 'top',
        ),
      ],
    ),
  ]);

  eqn.addForm('8', [
    'c',
    'equals',
    eqn.annotation(
      'rcalc0',
      [
        eqn.ann(
          ['rplus', 'ra'],
          'center', -0.4, 'center', 'top',
        ),
      ],
    ),
  ]);

  eqn.addForm('9', [
    'c',
    'equals',
    'rcalc0', 'rplus', 'ra',
  ]);

  eqn.addForm('10', [
    'c',
    'equals',
    'ra',
  ]);

  eqn.addForm('11', [
    'c',
    'equals',
    'ra',
  ]);

  const nextForm = () => {
    eqn.nextForm(2);
    diagram.animateNextFrame();
  };

  eqn.collection.onClick = nextForm.bind(this);
  eqn.collection.isTouchable = true;
  eqn.collection.touchInBoundingRect = true;
  eqn.collection.setPosition(layout.rectEqnPosition);
  eqn.setCurrentForm('0');
  return eqn;
}
