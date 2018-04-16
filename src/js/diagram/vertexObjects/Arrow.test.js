import Arrow from './Arrow';
import { Point } from '../g2';
import webgl from '../../__mocks__/WebGLInstanceMock';
import { round } from '../mathtools';

describe('Arrow', () => {
  test('Default', () => {
    const arrow = new Arrow(webgl);

    const border = [
      new Point(0, 0), new Point(-0.5, -0.5),
      new Point(-0.25, -0.5), new Point(-0.25, -1),
      new Point(0.25, -1), new Point(0.25, -0.5),
      new Point(0.5, -0.5), new Point(0, 0),
    ];
    const points = [
      0, 0,
      -0.5, -0.5,
      -0.25, -0.5,
      -0.25, -1,
      0.25, -1,
      0.25, -0.5,
      0.5, -0.5,
    ];

    expect(round(arrow.points)).toEqual(points);
    expect(arrow.border[0].map(x => x.round())).toEqual(border);
  });
  // test('Tip at 1, -1', () => {
  //   const tri = new IsoTriangle(webgl, 1, 1.5, new Point(1, -1));

  //   const border = [
  //     new Point(1, -1),
  //     new Point(0.5, -2.5),
  //     new Point(1.5, -2.5),
  //     new Point(1, -1),
  //   ];
  //   const points = [
  //     1, -1,
  //     0.5, -2.5,
  //     1.5, -2.5,
  //   ];

  //   expect(round(tri.points)).toEqual(points);
  //   expect(tri.border[0].map(x => x.round())).toEqual(border);
  // });
});
