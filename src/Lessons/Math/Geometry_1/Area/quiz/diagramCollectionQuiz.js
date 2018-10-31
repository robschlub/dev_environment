// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import {
  roundNum, rand,
} from '../../../../../js/diagram/tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';

import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type { TypeMessages } from '../../../../LessonsCommon/DiagramCollectionQuiz';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class QuizCollection extends CommonQuizMixin(CommonDiagramCollection) {
  diagram: LessonDiagram;
  _messages: {
    _touching: DiagramElementPrimative;
    _rotation: DiagramElementPrimative;
  } & TypeMessages;

  futurePositions: Object;

  addRectangle() {
    const lay = this.layout.adjustableRect;

    const addSide = (p1, p2, name, label = '') => {
      const line = makeLine(
        this.diagram, 'end', 1, lay.width, this.layout.colors.line, true,
        true,
      );
      line.setEndPoints(p1, p2);
      line.addLabel(label, lay.labelOffset, 'outside', '', 'horizontal');
      line.setMovable(true);
      line.setTransformCallback = this.updateRectangle.bind(this);
      this.add(`side${name}`, line);
      return line;
    };
    const w = lay.width / 2;
    const bottom = addSide(lay.points[0].add(0, w), lay.points[3].add(0, w));
    const left = addSide(lay.points[0].add(w, 0), lay.points[1].add(w, 0));
    const right = addSide(lay.points[3].sub(w, 0), lay.points[2].sub(w, 0));
    const top = addSide(lay.points[1].sub(0, w), lay.points[2].sub(0, w));

    bottom.addLabel('', lay.labelOffset, 'bottom', 'bottom', 'horizontal');
    // bottom.showRealLength = true;

    right.addLabel('', lay.labelOffset, 'right', 'right', 'horizontal');
    // right.showRealLength = true;

    const rect = this.diagram.shapes.collection();
    rect.hasTouchableElements = true;
    rect.add('bottom', bottom);
    rect.add('left', left);
    rect.add('right', right);
    rect.add('top', top);
    this.add('rect', rect);
    this.updateRectangle();
  }

  updateRectangle() {
    const { limits } = this.layout.adjustableRect;
    const { minSide } = this.layout.adjustableRect;
    const w = this.layout.adjustableRect.width / 2;

    const left = this._rect._left.getPosition().x;
    const right = this._rect._right.getPosition().x;
    const top = this._rect._top.getPosition().y;
    const bottom = this._rect._bottom.getPosition().y;

    this._rect._bottom.transform.updateTranslation(left - w, bottom);
    this._rect._left.transform.updateTranslation(left, bottom);
    this._rect._right.transform.updateTranslation(right, bottom);
    this._rect._top.transform.updateTranslation(left, top);

    this._rect._bottom.setLength(right - left + w * 2, 1);
    this._rect._top.setLength(right - left + w, 1);
    this._rect._left.setLength(top - bottom + w, 1);
    this._rect._right.setLength(top - bottom + w, 1);

    this._rect._bottom.move.minTransform.updateTranslation(left, limits.bottom);
    this._rect._bottom.move.maxTransform.updateTranslation(left, top - minSide);

    this._rect._top.move.minTransform.updateTranslation(left, bottom + minSide);
    this._rect._top.move.maxTransform.updateTranslation(left, limits.top);

    this._rect._left.move.minTransform.updateTranslation(limits.left, bottom);
    this._rect._left.move.maxTransform.updateTranslation(right - minSide, bottom);
    this._rect._right.move.minTransform.updateTranslation(left + minSide, bottom);
    this._rect._right.move.maxTransform.updateTranslation(limits.right, bottom);

    // this._rect._bottom.updateLabel();
    this._rect._bottom.label.setText(`${roundNum((right - left) * 5, 1)}`)
    this._rect._right.label.setText(`${roundNum((top - bottom) * 5, 1)}`)
    this._rect._bottom.updateLabel();
    this._rect._right.updateLabel();
  }

  addGrid() {
    const lay = this.layout.adjustableRect;
    const grid = this.diagram.shapes.grid(
      lay.limits,
      lay.minSide, lay.minSide, 2, this.layout.colors.grid,
      new Transform().translate(lay.position),
    );
    this.add('grid', grid);
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
    // this.add('input', this.makeEntryBox('a1', '?', 3));
    // this._input.setPosition(this.layout.input);
    this.addGrid();
    this.addRectangle();
    this.hasTouchableElements = true;
  }

  tryAgain() {
    super.tryAgain();
    this._check.show();
    // this._input.enable();
    // this._input.setValue('');
  }


  newProblem() {
    super.newProblem();
    const element = document.getElementById('id__lessons__area_quiz1');
    const maxArea = this.layout.limits.width * this.layout.limits.height;
    const minArea = 1;
    const newArea = roundNum(rand(minArea, maxArea), 1);
    this.answer = newArea;
    if (element) {
      element.innerHTML = newArea;
    }
    this._check.show();
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
    this._check.hide();
    // this._input.disable();
    const left = this._rect._left.getPosition().x;
    const right = this._rect._right.getPosition().x;
    const top = this._rect._top.getPosition().y;
    const bottom = this._rect._bottom.getPosition().y;
    const area = roundNum((right - left) * (top - bottom), 1);
    if (area === this.answer) {
      return 'correct';
    }
    return 'incorrect';
  }
}
