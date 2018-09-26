// @flow
import { Transform, Point } from '../../../../js/diagram/tools/g2';
import { randElements, rand } from '../../../../js/diagram/tools/mathtools';
import lessonLayout from './layout';
// import * as html from '../../../../js/tools/htmlGenerator';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
// import {
//   DiagramElementPrimative,
// } from '../../../../js/diagram/Element';
// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import TotalAngleTriangleCollection from '../common/diagramCollectionTriangles';
import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
import type {
  TypeTriangle, TypeTriangleAngle, TypeTriangleLabel, TypeTrianglePoints,
} from '../../../../LessonsCommon/tools/triangle';

export default class DiagramCollection extends CommonQuizMixin(CommonDiagramCollection) {
  _triangle: {
    _tri1: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel & TypeTrianglePoints;
    _tri2: TypeTriangleAngle & TypeTriangle & TypeTriangleLabel & TypeTrianglePoints;
  } & TotalAngleTriangleCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, 'q1', {}, transform);

    this.add('triangle', new TotalAngleTriangleCollection(diagram, this.layout));
    this._triangle._tri1.addPoint(1, 0.1, [0, 0, 0, 0.01], true);
    this._triangle._tri1.addPoint(2, 0.1, [0, 0, 0, 0.01], true);
    this._triangle._tri1.addPoint(3, 0.1, [0, 0, 0, 0.01], true);
    this._triangle._tri2.addPoint(1, 0.1, [0, 0, 0, 0.01], true);
    this._triangle._tri2.addPoint(2, 0.1, [0, 0, 0, 0.01], true);
    this._triangle._tri2.addPoint(3, 0.1, [0, 0, 0, 0.01], true);
    this.hasTouchableElements = true;
    this._triangle.hasTouchableElements = true;
    this._triangle._tri1.hasTouchableElements = true;

    this.add('answerBox', this.makeMultipleChoice(
      'congruent_tri_1',
      ['Yes', 'No'],
    ));
    this._answerBox.setPosition(this.layout.answerBox);
  }

  // eslint-disable-next-line class-methods-use-this
  randomTriangle(
    maxQuadrantBounds: Point = new Point(1, 1),
    minQuadrantBounds: Point = new Point(0.25, 0.25),
  ): Array<Point> {
    const possibleQuads = [0, 1, 2, 3];
    const quadrants = randElements(3, possibleQuads);

    const points = [];
    quadrants.forEach((q) => {
      let x = rand(minQuadrantBounds.x, maxQuadrantBounds.x);
      let y = rand(minQuadrantBounds.y, maxQuadrantBounds.y);
      if (q === 1 || q === 2) {
        x *= -1;
      }
      if (q === 2 || q === 3) {
        y *= -1;
      }
      points.push(new Point(x, y));
    });
    return points;
  }

  calcRandomTriangles() {
    const points = this.randomTriangle();
    const rotation1 = rand(0, Math.PI * 2);
    const rotation2 = rand(0, Math.PI * 2);
    const position1 = new Point(-1.2, 0);
    const position2 = new Point(1.2, 0);
    const transform1 = new Transform().rotate(rotation1).translate(position1);
    const transform2 = new Transform().rotate(rotation2).translate(position2);
    const points1 = points.map(p => p.transformBy(transform1.m()));
    const points2 = points.map(p => p.transformBy(transform2.m()));
    const fp = (element, position) => {
      this.futurePositions.push({
        element,
        scenario: { position },
      });
    };
    this.futurePositions = [];
    fp(this._triangle._tri1._point1, points1[0]);
    fp(this._triangle._tri1._point2, points1[1]);
    fp(this._triangle._tri1._point3, points1[2]);
    fp(this._triangle._tri2._point1, points2[0]);
    fp(this._triangle._tri2._point2, points2[1]);
    fp(this._triangle._tri2._point3, points2[2]);
  }

  tryAgain() {
    super.tryAgain();
    // this._input.enable();
    // this._input.setValue('');
  }

  randomizeFuturePositions() {
    this._triangle.calculateFuturePositions();
  }

  newProblem() {
    super.newProblem();
    this.calcRandomTriangles();
    this._triangle.moveToFuturePositions(1, this.showAnglesAndSides.bind(this));
    // this.resetLines();
    // this.randomizeFuturePositions();
    // this._triangle.moveToFuturePositions(1, this.showAngles.bind(this));
    // this._input.enable();
    // this._input.setValue('');
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    // this._input.setValue(this.angleToFind);
    // this._input.disable();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
  //   this._input.disable();
  //   if (this._input.getValue() === this.angleToFind.toString()) {
  //     return 'correct';
  //   }
    return 'incorrect';
  }
}
