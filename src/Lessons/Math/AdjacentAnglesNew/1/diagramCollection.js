// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import AdjacentCollection from '../common/diagramCollectionAdjacent';
import CommonLessonDiagramCollection from '../common/diagramCollection';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _adjacent: AdjacentCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('adjacent', new AdjacentCollection(diagram, this.layout));
    this._adjacent.setPosition(this.layout.position);
    this.hasTouchableElements = true;
  }
}
