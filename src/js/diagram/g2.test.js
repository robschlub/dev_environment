import * as g2 from './g2';
import { round } from './mathtools';

describe('g2 tests', () => {
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
      test('zero point', () => {
        const p = g2.Point.zero();
        expect(p).toEqual(g2.point(0, 0));
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

    describe('Points can be scaled', () => {
      test('(0, 0) * 2 = (0, 0)', () => {
        const p = new g2.Point(0, 0);
        const s = p.scale(2);
        expect(s).toEqual(p);
      });
      test('(1, -1) * 2 = (2, -2)', () => {
        const p = g2.point(1, -1);
        const s = p.scale(2);
        expect(s).toEqual(g2.point(2, -2));
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
        const res = l1.isEqualTo(l2);
        const res1 = l1.isOnSameLineAs(l2);
        expect(res).toEqual(true);
        expect(res1).toEqual(true);
      });
      test('Line 1 is not same as Line 2', () => {
        const l1 = g2.line(g2.point(0, 0.01), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const res = l1.isEqualTo(l2);
        expect(res).not.toEqual(true);
      });
      test('Line 1 is same as Line 2 with 0 precision', () => {
        const l1 = g2.line(g2.point(0, 0.1), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const res = l1.isEqualTo(l2, 0);
        expect(res).not.toEqual(true);
      });
      test('Line 1 is same as Line 2 with 1 precision', () => {
        const l1 = g2.line(g2.point(0, 0.01), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const res = l1.isEqualTo(l2, 1);
        expect(res).not.toEqual(true);
      });
      test('Line 1 is on the same line as Line 2', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const res = l1.isOnSameLineAs(l2);
        expect(res).toEqual(true);
      });
      test('Line 1 is on the same line as Line 2 - test 2', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(1, 1));
        const l2 = g2.line(g2.point(2, 2), g2.point(3, 3));
        const res = l1.isOnSameLineAs(l2);
        expect(res).toEqual(true);
      });
      test('Line 1 is on the same line as Line 2 - test 3', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(1, 1));
        const l2 = g2.line(g2.point(0, 1), g2.point(1, 2));
        const res = l1.isOnSameLineAs(l2);
        expect(res).not.toEqual(true);
      });
    });
    describe('Lines can intersect with other lines', () => {
      test('Line 0, 0<>2, 0 with 1, -1<>1, 1 has intersection 1, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, -1), g2.point(1, 1));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect).toEqual(g2.point(1, 0));
      });
      test('Line 0, 0<>2, 0 with 1, -1<>1, -0.5 has intersection 1, 0 which is outside the line definition', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, -1), g2.point(1, -0.5));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(false);
        expect(res.intersect).toEqual(g2.point(1, 0));
      });
      test('Line 0, 0<>2, 0 with 0, 1<>2, 1 has no intersection', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 1), g2.point(2, 1));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(false);
        expect(res.inLine).toEqual(false);
      });
      test('Line 0, 0<>2, 0 with 4, 0<>5, 0 has as intersection at 3, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(4, 0), g2.point(5, 0));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(false);
        expect(res.intersect).toEqual(g2.point(3, 0));
      });
      test('Line 1, 0<>2, 0 with 0, 0<>4, 0 has as intersection at 2.75, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(0, 0), g2.point(4, 0));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect.round()).toEqual(g2.point(1.75, 0));
      });
      test('Line 0, 0<>2, 0 with 1, 0<>4, 0 has as intersection at 1.5, 0', () => {
        const l1 = g2.line(g2.point(0, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, 0), g2.point(4, 0));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect.round()).toEqual(g2.point(1.5, 0));
      });
      test('Line 1, 0<>2, 0 with 1, 0<>4, 0 has as intersection at 1.5, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(1, 0), g2.point(4, 0));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect).toEqual(g2.point(2, 0));
      });
      test('Line 1, 0<>2, 0 with 2, 0<>3, 0 has as intersection at 2, 0', () => {
        const l1 = g2.line(g2.point(1, 0), g2.point(2, 0));
        const l2 = g2.line(g2.point(2, 0), g2.point(3, 0));
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect).toEqual(g2.point(2, 0));
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
        const res = l1.intersectsWith(l2);
        expect(res.onLine).toEqual(true);
        expect(res.inLine).toEqual(true);
        expect(res.intersect).toEqual(g2.point(0.804, 0.05036621488721111));
      });
    });
  });

  describe('Minimum angle difference can be calculated from two angles', () => {
    describe('Normal', () => {
      test('30 - 20 = 10', () => {
        const res = g2.minAngleDiff(30 * Math.PI / 180, 20 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(10 * Math.PI / 180, 8));
      });
      test('20 - 30 = -10', () => {
        const res = g2.minAngleDiff(20 * Math.PI / 180, 30 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-10 * Math.PI / 180, 8));
      });
      test('170 - 190 = -20', () => {
        const res = g2.minAngleDiff(170 * Math.PI / 180, 190 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-20 * Math.PI / 180, 8));
      });
      test('190 - 170 = 20', () => {
        const res = g2.minAngleDiff(190 * Math.PI / 180, 170 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(20 * Math.PI / 180, 8));
      });
    });
    describe('On either size of 0', () => {
      test('10 - -10 = 20', () => {
        const res = g2.minAngleDiff(10 * Math.PI / 180, -10 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(20 * Math.PI / 180, 8));
      });
      test('-10 - 10 = -20', () => {
        const res = g2.minAngleDiff(-10 * Math.PI / 180, 10 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-20 * Math.PI / 180, 8));
      });
      test('10 - 350 = 20', () => {
        const res = g2.minAngleDiff(10 * Math.PI / 180, 350 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(20 * Math.PI / 180, 8));
      });
      test('350 - 10 = -20', () => {
        const res = g2.minAngleDiff(350 * Math.PI / 180, 10 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-20 * Math.PI / 180, 8));
      });
      test('350 - 0 = -10', () => {
        const res = g2.minAngleDiff(350 * Math.PI / 180, 0 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-10 * Math.PI / 180, 8));
      });
      test('370 - 350 = 20', () => {
        const res = g2.minAngleDiff(370 * Math.PI / 180, 350 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(20 * Math.PI / 180, 8));
      });
      test('350 - 370 = -20', () => {
        const res = g2.minAngleDiff(350 * Math.PI / 180, 370 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-20 * Math.PI / 180, 8));
      });
    });
    describe('Same angles', () => {
      test('20 - 20 = 0', () => {
        const res = g2.minAngleDiff(20 * Math.PI / 180, 20 * Math.PI / 180);
        expect(round(res, 8)).toEqual(0);
      });
      test('20 - 380 = 0', () => {
        const res = g2.minAngleDiff(20 * Math.PI / 180, 380 * Math.PI / 180);
        expect(round(res, 8)).toEqual(0);
      });
      test('0 - 360 = 0', () => {
        const res = g2.minAngleDiff(0 * Math.PI / 180, 360 * Math.PI / 180);
        expect(round(res, 8)).toEqual(0);
      });
      test('90 - 450 = 0', () => {
        const res = g2.minAngleDiff(90 * Math.PI / 180, 450 * Math.PI / 180);
        expect(round(res, 8)).toEqual(0);
      });
    });
    describe('180 deg separation', () => {
      test('180 - 0 = 180', () => {
        const res = g2.minAngleDiff(Math.PI, 0);
        // console.log("res:", res, round(res, 8))
        expect(round(res, 8)).toEqual(round(Math.PI, 8));
      });
      test('0 - 180 = -180', () => {
        const res = g2.minAngleDiff(0, Math.PI);
        // console.log("res:", res, round(res, 8))
        expect(round(res, 8)).toEqual(round(-Math.PI, 8));
      });
      test('90 - 270 = -180', () => {
        const res = g2.minAngleDiff(90 * Math.PI / 180, 270 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(-Math.PI, 8));
      });
      test('270 - 90 = 180', () => {
        const res = g2.minAngleDiff(270 * Math.PI / 180, 90 * Math.PI / 180);
        expect(round(res, 8)).toEqual(round(Math.PI, 8));
      });
    });
  });
  describe('Angles can be normalized to between 0 and 360', () => {
    test('30 -> 30', () => {
      const res = g2.normAngle(30 * Math.PI / 180);
      expect(round(res, 8)).toEqual(round(30 * Math.PI / 180, 8));
    });
    test('-30 -> 330', () => {
      const res = g2.normAngle(-30 * Math.PI / 180);
      expect(round(res, 8)).toEqual(round(330 * Math.PI / 180, 8));
    });
    test('360 -> 0', () => {
      const res = g2.normAngle(360 * Math.PI / 180);
      expect(round(res, 8)).toEqual(round(0 * Math.PI / 180, 8));
    });
  });
  describe('Clip Velocity', () => {
    test('No clipping positive velocity', () => {
      expect(g2.clipValue(1, 0.1, 2)).toBe(1);
    });
    test('No clipping negative velocity', () => {
      expect(g2.clipValue(-1, 0.1, 2)).toBe(-1);
    });
    test('Max clipping positive velocity', () => {
      expect(g2.clipValue(3, 0.1, 2)).toBe(2);
    });
    test('Max clipping negative velocity', () => {
      expect(g2.clipValue(-3, 0.1, 2)).toBe(-2);
    });
    test('Min clipping positive velocity', () => {
      expect(g2.clipValue(0.05, 0.1, 2)).toBe(0);
    });
    test('Min clipping negative velocity', () => {
      expect(g2.clipValue(-0.05, 0.1, 2)).toBe(0);
    });

    // Corner cases
    test('On max clipping positive velocity', () => {
      expect(g2.clipValue(2, 0.1, 2)).toBe(2);
    });
    test('On max clipping negative velocity', () => {
      expect(g2.clipValue(-2, 0.1, 2)).toBe(-2);
    });
    test('On min clipping positive velocity', () => {
      expect(g2.clipValue(0.1, 0.1, 2)).toBe(0);
    });
    test('On min clipping negative velocity', () => {
      expect(g2.clipValue(-0.1, 0.1, 2)).toBe(0);
    });
  });
  describe('Transform', () => {
    test('Create rotation', () => {
      const t = new g2.Transform().rotate(Math.PI / 2);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t.matrix());
      expect(p1.round()).toEqual(new g2.Point(0, 1));
    });
    test('Create translation', () => {
      const t = new g2.Transform().translate(1, 1);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t.m());
      expect(p1.round()).toEqual(new g2.Point(2, 1));
    });
    test('Create scale', () => {
      const t = new g2.Transform().scale(2, 2);
      const p0 = new g2.Point(1, 0.5);
      const p1 = p0.transformBy(t.matrix());
      expect(p1.round()).toEqual(new g2.Point(2, 1));
    });
    test('Create R, T', () => {
      const t = new g2.Transform().rotate(Math.PI / 2).translate(1, 1);
      const p0 = new g2.Point(2, 0);
      const p1 = p0.transformBy(t.matrix());
      expect(p1.round()).toEqual(new g2.Point(1, 3));
    });
    test('Create S, R, T', () => {
      const t = new g2.Transform().scale(2, 2).rotate(Math.PI / 2).translate(1, 1);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t.matrix());
      expect(p1.round()).toEqual(new g2.Point(1, 3));
    });
    test('Create S, R, then T', () => {
      const t1 = new g2.Transform().scale(2, 2).rotate(Math.PI / 2);
      const t2 = t1.translate(1, 1);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t2.matrix());
      expect(p1.round()).toEqual(new g2.Point(1, 3));
    });
    test('Create S, R, T, T, S', () => {
      let t1 = new g2.Transform().scale(2, 2).rotate(Math.PI / 2);
      t1 = t1.translate(1, 1).translate(-5, 0).scale(2, 1);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t1.matrix());
      expect(p1.round()).toEqual(new g2.Point(-8, 3));
    });
    test('Update R in S, R, T', () => {
      const t = new g2.Transform().scale(2, 2).rotate(Math.PI).translate(1, 1);
      t.update(1).rotate(Math.PI / 2);
      const p0 = new g2.Point(1, 0);
      const p1 = p0.transformBy(t.matrix());
      expect(p1.round()).toEqual(new g2.Point(1, 3));
    });
    test('Get rotation', () => {
      const t = new g2.Transform().scale(2, 2).rotate(1).translate(1, 1)
        .rotate(2);
      expect(t.r()).toBe(1);
      expect(t.r(0)).toBe(1);
      expect(t.r(1)).toBe(2);
      expect(t.r(2)).toBe(null);
    });
    test('Update rotation', () => {
      const t = new g2.Transform()
        .scale(2, 2)
        .rotate(1)
        .translate(1, 1)
        .rotate(2);
      t.updateRotation(4);
      expect(t.r()).toBe(4);

      t.updateRotation(5, 0);
      expect(t.r(0)).toBe(5);

      t.updateRotation(6, 1);
      expect(t.r(1)).toBe(6);

      t.updateRotation(7, 2);
      expect(t.r(0)).toBe(5);
      expect(t.r(1)).toBe(6);
    });
    test('Update rotation checking matrix', () => {
      const t = new g2.Transform().rotate(0);
      const matrix = t.m();
      t.updateRotation(1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().rotate(1).m());
    });
    test('Update rotation at index matrix', () => {
      const t = new g2.Transform().rotate(0).rotate(1);
      const matrix = t.m();
      t.updateRotation(2, 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().rotate(2).m());
    });
    test('Update translation checking matrix', () => {
      const t = new g2.Transform().translate(0, 0);
      const matrix = t.m();
      t.updateTranslation(1, 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().translate(1, 1).m());
    });
    test('Update translation with point checking matrix', () => {
      const t = new g2.Transform().translate(0, 0);
      const matrix = t.m();
      t.updateTranslation(new g2.Point(1, 1));
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().translate(1, 1).m());
    });
    test('Update translation at index', () => {
      const t = new g2.Transform().translate(1, 1).translate(-1, 1);
      const matrix = t.m();
      t.updateTranslation(1, 1, 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().translate(2, 2).m());
    });
    test('Update translation at index with Point', () => {
      const t = new g2.Transform().translate(1, 1).translate(-1, 1);
      const matrix = t.m();
      t.updateTranslation(new g2.Point(1, 1), 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().translate(2, 2).m());
    });
    test('Update scale checking matrix', () => {
      const t = new g2.Transform().scale(0, 0);
      const matrix = t.m();
      t.updateScale(1, 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().scale(1, 1).m());
    });
    test('Update scale with point checking matrix', () => {
      const t = new g2.Transform().scale(0, 0);
      const matrix = t.m();
      t.updateScale(new g2.Point(1, 1));
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().scale(1, 1).m());
    });
    test('Update scale at index', () => {
      const t = new g2.Transform().scale(1, 1).scale(-1, 1);
      const matrix = t.m();
      t.updateScale(1, 1, 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().scale(1, 1).m());
    });
    test('Update scale at index with Point', () => {
      const t = new g2.Transform().scale(1, 1).scale(-1, 1);
      const matrix = t.m();
      t.updateScale(new g2.Point(1, 1), 1);
      expect(t.m()).not.toEqual(matrix);
      expect(t.m()).toEqual(new g2.Transform().scale(1, 1).m());
    });
    test('Get translation', () => {
      const t = new g2.Transform()
        .translate(0, 0).scale(2, 2).rotate(1)
        .translate(1, 1)
        .rotate(2);
      expect(t.t()).toEqual({ x: 0, y: 0 });
      expect(t.t(0)).toEqual({ x: 0, y: 0 });
      expect(t.t(1)).toEqual({ x: 1, y: 1 });
      expect(t.t(2)).toEqual(null);
    });
    test('Update translation', () => {
      const t = new g2.Transform()
        .translate(0, 0).scale(2, 2).rotate(1)
        .translate(1, 1)
        .rotate(2);
      t.updateTranslation(new g2.Point(2, 2));
      expect(t.t()).toEqual({ x: 2, y: 2 });

      t.updateTranslation(3, 3);
      expect(t.t()).toEqual({ x: 3, y: 3 });

      t.updateTranslation(4, 4, 0);
      expect(t.t()).toEqual({ x: 4, y: 4 });

      t.updateTranslation(5, 5, 1);
      expect(t.t(1)).toEqual({ x: 5, y: 5 });

      t.updateTranslation(5, 5, 2);
      expect(t.t(0)).toEqual({ x: 4, y: 4 });
      expect(t.t(1)).toEqual({ x: 5, y: 5 });
    });
    test('Get Scale', () => {
      const t = new g2.Transform()
        .scale(0, 0).translate(2, 2).rotate(1)
        .scale(1, 1)
        .rotate(2);
      expect(t.s()).toEqual({ x: 0, y: 0 });
      expect(t.s(0)).toEqual({ x: 0, y: 0 });
      expect(t.s(1)).toEqual({ x: 1, y: 1 });
      expect(t.s(2)).toEqual(null);
    });
    test('Update scale', () => {
      const t = new g2.Transform()
        .scale(0, 0).translate(2, 2).rotate(1)
        .scale(1, 1)
        .rotate(2);
      t.updateScale(new g2.Point(2, 2));
      expect(t.s()).toEqual({ x: 2, y: 2 });

      t.updateScale(3, 3);
      expect(t.s()).toEqual({ x: 3, y: 3 });

      t.updateScale(4, 4, 0);
      expect(t.s()).toEqual({ x: 4, y: 4 });

      t.updateScale(5, 5, 1);
      expect(t.s(1)).toEqual({ x: 5, y: 5 });

      t.updateScale(5, 5, 2);
      expect(t.s(0)).toEqual({ x: 4, y: 4 });
      expect(t.s(1)).toEqual({ x: 5, y: 5 });
    });
    test('is Similar to - single transform in order', () => {
      const t1 = new g2.Transform().scale(1, 1);
      const t2 = new g2.Transform().scale(2, 2);
      const t3 = new g2.Transform().translate(1, 1);
      const t4 = new g2.Transform().rotate(1);
      expect(t1.isSimilarTo(t2)).toBe(true);
      expect(t1.isSimilarTo(t3)).toBe(false);
      expect(t1.isSimilarTo(t4)).toBe(false);
    });
    test('is Similar to - two transforms in order', () => {
      const t1 = new g2.Transform().scale(1, 1).rotate(2);
      const t2 = new g2.Transform().scale(2, 2).rotate(4);
      const t3 = new g2.Transform().translate(1, 1).rotate(1);
      const t4 = new g2.Transform().rotate(1);
      const t5 = new g2.Transform().scale(1, 1).rotate(2).rotate(3);
      const t6 = new g2.Transform().scale(1, 1).scale(2, 2);
      expect(t1.isSimilarTo(t2)).toBe(true);
      expect(t1.isSimilarTo(t3)).toBe(false);
      expect(t1.isSimilarTo(t4)).toBe(false);
      expect(t1.isSimilarTo(t5)).toBe(false);
      expect(t1.isSimilarTo(t6)).toBe(false);
    });
    test('is Similar to - three transforms in order', () => {
      const t1 = new g2.Transform().scale(1, 1).rotate(2).translate(1, 1);
      const t2 = new g2.Transform().scale(2, 2).rotate(4).translate(2, 2);
      const t3 = new g2.Transform().translate(1, 1).rotate(1).scale(1, 1);
      const t4 = new g2.Transform().rotate(1);
      const t5 = new g2.Transform().scale(1, 1).rotate(2).rotate(3);
      const t6 = new g2.Transform().scale(1, 1).scale(2, 2);
      expect(t1.isSimilarTo(t2)).toBe(true);
      expect(t1.isSimilarTo(t3)).toBe(false);
      expect(t1.isSimilarTo(t4)).toBe(false);
      expect(t1.isSimilarTo(t5)).toBe(false);
      expect(t1.isSimilarTo(t6)).toBe(false);
    });
    test('Subtraction happy case', () => {
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().scale(0, 1).rotate(2).translate(3, 4);
      const ts = t1.sub(t2);
      expect(ts.s()).toEqual(new g2.Point(1, 1));
      expect(ts.r()).toEqual(1);
      expect(ts.t()).toEqual(new g2.Point(1, 1));
    });
    test('Subtraction sad case', () => {
      // Sad cases should just return the initial transform
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().rotate(0, 1).rotate(2).translate(3, 4);
      const t3 = new g2.Transform().scale(0, 1).rotate(2);
      let ts = t1.sub(t2);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());

      ts = t1.sub(t3);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());
    });
    test('Addition happy case', () => {
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().scale(0, 1).rotate(2).translate(3, 4);
      const ts = t1.add(t2);
      expect(ts.s()).toEqual(new g2.Point(1, 3));
      expect(ts.r()).toEqual(5);
      expect(ts.t()).toEqual(new g2.Point(7, 9));
    });
    test('Addition sad case', () => {
      // Sad cases should just return the initial transform
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().rotate(0, 1).rotate(2).translate(3, 4);
      const t3 = new g2.Transform().scale(0, 1).rotate(2);
      let ts = t1.add(t2);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());

      ts = t1.add(t3);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());
    });
    test('Multiply happy case', () => {
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().scale(0, 1).rotate(2).translate(3, 4);
      const ts = t1.mul(t2);
      expect(ts.s()).toEqual(new g2.Point(0, 2));
      expect(ts.r()).toEqual(6);
      expect(ts.t()).toEqual(new g2.Point(12, 20));
    });
    test('Multiply sad case', () => {
      // Sad cases should just return the initial transform
      const t1 = new g2.Transform().scale(1, 2).rotate(3).translate(4, 5);
      const t2 = new g2.Transform().rotate(0, 1).rotate(2).translate(3, 4);
      const t3 = new g2.Transform().scale(0, 1).rotate(2);
      let ts = t1.mul(t2);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());

      ts = t1.mul(t3);
      expect(ts.s()).toEqual(t1.s());
      expect(ts.r()).toEqual(t1.r());
      expect(ts.t()).toEqual(t1.t());
    });
    test('Zero', () => {
      const t1 = new g2.Transform().scale(1, 1).rotate(1).translate(1, 1);
      const t2 = t1.zero();
      expect(t2).toEqual(t1.sub(t1));
    });
    test('isZero', () => {
      const t1 = new g2.Transform().scale(1, 1).rotate(1).translate(1, 1);
      expect(t1.isZero()).toBe(false);
      const t2 = t1.zero();
      expect(t2.isZero()).toBe(true);
      const t3 = new g2.Transform().scale(0, 0).rotate(0).scale(1, 0);
      expect(t3.isZero()).toBe(false);
    });
    test('Constant', () => {
      const t1 = new g2.Transform().scale(1, 1).rotate(1).translate(1, 1);
      const t2 = t1.constant(2);
      expect(t2).toEqual(t1.add(t1));
    });
    test('Rounding', () => {
      const t1 = new g2.Transform()
        .scale(1.123456789, 1.12345678)
        .rotate(1.123456789)
        .translate(1.123456789, 1.12345678);
      let tr = t1.round();
      expect(tr.s()).toEqual(new g2.Point(1.12345679, 1.12345678));
      expect(tr.r()).toEqual(1.12345679);
      expect(tr.t()).toEqual(new g2.Point(1.12345679, 1.12345678));

      tr = t1.round(2);
      expect(tr.s()).toEqual(new g2.Point(1.12, 1.12));
      expect(tr.r()).toEqual(1.12);
      expect(tr.t()).toEqual(new g2.Point(1.12, 1.12));

      tr = t1.round(0);
      expect(tr.s()).toEqual(new g2.Point(1, 1));
      expect(tr.r()).toEqual(1);
      expect(tr.t()).toEqual(new g2.Point(1, 1));
    });
    test('Clipping', () => {
      const t1 = new g2.Transform()
        .scale(21, 20)
        .scale(0.1, 0.05)
        .scale(20, 0)
        .rotate(21)
        .rotate(20)
        .rotate(0.1)
        .rotate(0.05)
        .translate(21, 20)
        .translate(0.1, 0.05)
        .translate(0, 20)
        .translate(0, 21);
      const clipZero = new g2.TransformLimit(0.1, 0.1, 0.1);
      const clipMax = new g2.TransformLimit(20, 20, 20);
      let tc = t1.clip(clipZero, clipMax, false);
      expect(tc.s(0)).toEqual(new g2.Point(20, 20));
      expect(tc.s(1)).toEqual(new g2.Point(0, 0));
      expect(tc.s(2)).toEqual(new g2.Point(20, 0));
      expect(tc.r(0)).toBe(20);
      expect(tc.r(1)).toBe(20);
      expect(tc.r(2)).toBe(0);
      expect(tc.r(3)).toBe(0);
      expect(tc.t(0)).toEqual(new g2.Point(20, 20));
      expect(tc.t(1)).toEqual(new g2.Point(0, 0));
      expect(tc.t(2)).toEqual(new g2.Point(0, 20));
      expect(tc.t(3)).toEqual(new g2.Point(0, 20));

      // vector clipping
      tc = t1.clip(clipZero, clipMax);
      expect(tc.s(0).round(2)).toEqual(new g2.Point(14.48, 13.79));
      expect(tc.s(1).round(2)).toEqual(new g2.Point(0.1, 0.05));
      expect(tc.s(2).round(2)).toEqual(new g2.Point(20, 0));
      expect(tc.r(0)).toBe(20);
      expect(tc.r(1)).toBe(20);
      expect(tc.r(2)).toBe(0);
      expect(tc.r(3)).toBe(0);
      expect(tc.t(0).round(2)).toEqual(new g2.Point(14.48, 13.79));
      expect(tc.t(1).round(2)).toEqual(new g2.Point(0.1, 0.05));
      expect(tc.t(2).round(2)).toEqual(new g2.Point(0, 20));
      expect(tc.t(3).round(2)).toEqual(new g2.Point(0, 20));
    });
    test('Copy', () => {
      const t = new g2.Transform().scale(1, 1).rotate(1).translate(1, 1);
      const b = t.copy();
      expect(t).toEqual(b);
      expect(t).not.toBe(b);
      expect(t.order).not.toBe(b.order);
    });
    test('Velocity - Happy case', () => {
      const deltaTime = 1;
      const t0 = new g2.Transform()
        .scale(0, 0)          // to test velocity
        .scale(-1, -40)       // to test zero
        .scale(0, 0)         // to test max
        .scale(0, 0)         // to test max
        .rotate(0)            // to test velocity
        .rotate(1)            // to test zero
        .rotate(-1)           // to test max
        .translate(0, 0)      // to test velocity
        .translate(-1, -40)   // to test zero
        .translate(0, 0)     // to test max
        .translate(0, 0);    // to test max
      const t1 = new g2.Transform()
        .scale(-1, 1)
        .scale(-1.1414, -40.1414)
        .scale(14.1422, 14.1422)
        .scale(-14.1422, -14.1422)
        .rotate(-1)
        .rotate(1.1)
        .rotate(40)
        .translate(-1, 1)
        .translate(-1.1414, -40.1414)
        .translate(14.1422, 14.1422)
        .translate(-14.1422, -14.1422);
      const zero = new g2.TransformLimit(0.2, 0.2, 0.2);
      const max = new g2.TransformLimit(20, 20, 20);
      const v = t1.velocity(t0, deltaTime, zero, max);

      expect(v.s(0).round()).toEqual(new g2.Point(-1, 1));
      expect(v.s(1).round()).toEqual(new g2.Point(0, 0));
      expect(v.s(2).round(4)).toEqual(new g2.Point(14.1421, 14.1421));
      expect(v.s(3).round(4)).toEqual(new g2.Point(-14.1421, -14.1421));
      expect(v.r(0)).toBe(-1);
      expect(v.r(1)).toBe(0);
      expect(v.r(2)).toBe(20);
      expect(v.t(0).round()).toEqual(new g2.Point(-1, 1));
      expect(v.t(1).round()).toEqual(new g2.Point(0, 0));
      expect(v.t(2).round(4)).toEqual(new g2.Point(14.1421, 14.1421));
    });
    describe('Velocity - Sad case', () => {
      let deltaTime;
      let zero;
      let max;
      let t0;
      let t1;
      beforeEach(() => {
        deltaTime = 1;
        zero = new g2.TransformLimit(0.2, 0.2, 0.2);
        max = new g2.TransformLimit(20, 20, 20);
        t0 = new g2.Transform()
          .scale(0, 0)
          .rotate(0)
          .translate(0, 0);
        t1 = new g2.Transform()
          .scale(1, 1)
          .rotate(1)
          .translate(1, 1);
      });
      test('t0 not similar to t1', () => {
        t1 = new g2.Transform().rotate(1).scale(1, 1).translate(1, 1);
        const v = t1.velocity(t0, deltaTime, zero, max);
        expect(v.s()).toEqual(new g2.Point(0, 0));
        expect(v.r()).toEqual(0);
        expect(v.t()).toEqual(new g2.Point(0, 0));
      });
      // // If a transform element is missing from the zero transform, then no
      // // minimum will be applied
      // test('zero missing a transform element', () => {
      //   zero = new g2.Transform().rotate(0.2).scale(0.2, 0.2);
      //   t1 = new g2.Transform()
      //     .scale(0.2, -0.00001)
      //     .rotate(0.00001)
      //     .translate(0.2, 0.00001);
      //   const v = t1.velocity(t0, deltaTime, zero, max);
      //   expect(v).toEqual(t1);
      // });
      // // If a transform element is missing from the max transform, then
      // // no maximum will be applied.
      // test('max missing a transform element', () => {
      //   max = new g2.Transform().rotate(20).scale(20, 20);
      //   t1 = new g2.Transform()
      //     .scale(30, -100001)
      //     .rotate(100001)
      //     .translate(30, 100001);
      //   let v = t1.velocity(t0, deltaTime, zero, max);
      //   expect(v).toEqual(t1);

      //   // Test missing max when zero threshold is enforced.
      //   t1 = new g2.Transform()
      //     .scale(30, -100001)
      //     .rotate(100001)
      //     .translate(0.1, 100001);
      //   v = t1.velocity(t0, deltaTime, zero, max);
      //   const vExpected = t1.copy();
      //   vExpected.updateTranslation(0, 100001);
      //   expect(v).toEqual(vExpected);
      // });
    });
    // Calculation for deceleration:
    // s = function(sx, sy, vx, vy, d, t) {
    //   vel = sqrt(vx*vx+vy*vy);
    //   vNext = vel-d*t;
    //   angle = atan2(vy, vx);
    //   vx = vNext * cos(angle);
    //   vy = vNext * sin(angle);
    //   dist = vel*t - 0.5*d*t*t;
    //   x = sx + dist*cos(angle);
    //   y = sy + dist*sin(angle);
    //   return {vx, vy, x, y}
    // }
    describe('Deceleration', () => {
      let d;
      let t;
      let v;
      let z;
      beforeEach(() => {
        d = new g2.TransformLimit(Math.sqrt(2), 1, Math.sqrt(2));
        // Transform().scale(1, 1).rotate(1).translate(1, 1);
        v = new g2.Transform().scale(10, 10).rotate(10).translate(10, 10);
        t = new g2.Transform().scale(0, 0).rotate(0).translate(0, 0);
        z = new g2.TransformLimit(5, 5, 5);
        // Transform().scale(5, 5).rotate(5).translate(5, 5);
      });
      test('Simple deceleration', () => {
        const n = t.decelerate(v, d, 1, z);     // next v and t
        expect(n.v.round()).toEqual(new g2.Transform()
          .scale(9, 9).rotate(9).translate(9, 9));
        expect(n.t).toEqual(new g2.Transform()
          .scale(9.5, 9.5).rotate(9.5).translate(9.5, 9.5));
      });
      test('Negatives in deceleration and velocity', () => {
        d = new g2.TransformLimit(Math.sqrt(2), 1, Math.sqrt(2));
        v = new g2.Transform().scale(10, -10).rotate(-10).translate(10, -10);
        const n = t.decelerate(v, d, 1, z);     // next v and t
        expect(n.v.round()).toEqual(new g2.Transform()
          .scale(9, -9).rotate(-9).translate(9, -9));
        expect(n.t.round()).toEqual(new g2.Transform()
          .scale(9.5, -9.5).rotate(-9.5).translate(9.5, -9.5));
      });
      test.only('Zero thresholds', () => {
        d = new g2.TransformLimit(Math.sqrt(2), 1, Math.sqrt(2));
        v = new g2.Transform().scale(10, -10).rotate(-10).translate(10, -10);
        z = new g2.TransformLimit(5, 5, 5);
        const n = t.decelerate(v, d, 10, z);     // next v and t
        expect(n.v.round()).toEqual(new g2.Transform()
          .scale(0, 0).rotate(0).translate(0, 0));
        expect(n.t.round()).toEqual(new g2.Transform()
          .scale(43.75, -43.75).rotate(-37.5).translate(43.75, -43.75));
      });
    });
  });
});
