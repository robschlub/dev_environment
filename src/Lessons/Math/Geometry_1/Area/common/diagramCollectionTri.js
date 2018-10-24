// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, Rect,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeEquationLabel } from '../../../../LessonsCommon/tools/equationLabel';
import makeEquationLabel from '../../../../LessonsCommon/tools/equationLabel';
import {
  addTriRectEquation,
} from './equations';
// import type {
//   TypeRectEquationNav,
// } from './equations';

export default class TriangleAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  eqns: {
  };

  addGrid() {
    const lay = this.layout.gridTri;
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

  addPolyLine(
    name: string,
    color: Array<number> = this.layout.colors.line,
  ) {
    const lay = this.layout[name];
    const line = this.diagram.shapes.polyLine(
      lay.points, true, lay.width, color, 'alwaysOn',
    );
    this.add(name, line);
  }

  addFan(
    name: string,
    color: Array<number>,
  ) {
    const lay = this.layout[name];
    const fan = this.diagram.shapes.fan(
      lay.points, color,
    );
    this.add(name, fan);
  }

  addTriangles() {
    this.addPolyLine('triIntro');
    this.addPolyLine('tri2');
    this.addPolyLine('tri2Rect1', this.layout.colors.construction);
    this.addPolyLine('tri2Rect2', this.layout.colors.construction1);
  }

  addTriangleFills() {
    this.addFan('tri2Rect1Tri', this.layout.colors.constructionFill);
    this.addFan('tri2Rect2Tri', this.layout.colors.construction1Fill);
  }

  addRect() {
    const lay = this.layout.triRect;
    const line = this.diagram.shapes.polyLine(
      lay.points, true, lay.width, this.layout.colors.line,
    );
    this.add('rect', line);
    const split = this.diagram.shapes.polyLine(
      [lay.points[1], lay.points[3]], false, lay.width, this.layout.colors.line,
    );
    this.add('rectSplit', split);
  }

  addSide(
    p1: Point,
    p2: Point,
    name: string,
    label: string = '',
    color: Array<number> = this.layout.colors.line,
  ) {
    const line = makeLine(
      this.diagram, 'end', 1, 0.1, color, false,
    );
    line.setEndPoints(p1, p2);
    line.addLabel(
      label, this.layout.triLabelOffset, 'outside', '', 'horizontal',
    );
    this.add(`side${name}`, line);
  }

  addSideLabels() {
    let lay = this.layout.triRect;
    this.addSide(lay.points[0], lay.points[3], 'RectA', 'A');
    this.addSide(lay.points[1], lay.points[0], 'RectB', 'B');

    lay = this.layout.tri2Rect1;
    let col = this.layout.colors.construction;
    this.addSide(lay.points[0], lay.points[3], 'TriRect1A', 'A', col);
    this.addSide(lay.points[1], lay.points[0], 'TriRect1B', 'B', col);

    lay = this.layout.tri2Rect2;
    col = this.layout.colors.construction1;
    this.addSide(lay.points[2], lay.points[1], 'TriRect2A', 'C', col);
    this.addSide(lay.points[1], lay.points[0], 'TriRect2B', 'D', col);
  }

  addLabel(name: string, position: Point, color: Array<number>) {
    const label = new makeEquationLabel(this.diagram, name, color);
    console.log(position)
    label.eqn.collection.setPosition(position);
    this.add(`label${name}`, label.eqn.collection);
  }

  addShapeLabels() {
    this.addLabel('1', this.layout.tri2Rect1Tri.midPoint, [1,1,1,1]);
    this.addLabel('2', this.layout.tri2Rect2Tri.midPoint, [1,1,1,1]);
  }

  addEqns() {
    addTriRectEquation(
      this.diagram, this.layout, this, 'triRectEqn',
    );
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addTriangleFills();
    this.addGrid();
    this.addTriangles();
    this.addRect();
    this.addSideLabels();
    this.addShapeLabels();
    this.addEqns();
    this.setPosition(this.layout.triPosition);
    this.hasTouchableElements = true;
    console.log(this)
  }
}
