// @flow
import LessonDiagram from './diagram';
import {
  Transform, Rect, // Point,
} from '../../../../../js/diagram/tools/g2';
import DiagramObjectAngle from '../../../../../js/diagram/DiagramObjects/Angle';
import { DiagramObjectLine } from '../../../../../js/diagram/DiagramObjects/Line';
// import { joinObjects } from '../../../../../js/tools/tools';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class IsocelesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: {
    _angle1: DiagramObjectAngle;
    _angle2: DiagramObjectAngle;
    _angle3: DiagramObjectAngle;
    _side12: DiagramObjectLine;
    _side23: DiagramObjectLine;
    _side31: DiagramObjectLine;
  }

  _split: DiagramObjectLine;
  _topPoint: DiagramElementPrimative;
  _midPoint: DiagramElementPrimative;

  _splitLine1: DiagramObjectLine;
  _splitLine2: DiagramObjectLine;

  addGrid() {
    const lay = this.layout.grid;
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

  // addTri() {
  //   // this.addLayout();
  //   this.diagram.addElements(this, this.layout.addElements);
  // }

  // addSplitLines() {
  //   const lay = this.layout.iso;
  //   this.add('splitLine1', this.diagram.objects.line(lay.splitLine1));
  //   this.add('splitLine2', this.diagram.objects.line(lay.splitLine2));
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform('Iso').rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.iso.position);
    this.addGrid();
    this.diagram.addElements(this, this.layout.addElements);
    this.diagram.addElements(this, this.layout.addEquationA);
    this.diagram.addElements(this, this.layout.addEquationB);
    // this.addTri();
    // this.addLeftRightTris();
    // this.addSplitLines();
    // this.addEquations();
    // eslint-disable-next-line
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
    // this.touchInBoundingRect = true;
    // this.isTouchable = true;
    // this.isMovable = true;
    // this.move.type = 'rotation';
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

  pulseEqualSides() {
    if (this._tri._side23._label != null) {
      this._tri._side23._label.pulseScaleNow(1, 2);
    }
    if (this._tri._side31._label != null) {
      this._tri._side31._label.pulseScaleNow(1, 2);
    }
    this.diagram.animateNextFrame();
  }

  pulseEqualAngles() {
    this._tri._angle1.pulseScaleNow(1, 1.5);
    this._tri._angle2.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseAngle3() {
    this._tri._angle3.pulseScaleNow(1, 1.5);
    this.diagram.animateNextFrame();
  }

  pulseTopPoint() {
    this._topPoint.show();
    this._topPoint.pulseScaleNow(1, 100, 0, () => { this._topPoint.hide(); });
    this.diagram.animateNextFrame();
  }

  pulseMidPoint() {
    this._midPoint.show();
    this._midPoint.pulseScaleNow(1, 100, 0, () => { this._midPoint.hide(); });
    this.diagram.animateNextFrame();
  }

  growSplit() {
    this._split.grow(0, 1);
    this.diagram.animateNextFrame();
  }

  // toggleSplitLines(index: number | null) {
  //   const line1 = this._splitLine1;
  //   const line2 = this._splitLine2;
  //   let indexToUse = 1;
  //   if (index === null) {
  //     if (line1.isShown) {
  //       indexToUse = 2;
  //     } else {
  //       indexToUse = 1;
  //     }
  //   } else {
  //     indexToUse = index;
  //   }

  //   if (indexToUse === 1) {
  //     line1.showAll();
  //     line2.hideAll();
  //   } else {
  //     line1.hideAll();
  //     line2.showAll();
  //   }
  //   this.diagram.animateNextFrame();
  // }
}
