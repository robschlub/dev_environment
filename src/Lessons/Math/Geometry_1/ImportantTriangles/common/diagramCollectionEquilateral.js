// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
// import {
//   DiagramElementCollection,
// } from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class EquilateralCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addTris() {
    const tri = this.diagram.shapes.polyLine(this.layout.equil.tri);
    this.add('tri', tri);

    const leftTri = this.diagram.shapes.polyLine(this.layout.equil.leftTri);
    this.add('leftTri', leftTri);

    const rightTri = this.diagram.shapes.polyLine(this.layout.equil.rightTri);
    this.add('rightTri', rightTri);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.equil.position);
    this.addTris();
    // this.hasTouchableElements = true;
  }
}
