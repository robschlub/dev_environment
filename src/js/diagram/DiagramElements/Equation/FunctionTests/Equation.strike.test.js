import {
  Point,
} from '../../../tools/g2';
import {
  round,
} from '../../../tools/mathtools';
import * as tools from '../../../../tools/tools';
import makeDiagram from '../../../../__mocks__/makeDiagram';
import { EquationNew } from '../Equation';

tools.isTouchDevice = jest.fn();

jest.mock('../../../Gesture');
jest.mock('../../../webgl/webgl');
jest.mock('../../../DrawContext2D');

describe('Equation Functions - Strike', () => {
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
      g: 'g',
      x: { symbol: 'xStrike' },
      s: { symbol: 'strike' },
    };
    functions = {
      single: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.eqn.functions;
        const strike = e.strike.bind(e);
        eqn.addElements(elements);
        eqn.addForms({
          // Full Object
          '0': {
            content: {
              strike: {
                content: 'a',
                symbol: 'x',
              },
            },
          },
          //   // Method Object
          '1': {
            strike: {
              content: 'a',
              symbol: 'x',
            },
          },
          // Method Array
          '2': { strike: ['a', 'x'] },
          // Function with Method Array
          '3': e.strike(['a', 'x']),
          // Function with parameters
          '4': e.strike('a', 'x'),
          // Bound Function with parameters
          '5': strike('a', 'x'),
          // Bound Function with Object
          '6': strike({
            content: 'a',
            symbol: 'x',
          }),
        });
      },
      parameters: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.eqn.functions;
        const strike = e.strike.bind(e);
        eqn.addElements(elements);
        eqn.addForms({
          // without
          //   // Method Object
          'without': strike('a', 'x'),
          // With parameters
          '0': {
            strike: {
              content: 'a',
              symbol: 'x',
              strikeInSize: true,
            },
          },
          // Method Array
          '1': { strike: ['a', 'x', true] },
          // Function with parameters
          '2': e.strike('a', 'x', true),
        });
      },
    };
  });
  test('Strike', () => {
    functions.single();
    const elems = [eqn._a, eqn._b, eqn._c];
    const formsToTest = ['1', '2', '3', '4', '5', '6'];

    eqn.showForm('0');
    const positions0 = elems.map(elem => round(elem.transform.mat).slice());
    formsToTest.forEach((f) => {
      eqn.showForm(f);
      const positions = elems.map(elem => round(elem.transform.mat).slice());
      expect(positions0).toEqual(positions);
    });

    // Snapshot test on most simple layout
    eqn.showForm('0');
    tools.cleanUIDs(eqn);
    expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    expect(round(eqn._x.transform.mat)).toMatchSnapshot();
  });
  test('Strike Parameters', () => {
    functions.parameters();
    const elems = [eqn._a, eqn._b, eqn._c];
    const withFormsToTest = ['1', '2'];

    // get without positions
    eqn.showForm('without');
    const withoutPos = elems.map(elem => round(elem.transform.mat).slice());

    // with reference positions
    eqn.showForm('0');
    const withPos = elems.map(elem => round(elem.transform.mat).slice());

    expect(withoutPos).not.toEqual(withPos);

    withFormsToTest.forEach((f) => {
      eqn.showForm(f);
      const positions = elems.map(elem => round(elem.transform.mat).slice());
      expect(withPos).toEqual(positions);
    });

    // const withSub = eqn.eqn.forms['0'].base.content[0].content[0].subscript;
    // const withoutSub = eqn.eqn.forms.without.base.content[0].content[0].subscript;
    // const withSup = eqn.eqn.forms['0'].base.content[0].content[0].subscript;
    // const withoutSup = eqn.eqn.forms.without.base.content[0].content[0].subscript;

    // // Check scaling was done correctly
    // expect(round(withSub.height / withoutSub.height)).toBe(round(0.8 / 0.5));
    // expect(round(withSup.height / withoutSup.height)).toBe(round(0.8 / 0.5));

    // // Check xBias location was done correctly
    // expect(round(withSub.location.x - withoutSub.location.x)).toBe(0.5);
    // expect(round(withSup.location.x - withoutSup.location.x)).toBe(0.5);

    // // Check yBias location was done correctly
    // // subscript.height * 0.7 + this.subBias.y
    // expect(round(withoutSub.location.y)).toBe(round(-withoutSub.ascent * 0.7 + 0));
    // expect(round(withSub.location.y)).toBe(round(-withSub.ascent * 0.7 - 0.5));
  });
//   test('Nested Subscript', () => {
//     functions.sub();
//     const elems = [eqn._a, eqn._b, eqn._c, eqn._d];
//     const formsToTest = ['1'];

//     eqn.showForm('0');
//     const positions0 = elems.map(elem => round(elem.transform.mat).slice());
//     formsToTest.forEach((f) => {
//       eqn.showForm(f);
//       const positions = elems.map(elem => round(elem.transform.mat).slice());
//       expect(positions0).toEqual(positions);
//     });
//   });
//   test('Nested Superscript', () => {
//     functions.sup();
//     const elems = [eqn._a, eqn._b, eqn._c, eqn._d];
//     const formsToTest = ['1'];

//     eqn.showForm('0');
//     const positions0 = elems.map(elem => round(elem.transform.mat).slice());
//     formsToTest.forEach((f) => {
//       eqn.showForm(f);
//       const positions = elems.map(elem => round(elem.transform.mat).slice());
//       expect(positions0).toEqual(positions);
//     });
//   });
});
