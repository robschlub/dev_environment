// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import {
  makeMoveableLine, makeAnglesClose, checkForParallel,
} from '../common/diagramCollectionCommon';
import type { MoveableLineType } from '../common/diagramCollectionCommon';
import CommonQuizDiagramCollection from '../../../../LessonsCommon/DiagramCollectionQuiz';
// import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';

type TypeSelectableLine = {
  selected: boolean;
} & MoveableLineType;

export default class QuizParallel2Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeSelectableLine;
  _line2: TypeSelectableLine;
  _line3: TypeSelectableLine;
  _line4: TypeSelectableLine;
  _line5: TypeSelectableLine;
  _line6: TypeSelectableLine;
  parallelLines: Array<number>;
  futurePositions: Object;
  // _messages: {
  //   _touching: DiagramElementPrimative;
  //   _rotation: DiagramElementPrimative;
  // } & TypeMessages;

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

  makeLine() {
    const line: TypeSelectableLine = makeMoveableLine(
      this.diagram, this.layout.parallelLine,
      this.layout.colors.line,
    );
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.normalizeAngle(line);
    };
    line._end1.movementAllowed = 'translation';
    line._end2.movementAllowed = 'translation';
    line._mid.movementAllowed = 'translation';
    line.selected = false;
    line.onClick = () => {
      line.selected = !line.selected;
      if (line.selected) {
        line.setColor(this.layout.colors.quizLine);
      } else {
        line.setColor(this.layout.colors.line);
      }
    };
    return line;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(
      diagram,
      layout,
      'p2',
      {},
      transform,
    );
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.quiz.position);
    this.add('line1', this.makeLine());
    this.add('line2', this.makeLine());
    this.add('line3', this.makeLine());
    this.add('line4', this.makeLine());
    this.add('line5', this.makeLine());
    this.add('line6', this.makeLine());

    this.hasTouchableElements = true;
  }

  showAnswer() {
    this._line1.stop();
    this._line2.stop();
    makeAnglesClose(this._line1, this._line2);

    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    const velocity = this._line1.transform.constant(0);
    velocity.updateRotation(2 * Math.PI / 6);
    if (r1 != null && r2 != null) {
      this._line2.animateRotationTo(r1, 0, velocity);
    }
    this.diagram.animateNextFrame();
  }

  // pulseLine() {
  //   this._line1.pulseWidth();
  //   this.diagram.animateNextFrame();
  // }

  // pulseLine2() {
  //   this._line2.pulseWidth();
  //   this.diagram.animateNextFrame();
  // }

  // eslint-disable-next-line class-methods-use-this
  randomizeParallelLine() {
    const limit = new Rect(-1, -0.5, 2, 1);
    const x = Math.random() * limit.width + limit.left;
    const y = Math.random() * limit.height + limit.bottom;
    const r = Math.random() * Math.PI;
    return {
      position: new Point(x, y),
      rotation: r,
    };
  }

  isParallel(distanceMultiplier: number = 1.1, rotationThreshold: number = Math.PI / 200) {
    return checkForParallel(
      this._line1, this._line2, false,
      this.layout.parallelLine.width * distanceMultiplier, rotationThreshold,
    );
  }

  resetLineColors() {
    this._line1.setColor(this.layout.colors.line);
    this._line2.setColor(this.layout.colors.line);
    this._line3.setColor(this.layout.colors.line);
    this._line4.setColor(this.layout.colors.line);
    this._line5.setColor(this.layout.colors.line);
    this._line6.setColor(this.layout.colors.line);
  }

  randomizeFuturePositions() {
    this.futurePositions = {
      line1: this.randomizeParallelLine(),
      line2: this.randomizeParallelLine(),
      line3: this.randomizeParallelLine(),
      line4: this.randomizeParallelLine(),
      line5: this.randomizeParallelLine(),
      line6: this.randomizeParallelLine(),
    };
    const rand = n => Math.floor(Math.random() * n * 0.999);
    const possibilities = [1, 2, 3, 4, 5, 6];
    const r1 = rand(6);
    const r2 = rand(5);
    const p1 = possibilities[r1];
    possibilities.splice(r1, 1);
    const p2 = possibilities[r2];
    possibilities.splice(r2, 1);

    this.futurePositions[`line${p1}`].rotation = this.futurePositions[`line${p2}`].rotation;
    this.parallelLines = [p1, p2];
  }

  setFuturePositions() {
    const set = this.diagram.elements.setScenario.bind(this);
    const fp = this.futurePositions;
    set(this._line1, fp.line1);
    set(this._line2, fp.line2);
    set(this._line3, fp.line3);
    set(this._line4, fp.line4);
    set(this._line5, fp.line5);
    set(this._line6, fp.line6);
  }

  moveToFuturePositions(time: number, done: () => void = () => {}) {
    const move = this.diagram.elements.moveToScenario.bind(this);
    const fp = this.futurePositions;
    move(this._line1, fp.line1, time);
    move(this._line2, fp.line2, time);
    move(this._line3, fp.line3, time);
    move(this._line4, fp.line4, time);
    move(this._line5, fp.line5, time);
    move(this._line6, fp.line6, time, done);
  }

  newProblem() {
    super.newProblem();
    this.randomizeFuturePositions();
    this.moveToFuturePositions(1, this.showCheck.bind(this));
    this.diagram.animateNextFrame();
  }

  // findAnswer() {
  // }
  // findAnswer() {
  //   this._check.hide();
  //   this.hasTouchableElements = false;
  //   if (this.isParallel()) {
  //     this._messages.hideAll();
  //     this._messages._correct.show();
  //     this._messages._correctNextSteps.show();
  //   } else {
  //     this._messages.hideAll();
  //     this._messages._incorrect.show();
  //     this._messages._incorrectNextSteps.show();
  //   }
  // }
}
