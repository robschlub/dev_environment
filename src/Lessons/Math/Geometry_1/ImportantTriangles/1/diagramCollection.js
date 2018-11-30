// @flow
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import EquilateralCollection from '../common/diagramCollectionEquilateral';
import QuickReferenceCollection from '../common/diagramCollectionQuickReference';
import CommonLessonDiagramCollection from '../common/diagramCollection';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _equil: EquilateralCollection;
  _qr: QuickReferenceCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('equil', new EquilateralCollection(diagram, this.layout));
    this.add('qr', new QuickReferenceCollection(diagram, this.layout));
    this.hasTouchableElements = true;
  }
}
