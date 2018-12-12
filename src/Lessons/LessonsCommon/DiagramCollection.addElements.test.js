// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
// import Diagram from '../Diagram';
import {
  Point, Rect,
} from '../../js/diagram/tools/g2';
import {
  round,
} from '../../js/diagram/tools/mathtools';
// import webgl from '../../__mocks__/WebGLInstanceMock';
// import DrawContext2D from '../../__mocks__/DrawContext2DMock';
// import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';
import * as tools from '../../js/tools/tools';
import makeDiagram from '../../js/__mocks__/makeDiagram';
import CommonDiagramCollection from './DiagramCollection';

tools.isTouchDevice = jest.fn();

jest.mock('../../js/diagram/Gesture');
jest.mock('../../js/diagram/webgl/webgl');
jest.mock('../../js/diagram/DrawContext2D');
// jest.mock('../../tools/tools');

describe('Diagram Equations From Object', () => {
  let diagram;
  let collection;
  // let color1;

  beforeEach(() => {
    diagram = makeDiagram();
    collection = new CommonDiagramCollection(diagram);
    // ways = {

    // }
  });
  test('Diagram instantiation', () => {
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
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
