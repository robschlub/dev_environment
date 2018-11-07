// @flow
import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';

export type TypeMessages = {
  _correct: DiagramElementPrimative;
  _incorrect: DiagramElementPrimative;
} & DiagramElementCollection;


// $FlowFixMe
const CommonQuizMixin = superclass => class extends superclass {
  _check: DiagramElementPrimative;
  _newProblem: DiagramElementPrimative;
  _showAnotherAnswer: DiagramElementPrimative;
  +_messages: TypeMessages;
  answers: any;
  answer: any;
  answerIndex: number;

  tryAgain() {
    this._messages.hideAll();
    this._check.show();
    this.hasTouchableElements = true;
    if (this._intput != null) {
      this._input.enable();
      this._input.setValue('');
    }
    this.diagram.animateNextFrame();
  }

  newProblem() {
    this._messages.hideAll();
    this._newProblem.hide();
    if (this._input != null) {
      this._input.enable();
      this._input.setValue('');
    }
    this._showAnotherAnswer.hide();
    this.hasTouchableElements = true;
    this.answerIndex = -1;
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
    if (this._input != null) {
      this._input.disable();
      this._input.setValue(this.answer);
    }
    this.answerIndex = (this.answerIndex + 1) % this.answers.length;
    if (this.answers.length > 1) {
      this._showAnotherAnswer.show();
    }
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
    this.add('showAnotherAnswer', this.makeShowAnotherAnswerButton(id));
    this._messages.hideAll();
    this.answers = [];
    this.answer = '';
    // this.answerIndex = -1;
  }

  makeAnswerBox(
    id: string,
    answerText: string,
    detailsText: string = '',
    incorrectBox: boolean = true,
  ) {
    const container = document.createElement('div');
    container.classList.add('lesson__quiz__answer_container');
    if (incorrectBox) {
      container.classList.add('lesson__quiz__answer_incorrect');
    } else {
      container.classList.add('lesson__quiz__answer_correct');
    }

    const answer = document.createElement('div');
    answer.classList.add('lesson__quiz__answer_text');
    answer.innerHTML = answerText;
    container.appendChild(answer);

    if (detailsText) {
      const details = document.createElement('div');
      details.classList.add('lesson__quiz__answer_details_text');
      details.innerHTML = detailsText;
      container.appendChild(details);
    }

    const nextSteps = document.createElement('div');
    nextSteps.classList.add('lesson__quiz__next_steps');
    container.appendChild(nextSteps);

    if (incorrectBox) {
      const tryAgain = document.createElement('div');
      tryAgain.classList.add('lesson__quiz__button');
      tryAgain.classList.add('lesson__quiz__button_fixed_size');
      tryAgain.innerHTML = 'Try Again';
      tryAgain.onclick = this.tryAgain.bind(this);
      nextSteps.appendChild(tryAgain);

      const showAnswer = document.createElement('div');
      showAnswer.classList.add('lesson__quiz__button');
      showAnswer.classList.add('lesson__quiz__button_fixed_size');
      showAnswer.innerHTML = 'Show Answer';
      showAnswer.onclick = this.showAnswer.bind(this);
      nextSteps.appendChild(showAnswer);
    }

    const newProblem = document.createElement('div');
    newProblem.classList.add('lesson__quiz__button');
    newProblem.classList.add('lesson__quiz__button_fixed_size');
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

  makeQuizAnswerMessages(id: string, incorrectMessages: Object = {}) {
    const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
    collection.add('correct', this.makeAnswerBox(`correct_${id}`, 'Correct!', '', false));
    collection.add('incorrect', this.makeAnswerBox(`incorrect_${id}`, 'Incorrect!'));

    Object.keys(incorrectMessages).forEach((key) => {
      const message = incorrectMessages[key].answer;
      const subMessage = incorrectMessages[key].details;
      collection.add(key, this.makeAnswerBox(`${key}_${id}`, message, subMessage));
    });
    return collection;
  }

  makeButton(id: string, label: string, callback: Function, position: Point) {
    const button = document.createElement('div');
    button.classList.add('lesson__quiz__button');
    button.innerHTML = label;
    button.onclick = callback;
    const html = this.diagram.shapes.htmlElement(
      button,
      `id__lesson_quiz_button_${id}`,
      '',
      position,
      'middle',
      'center',
    );
    html.isInteractive = true;
    return html;
  }

  makeCheckButton(id: string) {
    return this.makeButton(
      `check__${id}`, 'Check', this.checkAnswer.bind(this), this.layout.quiz.check,
    );
  }

  makeNewProblemButton(id: string) {
    return this.makeButton(
      `new_problem__${id}`, 'New Problem', this.newProblem.bind(this),
      this.layout.quiz.newProblem,
    );
  }

  makeShowAnotherAnswerButton(id: string) {
    return this.makeButton(
      `show_another_answer__${id}`, 'Show Another Answer', this.showAnswer.bind(this),
      this.layout.quiz.showAnotherAnswer,
    );
  }

  addInput(id: string, defaultText: string = '', numDigits: number = 10) {
    this.add('input', this.makeEntryBox('input1', defaultText, numDigits));
  }

  // eslint-disable-next-line class-methods-use-this
  makeEntryBox(
    id: string,
    placeholder: string = '',
    numDigits: number = 10,
  ) {
    const container = document.createElement('div');
    container.classList.add('lesson__quiz_input_container');
    // const form = document.createElement('form');
    // container.appendChild(form);
    const input = document.createElement('input');
    input.classList.add('lesson__quiz_input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);
    input.onkeypress = (event) => {
      if (event.keyCode === 13) {
        this.checkAnswer();
      }
    };
    input.oninput = () => {
      const str = input.value.slice();
      let validStr = '';
      for (let i = 0; i < str.length; i += 1) {
        if (validStr.length >= numDigits) {
          i = str.length;
        } else {
          const char = str.charAt(i);
          if (char >= '0' && char <= '9') {
            validStr = `${validStr}${char}`;
          }
        }
      }
      input.value = `${validStr}`;
    };
    container.appendChild(input);
    const html = this.diagram.shapes.htmlElement(
      container,
      `id__quiz_input__${id}`,
      '',
      new Point(0, 0),
      'middle',
      'center',
    );
    html.isInteractive = true;
    html.getValue = () => input.value;
    html.setValue = (value: number | string) => {
      if (typeof value === 'number') {
        input.value = value.toString();
      } else {
        input.value = value;
      }
    };
    html.disable = () => {
      input.disabled = true;
      html.isInteractive = false;
      input.classList.add('lesson__quiz_input_disabled');
    };
    html.enable = () => {
      input.disabled = false;
      html.isInteractive = true;
      input.classList.remove('lesson__quiz_input_disabled');
    };
    return html;
  }

  // eslint-disable-next-line class-methods-use-this
  selectMultipleChoice(id: string, index: number = -1) {
    const indexStr = 'id_lesson__quiz_multiple_choice_box_';
    const answerSelected = 'lesson__quiz_multiple_choice_box_answer__selected';
    const circleSelected = 'lesson__quiz_multiple_choice_box_circle__selected';
    const elementSelected = 'lesson__quiz_multiple_choice_box__selected';

    const selected = document.getElementsByClassName(elementSelected);
    const selectedLength = selected.length;
    if (selected) {
      for (let i = 0; i < selectedLength; i += 1) {
        const element = selected[0];
        element.classList.remove(answerSelected);
        element.classList.remove(circleSelected);
        element.classList.remove(elementSelected);
      }
    }
    if (index > -1) {
      const circle = document.getElementById(`${indexStr}circle__${id}_${index}`);
      const answer = document.getElementById(`${indexStr}answer__${id}_${index}`);
      if (circle instanceof HTMLElement && answer instanceof HTMLElement) {
        circle.classList.add(circleSelected);
        circle.classList.add(elementSelected);
        answer.classList.add(answerSelected);
        answer.classList.add(elementSelected);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getMultipleChoiceSelection(id: string) {
    const elementSelected = 'lesson__quiz_multiple_choice_box__selected';
    const selected = document.getElementsByClassName(elementSelected);
    for (let i = 0; i < selected.length; i += 1) {
      const idIndex = selected[i].id.replace('id_lesson__quiz_multiple_choice_box_circle__', '');
      const idString = idIndex.replace(/_[0-9]*$/, '');
      if (idString === id) {
        return parseInt(idIndex.replace(`${idString}_`, ''), 10);
      }
    }
    return -1;
  }


  makeMultipleChoice(
    id: string,
    answers: Array<string>,
  ) {
    const table = document.createElement('table');
    table.classList.add('lesson__quiz_multiple_choice_box_table');
    answers.forEach((answer, index) => {
      const row = document.createElement('tr');
      row.classList.add('lesson__quiz_multiple_choice_box_row');
      row.onclick = this.selectMultipleChoice.bind(this, id, index);
      const col1 = document.createElement('td');
      col1.classList.add('lesson__quiz_multiple_choice_box_col1');
      const col2 = document.createElement('td');
      col2.classList.add('lesson__quiz_multiple_choice_box_col2');
      const circle = document.createElement('div');
      circle.classList.add('lesson__quiz_multiple_choice_box_circle');
      circle.id = `id_lesson__quiz_multiple_choice_box_circle__${id}_${index}`;
      const answerText = document.createElement('div');
      answerText.classList.add('lesson__quiz_multiple_choice_box_answer');
      answerText.id = `id_lesson__quiz_multiple_choice_box_answer__${id}_${index}`;
      answerText.innerHTML = answer;
      row.appendChild(col1);
      row.appendChild(col2);
      col1.appendChild(circle);
      col2.appendChild(answerText);
      table.appendChild(row);
    });
    const html = this.diagram.shapes.htmlElement(
      table,
      `id__quiz_multiple_choice_box__${id}`,
      '',
      new Point(0, 0),
      'left',
      'top',
    );
    html.enable = (doEnable: boolean = true) => {
      const { element } = html.drawingObject;
      const classStr = 'lesson__quiz_multiple_choice_box_answer__disable';
      if (doEnable) {
        element.classList.remove(classStr);
      } else {
        element.classList.add(classStr);
      }
    };
    html.disable = () => { html.enable(false); };
    return html;
  }
};

export default CommonQuizMixin;
