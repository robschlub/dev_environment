// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';

import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

// What is the radius of a circle with area...
// What is the circumference of a circle with area...
// What is the diameter of a circle with area...
// What is the area of a circle with radius...
// What is the area of a circle with circumference...
// What is the area of a circle with diameter...
// How many circles of radius 1 are needed to have a total area of 6π.
// What is the area of a band with inner radius... and outer radius...

export default class QuizParallel1Collection extends CommonQuizMixin(CommonDiagramCollection) {
// export default class QuizParallel1Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;

  futurePositions: Object;

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(
      diagram,
      layout,
      'q1',
      {},
      transform,
    );
    // this.add('input', this.makeEntryBox('a1', '?', 3));
    // this._input.setPosition(this.layout.input);
    this.hasTouchableElements = true;
  }

  tryAgain() {
    super.tryAgain();
    // this._input.enable();
    // this._input.setValue('');
  }


  newProblem() {
    super.newProblem();
    // this.calculateFuturePositions();
    // this.moveToFuturePositions(1, this.updateAngles.bind(this));
    // this._input.enable();
    // this._input.setValue('');
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    // this._input.setValue(this.answer);
    // this._input.disable();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    // this._input.disable();
    if (this.answer === true) {
      return 'correct';
    }
    return 'incorrect';
  }
}
