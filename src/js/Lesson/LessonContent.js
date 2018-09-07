// @flow

import Diagram from '../diagram/Diagram';
import { Point } from '../diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../diagram/Element';
import { colorArrayToRGBA } from '../tools/tools';
// import { Transform, Point } from '../diagram/tools/g2';

function centerV(text: string = '') {
  return `<div style="display: table; height: 100%;" class="lesson__diatram_text_p_top_margin_2">
        <div style="display: table-cell; vertical-align: middle">
        ${text}</div></div>`;
}

function centerVH(text: string = '') {
  return `<div style="display: table; height: 100%; text-align:center; width:100%" class="lesson__diatram_text_p_top_margin_2">
        <div style="display: table-cell; vertical-align: middle">
        ${text}</div></div>`;
}

function centerH(text: string = '') {
  return `<div style="text-align:center;">
        ${text}</div>`;
}

function itemSelector(
  items: Array<string> = [''],
  classes: string = '',
  selectorIndex: number = 0,
) {
  let outStr = `<ul id="id__lesson_item_selector_${selectorIndex}" 
                    class=${classes}>`;
  items.forEach((item, index) => {
    outStr += `<li id="id__lesson_item_selector_${index}">${item}</li>`;
  });
  outStr += '</ul>';
  return outStr;
}

const unit = (deg: string, rad: string) => `<span class="lesson__unit_deg">${deg}</span><span class="lesson__unit_rad">${rad}</span>
  `;


function initializeItemSelector(
  methodToExecute: Function,
  bindingObject: Object,
  index: number = 0,
) {
  const elem = document
    .getElementById(`id__lesson_item_selector_${index}`);
  if (elem != null) {
    if (elem.children.length > 0) {
      for (let i = 0; i < elem.children.length; i += 1) {
        elem.children[i].onclick = methodToExecute.bind(bindingObject, i);
      }
    }
  }
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
  id: string = '',
) {
  let classStr = 'action_word';
  if (typeof classesOrColor === 'string') {
    classStr = `${classesOrColor} ${classStr}`;
  }
  let color = null;
  if (Array.isArray(classesOrColor)) {
    color = classesOrColor;
  }
  const idToUse = (text: string) => `lesson__id_${text}${id}`;
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

function interactiveItem(
  element: DiagramElementPrimative | DiagramElementCollection | string,
  location: string | Point,
) {
  return {
    element,
    location,
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
    if (bind.length === 6) {
      element.onclick = actionMethod.bind(bind[0], bind[1], bind[2], bind[3], bind[4], bind[5]);
    }
    if (bind.length === 7) {
      element.onclick = actionMethod.bind(
        bind[0], bind[1], bind[2], bind[3], bind[4],
        bind[5], bind[6],
      );
    }
  }
}

function applyModifiers(text: string, modifiers: Object) {
  let outText = text;
  Object.keys(modifiers).forEach((key) => {
    const mod = modifiers[key];
    outText = modifyText(outText, key, mod);
  });
  return outText;
}

function setOnClicks(modifiers: Object) {
  Object.keys(modifiers).forEach((key) => {
    const mod = modifiers[key];
    if ('actionMethod' in mod) {
      onClickId(mod.id(key), mod.actionMethod, mod.bind);
    }
  });
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

type TypeInteractiveElement = DiagramElementCollection
                              | DiagramElementPrimative
                              | string
                              | HTMLElement;
type TypeInteractiveElementLocation = 'center' | 'zero' | ''
                                      | 'topleft' | 'topright' | Point;

class Section {
  title: string;
  modifiers: Object;
  infoModifiers: Object;
  hint: Array<string> | string;
  blank: Array<string>;
  diagram: Diagram;
  infoElements: Array<DiagramElementCollection | DiagramElementPrimative>;
  showOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};

  hideOnly: Array<DiagramElementPrimative | DiagramElementCollection>
           | () => {};

  show: Array<DiagramElementPrimative | DiagramElementCollection> | () => {};
  hide: Array<DiagramElementPrimative | DiagramElementCollection> | () => {};
  initialPositions: Object | () => {};
  blankTransition: {
    toNext: boolean;
    toPrev: boolean;
    fromNext: boolean;
    fromPrev: boolean;
    toGoto: boolean;
    fromGoto: boolean;
  };

  interactiveElements: Array<{
    element: TypeInteractiveElement,
    location: TypeInteractiveElementLocation,
  }>;

  removeInteractiveElements: Array<{
    element: TypeInteractiveElement,
    location: TypeInteractiveElementLocation,
  }>;

  interactiveElementsOnly: Array<{
    element: TypeInteractiveElement,
    location: TypeInteractiveElementLocation,
  }>;

  currentInteractiveItem: number;

  constructor(diagram: Diagram) {
    this.diagram = diagram;
    this.title = '';
    this.modifiers = {};
    this.infoModifiers = {};
    this.showOnly = [];
    this.blank = [];
    this.infoElements = [];
    this.blankTransition = {
      toNext: false,
      toPrev: false,
      fromNext: false,
      fromPrev: false,
      toGoto: false,
      fromGoto: false,
    };
    this.interactiveElements = [];
    this.currentInteractiveItem = -1;
  }

  setContent(): Array<string> | string {
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  setInfo(): Array<string> | string {
    return [];
  }

  setOnClicks() {
    setOnClicks(this.modifiers);
    setOnClicks(this.infoModifiers);
  }

  getInfo(): string {
    let htmlText = '';
    let info = '';
    if (typeof this.setInfo === 'string'
        || Array.isArray(this.setInfo)) {
      info = this.setInfo;
    } else {
      info = this.setInfo();
    }
    if (typeof info === 'string') {
      info = [info];
    }
    info.forEach((element) => {
      htmlText = `${htmlText}${element}`;
    });
    // htmlText += '\n';
    htmlText = applyModifiers(htmlText, this.infoModifiers);

    // Go through all text, and replace all characters between | | with
    // with default keywords
    const r = RegExp(/\|([^|]*)\|/, 'gi');
    return htmlText.replace(r, '<span class="highlight_word">$1</span>');
  }

  setInfoButton() {
    const infoHtml = this.getInfo();
    const infoElement = document.getElementById('id_lesson__info_button');
    const infoBox = document.getElementById('id_lesson__info_box__text');
    if (infoElement instanceof HTMLElement) {
      if (infoHtml) {
        infoElement.classList.remove('lesson__info_hide');
        if (infoBox instanceof HTMLElement) {
          infoBox.innerHTML = infoHtml;
        }
      } else {
        infoElement.classList.add('lesson__info_hide');
      }
    }
  }

  setInteractiveElementsButton() {
    // const infoHtml = this.getInfo();
    const button = document
      .getElementById('id_lesson__interactive_element_button');
    // const infoBox = document.getElementById('id_lesson__info_box__text');
    if (button instanceof HTMLElement) {
      if (this.interactiveItems.length > 0) {
        button.classList.remove('lesson__interactive_element_button__hide');
      } else {
        button.classList.add('lesson__interactive_element_button__hide');
      }
    }
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
    htmlText = applyModifiers(htmlText, this.modifiers);
    // Object.keys(this.modifiers).forEach((key) => {
    //   const mod = this.modifiers[key];
    //   htmlText = modifyText(htmlText, key, mod);
    // });

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
  //           element.transform = transformPointOrNumber._dup();
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

  setInteractiveElements() {
    if ('interactiveElementsOnly' in this) {
      this.interactiveElements = this.interactiveElementsOnly;
    }

    const elements = document.getElementsByClassName('action_word');
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      this.interactiveElements.push({
        element,
        location: 'topright',
      });
    }

    highlightElementsOnly
    highlightElements          // override, add
    highlightElementsRemove    // remove

    if ('removeInteractiveElements' in this) {
      this.removeInteractiveElements.forEach((element) => {
        let elem = element;
        if (typeof element === 'string') {
          elem = document.getElementById(element);
        }
        for (let i = 0; i < this.interactiveElements.length; i += 1) {
          const item = this.interactiveElements[i];
          if (item.element === elem) {
            this.interactiveElements.splice(i, 1);
            i = this.interactiveElements.length;
          }
        }
      });
    }
  }
  // setInteractiveItems() {
  //   if ('interativeItems' in this) {
  //     this.interativeItems = interativeItems;
  //   }
  // }
  // setInfoElements() {
  //   if ('infoElements' in this) {
  //     const elementsOrMethod = this.showOnly;
  //     if (Array.isArray(elementsOrMethod)) {
  //       this.diagram.elements.showOnly(elementsOrMethod);
  //     } else {
  //       elementsOrMethod();
  //     }
  //   }
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
const whichAnimationEvent = () => {
  // let t;
  const el = document.createElement('fakeelement');

  const transitions = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
  };
  // for (t in transitions) {
  //   console.log(t)
  //   if (el.style[t] !== undefined) {
  //     return transitions[t];
  //   }
  // }
  for (let i = 0; i < Object.keys(transitions).length; i += 1) {
    const key = Object.keys(transitions)[i];
    if (key in el.style) {
      return transitions[key];
    }
  }
  return '';
};

class LessonContent {
  title: string;
  sections: Array<Section>;
  diagram: Object;
  diagramHtmlId: string;
  goingTo: 'next' | 'prev' | 'goto';
  comingFrom: 'next' | 'prev' | 'goto';
  iconLink: string;
  toggleInfo: (?boolean) => void;
  animationEnd: string;
  // questions

  constructor(htmlId: string = 'lesson_diagram') {
    this.diagramHtmlId = htmlId;
    this.sections = [];
    this.iconLink = '/';
    this.setTitle();

    this.animationEnd = whichAnimationEvent();
  }

  initialize() {
    this.setDiagram(this.diagramHtmlId);
    this.setElementContent();
    this.addSections();
    this.addInfoBox();
    this.addStar();
  }

  // eslint-disable-next-line class-methods-use-this
  toggleInfo(toState: ?boolean = null) {
    const infoButton = document.getElementById('id_lesson__info_button');
    const infoBox = document.getElementById('id_lesson__info_box');
    if (infoButton instanceof HTMLElement && infoBox instanceof HTMLElement) {
      if (typeof toState === 'boolean' && toState === true) {
        infoButton.classList.add('lesson__info_button_show');
        infoBox.classList.remove('lesson__info_hide');
      } else if (typeof toState === 'boolean' && toState === false) {
        infoButton.classList.remove('lesson__info_button_show');
        infoBox.classList.add('lesson__info_hide');
      } else {
        infoButton.classList.toggle('lesson__info_button_show');
        infoBox.classList.toggle('lesson__info_hide');
      }
    }
    // if (infoBox instanceof HTMLElement) {
    //   infoBox.classList.toggle('lesson__info_hide');
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  addInfoBox() {
    const container = document.createElement('div');
    container.classList.add('lesson__info_box');
    container.classList.add('lesson__info_hide');
    container.id = 'id_lesson__info_box';

    const title = document.createElement('div');
    title.classList.add('lesson__info_box__title');
    container.appendChild(title);

    const infoSymbol = document.createElement('div');
    infoSymbol.classList.add('lesson__info_box__title_i');
    infoSymbol.innerHTML = 'i';
    title.appendChild(infoSymbol);

    const close = document.createElement('div');
    close.classList.add('lesson__info_box__close');
    close.id = 'id_lesson__info_box__close';
    close.innerHTML = 'X';
    close.onclick = this.toggleInfo.bind(this);
    title.appendChild(close);

    const titleText = document.createElement('div');
    titleText.classList.add('lesson__info_box__title_text');
    titleText.innerHTML = 'What can you do on this page?';
    title.appendChild(titleText);

    const text = document.createElement('div');
    text.classList.add('lesson__info_box__text');
    text.id = ('id_lesson__info_box__text');
    container.appendChild(text);

    this.diagram.htmlCanvas.appendChild(container);
  }

  // eslint-disable-next-line class-methods-use-this
  pulseStar() {
    const star = document.getElementById('id_lesson__star');
    if (star instanceof HTMLElement) {
      star.classList.toggle('lesson__info_star_pulse');
    }
  }

  // starOnNextInteractiveItem() {
  //   const index = this.
  // }

  starOnElement(
    element: TypeInteractiveElement,
    location: TypeInteractiveElementLocation,
  ) {
    const star = document.getElementById('id_lesson__star');
    if (star instanceof HTMLElement) {
      const animationEnd = () => {
        star.removeEventListener(this.animationEnd, animationEnd);
        star.classList.remove('lesson__info_star_pulse');
        // this next line triggers a relflow, making the class removal stick
        // eslint-disable-next-line no-unused-vars
        const w = star.offsetWidth;
      };
      animationEnd();

      let cssPosition = new Point(0, 0);
      if (element instanceof DiagramElementPrimative
        || element instanceof DiagramElementCollection) {
        let diagramPosition;
        if (location === 'center') {
          diagramPosition = element.getCenterDiagramPosition();
        } else {
          diagramPosition = element.getDiagramPosition();
        }
        cssPosition = diagramPosition
          .transformBy(this.diagram.diagramToPixelSpaceTransform.matrix());
      } else {
        let html = element;
        if (typeof element === 'string') {
          html = document.getElementById(element);
        }
        if (html instanceof HTMLElement) {
          const rect = html.getBoundingClientRect();
          const rectBase = this.diagram.htmlCanvas.getBoundingClientRect();
          if (location === 'topleft') {
            cssPosition = new Point(
              rect.left - rectBase.left + rect.width * 0.05,
              rect.top - rectBase.top + rect.height * 0.25,
            );
          } else if (location === 'topright') {
            cssPosition = new Point(
              rect.left - rectBase.left + rect.width * 0.95,
              rect.top - rectBase.top + rect.height * 0.25,
            );
          } else {
            cssPosition = new Point(
              rect.left - rectBase.left + rect.width / 2,
              rect.top - rectBase.top + rect.height / 2,
            );
          }
        }
      }
      star.classList.add('lesson__info_star_pulse');
      const rect = star.getBoundingClientRect();
      star.style.left = `${cssPosition.x - rect.width / 2}px`;
      star.style.top = `${cssPosition.y - rect.height / 2}px`;
      star.addEventListener(this.animationEnd, animationEnd.bind(this));
    }
  }

  addStar() {
    const img = document.createElement('img');
    img.setAttribute('src', '/static/star.png');
    img.id = 'id_lesson__star';
    img.classList.add('lesson__info_star');

    this.diagram.htmlCanvas.appendChild(img);
  }

  setTitle() {
    this.title = '';
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  setDiagram(htmlId: string = '') {
  }

  // eslint-disable-next-line class-methods-use-this
  setElementContent() {
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
  clickWord, itemSelector, initializeItemSelector, unit, applyModifiers,
  setOnClicks, interactiveItem,
};
