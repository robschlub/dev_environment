import cssColors from './cssColors';
import getColors from './colors';

jest.mock('./cssColors');

describe('Get colors from scss', () => {
  describe('Hex values', () => {
    test('#FF00FF = [1, 0, 1, 1]', () => {
      cssColors.mockReturnValue({ red: '#ff00ff' });
      const cols = getColors();
      console.log(cols)
      expect(cols.red).toEqual([1, 0, 1, 1]);
    });
  });
});
