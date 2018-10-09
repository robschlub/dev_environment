// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import * as html from '../../js/tools/htmlGenerator';
import HTMLObject from '../../js/diagram/DrawingObjects/HTMLObject/HTMLObject';

export type TypeEquationNavigator = {
} & DiagramElementCollection;

// function makeArrow(
//   diagram: Diagram,
//   width: number,
//   height: number,
//   spacing: number,
//   color: Array<number>,
//   rotation: number,
// ) {
//   const arrow = diagram.shapes.arrow(
//     width, 0, height, 0, color,
//     new Transform().translate(0, spacing * Math.cos(rotation)), new Point(0, 0), rotation,
//   );
//   arrow.isTouchable = true;
//   arrow.touchInBoundingBox = true;
//   return arrow;
// }

function makeNextPrevText(
  diagram: Diagram,
  next: boolean,
  spacing: number,
  id: string,
) {
  let textToUse = 'Prev';
  let idToUse = 'prev';
  if (next) {
    textToUse = 'Next';
    idToUse = 'next';
  }

  const text = diagram.shapes.htmlText(
    textToUse,
    `${id}_${idToUse}`,
    'lesson__equation_next_prev',
    new Point(0, spacing), 'middle', 'center',
  );
  text.isTouchable = true;
  text.touchInBoundingBox = true;
  return text;
}

function makeRefresh(
  diagram: Diagram,
  sides: number,
  radius: number,
  lineWidth: number,
  angle: number,
  color: Array<number>,
) {
  const refresh = diagram.shapes.collection(new Transform('Triangle')
    .translate(0, 0));
  const refreshTop = diagram.shapes.collection(new Transform('Triangle')
    .rotate(0).translate(0, 0));

  const refreshLine = diagram.shapes.polygon(
    sides, radius,
    lineWidth, (Math.PI - angle) / 2,
    1, Math.floor(sides * angle / Math.PI / 2),
    color, new Transform().translate(0, 0),
  );
  refreshLine.vertices.border[0] = refreshLine.vertices.border[0].map(p => new Point(p.x * 2, p.y * 2));
  refreshTop.add('line', refreshLine);

  const refreshArrow = diagram.shapes.arrow(
    lineWidth * 3, 0, lineWidth * 3, 0,
    color, new Transform().translate(
      (radius + lineWidth) * Math.cos((Math.PI - angle) / 2),
      (radius + lineWidth) * Math.sin((Math.PI - angle) / 2),
    ), new Point(0, -lineWidth * 3), (Math.PI - angle) / 2 + Math.PI,
  );
  refreshTop.add('arrow', refreshArrow);

  const refreshBottom = refreshTop._dup();
  refreshBottom.transform.updateRotation(Math.PI);

  refresh.add('top', refreshTop);
  refresh.add('bottom', refreshBottom);
  refresh.isTouchable = true;
  refresh.touchInBoundingRect = true;
  return refresh;
}

function makeRefreshHtml(
  diagram: Diagram,
  radius: number,
  id: string,
) {
  const element = document.createElement('div');
  // console.log(radius / diagram.limits.width)
  element.style.width = '100%';
  element.style.height = '100%';
  // element.style.backgroundColor = 'red';
  const htmlElement = diagram.shapes.htmlElement(
    element,
    `${id}_refresh`,
    '',
    new Point(0, 0), 'middle', 'center',
  );
  htmlElement.vertices.element.style.width = `${radius * 3 / diagram.limits.width * 100}%`;
  htmlElement.vertices.element.style.height = `${radius * 3 / diagram.limits.height * 100}%`;
  return htmlElement;
}

function updateDescription(
  eqn: Equation,
  formType: string,
  descriptionElement: DiagramElementPrimative,
  index: number,
  setClicks: boolean = false,
) {
  const element = descriptionElement;
  if (element == null) {
    return;
  }
  if (element.isShown === false) {
    return;
  }
  let form = null;
  form = eqn.formSeries[index][formType];
  if (form == null) {
    return;
  }
  if (form.description == null) {
    return;
  }

  const drawingObject = element.vertices;
  if (drawingObject instanceof HTMLObject) {
    // const modifiersToUse = setClicks ? form.modifiers : {};
    const monochrome = !setClicks;
    drawingObject.change(
      html.applyModifiers(form.description, form.modifiers, '', monochrome),
      element.lastDrawTransform.m(),
    );
    if (setClicks) {
      html.setOnClicks(form.modifiers);
    }
  }
}

export default function makeEquationNavigator(
  diagram: Diagram,
  equation: Equation,
  size: number,
  offset: Point,
  color: Array<number>,
  colorDisabled: Array<number>,
  id: string = `id_lesson__equation_navigator_${Math.floor(Math.random()*10000)}`,
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

  const prev = makeNextPrevText(diagram, false, spacing - arrowHeight / 2, id);
  const next = makeNextPrevText(diagram, true, -spacing + arrowHeight / 2, id);

  const refresh = makeRefresh(
    diagram, refreshSides, refreshRadius, refreshLineWidth,
    refreshAngle, color,
  );

  const refreshHtml = makeRefreshHtml(diagram, refreshRadius, id);

  const nextDescription = diagram.equation.makeDescription('id__rectangles_equation_next_desctription');
  nextDescription.isTouchable = true;

  const prevDescription = diagram.equation.makeDescription('id__rectangles_equation_prev_desctription');
  prevDescription.isTouchable = true;

  navigator.add('prev', prev);
  navigator.add('next', next);
  navigator.add('refresh', refresh);

  navigator.add('nextDescription', nextDescription);
  navigator.add('prevDescription', prevDescription);
  navigator.add('refreshHtml', refreshHtml);

  navigator.updateButtons = () => {
    const currentForm = navigator.eqn.getCurrentForm();
    if (currentForm != null) {
      const index = navigator.eqn.getFormIndex(currentForm);
      if (index === 0) {
        refresh.setColor(colorDisabled);
        prev.setColor(colorDisabled);
        refresh.isTouchable = false;
        prev.isTouchable = false;
        prevDescription.isTouchable = false;
        refreshHtml.vertices.element.classList
          .remove('lesson__equation_nav__touchable');
        prev.vertices.element.classList
          .remove('lesson__equation_nav__touchable');
        prevDescription.vertices.element.classList
          .remove('lesson__equation_nav__touchable');
      } else {
        refresh.setColor(color);
        prev.setColor(color);
        refresh.isTouchable = true;
        prev.isTouchable = true;
        prevDescription.isTouchable = true;
        refreshHtml.vertices.element.classList
          .add('lesson__equation_nav__touchable');
        prev.vertices.element.classList
          .add('lesson__equation_nav__touchable');
        prevDescription.vertices.element.classList
          .add('lesson__equation_nav__touchable');
      }
      if (navigator.eqn.formSeries.length > 1) {
        next.setColor(color);
        next.isTouchable = true;
        nextDescription.isTouchable = true;
        next.vertices.element.classList.add('lesson__equation_nav__touchable');
        nextDescription.vertices.element.classList.add('lesson__equation_nav__touchable');
      } else {
        next.setColor(colorDisabled);
        nextDescription.isTouchable = false;
        nextDescription.isTouchable = false;
        nextDescription.vertices.element.classList
          .remove('lesson__equation_nav__touchable');
        nextDescription.vertices.element.classList
          .remove('lesson__equation_nav__touchable');
      }
      const nextIndex = index + 1;
      if (nextIndex > navigator.eqn.formSeries.length - 1) {
        nextDescription.vertices.change('RESTART from begining', nextDescription.lastDrawTransform.m());
      } else {
        updateDescription(navigator.eqn, 'base', nextDescription, nextIndex, false);
      }

      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        updateDescription(navigator.eqn, 'base', prevDescription, prevIndex, false);
      } else {
        prevDescription.vertices.change('', prevDescription.lastDrawTransform.m());
      }
    }
  };

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

  prev.onClick = clickPrev;
  next.onClick = clickNext;
  refresh.onClick = clickRefresh;
  nextDescription.onClick = clickNext;
  prevDescription.onClick = clickPrev;

  

  nextDescription.setPosition(offset.add(size * 3, -spacing + arrowHeight / 2));
  prevDescription.setPosition(offset.add(size * 3, spacing - arrowHeight / 2));
  refresh.setPosition(offset);
  refreshHtml.setPosition(offset);
  next.setPosition(offset.add(0, -spacing + arrowHeight / 2));
  prev.setPosition(offset.add(0, spacing - arrowHeight / 2));
  navigator.hasTouchableElements = true;
  // updateButtons();
  return navigator;
}
