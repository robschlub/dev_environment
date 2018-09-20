// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import CommonLessonDiagramCollection from '../common/diagramCollection';
import QuickReferenceCollection from '../common/diagramCollectionQuickReference';
import TriangleCollection from '../common/diagramCollectionTotalAngleTriangle';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _triangle: TriangleCollection;
  _qr: QuickReferenceCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('triangle', new TriangleCollection(diagram, this.layout));
    this.add('qr', new QuickReferenceCollection(diagram, this.layout));
    this._qr.hideAll();
  }
}
