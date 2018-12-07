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
        });
      },
      parameters: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        const e = eqn.eqn.functions;
        const supSub = e.supSub.bind(e);
        eqn.addElements(elements);
        const scale = 0.8;    // default is 0.6
        const supBias = new Point(0.5, 0.5);
        const subBias = [0.5, -0.5];
        eqn.addForms({
          // without
          //   // Method Object
          'without': {
            supSub: {
              content: 'a',
              superscript: 'b',
              subscript: 'c',
            },
          },
          // With parameters
          '0': {
            supSub: {
              content: 'a',
              superscript: 'b',
              subscript: 'c',
              scale,
              superscriptBias: supBias,
              subscriptBias: subBias,
            },
          },
          // Method Array
          '1': { supSub: ['a', 'b', 'c', scale, supBias, subBias] },
          // Function with parameters
          '2': supSub('a', 'b', 'c', scale, supBias, subBias),
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
  test('Scale Fraction', () => {
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

    const withSub = eqn.eqn.forms['0'].base.content[0].content[0].subscript;
    const withoutSub = eqn.eqn.forms.without.base.content[0].content[0].subscript;
    const withSup = eqn.eqn.forms['0'].base.content[0].content[0].subscript;
    const withoutSup = eqn.eqn.forms.without.base.content[0].content[0].subscript;

    // Check scaling was done correctly
    expect(round(withSub.height / withoutSub.height)).toBe(round(0.8 / 0.5));
    expect(round(withSup.height / withoutSup.height)).toBe(round(0.8 / 0.5));

    // Check xBias location was done correctly
    expect(round(withSub.location.x - withoutSub.location.x)).toBe(0.5);
    expect(round(withSup.location.x - withoutSup.location.x)).toBe(0.5);

    // Check yBias location was done correctly
    // subscript.height * 0.7 + this.subBias.y
    expect(round(withoutSub.location.y)).toBe(round(-withoutSub.ascent * 0.7 + 0));
    expect(round(withSub.location.y)).toBe(round(-withSub.ascent * 0.7 - 0.5));
  });
});
