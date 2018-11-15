// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import {
  round, rand, randElement,
} from '../../../../../js/diagram/tools/mathtools';
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

  addArea() {
    const area = this.diagram.shapes.collection(new Transform().translate(0, 0));
    const fill = this.diagram.shapes.polygon(this.layout.area.fill);
    const label = this.diagram.objects.label(this.layout.area.label);
    area.add('fill', fill);
    area.add('label', label.eqn.collection);
    area.label = label;
    this.add('area', area);
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

  generateQuestion() {
    const areaMin = 1;
    const areaMax = 10;
    const area = round(rand(areaMin, areaMax), 1);
    const findRadius = () => {
      const question = `What is the radius of a circle with area ${area}`;
      this.answer = round(Math.sqrt(area / Math.PI), 2);
      this._radius.label.setText('radius = ?');
      this._circumference.hideAll();
      this._area.label.setText(`Area = ${area}`);
      this._area._label.setPosition(this.layout.area.positions.low);
      return question;
    };

    const findCircumference = () => {
      const question = `What is the circumference of a circle with area ${area}`;
      this.answer = round(Math.sqrt(area / Math.PI), 2);
      this._radius.hideAll();
      // this._radius.label.setText('radius = ?');
      this._circumference.showAll();
      this._circumference.label.setText('circumference = ?')
      this._area.label.setText(`area = ${area}`);
      this._area._label.setPosition(this.layout.area.positions.middle);
      return question;
    };

    const possibleQuestions = [
      findRadius,
      findCircumference,
    ];

    const chosenQuestion = randElement(possibleQuestions);
    console.log(chosenQuestion(), this.answer);
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
    this.addArea();
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
    this.generateQuestion();
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
