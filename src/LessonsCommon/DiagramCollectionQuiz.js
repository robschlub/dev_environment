// @flow
import Diagram from '../js/diagram/Diagram';
import {
  Transform, Point,
} from '../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../js/diagram/Element';

// import CommonDiagramCollection from './DiagramCollection';

export type TypeMessages = {
  _correct: DiagramElementPrimative;
  // _correctNextSteps: DiagramElementPrimative;
  _incorrect: DiagramElementPrimative;
  // _incorrectNextSteps: DiagramElementPrimative;
} & DiagramElementCollection;


// export class CommonQuizDiagramCollection extends CommonDiagramCollection {
//   _check: DiagramElementPrimative;
//   _newProblem: DiagramElementPrimative;
//   +_messages: TypeMessages;

//   tryAgain() {
//     this._messages.hideAll();
//     this._check.show();
//     this.hasTouchableElements = true;
//     this.diagram.animateNextFrame();
//   }

//   newProblem() {
//     this._messages.hideAll();
//     this._newProblem.hide();
//     this.hasTouchableElements = true;
//     this.diagram.animateNextFrame();
//   }

//   showCheck() {
//     this._check.show();
//   }

//   checkAnswer() {
//     this._check.hide();
//     this.hasTouchableElements = false;
//     const answer = this.findAnswer();
//     if (answer === 'correct') {
//       this._messages.hideAll();
//       this._messages._correct.show();
//     } else if (answer === 'incorrect') {
//       this._messages.hideAll();
//       this._messages._incorrect.show();
//     } else {
//       this._messages.hideAll();
//       this._messages[`_${answer}`].show();
//     }
//     this.diagram.animateNextFrame();
//   }

//   // eslint-disable-next-line class-methods-use-this
//   findAnswer() {
//     return 'incorrect';
//   }

//   // eslint-disable-next-line class-methods-use-this
//   showAnswer() {
//     this.hasTouchableElements = false;
//     this._messages.hideAll();
//     this._check.hide();
//     this._newProblem.show();
//   }

//   constructor(
//     diagram: Diagram,
//     layout: Object = { colors: {} },
//     id: string = Math.round(Math.random() * 10000).toString(),
//     messages: Object = {},
//     transform: Transform = new Transform(),
//   ) {
//     super(diagram, layout, transform);
//     this.add('check', this.makeCheckButton(id));
//     this.add('newProblem', this.makeNewProblemButton(id));
//     this.add('messages', this.makeQuizAnswerMessages(id, messages));
//     this._messages.hideAll();
//   }

//   makeAnswerBox(
//     id: string,
//     answerText: string,
//     detailsText: string = '',
//     incorrectBox: boolean = true,
//   ) {
//     const container = document.createElement('div');
//     container.classList.add('lesson__quiz__answer_container');
//     if (incorrectBox) {
//       container.classList.add('lesson__quiz__answer_incorrect');
//     } else {
//       container.classList.add('lesson__quiz__answer_correct');
//     }

//     const answer = document.createElement('div');
//     answer.classList.add('lesson__quiz__answer_text');
//     answer.innerHTML = answerText;
//     container.appendChild(answer);

//     if (detailsText) {
//       const details = document.createElement('div');
//       details.classList.add('lesson__quiz__answer_details_text');
//       details.innerHTML = detailsText;
//       container.appendChild(details);
//     }

//     const nextSteps = document.createElement('div');
//     nextSteps.classList.add('lesson__quiz__next_steps');
//     container.appendChild(nextSteps);

//     if (incorrectBox) {
//       const tryAgain = document.createElement('div');
//       tryAgain.classList.add('lesson__quiz__button');
//       tryAgain.classList.add('lesson__quiz__button_fixed_size');
//       tryAgain.innerHTML = 'Try Again';
//       tryAgain.onclick = this.tryAgain.bind(this);
//       nextSteps.appendChild(tryAgain);

//       const showAnswer = document.createElement('div');
//       showAnswer.classList.add('lesson__quiz__button');
//       showAnswer.classList.add('lesson__quiz__button_fixed_size');
//       showAnswer.innerHTML = 'Show Answer';
//       showAnswer.onclick = this.showAnswer.bind(this);
//       nextSteps.appendChild(showAnswer);
//     }

//     const newProblem = document.createElement('div');
//     newProblem.classList.add('lesson__quiz__button');
//     newProblem.classList.add('lesson__quiz__button_fixed_size');
//     newProblem.innerHTML = 'Try New Problem';
//     newProblem.onclick = this.newProblem.bind(this);
//     nextSteps.appendChild(newProblem);


//     const html = this.diagram.shapes.htmlElement(
//       container,
//       `id__quiz_answer_box__${id}`,
//       '',
//       new Point(0, 0),
//       'middle',
//       'center',
//     );
//     return html;
//   }

//   makeQuizAnswerMessages(id: string, incorrectMessages: Object = {}) {
//     const collection = this.diagram.shapes.collection(new Transform().translate(0, 0));
//     collection.add('correct', this.makeAnswerBox(`correct_${id}`, 'Correct!', '', false));
//     collection.add('incorrect', this.makeAnswerBox(`incorrect_${id}`, 'Incorrect!'));

//     Object.keys(incorrectMessages).forEach((key) => {
//       const message = incorrectMessages[key].answer;
//       const subMessage = incorrectMessages[key].details;
//       collection.add(key, this.makeAnswerBox(`${key}_${id}`, message, subMessage));
//     });
//     return collection;
//   }

//   makeCheckButton(id: string) {
//     const check = document.createElement('div');
//     check.classList.add('lesson__quiz__button');
//     check.innerHTML = 'Check';
//     check.onclick = this.checkAnswer.bind(this);
//     const html = this.diagram.shapes.htmlElement(
//       check,
//       `id__related_angles_check_${id}`,
//       '',
//       this.layout.quiz.check,
//       'middle',
//       'center',
//     );
//     return html;
//   }

//   makeNewProblemButton(id: string) {
//     const newProblem = document.createElement('div');
//     newProblem.classList.add('lesson__quiz__button');
//     newProblem.innerHTML = 'New Problem';
//     newProblem.onclick = this.newProblem.bind(this);
//     const html = this.diagram.shapes.htmlElement(
//       newProblem,
//       `id__related_angles_new_problem_${id}`,
//       '',
//       this.layout.quiz.check,
//       'middle',
//       'center',
//     );
//     return html;
//   }
// }

const CommonQuizMixin = superclass => class extends superclass {
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

  // eslint-disable-next-line class-methods-use-this
  makeEntryBox(
    id: string,
    placeholder: string = '',
    numDigits: number = 10,
  ) {
    const container = document.createElement('div');
    container.classList.add('lesson__quiz_input_container');

    const input = document.createElement('input');
    input.classList.add('lesson__quiz_input');
    input.setAttribute('placeholder', placeholder);
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
      input.classList.add('lesson__quiz_input_disabled');
    };
    html.enable = () => {
      input.disabled = false;
      input.classList.remove('lesson__quiz_input_disabled');
    };

    return html;
  }
};

export default CommonQuizMixin;