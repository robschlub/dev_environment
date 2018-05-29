// @flow

import VertexIntegral from './VertexIntegral';
import { DiagramElementPrimative } from '../../Element';
import { Point, Transform, Rect } from '../../tools/g2';
import WebGLInstance from '../../webgl/webgl';

export default function Integral(
  webgl: WebGLInstance,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  const vertices = new VertexIntegral(webgl);
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation.copy();
  }
  return new DiagramElementPrimative(vertices, transform, color, diagramLimits);
}
