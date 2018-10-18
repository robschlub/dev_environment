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

export default class AreaShapesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _square1: DiagramElementPrimative;
  _square2: DiagramElementPrimative;
  _circle: DiagramElementPrimative;
  _lineLength: {
    line: TypeLine;
    line1: TypeLine;
    line2: TypeLine;
    line3: TypeLine;
    line4: TypeLine;
  } & DiagramElementCollection;

  addShapes() {
    const square1 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square1.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square1,
      new Transform('s1').translate(this.layout.square1.position),
    );
    this.add('square1', square1);

    const square2 = this.diagram.shapes.polygonFilled(
      4, Math.sqrt(((this.layout.square2.sideLength / 2) ** 2) * 2),
      Math.PI / 4, 4, this.layout.colors.square2,
      new Transform('s2').translate(this.layout.square2.position),
    );
    this.add('square2', square2);

    const circle = this.diagram.shapes.polygonFilled(
      this.layout.circle.numSides, this.layout.circle.radius,
      0, this.layout.circle.numSides, this.layout.colors.circle,
      new Transform('c').translate(this.layout.circle.position),
    );
    this.add('circle', circle);
  }

  addLineLength() {
    const lay = this.layout.lineLength;
    const col = this.layout.colors;
    const lineLength = this.diagram.shapes.collection(new Transform('lineLength')
      .translate(lay.position));

    const makeL = (position, length, labelText, name, labelPos, color) => {
      const line = makeLine(this.diagram, 'center', 1, lay.width, color);
      line.setPosition(position);
      line.setLength(length);
      line.addLabel(labelText, 0.05, 'labelPos', '', 'horizontal');
      lineLength.add(`line${name}`, line);
    };
    makeL(new Point(0, 0), lay.length, '4m', '', 'bottom', col.line);
    const sectionLength = lay.length / lay.sections;
    const start = -lay.length / 2 + sectionLength / 2;
    for (let i = 0; i < lay.sections; i += 1) {
      const label = i === 0 ? '1m' : '';
      makeL(
        new Point(start + i * sectionLength, lay.referenceOffset),
        sectionLength * 0.99,
        label, `${i}`, 'top', col.reference,
      );
    }
    this.add('lineLength', lineLength);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addShapes();
    this.addLineLength();
    this.setPosition(this.layout.shapesPosition);
    this.hasTouchableElements = true;
  }
}
