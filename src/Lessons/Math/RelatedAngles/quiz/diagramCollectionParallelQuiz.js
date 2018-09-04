// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../js/diagram/Element';
// import {
//   click, applyModifiers, setOnClicks,
// } from '../../../../js/Lesson/LessonContent';
// eslint-disable-next-line import/no-cycle
import {
  makeMoveableLine, makeAnglesClose, checkForParallel,
} from '../common/diagramCollectionCommon';
import type { MoveableLineType } from '../common/diagramCollectionCommon';
import CommonQuizDiagramCollection from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';

export default class QuizParallelCollection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;

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
      this.diagram, this.layout.parallelLine,
      this.layout.colors.line,
    );
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.normalizeAngle(line);
    };
    line._end1.movementAllowed = 'rotation';
    line._end2.movementAllowed = 'rotation';
    line._mid.movementAllowed = 'translation';
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
      {
        rotation: 'Incorrect! (Close, but rotation is off)',
        touching: 'Not Quite - parallel lines cannot touch',
      },
      transform,
    );
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.quiz.position);
    this.add('line1', this.makeLine());
    this._line1.setPosition(this.layout.line1.quiz.position.x, 0);
    this._line1.hasTouchableElements = false;
    this._line1.isTouchable = false;
    this.add('line2', this.makeLine());
    this._line2.setPosition(this.layout.line2.quiz.position.x, 0);
    this.hasTouchableElements = true;
    // this.add('messages', this.makeQuizAnswerMessages());
    // this._messages.hideAll();
    // this.add('check', this.makeCheckButton());
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

  pulseLine1() {
    this._line1.pulseWidth();
    this.diagram.animateNextFrame();
  }

  pulseLine2() {
    this._line2.pulseWidth();
    this.diagram.animateNextFrame();
  }

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

  // tryAgain() {
  //   this._messages.hideAll();
  //   this._check.show();
  //   this.hasTouchableElements = true;
  //   this.diagram.animateNextFrame();
  // }

  newProblem() {
    super.newProblem();
    const time = 1;
    this.diagram.elements.moveToScenario(
      this._line1,
      this.randomizeParallelLine(),
      time,
    );
    this.diagram.elements.moveToScenario(
      this._line2,
      this.randomizeParallelLine(),
      time,
      () => { this._check.show(); },
    );
    // this._messages.hideAll();
    // this.hasTouchableElements = true;
    this.diagram.animateNextFrame();
  }

  checkAnswer() {
    this._check.hide();
    this.hasTouchableElements = false;
    if (this.isParallel()) {
      this._messages.hideAll();
      this._messages._correct.show();
      this._messages._correctNextSteps.show();
    } else {
      this._messages.hideAll();
      const isTouching = !this.isParallel(1.1, Math.PI * 2);
      const isCloseRotation = this.isParallel(1.1, Math.PI / 20);
      if (isTouching) {
        this._messages._touching.show();
      } else if (isCloseRotation) {
        this._messages._rotation.show();
      } else {
        this._messages._incorrect.show();
      }
      this._messages._incorrectNextSteps.show();
    }
  }
}
