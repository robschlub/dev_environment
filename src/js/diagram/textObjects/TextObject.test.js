
import TextObject from './TextObject';
import { Point } from '../tools/g2';
import DrawContext2D from '../../__mocks__/DrawContext2DMock';

jest.mock('../Gesture');

describe('TextObject', () => {
  let drawContext2D;

  beforeEach(() => {
    drawContext2D = new DrawContext2D(1000, 500);
  });
  test('Simple', () => {
    const t = new TextObject(drawContext2D, 'test', new Point(0, 0), ['left', 'bottom'], new Point(0, 0));
    // const border = t.getBorder();
    expect(t).not.toBe(null);
    // expect(border).toHaveLength(5);
  });
});
