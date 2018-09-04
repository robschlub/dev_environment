// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
// import {
//   DiagramElementPrimative,
// } from '../../../../js/diagram/Element';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

// import ParallelCollection from './diagramCollectionParallel';
// import OppositeCollection from './diagramCollectionOpposite';
// import ThreeLinesCollection from './diagramCollectionThreeLines';
import RelatedAnglesCommonCollection from '../common/diagramCollection';
import QuizCollection from './diagramCollectionQuiz';
import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

export default class RelatedAngles1Collection extends RelatedAnglesCommonCollection {
  _quiz: QuizCollection;
  units: TypeUnits;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.units = 'deg';
    this.add('quiz', new QuizCollection(diagram, this.layout));
    this.add('unitsSelector', this.makeUnitsSelector());
  }

  // eslint-disable-next-line class-methods-use-this
  // setUnits(units: TypeUnits) {
  //   this.units = units;
  //   if (this._opposite.isShown) {
  //     this._opposite.setUnits(units);
  //   }
  //   if (this._threeLines.isShown) {
  //     this._threeLines.setUnits(units);
  //   }
  // }
}
