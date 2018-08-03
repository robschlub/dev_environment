import {
  round, decelerate, easeinout, clipMag, clipValue,
} from './mathtools';

describe('Math tools testing', () => {
  // Rounding a value
  test('Round a value that doesn\'t need rounding', () => {
    expect(round(10.0)).toEqual(10.0);
  });

  test('Round a value up to nearest whole number', () => {
    expect(round(9.51, 0)).toEqual(10.0);
  });

  test('Round a value at half way mark up to nearest whole number', () => {
    expect(round(9.5, 0)).toEqual(10.0);
  });

  test('Round a value down to nearest whole number', () => {
    expect(round(10.49, 0)).toEqual(10.0);
  });

  // Round an array
  test('Round an array of numbers whole numbers', () => {
    expect(round([0.5, 0.9, 1.2, 2.3], 0)).toEqual([1, 1, 1, 2]);
  });

  test('Round 1 element array', () => {
    expect(round([0.2])).toEqual([0.2]);
  });
  describe('decelerate', () => {
    test('initial: 0m, 10m/s - dec 1m/s/s for 1s', () => {
      const p1 = 0;           // m
      const v1 = 10;          // m/s
      const time = 1;         // s
      const dec = 1;          // m/s/s
      const zT = 0.1;         // m/s
      const v2 = 9;
      const p2 = 9.5;
      let r = decelerate(p1, v1, dec, time, zT);
      expect(r).toEqual({ v: v2, p: p2 });

      r = decelerate(p1, v1, -dec, time, zT);
      expect(r).toEqual({ v: v2, p: p2 });

      r = decelerate(p1, -v1, -dec, time, zT);
      expect(r).toEqual({ v: -v2, p: -p2 });
    });
    test('initial: 0m, 10m/s - dec 1m/s/s for 2s', () => {
      const p1 = 0;           // m
      const v1 = 10;          // m/s
      const time = 2;         // s
      const dec = 1;          // m/s/s
      const zT = 0.1;         // m/s
      const v2 = 8;
      const p2 = 18;
      const r = decelerate(p1, v1, dec, time, zT);
      expect(r).toEqual({ v: v2, p: p2 });
    });
    test('initial: 0m, 10m/s - dec 1m/s/s for 11s', () => {
      const p1 = 0;           // m
      const v1 = 10;          // m/s
      const time = 11;         // s
      const dec = 1;          // m/s/s
      const zT = 0.0001;         // m/s
      const v2 = 0;
      const p2 = 50;
      const r = decelerate(p1, v1, dec, time, zT);
      expect({ v: round(r.v), p: round(r.p) }).toEqual({ v: v2, p: p2 });
    });
    test('initial: 0m, 10m/s - dec 1m/s/s for two lots of 1s', () => {
      const p1 = 0;           // m
      const v1 = 10;          // m/s
      const time = 1;         // s
      const dec = 1;          // m/s/s
      const zT = 0.1;         // m/s
      const v2 = 9;
      const p2 = 9.5;
      const v3 = 8;
      const p3 = 18;
      let r = decelerate(p1, v1, dec, time, zT);
      expect(r).toEqual({ v: v2, p: p2 });
      r = decelerate(p2, v2, dec, time, zT);
      expect(r).toEqual({ v: v3, p: p3 });
    });
    describe('zero threshold', () => {
      let p1;
      let v1;
      let dec;
      let zT;
      beforeEach(() => {
        p1 = 0;           // m
        v1 = 10;          // m/s
        dec = 1;          // m/s/s
        zT = 5;           // m/s
      });
      test('Within Threshold', () => {
        const r = decelerate(p1, v1, dec, 1, zT);
        expect(r).toEqual({ v: 9, p: 9.5 });
      });
      test('Threshold boundary', () => {
        const r = decelerate(p1, v1, dec, 5, zT);
        expect(r).toEqual({ v: 0, p: 37.5 });
      });
      test('Threshold boundary, negative v', () => {
        const r = decelerate(p1, -v1, dec, 5, zT);
        expect(r).toEqual({ v: 0, p: -37.5 });
      });
      test('Beyond Threshold', () => {
        const r = decelerate(p1, v1, dec, 10, zT);
        expect(r).toEqual({ v: 0, p: 37.5 });
      });
      test('Beyond Threshold, negative threshold', () => {
        const r = decelerate(p1, v1, dec, 10, -zT);
        expect(r).toEqual({ v: 0, p: 37.5 });
      });
      test('Beyond Threshold, negative dec and threshold', () => {
        const r = decelerate(p1, v1, -dec, 10, -zT);
        expect(r).toEqual({ v: 0, p: 37.5 });
      });
      test('Beyond Threshold, negative v, dec and threshold', () => {
        const r = decelerate(p1, -v1, -dec, 10, -zT);
        expect(r).toEqual({ v: 0, p: -37.5 });
      });
    });
  });
  describe('easeinout', () => {
    test('0', () => {
      expect(easeinout(0)).toBe(0);
    });
    test('1', () => {
      expect(easeinout(1)).toBe(1);
    });
    test('0.5', () => {
      expect(easeinout(0.5)).toBe(0.5);
    });
    test('0.25', () => {
      expect(easeinout(0.25)).toBe(0.1);
    });
    test('0.75', () => {
      expect(easeinout(0.75)).toBe(0.9);
    });
  });
  describe('Clip Value', () => {
    test('No clipping', () => {
      expect(clipValue(1, 0.5, 1.5)).toBe(1);
      expect(clipValue(1, -1.5, 1.5)).toBe(1);
      expect(clipValue(0, -1.5, 1.5)).toBe(0);
      expect(clipValue(-1, -1.5, 1.5)).toBe(-1);
      expect(clipValue(-1, -1.5, -0.5)).toBe(-1);
    });
    test('Clipping', () => {
      expect(clipValue(1, 0.5, 0.6)).toBe(0.6);
      expect(clipValue(1, -0.5, 0.6)).toBe(0.6);
      expect(clipValue(-1, 0.5, 1.5)).toBe(0.5);
      expect(clipValue(-1, -0.5, 1.5)).toBe(-0.5);
      expect(clipValue(1, -1, 0)).toBe(0);
      expect(clipValue(-1, 0, 1)).toBe(0);
    });
  });
  describe('Clip Mag', () => {
    test('No clipping positive', () => {
      expect(clipMag(1, 0.1, 2)).toBe(1);
      expect(clipMag(1, -0.1, -2)).toBe(1);
    });
    test('No clipping negative', () => {
      expect(clipMag(-1, 0.1, 2)).toBe(-1);
      expect(clipMag(-1, -0.1, -2)).toBe(-1);
    });
    test('Max clipping positive', () => {
      expect(clipMag(3, 0.1, 2)).toBe(2);
      expect(clipMag(3, -0.1, -2)).toBe(2);
    });
    test('Max clipping negative', () => {
      expect(clipMag(-3, 0.1, 2)).toBe(-2);
      expect(clipMag(-3, -0.1, -2)).toBe(-2);
    });
    test('Min clipping positive', () => {
      expect(clipMag(0.05, 0.1, 2)).toBe(0);
      expect(clipMag(0.05, -0.1, -2)).toBe(0);
    });
    test('Min clipping negative', () => {
      expect(clipMag(-0.05, 0.1, 2)).toBe(0);
      expect(clipMag(-0.05, -0.1, -2)).toBe(0);
    });

    // Corner cases
    test('On max clipping positive', () => {
      expect(clipMag(2, 0.1, 2)).toBe(2);
      expect(clipMag(2, -0.1, -2)).toBe(2);
    });
    test('On max clipping negative', () => {
      expect(clipMag(-2, 0.1, 2)).toBe(-2);
      expect(clipMag(-2, -0.1, -2)).toBe(-2);
    });
    test('On min clipping positive', () => {
      expect(clipMag(0.1, 0.1, 2)).toBe(0);
      expect(clipMag(0.1, -0.1, -2)).toBe(0);
    });
    test('On min clipping negative', () => {
      expect(clipMag(-0.1, 0.1, 2)).toBe(0);
      expect(clipMag(-0.1, -0.1, -2)).toBe(0);
    });
  });
});
