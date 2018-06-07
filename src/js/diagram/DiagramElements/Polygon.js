// @flow

import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';
import VertexPolygonFilled from '../DrawingObjects/VertexObject/VertexPolygonFilled';
import { DiagramElementPrimative } from '../Element';
import { Point, Transform, Rect } from '../tools/g2';
import WebGLInstance from '../webgl/webgl';

function Polygon(
  webgl: WebGLInstance,
  numSides: number,
  radius: number,
  lineWidth: number,
  rotation: number,
  numSidesToDraw: number,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
) {
  const vertexLine = new VertexPolygon(
    webgl,
    numSides,
    radius,
    lineWidth,
    rotation,
    new Point(0, 0),
    numSidesToDraw,
  );
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation.copy();
  }
  return new DiagramElementPrimative(vertexLine, transform, color, diagramLimits);
}

function PolygonFilled(
  webgl: WebGLInstance,
  numSides: number,
  radius: number,
  rotation: number,
  numSidesToDraw: number,
  color: Array<number>,
  transformOrLocation: Transform | Point,
  diagramLimits: Rect,
  textureLocation: string = '',
) {
  const vertexLineCorners = new VertexPolygonFilled(
    webgl,
    numSides,
    radius,
    rotation,
    new Point(0, 0),
    numSidesToDraw,
    textureLocation,
  );
  let transform = new Transform();
  if (transformOrLocation instanceof Point) {
    transform = transform.translate(transformOrLocation.x, transformOrLocation.y);
  } else {
    transform = transformOrLocation.copy();
  }
  return new DiagramElementPrimative(vertexLineCorners, transform, color, diagramLimits);
}

export { Polygon, PolygonFilled };
