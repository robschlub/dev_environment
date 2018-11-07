// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
// import {
//   DiagramElementCollection,
// } from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class CircleAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addCircle() {
    const circle = this.diagram.shapes.polygon(
      this.layout.circle.numSides, this.layout.circle.radius,
      this.layout.circle.width,
      0, 1, this.layout.circle.numSides, this.layout.colors.diagram.disabled,
      new Transform('cicle'),
    );
    this.add('circle', circle);
  }

  addTriangles() {
    const lay = this.layout.polygons;
    lay.sides.forEach((sideNum, index) => {
      const lines = this.diagram.shapes.radialLines(
        0, lay.radius, lay.width, Math.PI * 2 / sideNum,
        this.layout.colors.lines, new Transform('lines'),
      );
      this.add(`lines${index}`, lines);

      const poly = this.diagram.shapes.polygon(
        sideNum, lay.radius, lay.borderWidth,
        0, 1, sideNum, this.layout.colors.lines,
        new Transform('poly'),
      );
      this.add(`poly${index}`, poly);
    });
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addCircle();
    this.addTriangles();
    this.setPosition(this.layout.position);
    this.hasTouchableElements = true;
  }
}
