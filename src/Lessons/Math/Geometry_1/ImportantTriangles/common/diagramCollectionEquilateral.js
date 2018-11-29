// @flow
import LessonDiagram from './diagram';
import {
  Transform,
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
    // const angle = this.diagram.objects.angle({
    //   radius: 0.4,
    //   p3: this.layout.equil.tri.points[0],
    //   p2: this.layout.equil.tri.points[1],
    //   p1: this.layout.equil.tri.points[2],
    //   // position: this.layout.equil.tri.points[0],
    //   rotation: 0,
    //   angle: 1,
    //   curve: {
    //     width: 0.01,
    //     sides: 100,
    //   },
    // });
    const lay = this.layout.equil;
    const angle1 = this.diagram.objects.angle(lay.angle, lay.angle1);
    this.add('angle1', angle1);
    const angle2 = this.diagram.objects.angle(lay.angle, lay.angle2);
    this.add('angle2', angle2);
    const angle3 = this.diagram.objects.angle(lay.angle, lay.angle3);
    this.add('angle3', angle3);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.equil.position);
    this.addTris();
    this.addAngles();
    console.log(this)
    this.setTransformCallback = () => {
      const r = this.transform.r();
      // console.log(r)
      if (r != null) {
        this._angle1.update(r);
        this._angle2.update(r);
        this._angle3.update(r);
      }
    };
    // this._angle1.setAngle({p1: new Point(1, 0), p2: new Point(0, 0), p3: new Point(1, 1)});
    this.hasTouchableElements = true;
    // this.touchInBoundingRect = true;
    // this.isTouchable = true;
    // this.isMovable = true;
    this.move.type = 'rotation';
    this._angle1.hasTouchableElements = true;
    this._angle1._side2.isTouchable = true;
    this._angle1._side2.isMovable = true;
    this._angle1._side2.move.type = 'rotation';
    this._angle1._side2.setTransformCallback = () => {
      const r = this._angle1._side2.transform.r();
      if (r != null) {
        this._angle1.setAngle({angle: r})
        this._angle1.update();
      }
    }
  }
}
