// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';
import * as html from '../../../js/tools/htmlGenerator';
import HTMLObject from '../../../js/diagram/DrawingObjects/HTMLObject/HTMLObject';
// import { generateUniqueId } from '../../../js/diagram/tools/tools';

// function makeNextPrevText(
//   diagram: Diagram,
//   next: boolean,
//   spacing: number,
//   id: string,
// ) {
//   let textToUse = 'Prev';
//   let idToUse = 'prev';
//   if (next) {
//     textToUse = 'Next';
//     idToUse = 'next';
//   }

//   const text = diagram.shapes.htmlText(
//     textToUse,
//     `${id}_${idToUse}`,
//     'lesson__equation_next_prev',
//     new Point(0, spacing), 'middle', 'center',
//   );
//   text.isTouchable = true;
//   text.touchInBoundingBox = true;
//   return text;
// }

// type TypeRefresh = {
//   _top: {
//     _line: DiagramElementPrimative;
//     _arrow: DiagramElementPrimative;
//   } & DiagramElementCollection;
//   _bottom: {
//     _line: DiagramElementPrimative;
//     _arrow: DiagramElementPrimative;
//   } & DiagramElementCollection;
// } & DiagramElementCollection;

// function makeRefresh(
//   diagram: Diagram,
//   sides: number,
//   radius: number,
//   lineWidth: number,
//   angle: number,
//   color: Array<number>,
// ) {
//   const refresh = diagram.shapes.collection(new Transform('Triangle')
//     .translate(0, 0));
//   const refreshTop = diagram.shapes.collection(new Transform('Triangle')
//     .rotate(0).translate(0, 0));

//   const refreshLine = diagram.shapes.polygon(
//     sides, radius,
//     lineWidth, (Math.PI - angle) / 2,
//     1, Math.floor(sides * angle / Math.PI / 2),
//     color, new Transform().translate(0, 0),
//   );
//   refreshLine.vertices.border[0] =
//     refreshLine.vertices.border[0].map(p => new Point(p.x * 2, p.y * 2));
//   refreshTop.add('line', refreshLine);

//   const refreshArrow = diagram.shapes.arrow(
//     lineWidth * 3, 0, lineWidth * 3, 0,
//     color, new Transform().translate(
//       (radius + lineWidth) * Math.cos((Math.PI - angle) / 2),
//       (radius + lineWidth) * Math.sin((Math.PI - angle) / 2),
//     ), new Point(0, -lineWidth * 3), (Math.PI - angle) / 2 + Math.PI,
//   );
//   refreshTop.add('arrow', refreshArrow);

//   const refreshBottom = refreshTop._dup();
//   refreshBottom.transform.updateRotation(Math.PI);

//   refresh.add('top', refreshTop);
//   refresh.add('bottom', refreshBottom);
//   refresh.isTouchable = true;
//   refresh.touchInBoundingRect = true;
//   return refresh;
// }

// function makeDescriptionHTML(
//   diagram: Diagram,
//   radius: number,
//   id: string,
// ) {
//   const element = document.createElement('div');
//   // console.log(radius / diagram.limits.width)
//   element.style.width = '100%';
//   element.style.height = '100%';
//   // element.style.backgroundColor = 'red';
//   const htmlElement = diagram.shapes.htmlElement(
//     element,
//     `${id}_refresh`,
//     '',
//     new Point(0, 0), 'middle', 'center',
//   );
//   htmlElement.vertices.element.style.width = `${radius * 3 / diagram.limits.width * 100}%`;
//   htmlElement.vertices.element.style.height = `${radius * 3 / diagram.limits.height * 100}%`;
//   return htmlElement;
// }

function updateDescription(
  eqn: Equation,
  formType: string,
  descriptionElement: HTMLElement,
  index: number,
  setClicks: boolean = false,
) {
  const element = descriptionElement;
  if (element == null) {
    return;
  }
  // if (element.isShown === false) {
  //   return;
  // }
  let form = null;
  // $FlowFixMe
  form = eqn.formSeries[index][formType];
  if (form == null) {
    return;
  }
  if (form.description == null) {
    return;
  }

  const monochrome = !setClicks;
  if (setClicks) {
    // eslint-disable-next-line no-param-reassign
    descriptionElement.innerHTML = html
      .applyModifiers(form.description, form.modifiers);
    html.setOnClicks(form.modifiers);
  } else {
    // eslint-disable-next-line no-param-reassign
    descriptionElement.innerHTML = html
      .applyModifiers(form.description, form.modifiers, '', monochrome);
  }
}

export type TypeEquationNavigator = {
  setEquation: (Equation) => void;
  next: HTMLElement;
  prev: HTMLElement;
  refresh: HTMLElement;
  nextDescription: HTMLElement;
  prevDescription: HTMLElement;
  description: HTMLElement;
  prevGroup: HTMLElement;
  nextGroup: HTMLElement;
  currentGroup: HTMLElement;
  updateButtons: () => void;
  eqn: Equation;
  _eqn: DiagramElementCollection;
} & DiagramElementCollection;

// function makeTouchable(
//   element: DiagramElementPrimative | null | TypeRefresh | DiagramElementCollection,
//   touchable: boolean = true,
//   // touchableColor: Array<number> | null,
//   // disabledColor: Array<number> | null,
//   color: Array<number> | null = null,
// ) {
//   if (element != null) {
//     if (touchable) {
//       if (color) {
//         element.setColor(color);
//       }
//       // eslint-disable-next-line no-param-reassign
//       element.isTouchable = true;
//       if (element instanceof DiagramElementPrimative) {
//         if (element.vertices instanceof HTMLObject) {
//           element.vertices.element.classList.add('lesson__equation_nav__touchable');
//         }
//       }
//     } else {
//       if (color) {
//         element.setColor(color);
//       }
//       // eslint-disable-next-line no-param-reassign
//       element.isTouchable = false;
//       if (element instanceof DiagramElementPrimative) {
//         if (element.vertices instanceof HTMLObject) {
//           element.vertices.element.classList
//             .remove('lesson__equation_nav__touchable');
//         }
//       }
//     }
//   }
// }

// function updateButtonsOld(
//   navigator: TypeEquationNavigator,
//   color: Array<number>,
//   colorDisabled: Array<number>,
// ) {
//   const nav = navigator;
//   const currentForm = nav.eqn.getCurrentForm();
//   if (currentForm != null) {
//     const index = navigator.eqn.getFormIndex(currentForm);
//     if (index === 0) {
//       makeTouchable(nav._refresh, false, colorDisabled);
//       makeTouchable(nav._prev, false, colorDisabled);
//       makeTouchable(nav._prevDescription, false);
//       makeTouchable(nav._description, false);
//       makeTouchable(nav._nextDescription, true);
//     } else {
//       makeTouchable(nav._refresh, true, color);
//       makeTouchable(nav._prev, true, color);
//       makeTouchable(nav._prevDescription, true);
//       makeTouchable(nav._description, true);
//     }
//     if (navigator.eqn.formSeries.length > 1) {
//       makeTouchable(nav._next, true, color);
//       makeTouchable(nav._nextDescription, true);
//     } else {
//       makeTouchable(nav._next, false, colorDisabled);
//       makeTouchable(nav._nextDescription, false);
//     }
//     const nextIndex = index + 1;
//     if (nextIndex > navigator.eqn.formSeries.length - 1) {
//       nav._nextDescription.vertices.change(
//         'RESTART from begining',
//         nav._nextDescription.lastDrawTransform.m(),
//       );
//     } else {
//       updateDescription(navigator.eqn, 'base', nav._nextDescription, nextIndex, false);
//     }

//     const prevIndex = index - 1;
//     if (prevIndex >= 0) {
//       updateDescription(navigator.eqn, 'base', nav._prevDescription, prevIndex, false);
//     } else {
//       nav._prevDescription.vertices.change('', nav._prevDescription.lastDrawTransform.m());
//     }
//   }
// }

function enableTouch(element: HTMLElement) {
  if (element) {
    element.classList.remove('lesson__eqn_nav__not_touchable');
  }
}

function disableTouch(element: HTMLElement) {
  if (element) {
    element.classList.add('lesson__eqn_nav__not_touchable');
  }
}

function updateButtons(nav: TypeEquationNavigator) {
  const currentForm = nav.eqn.getCurrentForm();
  if (currentForm != null) {
    const index = nav.eqn.getFormIndex(currentForm);
    if (index === 0) {
      disableTouch(nav.refresh);
      disableTouch(nav.prev);
      disableTouch(nav.prevDescription);
      disableTouch(nav.description);
      // enableTouch(nav.nextDescription, true);
    } else {
      enableTouch(nav.refresh);
      enableTouch(nav.prev);
      enableTouch(nav.prevDescription);
      enableTouch(nav.description);
    }
    if (nav.eqn.formSeries.length > 1) {
      enableTouch(nav.next);
      enableTouch(nav.nextDescription);
    } else {
      disableTouch(nav.next);
      disableTouch(nav.nextDescription);
    }
    const nextIndex = index + 1;
    if (nextIndex > nav.eqn.formSeries.length - 1) {
      if (nav.nextDescription) {
        nav.nextDescription.innerHTML = 'RESTART from begining';
      }
    } else {
      updateDescription(nav.eqn, currentForm.type, nav.nextDescription, nextIndex, false);
    }
    updateDescription(nav.eqn, currentForm.type, nav.description, index, true);
    // nav.eqn.updateDescription(currentForm);
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      updateDescription(nav.eqn, currentForm.type, nav.prevDescription, prevIndex, false);
    } else if (nav.prevDescription) {
      nav.prevDescription.innerHTML = '';
    }
  }
}

function updateButtonsDescriptionOnly(nav: TypeEquationNavigator) {
  const currentForm = nav.eqn.getCurrentForm();
  if (currentForm != null) {
    const index = nav.eqn.getFormIndex(currentForm);
    enableTouch(nav.description);
    updateDescription(nav.eqn, currentForm.type, nav.description, index, true);
  }
}

function makeType3Line(
  // id: string,
  prevMethod: () => void,
  refreshMethod: () => void,
  nextMethod: () => void,
  options: string = '',  // can be: 'twoLines'
) {
  const table = document.createElement('table');
  const prevGroup = document.createElement('tr');
  const currentGroup = document.createElement('tr');
  const nextGroup = document.createElement('tr');
  const prev = document.createElement('td');
  const refresh = document.createElement('td');
  const next = document.createElement('td');
  const prevDescription = document.createElement('td');
  const description = document.createElement('td');
  const nextDescription = document.createElement('td');
  prevGroup.appendChild(prev);
  prevGroup.appendChild(prevDescription);
  nextGroup.appendChild(next);
  nextGroup.appendChild(nextDescription);
  currentGroup.appendChild(refresh);
  currentGroup.appendChild(description);
  table.appendChild(prevGroup);
  table.appendChild(currentGroup);
  table.appendChild(nextGroup);

  table.classList.add('lesson__eqn_nav__table');
  prevGroup.classList.add('lesson__eqn_nav__3line__prevRow');
  currentGroup.classList.add('lesson__eqn_nav__3line__currentRow');
  nextGroup.classList.add('lesson__eqn_nav__3line__nextRow');
  prev.classList.add('lesson__eqn_nav__3line__prevRow__button');
  refresh.classList.add('lesson__eqn_nav__3line__currentRow__button');
  next.classList.add('lesson__eqn_nav__3line__nextRow__button');
  prevDescription.classList.add('lesson__eqn_nav__3line__prevRow__description');
  description.classList.add('lesson__eqn_nav__3line__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  nextDescription.classList.add('lesson__eqn_nav__3line__nextRow__description');

  if (options === 'twoLines') {
    prevGroup.classList.add('lesson__eqn_nav__3line__prev_twoLines');
    currentGroup.classList.add('lesson__eqn_nav__3line__current_twoLines');
    nextGroup.classList.add('lesson__eqn_nav__3line__next_twoLines');
  }

  prevGroup.onclick = prevMethod;
  currentGroup.onclick = refreshMethod;
  nextGroup.onclick = nextMethod;

  next.innerHTML = 'Next';
  prev.innerHTML = 'Prev';
  refresh.innerHTML = 'Refresh';
  return {
    table,
    prevGroup,
    currentGroup,
    nextGroup,
    prev,
    refresh,
    next,
    prevDescription,
    description,
    nextDescription,
  };
}

function makeTypeDescriptionOnly(
  nextMethod: () => void,
) {
  const table = document.createElement('table');
  const currentGroup = document.createElement('tr');
  const description = document.createElement('td');
  currentGroup.appendChild(description);
  table.appendChild(currentGroup);
  table.classList.add('lesson__eqn_nav__table');
  currentGroup.classList.add('lesson__eqn_nav__description_only__currentRow');
  description.classList.add('lesson__eqn_nav__description_only__currentRow__description');
  description.classList.add('lesson__eqn_nav__description');
  currentGroup.onclick = nextMethod;
  return {
    table,
    currentGroup,
    description,
  };
}

export default function makeEquationNavigator(
  diagram: Diagram,
  equation: Equation,
  offset: Point,
  navType: 'threeLine' | 'descriptionOnly' | 'equationOnly' = 'threeLine',
  options: string = '',
  id: string = `id_lesson__equation_navigator_${Math.floor(Math.random() * 10000)}`,

) {
  const navigator = diagram.shapes.collection(new Transform('Triangle')
    .scale(1, 1)
    .translate(0, 0));
  navigator.setEquation = (eqn: Equation) => {
    navigator.eqn = eqn;
    navigator._eqn = [];
    navigator.add('eqn', eqn.collection);
    navigator.eqn.collection.setPosition(0, 0);
  };
  navigator.setEquation(equation);
  navigator.prev = null;
  navigator.next = null;
  navigator.refresh = null;
  navigator.description = null;
  navigator.nextDescription = null;
  navigator.prevDescription = null;
  navigator.table = null;
  navigator.prevGroup = null;
  navigator.currentGroup = null;
  navigator.nextGroup = null;

  const clickNext = () => {
    navigator.eqn.nextForm(1.5);
    navigator.updateButtons();
    diagram.animateNextFrame();
  };
  const clickPrev = () => {
    navigator.eqn.prevForm(1.5);
    navigator.updateButtons();
    diagram.animateNextFrame();
  };
  const clickRefresh = () => {
    const currentForm = navigator.eqn.getCurrentForm();
    if (currentForm != null) {
      const index = navigator.eqn.getFormIndex(currentForm);
      if (index > 0) {
        navigator.eqn.replayCurrentForm(1.5);
        diagram.animateNextFrame();
      }
    }
    navigator.updateButtons();
  };

  let navigatorHTMLElement = null;
  if (navType === 'threeLine') {
    navigatorHTMLElement = makeType3Line(clickPrev, clickRefresh, clickNext, options);
  }
  if (navType === 'descriptionOnly') {
    navigatorHTMLElement = makeTypeDescriptionOnly(clickNext);
  }
  if (navigatorHTMLElement != null) {
    Object.assign(navigator, navigatorHTMLElement);
    const table = diagram.shapes.htmlElement(
      navigatorHTMLElement.table,
      `${id}_table`,
      '',
      offset, 'middle', 'left',
    );
    navigator.add('table', table);
  }
  navigator.updateButtons = () => {
    if (navType === 'equationOnly') {
      return;
    }
    if (navType === 'descriptionOnly') {
      updateButtonsDescriptionOnly(navigator);
    } else {
      updateButtons(navigator);
    }
  };

  navigator.eqn.collection.onClick = clickNext;
  navigator.hasTouchableElements = true;
  navigator.eqn.collection.isTouchable = true;
  navigator.eqn.collection.touchInBoundingRect = true;
  return navigator;
}
