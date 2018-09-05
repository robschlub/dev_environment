// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../js/diagram/tools/g2';
import {
  rand, removeRandElement, roundNum,
} from '../../../../js/diagram/tools/mathtools';
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
  angleToFind: number;

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
    const separation = rand(
      this.layout.quizA1.minSeparation,
      this.layout.quizA1.maxSeparation,
    );
    const intersectingLineRotation = rand(
      Math.PI / 3.7,
      Math.PI - Math.PI / 3.7,
    );
    const rotation = rand(2 * Math.PI);
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

  hideAngles() {
    this._lines._angleA1.hide();
    this._lines._angleA2.hide();
    this._lines._angleB1.hide();
    this._lines._angleB2.hide();
    this._lines._angleC1.hide();
    this._lines._angleC2.hide();
    this._lines._angleD1.hide();
    this._lines._angleD2.hide();
  }

  showAngles() {
    const r = this._lines._line3.transform.r();
    if (r == null) {
      return;
    }
    const angleAValue = roundNum(r * 180 / Math.PI, 0);
    const angleBValue = 180 - angleAValue;
    const angleValues = {
      A: angleAValue,
      B: angleBValue,
      C: angleAValue,
      D: angleBValue,
    };

    const angles = ['A1', 'B1', 'C1', 'D1', 'A2', 'B2', 'C2', 'D2'];
    const knownAngle = removeRandElement(angles);
    const unknownAngle = removeRandElement(angles);

    const knownAngleValue = angleValues[knownAngle.charAt(0)];
    const unknownAngleValue = angleValues[unknownAngle.charAt(0)];

    this.angleToFind = unknownAngleValue;

    // $FlowFixMe
    const knownAngleElement = this._lines[`_angle${knownAngle}`];
    knownAngleElement._label._a.vertices.setText(`${knownAngleValue}º`);
    knownAngleElement.eqn.showForm('a');
    knownAngleElement._arc.show();
    knownAngleElement.show();
    knownAngleElement.setColor(this.layout.colors.angleA);
    knownAngleElement.eqn.reArrangeCurrentForm();

    // $FlowFixMe
    const unknownAngleElement = this._lines[`_angle${unknownAngle}`];
    unknownAngleElement._label._a.vertices.setText('?º');
    unknownAngleElement.eqn.showForm('a');
    unknownAngleElement._arc.show();
    unknownAngleElement.show();
    unknownAngleElement.setColor(this.layout.colors.angleB);
    unknownAngleElement.eqn.reArrangeCurrentForm();
    this._lines.updateIntersectingLineAngle();
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
    this.hideAngles();
    this.randomizeLines();
    const done = () => {
      this.showAngles();
      this.showCheck();
    }
    this.moveToFuturePositions(1, done.bind(this));
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
