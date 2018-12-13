// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
// import Diagram from '../Diagram';
import {
  Point, Rect, Transform,
} from '../tools/g2';
import {
  round,
} from '../tools/mathtools';
// import webgl from '../../__mocks__/WebGLInstanceMock';
// import DrawContext2D from '../../__mocks__/DrawContext2DMock';
// import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';
import * as tools from '../../tools/tools';
import makeDiagram from '../../__mocks__/makeDiagram';
// import CommonDiagramCollection from './DiagramCollection';

tools.isTouchDevice = jest.fn();

jest.mock('..//Gesture');
jest.mock('../webgl/webgl');
jest.mock('../DrawContext2D');
// jest.mock('../../tools/tools');

describe('Diagram Equations From Object', () => {
  let diagram;
  let ways;
  // let collection;
  // let color1;

  beforeEach(() => {
    diagram = makeDiagram();
    // collection = new CommonDiagramCollection(diagram);
    // ways = {
    // }
    ways = {
      simple: () => {
        diagram.addElements(diagram.elements, [
          // Full object definition
          {
            path: '',
            name: 'group1',
            method: 'shapes/collection',
            options: {
              transform: new Transform('group'),
            },
          },
          // 1. Don't need path if adding to root collection
          // 2. Method can be simplified if shortcut is defined in addElements
          {
            name: 'group2',
            method: 'collection',
            options: {
              transform: new Transform('group'),
            },
          },
          // Can use array form definition for simplicity
          ['group3', 'collection', { transform: new Transform('group') }],
          // Multiple option objects are allowed where later objects overwrite
          // earlier objects
          ['group4', 'collection', [
            { transform: new Transform('group1') },
            { transform: new Transform('group') },
          ]],
        ]);
      },
    };
  });
  test('Diagram instantiation', () => {
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
  test('Simple', () => {
    ways.simple();
    const { elements } = diagram;
    expect(elements).toHaveProperty('_group1');
    expect(elements).toHaveProperty('_group2');
    expect(elements).toHaveProperty('_group3');
    expect(elements).toHaveProperty('_group4');
    expect(elements._group4.transform.name).toBe('group');
  });
  // describe('Equation Creation', () => {
  //   test('Simple', () => {
  //     ways.simple();
  //     expect(collection).toHaveProperty('_eqn');
  //     expect(collection._eqn).toHaveProperty('_a');
  //     expect(collection._eqn).toHaveProperty('_b');
  //     expect(collection._eqn).toHaveProperty('_c');
  //     expect(collection._eqn).toHaveProperty('__2');
  //     expect(collection._eqn).toHaveProperty('_v');

  //     tools.cleanUIDs(collection._eqn);
  //     expect(round(collection._eqn._a.transform.mat)).toMatchSnapshot();
  //     expect(round(collection._eqn.__2.transform.mat)).toMatchSnapshot();
  //     expect(round(collection._eqn._c.transform.mat)).toMatchSnapshot();
  //     expect(round(collection._eqn._v.transform.mat)).toMatchSnapshot();
  //   });
  // });
});
