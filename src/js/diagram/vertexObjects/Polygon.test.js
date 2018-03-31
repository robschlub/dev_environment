
// import * as m2 from '../m2';
// import WebGLInstance from '../webgl';
// import VertexObject from './vertexObject';
import Polygon from './Polygon';
import * as g2 from '../g2';
import webgl from '../../__mocks__/WebGLInstanceMock';
import { round } from '../mathtools';

/* eslint-disable indent,comma-spacing,no-multi-spaces,space-in-parens */
describe('Polygon', () => {
  test('Initialization', () => {
    const polygon = new Polygon(webgl, 0.5, 5, 5, 0.02, 0, new g2.Point(0, 0));
    expect(polygon.radius).toBe(0.5);
    expect(polygon.outRad).toBe(0.51);
    expect(polygon.inRad).toBe(0.49);
    expect(polygon.numPoints).toBe(12);
    expect(polygon.center).toEqual(new g2.Point(0, 0));
    expect(round(polygon.dAngle)).toEqual(round(Math.PI * 2 / 5));
  });
  test('Square with corner radius 1 and thickness 0.1', () => {
    const square = new Polygon(webgl, 1, 4, 4, 0.2, 0, g2.point(0,0));
    const targetSquare = [
                         0.9,  0,
                         1.1,  0,
                         0  ,  0.9,
                         0  ,  1.1,
                        -0.9,  0,
                        -1.1,  0,
                         0  , -0.9,
                         0  , -1.1,
                         0.9,  0,
                         1.1,  0];
    const targetBorder = [
                         g2.point( 1.1,  0),
                         g2.point( 0  ,  1.1),
                         g2.point(-1.1,  0),
                         g2.point( 0  , -1.1),
                         g2.point( 1.1,  0)];
    expect(round(square.points)).toEqual(round(targetSquare));
    const squareBorder = square.border[0].map(point => point.round());
    expect(squareBorder).toEqual(targetBorder);
  });
});

/* eslint-enable indent */
