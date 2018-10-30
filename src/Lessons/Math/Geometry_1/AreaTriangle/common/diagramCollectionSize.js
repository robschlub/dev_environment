// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';
import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class SizeCollection extends CommonDiagramCollection {
  _mm: {
    _yLine: TypeLine;
    _xLine: TypeLine;
    _square: DiagramElementPrimative;
  } & DiagramElementCollection;

  _m: {
    _yLine: TypeLine;
    _xLine: TypeLine;
    _square: DiagramElementPrimative;
  } & DiagramElementCollection;

  addSquareSize(name: string, label: string, layout: {
    position: Point,
    sideLength: number,
    width: number,
    lineOffset: number,
    labelOffset: number,
  }) {
    const color = this.layout.colors.reference;

    const square = this.diagram.shapes.polygon(
      4, Math.sqrt(((layout.sideLength / 2) ** 2) * 2), layout.width,
      Math.PI / 4, 1, 4, color,
    );

    const yLine = makeLine(this.diagram, 'center', 1, layout.width, color);
    yLine.addArrow1(this.layout.arrow.width, this.layout.arrow.height);
    yLine.addArrow2(this.layout.arrow.width, this.layout.arrow.height);
    yLine.setPosition(new Point(-layout.sideLength / 2 - layout.lineOffset, 0));
    yLine.transform.updateRotation(-Math.PI / 2);
    yLine.addLabel(label, layout.labelOffset, 'left', 'left', 'horizontal');
    yLine.setLength(layout.sideLength);

    const xLine = makeLine(this.diagram, 'center', 1, layout.width, color);
    xLine.addArrow1(this.layout.arrow.width, this.layout.arrow.height);
    xLine.addArrow2(this.layout.arrow.width, this.layout.arrow.height);
    xLine.setPosition(new Point(0, -layout.sideLength / 2 - layout.lineOffset));
    xLine.addLabel(label, layout.labelOffset, 'bottom', 'bottom', 'horizontal');
    xLine.setLength(layout.sideLength);

    const group = this.diagram.shapes.collection(new Transform().translate(layout.position));
    group.add('square', square);
    group.add('yLine', yLine);
    group.add('xLine', xLine);
    this.add(name, group);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addSquareSize('mm', '1mm', this.layout.mmSquare);
    this.addSquareSize('m', '1m', this.layout.mSquare);

    this.setPosition(this.layout.sizePosition);
    this.hasTouchableElements = true;
  }
}
