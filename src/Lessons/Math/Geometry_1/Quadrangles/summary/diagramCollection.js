// @flow
import { Transform } from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

import CommonLessonDiagramCollection from '../common/diagramCollection';
import QuadCollection from '../common/diagramCollectionQuad';
import RectCollection from '../common/diagramCollectionRect';
import SquareCollection from '../common/diagramCollectionSquare';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _quad: QuadCollection;
  _rect: RectCollection;
  _square: SquareCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('quad', new QuadCollection(diagram, this.layout));
    this.add('rect', new RectCollection(diagram, this.layout));
    this.add('square', new SquareCollection(diagram, this.layout));
  }
}
