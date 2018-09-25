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
  moveToScenario: (
    DiagramElement,
    TypeScenario,
    ?number,
    ?(() => void),
    ?(-1 | 1 | 0 | 2)) => number;

  getTimeToMoveToScenario: (
    DiagramElement,
    TypeScenario,
    ?(-1 | 1 | 0 | 2)) => number;

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
    rotDirection: -1 | 1 | 0 | 2 = 0,
  ) {
    const target = getTarget(element, scenario, this.layout);
    const velocity = element.transform.constant(0);
    velocity.updateTranslation(new Point(1 / 2, 1 / 2));
    velocity.updateRotation(2 * Math.PI / 6);
    velocity.updateScale(1, 1);
    const time = getMaxTimeFromVelocity(element.transform._dup(), target, velocity, rotDirection);
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
    rotDirection: -1 | 1 | 0 | 2 = 0,
  ) {
    element.stop();
    const target = getTarget(element, scenario, this.layout);
    let time = 1;
    if (animationTime == null) {
      time = this.getTimeToMoveToScenario(element, scenario, rotDirection);
    } else {
      time = animationTime;
    }
    time = time === 0 ? 0.001 : time;
    element.animateTo(target, time, rotDirection, callback);
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

  addFuturePosition(element: DiagramElement, scenario: TypeScenario) {
    this.futurePositions.push({ element, scenario });
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
    rotDirection: -1 | 1 | 0 | 2 = 0,
  ) {
    let maxTime: number = 0;
    if (typeof timeOrCallback !== 'number'
      || timeOrCallback == null
      || timeOrCallback === 0
    ) {
      this.futurePositions.forEach((futurePosition) => {
        const { element, scenario } = futurePosition;
        const thisTime = this.getTimeToMoveToScenario(element, scenario, rotDirection);
        maxTime = Math.max(maxTime, thisTime);
      });
    } else {
      maxTime = timeOrCallback;
    }

    let callbackToUse = done;
    if (typeof timeOrCallback === 'function') {
      callbackToUse = timeOrCallback;
    }
    let doneCount = 0;
    const elementDone = () => {
      doneCount += 1;
      if (doneCount === this.futurePositions.length) {
        if (callbackToUse != null) {
          callbackToUse();
        }
      }
    };
    this.futurePositions.forEach((futurePosition) => {
      const { element, scenario } = futurePosition;
      if (element.isShown) {
        this.moveToScenario(element, scenario, maxTime, elementDone, rotDirection);
        // callbackToUse = null;
      }
    });
  }
}
