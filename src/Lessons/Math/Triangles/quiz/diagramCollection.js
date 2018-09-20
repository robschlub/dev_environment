// @flow
import { Transform, Point, threePointAngle } from '../../../../js/diagram/tools/g2';
import {
  removeRandElement, roundNum,
} from '../../../../js/diagram/tools/mathtools';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import TotalAngleTriangleCollection from '../common/diagramCollectionTotalAngleTriangle';
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

    this.add('triangle', new TotalAngleTriangleCollection(diagram, this.layout));
    this.add('input', this.makeEntryBox('a1', '?', 3));
    this._input.setPosition(this.layout.input);
    this._triangle.hasTouchableElements = false;
    this._triangle._triangle.angleRadiusToInnerBorder = true;
  }

  showAngles() {
    const tri = this._triangle._triangle;
    const points = [tri.p1, tri.p2, tri.p3];
    console.log(points)
    const angle1 = threePointAngle(points[2], points[0], points[1]);
    const angle2 = threePointAngle(points[0], points[1], points[2]);
    const angle3 = threePointAngle(points[1], points[2], points[0]);
    const angles = [
      { element: tri._angle1, angle: angle1 },
      { element: tri._angle2, angle: angle2 },
      { element: tri._angle3, angle: angle3 },
    ];
    const unknown = removeRandElement(angles);
    let unknownAngle = 180;
    angles.forEach((angle) => {
      const angleValue = roundNum(angle.angle * 180 / Math.PI, 0);
      angle.element.setLabel(`${angleValue}º`);
      unknownAngle -= angleValue;
      console.log('before:', angleValue, angle.element.label.eqn.currentForm.width)
      angle.element.label.eqn.showForm('base');
      angle.element.label.eqn.reArrangeCurrentForm();
      console.log('after:',angleValue,  angle.element.label.eqn.currentForm.width)
    });
    unknown.element.setLabel('?');
    unknown.element.label.eqn.reArrangeCurrentForm();
    tri.updateAngles();
    this.angleToFind = unknownAngle;
    this._input.show();
    this.showCheck();
  }

  tryAgain() {
    super.tryAgain();
    this._input.enable();
  }

  randomizeFuturePositions() {
    this._triangle.calculateFuturePositions();
  }

  newProblem() {
    super.newProblem();
    // this.resetLines();
    this.randomizeFuturePositions();
    this._triangle.moveToFuturePositions(1, this.showAngles.bind(this));
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    this._input.setValue(this.angleToFind);
    this._input.disable();
    this.diagram.animateNextFrame();
  }

  // showAnswer() {
  //   super.showAnswer();
  //   this.resetLines();
  //   // $FlowFixMe
  //   this[`_line${this.parallelLines[0]}`].onClick();
  //   // $FlowFixMe
  //   this[`_line${this.parallelLines[1]}`].onClick();
  //   this.diagram.animateNextFrame();
  // }

  findAnswer() {
    this._input.disable();
    if (this._input.getValue() === this.angleToFind.toString()) {
      return 'correct';
    }
    return 'incorrect';
  }
}
