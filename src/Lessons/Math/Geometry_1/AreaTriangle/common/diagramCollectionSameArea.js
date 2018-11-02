// @flow
import LessonDiagram from './diagram';
import {
  Transform, Rect, Point,
} from '../../../../../js/diagram/tools/g2';
import {
  rand, round,
} from '../../../../../js/diagram/tools/mathtools';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import type { TypeLine } from '../../../../LessonsCommon/tools/line';
// import { makeLine } from '../../../../LessonsCommon/tools/line';
// import type { TypeEquationLabel } from '../../../../LessonsCommon/tools/equationLabel';
// import makeEquationLabel from '../../../../LessonsCommon/tools/equationLabel';
const increaseBorderSize = (element: DiagramElementPrimative, multiplier: number) => {
  for (let i = 0; i < element.vertices.border[0].length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    element.vertices.border[0][i].x *= multiplier;
    // eslint-disable-next-line no-param-reassign
    element.vertices.border[0][i].y *= multiplier;
  }
};

export default class SameAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: DiagramElementPrimative;
  _grid: DiagramElementPrimative;
  _topPad: DiagramElementPrimative;
  _leftBasePad: DiagramElementPrimative;
  _rightBasePad: DiagramElementPrimative;
  _label: DiagramElementPrimative;

  addLines() {
    const lay = this.layout.same;
    const tri = this.diagram.shapes.polyLine(
      lay.points, true, lay.width, this.layout.colors.line, 'alwaysOn',
    );
    this.add('tri', tri);
  }

  makePad(position: Point) {
    const lay = this.layout.same.pad;
    const pad = this.diagram.shapes.polygonFilled(
      lay.sides, lay.radius, 0, lay.sides, this.layout.colors.construction,
      new Transform().translate(position),
    );
    pad.isTouchable = true;
    pad.isMovable = true;
    increaseBorderSize(pad, 2);
    pad.setTransformCallback = this.updateTriangle.bind(this);
    pad.move.canBeMovedAfterLoosingTouch = true;
    return pad;
  }

  addTopPad() {
    // const lay = this.layout.same.pad;
    const topPad = this.makePad(this.layout.same.points[2]);
    topPad.move.minTransform.updateTranslation(
      -this.layout.same.grid.length / 2,
      this.layout.same.points[2].y,
    );
    topPad.move.maxTransform.updateTranslation(
      this.layout.same.grid.length / 2,
      this.layout.same.points[2].y,
    );
    this.add('topPad', topPad);
  }

  addLeftBasePad() {
    // const { points } = this.layout.same;
    const lay = this.layout.same;
    const leftBasePad = this.makePad(
      lay.points[0],
    );
    leftBasePad.move.maxTransform.updateTranslation(
      lay.grid.length / 2 - lay.basePadMinSeparation - lay.pad.radius,
      0,
    );
    leftBasePad.move.minTransform.updateTranslation(
      -lay.grid.length / 2 + lay.pad.radius,
      -lay.grid.height / 2,
    );
    this.add('leftBasePad', leftBasePad);
  }

  addRightBasePad() {
    // const { points } = this.layout.same;
    const lay = this.layout.same;
    // const baseLength = points[1].x - points[0].x;
    const rightBasePad = this.makePad(
      lay.points[1],
    );
    rightBasePad.move.maxTransform.updateTranslation(
      lay.grid.length / 2 - lay.pad.radius,
      0,
    );
    rightBasePad.move.minTransform.updateTranslation(
      -lay.grid.length / 2 + lay.basePadMinSeparation + lay.pad.radius,
      -lay.grid.height / 2,
    );
    this.add('rightBasePad', rightBasePad);
  }

  updateTriangle() {
    const lay = this.layout.same;
    const p = this._topPad.getPosition();
    const left = this._leftBasePad.getPosition();
    const right = this._rightBasePad.getPosition();
    const separation = right.x - left.x;

    if (this._leftBasePad.state.isBeingMoved || this._leftBasePad.state.isMovingFreely) {
      let rightX = right.x;
      if (separation < lay.basePadMinSeparation) {
        rightX += lay.basePadMinSeparation - separation;
      }
      this._rightBasePad.transform.updateTranslation(rightX, left.y);
    }
    if (this._rightBasePad.state.isBeingMoved || this._rightBasePad.state.isMovingFreely) {
      let leftX = left.x;
      if (separation < lay.basePadMinSeparation) {
        leftX -= lay.basePadMinSeparation - separation;
      }
      this._leftBasePad.transform.updateTranslation(leftX, right.y);
    }

    const baseLength = right.x - left.x;
    const points = [
      left,
      right,
      p,
    ];
    // console.log(points)
    const height = p.y - left.y;
    const area =
      height * baseLength * 0.5 / this.layout.same.grid.spacing / this.layout.same.grid.spacing;
    this._label.vertices.change(
      `Area = ${round(area, 1).toString()} squares`,
      this._label.lastDrawTransform.m(),
    );
    this._tri.vertices.change(points);
    this.diagram.animateNextFrame();
  }

  addGrid() {
    const lay = this.layout.same.grid;
    const grid = this.diagram.shapes.grid(
      new Rect(
        -lay.length / 2, -lay.height / 2,
        lay.length, lay.height,
      ),
      lay.spacing, lay.spacing, 2, this.layout.colors.grid,
      new Transform().translate(lay.position),
    );
    this.add('grid', grid);
  }

  moveTopPad() {
    const p = this._topPad.getPosition();
    const length = this.layout.same.grid.length / 2;
    let newX = rand(0, length);
    if (p.x > 0) {
      newX *= -1;
    }
    const scenario = { position: new Point(newX, p.x) };
    this.moveToScenario(this._topPad, scenario, null);
    this.diagram.animateNextFrame();
  }

  addAreaLabel() {
    const { points } = this.layout.same;
    const area = (points[1].x - points[0].x) * (points[2].y - points[0].y)
                 * 0.5 / this.layout.same.grid.spacing / this.layout.same.grid.spacing;
    const label = this.diagram.shapes.htmlText(
      `Area = ${round(area, 1).toString()} squares`,
      'id_lessons__area_label_triangle_same_area',
      'lesson__area_intro__area_label',
      this.layout.same.label.position,
      'middle', 'center',
    );
    this.add('label', label);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addTopPad();
    this.addRightBasePad();
    this.addLeftBasePad();
    this.addGrid();
    this.addLines();
    this.addAreaLabel();
    this.setPosition(this.layout.samePosition);
    this.hasTouchableElements = true;
  }
}
