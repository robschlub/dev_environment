// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementPrimative, DiagramElementCollection } from '../diagram/Element';
import { colorArrayToRGBA } from '../tools/tools';
// import { Transform, Point } from '../diagram/tools/g2';

function centerV(text: string = '') {
  return `<div style="display: table; height: 100%;">
        <div style="display: table-cell; vertical-align: middle">
        ${text}</div></div>`;
}

function centerVH(text: string = '') {
  return `<div style="display: table; height: 100%; text-align:center; width:100%">
        <div style="display: table-cell; vertical-align: middle">
        ${text}</div></div>`;
}

function centerH(text: string = '') {
  return `<div style="text-align:center;">
        ${text}</div>`;
}

function actionWord(
  text: string,
  id: string = '',
  classesOrColor: string | Array<number> | null = null,
  color: Array<number> | null = null,
): Object {
  let classes = '';
  let colorStyle = '';
  if (typeof classesOrColor === 'string') {
    classes = classesOrColor;
  }
  if (Array.isArray(classesOrColor)) {
    colorStyle = ` style="color:${colorArrayToRGBA(classesOrColor)};"`;
  } else if (color) {
    colorStyle = ` style="color:${colorArrayToRGBA(color)};"`;
  }
  return {
    replacementText: `<span id="${id}" class="${classes} action_word"${colorStyle}>${text}</span>`,
    type: 'html',
    id,
  };
}
function highlightWord(
  text: string,
  id: string = '',
  classesOrColor: string | Array<number> | null = null,
  color: Array<number> | null = null,
): Object {
  let classes = '';
  let colorStyle = '';
  if (typeof classesOrColor === 'string') {
    classes = classesOrColor;
  }
  if (Array.isArray(classesOrColor)) {
    colorStyle = ` style="color:${colorArrayToRGBA(classesOrColor)};"`;
  } else if (color) {
    colorStyle = ` style="color:${colorArrayToRGBA(color)};"`;
  }
  return {
    replacementText: `<span id="${id}" class="${classes} highlight_word"${colorStyle}>${text}</span>`,
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
    element.classList.add('action_word_enabled');
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

// class PositionObject {
//   element: DiagramElementPrimative | DiagramElementCollection;
//   position: Transform | null;
//   animTimeFromPrev: number;
//   animTimeFromNext: number;
//   animTimeFromGoTo: number;
//   animTimeToPrev: number;
//   animTimeToNext: number;

//   constructor(element: DiagramElementCollection | DiagramElementPrimative) {
//     this.element = element;
//     this.position = null;
//     this.animTimeFromPrev = 0;
//     this.animTimeFromNext = 0;
//     this.animTimeFromGoTo = 0;
//     this.animTimeToPrev = 0;
//     this.animTimeToNext = 0;
//   }
// }
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
  hide: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  initialPositions: Object | () => {};

  constructor(diagram: Diagram) {
    this.diagram = diagram;
    this.title = '';
    this.modifiers = {};
    this.showOnly = [];
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
  setSteadyState(previousState: Object) {
  }

  /* eslint-disable no-unused-vars */
  setEnterState(previousState: Object) {
  }

  /* eslint-disable no-unused-vars */
  setLeaveState() {
  }

  // setInitialPositions() {
  //   if ('initialPositions' in this) {
  //     const elementsOrMethod = this.initialPositions;
  //     if (typeof elementsOrMethod === 'function') {
  //       elementsOrMethod();
  //     }
  //     if (Array.isArray(elementsOrMethod)) {
  //       for (let i = 0; i < elementsOrMethod.length; i += 2) {
  //         const element = elementsOrMethod[i];
  //         const transformPointOrNumber = elementsOrMethod[i + 1];
  //         if (transformPointOrNumber instanceof Transform) {
  //           element.transform = transformPointOrNumber.copy();
  //         } else if (transformPointOrNumber instanceof Point) {
  //           element.transform.updateTranslation(transformPointOrNumber);
  //         } else if (typeof transformPointOrNumber === 'number') {
  //           element.transform.updateRotation(transformPointOrNumber);
  //         }
  //       }
  //     }
  //   }
  // }

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
          if (element instanceof DiagramElementCollection) {
            element.showAll();
          } else {
            element.show();
          }
        });
      } else {
        elementsOrMethod();
      }
    }
    if ('hide' in this) {
      const elementsOrMethod = this.hide;
      if (Array.isArray(elementsOrMethod)) {
        elementsOrMethod.forEach((element) => {
          if (element instanceof DiagramElementCollection) {
            element.hideAll();
          } else {
            element.hide();
          }
        });
      } else {
        elementsOrMethod();
      }
    }
  }

  getState(diagram: Diagram): Object {
    return {};
  }

  transitionNext(done: () => void = function temp() {}): void {
    done();
  }
  transitionFromNext(done: () => void = function temp() {}): void {
    done();
  }
  transitionPrev(done: () => void = function temp() {}): void {
    done();
  }
  transitionFromPrev(done: () => void = function temp() {}): void {
    done();
  }
  transitionFromAny(done: () => void = function temp() {}): void {
    done();
  }
  transitionToAny(done: () => void = function temp() {}): void {
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

export {
  Section, LessonContent, actionWord,
  diagramCanvas, onClickId, highlightWord, centerV, centerH, centerVH,
};
