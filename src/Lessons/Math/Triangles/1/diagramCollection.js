// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import TriangleExamplesCollection from '../common/diagramCollectionTriangleExamples';
import CustomTriangleCollection from '../common/diagramCollectionCustomTriangle';
import TrianglePropertiesCollection from '../common/diagramCollectionProperties';
import CommonLessonDiagramCollection from '../common/diagramCollection';
import QuickReferenceCollection from '../common/diagramCollectionQuickReference';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _examples: TriangleExamplesCollection;
  _custom: CustomTriangleCollection;
  _properties: TrianglePropertiesCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('examples', new TriangleExamplesCollection(diagram, this.layout));
    this.add('custom', new CustomTriangleCollection(diagram, this.layout));
    this.add('properties', new TrianglePropertiesCollection(diagram, this.layout));
    this.add('qr', new QuickReferenceCollection(diagram, this.layout));
    this._qr.hideAll();
  }
}
