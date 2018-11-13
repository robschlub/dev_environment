// @flow
// import {
//   Point,
// } from '../../../../../js/diagram/tools/g2';
import Diagram from '../../../../../js/diagram/Diagram';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../../js/diagram/Element';
import { Equation } from '../../../../../js/diagram/DiagramElements/Equation/GLEquation';
// import * as html from '../../../../../js/tools/htmlGenerator';
// import makeEquationNavigator from '../../../../LessonsCommon/tools/equationNavigator';
// import type { TypeEquationNavigator } from '../../../../LessonsCommon/tools/equationNavigator';

export type TypeTriangleAreaEquationCollection = {
  _Area: DiagramElementPrimative;
  _rectangle: DiagramElementPrimative;
  _triangle: DiagramElementPrimative;
  _equals: DiagramElementPrimative;
  _A: DiagramElementPrimative;
  _B: DiagramElementPrimative;
  _mul: DiagramElementPrimative;
  __1: DiagramElementPrimative;
  __2: DiagramElementPrimative;
  _v: DiagramElementPrimative;
} & DiagramElementCollection;

export type TypeTriangleAreaEquation = {
  collection: TypeTriangleAreaEquationCollection;
} & Equation;

export function addTriRectEquation(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const { sides } = layout.polygons;
  const eqn = diagram.equation.makeEqn();
  const colHeight = layout.colors.height;
  const colBorder = layout.colors.border;
  const colText = layout.colors.diagram.text.base;
  // const colLine = layout.colors.line;
  eqn.createElements(
    {
      Area: 'Area',
      triangle: 'triangle',
      equals: ' = ',
      least: sides[0].toString(),
      medium: sides[1].toString(),
      most: sides[2].toString(),
      h: ['h', colHeight],
      b: ['b', colBorder],
      mul: ' \u00D7 ',
      mul_: ' \u00D7 ',
      _1: '1',
      _2: '2',
      v: diagram.equation.vinculum(colText),
    },
    colText,
  );

  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;

  eqn.addForm('0', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'least',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6), 'space',
    'h',
    'mul_',
    'b',
  ]);

  eqn.addForm('1', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'medium',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6), 'space',
    'h',
    'mul_',
    'b',
  ]);

  eqn.addForm('2', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'most',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6), 'space',
    'h',
    'mul_',
    'b',
  ]);

  eqn.collection.setPosition(layout.triangleAreaEquation);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, eqn.collection);
}

export function addTriRectEquation1(
  diagram: Diagram,
  layout: Object,
  addToCollection: DiagramElementCollection,
  name: string,
) {
  const { sides } = layout.polygons;
  const eqn = diagram.equation.makeEqn();
  const colHeight = layout.colors.height;
  const colBorder = layout.colors.border;
  const colText = layout.colors.diagram.text.base;
  // const colLine = layout.colors.line;
  eqn.createElements(
    {
      Area: 'Area',
      triangle: 'triangle',
      equals: ' = ',
      least: sides[0].toString(),
      medium: sides[1].toString(),
      most: sides[2].toString(),
      h: ['h', colHeight],
      b: ['b', colBorder],
      mul: ' \u00D7 ',
      mul_: ' \u00D7 ',
      _1: '1',
      _2: '2',
      v: diagram.equation.vinculum(colText),
    },
    colText,
  );

  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'baseline';
  eqn.formAlignment.scale = 1.0;

  eqn.addForm('0', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'least',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6),
    'h',
    'mul_',
    'b',
  ]);

  eqn.addForm('1', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'medium',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6),
    'h',
    'mul_',
    'b',
  ]);

  eqn.addForm('2', [
    eqn.sub('Area', 'triangle'),
    'equals',
    'most',
    'mul',
    eqn.sfrac('_1', '_2', 'v', 0.6),
    'h',
    'mul_',
    'b',
  ]);

  eqn.collection.setPosition(layout.triangleAreaEquation);
  eqn.setCurrentForm('0');
  // eslint-disable-next-line no-param-reassign
  addToCollection.eqns[name] = eqn;
  addToCollection.add(name, eqn.collection);
}
