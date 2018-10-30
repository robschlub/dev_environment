// @flow
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
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
      this.add(`side${name}`, line);
      return line;
    };
    const w = lay.width / 2;
    const base = addSide(lay.points[0].add(0, w), lay.points[3].add(0, w));
    const left = addSide(lay.points[0].add(w, 0), lay.points[1].add(w, 0));
    const right = addSide(lay.points[3].sub(w, 0), lay.points[2].sub(w, 0));
    const top = addSide(lay.points[1].sub(0, w), lay.points[2].sub(0, w));

    const rect = this.diagram.shapes.collection();
    rect.hasTouchableElements = true;
    rect.add('base', base);
    rect.add('left', left);
    rect.add('right', right);
    rect.add('top', top);
    this.add('rect', rect);
    this.updateSideTransforms();
  }

  udpateSideTransform(side: TypeLine, orientation: 'x' | 'y') {
    const p = side.getPosition();
    const { limits } = this.layout.adjustableRect;
    if (orientation === 'y') {
      side.move.minTransform.updateTranslation(limits.left, p.y);
      side.move.maxTransform.updateTranslation(limits.right, p.y);
    } else {
      side.move.minTransform.updateTranslation(p.x, limits.bottom);
      side.move.maxTransform.updateTranslation(p.x, limits.top);
    }
  }
  updateSideTransforms() {
    this.udpateSideTransform(this._rect._base, 'x');
    this.udpateSideTransform(this._rect._top, 'x');
    this.udpateSideTransform(this._rect._left, 'y');
    this.udpateSideTransform(this._rect._right, 'y');
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
    this.addRectangle();
    this.hasTouchableElements = true;
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
    // if (this._input.getValue() === this.answer.toString()) {
    //   return 'correct';
    // }
    return 'incorrect';
  }
}
