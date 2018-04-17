// @flow

import { DiagramElementPrimative } from '../Element';
import { Point, Rect } from '../;
import * as m2 from '../m2';
import WebGLInstance from '../webgl';
import TRIHorizontalLine from '../vertexObjects/Triangles/TRIHorizontalLine';
import TRIParallelLines from '../vertexObjects/Triangles/TRIParallelLines';



function transformPoints(
  points: Array<number>,
  transformMatrix: Array<number>) {
  const newPoints = [];
  for (let i = 0; i < points.length; i += 2) {
      let p = new Point(points[i], points[i + 1]);
      p = p.transformBy(t);
      newPoints.push(p.x);
      newPoints.push(p.y);
    }
  return newPoints;
} 

class Axis extends DiagramElementCollection {
  num: number;
  spacing: number;
  rotation: number;
  start: Point;

  constructor(
    webgl: WebGLInstance,
    AxisProperties: AxistProperties = new AxisProperties(),
    limits: Rect = new Rect(-1, -1, 2, 2),
  ) {
    const a = AxisProperties;
    const t = Transform().rotate(rotation).translate(start).matrix();

    let points = [];
    let border = [];
    if (a.width > 0) {
      { points, border } = TRIHorizontalLine(
        new Point(0, 0),
        a.start,
        a.length,
        a.width,
        0,
      );
    }
    points = transformPoints(points, t);
    border = border.map(x => x.transformBy(t));
    const line = new DiagramElementPrimative()

    points = [];
    border = [];
    if (a.majorTicks) {
      { points, border } = TRIParallelLines(
        Math.floor(a.length / a.majorTickSpacing),
        a.majorTickSpacing,
        new Point(0, 0),
        a.majorTickHeight,
        a.majorTickWidth,
        false,
        false,
      )
    }
    points = transformPoints(points, t);
    border = border.map(x => x.transformBy(t));

    let pointsMajorGrid = [];
    let borderMajorGrid = [];
    if (a.majorGrid) {
      { pointsMajorGrid, borderMajorGrid } = TRIParallelLines(
        Math.floor(a.length / a.majorTickSpacing),
        a.majorTickSpacing,
        new Point(0, 0),
        a.majorGridHeight,
        a.majorGridWidth,
        false,
        false,
      )
    }

    let pointsMinor = [];
    let borderMinor = [];
    if (a.minorTicks > 0) {
      { pointsMinor, borderMinor } = TRIParallelLines(
        Math.floor(a.length / a.minorTickSpacing),
        a.minorTickSpacing,
        new Point(0, 0),
        a.minorTickHeight,
        a.minorTickWidth,
        false,
        false,
      )
    }

    let pointsMinorGrid = [];
    let borderMinorGrid = [];
    if (a.minorGrid) {
      { pointsMinorGrid, borderMinorGrid } = TRIParallelLines(
        Math.floor(a.length / a.majorTickSpacing),
        a.majorTickSpacing,
        new Point(0, 0),
        a.minorGridHeight,
        a.minorGridWidth,
        false,
        false,
      )
    }

    
    const points = [
      ...pointsAxis,
      ...pointsMajor,
      ...pointsMinor,
      ...pointsMajorGrid,
      ...pointsMinorGrid,
    ].map(x => x.transformBy(t));
    const border = [
      [pointsAxis.map(x => x.transformBy(t))],
      [pointsMajor.map(x => x.transformBy(t))],
      [pointsMinor.map(x => x.transformBy(t))],
      [pointsMajorGrid.map(x => x.transformBy(t))],
      [pointsMinorGrid.map(x => x.transformBy(t))],
    ]

  }
  
}

export default Axis;
