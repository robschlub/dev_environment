// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

import makeAngle from '../../../../LessonsCommon/tools/angle';

import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

export default class TrianglePropertiesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: DiagramElementPrimative;
  _dim1: TypeLine;
  _dim2: TypeLine;
  _dim3: TypeLine;
  _angle1: TypeAngle;
  _angle2: TypeAngle;
  _angle3: TypeAngle;

  makeTriangle() {
    const layout = this.layout.properties;

    const line = this.diagram.shapes.polyLine(
      layout.triangle.points, true,
      layout.lineWidth, this.layout.colors.line,
      layout.triangle.position,
    );
    return line;
  }

  makeAngle(index: number) {
    const layout = this.layout.properties;
    const angle = makeAngle(
      this.diagram,
      layout.angleAnnotation.arc.radius,
      layout.angleAnnotation.arc.width,
      layout.angleAnnotation.arc.sides,
      this.layout.colors.angle,
    );
    angle.setPosition(layout.triangle.points[index].add(layout.triangle.position));

    const corner = layout.corners[index];
    const triPoints = layout.triangle.points;
    angle.setToCorner(
      triPoints[corner[0]].add(layout.triangle.position),
      triPoints[corner[1]].add(layout.triangle.position),
      triPoints[corner[2]].add(layout.triangle.position),
    );
    return angle;
  }

  makeDimension(index: number) {
    const layout = this.layout.properties.dimension;
    const line = makeLine(
      this.diagram, 'center', 2, layout.lineWidth,
      this.layout.colors.dimensions,
    );
    line.addArrow1(layout.arrowHeight, layout.arrowWidth);
    line.addArrow2(layout.arrowHeight, layout.arrowWidth);
    line.addLabel(`${index}a this`, 0.1, 'outside', 'left', 'horizontal', 0);
    const { triIndex, offset } = layout.locations[index];
    let triPoints = this.layout.properties.triangle.points;
    triPoints = triPoints.map(p => p.add(this.layout.properties.triangle.position));
    line.setEndPoints(triPoints[triIndex[0]], triPoints[triIndex[1]], offset);
    return line;
  }

  growDimensions() {
    this._dim1.grow(0.2, 1, true);
    this._dim2.grow(0.2, 1, true);
    this._dim3.grow(0.2, 1, true);
    this.diagram.animateNextFrame();
  }

  pulseAngles() {
    this._angle1.pulseScaleNow(1, 1.5);
    this._angle2.pulseScaleNow(1, 1.5);
    this._angle3.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.position);
    this.add('triangle', this.makeTriangle());
    this.add('angle1', this.makeAngle(0));
    this.add('angle2', this.makeAngle(1));
    this.add('angle3', this.makeAngle(2));
    this.add('dim1', this.makeDimension(0));
    this.add('dim2', this.makeDimension(1));
    this.add('dim3', this.makeDimension(2));
  }
}
