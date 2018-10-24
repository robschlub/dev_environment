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

  addTriIntro() {
    const lay = this.layout.triIntro;
    const line = this.diagram.shapes.polyLine(
      lay.points, true, lay.width, this.layout.colors.line,
    );
    this.add('triIntro', line);
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

  addSideLabels() {
    const addSide = (p1, p2, name, label = '') => {
      const line = makeLine(
        this.diagram, 'end', 1, 0.1, this.layout.colors.line, false,
      );
      line.setEndPoints(p1, p2);
      line.addLabel(
        label, this.layout.triLabelOffset, 'outside', '', 'horizontal',
      );
      this.add(`side${name}`, line);
    };
    const lay = this.layout.triRect;
    addSide(lay.points[0], lay.points[3], 'RectA', 'A');
    addSide(lay.points[1], lay.points[0], 'RectB', 'B');
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
    this.addGrid();
    this.addTriIntro();
    this.addRect();
    this.addSideLabels();
    this.setPosition(this.layout.triPosition);
    this.hasTouchableElements = true;
    console.log(this)
  }
}
