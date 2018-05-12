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
  lessonType: 'any' | 'singlePage' | 'multiPage' = 'singlePage',
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
  const expression = new RegExp(`\\|${key}\\|`, 'gi');
  let replacement = '';
  if (mod.lessonType === lessonType || mod.lessonType === 'any') {
    replacement = mod.replacementText;
  }
  outText = text.replace(expression, replacement);
  return outText;
}

class Section {
  title: string;
  modifiers: Object;
  diagrams: Array<Object>;
  // isSinglePagePrimary: boolean;

  constructor() {
    this.diagrams = [];
    // this.isSinglePagePrimary = this.setSinglePagePrimary();
    this.makeTitle();
    this.modifiers = this.setModifiers();
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

  // setSinglePagePrimary() {
  //   return true;
  // }
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
      if (bind.length === 5) {
        element.onclick = action.bind(bind[0], bind[1], bind[2], bind[3], bind[4]);
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
      htmlText = `${htmlText}${element}`;
    });
    // htmlText += '\n';
    Object.keys(this.modifiers).forEach((key) => {
      const mod = this.modifiers[key];
      htmlText = modifyText(htmlText, key, mod, lessonType);
    });
    return htmlText;
  }

  /* eslint-disable no-unused-vars */
  setState(
    diagrams: Object,
    previousState: Object,
    lessonType: 'multiPage' | 'singlePage',
  ) {
  }

  getState(diagrams: Object): Object {
    return {};
  }

  transitionNext(
    diagrams: Object,
    done: () => void = function temp() {},
  ): void {
    done();
  }
  transitionPrev(diagrams: Object, done: () => void = function temp() {}) {
    done();
  }
  /* eslint-enable no-unused-vars */
}

class diagramClass {
}
class Content {
  title: string;
  sections: Array<Section>;
  DiagramClass: Object;
  // questions

  constructor(
    title: string,
    sections: Array<Section>,
    multiPageDiagramClass: Object = diagramClass,
  ) {
    this.title = title;
    this.sections = sections;
    this.DiagramClass = multiPageDiagramClass;
  }
}

export { Section, Content, actionWord, diagramCanvas };
