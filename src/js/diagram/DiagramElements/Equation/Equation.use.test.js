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

// const cleanUIDs = (objectToClean: {}) => {
//   const genericUID = '0000000000';
//   if (objectToClean == null) {
//     return;
//   }
//   if (objectToClean.uid != null) {
//     if (objectToClean.uid === genericUID) {
//       return;
//     }
//     objectToClean.uid = genericUID;
//   }
//   const keys = Object.keys(objectToClean);
//   for (let i = 0; i < keys.length; i += 1) {
//     const key = keys[i];
//     const value = objectToClean[key];
//     if (
//       typeof value === 'object'
//       && !Array.isArray(value)
//       && value != null
//       && typeof value !== 'function'
//       && typeof value !== 'number'
//       && typeof value !== 'boolean'
//       && typeof value !== 'string'
//       ) {
//         cleanUIDs(value);
//     }
//   };
// }

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
          position: [1, 1],           // Points can be defined as arrays
          elements: {
            a: 'a',
            b: 'b',
            c: 'c',
            _2: '2',
            v: { symbol: 'vinculum' },
          },
          defaultFormAlignment: {
            fixTo: { x: 2, y: 2 },    // Points can also be defined as objects
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
      separateAllText: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        eqn.addElements({
          a: 'a',
          b: 'b',
        });
        eqn.addElements({
          a: 'a',
          b: 'b',
          c: 'c',
          _2: '2',
          v: { symbol: 'vinculum' },
        });
        eqn.addForms({
          '0': ['a', 'b', 'c'],
          '1': [{ frac: ['a', '_2', 'v'] }, 'c'],
        });
        eqn.addForms({
          '2': ['a', 'b', 'c'],
        });
        eqn.setFormSeries(['0', '1', '2']);
        eqn.showForm('1');
      },
      nonTextFunctions: () => {
        eqn = new EquationNew(diagram.shapes, { color: color1 });
        // const e = eqn.eqn.functions;
        eqn.addElements({
          a: 'a',
          b: 'b',
          c: 'c',
          _2: '2',
          v: { symbol: 'vinculum' },
          v1: { symbol: 'vinculum' },
        });
        eqn.addForms({
          '0': {
            frac: [
              {
                frac: ['a', 'b', 'v'],
              },
              'c',
              'v1',
            ],
          },
          '1': [{ frac: ['a', '_2', 'v'] }, 'c'],
        });
        eqn.setFormSeries(['0', '1', '2']);
        eqn.showForm('1');
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

    // Check position
    expect(eqn.transform.t()).toEqual(new Point(1, 1));

    // Check default form alignment
    expect(eqn.eqn.defaultFormAlignment.fixTo).toEqual(new Point(2, 2));
    expect(eqn.eqn.defaultFormAlignment.alignH).toEqual('right');
    expect(eqn.eqn.defaultFormAlignment.alignV).toEqual('top');
    expect(eqn.eqn.defaultFormAlignment.scale).toEqual(0.45);

    tools.cleanUIDs(eqn);
    expect(eqn._a).toMatchSnapshot();
  });
  test('Separate All Text', () => {
    ways.separateAllText();
    expect(eqn).toHaveProperty('_a');
    expect(eqn).toHaveProperty('_b');
    expect(eqn).toHaveProperty('_c');
    expect(eqn).toHaveProperty('__2');
    expect(eqn).toHaveProperty('_v');

    // Check color
    expect(eqn._a.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(color1));

    // Test locations of all elements
    tools.cleanUIDs(eqn);
    expect(round(eqn._a.transform.mat)).toMatchSnapshot();
    expect(round(eqn.__2.transform.mat)).toMatchSnapshot();
    expect(round(eqn._v.transform.mat)).toMatchSnapshot();
    expect(round(eqn._c.transform.mat)).toMatchSnapshot();
  });
});
