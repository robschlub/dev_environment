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

  updateTriangle() {
    const lay = this.layout.same;
    const p = this._topPad.getPosition();
    const left = this._leftBasePad.getPosition();
    const right = this._rightBasePad.getPosition();
    const top = this._topPad.getPosition();
    const separation = right.x - left.x;

    if (this._leftBasePad.state.isBeingMoved || this._leftBasePad.state.isMovingFreely) {
      let rightX = right.x;
      if (separation < lay.basePadMinSeparation) {
        rightX += lay.basePadMinSeparation - separation;
      }
      this._rightBasePad.transform.updateTranslation(rightX, left.y);
      const height = top.y - left.y;
      let topY = top.y;
      if (height < lay.basePadMinSeparation) {
        topY += lay.basePadMinSeparation - height;
      }
      this._topPad.transform.updateTranslation(top.x, topY);
    }
    if (this._rightBasePad.state.isBeingMoved || this._rightBasePad.state.isMovingFreely) {
      let leftX = left.x;
      if (separation < lay.basePadMinSeparation) {
        leftX -= lay.basePadMinSeparation - separation;
      }
      this._leftBasePad.transform.updateTranslation(leftX, right.y);
      const height = top.y - right.y;
      let topY = top.y;
      if (height < lay.basePadMinSeparation) {
        topY += lay.basePadMinSeparation - height;
      }
      this._topPad.transform.updateTranslation(top.x, topY);
    }
    if (this._topPad.state.isBeingMoved || this._topPad.state.isMovingFreely) {
      const height = top.y - left.y;
      let baseY = left.y;
      if (height < lay.basePadMinSeparation) {
        baseY -= lay.basePadMinSeparation - height;
      }
      this._leftBasePad.transform.updateTranslation(left.x, baseY);
      this._rightBasePad.transform.updateTranslation(right.x, baseY);
    }

    const points = [
      left,
      right,
      p,
    ];

    this.base = round((right.x - left.x) / lay.grid.spacing, 1);
    this.height = round((p.y - left.y) / lay.grid.spacing, 1);
    this.area = round(this.height * this.base * 0.5, 1);

    this._label.vertices.change(
      `Area = ${round(this.area, 1).toString()} squares`,
      this._label.lastDrawTransform.m(),
    );
    this._tri.vertices.change(points);
    this._base.setEndPoints(
      new Point(left.x, lay.baseY),
      new Point(right.x, lay.baseY),
    );
    if (this._base.label != null) {
      this._base.label.setText(this.base.toString());
    }
    this._height.setEndPoints(
      new Point(lay.heightX, right.y),
      new Point(lay.heightX, p.y),
    );
    if (this._height.label != null) {
      this._height.label.setText(this.height.toString());
    }
    this.diagram.animateNextFrame();
  }

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
    this.updateLimits();
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
    console.log(minHeight, maxHeight)
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
