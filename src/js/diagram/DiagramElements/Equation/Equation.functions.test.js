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
            content: {
              frac: {
                numerator: {
                  frac: {
                    numerator: 'a',
                    denominator: 'b',
                    symbol: 'v',
                    scale: 0.5,
                  },
                },
                denominator: 'c',
                symbol: 'v1',
              }
            },
          },
          '1': {
            frac: {
              numerator: {
                frac: {
                  numerator: 'a',
                  denominator: 'b',
                  symbol: 'v',
                  scale: 0.5,
                },
              },
              denominator: 'c',
              symbol: 'v1',
            }
          },
          '2': {
            frac: [
              {
                frac: ['a', 'c', 'v', 0.5]
              },
              'c',
              'v1',
            ]
          },
          '3': [{ frac: [{ frac: ['a', 'b', 'v', 0.5] }, 'c', 'v1'] }],
          '4': e.frac([
            {
              frac: ['a', 'b', 'v', 0.5]
            },
            'c',
            'v1',
          ]),
          '5': e.frac([e.frac(['a', 'b', 'v', 0.5]), 'c', 'v1']),
          '6': frac(frac('a', 'b', 'v', 0.5), 'c', 'v1'),
        });
      },
    };
  });
  test('Fraction', () => {
    functions.fraction();
    const elems = [eqn._a, eqn._b, eqn._c, eqn._v, eqn._v1];
    const formsToTest = ['1', '2', '3', '4', '5', '6'];

    eqn.showForm('0');

    const positions0 = elems.map(elem => round(elem.transform.mat).slice())
    console.log('0', positions0)
    formsToTest.forEach((f) => {
      eqn.showForm(f);
      const positions = elems.map(elem => round(elem.transform.mat).slice());
      console.log(f, positions)
      expect(positions0).toEqual(positions);
    })

    // Record position of elements in a snapshot
    tools.cleanUIDs(eqn);
    expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    expect(round(eqn._b.transform.mat)).toMatchSnapshot();
    expect(round(eqn._c.transform.mat)).toMatchSnapshot();
    expect(round(eqn._v.transform.mat)).toMatchSnapshot();
    expect(round(eqn._v1.transform.mat)).toMatchSnapshot();
  });
});
