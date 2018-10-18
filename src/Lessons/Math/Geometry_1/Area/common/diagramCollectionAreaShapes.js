// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
// import {
//   DiagramElementCollection,
// } from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class AreaShapesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addShapes() {
    const square1 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square1.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square1,
      new Transform('s1').translate(this.layout.square1.position),
    );
    this.add('square1', square1);

    const square2 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square2.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square2,
      new Transform('s2').translate(this.layout.square2.position),
    );
    this.add('square2', square2);

    const circle = this.diagram.shapes.polygonFilled(
      this.layout.circle.numSides, this.layout.circle.radius,
      0, this.layout.circle.numSides, this.layout.colors.circle,
      new Transform('c').translate(this.layout.circle.position),
    );
    this.add('circle', circle);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addShapes();
    this.setPosition(this.layout.shapesPosition);
    this.hasTouchableElements = true;
  }
}
