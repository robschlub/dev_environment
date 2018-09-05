// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import RelatedAnglesCommonCollection from '../common/diagramCollection';
// eslint-disable-next-line import/no-cycle
import QuizParallel1Collection from './diagramCollectionParallel1Quiz';
// eslint-disable-next-line import/no-cycle
import QuizParallel2Collection from './diagramCollectionParallel2Quiz';
// eslint-disable-next-line import/no-cycle
import QuizAngle1Collection from './diagramCollectionAngles1Quiz';
import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

export default class QuizCollection extends RelatedAnglesCommonCollection {
  _quizP1: QuizParallel1Collection;
  _quizP2: QuizParallel2Collection;
  units: TypeUnits;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.units = 'deg';
    this.add('quizP1', new QuizParallel1Collection(diagram, this.layout));
    this.add('quizP2', new QuizParallel2Collection(diagram, this.layout));
    this.add('quizA1', new QuizAngle1Collection(diagram, this.layout));
    this.add('unitsSelector', this.makeUnitsSelector());
  }
}
