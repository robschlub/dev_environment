// @flow
import { Transform, Point, Rect, randomPoint } from '../../../../js/diagram/tools/g2';
import {
  randElements, rand, removeRandElement, randElement, roundNum,
} from '../../../../js/diagram/tools/mathtools';
import lessonLayout from './layout';
// import * as html from '../../../../js/tools/htmlGenerator';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import TotalAngleTriangleCollection from '../common/diagramCollectionTriangles';
import CommonQuizMixin from '../../../../LessonsCommon/DiagramCollectionQuiz';
// import type {
//   TypeTriangle, TypeTriangleAngle, TypeTriangleLabel, TypeTrianglePoints,
// } from '../../../../LessonsCommon/tools/triangle';
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
    this.answer = roundNum(unknownAngle.currentAngle * 180 / Math.PI, 0);
    knownAngles.forEach((angle) => {
      angle.setLabel(`${roundNum(angle.currentAngle * 180 / Math.PI, 0)}º`);
      angle.updateLabel();
    });
    unknownAngle.setLabel('?');
    unknownAngle.updateLabel();
    unknownAngle.setColor(this.layout.colors.diagram.passive)
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

    // this.add('triangle', new TotalAngleTriangleCollection(diagram, this.layout));
    // this._triangle._tri1.addPoint(1, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri1.addPoint(2, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri1.addPoint(3, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri2.addPoint(1, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri2.addPoint(2, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri2.addPoint(3, 0.1, [0, 0, 0, 0.01], true);
    // this._triangle._tri1._dimension12.showRealLength = true;
    // this._triangle._tri1._dimension23.showRealLength = true;
    // this._triangle._tri1._dimension31.showRealLength = true;
    // this._triangle._tri2._dimension12.showRealLength = true;
    // this._triangle._tri2._dimension23.showRealLength = true;
    // this._triangle._tri2._dimension31.showRealLength = true;
    // this._triangle._tri1._angle1.showRealAngle = true;
    // this._triangle._tri1._angle2.showRealAngle = true;
    // this._triangle._tri1._angle3.showRealAngle = true;
    // this._triangle._tri2._angle1.showRealAngle = true;
    // this._triangle._tri2._angle2.showRealAngle = true;
    // this._triangle._tri2._angle3.showRealAngle = true;
    // this._triangle._tri1._angle1.realAngleDecimals = 0;
    // this._triangle._tri1._angle2.realAngleDecimals = 0;
    // this._triangle._tri1._angle3.realAngleDecimals = 0;
    // this._triangle._tri2._angle1.realAngleDecimals = 0;
    // this._triangle._tri2._angle2.realAngleDecimals = 0;
    // this._triangle._tri2._angle3.realAngleDecimals = 0;
    // this.hasTouchableElements = true;
    // this._triangle.hasTouchableElements = true;
    // this._triangle._tri1.hasTouchableElements = false;

    // this.add('answerBox', this.makeMultipleChoice(
    //   'congruent_tri_1',
    //   ['Yes', 'No'],
    // ));
    // this._answerBox.setPosition(this.layout.answerBox);
    this.hint = 'incorrect';
  }

  // eslint-disable-next-line class-methods-use-this
  // randomTriangle(
  //   maxQuadrantBounds: Point = new Point(1, 1),
  //   minQuadrantBounds: Point = new Point(0.4, 0.4),
  // ): Array<Point> {
  //   const possibleQuads = [0, 1, 2, 3];
  //   const quadrants = randElements(3, possibleQuads);

  //   const points = [];
  //   quadrants.forEach((q) => {
  //     let x = rand(minQuadrantBounds.x, maxQuadrantBounds.x);
  //     let y = rand(minQuadrantBounds.y, maxQuadrantBounds.y);
  //     if (q === 1 || q === 2) {
  //       x *= -1;
  //     }
  //     if (q === 2 || q === 3) {
  //       y *= -1;
  //     }
  //     points.push(new Point(x, y));
  //   });
  //   return points;
  // }

  // calcRandomTriangles() {
  //   const points = this.randomTriangle();
  //   const rotation1 = rand(0, Math.PI * 2);
  //   const rotation2 = rand(0, Math.PI * 2);
  //   const position1 = new Point(-1.2, -0.3);
  //   const position2 = new Point(1.2, -0.3);
  //   const scale1 = randElement([-1, 1]);
  //   const scale2 = randElement([-1, 1]);
  //   const transform1 = new Transform().scale(scale1, 1)
  //     .rotate(rotation1).translate(position1);
  //   const transform2 = new Transform().scale(scale2, 1)
  //     .rotate(rotation2).translate(position2);
  //   const points1 = points.map(p => p.transformBy(transform1.m()));
  //   const points2 = points.map(p => p.transformBy(transform2.m()));
  //   const fp = (element, position) => {
  //     this.futurePositions.push({
  //       element,
  //       scenario: { position },
  //     });
  //   };
  //   this.futurePositions = [];
  //   fp(this._triangle._tri1._point1, points1[0]);
  //   fp(this._triangle._tri1._point2, points1[1]);
  //   fp(this._triangle._tri1._point3, points1[2]);
  //   fp(this._triangle._tri2._point1, points2[0]);
  //   fp(this._triangle._tri2._point2, points2[1]);
  //   fp(this._triangle._tri2._point3, points2[2]);
  // }

  // eslint-disable-next-line class-methods-use-this
  // getKnownPropertiesType(
  //   propertyPossibilities: Array<Array<string>>,
  //   knownProperties: Array<string>,
  // ) {
  //   let answer = false;
  //   propertyPossibilities.forEach((possibility) => {
  //     let same = true;
  //     for (let i = 0; i < possibility.length; i += 1) {
  //       if (possibility[i] !== knownProperties[i]) {
  //         same = false;
  //       }
  //     }
  //     if (same) {
  //       answer = true;
  //     }
  //   });
  //   return answer;
  // }

  // getPropertiesType(knownProperties: Array<string>) {
  //   const AAA = [
  //     ['1', '2', '3'],
  //   ];
  //   const SSA = [
  //     ['1', '12', '23'],
  //     ['1', '23', '31'],
  //     ['2', '23', '31'],
  //     ['12', '2', '31'],
  //     ['12', '3', '31'],
  //     ['12', '23', '3'],
  //   ];
  //   const SSS = [
  //     ['12', '23', '31'],
  //   ];
  //   const SAA = [
  //     ['12', '2', '3'],
  //     ['1', '12', '3'],
  //     ['1', '23', '3'],
  //     ['1', '2', '23'],
  //     ['1', '2', '31'],
  //     ['1', '3', '31'],
  //   ];
  //   const ASA = [
  //     ['1', '12', '2'],
  //     ['2', '23', '3'],
  //     ['1', '3', '31'],
  //   ];
  //   const SAS = [
  //     ['12', '2', '23'],
  //     ['23', '3', '31'],
  //     ['1', '12', '31'],
  //   ];
  //   if (this.getKnownPropertiesType(AAA, knownProperties)) {
  //     return 'AAA';
  //   }
  //   if (this.getKnownPropertiesType(SSS, knownProperties)) {
  //     return 'SSS';
  //   }
  //   if (this.getKnownPropertiesType(SSA, knownProperties)) {
  //     return 'SSA';
  //   }
  //   if (this.getKnownPropertiesType(SAA, knownProperties)) {
  //     return 'SAA';
  //   }
  //   if (this.getKnownPropertiesType(ASA, knownProperties)) {
  //     return 'ASA';
  //   }
  //   if (this.getKnownPropertiesType(SAS, knownProperties)) {
  //     return 'SAS';
  //   }
  //   return 'unknown';
  // }

  // // eslint-disable-next-line class-methods-use-this
  // getUnknownAngles(knownProperties: Array<string>) {
  //   const possibleAngles = ['1', '2', '3'];
  //   const unknownAngles = [];
  //   possibleAngles.forEach((angle) => {
  //     if (knownProperties.indexOf(angle) === -1) {
  //       unknownAngles.push(angle);
  //     }
  //   });
  //   return unknownAngles;
  // }

  // // eslint-disable-next-line class-methods-use-this
  // getKnownAngles(knownProperties: Array<string>): Array<string> {
  //   return knownProperties.filter(p => p.length === 1);
  // }

  // // eslint-disable-next-line class-methods-use-this
  // getKnownSides(knownProperties: Array<string>): Array<string> {
  //   return knownProperties.filter(p => p.length === 2);
  // }

  // // eslint-disable-next-line class-methods-use-this
  // getUnknownSides(knownProperties: Array<string>) {
  //   const possibleSides = ['12', '23', '31'];
  //   const unknownASides = [];
  //   possibleSides.forEach((side) => {
  //     if (knownProperties.indexOf(side) === -1) {
  //       unknownASides.push(side);
  //     }
  //   });
  //   return unknownASides;
  // }

  // showAnglesAndSides() {
  //   this._triangle._tri1.hideDimensions();
  //   this._triangle._tri1.hideAngles();
  //   this._triangle._tri2.hideDimensions();
  //   this._triangle._tri2.hideAngles();
  //   const possible = ['angle', 'angle', 'angle', 'side', 'side', 'side'];
  //   const propertiesToShow = randElements(3, possible);
  //   const possibleAngles = ['1', '2', '3'];
  //   const possibleSides = ['12', '23', '31'];
  //   const order = ['1', '12', '2', '23', '3', '31'];
  //   const knownProperties = [];
  //   this.hint = 'incorrect';
  //   let answer = 'possible';
  //   propertiesToShow.forEach((p) => {
  //     let elementId;
  //     if (p === 'angle') {
  //       const angleId = removeRandElement(possibleAngles);
  //       elementId = `_angle${angleId}`;
  //       knownProperties.push(angleId);
  //     } else {
  //       const sideId = removeRandElement(possibleSides);
  //       elementId = `_dimension${sideId}`;
  //       knownProperties.push(sideId);
  //     }
  //     const element1 = this._triangle._tri1[elementId];
  //     const element2 = this._triangle._tri2[elementId];
  //     element1.showAll();
  //     element2.showAll();
  //   });
  //   const sortedKnownProperties = knownProperties
  //     .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  //   const propertiesType = this.getPropertiesType(sortedKnownProperties);
  //   if (propertiesType === 'AAA') {
  //     answer = 'not possible';
  //   }
  //   if (propertiesType === 'SSA') {
  //     let angleIndex = sortedKnownProperties.filter(p => p.length === 1)[0];
  //     angleIndex = parseInt(angleIndex, 10);
  //     let oppositeSide = '';
  //     let adjacentSide = '';
  //     sortedKnownProperties.forEach((p) => {
  //       if (p.length === 2) {
  //         if (p.includes(angleIndex.toString())) {
  //           adjacentSide = p;
  //         } else {
  //           oppositeSide = p;
  //         }
  //       }
  //     });
  //     if (oppositeSide && adjacentSide) {
  //       const lengthOpp = this._triangle._tri1[`b${oppositeSide}`].length();
  //       const lengthAdj = this._triangle._tri1[`b${adjacentSide}`].length();
  //       if (lengthAdj > lengthOpp) {
  //         answer = 'not possible';
  //       }
  //     }
  //   }
  //   const trick = rand(0, 1);
  //   if (trick < 0.3) {
  //     answer = 'not possible';
  //     this._triangle._tri2.updatePoints(
  //       this._triangle._tri2.p1.add(0.05, 0),
  //       this._triangle._tri2.p2,
  //       this._triangle._tri2.p3,
  //     );
  //     this.hint = 'checkDimensions';
  //     // if (propertiesType === 'ASA') {
  //     //   const knownAngle = this.getKnownAngles(sortedKnownProperties)[0];
  //     //   const unknownAngle = this.getUnknownAngles(sortedKnownProperties)[0];

  //     // }
  //   }
  //   this.answer = answer;
  //   this._check.show();
  //   this.diagram.animateNextFrame();
  // }

  tryAgain() {
    super.tryAgain();
    // this.selectMultipleChoice('congruent_tri_1', -1);
  }

  // randomizeFuturePositions() {
  //   this._triangle.calculateFuturePositions();
  // }

  newProblem() {
    super.newProblem();
    // this.calcRandomTriangles();
    // this._triangle._tri1.hideDimensions();
    // this._triangle._tri1.hideAngles();
    // this._triangle._tri2.hideDimensions();
    // this._triangle._tri2.hideAngles();
    // const moveDone = () => {
    //   this.showAnglesAndSides();
    //   this._answerBox.enable();
    // };
    // this._answerBox.disable();
    // this.moveToFuturePositions(1, moveDone);
    // this.selectMultipleChoice('congruent_tri_1', -1);
    this.diagram.animateNextFrame();
  }

  showAnswer() {
    super.showAnswer();
    // if (this.answer === 'possible') {
    //   this.selectMultipleChoice('congruent_tri_1', 0);
    // } else {
    //   this.selectMultipleChoice('congruent_tri_1', 1);
    // }
    // this._answerBox.disable();
    this.diagram.animateNextFrame();
  }

  findAnswer() {
    // const selection = this.getMultipleChoiceSelection('congruent_tri_1');
    // if ((selection === 0 && this.answer === 'possible')
    //   || (selection === 1 && this.answer === 'not possible')) {
    //   return 'correct';
    // }
    // return this.hint;
    return 'incorrect';
  }
}
