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
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
// import makeAngle from '../../../../LessonsCommon/tools/angle';

import makeTriangle from '../../../../LessonsCommon/tools/triangle';
import type {
  TypeTriangle, TypeTriangleAngle,
} from '../../../../LessonsCommon/tools/triangle';

export default class TrianglePropertiesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _triangle: {
    _dimension12: TypeLine;
    _dimension23: TypeLine;
    _dimension31: TypeLine;
  } & TypeTriangle & TypeTriangleAngle;

  makeTriangleWithDimensions() {
    const layout = this.layout.properties;

    const triangle = makeTriangle(
      this.diagram,
      layout.triangle.points[0],
      layout.triangle.points[1],
      layout.triangle.points[2],
      layout.lineWidth,
      this.layout.colors.line,
    );
    triangle.setPosition(layout.triangle.position);

    triangle.addAngle(1, 0.3, 0.03, 100, this.layout.colors.angle);
    triangle.addAngle(2, 0.3, 0.03, 100, this.layout.colors.angle);
    triangle.addAngle(3, 0.3, 0.03, 100, this.layout.colors.angle);
    const dim12 = triangle.addSideDimension(1, 2, this.layout.colors.angle, 0.15, true, 0.01);
    dim12.addLabel('AB', 0.01, 'outside', 'left', 'horizontal', 0.5);
    dim12.addArrow1(0.05, 0.05);
    dim12.addArrow2(0.05, 0.05);

    const dim23 = triangle.addSideDimension(2, 3, this.layout.colors.angle, 0.15, true, 0.01);
    dim23.addLabel('BC', 0.01, 'outside', 'left', 'horizontal', 0.5);
    dim23.addArrow1(0.05, 0.05);
    dim23.addArrow2(0.05, 0.05);

    const dim31 = triangle.addSideDimension(3, 1, this.layout.colors.angle, 0.15, true, 0.01);
    dim31.addLabel('CA', 0.01, 'outside', 'left', 'horizontal', 0.5);
    dim31.addArrow1(0.05, 0.05);
    dim31.addArrow2(0.05, 0.05);
    return triangle;
  }

  growDimensions() {
    this._triangle._dimension12.grow(0.2, 1.5, true);
    this._triangle._dimension23.grow(0.2, 1.5, true);
    this._triangle._dimension31.grow(0.2, 1.5, true);
    this.diagram.animateNextFrame();
  }

  pulseAngles() {
    this._triangle._angle1.pulseScaleNow(1, 1.5);
    this._triangle._angle2.pulseScaleNow(1, 1.5);
    this._triangle._angle3.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.position);
    this.add('triangle', this.makeTriangleWithDimensions());
  }
}
