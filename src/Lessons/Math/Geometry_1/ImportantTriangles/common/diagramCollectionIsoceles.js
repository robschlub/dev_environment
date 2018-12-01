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

export default class IsocelesCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;

  addTri() {
    const iso = this.diagram.shapes.collection(new Transform('iso')
      .translate(0, 0));

    // tri
    const line = this.diagram.shapes.polyLine(this.layout.iso.tri);
    iso.add('line', line);

    // Angles
    let lay = this.layout.iso;
    iso.add('angle1', this.diagram.objects.angle(lay.angle, lay.angle1));
    iso.add('angle2', this.diagram.objects.angle(lay.angle, lay.angle2));
    iso.add('angle3', this.diagram.objects.angle(lay.angle, lay.angle3));

    // Sides
    lay = this.layout.iso;
    iso.add('side12', this.diagram.objects.line(lay.sideLength, lay.side12));
    iso.add('side23', this.diagram.objects.line(lay.sideLength, lay.side23));
    iso.add('side31', this.diagram.objects.line(lay.sideLength, lay.side31));
    this.add('tri', iso);
  }

  addSplitLines() {
    const lay = this.layout.iso;
    this.add('splitLine1', this.diagram.objects.line(lay.splitLine1));
    this.add('splitLine2', this.diagram.objects.line(lay.splitLine2));
  }

  addLeftRightTris() {
    const lay = this.layout.iso;
    const layL = this.layout.iso.left;
    const layR = this.layout.iso.right;

    const left = this.diagram.shapes.collection(new Transform('left').translate(0, 0));
    const right = this.diagram.shapes.collection(new Transform('left').translate(0, 0));

    // tri
    const leftLine = this.diagram.shapes.polyLine(this.layout.iso.left.tri);
    left.add('line', leftLine);

    // Angles
    left.add('angle1', this.diagram.objects.angle(lay.angle, layL.angle1));
    left.add('angle2', this.diagram.objects.angle(lay.angle, layL.angle2));
    left.add('angle3', this.diagram.objects.angle(lay.angle, layL.angle3));
    right.add('angle1', this.diagram.objects.angle(lay.angle, layR.angle1));
    right.add('angle2', this.diagram.objects.angle(lay.angle, layR.angle2));
    right.add('angle3', this.diagram.objects.angle(lay.angle, layR.angle3));

    // Sides
    left.add('side12', this.diagram.objects.line(lay.sideLength, layL.side12));
    left.add('side23', this.diagram.objects.line(lay.sideLength, layL.side23));
    left.add('side31', this.diagram.objects.line(lay.sideLength, layL.side31));
    right.add('side12', this.diagram.objects.line(lay.sideLength, layR.side12));
    right.add('side23', this.diagram.objects.line(lay.sideLength, layR.side23));
    right.add('side31', this.diagram.objects.line(lay.sideLength, layR.side31));

    const rightLine = this.diagram.shapes.polyLine(this.layout.iso.right.tri);
    right.add('line', rightLine);

    this.add('left', left);
    this.add('right', right);
  }

  addEquations() {
    this.diagram.equation.makeEqnFromOptions({
      color: this.layout.colors.angles,
      currentForm: '0',
      elements: {
        a: 'a',
        _2: '2',
        plus: '+',
        b: 'b',
        c: 'c',
        d: 'd',
        e: 'e',
        v: { diagramObj: 'vinculum' },
        v_: { diagramObj: 'vinculum' },
        v__: { diagramObj: 'vinculum' },
        lb: { diagramObj: 'bracket', side: 'left' },
        rb: { diagramObj: 'bracket', side: 'right' },
      },
      addToCollection: this,
      name: 'test',
      forms: {
        '0': ['a', 'space', 'plus', 'b'],
        '1': ['b', 'plus', 'a'],
        '2': ['.frac', ['a', '_2', 'v'], 'space', 'plus', 'b'],
        '3': ['.frac', {
          numerator: 'b',
          denominator: '_2',
          vinculum: 'v',
        }, 'space', 'plus', 'a'],
        '4': {
          content: ['a', 'space', 'plus', 'b'],
          elementMods: {
            a: {
              color: [0, 0, 1, 1],
            },
          },
        },
        '5': ['.sfrac', ['a', '_2', 'v', 0.7], 'space', 'plus', 'b'],
        '6': ['.frac', [
          ['a', 'space', 'plus', 'space', 'e'],
          ['.sfrac', ['b', ['.sfrac', ['d', 'c', 'v__', 0.7]], 'v_', 0.8]],
          'v',
        ]],
        '7': ['a', '.sub', ['b', '_2']],
        '8': ['a', '.sup', ['b', '_2']],
        '9': ['a', '.supsub', ['b', '_2', 'c']],
        '10': ['a', '.brac', ['b', 'lb', 'rb']],
      },
      formSeries: ['0', '1', '2', '3', '4', '5'],
    });
  }

  // addSideLengths() {
  //   const { points } = this.layout.iso.tri;
  //   const addLine = (p: { p1: number, p2: number }, name) => {
  //     const line = this.diagram.objects.line(joinObjects(
  //       this.layout.iso.sideLength, p,
  //     ));
  //     this.add(name, line);
  //   };
  //   addLine(this.layout.iso.side12, 'side12');
  //   addLine(this.layout.iso.side23, 'side23');
  //   addLine(this.layout.iso.side31, 'side31');
  //   addLine(this.layout.iso.sideH, 'sideH');
  // }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.setPosition(this.layout.iso.position);
    this.addTri();
    this.addLeftRightTris();
    this.addSplitLines();
    this.addEquations();
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
    this._tri._side23._label.pulseScaleNow(1, 2);
    this._tri._side31._label.pulseScaleNow(1, 2);
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

  toggleSplitLines(index: number | null) {
    const line1 = this._splitLine1;
    const line2 = this._splitLine2;
    let indexToUse = 1;
    if (index === null) {
      if (line1.isShown) {
        indexToUse = 2;
      } else {
        indexToUse = 1;
      }
    } else {
      indexToUse = index;
    }

    if (indexToUse === 1) {
      line1.showAll();
      line2.hideAll();
    } else {
      line1.hideAll();
      line2.showAll();
    }
    this.diagram.animateNextFrame();
  }
}
