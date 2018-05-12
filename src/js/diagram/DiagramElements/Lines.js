// @flow

import VertexLines from '../vertexObjects/VertexLines';
import { DiagramElementPrimative } from '../Element';
import { Point, Transform, Rect } from '../tools/g2';
import WebGLInstance from '../webgl/webgl';

function Lines(
  webgl: WebGLInstance,
  linePairs: Array<Array<Point>>,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  const vertexLine = new VertexLines(
    webgl,
    linePairs,
  );
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation.copy();
  }
  return new DiagramElementPrimative(vertexLine, transform, color, diagramLimits);
}

export default Lines;
