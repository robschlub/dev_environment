// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';

import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

// What is the radius of a circle with area...
// What is the circumference of a circle with area...
// What is the diameter of a circle with area...
// What is the area of a circle with radius...
// What is the area of a circle with circumference...
// What is the area of a circle with diameter...
// How many circles of radius 1 are needed to have a total area of 6π.
// What is the area of a band with inner radius... and outer radius...

export default class QuizParallel1Collection extends CommonQuizMixin(CommonDiagramCollection) {
// export default class QuizParallel1Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;

  futurePositions: Object;

  addCircle() {
    const circle = this.diagram.shapes.polygon(this.layout.circle);
    this.add('circle', circle);
  }

  addRadius() {
    const radius = this.diagram.objects.line(this.layout.radius);
    this.add('radius', radius);
  }

  addCircumference() {
    const lay = this.layout.circumference;
    const circumference = this.diagram.shapes.collection(new Transform()
      .translate(0, 0));
    const line = this.diagram.shapes.polygon(lay.line);
    const arrow = this.diagram.shapes.arrow(
      lay.arrow.width,
      0,
      lay.arrow.height,
      0,
      lay.arrow.color,
      lay.arrow.position,
      lay.arrow.tip,
      lay.arrow.rotation,
    );
    const label = this.diagram.objects.label(lay.label);
    circumference.add('line', line);
    circumference.add('arrow', arrow);
    circumference.add('label', label.eqn.collection);
    circumference.label = label;
    this.add('circumference', circumference);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(
      diagram,
      layout,
      'q1',
      {},
      transform,
    );
    this.addCircle();
    this.addRadius();
    this.addCircumference();
    // this.add('input', this.makeEntryBox('a1', '?', 3));
    // this._input.setPosition(this.layout.input);
    this.hasTouchableElements = true;
    console.log(this)
  }

  tryAgain() {
    super.tryAgain();
    // this._input.enable();
    // this._input.setValue('');
  }


  newProblem() {
    super.newProblem();
    // this.calculateFuturePositions();
    // this.moveToFuturePositions(1, this.updateAngles.bind(this));
    // this._input.enable();
    // this._input.setValue('');
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    // this._input.setValue(this.answer);
    // this._input.disable();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    // this._input.disable();
    if (this.answer === true) {
      return 'correct';
    }
    return 'incorrect';
  }
}
