import {
  Point,
} from '../../tools/g2';

import * as tools from '../../../tools/tools';
import makeDiagram from '../../../__mocks__/makeDiagram';
import { EquationNew } from './Equation';
// import Fraction from './Elements/Fraction';

tools.isTouchDevice = jest.fn();

jest.mock('../../Gesture');
jest.mock('../../webgl/webgl');
jest.mock('../../DrawContext2D');

describe('Different ways to make an equation', () => {
  let diagram;
  let eqn;
  let color1;
  let ways;
  beforeEach(() => {
    diagram = makeDiagram();
    color1 = [0.95, 0, 0, 1];
    ways = {
      allTextInConstructor: () => {
        eqn = new EquationNew(diagram.shapes, {
          color: color1,
          elements: {
            a: 'a',
            b: 'b',
            c: 'c',
            _2: '2',
            v: { symbol: 'vinculum' },
          },
          forms: {
            '0': ['a', 'b', 'c'],
            '1': [{ frac: ['a', '_2', 'v'] }, 'c'],
          },
          formSeries: ['0', '1'],
        });
      },
      allTextInConstructorAllOptions: () => {
        eqn = new EquationNew(diagram.shapes, {
          color: color1,
          position: new Point(1, 1),
          elements: {
            a: 'a',
            b: 'b',
            c: 'c',
            _2: '2',
            v: { symbol: 'vinculum' },
          },
          defaultFormAlignment: {
            fixTo: new Point(2, 2),
            alignH: 'right',
            alignV: 'top',
            scale: 0.45,
          },
          forms: {
            '0': ['a', 'b', 'c'],
            '1': [{ frac: ['a', '_2', 'v'] }, 'c'],
          },
          formSeries: ['0', '1'],
        });
      },
    };
  });
  test('All Text in constructor', () => {
    ways.allTextInConstructor();
    expect(eqn).toHaveProperty('_a');
    expect(eqn).toHaveProperty('_b');
    expect(eqn).toHaveProperty('_c');
    expect(eqn).toHaveProperty('__2');
    expect(eqn).toHaveProperty('_v');

    // Check color
    expect(eqn._a.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(color1));

    // Check math vs number style
    expect(eqn._a.drawingObject.text[0].font.style).toBe('italic');
    expect(eqn.__2.drawingObject.text[0].font.style).toBe('normal');
  });
  test('All Text in constructor with all options', () => {
    ways.allTextInConstructorAllOptions();
    expect(eqn).toHaveProperty('_a');
    expect(eqn).toHaveProperty('_b');
    expect(eqn).toHaveProperty('_c');
    expect(eqn).toHaveProperty('__2');
    expect(eqn).toHaveProperty('_v');

    // Check color
    expect(eqn._a.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(color1));

    // Check math vs number style
    expect(eqn._a.drawingObject.text[0].font.style).toBe('italic');
    expect(eqn.__2.drawingObject.text[0].font.style).toBe('normal');
  });
});
