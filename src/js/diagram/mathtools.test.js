import { round, decelerate, easeinout, clipValue } from './mathtools';

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
    test('dec 1m/s/s for 1s', () => {
      const v1 = 10;          // m/s
      const time = 1;         // s
      const dec = 1;          // m/s/s
      const v2 = decelerate(v1, dec, time);
      expect(v2).toBe(9);
    });
    test('dec 1m/s/s for 2s', () => {
      const v1 = 10;   // m/s
      const time = 2;         // s
      const dec = 1;          // m/s/s
      const v2 = decelerate(v1, dec, time);
      expect(v2).toBe(8);
    });
    test('dec 1m/s/s for 8s', () => {
      const v1 = 10;   // m/s
      const time = 8;         // s
      const dec = 1;          // m/s/s
      const v2 = decelerate(v1, dec, time);
      expect(v2).toBe(2);
    });
    test('dec 1m/s/s for 8s in two lots of 4', () => {
      const v1 = 10;   // m/s
      const time = 4;         // s
      const dec = 1;          // m/s/s
      const v2 = decelerate(v1, dec, time);
      const v3 = decelerate(v2, dec, time);
      expect(v3).toBe(2);
    });
    test('dec 1m/s/s for 11s', () => {
      const v1 = 10;   // m/s
      const time = 11;         // s
      const dec = 1;          // m/s/s
      const v2 = decelerate(v1, dec, time);
      expect(v2).toBe(0);
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
    test('No clipping positive', () => {
      expect(clipValue(1, 0.1, 2)).toBe(1);
      expect(clipValue(1, -0.1, -2)).toBe(1);
    });
    test('No clipping negative', () => {
      expect(clipValue(-1, 0.1, 2)).toBe(-1);
      expect(clipValue(-1, -0.1, -2)).toBe(-1);
    });
    test('Max clipping positive', () => {
      expect(clipValue(3, 0.1, 2)).toBe(2);
      expect(clipValue(3, -0.1, -2)).toBe(2);
    });
    test('Max clipping negative', () => {
      expect(clipValue(-3, 0.1, 2)).toBe(-2);
      expect(clipValue(-3, -0.1, -2)).toBe(-2);
    });
    test('Min clipping positive', () => {
      expect(clipValue(0.05, 0.1, 2)).toBe(0);
      expect(clipValue(0.05, -0.1, -2)).toBe(0);
    });
    test('Min clipping negative', () => {
      expect(clipValue(-0.05, 0.1, 2)).toBe(0);
      expect(clipValue(-0.05, -0.1, -2)).toBe(0);
    });

    // Corner cases
    test('On max clipping positive', () => {
      expect(clipValue(2, 0.1, 2)).toBe(2);
      expect(clipValue(2, -0.1, -2)).toBe(2);
    });
    test('On max clipping negative', () => {
      expect(clipValue(-2, 0.1, 2)).toBe(-2);
      expect(clipValue(-2, -0.1, -2)).toBe(-2);
    });
    test('On min clipping positive', () => {
      expect(clipValue(0.1, 0.1, 2)).toBe(0.1);
      expect(clipValue(0.1, -0.1, -2)).toBe(0.1);
    });
    test('On min clipping negative', () => {
      expect(clipValue(-0.1, 0.1, 2)).toBe(-0.1);
      expect(clipValue(-0.1, -0.1, -2)).toBe(-0.1);
    });
  });
});
