// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import type { TypeAngleAnnotation } from '../../../../LessonsCommon/tools/angleAnnotation';

import makeAnnotatedAngle from '../../../../LessonsCommon/tools/angleAnnotation';

import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class TrianglePropertiesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: DiagramElementPrimative;
  // _len1: DiagramCollection;
  // _len2: DiagramCollection;
  // _len3: DiagramCollection;
  _angle1: TypeAngleAnnotation;
  _angle2: TypeAngleAnnotation;
  _angle3: TypeAngleAnnotation;

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
    const angle = makeAnnotatedAngle(
      this.diagram,
      layout.angleAnnotation,
      this.layout.colors.point,
      '',
    );
    angle.setPosition(layout.triangle.points[index].add(layout.triangle.position));
    angle.updateAngle(layout.angleRotations[index], Math.PI / 3);
    return angle;
  }

  makeDimension(index: number) {
    const layout = this.layout.properties.dimension;
    const line = makeLine(
      this.diagram, 'end', 2, layout.lineWidth,
      this.layout.colors.point, {
        width: layout.arrowWidth,
        height: layout.arrowHeight,
        end1: true,
        end2: true,
      },
    );
    const { triIndex, offset } = layout.locations[index];
    let triPoints = this.layout.properties.triangle.points;
    triPoints = triPoints.map(p => p.add(this.layout.properties.triangle.position));
    line.setEndPoints(triPoints[triIndex[0]], triPoints[triIndex[1]], offset);
    return line;
  }

  growDimensions() {
    this._dim1.grow(0.2, 1, true);
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
