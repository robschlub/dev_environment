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

  addEquil() {
    const tri = this.diagram.shapes.polyLineNew(this.layout.equil.tri);
    this.add('tri', tri);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    // this.setPosition(this.layout.position);
    this.addEquil();
    this.hasTouchableElements = true;
  }
}
