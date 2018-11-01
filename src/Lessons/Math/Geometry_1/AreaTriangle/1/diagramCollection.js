// @flow
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import CommonLessonDiagramCollection from '../common/diagramCollection';
import TriangleAreaCollection from '../common/diagramCollectionTri';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _tri: TriangleAreaCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('tri', new TriangleAreaCollection(diagram, this.layout));
  }
}
