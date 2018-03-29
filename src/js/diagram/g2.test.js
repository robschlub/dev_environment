import * as g2 from './g2';
import { round } from './mathtools';

describe('d2 tests', () => {
  describe('Points', () => {
    describe('Point Creation', () => {
      test('point(0, 0) creates a point at x=0, y=0', () => {
        const p = g2.point(0, 0);
        expect(p.x).toEqual(0);
        expect(p.y).toEqual(0);
      });
      test('point(2, -4) creates a point at x=2, y=-4', () => {
        const p = g2.point(2, -4);
        expect(p.x).toEqual(2);
        expect(p.y).toEqual(-4);
      });
    });

    describe('Points can be added to each other', () => {
      test('(0, 0) + (1, 1) = (1, 1)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 1);
        const s = p.add(q);
        expect(s).toEqual(g2.point(1, 1));
      });
      test('(0, 0) + (1, -1) = (1, -1)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, -1);
        const s = p.add(q);
        expect(s).toEqual(g2.point(1, -1));
      });
      test('(0, 0) + (1, 1) + (1, 1) = (2, 2)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 1);
        const s = p.add(q).add(q);
        expect(s).toEqual(g2.point(2, 2));
      });
    });

    describe('Points can be subtracted from each other', () => {
      test('(0, 0) - (1, 1) = (-1, -1)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 1);
        const s = p.sub(q);
        expect(s).toEqual(g2.point(-1, -1));
      });
      test('(0, 0) - (1, -1) = (-1, 1)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, -1);
        const s = p.sub(q);
        expect(s).toEqual(g2.point(-1, 1));
      });
      test('(0, 0) - (1, 1) - (1, 1) = (-2, -2)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 1);
        const s = p.sub(q).sub(q);
        expect(s).toEqual(g2.point(-2, -2));
      });
    });

    describe('Points can be rotated around 0, 0', () => {
      test('Rotate (1, 0) by 90 deg = (0, 1)', () => {
        const p = g2.point(1, 0);
        const s = p.rotate(Math.PI / 2);
        expect(s.round()).toEqual(g2.point(0, 1).round());
      });
      test('Rotate (1, 1) by -45 deg = (0, sqrt(2))', () => {
        const p = g2.point(1, 1);
        const s = p.rotate(-Math.PI / 4);
        expect(s.round()).toEqual(g2.point(Math.sqrt(2), 0).round());
      });
    });

    describe('Points can be rotated around other points', () => {
      test('Rotate (1, 0.5) by 90 deg around (0.5, 0.5) = (0.5, 1)', () => {
        const p = g2.point(1, 0.5);
        const q = g2.point(0.5, 0.5);
        const s = p.rotate(Math.PI / 2, q);
        expect(s.round()).toEqual(g2.point(0.5, 1).round());
      });
      test('Rotate (1, 1) by -45 deg around (-1, -1) = (2 * sqrt(2)-1, -1)', () => {
        const p = g2.point(1, 1);
        const q = g2.point(-1, -1);
        const s = p.rotate(-Math.PI / 4, q);
        expect(s.round()).toEqual(g2.point(2 * Math.sqrt(2) - 1, -1).round());
      });
    });

    describe('Points can be compared to other points', () => {
      test('(0, 0) == (0, 0)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(0, 0);
        expect(p.isEqualTo(q)).toEqual(true);
      });
      test('(-1, 4) == (-1, 4)', () => {
        const p = g2.point(-1, 4);
        const q = g2.point(-1, 4);
        expect(p.isEqualTo(q)).toEqual(true);
      });
      test('(0, 0) != (1, 0)', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 0);
        expect(p.isEqualTo(q)).toEqual(false);
      });
      test('0.001, 0.001 != 0, 0 with precision 3', () => {
        const p = g2.point(0.001, 0.001);
        const q = g2.point(0, 0);
        expect(p.isEqualTo(q, 3)).toEqual(false);
      });
      test('(0.001, 0.001) == (0, 0) with precision 2', () => {
        const p = g2.point(0.001, 0.001);
        const q = g2.point(0, 0);
        expect(p.isEqualTo(q, 2)).toEqual(true);
      });
      test('(-0, 0) == (0, 0)', () => {
        const p = g2.point(-0, 0);
        const q = g2.point(0, 0);
        expect(p.isEqualTo(q)).toEqual(true);
      });
      test('(0, 0) != (1, 0) using isNotEqualTo', () => {
        const p = g2.point(0, 0);
        const q = g2.point(1, 0);
        expect(p.isNotEqualTo(q)).toEqual(true);
      });
      test('(0, 0) == (0.1, 0) with precision of 0', () => {
        const p = g2.point(0, 0);
        const q = g2.point(0.1, 0);
        expect(p.isEqualTo(q, 0)).toEqual(true);
      });
    });

    describe('Points can be on a line', () => {
      test('(0, 0) is within the line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(0, 0);
        expect(p.isOnLine(l)).toEqual(true);
      });
      test('(1, 0) is within the line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(1, 0);
        expect(p.isOnLine(l)).toEqual(true);
      });
      test('(0, 1) is not within the line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(0, 1);
        expect(p.isOnLine(l)).toEqual(false);
      });
      test('(2, 0) is not within the line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(2, 0);
        expect(p.isOnLine(l)).toEqual(false);
      });
      test('(2, 0) is on the unbound line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(2, 0);
        expect(p.isOnUnboundLine(l)).toEqual(true);
      });
      test('(2, 2) is not on the unbound line <(-1, 0) (1, 0)>', () => {
        const l = g2.line(g2.point(-1, 0), g2.point(1, 0));
        const p = g2.point(2, 2);
        expect(p.isOnUnboundLine(l)).toEqual(false);
      });
    });

    describe('Points can be checked to be on or within a polygon', () => {
      let closedSquare;
      let square;
      beforeEach(() => {
        closedSquare = [
          g2.point(-1, -1),
          g2.point(-1, 1),
          g2.point(1, 1),
          g2.point(1, -1),
          g2.point(-1, -1),
        ];
        square = [
          g2.point(-1, -1),
          g2.point(-1, 1),
          g2.point(1, 1),
          g2.point(1, -1),
        ];
      });
      test('(0, 0) is within the closed unit square', () => {
        const p = g2.point(0, 0);
        expect(p.isInPolygon(closedSquare)).toEqual(true);
      });
      test('(0, 0) is within the open unit square', () => {
        const poly = [
          g2.point(-1, -1),
          g2.point(-1, 1),
          g2.point(1, 1),
          g2.point(1, -1)];
        const p = g2.point(0, 0);
        expect(p.isInPolygon(poly)).toEqual(true);
      });
      test('(2, 2) is not within the open unit square', () => {
        const p = g2.point(2, 2);
        expect(p.isInPolygon(square)).toEqual(false);
      });
      test('(1, 1) is not within the open unit square', () => {
        const p = g2.point(1, 1);
        expect(p.isInPolygon(square)).toEqual(false);
      });
      test('(1, 1) is on the corner of the open unit square', () => {
        const p = g2.point(1, 1);
        expect(p.isOnPolygon(square)).toEqual(true);
      });
      test('1, 0 is on the side of the open unit square', () => {
        const p = g2.point(1, 0);
        expect(p.isOnPolygon(square)).toEqual(true);
      });
    });
  });
  describe('Lines', () => {
    describe('Lines can be defined with points', () => {
      test('Line from (0, 0) to (0, 1)', () => {
        const l = g2.line(g2.point(0, 0), g2.point(0, 1));
        expect(l.A).toEqual(1);
        expect(l.B).toEqual(0);
        expect(l.C).toEqual(0);
      });
      test('Line from (0, 0) to (1, 1)', () => {
        const l = g2.line(g2.point(0, 0), g2.point(1, 1));
        expect(l.A).toEqual(1);
        expect(l.B).toEqual(-1);
        expect(l.C).toEqual(0);
      });
      test('Line from (3, -2) to (5, 4)', () => {
        const l = g2.line(g2.point(3, -2), g2.point(5, 4));
        expect(l.A).toEqual(6);
        expect(l.B).toEqual(-2);
        expect(l.C).toEqual(22);
      });
    });
    describe('Lines can have a length', () => {
      test('Line from 0, 0 to 0, 1 has length 1', () => {
        const l = g2.line(g2.point(0, 0), g2.point(0, 1));
        expect(l.length()).toEqual(1);
      });
      test('Line from 1, 1 to 11, 11 has length 14.7', () => {
        const l = g2.line(g2.point(1, 1), g2.point(11, 11));
        expect(round(l.length(), 5)).toEqual(round(Math.sqrt(2) * 10), 5);
      });
    });
    describe('Lines can have midpoints', () => {
      test('Line from 0, 0 to 0, 2 has midpoint 0, 1', () => {
        const l = g2.line(g2.point(0, 0), g2.point(0, 2));
        expect(l.midpoint().round()).toEqual(g2.point(0, 1));
      });
      test('Line from 0, 0 to 2, 2 has midpoint 1, 1', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        expect(l.midpoint().round()).toEqual(g2.point(1, 1));
      });
      test('Line from 2, 0 to 4, 0 has midpoint 3, 0', () => {
        const l = g2.line(g2.point(2, 0), g2.point(4, 0));
        expect(l.midpoint().round()).toEqual(g2.point(3, 0));
      });
    });
    describe('Lines can have points within them', () => {
      test('Line <0, 0 2, 0> has point 1, 0 within it', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 0));
        const p = g2.point(1, 0);
        expect(l.hasPointOn(p)).toEqual(true);
      });
      test('Line <0, 0 2, 2> has point 1, 1 within it', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        const p = g2.point(1, 1);
        expect(l.hasPointOn(p)).toEqual(true);
      });
      test('Line <0, 0 2, 2> has point 2, 2 within it', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        const p = g2.point(2, 2);
        expect(l.hasPointOn(p)).toEqual(true);
      });
      test('Line <0, 0 2, 2> does not have point 3, 3 within it', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        const p = g2.point(3, 3);
        expect(l.hasPointOn(p)).toEqual(false);
      });
      test('Line <0, 0 2, 2> has point 3, 3 on it when unbound', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        const p = g2.point(3, 3);
        expect(l.hasPointAlong(p)).toEqual(true);
      });
      test('Line <0, 0 2, 2> does not have point 0, 3 on it when unbound', () => {
        const l = g2.line(g2.point(0, 0), g2.point(2, 2));
        const p = g2.point(0, 3);
        expect(l.hasPointAlong(p)).toEqual(false);
      });
    });
    describe('Lines can be compared to other lines', () => {
      test('Line 1 is same as Line 2', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const result = l1.isEqualTo(l2);
        const result1 = l1.isOnSameLineAs(l2);
        expect(result).toEqual(true);
        expect(result1).toEqual(true);
      });
      test('Line 1 is not same as Line 2', () => {
        const l1 = g2.line(g2.point(0, 0.01), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const result = l1.isEqualTo(l2);
        expect(result).not.toEqual(true);
      });
      test('Line 1 is same as Line 2 with 0 precision', () => {
        const l1 = g2.line(g2.point(0, 0.1), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const result = l1.isEqualTo(l2, 0);
        expect(result).not.toEqual(true);
      });
      test('Line 1 is same as Line 2 with 1 precision', () => {
        const l1 = g2.line(g2.point(0, 0.01), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const result = l1.isEqualTo(l2, 1);
        expect(result).not.toEqual(true);
      });
      test('Line 1 is on the same line as Line 2', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const result = l1.isOnSameLineAs(l2);
        expect(result).toEqual(true);
      });
      test('Line 1 is on the same line as Line 2 - test 2', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(1, 1));
        const l2 = g2.line(g2.point(2, 2), g2.point(3, 3));
        const result = l1.isOnSameLineAs(l2);
        expect(result).toEqual(true);
      });
      test('Line 1 is on the same line as Line 2 - test 3', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(1, 1));
        const l2 = g2.line(g2.point(0, 1), g2.point(1, 2));
        const result = l1.isOnSameLineAs(l2);
        expect(result).not.toEqual(true);
      });
    });
    describe('Lines can intersect with other lines', () => {
      test('Line 0, 0<>2, 0 with 1, -1<>1, 1 has intersection 1, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, -1), g2.point(1, 1));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect).toEqual(g2.point(1, 0));
      });
      test('Line 0, 0<>2, 0 with 1, -1<>1, -0.5 has intersection 1, 0 which is outside the line definition', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, -1), g2.point(1, -0.5));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(false);
        expect(result.intersect).toEqual(g2.point(1, 0));
      });
      test('Line 0, 0<>2, 0 with 0, 1<>2, 1 has no intersection', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 1), g2.point(2, 1));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(false);
        expect(result.inLine).toEqual(false);
      });
      test('Line 0, 0<>2, 0 with 4, 0<>5, 0 has as intersection at 3, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(4, 0), g2.point(5, 0));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(false);
        expect(result.intersect).toEqual(g2.point(3, 0));
      });
      test('Line 1, 0<>2, 0 with 0, 0<>4, 0 has as intersection at 2.75, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect.round()).toEqual(g2.point(1.75, 0));
      });
      test('Line 0, 0<>2, 0 with 1, 0<>4, 0 has as intersection at 1.5, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, 0), g2.point(4, 0));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect.round()).toEqual(g2.point(1.5, 0));
      });
      test('Line 1, 0<>2, 0 with 1, 0<>4, 0 has as intersection at 1.5, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, 0), g2.point(4, 0));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect).toEqual(g2.point(2, 0));
      });
      test('Line 1, 0<>2, 0 with 2, 0<>3, 0 has as intersection at 2, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(2, 0), g2.point(3, 0));
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect).toEqual(g2.point(2, 0));
      });
      // 0.804, y: 0.04029297190976889
      test('Line 1, 0<>2, 0 with 2, 0<>3, 0 has as intersection at (2, 0) 2', () => {
        const l1 = g2.line(
          g2.point(0.804, 0.04029297190976889),
          g2.point(0.804, 0.05036621488721111),
        );
        const l2 = g2.line(
          g2.point(0.804, 0.05036621488721111),
          g2.point(0.804, 0.06043945786465334),
        );
        const result = l1.intersectsWith(l2);
        expect(result.onLine).toEqual(true);
        expect(result.inLine).toEqual(true);
        expect(result.intersect).toEqual(g2.point(0.804, 0.05036621488721111));
      });
    });
  });

  describe('Minimum angle difference can be calculated from two angles', () => {
    test('30 - 20 = 10', () => {
      const result = g2.minAngleDiff(30 * Math.PI / 180, 20 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(10 * Math.PI / 180, 8));
    });
    test('20 - 30 = -10', () => {
      const result = g2.minAngleDiff(20 * Math.PI / 180, 30 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-10 * Math.PI / 180, 8));
    });
    test('10 - -10 = 20', () => {
      const result = g2.minAngleDiff(10 * Math.PI / 180, -10 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(20 * Math.PI / 180, 8));
    });
    test('-10 - 10 = -20', () => {
      const result = g2.minAngleDiff(-10 * Math.PI / 180, 10 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-20 * Math.PI / 180, 8));
    });
    test('10 - 350 = 20', () => {
      const result = g2.minAngleDiff(10 * Math.PI / 180, 350 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(20 * Math.PI / 180, 8));
    });
    test('350 - 10 = -20', () => {
      const result = g2.minAngleDiff(350 * Math.PI / 180, 10 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-20 * Math.PI / 180, 8));
    });
    test('350 - 0 = -10', () => {
      const result = g2.minAngleDiff(350 * Math.PI / 180, 0 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-10 * Math.PI / 180, 8));
    });
    test('370 - 350 = 20', () => {
      const result = g2.minAngleDiff(370 * Math.PI / 180, 350 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(20 * Math.PI / 180, 8));
    });
    test('350 - 370 = -20', () => {
      const result = g2.minAngleDiff(350 * Math.PI / 180, 370 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-20 * Math.PI / 180, 8));
    });
    test('170 - 190 = -20', () => {
      const result = g2.minAngleDiff(170 * Math.PI / 180, 190 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(-20 * Math.PI / 180, 8));
    });
    test('190 - 170 = 20', () => {
      const result = g2.minAngleDiff(190 * Math.PI / 180, 170 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(20 * Math.PI / 180, 8));
    });
  });
  describe('Angles can be normalized to between 0 and 360', () => {
    test('30 -> 30', () => {
      const result = g2.normAngle(30 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(30 * Math.PI / 180, 8));
    });
    test('-30 -> 330', () => {
      const result = g2.normAngle(-30 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(330 * Math.PI / 180, 8));
    });
    test('360 -> 0', () => {
      const result = g2.normAngle(360 * Math.PI / 180);
      expect(Math.round(result, 8)).toEqual(Math.round(0 * Math.PI / 180, 8));
    });
  });
});
