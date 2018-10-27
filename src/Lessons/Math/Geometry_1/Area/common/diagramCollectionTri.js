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
  addTriRectEquation, addTri2AreaEquation,
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
      new Transform().rotate(0).translate(0, 0),
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
    this.addPolyLine('tri3');
    this.addPolyLine('tri2Rect1', this.layout.colors.construction);
    this.addPolyLine('tri2Rect2', this.layout.colors.construction1);
    this.addPolyLine('tri3Rect1', this.layout.colors.construction);
    this.addPolyLine('tri3Rect2', this.layout.colors.construction1);
  }

  addTriangleFills() {
    this.addFan('tri2Rect1Tri', this.layout.colors.constructionFill);
    this.addFan('tri2Rect2Tri', this.layout.colors.construction1Fill);
    this.addFan('tri3Rect1Tri', this.layout.colors.constructionFill);
    this.addFan('tri3Rect2Tri', this.layout.colors.construction1Fill);
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
    lineWithArrows: boolean = false,
  ) {
    const line = makeLine(
      this.diagram, 'end', 1, this.layout.tri2.width / 2, color, lineWithArrows,
    );
    line.setEndPoints(p1, p2);
    line.addLabel(
      label, this.layout.triLabelOffset, 'outside', '', 'horizontal',
    );
    if (lineWithArrows) {
      line.addArrow1(this.layout.tri2.width * 2, this.layout.tri2.width * 2);
      line.addArrow2(this.layout.tri2.width * 2, this.layout.tri2.width * 2);
    }
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
    this.addSide(lay.points[2], lay.points[1], 'TriRect2A', 'A', col);
    this.addSide(lay.points[2], lay.points[1], 'TriRect2C', 'C', col);
    this.addSide(lay.points[2], lay.points[1], 'TriRect2AH', 'C = A = height', col);
    this.addSide(lay.points[1], lay.points[0], 'TriRect2D', 'D', col);

    lay = this.layout.tri2;
    this.addSide(
      lay.points[1].sub(0, this.layout.triLabelOffset * 4),
      lay.points[0].sub(0, this.layout.triLabelOffset * 4),
      'Tri2Base', 'base', this.layout.colors.lineLabel,
      true,
    );

    this.addSide(
      new Point(lay.points[1].x, lay.points[2].y)
        .add(this.layout.triLabelOffset * 4, 0),
      lay.points[1].add(this.layout.triLabelOffset * 4, 0),
      'Tri2Height', 'height', this.layout.colors.lineLabel,
      true,
    );

    lay = this.layout.tri3Rect1;
    col = this.layout.colors.construction;
    this.addSide(lay.points[2], lay.points[1], 'Tri3Rect1A', 'A', col);
    this.addSide(lay.points[3], lay.points[2], 'Tri3Rect1B', 'B', col);

    lay = this.layout.tri3Rect2;
    col = this.layout.colors.construction1;
    this.addSide(lay.points[3], lay.points[0], 'Tri3Rect2A', 'A', col);
    this.addSide(lay.points[2], lay.points[3], 'Tri3Rect2C', 'C', col);
  }

  // addLabel(name: string, position: Point, color: Array<number>) {
  //   const label = new makeEquationLabel(this.diagram, name, color);
  //   label.eqn.collection.setPosition(position);
  //   this.add(`label${name}`, label.eqn.collection);
  // }

  // addShapeLabels() {
  //   const colAD = this.layout.colors.construction;
  //   const colAC = this.layout.colors.construction1;
  //   this.addLabel('AD', this.layout.tri2Rect1Tri.midPoint, colAD);
  //   this.addLabel('AC', this.layout.tri2Rect2Tri.midPoint, colAC);
  // }

  addEqns() {
    addTriRectEquation(
      this.diagram, this.layout, this, 'triRectEqn',
    );
    addTri2AreaEquation(
      this.diagram, this.layout, this, 'tri2AreaEqn',
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
    // this.addShapeLabels();
    this.addEqns();
    this.setPosition(this.layout.triPosition);
    this.hasTouchableElements = true;
  }
}
