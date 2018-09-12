// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import type { TypeAngleAnnotation } from '../../../../LessonsCommon/tools/angleAnnotation';

import makeAnnotatedAngle from '../../../../LessonsCommon/tools/angleAnnotation';

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
  }
}
