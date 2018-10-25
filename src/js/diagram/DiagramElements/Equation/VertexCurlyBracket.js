// @flow
import {
  Point, polarToRect, Transform,
} from '../../tools/g2';
import VertexBracket from './VertexBracket';

class VertexCurlyBracket extends VertexBracket {
  getPoints() {
    let w = 1 / 30;

    if (this.numLines > 1) {
      w /= this.numLines;
    }

    const r1 = w * 1.2;
    const r2 = r1 * 2;
    const p1 = new Point(r1, 0);
    const p2 = new Point(w + r2, 0);
    const r1Angle = Math.PI / 2 * 0.8;
    const h = r1 * Math.sin(r1Angle);
    const r2Angle = Math.asin(h / r2);
    const segments = 5;
    const r1AngleStep = r1Angle / segments;
    const r2AngleStep = r2Angle / segments;

    const cornerR1Points = [];
    const cornerR2Points = [];
    for (let i = 0; i <= segments; i += 1) {
      cornerR1Points.push(polarToRect(r1, Math.PI - r1Angle + i * r1AngleStep).add(p1));
      cornerR2Points.push(polarToRect(r2, Math.PI - r2Angle + i * r2AngleStep).add(p2));
    }

    const width = polarToRect(r2, Math.PI - r2Angle).add(p2).x;
    const height = h;

    const top = new Transform()
      .translate(width - w, this.mainHeight - height);
    const bottom = new Transform()
      .scale(0, -1)
      .translate(width - w, height);
    const middleTop = new Transform()
      .rotate(Math.PI)
      .translate(-width, -height);
    const middleBottom = new Transform()
      .rotate(Math.PI)
      .translate(-width, -height)
      .scale(0, -1);


    const leftPoints: Array<Point> = [
      ...cornerR1Points.map(p => p.transformBy(bottom.m())).reverse(),
      ...cornerR2Points.map(p => p.transformBy(middleBottom.m())).reverse(),
      ...cornerR2Points.map(p => p.transformBy(middleTop.m())).reverse(),
      ...cornerR1Points.map(p => p.transformBy(top.m())).reverse(),
    ];
    const rightPoints: Array<Point> = [
      ...cornerR2Points.map(p => p.transformBy(bottom.m())).reverse(),
      ...cornerR1Points.map(p => p.transformBy(middleBottom.m())).reverse(),
      ...cornerR1Points.map(p => p.transformBy(middleTop.m())).reverse(),
      ...cornerR2Points.map(p => p.transformBy(top.m())).reverse(),
    ];
    return { leftPoints, rightPoints, maxX: width };
  }
}
export default VertexCurlyBracket;

