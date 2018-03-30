import cssColors from './cssColors';
import getColors from './colors';
import { round } from './mathtools';

jest.mock('./cssColors');

describe('Get colors from scss', () => {
  describe('Hex values', () => {
    test('#FF00FF = [1, 0, 1, 1]', () => {
      cssColors.mockReturnValue({ red: '#ff00ff' });
      const cols = getColors();
      expect(cols.red).toEqual([1, 0, 1, 1]);
    });

    test('#4d78a1 = [77/255, 120/255, 161/255, 1]', () => {
      cssColors.mockReturnValue({ red: '#4d78a1' });
      const result = round(getColors().red, 5);
      const exp = round([77, 120, 161, 255].map(x => x / 255.0), 5);
      expect(result).toEqual(exp);
    });
  });
});
