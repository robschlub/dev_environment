// @flow

import Diagram from '../diagram/Diagram';

function actionWord(text: string, id: string = '', classes: string = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Paragraph {
  type: 'text' | 'diagram' | 'html';
  id: string;
  text: string;
  DiagramClass: Function;

  constructor(
    type: 'text' | 'diagram' | 'html' = 'html',
    content: string | Diagram = '',
    id: string = '',
  ) {
    this.type = type;
    if ((type === 'text' || type === 'html') && typeof content === 'string') {
      this.text = content;
    }
    if (type === 'diagram' && typeof content === 'function') {
      this.DiagramClass = content;
    }
    this.id = id;
  }
}

class Section {
  title: string;
  paragraphs: Array<Paragraph>;

  constructor() {
    this.makeTitle();
    // this.makeContent();
    this.makeContent();
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

  makeContent(): void {
    this.paragraphs = [];
    const content = this.setContent();
    const modifiers = this.setModifiers();
    content.forEach((paragraphOrText) => {
      let newParagraph;
      if (typeof paragraphOrText === 'string') {
        if (paragraphOrText[0] === '<') {
          newParagraph = new Paragraph('html', paragraphOrText);
        } else {
          newParagraph = new Paragraph('text', `<p>${paragraphOrText}</p>`);
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

  // eslint-disable-next-line
  setState(diagram: any) {
  }
}

class Lesson {
  title: string;
  sections: Array<Section>;
  constructor() {
    this.title = '';
    this.sections = [];
  }
}

export { Paragraph, Section, Lesson, actionWord };
