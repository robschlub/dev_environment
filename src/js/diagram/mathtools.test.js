import { round, decelerate, easeinout } from './mathtools';

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
});
