// @flow

// import Diagram from '../diagram/Diagram';

function actionWord(text: string, id: string = '', classes: string = '') {
  return {
    replacementText: `<span id="${id}" class="${classes} action_word">${text}</span>`,
    type: 'html',
  };
}

function diagramCanvas(id: string, DiagramClass: Object, classes: string = '') {
  return {
    replacementText: `<div id="${id}" class="canvas_container ${classes}">
        <canvas class="diagram_gl"></canvas>
        <div class="diagram_html"></div>
        <canvas class="diagram_text"></canvas>
      </div>`,
    type: 'diagram',
    DiagramClass,
    id,
  };
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
  // paragraphs: Array<Paragraph>;
  lesson: Lesson;
  htmlContent: string;
  diagrams: Array<Object>;

  constructor(lesson: Lesson) {
    this.diagrams = [];

    this.makeTitle();
    this.makeContent();
    this.lesson = lesson;
  }

  makeTitle() {
    this.title = this.setTitle();
  }

  setContent(): Array<string> | string {
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

  makeContent(): void {
    let content = this.setContent();
    if (typeof content === 'string') {
      content = [content];
    }
    const modifiers = this.setModifiers();
    let htmlText = '';
    content.forEach((element) => {
      htmlText = `${htmlText}${element}\n\n`;
    });
    Object.keys(modifiers).forEach((key) => {
      const expression = new RegExp(`\\|${key}\\|`, 'gi');
      htmlText = htmlText.replace(expression, modifiers[key].replacementText);
      if (modifiers[key].type === 'diagram') {
        this.diagrams.push({
          id: modifiers[key].id,
          DiagramClass: modifiers[key].DiagramClass,
        });
      }
    });
    this.htmlContent = htmlText;
  }

  // eslint-disable-next-line no-unused-vars
  setState(diagram: Array<any>) {
  }

  // eslint-disable-next-line no-unused-vars
  getState(diagram: Array<any>) {
    // this.lesson.state = {};
  }
}

export { Section, Lesson, actionWord, diagramCanvas };
