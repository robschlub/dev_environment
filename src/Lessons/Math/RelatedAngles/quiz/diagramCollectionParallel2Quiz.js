// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point, minAngleDiff,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
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
    line._end1.move.type = 'translation';
    line._end2.move.type = 'translation';
    line._mid.move.type = 'translation';
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
      {
        selectTwoLines: 'Must select two lines',
      },
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

  // eslint-disable-next-line class-methods-use-this
  randomizeParallelLine() {
    const limit = new Rect(
      this.layout.parallelLine.boundary.left + this.layout.parallelLine.length.full / 2,
      -0.5,
      this.layout.parallelLine.boundary.width - this.layout.parallelLine.length.full,
      1,
    );
    const x = Math.random() * limit.width + limit.left;
    const y = Math.random() * limit.height + limit.bottom;
    const r = Math.random() * Math.PI;
    return {
      position: new Point(x, y),
      rotation: r,
    };
  }

  isParallel(
    line1: TypeSelectableLine,
    line2: TypeSelectableLine,
    distanceMultiplier: number = 1.1,
    rotationThreshold: number = Math.PI / 200) {
    return checkForParallel(
      line1, line2, false,
      this.layout.parallelLine.width * distanceMultiplier, rotationThreshold,
    );
  }

  resetLineColors() {
    this._line1.setColor(this.layout.colors.line);
    this._line1.selected = false;
    this._line2.setColor(this.layout.colors.line);
    this._line2.selected = false;
    this._line3.setColor(this.layout.colors.line);
    this._line3.selected = false;
    this._line4.setColor(this.layout.colors.line);
    this._line4.selected = false;
    this._line5.setColor(this.layout.colors.line);
    this._line5.selected = false;
    this._line6.setColor(this.layout.colors.line);
    this._line6.selected = false;
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
    const { rotation } = this.futurePositions[`line${p2}`];
    this.futurePositions[`line${p1}`].rotation = rotation;

    // Object.keys(this.futurePositions).forEach((fullKey) => {
    //   const key = fullKey.slice(-1);
    //   if (key !== p1 && key !== p2) {
    //     const line = this.futurePositions[`line${key}`];
    //     console.log(line, `line${key}`)
    //     // const rot = line.rotation;
    //     if (Math.abs(minAngleDiff(line.rotation, rotation)) < Math.PI / 10) {
    //       console.log('initial', line.rotation, rotation)
    //       line.rotation += Math.PI / 3;
    //       if (line.rotation > Math.PI * 2) {
    //         line.rotation -= Math.PI * 2;
    //       }
    //       console.log('final', line.rotation, rotation)
    //     }
    //   }
    // });

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

  tryAgain() {
    super.tryAgain();
    this.resetLineColors();
  }

  newProblem() {
    super.newProblem();
    this.resetLineColors();
    this.randomizeFuturePositions();
    this.moveToFuturePositions(1, this.showCheck.bind(this));
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    const lines = [this._line1, this._line2, this._line3, this._line4, this._line5, this._line6];
    const selected = lines.filter(line => line.selected);
    if (selected.length !== 2) {
      return 'selectTwoLines';
    }
    if (this.isParallel(selected[0], selected[1])) {
      return 'correct';
    }
    return 'incorrect';
    // let answer = 'correct';
    // const notParallel = [1, 2, 3, 4, 5].filter(n => this.parallelLines.indexOf(n) === -1);

    // if (
    //   !this[`_line${this.parallelLines[0]}`].selected
    //   || !this[`_line${this.parallelLines[1]}`].selected) {
    //   return 'incorrect';
    // }

    // const incorrectlySelected = notParallel.filter(n => this.parallelLines.indexOf(n) > -1);
    // if (incorrectlySelected.length > 0) {
    //   return 'incorrect';
    // }
    // return 'correct';
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
