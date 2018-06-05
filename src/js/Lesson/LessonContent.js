// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementPrimative, DiagramElementCollection } from '../diagram/Element';
import { Transform } from '../diagram/tools/g2';

function actionWord(
  text: string,
  id: string = '',
  classes: string = '',
): Object {
  return {
    replacementText: `<span id="${id}" class="${classes} action_word">${text}</span>`,
    type: 'html',
    id,
  };
}

function diagramCanvas(
  id: string,
  DiagramClass: Object,
  classes: string = '',
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
  };
}

function modifyText(
  text: string,
  key: string,
  mod: Object,
): string {
  let outText = '';
  const expression = new RegExp(`\\|${key}\\|`, 'gi');
  const replacement = mod.replacementText;
  outText = text.replace(expression, replacement);
  return outText;
}

function onClickId(
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

class PositionObject {
  element: DiagramElementPrimative | DiagramElementCollection;
  position: Transform | null;
  animation: {
    fromPrev: {
      time: number,
      position: Transform | null;
    },
    fromNext: number | {
      time: number,
      position: Transform | null;
    },
    toPrev: {
      time: number,
      position: Transform | null;
    },
    toNext: {
      time: number,
      position: Transform | null,
    },
    fromGoTo: {
      time: number,
      position: Transform | null,
    }
  };

  constructor(element: DiagramElementCollection | DiagramElementPrimative) {
    this.element = element;
    this.position = null;
    this.animation = {
      fromPrev: {
        time: 0,
        position: null,
      },
      fromNext: {
        time: 0,
        position: null,
      },
      toPrev: {
        time: 0,
        position: null,
      },
      toNext: {
        time: 0,
        position: null,
      },
      fromGoTo: {
        time: 0,
        position: null,
      },
    };
  }
}
// type PositionObject = {
//   element: DiagramElementCollection | DiagramElementPrimative;
//   position: Transform;
//   animationTime: {
//     fromPrev: number;
//     fromNext: number;
//   }
// }
class Section {
  title: string;
  modifiers: Object;
  diagram: Diagram;
  showOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  hideOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  show: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  position: PositionObject;
  // isSinglePagePrimary: boolean;

  constructor(diagram: Diagram) {
    this.diagram = diagram;
    this.title = '';
    this.modifiers = {};
  }

  setContent(): Array<string> | string {
    return [];
  }

  getContent(): string {
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
      htmlText = modifyText(htmlText, key, mod);
    });
    return htmlText;
  }

  /* eslint-disable no-unused-vars */
  setState(previousState: Object) {
  }

  fillPosition(positionArray: Array<Object>) {
    const final = [];
    positionArray.forEach((p) => {
      const newP = new PositionObject(p.element);
      if ('position' in p) {
        newP.position = p.position;
      }
      if ('animation' in p) {
        const { animation } = p;
        if ('fromPrev' in animation) {
          const otherState = animation.fromPrev;
          if ('time' in otherState) {
            newP.animation.fromPrev.time = otherState.time;
          }
          if ('position' in otherState) {
            newP.animation.fromPrev.position = otherState.position;
          }
        }
        newP.position = p.position;
      }
      if ('position' in p) {
        newP.position = p.position;
      }
    });
    this.position = newP;
  }
  setPosition() {
    if ('position' in this) {
      const { position } = this;

    }
  }
  setVisible() {
    if ('showOnly' in this) {
      const elementsOrMethod = this.showOnly;
      if (Array.isArray(elementsOrMethod)) {
        this.diagram.elements.showOnly(elementsOrMethod);
      } else {
        elementsOrMethod();
      }
    }
    if ('hideOnly' in this) {
      const elementsOrMethod = this.hideOnly;
      if (Array.isArray(elementsOrMethod)) {
        this.diagram.elements.hideOnly(elementsOrMethod);
      } else {
        elementsOrMethod();
      }
    }
    if ('show' in this) {
      const elementsOrMethod = this.show;
      if (Array.isArray(elementsOrMethod)) {
        elementsOrMethod.forEach((element) => {
          element.show = true;
        });
      } else {
        elementsOrMethod();
      }
    }
  }

  getState(diagram: Diagram): Object {
    return {};
  }

  transitionNext(
    diagram: Diagram,
    done: () => void = function temp() {},
  ): void {
    done();
  }
  transitionPrev(diagram: Diagram, done: () => void = function temp() {}) {
    done();
  }
  /* eslint-enable no-unused-vars */
}

// class diagramClass {
// }

class LessonContent {
  title: string;
  sections: Array<Section>;
  diagram: Object;
  diagramHtmlId: string;
  // questions

  constructor(htmlId: string) {
    // this.setTitle();
    // this.setDiagram(htmlId);
    // this.sections = [];
    // this.addSections();
    this.diagramHtmlId = htmlId;
    this.sections = [];
    this.setTitle();
  }

  initialize() {
    this.setDiagram(this.diagramHtmlId);
    this.addSections();
  }
  setTitle() {
    this.title = '';
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  setDiagram(htmlId: string = '') {
  }

  // eslint-disable-next-line class-methods-use-this
  addSections() {
  }

  addSection(section: Object) {
    const s = new Section(this.diagram);

    Object.keys(section).forEach((key) => {
      // $FlowFixMe
      s[key] = section[key];
    });
    this.sections.push(s);
  }
}

export { Section, LessonContent, actionWord, diagramCanvas, onClickId };
