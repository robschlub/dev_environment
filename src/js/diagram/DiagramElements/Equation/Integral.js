// @flow

import VertexIntegral from './VertexIntegral';
// import VertexPolygonFilled from '../../DrawingObjects/VertexObject/VertexPolygon';
import { DiagramElementPrimative } from '../../Element';
import { Point, Transform, Rect } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';

export default function Integral(
  webgl: WebGLInstance,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  // const serifSides = 30;
  // const serifRadius = 0.05;
  const vertices = new VertexIntegral(webgl, 2, true);
  // const serif = new VertexPolygonFilled(
  //   webgl,
  //   serifSides,
  //   serifRadius,
  //   0,
  //   new Point(0, 0),
  //   serifSides,
  // );
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation.copy();
  }
  return new DiagramElementPrimative(vertices, transform, color, diagramLimits);
}
