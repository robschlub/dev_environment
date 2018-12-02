// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
// import Diagram from '../Diagram';
import {
  Point, Rect,
} from '../tools/g2';
import {
  round,
} from '../tools/mathtools';
// import webgl from '../../__mocks__/WebGLInstanceMock';
// import DrawContext2D from '../../__mocks__/DrawContext2DMock';
// import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';
import * as tools from '../../tools/tools';
import makeDiagram from '../../__mocks__/makeDiagram';

tools.isTouchDevice = jest.fn();

jest.mock('../Gesture');
jest.mock('../webgl/webgl');
jest.mock('../DrawContext2D');
// jest.mock('../../tools/tools');

describe('Diagram Equations From Object', () => {
  let diagram;

  beforeEach(() => {
    diagram = makeDiagram();
  });
  test('Diagram instantiation', () => {
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
  describe('Equation Creation', () => {
    test('Simple', () => {
      const color = [1, 0, 0, 1];
      const collection = diagram.shapes.collection();
      const eqn = diagram.equation.makeEqnFromOptions({
        name: 'testEqn',
        color,
        addToCollection: collection,
        elements: {
          a: 'a',
          b: 'b',
        },
        // forms: {
        //   '0': ['a', 'b'],
        // },
        // currentForm: '0',
        // formSeries: ['0'],
      });
      // expect(collection._testEqn).not.toBe(null);
      // expect(collection._a).not.toBe(null);
      // expect(collection._b).not.toBe(null);
      console.log(collection._testEqn)
      // expect(eqn.collection).toBe(collection._testEqn);
    });
  });
});
