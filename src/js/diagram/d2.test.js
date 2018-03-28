import * as d2 from './d2';

describe('d2 tests', () => {
  describe('Point Creation', () => {
    test('point(0, 0) creates a point at x=0, y=0', () => {
      const p = d2.point(0, 0);
      expect(p.x).toEqual(0);
      expect(p.y).toEqual(0);
    });
    test('point(2, -4) creates a point at x=2, y=-4', () => {
      const p = d2.point(2, -4);
      expect(p.x).toEqual(2);
      expect(p.y).toEqual(-4);
    });
  });

  describe('Points can be added to each other', () => {
    test('(0, 0) + (1, 1) = (1, 1)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 1);
      const s = p.add(q);
      expect(s).toEqual(d2.point(1, 1));
    });
    test('(0, 0) + (1, -1) = (1, -1)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, -1);
      const s = p.add(q);
      expect(s).toEqual(d2.point(1, -1));
    });
    test('(0, 0) + (1, 1) + (1, 1) = (2, 2)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 1);
      const s = p.add(q).add(q);
      expect(s).toEqual(d2.point(2, 2));
    });
  });

  describe('Points can be subtracted from each other', () => {
    test('(0, 0) - (1, 1) = (-1, -1)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 1);
      const s = p.sub(q);
      expect(s).toEqual(d2.point(-1, -1));
    });
    test('(0, 0) - (1, -1) = (-1, 1)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, -1);
      const s = p.sub(q);
      expect(s).toEqual(d2.point(-1, 1));
    });
    test('(0, 0) - (1, 1) - (1, 1) = (-2, -2)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 1);
      const s = p.sub(q).sub(q);
      expect(s).toEqual(d2.point(-2, -2));
    });
  });

  describe('Points can be rotated around 0, 0', () => {
    test('Rotate (1, 0) by 90 deg = (0, 1)', () => {
      const p = d2.point(1, 0);
      const s = p.rotate(Math.PI / 2);
      expect(s.round()).toEqual(d2.point(0, 1).round());
    });
    test('Rotate (1, 1) by -45 deg = (0, sqrt(2))', () => {
      const p = d2.point(1, 1);
      const s = p.rotate(-Math.PI / 4);
      expect(s.round()).toEqual(d2.point(Math.sqrt(2), 0).round());
    });
  });

  describe('Points can be rotated around other points', () => {
    test('Rotate (1, 0.5) by 90 deg around (0.5, 0.5) = (0.5, 1)', () => {
      const p = d2.point(1, 0.5);
      const q = d2.point(0.5, 0.5);
      const s = p.rotate(Math.PI / 2, q);
      expect(s.round()).toEqual(d2.point(0.5, 1).round());
    });
    test('Rotate (1, 1) by -45 deg around (-1, -1) = (2*sqrt(2)-1, -1)', () => {
      const p = d2.point(1, 1);
      const q = d2.point(-1, -1);
      const s = p.rotate(-Math.PI / 4, q);
      expect(s.round()).toEqual(d2.point(2 * Math.sqrt(2) - 1, -1).round());
    });
  });

  describe('Points can be compared to other points', () => {
    test('(0, 0) == (0, 0)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(0, 0);
      expect(p.isEqualTo(q)).toEqual(true);
    });
    test('(-1, 4) == (-1, 4)', () => {
      const p = d2.point(-1, 4);
      const q = d2.point(-1, 4);
      expect(p.isEqualTo(q)).toEqual(true);
    });
    test('(0, 0) != (1, 0)', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 0);
      expect(p.isEqualTo(q)).toEqual(false);
    });
    test('0.001, 0.001 != 0, 0 with precision 3', () => {
      const p = d2.point(0.001, 0.001);
      const q = d2.point(0, 0);
      expect(p.isEqualTo(q, 3)).toEqual(false);
    });
    test('(0.001, 0.001) == (0, 0) with precision 2', () => {
      const p = d2.point(0.001, 0.001);
      const q = d2.point(0, 0);
      expect(p.isEqualTo(q, 2)).toEqual(true);
    });
    test('(-0, 0) == (0, 0)', () => {
      const p = d2.point(-0, 0);
      const q = d2.point(0, 0);
      expect(p.isEqualTo(q)).toEqual(true);
    });
    test('(0, 0) != (1, 0) using isNotEqualTo', () => {
      const p = d2.point(0, 0);
      const q = d2.point(1, 0);
      expect(p.isNotEqualTo(q)).toEqual(true);
    });
  });

  describe('Points can be on a line', () => {
    test('(0, 0) is within the line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(0, 0);
      expect(p.isOnLine(l)).toEqual(true);
    });
    test('(1, 0) is within the line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(1, 0);
      expect(p.isOnLine(l)).toEqual(true);
    });
    test('(0, 1) is not within the line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(0, 1);
      expect(p.isOnLine(l)).toEqual(false);
    });
    test('(2, 0) is not within the line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(2, 0);
      expect(p.isOnLine(l)).toEqual(false);
    });
    test('(2, 0) is on the unbound line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(2, 0);
      expect(p.isOnUnboundLine(l)).toEqual(true);
    });
    test('(2, 2) is not on the unbound line <(-1, 0) (1, 0)>', () => {
      const l = d2.line(d2.point(-1, 0), d2.point(1, 0));
      const p = d2.point(2, 2);
      expect(p.isOnUnboundLine(l)).toEqual(false);
    });
  });

  describe('Points can be checked to be on or within a polygon', () => {
    let closedSquare;
    let square;
    beforeEach(() => {
      closedSquare = [
        d2.point(-1, -1),
        d2.point(-1, 1),
        d2.point(1, 1),
        d2.point(1, -1),
        d2.point(-1, -1),
      ];
      square = [
        d2.point(-1, -1),
        d2.point(-1, 1),
        d2.point(1, 1),
        d2.point(1, -1),
      ];
    });
    it('(0, 0) is within the closed unit square', () => {
      const p = d2.point(0, 0);
      expect(p.isInPolygon(closedSquare)).toEqual(true);
    });
    it('(0, 0) is within the open unit square', () => {
      const poly = [
        d2.point(-1, -1),
        d2.point(-1, 1),
        d2.point(1, 1),
        d2.point(1, -1)];
      const p = d2.point(0, 0);
      expect(p.isInPolygon(poly)).toEqual(true);
    });
    it('(2, 2) is not within the open unit square', () => {
      const p = d2.point(2, 2);
      expect(p.isInPolygon(square)).toEqual(false);
    });
    it('(1, 1) is not within the open unit square', () => {
      const p = d2.point(1, 1);
      expect(p.isInPolygon(square)).toEqual(false);
    });
    it('(1, 1) is on the corner of the open unit square', () => {
      const p = d2.point(1, 1);
      expect(p.isOnPolygon(square)).toEqual(true);
    });
    it('1, 0 is on the side of the open unit square', () => {
      const p = d2.point(1, 0);
      expect(p.isOnPolygon(square)).toEqual(true);
    });
  });
});
