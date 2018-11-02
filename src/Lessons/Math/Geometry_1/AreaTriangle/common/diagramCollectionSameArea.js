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

export default class SameAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: DiagramElementPrimative;
  _grid: DiagramElementPrimative;
  _topPoint: DiagramElementPrimative;

  addLines() {
    const lay = this.layout.same;
    const tri = this.diagram.shapes.polyLine(
      lay.points, true, lay.width, this.layout.colors.line, 'alwaysOn',
    );
    this.add('tri', tri);
  }


  addTopPoint() {
    const lay = this.layout.same.pad;
    const topPoint = this.diagram.shapes.polygonFilled(
      lay.sides, lay.radius, 0, lay.sides, this.layout.colors.construction,
      new Transform().translate(this.layout.same.points[2]),
    );
    topPoint.isTouchable = true;
    topPoint.isMovable = true;
    topPoint.move.minTransform.updateTranslation(
      -this.layout.same.grid.length / 2,
      this.layout.same.points[2].y,
    );
    topPoint.move.maxTransform.updateTranslation(
      this.layout.same.grid.length / 2,
      this.layout.same.points[2].y,
    );
    const increaseBorderSize = (element: DiagramElementPrimative, multiplier: number) => {
      for (let i = 0; i < element.vertices.border[0].length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        element.vertices.border[0][i].y *= multiplier;
      }
    };
    increaseBorderSize(topPoint, 2);
    topPoint.setTransformCallback = this.updateTriangle.bind(this);
    this.add('topPoint', topPoint);
  }

  updateTriangle() {
    const p = this._topPoint.getPosition();
    const points = [
      this.layout.same.points[0],
      this.layout.same.points[1],
      p,
    ];
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

  moveTopPoint() {
    const p = this._topPoint.getPosition();
    const length = this.layout.same.grid.length / 2;
    let newX = rand(0, length);
    if (p.x > 0) {
      newX *= -1;
    }
    const scenario = { position: new Point(newX, p.x) };
    this.moveToScenario(this._topPoint, scenario, null);
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
    this.addTopPoint();
    this.addGrid();
    this.addLines();
    this.addAreaLabel();
    this.setPosition(this.layout.samePosition);
    this.hasTouchableElements = true;
  }
}
