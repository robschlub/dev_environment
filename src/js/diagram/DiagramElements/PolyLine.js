// @flow

import VertexPolyLine from '../DrawingObjects/VertexObject/VertexPolyLine';
import type { TypeVertexPolyLineBorderToPoint } from '../DrawingObjects/VertexObject/VertexPolyLine';
import VertexPolyLineCorners from '../DrawingObjects/VertexObject/VertexPolyLineCorners';
import { DiagramElementPrimative } from '../Element';
import {
  Point, Transform, Rect,
} from '../tools/g2';
import WebGLInstance from '../webgl/webgl';

export type TypePolyLineBorderToPoint = TypeVertexPolyLineBorderToPoint;

function PolyLine(
  webgl: WebGLInstance,
  points: Array<Point>,
  close: boolean,
  lineWidth: number,
  color: Array<number>,
  borderToPoint: TypeVertexPolyLineBorderToPoint,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  const vertexLine = new VertexPolyLine(webgl, points, close, lineWidth, borderToPoint);
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }
  return new DiagramElementPrimative(vertexLine, transform, color, diagramLimits);
}

function PolyLineCorners(
  webgl: WebGLInstance,
  points: Array<Point>,
  close: boolean,
  cornerLength: number,
  lineWidth: number,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  const vertexLineCorners = new VertexPolyLineCorners(
    webgl,
    points,
    close,
    cornerLength,
    lineWidth,
  );
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation._dup();
  }
  return new DiagramElementPrimative(vertexLineCorners, transform, color, diagramLimits);
}

export { PolyLine, PolyLineCorners };
