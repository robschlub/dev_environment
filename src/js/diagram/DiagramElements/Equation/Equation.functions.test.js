import {
  Point,
} from '../../tools/g2';
import {
  round,
} from '../../tools/mathtools';
import * as tools from '../../../tools/tools';
import makeDiagram from '../../../__mocks__/makeDiagram';
import { EquationNew } from './Equation';
// import Fraction from './Elements/Fraction';

tools.isTouchDevice = jest.fn();

jest.mock('../../Gesture');
jest.mock('../../webgl/webgl');
jest.mock('../../DrawContext2D');

describe('Equation Functions', () => {
  let diagram;
  let eqn;
  let color1;
  let elements;
  let functions;
  beforeEach(() => {
    diagram = makeDiagram();
    color1 = [0.95, 0, 0, 1];
    elements = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      v: { symbol: 'vinculum' },
      v1: { symbol: 'vinculum' },
    };
    functions = {
      fraction: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.functions;
        const frac = e.frac.bind(e);
        eqn.addElements(elements);
        addForms({
          '0': {
            frac: {
              nemerator: {
                frac: {
                  numerator: 'a',
                  denominator: 'b',
                  symbol: 'v',
                },
              },
              denominator: 'c',
              symbol: 'v1',
            }
          },
          '1': {
            frac: [
              {
                frac: ['a', 'b', 'v']
              },
              'c',
              'v1',
            ]
          },
          '2': e.frac([e.frac(['a', 'b', 'v']), 'c', 'v1']),
          '3': frac(frac('a', 'b', 'v'), 'c', 'v1'),
        });
      },
    };
  });
  test('Fraction', () => {
    functions.fraction();
    expect(eqn).toHaveProperty('_a');
    expect(eqn).toHaveProperty('_b');
    expect(eqn).toHaveProperty('_c');
    expect(eqn).toHaveProperty('_d');
    expect(eqn).toHaveProperty('_v');

    // Check color
    expect(eqn._a.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(color1));

    // Test locations of all elements
    // cleanUIDs(eqn);
    // expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    // expect(round(eqn.__2.transform.mat)).toMatchSnapshot();
    // expect(round(eqn._v.transform.mat)).toMatchSnapshot();
    // expect(round(eqn._c.transform.mat)).toMatchSnapshot();
  });
});
