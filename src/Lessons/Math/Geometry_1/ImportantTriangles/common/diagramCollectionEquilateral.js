// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import { joinObjects } from '../../../../../js/tools/tools';
// import {
//   DiagramElementCollection,
// } from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class EquilateralCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addTri() {
    const equil = this.diagram.shapes.collection(new Transform('Equil')
      .translate(0, 0));

    // tri
    const tri = this.diagram.shapes.polyLine(this.layout.equil.tri);
    equil.add('tri', tri);

    // Angles
    let lay = this.layout.equil;
    equil.add('angle1', this.diagram.objects.angle(lay.angle, lay.angle1));
    equil.add('angle2', this.diagram.objects.angle(lay.angle, lay.angle2));
    equil.add('angle3', this.diagram.objects.angle(lay.angle, lay.angle3));

    // Sides
    lay = this.layout.equil;
    equil.add('side12', this.diagram.objects.line(lay.sideLength, lay.side12));
    equil.add('side23', this.diagram.objects.line(lay.sideLength, lay.side23));
    equil.add('side31', this.diagram.objects.line(lay.sideLength, lay.side31));
    this.add('equilTri', equil);
  }

  addLeftRightTris() {
    const lay = this.layout.equil;
    const layL = this.layout.equil.left;
    const layR = this.layout.equil.right;

    const left = this.diagram.shapes.collection(new Transform('left').translate(0, 0));
    const right = this.diagram.shapes.collection(new Transform('left').translate(0, 0));

    // tri
    const leftTri = this.diagram.shapes.polyLine(this.layout.equil.left.tri);
    left.add('tri', leftTri);

    // Angles
    left.add('angle1', this.diagram.objects.angle(lay.angle, layL.angle1));
    left.add('angle2', this.diagram.objects.angle(lay.angle, layL.angle2));
    left.add('angle3', this.diagram.objects.angle(lay.angle, layL.angle3));
    right.add('angle1', this.diagram.objects.angle(lay.angle, layR.angle1));
    right.add('angle2', this.diagram.objects.angle(lay.angle, layR.angle2));
    right.add('angle3', this.diagram.objects.angle(lay.angle, layR.angle3));

    // Sides
    left.add('side12', this.diagram.objects.line(lay.sideLength, layL.side12, {
      label: {
        text: this.diagram.equation.fractionPre({
          numerator: '1',
          denominator: '2',
          main: 'A',
          color: this.layout.colors.lines,
          scale: 0.7,
        }),
      },
    }));
    left.add('side23', this.diagram.objects.line(lay.sideLength, layL.side23));
    left.add('side31', this.diagram.objects.line(lay.sideLength, layL.side31));
    right.add('side12', this.diagram.objects.line(lay.sideLength, layR.side12));
    right.add('side23', this.diagram.objects.line(lay.sideLength, layR.side23));
    right.add('side31', this.diagram.objects.line(lay.sideLength, layR.side31));

    const rightTri = this.diagram.shapes.polyLine(this.layout.equil.right.tri);
    right.add('tri', rightTri);

    this.add('left', left);
    this.add('right', right);
  }

  // addSideLengths() {
  //   const { points } = this.layout.equil.tri;
  //   const addLine = (p: { p1: number, p2: number }, name) => {
  //     const line = this.diagram.objects.line(joinObjects(
  //       this.layout.equil.sideLength, p,
  //     ));
  //     this.add(name, line);
  //   };
  //   addLine(this.layout.equil.side12, 'side12');
  //   addLine(this.layout.equil.side23, 'side23');
  //   addLine(this.layout.equil.side31, 'side31');
  //   addLine(this.layout.equil.sideH, 'sideH');
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.equil.position);
    this.addTri();
    this.addLeftRightTris();
    console.log(this)
    // this.setTransformCallback = () => {
    //   const r = this.transform.r();
    //   // console.log(r)
    //   if (r != null) {
    //     this._angle1.update(r);
    //     this._angle2.update(r);
    //     this._angle3.update(r);
    //   }
    // };
    // this._angle1.setAngle({p1: new Point(1, 0), p2: new Point(0, 0), p3: new Point(1, 1)});
    this.hasTouchableElements = true;
    this.touchInBoundingRect = true;
    this.isTouchable = true;
    this.isMovable = true;
    this.move.type = 'rotation';
    // this._angle1.hasTouchableElements = true;
    // this._angle1._side2.isTouchable = true;
    // this._angle1._side2.isMovable = true;
    // this._angle1._side2.move.type = 'rotation';
    // this._angle1._side2.setTransformCallback = () => {
    //   const r = this._angle1._side2.transform.r();
    //   if (r != null) {
    //     this._angle1.setAngle({angle: r})
    //     this._angle1.update();
    //   }
    // }
  }
}
