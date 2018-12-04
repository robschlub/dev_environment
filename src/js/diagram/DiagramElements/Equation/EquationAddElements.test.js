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
  let addElements;
  let modColor1;
  let modColor2;
  let defaultColor;
  beforeEach(() => {
    diagram = makeDiagram();
    eqn = new EquationNew(diagram.shapes);
    modColor1 = [0.95, 0, 0, 1];
    modColor2 = [0, 0.95, 0, 1];
    defaultColor = [0.5, 0.5, 0.5, 1];
    addElements = {
      simple: {
        a: 'a',
        b: 'b',
        c: 'c',
      },
      autoFontSelection: {
        a: 'a',
        _1: '1',
      },
      simpleObject: {
        a: 'a',
        b: {
          text: 'b',
        },
      },
      textOverrides: {
        a: 'a',
        b: {
          text: 'b',
          style: 'normal',
        },
        c: {
          text: 'c',
          font: new DiagramFont(
            'Helvetica', 'normal',
            0.3, '300', 'right', 'alphabetic', modColor1,
          ),
        },
        d: {              // font overrides style, color overrides font
          text: 'd',
          style: 'normal',
          color: modColor2,
          font: new DiagramFont(
            'Helvetica', 'italic',
            0.3, '300', 'right', 'alphabetic', modColor1,
          ),
        },
      },
      symbol: {
        a: 'a',
        'v': { symbol: 'vinculum' },
      },
      elementOptions: {
        a: 'a',
        b: {
          text: 'b',
          color: modColor1,
          elementOptions: {
            isTouchable: true,
          },
        },
        'v': {
          symbol: 'vinculum',
          color: modColor1,
          elementOptions: {
            isTouchable: true,
          },
        },
      },
      diagramElements: {
        a: 'a',
        v: diagram.shapes.horizontalLine(new Point(0, 0), 1, 0.1, 0, defaultColor),
      },
    };
  });
  test('Equation instantiation', () => {
    expect(eqn).not.toBe(null);
  });
  test('Simple text only', () => {
    eqn.addElements(addElements.simple);
    expect(eqn._a).not.toBe(null);
    expect(Object.keys(eqn.elements).length).toBe(3);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._a.drawingObject.text[0].font.style).toBe('italic');
    // expect(eqn.__2.drawingObject.text[0].font.style).toBe('normal');
    // console.log(eqn._a.drawingObject.text[0])
    // expect(eqn._a.drawingObject.text[0])
  });
  test('Italics for text, normal for numbers', () => {
    eqn.addElements(addElements.autoFontSelection);
    expect(eqn._a.drawingObject.text[0].font.style).toBe('italic');
    expect(eqn.__1.drawingObject.text[0].font.style).toBe('normal');
  });
  test('Simple object definition', () => {
    eqn.addElements(addElements.simpleObject);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._b.drawingObject.text[0].text).toBe('b');
  });
  test('Text Overrides', () => {
    eqn.addElements(addElements.textOverrides);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._b.drawingObject.text[0].text).toBe('b');
    expect(eqn._c.drawingObject.text[0].text).toBe('c');
    expect(eqn._d.drawingObject.text[0].text).toBe('d');

    expect(eqn._a.drawingObject.text[0].font.style).toBe('italic');
    expect(eqn._b.drawingObject.text[0].font.style).toBe('normal');
    expect(eqn._c.drawingObject.text[0].font.style).toBe('normal');
    expect(eqn._d.drawingObject.text[0].font.style).toBe('italic');

    expect(eqn._a.drawingObject.text[0].font.family).toBe('Times New Roman');
    expect(eqn._b.drawingObject.text[0].font.family).toBe('Times New Roman');
    expect(eqn._c.drawingObject.text[0].font.family).toBe('Helvetica');
    expect(eqn._d.drawingObject.text[0].font.family).toBe('Helvetica');

    expect(eqn._a.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(defaultColor));
    expect(eqn._b.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(defaultColor));
    expect(eqn._c.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(modColor1));
    expect(eqn._d.drawingObject.text[0].font.color)
      .toBe(tools.colorArrayToRGBA(modColor2));
  });
  test('Symbol', () => {
    eqn.addElements(addElements.symbol);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._v.drawingObject).toBeInstanceOf(VertexHorizontalLine);
  });
  test('ElementOptions', () => {
    eqn.addElements(addElements.elementOptions);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._b.drawingObject.text[0].text).toBe('b');
    expect(eqn._v.drawingObject).toBeInstanceOf(VertexHorizontalLine);

    expect(eqn._a.isTouchable).toBe(false);
    expect(eqn._b.isTouchable).toBe(true);
    expect(eqn._v.isTouchable).toBe(true);

    expect(eqn._a.color).toEqual([1, 0, 0, 1]);
    expect(eqn._b.color).toEqual(modColor1);
    expect(eqn._v.color).toEqual(modColor1);
  });
  test('Diagram Elements', () => {
    eqn.addElements(addElements.diagramElements);
    expect(eqn._a.drawingObject.text[0].text).toBe('a');
    expect(eqn._v.drawingObject).toBeInstanceOf(VertexHorizontalLine);

    expect(eqn._a.color).toEqual([1, 0, 0, 1]);
    expect(eqn._v.color).toEqual(defaultColor);
  });
});
