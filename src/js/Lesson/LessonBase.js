// @flow

import Diagram from '../diagram/Diagram';

function actionWord(text: string, id: string = '', classes: string = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Paragraph {
  type: 'text' | 'diagram' | 'html' | 'divStart' | 'divEnd';
  id: string;
  text: string;
  DiagramClass: Function;
  className: string;

  constructor(
    type: 'text' | 'diagram' | 'html' | 'divStart' | 'divEnd' = 'text',
    content: string | Diagram = '',
    id: string = '',
    className: string = '',
  ) {
    this.type = type;
    if ((type === 'text' || type === 'html') && typeof content === 'string') {
      this.text = content;
    }
    if (type === 'diagram' && typeof content === 'function') {
      this.DiagramClass = content;
    }
    this.id = id;
    if (type === 'divStart') {
      this.className = className;
    }
  }
}

function divStart(id: string, className: string = '') {
  return new Paragraph('divStart', '', id, className);
}
function divEnd() {
  return new Paragraph('divEnd');
}

class Lesson {
  title: string;
  sections: Array<Section>;
  state: Object;

  constructor() {
    this.title = '';
    this.sections = [];
    this.state = {};
  }
}

class Section {
  title: string;
  paragraphs: Array<Paragraph>;
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.makeTitle();
    // this.makeContent();
    this.makeContent();
    this.lesson = lesson;
    // this.state = {};
  }

  makeTitle() {
    this.title = this.setTitle();
  }

  setContent(): Array<Paragraph | string> {
    return [];
  }
  setTitle(): string {
    return '';
  }
  setModifiers(): Object {
    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  onClickId(
    id: string,
    action: Function,
    bind: Array<mixed>,
  ) {
    const element = document.getElementById(id);
    if (element) {
      if (bind.length === 1) {
        element.onclick = action.bind(bind[0]);
      }
      if (bind.length === 2) {
        element.onclick = action.bind(bind[0], bind[1]);
      }
      if (bind.length === 3) {
        element.onclick = action.bind(bind[0], bind[1], bind[2]);
      }
      if (bind.length === 4) {
        element.onclick = action.bind(bind[0], bind[1], bind[2], bind[3]);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  cleanDivs(content: Array<Paragraph | string>): Array<Paragraph | string> {
    let divCount = 0;
    const newContent = content.slice();
    content.forEach((element) => {
      if (element.type === 'divStart') {
        divCount += 1;
      }
      if (element.type === 'divEnd') {
        divCount -= 1;
      }
    });

    // If divCount > 0, then need to add divEnds to clean it up
    for (let i = 0; i < divCount; i += 1) {
      newContent.push(divEnd());
    }

    // If divCount < 0, then need to remove divEnds to clean it up
    return newContent;
  }

  makeContent(): void {
    this.paragraphs = [];
    let content = this.setContent();
    content = this.cleanDivs(content);
    const modifiers = this.setModifiers();
    content.forEach((paragraphOrText) => {
      let newParagraph;
      if (typeof paragraphOrText === 'string') {
        if (paragraphOrText[0] === '<') {
          newParagraph = new Paragraph('html', paragraphOrText);
        } else {
          newParagraph = new Paragraph('text', `${paragraphOrText}`);
        }
      } else {
        newParagraph = paragraphOrText;
      }
      if (newParagraph.type === 'text' || newParagraph.type === 'html') {
        Object.keys(modifiers).forEach((key) => {
          const expression = new RegExp(`\\|${key}\\|`, 'gi');
          newParagraph.text =
            newParagraph.text.replace(expression, modifiers[key]);
        });
      }
      this.paragraphs.push(newParagraph);
    });
  }

  // eslint-disable-next-line no-unused-vars
  setState(diagram: Array<any>) {
  }

  // eslint-disable-next-line no-unused-vars
  getState(diagram: Array<any>) {
    // this.lesson.state = {};
  }
}


export { Paragraph, Section, Lesson, actionWord, divStart, divEnd };
