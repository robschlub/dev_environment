// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, Rect,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import {
  addRectEqn, addSimpleRectEquation, addNumSquaresRectEquation,
  addSimpleUnitsRectEquation, addSquareEquation, addSquareRectEquation,
} from './equations';
import type {
  TypeRectEquationNav,
  TypeRectEquation,
  TypeSimpleRectEquation,
  TypeSimpleRectEquationCollection,
  TypeSimpleUnitsEquation,
  TypeSimpleUnitsEquationCollection,
  TypeSquareEquation,
  TypeSquareEquationCollection,
  TypeNumSquaresEquation,
  TypeNumSquaresEquationNav,
  TypeSquareRectEquationCollection,
  TypeSquareRectEquation,
} from './equations';

export default class RectAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  rowIndex: number;
  _grid: DiagramElementPrimative;
  _gridSquare: DiagramElementPrimative;
  _line: DiagramElementPrimative;
  _numSquaresEqn: TypeNumSquaresEquationNav;
  _rectEqn: TypeRectEquationNav;
  _row: DiagramElementPrimative;
  _side6m: TypeLine;
  _side10m: TypeLine;
  _sideA: TypeLine;
  _sideB: TypeLine;
  _sideHeight: TypeLine;
  _sideSquareA: TypeLine;
  _sideSquareB: TypeLine;
  _sideWidth: TypeLine;
  _simpleRectEqn: TypeSimpleRectEquationCollection;
  _simpleUnitsEqn: TypeSimpleUnitsEquationCollection;
  _square: DiagramElementPrimative;
  _squareEqn: TypeSquareEquationCollection;
  _squareRectEqn: TypeSquareRectEquationCollection;
  eqns: {
    numSquaresEqn: TypeNumSquaresEquation;
    rectEqn: TypeRectEquation;
    simpleRectEqn: TypeSimpleRectEquation;
    simpleUnitsEqn: TypeSimpleUnitsEquation;
    squareEqn: TypeSquareEquation;
    squareRectEqn: TypeSquareRectEquation;
  };

  addGrid() {
    const lay = this.layout.gridRect;
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

  addGridSquare() {
    const lay = this.layout.gridRect;
    const grid = this.diagram.shapes.grid(
      new Rect(
        -lay.height / 2, -lay.height / 2,
        lay.height, lay.height,
      ),
      lay.spacing, lay.spacing, 2, this.layout.colors.grid,
      new Transform().translate(lay.position),
    );
    this.add('gridSquare', grid);
  }

  addRow() {
    const lay = this.layout.gridRect;
    const { length } = this.layout.rect;
    const grid = this.diagram.shapes.grid(
      new Rect(
        -length / 2, -lay.spacing / 2,
        length, lay.spacing,
      ),
      lay.spacing, lay.spacing, 8, this.layout.colors.row,
      new Transform().translate(lay.position),
    );
    this.add('row', grid);
  }

  addRect() {
    const lay = this.layout.rect;
    const x = lay.length / 2;
    const y = lay.height / 2;
    const line = this.diagram.shapes.polyLine([
      new Point(-x, -y),
      new Point(-x, y),
      new Point(x, y),
      new Point(x, -y),
    ], true, lay.width, this.layout.colors.line);
    this.add('line', line);
  }

  addSquare() {
    const lay = this.layout.rect;
    const x = lay.height / 2;
    const line = this.diagram.shapes.polyLine([
      new Point(-x, -x),
      new Point(-x, x),
      new Point(x, x),
      new Point(x, -x),
    ], true, lay.width, this.layout.colors.line);
    this.add('square', line);
  }

  addSideLabels() {
    const lay = this.layout.rect;
    const x = lay.length / 2;
    const y = lay.height / 2;
    const addSide = (p1, p2, name, label = '') => {
      const line = makeLine(
        this.diagram, 'end', 1, 0.1, this.layout.colors.line, false,
      );
      line.setEndPoints(p1, p2);
      line.addLabel(label, lay.labelOffset, 'outside', '', 'horizontal');
      this.add(`side${name}`, line);
    };
    addSide(new Point(-x, -y), new Point(-x, y), 'A', 'A');
    addSide(new Point(-x, -y), new Point(-x, y), 'Height', 'Height');
    addSide(new Point(-x, -y), new Point(-x, y), '6m', '6m');
    addSide(new Point(x, -y), new Point(-x, -y), 'B', 'B');
    addSide(new Point(x, -y), new Point(-x, -y), 'Width', 'Width');
    addSide(new Point(x, -y), new Point(-x, -y), '10m', '10m');
    addSide(new Point(-y, -y), new Point(-y, y), 'SquareA', 'B');
    addSide(new Point(y, -y), new Point(-y, -y), 'SquareB', 'B');
  }

  addEqns() {
    addSimpleRectEquation(
      this.diagram, this.layout, this, 'simpleRectEqn',
    );
    addRectEqn(
      this.diagram, this.layout, this, 'rectEqn',
    );
    addNumSquaresRectEquation(
      this.diagram, this.layout, this, 'numSquaresEqn',
    );
    addSimpleUnitsRectEquation(
      this.diagram, this.layout, this, 'simpleUnitsEqn',
    );
    addSquareEquation(
      this.diagram, this.layout, this, 'squareEqn',
    );
    addSquareRectEquation(
      this.diagram, this.layout, this, 'squareRectEqn',
    );
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.rowIndex = 0;
    this.addGrid();
    this.addGridSquare();
    this.addRect();
    this.addSquare();
    this.addSideLabels();
    this.addRow();
    this.addEqns();
    this.setPosition(this.layout.rectPosition);
    this.hasTouchableElements = true;
  }

  toggleRow(index: number | null = null) {
    const lay = this.layout.rect;
    const { spacing } = this.layout.gridRect;
    this._row.showAll();
    if (index === null) {
      this.rowIndex = (this.rowIndex + 1) % (lay.height / spacing);
    } else {
      this.rowIndex = index;
    }
    this._row.setPosition(new Point(
      lay.position.x,
      lay.position.y + lay.height / 2 - spacing / 2 - this.rowIndex * spacing,
    ));
    this.diagram.animateNextFrame();
  }
}
