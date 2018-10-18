// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, Rect, polarToRect,
} from '../../../../../js/diagram/tools/g2';
import {
  range, roundNum,
} from '../../../../../js/diagram/tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class RectAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  rowIndex: number;
  _row: DiagramElementPrimative;
  _grid: DiagramElementPrimative;
  _rect: DiagramCollection;

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

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.rowIndex = 0;
    this.addGrid();
    this.addRect();
    this.addRow();

    this.setPosition(this.layout.rectPosition);
    this.hasTouchableElements = true;
  }

  toggleRow(index: number | null = null) {
    const lay = this.layout.rect;
    const { spacing } = this.layout.gridRect;

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
