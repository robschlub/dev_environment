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

function makeArrow(
  diagram: Diagram,
  width: number,
  height: number,
  spacing: number,
  color: Array<number>,
  rotation: number,
) {
  const arrow = diagram.shapes.arrow(
    width, 0, height, 0, color,
    new Transform().translate(0, spacing * Math.cos(rotation)), new Point(0, 0), rotation,
  );
  arrow.isTouchable = true;
  arrow.touchInBoundingBox = true;
  return arrow;
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
  // refreshTop.hasTouchableElements = true;
  // refreshTop.isTouchable = true;

  const refreshLine = diagram.shapes.polygon(
    sides, radius,
    lineWidth, (Math.PI - angle) / 2,
    1, Math.floor(sides * angle / Math.PI / 2),
    color, new Transform().translate(0, 0),
  );
  // refreshLine.isTouchable = true;
  refreshTop.add('line', refreshLine);

  const refreshArrow = diagram.shapes.arrow(
    lineWidth * 3, 0, lineWidth * 3, 0,
    color, new Transform().translate(
      (radius + lineWidth) * Math.cos((Math.PI - angle) / 2),
      (radius + lineWidth) * Math.sin((Math.PI - angle) / 2),
    ), new Point(0, -lineWidth * 3), (Math.PI - angle) / 2 + Math.PI,
  );
  // refreshArrow.isTouchable = true;
  refreshTop.add('arrow', refreshArrow);

  const refreshBottom = refreshTop._dup();
  refreshBottom.transform.updateRotation(Math.PI);

  refresh.add('top', refreshTop);
  refresh.add('bottom', refreshBottom);
  refresh.isTouchable = true;
  refresh.touchInBoundingRect = true;
  return refresh;
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
  console.log(form, eqn.formSeries[index], formType)
  if (form == null) {
    return;
  }
  if (form.description == null) {
    return;
  }

  const drawingObject = element.vertices;
  if (drawingObject instanceof HTMLObject) {
    drawingObject.change(form.description, element.lastDrawTransform.m());
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
) {
  const arrowWidth = size * 1.5;
  const arrowHeight = size * 1.5;
  const refreshRadius = size;
  const refreshAngle = Math.PI / 3 * 2;
  const refreshSides = 100;
  const refreshLineWidth = size / 5;
  const spacing = size * 5;

  const navigator = diagram.shapes.collection(new Transform('Triangle')
    .scale(1, 1)
    .translate(0, 0));

  const prev = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, 0);
  const next = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, Math.PI);

  const refresh = makeRefresh(
    diagram, refreshSides, refreshRadius, refreshLineWidth,
    refreshAngle, color,
  );

  const nextDescription = diagram.equation.makeDescription('next_description');

  navigator.add('prev', prev);
  navigator.add('next', next);
  navigator.add('refresh', refresh);
  navigator.add('eqn', equation.collection);
  navigator.add('currentStep', equation.descriptionElement);
  navigator.add('nextDescription', nextDescription);

  const updateButtons = () => {
    const currentForm = equation.getCurrentForm();
    if (currentForm != null) {
      const index = equation.getFormIndex(currentForm);
      if (index === 0) {
        refresh.setColor(colorDisabled);
        prev.setColor(colorDisabled);
        refresh.isTouchable = false;
        prev.isTouchable = false;
      } else {
        refresh.setColor(color);
        prev.setColor(color);
        refresh.isTouchable = true;
        prev.isTouchable = true;
      }
      if (equation.formSeries.length > 1) {
        next.setColor(color);
        next.isTouchable = true;
      } else {
        next.setColor(colorDisabled);
        next.isTouchable = false;
      }
      updateDescription(equation, 'base', nextDescription, index, false);
    }
  };

  const clickNext = () => {
    equation.nextForm(1.5);
    updateButtons();
    diagram.animateNextFrame();
  };
  const clickPrev = () => {
    equation.prevForm(1.5);
    updateButtons();
    diagram.animateNextFrame();
  };
  const clickRefresh = () => {
    const currentForm = equation.getCurrentForm();
    if (currentForm != null) {
      const index = equation.getFormIndex(currentForm);
      if (index > 0) {
        equation.replayCurrentForm(1.5);
        diagram.animateNextFrame();
      }
    }
    updateButtons();
  };

  prev.onClick = clickPrev;
  next.onClick = clickNext;
  refresh.onClick = clickRefresh;

  equation.collection.setPosition(0, 0);
  if (equation.descriptionElement != null) {
    equation.descriptionElement.setPosition(offset.add(size * 3, 0));
  }
  refresh.setPosition(offset);
  next.setPosition(offset.add(0, -spacing));
  prev.setPosition(offset.add(0, spacing));
  navigator.hasTouchableElements = true;
  updateButtons();
  return navigator;
}
