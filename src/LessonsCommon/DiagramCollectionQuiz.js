// @flow
import Diagram from '../js/diagram/Diagram';
import {
  Transform, Point,
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
  // _correctNextSteps: DiagramElementPrimative;
  _incorrect: DiagramElementPrimative;
  // _incorrectNextSteps: DiagramElementPrimative;
} & DiagramElementCollection;

export default class CommonQuizDiagramCollection extends CommonDiagramCollection {
  _check: DiagramElementPrimative;
  _newProblem: DiagramElementPrimative;
  +_messages: TypeMessages;

  tryAgain() {
    this._messages.hideAll();
    this._check.show();
    this.hasTouchableElements = true;
    this.diagram.animateNextFrame();
  }

  newProblem() {
    this._messages.hideAll();
    this._newProblem.hide();
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
    } else if (answer === 'incorrect') {
      this._messages.hideAll();
      this._messages._incorrect.show();
    } else {
      this._messages.hideAll();
      this._messages[`_${answer}`].show();
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
    this._messages.hideAll();
    this._check.hide();
    this._newProblem.show();
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
    this.add('newProblem', this.makeNewProblemButton(id));
    this.add('messages', this.makeQuizAnswerMessages(id, messages));
    this._messages.hideAll();
  }

  makeAnswerBox(id: string, resultText: string, incorrectBox: boolean = true) {
    const container = document.createElement('div');
    container.classList.add('lesson__quiz__answer_container');

    const result = document.createElement('div');
    result.classList.add('lesson__quiz__answer_text');
    result.innerHTML = resultText;
    container.appendChild(result);

    const nextSteps = document.createElement('div');
    nextSteps.classList.add('lesson__quiz__next_steps');
    container.appendChild(nextSteps);

    if (incorrectBox) {
      const tryAgain = document.createElement('div');
      tryAgain.classList.add('lesson__quiz__button');
      tryAgain.innerHTML = 'Try Again';
      tryAgain.onclick = this.tryAgain.bind(this);
      nextSteps.appendChild(tryAgain);

      const showAnswer = document.createElement('div');
      showAnswer.classList.add('lesson__quiz__button');
      showAnswer.innerHTML = 'Show Answer';
      showAnswer.onclick = this.showAnswer.bind(this);
      nextSteps.appendChild(showAnswer);
    }

    const newProblem = document.createElement('div');
    newProblem.classList.add('lesson__quiz__button');
    newProblem.innerHTML = 'Try New Problem';
    newProblem.onclick = this.newProblem.bind(this);
    nextSteps.appendChild(newProblem);


    const html = this.diagram.shapes.htmlElement(
      container,
      `id__quiz_answer_box__${id}`,
      '',
      new Point(0, 0),
      'middle',
      'center',
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

  // makeCorrectNextStepsMessage(id: string) {
  //   let text = `
  //     <p style="margin-bottom=0">
  //       |Try_new| problem.
  //     </p>
  //     `;
  //   const modifiers = { Try_new: click(this.newProblem, [this], this.layout.colors.line, id) };
  //   text = applyModifiers(text, modifiers);
  //   const html = this.diagram.shapes.htmlText(
  //     text, `id__quiz__correct_next_steps_${id}`,
  //     'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
  //   );
  //   setOnClicks(modifiers);
  //   return html;
  // }

  // makeIncorrectNextStepsMessage(id: string) {
  //   let text = `
  //     <p style="margin-bottom=0">
  //       |Try_again|, |show_answer| or |try_new_problem|.
  //     </p>
  //     `;
  //   const modifiers = {
  //     show_answer: click(this.showAnswer, [this], this.layout.colors.line, id),
  //     try_new_problem: click(this.newProblem, [this], this.layout.colors.line, id),
  //     Try_again: click(this.tryAgain, [this], this.layout.colors.line, id),
  //   };
  //   text = applyModifiers(text, modifiers);
  //   const html = this.diagram.shapes.htmlText(
  //     text, `id__quiz__incorrect_next_steps_${id}`,
  //     'lesson__quiz_nextsteps', this.layout.quiz.nextSteps, 'middle', 'center',
  //   );
  //   setOnClicks(modifiers);
  //   return html;
  // }

  makeQuizAnswerMessages(id: string, incorrectMessages: Object = {}) {
    const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
    // collection.add('correct', this.makeCorrectAnswerMessage(id));
    // collection.add('incorrect', this.makeIncorrectAnswerMessage(id));
    collection.add('correct', this.makeAnswerBox(`correct_${id}`, 'Correct!'));
    collection.add('incorrect', this.makeAnswerBox(`incorrect_${id}`, 'Incorrect!'));
    // collection.add('incorrectNextSteps', this.makeIncorrectNextStepsMessage(id));
    // collection.add('correctNextSteps', this.makeCorrectNextStepsMessage(id));
    Object.keys(incorrectMessages).forEach((key) => {
      const message = incorrectMessages[key];
      collection.add(key, this.makeIncorrectAnswerMessage(id, key, message));
    });
    return collection;
  }

  makeCheckButton(id: string) {
    const check = document.createElement('div');
    check.classList.add('lesson__quiz__button');
    check.innerHTML = 'Check';
    check.onclick = this.checkAnswer.bind(this);
    const html = this.diagram.shapes.htmlElement(
      check,
      `id__related_angles_check_${id}`,
      '',
      this.layout.quiz.check,
      'middle',
      'center',
    );
    return html;
  }

  makeNewProblemButton(id: string) {
    const newProblem = document.createElement('div');
    newProblem.classList.add('lesson__quiz__button');
    newProblem.innerHTML = 'New Problem';
    newProblem.onclick = this.newProblem.bind(this);
    const html = this.diagram.shapes.htmlElement(
      newProblem,
      `id__related_angles_new_problem_${id}`,
      '',
      this.layout.quiz.check,
      'middle',
      'center',
    );
    return html;
  }
}
