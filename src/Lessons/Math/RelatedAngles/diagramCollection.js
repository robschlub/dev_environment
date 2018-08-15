// @flow

import {
  Transform, Point,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative, getMaxTimeFromVelocity,
} from '../../../js/diagram/Element';
import lessonLayout from './layout';

import {
  makeSelectorText, addSelectorHTML, SelectorList,
} from '../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
import type { LessonDiagramType } from './diagram';

import ParallelCollection from './diagramCollectionParallel';
import OppositeCollection from './diagramCollectionOpposite';
import type { MoveableLineType } from './diagramCollectionCommon';


class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: LessonDiagramType;
  _parallel: ParallelCollection;
  _opposite: OppositeCollection;
  _selector: DiagramElementPrimative;

  addSelector() {
    addSelectorHTML(
      this.diagram,
      this,
      'selector',
      'lesson__related_angles_selector',
      this.selectorClicked.bind(this),
      'horizontal',
    );
    this._selector.setPosition(this.layout.selector.position);
  }

  makeUnitsSelector() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.09;
    font.setColor(this.layout.colors.diagram.disabled);
    const list = new SelectorList();
    list.add('deg', 'degrees');
    list.add('rad', 'radians');
    const selector = makeSelectorText(
      list,
      'deg',
      this.diagram,
      this.selectorClicked.bind(this),
      0,
      font,
      this.layout.colors.diagram.text.base,
      '/',
      0.1,
    );
    selector.setPosition(this.layout.units.position);
    return selector;
  }

  constructor(diagram: LessonDiagramType, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('unitsSelector', this.makeUnitsSelector());
    this.addSelector();
    this.add('parallel', new ParallelCollection(diagram, this.layout));
    this.add('opposite', new OppositeCollection(diagram, this.layout));
  }

  selectorClicked(title: string) {
    if (title === 'parallel') {
      this.diagram.lesson.goToSection('Parallel Lines');
    }
    if (title === 'opposite') {
      this.diagram.lesson.goToSection('Opposite Angles');
    }
  }

  getTimeToMoveToPosition(
    element: MoveableLineType,
    angleType: 'parallel' | 'opposite',
  ) {
    const target = element.transform.constant(0);
    target.updateTranslation(this.layout[element.name][angleType].position);
    target.updateRotation(this.layout[element.name][angleType].rotation);
    const velocity = element.transform.constant(0);
    velocity.updateTranslation(new Point(1 / 2, 1 / 2));
    velocity.updateRotation(2 * Math.PI / 6);
    const time = getMaxTimeFromVelocity(element.transform._dup(), target, velocity, 0);
    return time;
  }

  moveToPosition(
    element: MoveableLineType,
    angleType: 'parallel' | 'opposite',
    animationTime: ?number = null,
    callback: () => void,
  ) {
    element.stop();
    const target = element.transform.constant(0);
    target.updateTranslation(this.layout[element.name][angleType].position);
    target.updateRotation(this.layout[element.name][angleType].rotation);
    let time = 1;
    if (typeof animationTime !== 'number') {
      time = this.getTimeToMoveToPosition(element, angleType);
    } else {
      time = animationTime;
    }

    element.animateTo(target, time, 0, callback);
    return time;
  }
}

export default RelatedAnglesCollection;
