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
  // let forms;
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
        const e = eqn.eqn.functions;
        const frac = e.frac.bind(e);
        eqn.addElements(elements);
        eqn.addForms({
          '0': {
            frac: {
              numerator: {
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
          '2': [{ frac: [{ frac: ['a', 'b', 'v'] }, 'c', 'v1'] }],
          '3': e.frac([
            {
              frac: ['a', 'b', 'v']
            },
            'c',
            'v1',
          ]),
          '4': e.frac([e.frac(['a', 'b', 'v']), 'c', 'v1']),
          '5': frac(frac('a', 'b', 'v'), 'c', 'v1'),
        });
        eqn.showForm('0');
        // ({ forms } = eqn.eqn);
      },
    };
  });
  test('Fraction', () => {
    functions.fraction();

    // Check all fractions are the same
    const c0 = eqn.eqn.forms['0'].base.content[0].content;
    const c1 = eqn.eqn.forms['1'].base.content[0].content;
    expect(c0).toEqual(c1);

    // Record position of elements in a snapshot
    tools.cleanUIDs(eqn);
    expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    expect(round(eqn._b.transform.mat)).toMatchSnapshot();
    expect(round(eqn._c.transform.mat)).toMatchSnapshot();
    expect(round(eqn._v.transform.mat)).toMatchSnapshot();
    expect(round(eqn._v1.transform.mat)).toMatchSnapshot();
  });
});
