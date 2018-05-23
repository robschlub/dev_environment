
import { TextObject, DiagramFont, DiagramText } from './TextObject';
import { Point, Rect } from '../tools/g2';
import * as m2 from '../tools/m2';
// import DrawContext2D from '../../__mocks__/DrawContext2DMock';
import DrawContext2D from '../DrawContext2D';

// jest.mock('../Gesture');

describe('Diagram Text Object', () => {
  let font;
  beforeEach(() => {
    font = new DiagramFont(
      'Helvetica Neue',
      '',
      1,
      '200',
      'center',
      'middle',
      [1, 1, 1, 1],
    );
  });
  describe('DiagramFont', () => {
    test('Instantiate default', () => {
      const df = new DiagramFont();
      const expected = new DiagramFont(
        'Helvetica Neue',
        '',
        1,
        '200',
        'center',
        'middle',
        null,
      );
      expect(df).toEqual(expected);
    });
    test('Color', () => {
      expect(font.color).toBe('rgba(255,255,255,255)');
    });
    test('set', () => {
      const ctx = {};
      font.set(ctx, 2);
      expect(ctx.font).toBe(' 200 2px Helvetica Neue');
      expect(ctx.textAlign).toBe('center');
      expect(ctx.textBaseline).toBe('middle');
    });
  });

  describe('DiagramText', () => {
    test('Instantiation', () => {
      const location = new Point(1, 1);
      const text = 'test text';
      const dt = new DiagramText(
        location,
        text,
        font,
      );
      expect(dt.location).toBe(location);
      expect(dt.font).toBe(font);
      expect(dt.text).toBe(text);
    });
  });

  describe('Text Object', () => {
    test('Instantiation Default', () => {
      const to = new TextObject();
      expect(to.drawContext2D).toBe(undefined);
      expect(to.text).toEqual([]);
    });
    test.only('text size', () => {
      const dt = [
        new DiagramText(new Point(-1, 0), '-1', font),
        new DiagramText(new Point(0, 0), '0 this is a test', font),
        new DiagramText(new Point(1, 0), '1', font),
        new DiagramText(new Point(0, 1), 'i', font),
        new DiagramText(new Point(0, -1), '-i', font),
      ];
      const { body } = document;
      const canvas = document.createElement('canvas');
      canvas.style.width = '1000px';
      canvas.style.height = '500px';
      canvas.setAttribute('id', 'id_canvas');
      body.appendChild(canvas);
      const draw2D = new DrawContext2D(canvas);
      const to = new TextObject(draw2D, dt);
      console.log(to.getGLBoundaries(m2.identity()))
      expect(true);
    })
  });
});
// describe('TextObject', () => {
//   let drawContext2D;

//   beforeEach(() => {
//     drawContext2D = new DrawContext2D(1000, 500);
//   });
//   test('Simple', () => {
//     const t = new TextObject(drawContext2D, 'test', new Point(0, 0), ['left', 'bottom'], new Point(0, 0));
//     // const border = t.getBorder();
//     expect(t).not.toBe(null);
//     // expect(border).toHaveLength(5);
//   });
// });
