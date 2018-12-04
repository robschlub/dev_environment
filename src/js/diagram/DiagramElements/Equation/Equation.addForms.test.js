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
  let forms;
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
        v: { symbol: 'vinculum' },
      },
    });
    // modColor1 = [0.95, 0, 0, 1];
    // modColor2 = [0, 0.95, 0, 1];
    // defaultColor = [0.5, 0.5, 0.5, 1];
    addForms = {
      arraySingleForm: {
        '0': ['a', 'b', 'c'],
      },
      arrayTwoForms: {
        '0': ['a', 'b', 'c'],
        '1': ['b', 'a', 'c'],
      },
      frac: {
        '0': [{ frac: ['a', 'b', 'c'] }],
        '1': [
          {
            frac: {
              numerator: 'a',
              denominator: 'b',
              symbol: 'v',
            },
          },
        ],
      },
    };
    ({ forms } = eqn.eqn);
  });
  test('Equation instantiation', () => {
    expect(eqn).not.toBe(null);
  });
  test('Array Single Form', () => {
    eqn.addForms(addForms.arraySingleForm);
    expect(forms).toHaveProperty('0');
    expect(forms['0']).toHaveProperty('base');
    expect(forms['0'].base.content[0].content.drawingObject.text[0].text).toBe('a');
    expect(forms['0'].base.content[1].content.drawingObject.text[0].text).toBe('b');
    expect(forms['0'].base.content[2].content.drawingObject.text[0].text).toBe('c');
  });
  test('Array Two Forms', () => {
    eqn.addForms(addForms.arrayTwoForms);
    expect(forms).toHaveProperty('0');
    expect(forms).toHaveProperty('1');
    expect(forms['0']).toHaveProperty('base');
    expect(forms['1']).toHaveProperty('base');
    expect(forms['0'].base.content[0].content.drawingObject.text[0].text).toBe('a');
    expect(forms['1'].base.content[0].content.drawingObject.text[0].text).toBe('b');
  });
});
