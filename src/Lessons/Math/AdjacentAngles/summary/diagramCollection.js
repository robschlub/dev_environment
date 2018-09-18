// @flow
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import { DiagramElementPrimative } from '../../../../js/diagram/Element';
import { addSelectorHTML } from '../../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import AdjacentCollection from '../common/diagramCollectionAdjacent';
import CommonLessonDiagramCollection from '../common/diagramCollection';
import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _adjacent: AdjacentCollection;
  _selector: DiagramElementPrimative;
  units: TypeUnits;

  addSelector() {
    addSelectorHTML(
      this.diagram,
      this,
      'selector',
      'lesson__adjacent_angles_selector',
      this.selectorClicked.bind(this),
      'horizontal',
    );
    this._selector.setPosition(this.layout.selector.position);
  }

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.units = 'deg';
    this.add('adjacent', new AdjacentCollection(diagram, this.layout));
    this.addSelector();
    this.add('unitsSelector', this.makeUnitsSelector());
    this._adjacent.setPosition(this.layout.position);
    this.hasTouchableElements = true;
  }

  // eslint-disable-next-line class-methods-use-this
  setUnits(units: TypeUnits) {
    this.units = units;
    if (this._adjacent.isShown) {
      this._adjacent.setUnits(units);
    }
  }

  selectorClicked(title: string) {
    if (title === 'adjacent') {
      this.diagram.lesson.goToSection('Adjacent Angles');
    }
    if (title === 'complementary') {
      this.diagram.lesson.goToSection('Complementary Angles');
    }
    if (title === 'supplementary') {
      this.diagram.lesson.goToSection('Supplementary Angles');
    }
    if (title === 'explementary') {
      this.diagram.lesson.goToSection('Explementary Angles');
    }
  }
}
