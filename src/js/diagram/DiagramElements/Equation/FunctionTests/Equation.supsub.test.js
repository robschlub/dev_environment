// import {
//   Point,
// } from '../../../tools/g2';
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
      g: 'g',
      v: { symbol: 'vinculum' },
      v1: { symbol: 'vinculum' },
    };
    functions = {
      single: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.eqn.functions;
        const supSub = e.supSub.bind(e);
        eqn.addElements(elements);
        eqn.addForms({
          // Full Object
          '0': {
            content: {
              supSub: {
                content: 'a',
                superscript: 'b',
                subscript: 'c',
              },
            },
          },
          //   // Method Object
          '1': {
            supSub: {
              content: 'a',
              superscript: 'b',
              subscript: 'c',
            },
          },
          // Method Array
          '2': { supSub: ['a', 'b', 'c'] },
          // Function with Method Array
          '3': e.supSub(['a', 'b', 'c']),
          // Function with parameters
          '4': e.supSub('a', 'b', 'c'),
          // Bound Function with parameters
          '5': supSub('a', 'b', 'c'),
          // Bound Function with Object
          '6': supSub({
            content: 'a',
            superscript: 'b',
            subscript: 'c',
          }),
        });
      },
      nested: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.eqn.functions;
        const supSub = e.supSub.bind(e);
        eqn.addElements(elements);
        const s = 0.5;
        eqn.addForms({
          // Full Object around method objects
          '0': {
            content: {
              supSub: {
                content: 'a',
                superscript: {
                  supSub: {
                    content: 'b',
                    superscript: {
                      supSub: {
                        content: 'c',
                        superscript: 'd',
                        subscript: 'e',
                      },
                    },
                    subscript: 'f',
                    },
                },
                subscript: 'g',
              },
            },
          },
          // Array Objects in method object
          '1': {
            supSub: {
              content: 'a',
              superscript: {
                supSub: {
                  content: 'b',
                  superscript: { supSub: ['c', 'd', 'e'] },
                  subscript: 'f',
                  },
              },
              subscript: 'g',
            },
          },
          // Function and Array Objects
          '2': supSub(
            'a', {
              supSub: [
                'b',
                { supSub: ['c', 'd', 'e'] },
                'f',
              ],
            },
            'g',
          ),
          // All Functions with parameter, object and array input
          '3': supSub(
            'a',
            supSub({
              content: 'b',
              superscript: supSub(['c', 'd', 'e']),
              subscript: 'f',
            }),
            'g',
          ),
          '4': supSub('a', supSub('b', supSub('c', 'd', 'e'), 'f'), 'g'),
          // // Method Object nested in Method Object
          // '1': {
          //   frac: {
          //     numerator: {
          //       frac: {
          //         numerator: 'a',
          //         denominator: 'b',
          //         symbol: 'v',
          //         scale: s,
          //       },
          //     },
          //     denominator: 'c',
          //     symbol: 'v1',
          //   },
          // },
          // // Method Array nested in Method Array
          // '2': {
          //   frac: [
          //     {
          //       frac: ['a', 'b', 'v', s],
          //     },
          //     'c',
          //     'v1',
          //   ],
          // },
          // // Method Array nested in Method Array, all in an Array
          // '3': [{ frac: [{ frac: ['a', 'b', 'v', s] }, 'c', 'v1'] }],
          // // Method Array in a Function
          // '4': e.frac([
          //   {
          //     frac: ['a', 'b', 'v', s],
          //   },
          //   'c',
          //   'v1',
          // ]),
          // // Function in a Function
          // '5': e.frac([e.frac(['a', 'b', 'v', s]), 'c', 'v1']),
          // // Bound function in a bound function
          // '6': frac(frac('a', 'b', 'v', s), 'c', 'v1'),
        });
      },
    };
  });
  test('Single SupSub', () => {
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
    expect(round(eqn._b.transform.mat)).toMatchSnapshot();
    expect(round(eqn._c.transform.mat)).toMatchSnapshot();
  });
  test('Nested SupSub', () => {
    functions.nested();
    const elems = [eqn._a, eqn._b, eqn._c, eqn._d, eqn._e, eqn._f, eqn._g];
    const formsToTest = ['1', '2', '3', '4'];

    eqn.showForm('0');
    const positions0 = elems.map(elem => round(elem.transform.mat).slice());
    formsToTest.forEach((f) => {
      eqn.showForm(f);
      const positions = elems.map(elem => round(elem.transform.mat).slice());
      expect(positions0).toEqual(positions);
    });

    // Snapshot test on nested layout as it is most complicated
    eqn.showForm('0');
    tools.cleanUIDs(eqn);
    expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    expect(round(eqn._b.transform.mat)).toMatchSnapshot();
    expect(round(eqn._c.transform.mat)).toMatchSnapshot();
    expect(round(eqn._d.transform.mat)).toMatchSnapshot();
    expect(round(eqn._e.transform.mat)).toMatchSnapshot();
    expect(round(eqn._f.transform.mat)).toMatchSnapshot();
    expect(round(eqn._g.transform.mat)).toMatchSnapshot();
  });
  // test('Scale Fraction', () => {
  //   functions.scaling();
  //   const elems = [eqn._a, eqn._b, eqn._c, eqn._v, eqn._v1];
  //   const scaleFormsToTest = ['s1', 's2'];
  //   const noScaleFormsToTest = ['n1', 'n2'];

  //   // Check all forms that were scaled are the same
  //   eqn.showForm('s0');
  //   let positions0 = elems.map(elem => round(elem.transform.mat).slice());
  //   scaleFormsToTest.forEach((f) => {
  //     eqn.showForm(f);
  //     const positions = elems.map(elem => round(elem.transform.mat).slice());
  //     expect(positions0).toEqual(positions);
  //   });

  //   // Check all forms that weren't scaled are the same
  //   eqn.showForm('n0');
  //   positions0 = elems.map(elem => round(elem.transform.mat).slice());
  //   noScaleFormsToTest.forEach((f) => {
  //     eqn.showForm(f);
  //     const positions = elems.map(elem => round(elem.transform.mat).slice());
  //     expect(positions0).toEqual(positions);
  //   });

  //   // Check height is double the scaled form
  //   const sHeight = eqn.eqn.forms.s0.base.content[0].content[0].content[0].height;
  //   const nHeight = eqn.eqn.forms.n0.base.content[0].content[0].content[0].height;
  //   expect(round(nHeight / sHeight)).toBe(2);
  // });
  // test('Nested Fractions', () => {
  //   functions.nested();
  //   const elems = [eqn._a, eqn._b, eqn._c, eqn._v, eqn._v1];
  //   const formsToTest = ['1', '2', '3', '4', '5', '6'];

  //   eqn.showForm('0');
  //   const positions0 = elems.map(elem => round(elem.transform.mat).slice());
  //   formsToTest.forEach((f) => {
  //     eqn.showForm(f);
  //     const positions = elems.map(elem => round(elem.transform.mat).slice());
  //     expect(positions0).toEqual(positions);
  //   });

  //   tools.cleanUIDs(eqn);
  //   expect(round(eqn._a.transform.mat)).toMatchSnapshot();
  //   expect(round(eqn._b.transform.mat)).toMatchSnapshot();
  //   expect(round(eqn._c.transform.mat)).toMatchSnapshot();
  //   expect(round(eqn._v.transform.mat)).toMatchSnapshot();
  //   expect(round(eqn._v1.transform.mat)).toMatchSnapshot();
  // });
});
