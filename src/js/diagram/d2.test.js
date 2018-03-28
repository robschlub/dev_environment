import * as d2 from './d2';

describe('d2 tests', () => {
  it('point(0, 0) creates a point at x=0, y=0', () => {
    const p = d2.point(0, 0);
    expect(p.x).toEqual(0);
    expect(p.y).toEqual(0);
  });
  it('point(2, -4) creates a point at x=2, y=-4', () => {
    const p = d2.point(2, -4);
    expect(p.x).toEqual(2);
    expect(p.y).toEqual(-4);
  });

  // Points can be added to each other
  it('0, 0 + 1, 1 = 1, 1', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, 1);
    const s = p.add(q);
    expect(s).toEqual(d2.point(1, 1));
  });
  it('0, 0 + 1, -1 = 1, -1', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, -1);
    const s = p.add(q);
    expect(s).toEqual(d2.point(1, -1));
  });
  it('0, 0 + 1, 1 + 1, 1 = 2, 2', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, 1);
    const s = p.add(q).add(q);
    expect(s).toEqual(d2.point(2, 2));
  });

  // Points can be subtracted from each other
  it('0, 0 - 1, 1 = -1, -1', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, 1);
    const s = p.sub(q);
    expect(s).toEqual(d2.point(-1, -1));
  });
  it('0, 0 - 1, -1 = -1, 1', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, -1);
    const s = p.sub(q);
    expect(s).toEqual(d2.point(-1, 1));
  });
  it('0, 0 - 1, 1 - 1, 1 = -2, -2', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, 1);
    const s = p.sub(q).sub(q);
    expect(s).toEqual(d2.point(-2, -2));
  });

  // Points can be rotated around 0, 0
  it('1, 0 by 90 deg = 0, 1', () => {
    const p = d2.point(1, 0);
    const s = p.rotate(Math.PI / 2);
    expect(s.round()).toEqual(d2.point(0, 1).round());
  });
  it('1, 1 by -45 deg = 0, sqrt(2)', () => {
    const p = d2.point(1, 1);
    const s = p.rotate(-Math.PI / 4);
    expect(s.round()).toEqual(d2.point(Math.sqrt(2), 0).round());
  });

  // Points can be rotated around other points
  it('1, 0.5 by 90 deg around 0.5, 0.5 = 0.5, 1', () => {
    const p = d2.point(1, 0.5);
    const q = d2.point(0.5, 0.5);
    const s = p.rotate(Math.PI / 2, q);
    expect(s.round()).toEqual(d2.point(0.5, 1).round());
  });
  it('1, 1 by -45 deg around -1, -1 = 2*sqrt(2)-1, -1', () => {
    const p = d2.point(1, 1);
    const q = d2.point(-1, -1);
    const s = p.rotate(-Math.PI / 4, q);
    expect(s.round()).toEqual(d2.point(2 * Math.sqrt(2) - 1, -1).round());
  });

  // Points can be compared to other points
  it('0, 0 == 0, 0 = true', () => {
    const p = d2.point(0, 0);
    const q = d2.point(0, 0);
    expect(p.isEqualTo(q)).toEqual(true);
  });
  it('-1, 4 == -1, 4 = true', () => {
    const p = d2.point(-1, 4);
    const q = d2.point(-1, 4);
    expect(p.isEqualTo(q)).toEqual(true);
  });
  it('0, 0 == 1, 0 = false', () => {
    const p = d2.point(0, 0);
    const q = d2.point(1, 0);
    expect(p.isEqualTo(q)).toEqual(false);
  });
});
