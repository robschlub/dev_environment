// @flow
import Diagram from '../js/diagram/Diagram';
import {
  Transform,
} from '../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../js/diagram/Element';

import {
  click, applyModifiers, setOnClicks,
} from '../js/Lesson/LessonContent';

import CommonDiagramCollection from './DiagramCollection';

export type TypeMessages = {
  _correct: DiagramElementPrimative;
  _correctNextSteps: DiagramElementPrimative;
  _incorrect: DiagramElementPrimative;
  _incorrectNextSteps: DiagramElementPrimative;
} & DiagramElementCollection;

export default class CommonQuizDiagramCollection extends CommonDiagramCollection {
  _check: DiagramElementPrimative;
  +_messages: TypeMessages;

  

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

  showCheck() {
    this._check.show();
  }

  checkAnswer() {
    this._check.hide();
    this.hasTouchableElements = false;
    const answer = this.findAnswer();
    if (answer === 'correct') {
      this._messages.hideAll();
      this._messages._correct.show();
      this._messages._correctNextSteps.show();
    } else if (answer === 'incorrect') {
      this._messages.hideAll();
      this._messages._incorrect.show();
      this._messages._incorrectNextSteps.show();
    } else {
      this._messages.hideAll();
      this._messages[`_${answer}`].show();
      this._messages._incorrectNextSteps.show();
    }
    this.diagram.animateNextFrame();
  }

  // eslint-disable-next-line class-methods-use-this
  findAnswer() {
    return 'incorrect';
  }

  // eslint-disable-next-line class-methods-use-this
  showAnswer() {
    this.hasTouchableElements = false;
  }

  constructor(
    diagram: Diagram,
    layout: Object = { colors: {} },
    id: string = Math.round(Math.random() * 10000).toString(),
    messages: Object = {},
    transform: Transform = new Transform(),
  ) {
    super(diagram, layout, transform);
    this.add('check', this.makeCheckButton(id));
    this.add('messages', this.makeQuizAnswerMessages(id, messages));
    this._messages.hideAll();
  }

  makeCorrectAnswerMessage(id: string) {
    const text = `
      <p style="margin-bottom=0">
        Correct!
      </p>
      `;
    const html = this.diagram.shapes.htmlText(
      text, `id__quiz__correct_${id}`,
      'lesson__quiz_correct', this.layout.quiz.answer, 'middle', 'center',
    );
    return html;
  }
  
  makeIncorrectAnswerMessage(
    groupId: string,
    id: string = 'incorrect',
    reason: string = 'Incorrect!',
  ) {
    return this.diagram.shapes.htmlText(
      `
      <p style="margin-bottom=0">
        ${reason}
      </p>
      `, `id__quiz__${groupId}_${id}`,
      'lesson__quiz_incorrect', this.layout.quiz.answer, 'middle', 'center',
    );
  }

  makeCorrectNextStepsMessage(id: string) {
    let text = `
      <p style="margin-bottom=0">
        |Try_new| problem.
      </p>
      `;
    const modifiers = { Try_new: click(this.newProblem, [this], this.layout.colors.line, id) };
    text = applyModifiers(text, modifiers);
    const html = this.diagram.shapes.htmlText(
      text, `id__quiz__correct_next_steps_${id}`,
      'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
    );
    setOnClicks(modifiers);
    return html;
  }

  makeIncorrectNextStepsMessage(id: string) {
    let text = `
      <p style="margin-bottom=0">
        |Try_again|, |show_answer| or |try_new_problem|.
      </p>
      `;
    const modifiers = {
      show_answer: click(this.showAnswer, [this], this.layout.colors.line, id),
      try_new_problem: click(this.newProblem, [this], this.layout.colors.line, id),
      Try_again: click(this.tryAgain, [this], this.layout.colors.line, id),
    };
    text = applyModifiers(text, modifiers);
    const html = this.diagram.shapes.htmlText(
      text, `id__quiz__incorrect_next_steps_${id}`,
      'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
    );
    setOnClicks(modifiers);
    return html;
  }

  makeQuizAnswerMessages(id: string, incorrectMessages: Object = {}) {
    const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
    collection.add('correct', this.makeCorrectAnswerMessage(id));
    collection.add('incorrect', this.makeIncorrectAnswerMessage(id));
    collection.add('incorrectNextSteps', this.makeIncorrectNextStepsMessage(id));
    collection.add('correctNextSteps', this.makeCorrectNextStepsMessage(id));
    Object.keys(incorrectMessages).forEach((key) => {
      const message = incorrectMessages[key];
      collection.add(key, this.makeIncorrectAnswerMessage(id, key, message));
    });
    return collection;
  }

  makeCheckButton(id: string) {
    const check = this.diagram.shapes.htmlText(
      'Check', `id__related_angles_check_${id}`,
      'lesson__quiz_check', this.layout.quiz.check, 'middle', 'center',
    );
    // check.onclick = this.checkAnswer.bind(this);
    return check;
  }
}
