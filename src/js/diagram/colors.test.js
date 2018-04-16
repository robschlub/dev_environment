import cssColors from './cssColors';
import getColors from './colors';
import { round } from './mathtools';

jest.mock('./cssColors');

describe('Get colors from scss', () => {
  describe('Hex values', () => {
    test('#FF00FF = [1, 0, 1, 1]', () => {
      cssColors.mockReturnValue({ colorRed: '#ff00ff' });
      const cols = getColors();
      expect(cols.colorRed).toEqual([1, 0, 1, 1]);
      expect(Object.keys(cols)).toHaveLength(1);
    });

    test('#4d78a1 = [77/255, 120/255, 161/255, 1]', () => {
      cssColors.mockReturnValue({ colorRed: '#4d78a1' });
      const result = round(getColors().colorRed, 5);
      const exp = round([77, 120, 161, 255].map(x => x / 255.0), 5);
      expect(result).toEqual(exp);
    });
  });

  describe('RGB values', () => {
    test('Normal rgb', () => {
      cssColors.mockReturnValue({ colorRed: 'rgb(255, 0, 255)' });
      const cols = getColors();
      expect(cols.colorRed).toEqual([1, 0, 1, 1]);
    });

    test('rgb with random spaces', () => {
      cssColors.mockReturnValue({ colorRed: 'rgb( 77,  120 , 161 )' });
      const result = round(getColors().colorRed, 5);
      const exp = round([77, 120, 161, 255].map(x => x / 255.0), 5);
      expect(result).toEqual(exp);
    });

    test('rgb in upper case', () => {
      cssColors.mockReturnValue({ colorRed: 'RGB(255, 0, 255)' });
      const cols = getColors();
      expect(cols.colorRed).toEqual([1, 0, 1, 1]);
    });

    test('rgba', () => {
      cssColors.mockReturnValue({ colorRed: 'rgb( 77,  120 , 161 , 12)' });
      const result = round(getColors().colorRed, 5);
      const exp = round([77, 120, 161, 12].map(x => x / 255.0), 5);
      expect(result).toEqual(exp);
    });
  });

  describe('Predefined css colors', () => {
    test('colorRed', () => {
      cssColors.mockReturnValue({ colorRed: 'red' });
      const cols = getColors();
      expect(cols.colorRed).toEqual([1, 0, 0, 1]);
    });

    test('navy', () => {
      cssColors.mockReturnValue({ colorRed: 'navy' });
      const cols = round(getColors().colorRed, 5);
      expect(cols).toEqual([0, 0, 0.50196, 1]);
    });
  });

  describe('Non color css variable', () => {
    test('dimHeight', () => {
      cssColors.mockReturnValue({ dimHeight: '34' });
      const cols = getColors();
      expect(Object.keys(cols)).toHaveLength(0);
    });
  });
});
