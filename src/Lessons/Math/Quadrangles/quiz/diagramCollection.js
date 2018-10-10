// @flow
import { Transform, Point, randomPoint } from '../../../../js/diagram/tools/g2';
import {
  removeRandElement, roundNum,
} from '../../../../js/diagram/tools/mathtools';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

export default class DiagramCollection extends CommonQuizMixin(CommonDiagramCollection) {
  _quad: {
    _angle1: TypeAngle;
    _angle2: TypeAngle;
    _angle3: TypeAngle;
    _angle4: TypeAngle;
    _line: DiagramElementPrimative;
  } & DiagramElementCollection;

  answer: number;
  hint: 'checkDimensions' | 'incorrect';
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;

  randomQuadPoints() {
    this.p1 = randomPoint(this.layout.pointRects.quad1);
    this.p2 = randomPoint(this.layout.pointRects.quad2);
    this.p3 = randomPoint(this.layout.pointRects.quad3);
    this.p4 = randomPoint(this.layout.pointRects.quad4);
  }

  updateQuad() {
    this._quad._line.vertices.change([this.p1, this.p2, this.p3, this.p4]);
  }

  makeQuad() {
    const quad = this.diagram.shapes.collection(new Transform('quad')
      .rotate(0).translate(0, 0));
    const line = this.diagram.shapes.polyLine(
      [new Point(-1, -1), new Point(1, -1), new Point(1, 1), new Point(-1, 1)],
      true, this.layout.lineWidth,
      this.layout.colors.lines, 'onSharpAnglesOnly',
    );

    const makeA = () => {
      const angle = makeAngle(
        this.diagram, this.layout.angleRadius,
        this.layout.lineWidth, this.layout.angleSides,
        this.layout.colors.angles,
      );
      angle.addLabel('', this.layout.angleRadius + this.layout.angleLabelOffset);
      return angle;
    };
    quad.add('angle1', makeA());
    quad.add('angle2', makeA());
    quad.add('angle3', makeA());
    quad.add('angle4', makeA());
    quad.add('line', line);
    quad.setPosition(this.layout.quadPosition);
    return quad;
  }

  updateAngles() {
    const {
      p1, p2, p3, p4,
    } = this;
    let answer = 360;
    const quadRot = this._quad.transform.r();
    if (quadRot != null) {
      this._quad._angle1.updateAngleFromPoints(p2, p1, p4, true, quadRot);
      this._quad._angle2.updateAngleFromPoints(p3, p2, p1, true, quadRot);
      this._quad._angle3.updateAngleFromPoints(p4, p3, p2, true, quadRot);
      this._quad._angle4.updateAngleFromPoints(p1, p4, p3, true, quadRot);
    }
    const knownAngles = [
      this._quad._angle1, this._quad._angle2,
      this._quad._angle3, this._quad._angle4,
    ];
    const unknownAngle = removeRandElement(knownAngles);
    // this.answer = roundNum(unknownAngle.currentAngle * 180 / Math.PI, 0);
    knownAngles.forEach((angle) => {
      const angleValue = roundNum(angle.currentAngle * 180 / Math.PI, 0);
      answer -= angleValue;
      angle.setLabel(`${angleValue}º`);
      angle.updateLabel();
    });
    this.answer = answer;
    unknownAngle.setLabel('?');
    unknownAngle.updateLabel();
    unknownAngle.setColor(this.layout.colors.diagram.passive);
    this.showCheck();
  }

  resetColors() {
    this._quad._angle1.setColor(this.layout.colors.angles);
    this._quad._angle2.setColor(this.layout.colors.angles);
    this._quad._angle3.setColor(this.layout.colors.angles);
    this._quad._angle4.setColor(this.layout.colors.angles);
  }

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(
      diagram, layout, 'q1', {}, transform,
    );
    this.add('quad', this.makeQuad());
    this.randomQuadPoints();
    this.updateQuad();
    this.updateAngles();
    this.add('input', this.makeEntryBox('a1', '?', 3));
    this._input.setPosition(this.layout.input);
  }

  tryAgain() {
    super.tryAgain();
    this._input.enable();
    this._input.setValue('');
    // this.selectMultipleChoice('congruent_tri_1', -1);
  }

  // randomizeFuturePositions() {
  //   this._triangle.calculateFuturePositions();
  // }

  newProblem() {
    super.newProblem();
    this.resetColors();
    this.randomQuadPoints();
    this.updateQuad();
    this.updateAngles();
    // this.randomizeFuturePositions();
    // this._quad.moveToFuturePositions(1, this.showAngles.bind(this));
    this._input.enable();
    this._input.setValue('');
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    this._input.setValue(this.answer);
    this._input.disable();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    this._input.disable();
    if (this._input.getValue() === this.answer.toString()) {
      return 'correct';
    }
    return 'incorrect';
  }
}
