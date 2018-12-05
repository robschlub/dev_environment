import {
  Point, // Rect,
} from '../../tools/g2';
// import {
//   round,
// } from '../../tools/mathtools';
import * as tools from '../../../tools/tools';
import makeDiagram from '../../../__mocks__/makeDiagram';
import { EquationNew } from './Equation';
import Fraction from './Elements/Fraction';
// import {
//   DiagramFont,
// } from '../../DrawingObjects/TextObject/TextObject';
// import VertexHorizontalLine from '../../DrawingObjects/VertexObject/VertexHorizontalLine';

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
        d: 'd',
        e: 'e',
        f: 'f',
        v: { symbol: 'vinculum' },
        v1: { symbol: 'vinculum' },
        v2: { symbol: 'vinculum' },
      },
    });
    // modColor1 = [0.95, 0, 0, 1];
    // modColor2 = [0, 0.95, 0, 1];
    // defaultColor = [0.5, 0.5, 0.5, 1];
    addForms = {
      textOnly: {
        '0': 'a',
      },
      arraySingleForm: {
        '0': ['a', 'b', 'c'],
      },
      arrayTwoForms: {
        '0': ['a', 'b', 'c'],
        '1': ['b', 'a', 'c'],
      },
      nestedArrays: {
        '0': ['a', ['b', 'c']],
      },
      frac: {
        '0': [{ frac: ['a', 'b', 'v'] }],
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
      fracNotInArray: {
        '0': {
            frac: {
              numerator: 'a',
              denominator: 'b',
              symbol: 'v',
            },
          },
        },
      },
      multiFrac: {
        '0': [
          { frac: ['a', 'b', 'v'] },
          'c',
          { frac: ['d', 'e', 'v1'] },
        ],
      },
      nestedFrac: {
        '0': [
          {
            frac: [
              { frac: ['d', 'e', 'v1'] },
              'b',
              'v',
            ],
          },
        ],
      },
    };
    ({ forms } = eqn.eqn);
  });
  test('Equation instantiation', () => {
    expect(eqn).not.toBe(null);
  });
  test('Text only', () => {
    eqn.addForms(addForms.textOnly);
    const { content } = forms['0'].base.content[0];
    expect(content[0].content.drawingObject.text[0].text).toBe('a');
  });
  test('Array Single Form', () => {
    eqn.addForms(addForms.arraySingleForm);
    expect(forms).toHaveProperty('0');
    expect(forms['0']).toHaveProperty('base');
    const { content } = forms['0'].base.content[0];
    expect(content[0].content.drawingObject.text[0].text).toBe('a');
    expect(content[1].content.drawingObject.text[0].text).toBe('b');
    expect(content[2].content.drawingObject.text[0].text).toBe('c');
  });
  test('Array Two Forms', () => {
    eqn.addForms(addForms.arrayTwoForms);
    expect(forms).toHaveProperty('0');
    expect(forms).toHaveProperty('1');
    expect(forms['0']).toHaveProperty('base');
    expect(forms['1']).toHaveProperty('base');
    expect(forms['0'].base.content[0].content[0].content).toBe(eqn._a);
    expect(forms['1'].base.content[0].content[0].content).toBe(eqn._b);
  });
  test('Nested Arrays', () => {
    eqn.addForms(addForms.nestedArrays);
    expect(forms['0'].base.content[0].content[0].content).toBe(eqn._a);
    expect(forms['0'].base.content[0].content[1].content).toBe(eqn._b);
    expect(forms['0'].base.content[0].content[2].content).toBe(eqn._c);
  });
  test('frac', () => {
    eqn.addForms(addForms.frac);
    const content0 = forms['0'].base.content[0].content;
    // console.log(content0)
    expect(content0[0]).toBeInstanceOf(Fraction);
    expect(content0[0].numerator.content[0].content).toBe(eqn._a);
    expect(content0[0].denominator.content[0].content).toBe(eqn._b);
    expect(content0[0].vinculum).toBe(eqn._v);
    const content1 = forms['1'].base.content[0].content;
    expect(content1).toEqual(content0);
  });
  test('Multi Frac', () => {
    eqn.addForms(addForms.multiFrac);
    const { content } = forms['0'].base.content[0];
    expect(content[0]).toBeInstanceOf(Fraction);
    expect(content[0].numerator.content[0].content).toBe(eqn._a);
    expect(content[0].denominator.content[0].content).toBe(eqn._b);
    expect(content[0].vinculum).toBe(eqn._v);
    expect(content[1].content).toBe(eqn._c);
    expect(content[2]).toBeInstanceOf(Fraction);
    expect(content[2].numerator.content[0].content).toBe(eqn._d);
    expect(content[2].denominator.content[0].content).toBe(eqn._e);
    expect(content[2].vinculum).toBe(eqn._v1);
  });
  test('Nested Frac', () => {
    eqn.addForms(addForms.nestedFrac);
    const { content } = forms['0'].base.content[0];
    expect(content[0]).toBeInstanceOf(Fraction);
    expect(content[0].denominator.content[0].content).toBe(eqn._b);
    expect(content[0].vinculum).toBe(eqn._v);
    const contentN = content[0].numerator.content[0];
    expect(contentN.numerator.content[0].content).toBe(eqn._d);
  });
});
