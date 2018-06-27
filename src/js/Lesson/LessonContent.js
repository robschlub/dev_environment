// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementPrimative, DiagramElementCollection } from '../diagram/Element';
import { colorArrayToRGBA } from '../tools/tools';
// import { Transform, Point } from '../diagram/tools/g2';

function centerV(text: string = '') {
  return `<div style="display: table; height: 100%;" class="lesson__p_top_margin_2">
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

function toHTML(
  text: string = '',
  id: string = '',
  classes: string = '',
  color: Array<number> | null = null,
) {
  let idStr = '';
  if (id) {
    idStr = ` id="${id}"`;
  }
  let classStr = '';
  if (classes) {
    classStr = ` class="${classes}"`;
  }
  let colorStr = '';
  if (color) {
    colorStr = ` style="color:${colorArrayToRGBA(color)};"`;
  }
  return {
    replacementText: `<span${idStr}${classStr}"${colorStr}>${text.replace(RegExp(/_/, 'gi'), ' ').trim()}</span>`,
  };
}

function highlight(classes: string = '') {
  const classStr = `${classes} highlight_word`;
  return {
    replacementText: (text: string) => toHTML(text, '', classStr),
  };
}

function highlightWord(text: string, classes: string = '') {
  const classStr = `${classes} highlight_word`;
  return {
    replacementText: toHTML(text, '', classStr).replacementText,
  };
}

function addClass(classes: string = '') {
  return {
    replacementText: (text: string) => toHTML(text, '', classes),
    // id: '',
  };
}

function addId(id: string = '') {
  return {
    replacementText: (text: string) => toHTML(text, id),
    // id: '',
  };
}


function clickWord(
  textToUse: string,
  id: string,
  actionMethod: Function,
  bind: Array<mixed>,
  classesOrColor: string | Array<number> | null = null,
) {
  let classStr = 'action_word';
  if (typeof classesOrColor === 'string') {
    classStr = `${classesOrColor} ${classStr}`;
  }
  let color = null;
  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }
  const idToUse = () => id;
  // const id = `lesson__id_${textToUse}`;
  return {
    replacementText: () => toHTML(textToUse, idToUse(), classStr, color),
    id: idToUse,
    actionMethod,
    bind,
  };
}


function click(
  actionMethod: Function,
  bind: Array<mixed>,
  classesOrColor: string | Array<number> | null = null,
) {
  let classStr = 'action_word';
  if (typeof classesOrColor === 'string') {
    classStr = `${classesOrColor} ${classStr}`;
  }
  let color = null;
  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }
  const idToUse = (text: string) => `lesson__id_${text}`;
  return {
    replacementText: (text: string) => toHTML(text, idToUse(text), classStr, color),
    id: idToUse,
    actionMethod,
    bind,
  };
}

function actionWord(
  text: string,
  id: string = '',
  classesOrColor: string | Array<number> | null = null,
) {
  let classStr = 'action_word';
  if (typeof classesOrColor === 'string') {
    classStr = `${classesOrColor} ${classStr}`;
  }
  let color = null;
  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }
  return {
    replacementText: toHTML(text, id, classStr, color).replacementText,
    id,
  };
}

function diagramCanvas(
  id: string,
  DiagramClass: Object,
  classes: string = '',
): Object {
  return {
    replacementText: () => `<div id="${id}" class="canvas_container ${classes}">
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
  let replacement = '';
  if (typeof mod.replacementText === 'string') {
    replacement = mod.replacementText;
  } else {
    replacement = mod.replacementText(key).replacementText;
    // console.log(replacement)
  }
  outText = text.replace(expression, replacement);
  return outText;
}

function onClickId(
  id: string,
  actionMethod: Function,
  bind: Array<mixed>,
) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add('action_word_enabled');
    if (bind.length === 1) {
      element.onclick = actionMethod.bind(bind[0]);
    }
    if (bind.length === 2) {
      element.onclick = actionMethod.bind(bind[0], bind[1]);
    }
    if (bind.length === 3) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2]);
    }
    if (bind.length === 4) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3]);
    }
    if (bind.length === 5) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4]);
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
  blank: Array<string>;
  diagram: Diagram;
  // comingFrom: 'next' | 'prev' | 'goto';
  // goingTo: 'next' | 'prev' | 'goto';
  showOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  hideOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  show: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  hide: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};
  initialPositions: Object | () => {};
  blankTransition: {
    toNext: boolean;
    toPrev: boolean;
    fromNext: boolean;
    fromPrev: boolean;
    toGoto: boolean;
    fromGoto: boolean;
  }

  constructor(diagram: Diagram) {
    this.diagram = diagram;
    this.title = '';
    this.modifiers = {};
    this.showOnly = [];
    this.blank = [];
    this.blankTransition = {
      toNext: false,
      toPrev: false,
      fromNext: false,
      fromPrev: false,
      toGoto: false,
      fromGoto: false,
    };
  }

  setContent(): Array<string> | string {
    return [];
  }

  setOnClicks() {
    Object.keys(this.modifiers).forEach((key) => {
      const mod = this.modifiers[key];
      if ('actionMethod' in mod) {
        onClickId(mod.id(key), mod.actionMethod, mod.bind);
      }
    });
  }
  getContent(): string {
    let htmlText = '';
    let content = '';
    if (typeof this.setContent === 'string'
        || Array.isArray(this.setContent)) {
      content = this.setContent;
    } else {
      content = this.setContent();
    }
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

    // Go through all text, and replace all characters between | | with
    // with default keywords
    const r = RegExp(/\|([^|]*)\|/, 'gi');
    return htmlText.replace(r, '<span class="highlight_word">$1</span>');
  }

  /* eslint-disable no-unused-vars */
  setSteadyState(previousState: Object) {
  }

  /* eslint-disable no-unused-vars */
  setEnterState(previousState: Object) {
  }

  /* eslint-disable no-unused-vars */
  setLeaveState(): ?Object {
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

  setBlanks() {
    this.blank.forEach((element) => {
      if (element in this.blankTransition) {
        this.blankTransition[element] = true;
      }
    });
    // if ('blank' in this) {
    //   Object.keys(this.blank).forEach((key) => {
    //     this.blankTransition[key] = this.blank[key];
    //   });
    // }
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

  transitionToNext(done: () => void = function temp() {}): void {
    done();
  }
  transitionFromNext(done: () => void = function temp() {}): void {
    done();
  }
  transitionToPrev(done: () => void = function temp() {}): void {
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
  goingTo: 'next' | 'prev' | 'goto';
  comingFrom: 'next' | 'prev' | 'goto';
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
  Section, LessonContent, actionWord, click, highlight, addClass, addId,
  diagramCanvas, onClickId, highlightWord, centerV, centerH, centerVH, toHTML,
  clickWord,
};
