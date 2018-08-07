import {
  DiagramGLEquation, createEquationElements, Equation
} from './GLEquation';
import { Point } from '../../tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
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
        expect(c[0].location.round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].location.round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].location.round(4)).toEqual(new Point(0.02, -0.028));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.02, -0.028));
      });
      test('Fixed to right bottom', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'bottom');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.12, 0.02));
        expect(c[1].location.round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[2].location.round(4)).toEqual(new Point(-0.04, 0.02));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.12, 0.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(-0.04, 0.02));
      });
      test('Fixed to right top', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'top');
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.12, -0.076));
        expect(c[1].location.round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[2].location.round(4)).toEqual(new Point(-0.04, -0.076));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.12, -0.076));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(-0.04, -0.076));
      });
      test('fixed to element left, baseline', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'left', 'baseline', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.04, 0));
        expect(c[1].location.round(4)).toEqual(new Point(0, 0));
        expect(c[2].location.round(4)).toEqual(new Point(0.04, 0));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.04, 0));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(0, 0));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.04, 0));
      });
      test('fixed to element center, middle', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'center', 'middle', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].location.round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].location.round(4)).toEqual(new Point(0.02, -0.028));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.06, -0.028));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.02, -0.028));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0.02, -0.028));
      });
      test('fixed to element right, top', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'top', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[1].location.round(4)).toEqual(new Point(-0.04, -0.076));
        expect(c[2].location.round(4)).toEqual(new Point(0, -0.076));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.08, -0.076));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.04, -0.076));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0, -0.076));
      });
      test('fixed to element right, bottom', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'right', 'bottom', collection._b);
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[1].location.round(4)).toEqual(new Point(-0.04, 0.02));
        expect(c[2].location.round(4)).toEqual(new Point(0, 0.02));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(-0.08, 0.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(-0.04, 0.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(0, 0.02));
      });
      test('fixed to point', () => {
        eqn.createEq(['a', 'b', 'c']);
        eqn.arrange(1, 'left', 'bottom', new Point(-1, -1));
        const c = eqn.content;
        expect(c[0].location.round(4)).toEqual(new Point(1, 1.02));
        expect(c[1].location.round(4)).toEqual(new Point(1.04, 1.02));
        expect(c[2].location.round(4)).toEqual(new Point(1.08, 1.02));
        expect(c[0].content.transform.t().round(4)).toEqual(new Point(1, 1.02));
        expect(c[1].content.transform.t().round(4)).toEqual(new Point(1.04, 1.02));
        expect(c[2].content.transform.t().round(4)).toEqual(new Point(1.08, 1.02));
      });
    });
    describe('duplicate', () => {
      test('Simple Inline', () => {
        eqn.createEq(['a', 'b', 'c']);
        expect(eqn.content).toHaveLength(3);
        const eqnCopy = eqn._dup(eqn.collection);  // testing to make sure colleciton is not overwritten
        expect(eqnCopy).toEqual(eqn);
        expect(eqnCopy).not.toBe(eqn);
        expect(eqnCopy.collection._a).toEqual(eqn.collection._a);
        expect(eqnCopy.collection._a).toBe(eqn.collection._a);
      });
    });
  });
});
describe('Equation', () => {
  let eqn;
  beforeEach(() => {
    eqn = new Equation(new DrawContext2D());
    eqn.createElements({
      a: 'a',
      b: 'b',
      c: 'c',
    });
    eqn.addForm('f1', ['a', 'b', 'c']);
    eqn.addForm('f2', [eqn.frac('a', 'b', 'c')]);
    eqn.addForm('f3', ['a', 'b', 'c']);
  });
  test('Instantiation', () => {
    expect(eqn.collection.order).toHaveLength(3);
    expect(eqn.form.f2.content[0].vinculum).toBe(eqn.collection._c);
  });
  describe('Duplicate', () => {
    test('Simple', () => {
      const dup = eqn._dup();
      expect(dup.collection).toEqual(eqn.collection);
      expect(dup.collection).not.toBe(eqn.collection);
      expect(dup).toEqual(eqn);
      expect(dup).not.toBe(eqn);
      expect(eqn.form.f1.content[0].content).toBe(eqn.form.f3.content[0].content);
      expect(dup.form.f1.content[0].content).toBe(dup.form.f3.content[0].content);
    });
    test('Add new form', () => {
      const dup = eqn._dup();
      eqn.addForm('f4', ['a', 'b', 'c']);
      dup.addForm('f4', ['a', 'b', 'c']);
      expect(dup.collection).toBe(dup.form.f1.collection);
      expect(dup.collection).toBe(dup.form.f4.collection);
      expect(dup.collection._a).toBe(dup.form.f1.content[0].content);
      expect(dup.form.f1.collection).toBe(dup.form.f4.collection);

      expect(eqn.form.f1.content[0].content).toBe(eqn.form.f4.content[0].content);

      expect(dup.form.f1.content[0].content).toBe(dup.form.f3.content[0].content);
      expect(dup.form.f1.content[0].content).toBe(dup.form.f4.content[0].content);

      expect(eqn.form.f4.content[0].content).toEqual(dup.form.f4.content[0].content);
      expect(eqn.form.f4.content[0].content).not.toBe(dup.form.f4.content[0].content);
    });
  });
  // describe('Create', () => {
  //   test('Simple inline', () => {
  //     eqn.createEq(['a', 'b', 'c']);
  //     expect(eqn.content).toHaveLength(3);
  //   });
  //   test('Fraction', () => {
  //     eqn.createEq([eqn.frac('a', 'b', 'c')]);
  //     expect(eqn.content).toHaveLength(1);
  //     const c = eqn.content[0];
  //     expect(c.vinculum).toBe(collection._c);
  //     expect(c.numerator.content[0].content).toBe(collection._a);
  //     expect(c.denominator.content[0].content).toBe(collection._b);
  //   });
  // });
});
// makeEquationTheta(color: Array<number> = [1, 1, 1, 1]) {
//    const collection = this.diagram.equation.elements({ theta: 'θ' }, color);
//    const eqn = this.diagram.equation.make(collection);
//    eqn.createEq(['θ']);
//    collection.eqn = eqn;
//    return collection;
//  }
