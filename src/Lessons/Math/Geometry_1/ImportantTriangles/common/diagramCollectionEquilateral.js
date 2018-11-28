// @flow
import LessonDiagram from './diagram';
import {
  Transform, Point,
} from '../../../../../js/diagram/tools/g2';
// import {
//   DiagramElementCollection,
// } from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class EquilateralCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addTris() {
    const tri = this.diagram.shapes.polyLine(this.layout.equil.tri);
    this.add('tri', tri);

    const leftTri = this.diagram.shapes.polyLine(this.layout.equil.leftTri);
    this.add('leftTri', leftTri);

    const rightTri = this.diagram.shapes.polyLine(this.layout.equil.rightTri);
    this.add('rightTri', rightTri);
  }

  addAngles() {
    const angle = this.diagram.objects.angle({
      radius: 0.4,
      p3: this.layout.equil.tri.points[0],
      p2: this.layout.equil.tri.points[1],
      p1: this.layout.equil.tri.points[2],
      // position: this.layout.equil.tri.points[0],
      rotation: 0,
      angle: 1,
      curve: {
        width: 0.01,
        sides: 100,
      },
    });
    this.add('angle', angle);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.equil.position);
    this.addTris();
    this.addAngles();
    // console.log(this)
    // this.hasTouchableElements = true;
  }
}
