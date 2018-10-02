// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeLine } from '../../../../LessonsCommon/tools/line';

export default class QuadCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _quad1: DiagramElementPrimative;
  _quad2: DiagramElementPrimative;
  _quad3: DiagramElementPrimative;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;

  addQuads() {
    const makeQuad = points => this.diagram.shapes.polyLine(
      points, true, this.layout.lineWidth, this.layout.colors.lines,
      'none', new Transform('quad').scale(1, 1).translate(0, 0),
    );
    console.log(this.layout.quads.quad1)
    const quad1 = makeQuad(this.layout.quads.quad1.points);
    const quad2 = makeQuad(this.layout.quads.quad2.points);
    const quad3 = makeQuad(this.layout.quads.quad3.points);

    quad1.setPosition(this.layout.quads.quad1.position);
    quad2.setPosition(this.layout.quads.quad2.position);
    quad3.setPosition(this.layout.quads.quad3.position);

    this.add('quad1', quad1);
    this.add('quad2', quad2);
    this.add('quad3', quad3);
  }

  addLines() {
    const makeL = (p1, p2) => {
      const l = makeLine(
        this.diagram, 'end', 1, this.layout.lineWidth / 2,
        this.layout.colors.lines,
      );
      l.setEndPoints(p1, p2);
      return l;
    };
    const lay = this.layout.quads;
    const line1 = makeL(lay.quad1.points[0], lay.quad1.points[2])
    const line2 = makeL(lay.quad2.points[0], lay.quad2.points[2])
    const line3 = makeL(lay.quad3.points[0], lay.quad3.points[2])

    line1.setPosition(this.layout.quads.quad1.position.add(lay.quad1.points[0]));
    line2.setPosition(this.layout.quads.quad2.position.add(lay.quad2.points[0]));
    line3.setPosition(this.layout.quads.quad3.position.add(lay.quad3.points[0]));


    this.add('line1', line1);
    this.add('line2', line2);
    this.add('line3', line3);
  }
  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addQuads();
    this.addLines();
  }
}
