// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../js/diagram/Element';
import {
  click, applyModifiers, setOnClicks,
} from '../../../../js/Lesson/LessonContent';
// eslint-disable-next-line import/no-cycle
import {
  makeMoveableLine, makeAnglesClose, checkForParallel,
} from '../common/diagramCollectionCommon';
import type { MoveableLineType } from '../common/diagramCollectionCommon';

export default class QuizParallelCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: LessonDiagram;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _check: DiagramElementPrimative;
  _messages: {
    _correct: DiagramElementPrimative;
    _correctNextSteps: DiagramElementPrimative;
    _incorrect: DiagramElementPrimative;
    _incorrectTouching: DiagramElementPrimative;
    _incorrectCloseRotation: DiagramElementPrimative;
    _incorrectNextSteps: DiagramElementPrimative;
  } & DiagramElementCollection;

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

  makeCheckButton() {
    const check = this.diagram.shapes.htmlText(
      'Check', 'id__related_angles_check',
      'lesson__quiz_check', this.layout.quiz.check, 'middle', 'center',
    );
    // check.onclick = this.checkAnswer.bind(this);
    return check;
  }

  makeCorrectAnswerMessage() {
    const text = `
      <p>
        That's correct!.
      </p>
      `;
    const html = this.diagram.shapes.htmlText(
      text, 'id__related_angles_quiz__correct',
      'lesson__quiz_correct', this.layout.quiz.answer, 'middle', 'center',
    );
    return html;
  }

  tryAgain() {
    this._messages.hideAll();
    this._check.show();
    this.hasTouchableElements = true;
    this.diagram.animateNextFrame();
  }

  newProblem() {
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
    this._messages.hideAll();
    // this._check.show();
    this.hasTouchableElements = true;
    this.diagram.animateNextFrame();
  }

  makeIncorrectAnswerMessage() {
    return this.diagram.shapes.htmlText(
      `
      <p>
        Lines aren't parallel.
      </p>
      `, 'id__related_angles_quiz__incorrect',
      'lesson__quiz_incorrect', this.layout.quiz.answer, 'middle', 'center',
    );
  }

  makeIncorrectTouchingMessage() {
    return this.diagram.shapes.htmlText(
      `
      <p>
        Not quite (remember parallel lines cannot touch).
      </p>
      `, 'id__related_angles_quiz__incorrect_touching',
      'lesson__quiz_incorrect', this.layout.quiz.answer, 'middle', 'center',
    );
  }

  makeIncorrectCloseRotationMessage() {
    return this.diagram.shapes.htmlText(
      `
      <p>
        Close, but not quite!.
      </p>
      `, 'id__related_angles_quiz__incorrect_close_rotation',
      'lesson__quiz_incorrect', this.layout.quiz.answer, 'middle', 'center',
    );
  }

  makeCorrectNextStepsMessage() {
    let text = `
      <p>
        |Try_new| problem.
      </p>
      `;
    const modifiers = { Try_new: click(this.newProblem, [this], this.layout.colors.line) };
    text = applyModifiers(text, modifiers);
    const html = this.diagram.shapes.htmlText(
      text, 'id__related_angles_quiz__correct_next_steps',
      'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
    );
    setOnClicks(modifiers);
    return html;
  }

  makeIncorrectNextStepsMessage() {
    let text = `
      <p>
        |Try_again|, |show_answer| or |try_new_problem|.
      </p>
      `;
    const modifiers = {
      show_answer: click(this.rotateLine2ToParallel, [this], this.layout.colors.line),
      try_new_problem: click(this.newProblem, [this], this.layout.colors.line),
      Try_again: click(this.tryAgain, [this], this.layout.colors.line),
    };
    text = applyModifiers(text, modifiers);
    const html = this.diagram.shapes.htmlText(
      text, 'id__related_angles_quiz__incorrect_next_steps',
      'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
    );
    setOnClicks(modifiers);
    return html;
  }

  makeQuizAnswerMessages() {
    const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
    collection.add('correct', this.makeCorrectAnswerMessage());
    collection.add('incorrect', this.makeIncorrectAnswerMessage());
    collection.add('incorrectTouching', this.makeIncorrectTouchingMessage());
    collection.add('incorrectCloseRotation', this.makeIncorrectCloseRotationMessage());
    collection.add('incorrectNextSteps', this.makeIncorrectNextStepsMessage());
    collection.add('correctNextSteps', this.makeCorrectNextStepsMessage());
    return collection;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(transform, diagram.limits);
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
    this.add('messages', this.makeQuizAnswerMessages());
    this._messages.hideAll();
    this.add('check', this.makeCheckButton());
  }

  rotateLine2ToParallel() {
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

  checkAnswer() {
    this._check.hide();
    this.hasTouchableElements = false;
    if (this.isParallel()) {
      // this.diagram.elements.moveToScenario(this._line1, this.randomizeParallelLine(), 1);
      // this.diagram.elements.moveToScenario(this._line2, this.randomizeParallelLine(), 1);
      // this.diagram.animateNextFrame();
      this._messages.hideAll();
      this._messages._correct.show();
      this._messages._correctNextSteps.show();
    } else {
      this._messages.hideAll();
      const isTouching = !this.isParallel(1.1, Math.PI * 2);
      const isCloseRotation = this.isParallel(1.1, Math.PI / 20);
      if (isTouching) {
        this._messages._incorrectTouching.show();
      } else if (isCloseRotation) {
        this._messages._incorrectCloseRotation.show();
      } else {
        this._messages._incorrect.show();
      }
      this._messages._incorrectNextSteps.show();
    }
  }
}
