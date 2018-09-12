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

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _examples: TriangleExamplesCollection;
  _custom: CustomTriangleCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('examples', new TriangleExamplesCollection(diagram, this.layout));
    this.add('custom', new CustomTriangleCollection(diagram, this.layout));
    this.add('properties', new TrianglePropertiesCollection(diagram, this.layout));
  }
}
