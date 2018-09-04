// @flow

import {
  Transform, minAngleDiff, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import lessonLayout from './layout';

import {
  addSelectorHTML,
} from '../../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
import type { LessonDiagramType } from './diagram';

import ParallelCollection from './diagramCollectionParallel';
import OppositeCollection from './diagramCollectionOpposite';
import ThreeLinesCollection from './diagramCollectionThreeLines';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import QuizCollection from './diagramCollectionQuiz';
import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

class RelatedAnglesCollection extends CommonDiagramCollection {
  diagram: LessonDiagramType;
  _parallel: ParallelCollection;
  _opposite: OppositeCollection;
  _threeLines: ThreeLinesCollection;
  _selector: DiagramElementPrimative;
  _quiz: QuizCollection;
  units: TypeUnits;

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

  constructor(diagram: LessonDiagramType, transform: Transform = new Transform()) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.units = 'deg';
    this.add('parallel', new ParallelCollection(diagram, this.layout));
    this.add('opposite', new OppositeCollection(diagram, this.layout));
    this.add('threeLines', new ThreeLinesCollection(diagram, this.layout));
    this.add('quiz', new QuizCollection(diagram, this.layout));
    this.add('unitsSelector', this.makeUnitsSelector());
    this.addSelector();
  }

  selectorClicked(title: string) {
    if (title === 'parallel') {
      this.diagram.lesson.goToSection('Parallel Lines');
    }
    if (title === 'opposite') {
      this.diagram.lesson.goToSection('Opposite Angles');
    }
    if (title === 'corresponding') {
      this.diagram.lesson.goToSection('Corresponding Angles');
    }
    if (title === 'alternate') {
      this.diagram.lesson.goToSection('Alternate Angles');
    }
    if (title === 'interior') {
      this.diagram.lesson.goToSection('Interior Angles');
    }
    if (title === 'quiz') {
      this.diagram.lesson.goToSection('Quiz');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setUnits(units: TypeUnits) {
    this.units = units;
    if (this._opposite.isShown) {
      this._opposite.setUnits(units);
    }
    if (this._threeLines.isShown) {
      this._threeLines.setUnits(units);
    }
  }
}

export default RelatedAnglesCollection;
