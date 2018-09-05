// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
// import {
//   makeMoveableLine,
// } from '../common/diagramCollectionCommon';
// import type { MoveableLineType, TypeIndexAngle } from '../common/diagramCollectionCommon';
import { CommonQuizMixin } from '../../../../LessonsCommon/DiagramCollectionQuiz';
import ThreeLinesCollection from '../common/diagramCollectionThreeLines';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import makeAngleAnnotation from '../../../../LessonsCommon/tools/angleAnnotation';

// type TypeSelectableLine = {
//   selected: boolean;
// } & MoveableLineType;

export default class QuizAngle1Collection extends CommonQuizMixin(CommonDiagramCollection) {
  diagram: LessonDiagram;
  _lines: ThreeLinesCollection;
  // _line1: MoveableLineType;
  // _line2: MoveableLineType;
  // _line3: MoveableLineType;
  // _angleA1: TypeIndexAngle;
  // _angleB1: TypeIndexAngle;
  // _angleC1: TypeIndexAngle;
  // _angleD1: TypeIndexAngle;
  // _angleA2: TypeIndexAngle;
  // _angleB2: TypeIndexAngle;
  // _angleC2: TypeIndexAngle;
  // _angleD2: TypeIndexAngle;
  futurePositions: Object;

  // eslint-disable-next-line class-methods-use-this
  normalizeAngle(element: DiagramElementCollection, wrap: number = 2 * Math.PI) {
    let angle = element.transform.r();
    if (angle != null) {
      if (angle > wrap) {
        angle -= wrap;
      }
      element.transform.updateRotation(angle);
    }
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(
      diagram,
      layout,
      'a1',
      {
        selectTwoLines: {
          answer: 'Wrong number of lines selected.',
          details: 'Must select two and only two lines.',
        },
      },
      transform,
    );

    this.add('lines', new ThreeLinesCollection(diagram, this.layout));
    this._lines.setPosition(0, 0);
    this._lines._line1.eqn.collection._label.vertices.setText('');
    this._lines._line2.eqn.collection._label.vertices.setText('');
    this._lines._line3.eqn.collection._label.vertices.setText('');
    this._lines._line1.isMovable = false;
    this._lines._line1.isTouchable = false;
    this._lines._line1.hasTouchableElements = false;
    this._lines._line1.setColor(this.layout.colors.line);
    this._lines._line2.isMovable = false;
    this._lines._line2.isTouchable = false;
    this._lines._line2.hasTouchableElements = false;
    this._lines._line2.setColor(this.layout.colors.line);
    this._lines._line3.isMovable = false;
    this._lines._line3.isTouchable = false;
    this._lines._line3.hasTouchableElements = false;
    this._lines._line3.setColor(this.layout.colors.line);
  }

  randomizeLines() {
    const separation = Math.random() * (this.layout.quizA1.maxSeparation
      - this.layout.quizA1.minSeparation) + this.layout.quizA1.minSeparation;
    const intersectingLineRotation = Math.random() * Math.PI * 0.45 + Math.PI / 3.7;
    const rotation = Math.random() * 2 * Math.PI;
    this.futurePositions = {
      line1: {
        position: new Point(0, separation / 2),
        rotation: 0,
      },
      line2: {
        position: new Point(0, -separation / 2),
        rotation: 0,
      },
      line3: {
        position: new Point(0, 0),
        rotation: intersectingLineRotation,
      },
      threeLines: {
        position: new Point(0, 0),
        rotation,
      },
    };
  }

  setFuturePositions() {
    const set = this.diagram.elements.setScenario.bind(this);
    const fp = this.futurePositions;
    set(this._lines._line1, fp.line1);
    set(this._lines._line2, fp.line2);
    set(this._lines._line3, fp.line3);
    set(this._lines, fp.threeLines);
  }

  moveToFuturePositions(time: number, done: () => void = () => {}) {
    const move = this.diagram.elements.moveToScenario.bind(this);
    const fp = this.futurePositions;
    move(this._lines, fp.threeLines, time, done);
    move(this._lines._line1, fp.line1, time);
    move(this._lines._line2, fp.line2, time);
    move(this._lines._line3, fp.line3, time);
  }

  tryAgain() {
    super.tryAgain();
    this.diagram.animateNextFrame();
  }

  newProblem() {
    super.newProblem();
    this.randomizeLines();
    this.moveToFuturePositions(1, this.showCheck.bind(this));
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    return 'incorrect';
  }
}
