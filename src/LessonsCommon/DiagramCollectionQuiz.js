// @flow

import {
  Transform, Point,
} from '../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../js/diagram/Element';
// import Diagram from '../js/diagram/Diagram';

// import {
//   makeSelectorText, SelectorList,
// } from './tools/selector';

import {
  click, applyModifiers, setOnClicks,
} from '../js/Lesson/LessonContent';

import CommonDiagramCollection from './DiagramCollection';

export default class CommonQuizDiagramCollection extends CommonDiagramCollection {
  _check: DiagramElementPrimative;
  _messages: {
    _correct: DiagramElementPrimative;
    _correctNextSteps: DiagramElementPrimative;
    _incorrect: DiagramElementPrimative;
    _incorrectNotQuite: DiagramElementPrimative;
    _incorrectNextSteps: DiagramElementPrimative;
  } & DiagramElementCollection;

  makeCorrectAnswerMessage(reason: string = 'Correct!') {
    const text = `
      <p>
        ${reason}
      </p>
      `;
    const html = this.diagram.shapes.htmlText(
      text, 'id__quiz__correct',
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
    this._messages.hideAll();
    this.hasTouchableElements = true;
    this.diagram.animateNextFrame();
  }

  // eslint-disable-next-line class-methods-use-this
  showAnswer() {
  }

  makeIncorrectAnswerMessage(reason: string = 'Incorrect.') {
    return this.diagram.shapes.htmlText(
      `
      <p>
        ${reason}
      </p>
      `, 'id__quiz__incorrect',
      'lesson__quiz_incorrect', this.layout.quiz.answer, 'middle', 'center',
    );
  }

  makeIncorrectNotQuiteMessage() {
    return this.diagram.shapes.htmlText(
      `
      <p>
        Not quite (remember parallel lines cannot touch).
      </p>
      `, 'id__quiz__not_quite',
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
      text, 'id__quiz__correct_next_steps',
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
      show_answer: click(this.showAnswer, [this], this.layout.colors.line),
      try_new_problem: click(this.newProblem, [this], this.layout.colors.line),
      Try_again: click(this.tryAgain, [this], this.layout.colors.line),
    };
    text = applyModifiers(text, modifiers);
    const html = this.diagram.shapes.htmlText(
      text, 'id__quiz__incorrect_next_steps',
      'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
    );
    setOnClicks(modifiers);
    return html;
  }

  makeQuizAnswerMessages() {
    const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
    collection.add('correct', this.makeCorrectAnswerMessage());
    collection.add('incorrect', this.makeIncorrectAnswerMessage());
    collection.add('incorrectNotQuite', this.makeIncorrectNotQuiteMessage());
    // collection.add('incorrectTouching', this.makeIncorrectTouchingMessage());
    // collection.add('incorrectCloseRotation', this.makeIncorrectCloseRotationMessage());
    collection.add('incorrectNextSteps', this.makeIncorrectNextStepsMessage());
    collection.add('correctNextSteps', this.makeCorrectNextStepsMessage());
    return collection;
  }
}
