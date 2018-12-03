// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
// import Diagram from '../Diagram';
import {
  Point, Rect,
} from '../tools/g2';
import {
  round,
} from '../tools/mathtools';
// import webgl from '../../__mocks__/WebGLInstanceMock';
// import DrawContext2D from '../../__mocks__/DrawContext2DMock';
// import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';
import * as tools from '../../tools/tools';
import makeDiagram from '../../__mocks__/makeDiagram';

tools.isTouchDevice = jest.fn();

jest.mock('../Gesture');
jest.mock('../webgl/webgl');
jest.mock('../DrawContext2D');
// jest.mock('../../tools/tools');

describe('Diagram Equations From Object', () => {
  let diagram;
  let collection;
  let color;

  beforeEach(() => {
    diagram = makeDiagram();
    collection = diagram.shapes.collection();
    color = [1, 0, 0, 1];
  });
  test('Diagram instantiation', () => {
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
  describe('Equation Creation', () => {
    test('Simple', () => {
      const eqn = diagram.equation.makeEqnFromOptions({
        name: 'testEqn',
        color,
        addToCollection: collection,
        elements: {
          a: 'a',
          b: 'b',
        },
        forms: {
          '0': ['a', 'b'],
        },
        currentForm: '0',
        formSeries: ['0'],
      });
      expect(collection._testEqn).not.toBe(null);
      expect(collection._testEqn._a).not.toBe(null);
      expect(collection._testEqn._b).not.toBe(null);
      expect(eqn.collection).toBe(collection._testEqn);
      expect(collection._testEqn._a.color).toEqual(color);
    });
  });
  describe('Element Creation', () => {
    test('String', () => {
      const eqn = diagram.equation.makeEqnFromOptions({
        name: 'testEqn',
        color,
        addToCollection: collection,
        elements: {
          a: 'a',
          b: 'b',
        },
      });
      expect(eqn.collection).toBe(collection._testEqn);
      expect(collection._testEqn._a.color).toEqual(color);
      expect(collection._testEqn._b.color).toEqual(color);
    });
    test('Objects', () => {
      const colorA = color;
      const colorB = [0, 1, 0, 1];
      const isTouchableA = false;
      const isTouchableB = true;
      const onClickA = null;
      const onClickB = () => {};
      const directionA = '';
      const directionB = 'up';
      const magA = 0;
      const magB = 1;
      // const fontOrStyleA = null;
      const fontOrStyleB = null;
      const drawPriorityA = 1;
      const drawPriorityB = 2;

      const eqn = diagram.equation.makeEqnFromOptions({
        name: 'testEqn',
        color,
        addToCollection: collection,
        elements: {
          a: { text: 'a' },
          b: {
            text: 'b',
            color: colorB,
            isTouchable: isTouchableB,
            onClick: onClickB,
            direction: directionB,
            mag: magB,
            fontOrStyle: fontOrStyleB,
            drawPriority: drawPriorityB,
          },
        },
      });
      expect(eqn.collection).toBe(collection._testEqn);
      const a = collection._testEqn._a;
      const b = collection._testEqn._b;
      expect(a.color).toEqual(colorA);
      expect(b.color).toEqual(colorB);
      expect(a.isTouchable).toBe(isTouchableA);
      expect(b.isTouchable).toBe(isTouchableB);
      expect(a.onClick).toBe(onClickA);
      expect(b.onClick).toBe(onClickB);
      expect(a.animate.transform.translation.options.direction).toBe(directionA);
      expect(b.animate.transform.translation.options.direction).toBe(directionB);
      expect(a.animate.transform.translation.options.magnitude).toBe(magA);
      expect(b.animate.transform.translation.options.magnitude).toBe(magB);
      expect(a.drawPriority).toBe(drawPriorityA);
      expect(b.drawPriority).toBe(drawPriorityB);
    });
  });
  describe('Forms', () => {
    let eqnObj;
    beforeEach(() => {
      eqnObj = {
        name: 'testEqn',
        color,
        addToCollection: collection,
        elements: { a: 'a', b: 'b', c: 'c' },
      };
    });
    test('Array definition', () => {
      eqnObj.forms = {
        '0': ['a', 'b', 'c'],
        '1': ['b', 'a', 'c'],
      };
      const eqn = diagram.equation.makeEqnFromOptions(eqnObj);
      const formContent = eqn.form['0'].base.content;
      expect(formContent[0].content).toBe(collection._testEqn._a);
      expect(formContent[1].content).toBe(collection._testEqn._b);
      expect(formContent[2].content).toBe(collection._testEqn._c);

      const formContent1 = eqn.form['1'].base.content;
      expect(formContent1[0].content).toBe(collection._testEqn._b);
      expect(formContent1[1].content).toBe(collection._testEqn._a);
      expect(formContent1[2].content).toBe(collection._testEqn._c);
    });
    test('Object definition', () => {
      const fixTo0 = new Point(0, 0);
      const fixTo1 = 'b';
      // const scale0 = 0.7;
      const scale1 = 0.25;
      // const vAlign0 = 'baseline';
      const vAlign1 = 'bottom';
      // const hAlign0 = 'left';
      const hAlign1 = 'right';
      // const animationTime0 = null;
      const animationTime1 = 10;
      eqnObj.forms = {
        '0': ['a', 'b', 'c'],
        '1': {
          content: ['a', 'b', 'c'],
          alignment: {
            fixTo: fixTo1,
            scale: scale1,
            vAlign: vAlign1,
            hAlign: hAlign1,
          },
          animationTime: animationTime1,
        },
      };
      const eqn = diagram.equation.makeEqnFromOptions(eqnObj);
      const form0 = eqn.form['0'].base;
      const formContent = eqn.form['0'].base.content;
      expect(formContent[0].content).toBe(collection._testEqn._a);
      expect(formContent[1].content).toBe(collection._testEqn._b);
      expect(formContent[2].content).toBe(collection._testEqn._c);
      expect(form0.location).toEqual(fixTo0);

      const form1 = eqn.form['1'].base;
      const aWidth = form1.content[0].width;
      const bDescent = form1.content[1].descent;
      const bWidth = form1.content[1].width;
      const formContent1 = eqn.form['1'].base.content;
      expect(formContent1[0].content).toBe(collection._testEqn._a);
      expect(formContent1[1].content).toBe(collection._testEqn._b);
      expect(formContent1[2].content).toBe(collection._testEqn._c);
      expect(round(form1.location.x, 8)).toEqual(round(-aWidth - bWidth, 8));
      expect(round(form1.location.y, 8)).toEqual(round(bDescent, 8));
      expect(form1.time).toEqual({ fromPrev: 10, fromNext: 10, fromAny: 10 });
      expect(form1.name).toBe('1');
    });
  });
});
