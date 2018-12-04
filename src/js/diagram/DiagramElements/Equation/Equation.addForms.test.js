import {
  Point, // Rect,
} from '../../tools/g2';
// import {
//   round,
// } from '../../tools/mathtools';
import * as tools from '../../../tools/tools';
import makeDiagram from '../../../__mocks__/makeDiagram';
import { EquationNew } from './Equation';
import {
  DiagramFont,
} from '../../DrawingObjects/TextObject/TextObject';
import VertexHorizontalLine from '../../DrawingObjects/VertexObject/VertexHorizontalLine';

tools.isTouchDevice = jest.fn();

jest.mock('../../Gesture');
jest.mock('../../webgl/webgl');
jest.mock('../../DrawContext2D');

describe('Diagram Equations From Object', () => {
  let diagram;
  let eqn;
  let addForms;
  // let modColor1;
  // let modColor2;
  // let defaultColor;
  beforeEach(() => {
    diagram = makeDiagram();
    eqn = new EquationNew(diagram.shapes, {
      elements: {
        a: 'a',
        b: 'b',
        c: 'c',
      },
    });
    // modColor1 = [0.95, 0, 0, 1];
    // modColor2 = [0, 0.95, 0, 1];
    // defaultColor = [0.5, 0.5, 0.5, 1];
    addForms = {
      arraySingleForm: {
        '0': ['a', 'b', 'c'],
      },
    };
  });
  test('Equation instantiation', () => {
    expect(eqn).not.toBe(null);
  });
  test('Array Single Form', () => {
    eqn.addForms(addForms.arraySingleForm);
    console.log(eqn.eqn.forms);
  });
});
