import { round } from './mathtools';

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
});
