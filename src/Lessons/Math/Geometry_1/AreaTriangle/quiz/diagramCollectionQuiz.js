// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../../js/diagram/tools/g2';
import {
  rand, range, round,
} from '../../../../../js/diagram/tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';

import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';
// import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import SameAreaCollection from '../common/diagramCollectionSameArea';

export default class QuizParallel1Collection extends CommonQuizMixin(SameAreaCollection) {
// export default class QuizParallel1Collection extends CommonQuizDiagramCollection {
  diagram: LessonDiagram;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;


  updateLimits() {
    const lay = this.layout.same;
    const { length, height } = lay.grid;
    const minSeparation = lay.basePadMinSeparation;
    this._leftBasePad.move.minTransform.updateTranslation(
      -length / 2,
      -height / 2,
    );
    this._leftBasePad.move.maxTransform.updateTranslation(
      length / 2 - minSeparation,
      height / 2 - minSeparation,
    );
    this._rightBasePad.move.minTransform.updateTranslation(
      -length / 2 + minSeparation,
      -height / 2,
    );
    this._rightBasePad.move.maxTransform.updateTranslation(
      length / 2,
      height / 2 - minSeparation,
    );
    this._topPad.move.minTransform.updateTranslation(
      -length / 2,
      -height / 2 + minSeparation,
    );
    this._topPad.move.maxTransform.updateTranslation(
      length / 2,
      height / 2,
    );
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
    this.setPosition(this.layout.samePosition);
    // this.updateLimits();
    this.hasTouchableElements = true;
  }

  tryAgain() {
    super.tryAgain();
  }

  addToAnswers(answers: Array<Array<number>>, answer: Array<number>) {
    if (Array.isArray(this.answers)) {
      for (let i = 0; i < answers.length; i += 1) {
        const existing = answers[i];
        if (answer[0] === existing[0]) {
          if (answer[1] === existing[1]) {
            return;
          }
        }
      }
      answers.push(answer);
    }
  }

  getPossibleAnswers(area: number) {
    const lay = this.layout.same;
    const maxBase = (lay.grid.length - lay.pad.radius * 2) / lay.grid.spacing;
    const maxHeight = (lay.grid.height - lay.pad.radius * 2) / lay.grid.spacing;
    const minBase = lay.basePadMinSeparation;
    const minHeight = lay.basePadMinSeparation;
    const answers = [];
    const potentialHeights = round(range(minHeight, maxHeight, 0.1), 8);
    potentialHeights.forEach((h: number) => {
      const base: number = round(area / h * 2, 1);
      if (round(base * h, 8) === area && base > minBase) {
        if (h <= maxHeight && base <= maxBase) {
          this.addToAnswers(answers, [base, h]);
        }
      }
    });
    return answers;
  }

  goToTriangle(baseInUnits: number, heightInUnits: number) {
    const lay = this.layout.same;
    const base = baseInUnits * lay.grid.spacing;
    const height = heightInUnits * lay.grid.spacing;

    const left = new Point(-base / 2, -height / 2);
    const right = new Point(base / 2, -height / 2);
    const top = new Point(0, height / 2);

    const futurePos = (element, x, y) => ({
      element,
      scenario: {
        position: new Point(x, y),
      },
    });

    this.futurePositions = [];
    this.futurePositions.push(futurePos(
      this._leftBasePad, left.x, left.y,
    ));
    this.futurePositions.push(futurePos(
      this._rightBasePad, right.x, right.y,
    ));
    this.futurePositions.push(futurePos(
      this._topPad, top.x, top.y,
    ));
    this.moveToFuturePositions(1, this.updateTriangle.bind(this));
  }

  newProblem() {
    super.newProblem();
    const element = document.getElementById('id__lessons__area_quiz1');
    const lay = this.layout.same;
    const maxBase = (lay.grid.length - lay.pad.radius * 2) / lay.grid.spacing;
    const maxHeight = (lay.grid.height - lay.pad.radius * 2) / lay.grid.spacing;
    const minBase = lay.grid.basePadMinSeparation;
    const minHeight = lay.grid.basePadMinSeparation;

    const maxArea = maxBase * maxHeight * 0.5;
    const minArea = minBase * minHeight * 0.5;
    let answers = [];
    let area = 0;
    let i = 0;
    while (answers.length === 0 && i < 5) {
      area = round(rand(minArea, maxArea), 0);
      answers = this.getPossibleAnswers(area);
      i += 1;
    }

    this.answer = area;
    this.answers = answers;

    if (element) {
      element.innerHTML = area.toString();
    }
    this._check.show();
    this.goToTriangle(5, 5);
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    // this._input.disable();
    // if (this._input.getValue() === this.answer.toString()) {
    //   return 'correct';
    // }
    return 'incorrect';
  }
}
