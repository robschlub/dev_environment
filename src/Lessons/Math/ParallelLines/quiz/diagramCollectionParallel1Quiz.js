// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import {
  checkElementsForParallel, checkValuesForParallel, makeAnglesClose,
  randomizeParallelLine,
} from '../common/tools';
import { makeMoveableLine } from '../../../../LessonsCommon/tools/line';
import type { MoveableLineType } from '../../../../LessonsCommon/tools/line';

import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class QuizParallel1Collection extends CommonQuizMixin(CommonDiagramCollection) {
// export default class QuizParallel1Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;

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
    const line = makeMoveableLine(
      this.diagram, this.layout.line,
      this.layout.colors.line,
    );
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.normalizeAngle(line);
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
      'p1',
      {
        rotation: {
          answer: 'Almost!',
          details: 'Hint: Rotation is slightly off. Bringing lines closer together makes it easier to compare rotation.',
        },
        touching: {
          answer: 'Not Quite',
          details: 'Hint: Parallel lines cannot touch.',
        },
      },
      transform,
    );
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.quiz.position);
    this.add('line1', this.makeLine());
    this._line1.hasTouchableElements = false;
    this._line1.isTouchable = false;
    this.add('line2', this.makeLine());
    this.hasTouchableElements = true;
  }

  showAnswer() {
    super.showAnswer();
    this._line1.stop();
    this._line2.stop();
    makeAnglesClose(this._line1, this._line2);

    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    const t1 = this._line1.transform.t();
    const t2 = this._line2.transform.t();

    const dist = this.layout.line.width * 1.1;
    const rot = Math.PI / 200;
    if (r1 != null && t1 != null && t2 != null) {
      if (!checkValuesForParallel(r1, t1, r1, t2, dist, rot)) {
        const magX = Math.abs(0.4 * Math.cos(r1 + Math.PI / 2));
        const magY = Math.abs(0.4 * Math.sin(r1 + Math.PI / 2));
        t2.x = t2.x < 0 ? t2.x + magX : t2.x - magX;
        t2.y = t2.y < 0 ? t2.y + magY : t2.y - magY;
      }
    }

    const velocity = this._line1.transform.constant(0);
    velocity.updateRotation(2 * Math.PI / 6);
    if (r1 != null && r2 != null && t2 != null) {
      // this._line2.animateRotationTo(r1, 0, velocity);
      this.diagram.elements.moveToScenario(
        this._line2,
        {
          position: t2,
          rotation: r1,
        },
        1,
      );
    }
    this.diagram.animateNextFrame();
  }

  pulseLine1() {
    this._line1.pulseWidth();
    this.diagram.animateNextFrame();
  }

  pulseLine2() {
    this._line2.pulseWidth();
    this.diagram.animateNextFrame();
  }

  randomizeFuturePositions() {
    this.futurePositions = {
      line1: randomizeParallelLine(this.layout.line),
      line2: randomizeParallelLine(this.layout.line),
    };
  }

  setFuturePositions() {
    const fp = this.futurePositions;
    this.setScenario(this._line1, fp.line1);
    this.setScenario(this._line2, fp.line2);
  }

  moveToFuturePositions(time: number, done: () => void = () => {}) {
    const fp = this.futurePositions;
    this.moveToScenario(this._line1, fp.line1, time);
    this.moveToScenario(this._line2, fp.line2, time, done);
  }

  isParallel(distanceMultiplier: number = 1.1, rotationThreshold: number = Math.PI / 200) {
    return checkElementsForParallel(
      this._line1, this._line2, false,
      this.layout.line.width * distanceMultiplier, rotationThreshold,
    );
  }

  newProblem() {
    super.newProblem();
    this.randomizeFuturePositions();
    this.moveToFuturePositions(1, this.showCheck.bind(this));
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    if (this.isParallel()) {
      return 'correct';
    }

    const isTouching = !this.isParallel(1.1, Math.PI * 2);
    if (isTouching) {
      return 'touching';
    }

    const isCloseRotation = this.isParallel(1.1, Math.PI / 20);
    if (isCloseRotation) {
      return 'rotation';
    }

    return 'incorrect';
  }
}
