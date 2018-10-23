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
  // eslint-disable-next-line no-param-reassign
  descriptionElement.innerHTML = html
    .applyModifiers(form.description, form.modifiers, '', monochrome);
  // const drawingObject = element.vertices;
  // if (drawingObject instanceof HTMLObject) {
  //   // const modifiersToUse = setClicks ? form.modifiers : {};
  //   const monochrome = !setClicks;
  //   drawingObject.change(
  //     html.applyModifiers(form.description, form.modifiers, '', monochrome),
  //     element.lastDrawTransform.m(),
  //   );
  if (setClicks) {
    html.setOnClicks(form.modifiers);
  }
  // }
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
      nav.nextDescription.innerHTML = 'RESTART from begining';
      // nav.nextDescription.vertices.change(
      //   'RESTART from begining',
      //   nav.nextDescription.lastDrawTransform.m(),
      // );
    } else {
      updateDescription(nav.eqn, 'base', nav.nextDescription, nextIndex, false);
    }

    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      updateDescription(nav.eqn, 'base', nav.prevDescription, prevIndex, false);
    } else {
      nav.prevDescription.innerHTML = '';
      // nav.prevDescription.vertices.change('', nav.prevDescription.lastDrawTransform.m());
    }
  }
}

function makeType2(
  // id: string,
  prevMethod: () => void,
  refreshMethod: () => void,
  nextMethod: () => void,
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

  // table.id = `${id}__type2_table`;
  table.classList.add('lesson__eqn_nav__type2__table');
  prevGroup.classList.add('lesson__eqn_nav__type2__prevRow');
  currentGroup.classList.add('lesson__eqn_nav__type2__currentRow');
  nextGroup.classList.add('lesson__eqn_nav__type2__nextRow');
  prev.classList.add('lesson__eqn_nav__type2__prevRow__button');
  refresh.classList.add('lesson__eqn_nav__type2__currentRow__button');
  next.classList.add('lesson__eqn_nav__type2__nextRow__button');
  prevDescription.classList.add('lesson__eqn_nav__type2__prevRow__description');
  description.classList.add('lesson__eqn_nav__type2__currentRow__description');
  nextDescription.classList.add('lesson__eqn_nav__type2__nextRow__description');

  prevGroup.onclick = prevMethod;
  currentGroup.onclick = refreshMethod;
  nextGroup.onclick = nextMethod;

  next.innerHTML = 'next';
  prev.innerHTML = 'prev';
  refresh.innerHTML = 'refresh';
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

export default function makeEquationNavigator(
  diagram: Diagram,
  equation: Equation,
  size: number,
  offset: Point,
  color: Array<number>,
  colorDisabled: Array<number>,
  id: string = `id_lesson__equation_navigator_${Math.floor(Math.random() * 10000)}`,
  type: string = '1',
) {
  // const arrowWidth = size * 1.5;
  const arrowHeight = size * 1.5;
  const refreshRadius = size;
  const refreshAngle = Math.PI / 3 * 2;
  const refreshSides = 100;
  const refreshLineWidth = size / 5;
  const spacing = size * 5;

  const navigator = diagram.shapes.collection(new Transform('Triangle')
    .scale(1, 1)
    .translate(0, 0));
  navigator.setEquation = (eqn: Equation) => {
    navigator.eqn = eqn;
    navigator._eqn = [];
    navigator.add('eqn', eqn.collection);
    if (navigator.eqn.descriptionElement != null) {
      navigator.add('currentStep', eqn.descriptionElement);
      navigator.eqn.descriptionElement.setPosition(offset.add(size * 3, 0));
    }
    navigator.eqn.collection.setPosition(0, 0);
  };
  navigator.setEquation(equation);
  // const prev = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, 0);
  // const next = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, Math.PI);
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

  // if (type === '1') {
  //   prev = makeNextPrevText(diagram, false, spacing - arrowHeight / 2, id);
  //   next = makeNextPrevText(diagram, true, -spacing + arrowHeight / 2, id);
  //   refresh = makeRefresh(
  //     diagram, refreshSides, refreshRadius, refreshLineWidth,
  //     refreshAngle, color,
  //   );
  //   description = makeDescriptionHTML(diagram, refreshRadius, id);
  //   nextDescription = diagram.equation
  //     .makeDescription('id__rectangles_equation_next_desctription');
  //   // nextDescription.isTouchable = true;

  //   prevDescription = diagram.equation
  //     .makeDescription('id__rectangles_equation_prev_desctription');
  //   // prevDescription.isTouchable = true;

  //   nextDescription.setPosition(offset.add(size * 3, -spacing + arrowHeight / 2));
  //   prevDescription.setPosition(offset.add(size * 3, spacing - arrowHeight / 2));
  //   refresh.setPosition(offset);
  //   description.setPosition(offset);
  //   next.setPosition(offset.add(0, -spacing + arrowHeight / 2));
  //   prev.setPosition(offset.add(0, spacing - arrowHeight / 2));
  // }

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

  const navigatorTable = makeType2(clickPrev, clickRefresh, clickNext);
  Object.assign(navigator, navigatorTable);
  const table = diagram.shapes.htmlElement(
    navigatorTable.table,
    `${id}_table`,
    '',
    new Point(0, 0), 'middle', 'center',
  );
  navigator.add('table', table);
  // if (prev) {
  //   navigator.add('prev', prev);
  //   prev.onClick = clickPrev;
  // }
  // if (next) {
  //   navigator.add('next', next);
  //   next.onClick = clickNext;
  // }
  // if (refresh) {
  //   navigator.add('refresh', refresh);
  //   refresh.onClick = clickRefresh;
  // }
  // if (description) {
  //   navigator.add('refresh', refresh);
  //   description.onClick = clickRefresh;
  // }
  // if (nextDescription) {
  //   navigator.add('nextDescription', nextDescription);
  //   nextDescription.onClick = clickNext;
  // }
  // if (prevDescription) {
  //   navigator.add('prevDescription', prevDescription);
  //   prevDescription.onClick = clickPrev;
  // }

  navigator.updateButtons = () => {
    updateButtons(navigator);
  };

  navigator.hasTouchableElements = true;
  // updateButtons();
  return navigator;
}
