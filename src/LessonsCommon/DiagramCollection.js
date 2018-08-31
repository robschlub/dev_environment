// @flow

import {
  Transform, Point,
} from '../js/diagram/tools/g2';
import {
  DiagramElement, DiagramElementCollection, getMaxTimeFromVelocity,
} from '../js/diagram/Element';
import Diagram from '../js/diagram/Diagram';

import {
  makeSelectorText, SelectorList,
} from './tools/selector';

export type TypeUnits = 'deg' | 'rad';

function getTarget(
  element: DiagramElement,
  scenario: string | null | { position: Point, rotation: number } = null,
  layout: Object,
) {
  const target = element.transform.constant(0);
  if (scenario === null) {
    target.updateTranslation(layout[element.name].position);
    target.updateRotation(layout[element.name].rotation);
  } else if (typeof scenario === 'string') {
    target.updateTranslation(layout[element.name][scenario].position);
    target.updateRotation(layout[element.name][scenario].rotation);
  } else {
    target.updateTranslation(scenario.position);
    target.updateRotation(scenario.rotation);
  }
  return target;
}


export default class CommonDiagramCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  +diagram: Diagram;

  constructor(
    diagram: Diagram,
    layout: Object = { colors: {} },
    transform: Transform = new Transform(),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.colors = layout.colors;
  }

  getTimeToMoveToScenario(
    element: DiagramElement,
    scenario: string | null | { position: Point, rotation: number } = null,
  ) {
    const target = getTarget(element, scenario, this.layout);
    const velocity = element.transform.constant(0);
    velocity.updateTranslation(new Point(1 / 2, 1 / 2));
    velocity.updateRotation(2 * Math.PI / 6);
    const time = getMaxTimeFromVelocity(element.transform._dup(), target, velocity, 0);
    return time;
  }

  setScenario(
    element: DiagramElement,
    scenario: string | null | { position: Point, rotation: number } = null,
  ) {
    const target = getTarget(element, scenario, this.layout);
    // eslint-disable-next-line no-param-reassign
    element.transform = target._dup();
  }

  moveToScenario(
    element: DiagramElement,
    scenario: string | null | { position: Point, rotation: number } = null,
    animationTime: ?number = null,
    callback: () => void,
  ) {
    element.stop();
    const target = getTarget(element, scenario, this.layout);
    let time = 1;
    if (typeof animationTime !== 'number') {
      time = this.getTimeToMoveToScenario(element, scenario);
    } else {
      time = animationTime;
    }
    time = time === 0 ? 0.001 : time;
    element.animateTo(target, time, 0, callback);
    return time;
  }

  makeUnitsSelector() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.09;
    font.setColor(this.layout.colors.diagram.disabled);
    const list = new SelectorList();
    list.add('deg', 'degrees');
    list.add('rad', 'radians');
    const selectorClicked = (selectedUnits: 'deg' | 'rad') => {
      const degSpans = document.getElementsByClassName('lesson__unit_deg');
      const radSpans = document.getElementsByClassName('lesson__unit_rad');
      if (selectedUnits === 'rad') {
        [].forEach.call(degSpans, degSpan => degSpan.classList.add('lesson__unit_hide'));
        [].forEach.call(radSpans, radSpan => radSpan.classList.remove('lesson__unit_hide'));
      }
      if (selectedUnits === 'deg') {
        [].forEach.call(degSpans, degSpan => degSpan.classList.remove('lesson__unit_hide'));
        [].forEach.call(radSpans, radSpan => radSpan.classList.add('lesson__unit_hide'));
      }
      this.setUnits(selectedUnits);
    };
    const selector = makeSelectorText(
      list,
      'deg',
      this.diagram,
      selectorClicked.bind(this),
      0,
      font,
      this.layout.colors.diagram.text.base,
      '/',
      0.1,
    );
    selector.setPosition(this.layout.units.position);
    return selector;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  setUnits(units: TypeUnits) {
  }
}
