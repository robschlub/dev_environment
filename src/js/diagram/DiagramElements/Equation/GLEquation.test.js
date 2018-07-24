import { DiagramGLEquation, createEquationElements } from './GLEquation';
import { Point } from '../../tools/g2';
import { DiagramElementPrimative, DiagramElementCollection } from '../../Element';
import DrawContext2D from '../../../__mocks__/DrawContext2DMock';


describe('GL Equation', () => {
  describe('Create collection', () => {
    test('One element collection', () => {
      const collection = createEquationElements({ a: 'a' }, DrawContext2D);
      expect(collection.order).toHaveLength(1);
      expect(collection._a).not.toBe(undefined);
      expect(collection._a).toBeInstanceOf(DiagramElementPrimative);
      expect(collection).toBeInstanceOf(DiagramElementCollection);
    });
    test('Three element collection', () => {
      const collection = createEquationElements({
        a: 'a',
        b: 'b',
        c: 'c',
      }, DrawContext2D);
      expect(collection.order).toHaveLength(3);
      expect(collection._a).not.toBe(undefined);
      expect(collection._b).not.toBe(undefined);
      expect(collection._c).not.toBe(undefined);
    });
  });
  describe('Equation', () => {
    let collection;
    let eqn;
    beforeEach(() => {
      collection = createEquationElements({
        a: 'a',
        b: 'b',
        c: 'c',
      }, new DrawContext2D());
      eqn = new DiagramGLEquation(collection);
    });
    test('Instantiation', () => {
      expect(eqn.collection).toBe(collection);
      expect(eqn.ascent).toBe(0);
      expect(eqn.descent).toBe(0);
      expect(eqn.width).toBe(0);
      expect(eqn.content).toEqual([]);
      expect(eqn.location).toEqual(new Point(0, 0));
      expect(eqn.height).toBe(0);
    });
    describe('Create', () => {
      test('Simple inline', () => {
        eqn.createEq(['a', 'b', 'c']);
        expect(eqn.content).toHaveLength(3);
      });
      test('Fraction', () => {
        eqn.createEq([eqn.frac('a', 'b', 'c')]);
        expect(eqn.content).toHaveLength(1);
        const c = eqn.content[0];
        expect(c.vinculum).toBe(collection._c);
        expect(c.numerator.content[0].content).toBe(collection._a);
        expect(c.denominator.content[0].content).toBe(collection._b);
      });
    });
    describe('arrange', () => {
      test('Fixed to left baseline', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'left', 'baseline');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(0, 0));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.08, 0));
      });
      test('Fixed to center middle', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'center', 'middle');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.02, -0.028));
      });
      test('Fixed to right bottom', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'bottom');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.12, 0.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(-0.04, 0.02));
      });
      test('Fixed to right top', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'top');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.12, -0.076));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(-0.04, -0.076));
      });
      test('fixed to element left, baseline', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'left', 'baseline', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.04, 0));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(0, 0));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.04, 0));
      });
      test('fixed to element center, middle', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'center', 'middle', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.02, -0.028));
      });
      test('fixed to element right, top', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'top', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.04, -0.076));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0, -0.076));
      });
      test('fixed to element right, bottom', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'bottom', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.04, 0.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0, 0.02));
      });
      test('fixed to point', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'left', 'bottom', new Point(-1, -1));
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(0, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.08, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(1, 1.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(1.04, 1.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(1.08, 1.02));
      });
    });
  });
});

// makeEquationTheta(color: Array<number> = [1, 1, 1, 1]) {
//    const collection = this.diagram.equation.elements({ theta: 'θ' }, color);
//    const eqn = this.diagram.equation.make(collection);
//    eqn.createEq(['θ']);
//    collection.eqn = eqn;
//    return collection;
//  }