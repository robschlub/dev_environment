// @flow
import { Transform } from '../../../../js/diagram/tools/g2';
// import {
//   removeRandElement, roundNum,
// } from '../../../../js/diagram/tools/mathtools';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import TotalAngleTriangleCollection from '../common/diagramCollectionTriangles';
import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
// import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';

export default class DiagramCollection extends CommonQuizMixin(CommonDiagramCollection) {
  _triangle: TotalAngleTriangleCollection;
  angleToFind: number;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(
      diagram,
      layout,
      't1',
      {},
      transform,
    );

    // this.add('triangle', new TotalAngleTriangleCollection(diagram, this.layout));
    this.add('input', this.makeEntryBox('a1', '?', 3));
    this._input.setPosition(this.layout.input);
    this._triangle.hasTouchableElements = false;
    // this._triangle._triangle.angleRadiusToInnerBorder = true;
  }

  // tryAgain() {
  //   super.tryAgain();
  //   this._input.enable();
  //   this._input.setValue('');
  // }

  // randomizeFuturePositions() {
  //   this._triangle.calculateFuturePositions();
  // }

  // newProblem() {
  //   super.newProblem();
  //   // this.resetLines();
  //   this.randomizeFuturePositions();
  //   this._triangle.moveToFuturePositions(1, this.showAngles.bind(this));
  //   this._input.enable();
  //   this._input.setValue('');
  //   this.diagram.animateNextFrame();
  // }

  // showAnswer() {
  //   super.showAnswer();
  //   this._input.setValue(this.angleToFind);
  //   this._input.disable();
  //   this.diagram.animateNextFrame();
  // }

  // findAnswer() {
  //   this._input.disable();
  //   if (this._input.getValue() === this.angleToFind.toString()) {
  //     return 'correct';
  //   }
  //   return 'incorrect';
  // }
}
