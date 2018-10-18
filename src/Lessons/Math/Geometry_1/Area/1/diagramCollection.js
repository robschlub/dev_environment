// @flow
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import ShapesCollection from '../common/diagramCollectionShapes';
import MeasureCollection from '../common/diagramCollectionMeasure';
import SizeCollection from '../common/diagramCollectionSize';
import CommonLessonDiagramCollection from '../common/diagramCollection';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _shapes: ShapesCollection;
  _measure: MeasureCollection;
  _size: SizeCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('shapes', new ShapesCollection(diagram, this.layout));
    this.add('measure', new MeasureCollection(diagram, this.layout));
    this.add('size', new SizeCollection(diagram, this.layout));
  }
}
