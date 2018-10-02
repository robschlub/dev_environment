// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point, polarToRect, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
// import {
//   removeRandElement, rand,
// } from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';

// import makeTriangle from '../../../../LessonsCommon/tools/triangle';
// import type {
//   TypeTriangle, TypeTriangleAngle, TypeTriangleLabel,
// } from '../../../../LessonsCommon/tools/triangle';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

// import { makeLine } from '../../../../LessonsCommon/tools/line';
// import { makeAngle } from '../../../../LessonsCommon/tools/angle';
// import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

export default class QuadCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _quad1: DiagramElementPrimative;
  _quad2: DiagramElementPrimative;
  _quad3: DiagramElementPrimative;

  addQuads() {
    const makeQuad = points => this.diagram.shapes.polyLine(
      points, true, this.layout.lineWidth, this.layout.colors.lines,
      'onSharpAnglesOnly', new Transform('quad').scale(1, 1).translate(0, 0),
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

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addQuads();
  }
}
