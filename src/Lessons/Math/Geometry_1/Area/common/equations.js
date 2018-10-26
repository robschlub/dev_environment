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
import type { TypeEquationNavigator } from '../../../../LessonsCommon/tools/equationNavigator';


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
  _squares: DiagramElementPrimative,
  _squares_: DiagramElementPrimative,
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

export type TypeRectEquationNav = {
  eqn: TypeRectEquation;
} & TypeEquationNavigator;

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
      // squares: [' squares ', colUnit],
      // rows: [' rows ', colUnit],
    },
    colText,
    // eqnDescription,
    // null,
    // new Point(0.9, -0.052).add(layout.rectEqnPosition),
  );
  eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
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
  ], {
    elementMods: {
      m: [null, 'linear'],
      _1: [null, 'linear'],
      mul: [null, 'linear'],
    },
  });

  eqn.addForm('2', [
    'Area',
    'equals',
    '_6', 'mul_', '_10', 'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], {
    elementMods: {
      m: [colUnit, 'curved', 'up', 0.7],
      _1: { style: 'curved', direction: 'up', mag: 0.7 },
      mul: { style: 'curved', direction: 'up', mag: 0.7 },
    },
  });

  eqn.addForm('3', [
    'Area',
    'equals',
    eqn.annotation(
      eqn.strike(['_6', 'mul_', '_10'], 'x'),
      [eqn.ann('_60', 'center', 'top', 'center', 'bottom')],
    ),
    'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], {
    elementMods: {
      m: [colUnit, 'curved', 'up', 0.7],
      _1: [null, 'curved', 'up', 0.7],
      mul: [null, 'curved', 'up', 0.7],
    },
  });

  // Area = 60 x 1m x 1m
  eqn.addForm('4', [
    'Area',
    'equals',
    '_60', 'mul__', '_1_', 'm_', 'mul', '_1', 'm',
  ], {
    elementMods: {
      m: [null, 'linear'],
      _1: [null, 'linear'],
      mul: [null, 'linear'],
    },
  });

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
    diagram, eqn, layout.rectEqnNavPosition,
    'twoLine', 'arrows', 'center',
  );
  addToCollection.add(name, nav);
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
  eqn.formAlignment.vAlign = 'baseline';
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


export type TypeNumSquaresEquationCollection = {
  _Area: DiagramElementPrimative,
  __6: DiagramElementPrimative,
  __10: DiagramElementPrimative,
  __60: DiagramElementPrimative,
  _mul: DiagramElementPrimative,
  _equals: DiagramElementPrimative,
  _equals_: DiagramElementPrimative,
  _Squares: DiagramElementPrimative,
} & DiagramElementCollection;

export type TypeNumSquaresEquation = {
  collection: TypeNumSquaresEquationCollection;
} & Equation;

export type TypeNumSquaresEquationNav = {
  eqn: TypeRectEquation;
} & TypeEquationNavigator;

export function addNumSquaresRectEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  // const strikeColor = layout.colors.diagram.disabledDark;
  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  const colLine = layout.colors.line;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      equals: ' = ',
      numSquares: 'num squares',
      numSquares_: 'num squares',
      side: ' side ',
      side_: ' side ',
      length: 'length ',
      length_: 'length ',
      Width: ['Width', colLine],
      Height: ['Height', colLine],
      A: ['A', colLine],
      B: ['B', colLine],
      mul: '  \u00D7  ',
    },
    colText,
  );
  // eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    'Area',
    'equals',
    'numSquares', 'side', 'A',
    'mul',
    'numSquares_', 'side_', 'B',
  ]);

  eqn.addForm('1', [
    'Area',
    'equals',
    'length', 'A',
    'mul',
    'length_', 'B',
  ]);

  eqn.addForm('2', [
    'Area',
    'equals',
    'A',
    'mul',
    'B',
  ]);

  eqn.addForm('3', [
    'Area',
    'equals',
    'Width',
    'mul',
    'Height',
  ]);

  eqn.collection.setPosition(layout.rectNumSquaresEqnPosition);
  eqn.setCurrentForm('0');

  const nav = makeEquationNavigator(
    diagram, eqn, layout.rectEqnNavPosition,
    'equationOnly', '', 'center',
  );
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, nav);
}


export type TypeSimpleUnitsEquationCollection = {
  _Area: DiagramElementPrimative,
  __60: DiagramElementPrimative,
  _equals: DiagramElementPrimative,
  _m: DiagramElementPrimative,
  __2: DiagramElementPrimative,
} & DiagramElementCollection;

export type TypeSimpleUnitsEquation = {
  collection: TypeSimpleUnitsEquationCollection;
} & Equation;


export function addSimpleUnitsRectEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      equals: ' = ',
      _60: '60',
      _1: '1',
      _1_: '1',
      _2: '2',
      m: ['m', colUnit],
    },
    colText,
  );
  // eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    'Area',
    'equals',
    '_60', eqn.sup('m', '_2'),
  ]);

  eqn.collection.setPosition(layout.rectNumSquaresEqnPosition);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, eqn.collection);
}

export type TypeSquareEquationCollection = {
  _Area: DiagramElementPrimative,
  __60: DiagramElementPrimative,
  _equals: DiagramElementPrimative,
  _A: DiagramElementPrimative,
  _A_: DiagramElementPrimative,
  _A__: DiagramElementPrimative,
  __2: DiagramElementPrimative,
  _mul: DiagramElementPrimative,
} & DiagramElementCollection;

export type TypeSquareEquation = {
  collection: TypeSquareEquationCollection;
} & Equation;

export function addSquareEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  const colLine = layout.colors.line;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      equals: ' = ',
      A: ['A', colLine],
      A_: ['A', colLine],
      A__: ['A', colLine],
      _2: '2',
      mul: ' \u00D7 ',
      equals_: ' = ',
    },
    colText,
  );
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    'Area',
    'equals',
    'A', 'mul', 'A_',
    'equals_',
    eqn.sup('A__', '_2'),
  ]);

  eqn.collection.setPosition(layout.rectSquareEqnPosition);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, eqn.collection);
}

export function addTriRectEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  const colLine = layout.colors.line;
  eqn.createElements(
    {
      Area: ['Area', colUnit],
      rectangle: 'rectangle',
      triangle: 'triangle',
      equals: ' = ',
      A: ['A', colLine],
      B: ['B', colLine],
      mul: ' \u00D7 ',
      _1: '1',
      _2: '2',
      space1: ' ',
      v: diagram.equation.vinculum(colText),
    },
    colText,
  );
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;
  eqn.addForm('0', [
    eqn.sub('Area', 'rectangle'),
    'equals',
    'A', 'mul', 'B',
  ]);

  eqn.addForm('1', [
    eqn.sub('Area', 'triangle'),
    'equals',
    eqn.sfrac('_1', '_2', 'v', 0.6), 'space1', 'A', 'mul', 'B',
  ]);

  eqn.collection.setPosition(layout.rectSquareEqnPosition);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, eqn.collection);
}

export function addTri2AreaEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const eqn = diagram.equation.makeEqn();
  // const colUnit = layout.colors.unit;
  const colText = layout.colors.diagram.text.base;
  const colLine = layout.colors.line;
  const colCon = layout.colors.construction;
  const colCon1 = layout.colors.construction1;
  const strikeColor = layout.colors.diagram.disabledDark;
  eqn.createElements(
    {
      Area: ['Area', colLine],
      triangle: ['triangle', colLine],
      Area_: ['Area', colCon, null, null, null, null, 'italic'],
      Area__: ['Area', colCon1],
      AB: ['triangle AB', colCon],
      _1: ['1', colCon],
      _1_: ['1', colCon1],
      _1__: '1',
      AC: ['triangle AC', colCon1],
      _2: ['2', colCon],
      _2_: ['2', colCon1],
      _2__: '2',
      equals: ' = ',
      mul: ' \u00D7 ',
      plus: '  \u002B  ',
      A: [' A', colCon],
      A_: [' A', colCon1],
      A__: [' A', colText],
      B: ['B', colCon],
      D: ['D', colCon1],
      x: diagram.equation.xStrike(strikeColor),
      x_: diagram.equation.xStrike(strikeColor),
      v: diagram.equation.vinculum(colCon),
      v_: diagram.equation.vinculum(colCon1),
      v__: diagram.equation.vinculum(colText),
      bl: diagram.equation.bracket('left', 1, colText),
      br: diagram.equation.bracket('right', 1, colText),
      bt: diagram.equation.brace('top', 1.5, strikeColor),
      bt_: diagram.equation.brace('top', 1.5, strikeColor),
      bt__: diagram.equation.brace('top', 1, strikeColor),
      base: 'base',
      height: ' height',
    },
    colText,
  );
  eqn.formAlignment.fixTo = eqn.collection._equals;
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;
  const fracSize = 0.5;

  const half = eqn.sfrac('_1', '_2', 'v', fracSize);
  const half1 = eqn.sfrac('_1_', '_2_', 'v_', fracSize);
  const half2 = eqn.sfrac('_1__', '_2__', 'v__', fracSize);
  const areaAB = eqn.phrase([half, 'A', 'space', 'B']);
  const areaAD = eqn.phrase([half1, 'A_', 'space', 'D']);

  eqn.addForm('0', [
    eqn.sub('Area', 'triangle'),
    'equals',
    eqn.sub('Area_', 'AB'),
    'plus',
    eqn.sub('Area__', 'AC'),
  ]);

  eqn.addForm('1', [
    eqn.sub('Area', 'triangle'),
    'equals',
    eqn.topComment(
      eqn.sub('Area_', 'AB'),
      areaAB,
      'bt',
    ),
    'plus',
    eqn.topComment(
      eqn.sub('Area__', 'AC'),
      areaAD,
      'bt_',
    ),
  ]);

  eqn.addForm('2', [
    eqn.sub('Area', 'triangle'),
    'equals', 'space', 'space', 'space',
    areaAB,
    'plus',
    areaAD,
  ], {
    animationTime: { fromPrev: null, fromNext: null },
  });

  eqn.addForm('3', [
    eqn.sub('Area', 'triangle'),
    'equals',
    eqn.brac([
      areaAB,
      'plus',
      half1, 'A_', 'space', 'D',
    ], 'bl', 'br'),
  ], {
    animationTime: { fromPrev: null, fromNext: null },
  });

  eqn.addForm('4', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2, 'A__', 'mul',
    eqn.brac([
      eqn.strike([half, 'A'], 'x'), 'space', 'B',
      'plus',
      eqn.strike([half1, 'A_'], 'x_'), 'space', 'D',
    ], 'bl', 'br'),
  ]);

  eqn.addForm('5', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2, 'A__', 'mul',
    eqn.brac([
      'B',
      'plus',
      'D',
    ], 'bl', 'br'),
  ]);

  eqn.addForm('6', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2, 'A__', 'mul',
    eqn.topComment(
      eqn.brac([
        'B',
        'plus',
        'D',
      ], 'bl', 'br'),
      'base', 'bt',
    ),
  ]);

  eqn.addForm('7', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2, 'A__', 'mul',
    'base',
  ]);

  eqn.addForm('8', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2,
    'space', 'space',
    eqn.topComment(['A__', 'space', 'space', 'space'], 'height', 'bt__'),
    'mul',
    'base',
  ]);

  eqn.addForm('9', [
    eqn.sub('Area', 'triangle'),
    'equals',
    half2,
    'height',
    'mul',
    'base',
  ]);

  // eqn.addForm('4', [
  //   eqn.sub('Area', 'triangle'),
  //   'equals',
  //   half2, 'A__',
  //   'space',
  //   eqn.brac(['space', 'B', 'plus', 'D', 'space'], 'bl', 'br'),
  // ]);

  // eqn.addForm('5', [
  //   eqn.sub('Area', 'triangle'),
  //   'equals',
  //   eqn.sfrac('_1__', '_2__', 'v__', fracSize), 'A__',
  //   eqn.strike(eqn.brac(['B', 'plus', 'D'], 'lb', 'rb'), 'x'),
  // ]);

  // eqn.addForm('6', [
  //   eqn.sub('Area', 'triangle'),
  //   'equals',
  //   eqn.sfrac('_1__', '_2__', 'v__', fracSize),
  //   'A__',
  //   'base',
  // ]);

  // eqn.addForm('7', [
  //   eqn.sub('Area', 'triangle'),
  //   'equals',
  //   eqn.sfrac('_1__', '_2__', 'v__', fracSize),
  //   'height',
  //   'base',
  // ]);

  eqn.collection.setPosition(layout.tri2AreaEqnPosition);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  // addToCollection.add(name, eqn.collection);
  const nav = makeEquationNavigator(
    diagram, eqn, layout.tri2AreaEqnNavPosition,
    'equationOnly', 'arrows', 'center',
  );
  addToCollection.add(name, nav);
}
