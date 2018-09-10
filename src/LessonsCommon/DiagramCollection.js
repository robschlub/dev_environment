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

export type TypeScenario = string | null
  | { position?: Point, rotation?: number, scale?: Point | number };

function getTarget(
  element: DiagramElement,
  scenario: TypeScenario,
  layout: Object,
) {
  const target = element.transform._dup();
  let scenarioObject;
  if (scenario == null || scenario === '') {
    scenarioObject = layout[element.name];
  } else if (typeof scenario === 'string') {
    scenarioObject = layout[element.name][scenario];
  } else {
    scenarioObject = scenario;
  }
  if (scenarioObject.position != null) {
    target.updateTranslation(scenarioObject.position);
  }

  if (scenarioObject.rotation != null) {
    target.updateRotation(scenarioObject.rotation);
  }
  if (scenarioObject.scale != null) {
    if (scenarioObject.scale instanceof Point) {
      target.updateScale(scenarioObject.scale);
    } else {
      target.updateScale(scenarioObject.scale, scenarioObject.scale);
    }
  }
  return target;
}

type TypeFuturePosition = {
  element: DiagramElement;
  scenario: TypeScenario;
};

export default class CommonDiagramCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  +diagram: Diagram;
  moveToScenario: (DiagramElement, TypeScenario, ?number, ?(() => void)) => number;
  getTimeToMoveToScenario: (DiagramElement, TypeScenario) => number;
  setScenario: (DiagramElement, TypeScenario) => void;
  futurePositions: Array<TypeFuturePosition>;
  +calculateFuturePositions: (?TypeScenario) => void;

  constructor(
    diagram: Diagram,
    layout: Object = { colors: {} },
    transform: Transform = new Transform(),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.colors = layout.colors;
    this.futurePositions = [];
  }

  getTimeToMoveToScenario(
    element: DiagramElement,
    scenario: TypeScenario = null,
  ) {
    const target = getTarget(element, scenario, this.layout);
    const velocity = element.transform.constant(0);
    velocity.updateTranslation(new Point(1 / 2, 1 / 2));
    velocity.updateRotation(2 * Math.PI / 6);
    velocity.updateScale(1, 1);
    const time = getMaxTimeFromVelocity(element.transform._dup(), target, velocity, 0);
    return time;
  }

  setScenario(
    element: DiagramElement,
    scenario: TypeScenario = null,
  ) {
    const target = getTarget(element, scenario, this.layout);
    // eslint-disable-next-line no-param-reassign
    element.setTransform(target._dup());
  }

  moveToScenario(
    element: DiagramElement,
    scenario: TypeScenario = null,
    animationTime: ?number = null,
    callback: ?() => void = null,
  ) {
    element.stop();
    const target = getTarget(element, scenario, this.layout);
    let time = 1;
    if (animationTime == null) {
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

  // eslint-disable-next-line class-methods-use-this
  calculateFuturePositions() {
  }

  setFuturePositions() {
    this.futurePositions.forEach((futurePosition) => {
      const { element, scenario } = futurePosition;
      this.setScenario(element, scenario);
    });
  }

  moveToFuturePositions(
    timeOrCallback: ?number | () => void = null,
    done: ?() => void = null,
  ) {
    let maxTime: number = 0;
    if (typeof timeOrCallback !== 'number'
      || timeOrCallback == null
      || timeOrCallback === 0
    ) {
      this.futurePositions.forEach((futurePosition) => {
        const { element, scenario } = futurePosition;
        const thisTime = this.getTimeToMoveToScenario(element, scenario);
        maxTime = Math.max(maxTime, thisTime);
      });
    } else {
      maxTime = timeOrCallback;
    }

    let callbackToUse = done;
    if (typeof timeOrCallback === 'function') {
      callbackToUse = timeOrCallback;
    }
    this.futurePositions.forEach((futurePosition, index) => {
      const callback = index === this.futurePositions.length - 1 ? callbackToUse : null;
      const { element, scenario } = futurePosition;
      this.moveToScenario(element, scenario, maxTime, callback);
    });
  }
}
