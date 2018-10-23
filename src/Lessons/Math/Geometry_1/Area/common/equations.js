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
import makeEquationNavigator from '../../../../LessonsCommon/tools/equationNavigator';

export type TypeRectEquationCollection = {
  _Area: DiagramElementPrimative,
  __6: DiagramElementPrimative,
  __10: DiagramElementPrimative,
  __60: DiagramElementPrimative,
  __1: DiagramElementPrimative,
  __1_: DiagramElementPrimative,
  __2: DiagramElementPrimative,
  _m: DiagramElementPrimative,
  _m_: DiagramElementPrimative,
  _mul: DiagramElementPrimative,
  _mul_: DiagramElementPrimative,
  _mul__: DiagramElementPrimative,
  _x: {
    _s1: DiagramElementPrimative;
    _s2: DiagramElementPrimative;
  } & DiagramElementCollection,
  _x_: {
    _s1: DiagramElementPrimative;
    _s2: DiagramElementPrimative;
  } & DiagramElementCollection,
  _equals: DiagramElementPrimative,
} & DiagramElementCollection;

export type TypeRectEquation = {
  collection: TypeRectEquationCollection;
} & Equation;

export function addRectEqn(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  // const eqnDescription = diagram.equation
  //   .makeDescription('id__rectangles_equation_desctription');
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
      mul: ' \u00D7 ',
      mul_: ' \u00D7 ',
      mul__: ' \u00D7 ',
      x: diagram.equation.xStrike(strikeColor),
      x_: diagram.equation.xStrike(strikeColor),
      equals: ' = ',
    },
    colText,
    // eqnDescription,
    null,
    new Point(0.9, -0.052).add(layout.rectEqnPosition),
  );
  // eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
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
    m: [colUnit, 'curved', 'up', 0.7],
    _1: [null, 'curved', 'up', 0.7],
    mul: [null, 'curved', 'up', 0.7],
  }, '3');

  // Area = 60 x 1m x 1m
  eqn.addForm('4', [
    'Area',
    'equals',
    '_60', 'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], 'base', true, {
    m: [null, 'linear'],
    _1: [null, 'linear'],
    mul: [null, 'linear'],
  }, '4');

  // Area = 60 x X1m x X1m
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

  // Area = 60 x m x m
  eqn.addForm('6', [
    'Area',
    'equals',
    '_60', 'mul__',
    'm_', 'mul', 'm',
  ]);

  // Area = 60 x Xm x m^2
  eqn.addForm('7', [
    'Area',
    'equals',
    '_60', 'mul__',
    eqn.strike('m_', 'x_'), 'mul', eqn.sup('m', '_2'),
  ]);

  // Area = 60m^2
  eqn.addForm('8', [
    'Area',
    'equals',
    '_60',
    eqn.sup('m', '_2'),
  ]);

  eqn.collection.setPosition(layout.rectEqnPosition);
  eqn.setCurrentForm('0');
  // addToCollection.add(name, eqn.collection);
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  const nav = makeEquationNavigator(
    diagram, eqn, new Point(0, -0.5),
    'twoLine', 'arrows', 'center',
  );
  addToCollection.add(name, eqn.collection);
  return eqn;
}

export type TypeSimpleRectEquationCollection = {
  _Area: DiagramElementPrimative,
  __6: DiagramElementPrimative,
  __10: DiagramElementPrimative,
  __60: DiagramElementPrimative,
  _mul: DiagramElementPrimative,
  _equals: DiagramElementPrimative,
  _equals_: DiagramElementPrimative,
  _Squares: DiagramElementPrimative,
} & DiagramElementCollection;

export type TypeSimpleRectEquation = {
  collection: TypeSimpleRectEquationCollection;
} & Equation;


export function addSimpleRectEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  // const strikeColor = layout.colors.diagram.disabledDark;
  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      _6: '6',
      _10: '10',
      _60: '60',
      squares: [' squares', colUnit],
      mul: ' \u00D7 ',
      equals: ' = ',
      equals_: ' = ',
    },
    colText,
    null,
    new Point(0, 0).add(layout.rectSimpleEqnPosition),
  );
  // eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    'Area',
    'equals',
    '_6', 'mul', '_10',
    'equals_',
    '_60', 'squares',
  ]);

  eqn.collection.setPosition(layout.rectSimpleEqnPosition);
  eqn.setCurrentForm('0');

  addToCollection.add(name, eqn.collection);
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
}
