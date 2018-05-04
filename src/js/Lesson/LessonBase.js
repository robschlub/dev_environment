// @flow

// import Diagram from '../diagram/Diagram';

function actionWord(
  text: string,
  id: string = '',
  classes: string = '',
  lessonType: 'any' | 'singlePage' | 'multiPage' = 'any',
): Object {
  return {
    replacementText: `<span id="${id}" class="${classes} action_word">${text}</span>`,
    type: 'html',
    id,
    lessonType,
  };
}

function diagramCanvas(
  id: string,
  DiagramClass: Object,
  classes: string = '',
  lessonType: 'any' | 'singlePage' | 'multiPage' = 'any',
): Object {
  return {
    replacementText: `<div id="${id}" class="canvas_container ${classes}">
        <canvas class="diagram__gl"></canvas>
        <div class="diagram__html"></div>
        <canvas class="diagram__text"></canvas>
      </div>`,
    type: 'diagram',
    DiagramClass,
    id,
    lessonType,
  };
}

function modifyText(
  text: string,
  key: string,
  mod: Object,
  lessonType: 'any' | 'multiPage' | 'singlePage',
): string {
  let outText = '';
  if (mod.lessonType === lessonType || mod.lessonType === 'any') {
    const expression = new RegExp(`\\|${key}\\|`, 'gi');
    if (mod.type === 'html') {
      outText = text.replace(expression, mod.replacementText);
    }
    if (mod.type === 'diagram') {
      if (mod.lessonType === lessonType
        || mod.lessonType === 'any'
      ) {
        outText = text.replace(expression, mod.replacementText);
      } else {
        outText = text.replace(expression, '');
      }
    }
  }
  return outText;
}

class Lesson {
  title: string;
  sections: Array<Section>;
  state: Object;
  modifiers: Object;

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
  modifiers: Object;
  // htmlContent: string;
  diagrams: Array<Object>;
  isSinglePagePrimary: boolean;

  constructor(lesson: Lesson) {
    this.diagrams = [];
    this.isSinglePagePrimary = this.setSinglePagePrimary();
    this.makeTitle();
    this.modifiers = this.setModifiers();
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

  setSinglePagePrimary() {
    return true;
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

  getDiagramList(lessonType: 'multiPage' | 'singlePage'): Array<Object> {
    const diagrams = [];
    Object.keys(this.modifiers).forEach((key) => {
      const modifier = this.modifiers[key];
      if (modifier.type === 'diagram'
        && (lessonType === modifier.lessonType || modifier.lessonType === 'any')
      ) {
        diagrams.push({
          id: modifier.id,
          DiagramClass: modifier.DiagramClass,
        });
      }
    });
    return diagrams;
  }

  getContent(lessonType: 'multiPage' | 'singlePage'): string {
    let htmlText = '';
    let content = this.setContent();
    if (typeof content === 'string') {
      content = [content];
    }
    content.forEach((element) => {
      htmlText = `${htmlText}${element}\n\n`;
    });
    Object.keys(this.modifiers).forEach((key) => {
      const mod = this.modifiers[key];
      htmlText = modifyText(htmlText, key, mod, lessonType);
    });
    return htmlText;
  }

  // eslint-disable-next-line no-unused-vars
  setState(diagrams: Object, lessonType: 'multiPage' | 'singlePage') {
  }

  // eslint-disable-next-line no-unused-vars
  // setStateMultiOnly(diagrams: Object) {
  // }

  // eslint-disable-next-line no-unused-vars
  getState(diagrams: Object) {
    // this.lesson.state = {};
  }
}

export { Section, Lesson, actionWord, diagramCanvas };
