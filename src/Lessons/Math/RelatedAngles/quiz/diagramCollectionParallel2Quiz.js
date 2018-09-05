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
import {
  makeMoveableLine, checkElementsForParallel, checkValuesForParallel,
} from '../common/diagramCollectionCommon';
import type { MoveableLineType } from '../common/diagramCollectionCommon';
import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

type TypeSelectableLine = {
  selected: boolean;
} & MoveableLineType;


export default class QuizParallel1Collection extends CommonQuizMixin(CommonDiagramCollection) {
// export default class QuizParallel2Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeSelectableLine;
  _line2: TypeSelectableLine;
  _line3: TypeSelectableLine;
  _line4: TypeSelectableLine;
  _line5: TypeSelectableLine;
  _line6: TypeSelectableLine;
  parallelLines: Array<1 | 2 | 3 | 4 | 5 | 6>;
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

  makeLine() {
    const line: Object = makeMoveableLine(
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
    return (line: TypeSelectableLine);
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
        selectTwoLines: {
          answer: 'Wrong number of lines selected.',
          details: 'Must select two and only two lines.',
        },
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
    rotationThreshold: number = Math.PI / 200,
  ) {
    return checkElementsForParallel(
      line1, line2, false,
      this.layout.parallelLine.width * distanceMultiplier, rotationThreshold,
    );
  }

  resetLines() {
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

    const parallelLine1 = this.futurePositions[`line${p1}`];
    const parallelLine2 = this.futurePositions[`line${p2}`];

    const { rotation } = parallelLine2;
    parallelLine1.rotation = rotation;
    parallelLine1.position = parallelLine2.position.add(0.01, 0.01);
    const isParallel = checkValuesForParallel(
      parallelLine1.rotation,
      parallelLine1.position,
      parallelLine2.rotation,
      parallelLine2.position,
      this.layout.parallelLine.width * 1.1,
      Math.PI / 200,
    );

    if (!isParallel) {
      const xMag = 0.5 * Math.cos(rotation + Math.PI / 2);
      const yMag = 0.5 * Math.sin(rotation + Math.PI / 2);
      const oldX = parallelLine1.position.x;
      const newX = oldX < 0 ? oldX + xMag : oldX - xMag;
      const oldY = parallelLine1.position.y;
      const newY = oldY < 0 ? oldY + yMag : oldY - yMag;
      parallelLine1.position = new Point(newX, newY);
    }

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
    this.resetLines();
  }

  newProblem() {
    super.newProblem();
    this.resetLines();
    this.randomizeFuturePositions();
    this.moveToFuturePositions(1, this.showCheck.bind(this));
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    this.resetLines();
    // $FlowFixMe
    this[`_line${this.parallelLines[0]}`].onClick();
    // $FlowFixMe
    this[`_line${this.parallelLines[1]}`].onClick();
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
    if (this.parallelLines.indexOf(selected[0]) >= -1
      && this.parallelLines.indexOf(selected[1]) >= -1) {
      return 'correct';
    }
    return 'incorrect';
  }
}
