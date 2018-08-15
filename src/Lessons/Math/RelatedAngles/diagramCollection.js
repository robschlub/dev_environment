// @flow

// import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative, getMaxTimeFromVelocity,
} from '../../../js/diagram/Element';
import lessonLayout from './layout';

import {
  makeSelectorText, addSelectorHTML, SelectorList,
} from '../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
import type { LessonDiagramType } from './diagram';
// import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';
import ParallelCollection from './diagramCollectionParallel';
import OppositeCollection from './diagramCollectionOpposite';
import type { MoveableLineType } from './diagramCollectionCommon';
// import makeMoveableLine from './diagramCollectionCommon';
// import type { MoveableLineType } from './diagramCollectionCommon';
// type MoveableLinePrimativeType = {
//   // originalBorder: Array<Point>;
//   movementAllowed: 'rotation' | 'translation';
// } & DiagramElementPrimative;

// export type MoveableLineType = {
//   _end1: MoveableLinePrimativeType;
//   _end2: MoveableLinePrimativeType;
//   _mid: MoveableLinePrimativeType;
// } & DiagramElementCollection;


class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: LessonDiagramType;
  _parallel: ParallelCollection;
  _opposite: OppositeCollection;
  _selector: DiagramElementPrimative;
  // _line1: MoveableLineType;
  // _line2: MoveableLineType;
  // _line3: MoveableLineType;
  // _angleA: AngleType;
  // _angleB: AngleType;
  // _angleC: AngleType;
  // _angleD: AngleType;
  // isParallelHighlighting: boolean;

  // checkForParallel() {
  //   if (!this.isParallelHighlighting) {
  //     return;
  //   }
  //   if (!this._line1 || !this._line2) {
  //     return;
  //   }
  //   const angleSameThreshold = Math.PI / 300;
  //   const distanceThreshold = this.layout.moveableLine.width * 1.1;
  //   const r1 = this._line1.transform.r();
  //   const r2 = this._line2.transform.r();
  //   const t1 = this._line1.transform.t();
  //   const t2 = this._line2.transform.t();
  //   if (r1 != null && r2 != null && t1 != null && t2 != null) {
  //     let isParallel = true;
  //     const lineRotationDifference = Math.abs(minAngleDiff(r1, r2));
  //     if (lineRotationDifference > angleSameThreshold) {
  //       isParallel = false;
  //     }

  //     if (isParallel) {
  //       if (!this._line2.state.isBeingMoved) {
  //         this._line2.transform.updateRotation(r1);
  //       } else if (!this._line1.state.isBeingMoved) {
  //         this._line1.transform.updateRotation(r2);
  //       }
  //     }

  //     if (isParallel) {
  //       const line2 = new Line(t2, t2.add(Math.cos(r2), Math.sin(r2)));
  //       const line2DistanceToLineCenter1 = line2.distanceToPoint(t1);
  //       if (line2DistanceToLineCenter1 < distanceThreshold) {
  //         isParallel = false;
  //       }
  //     }

  //     if (isParallel) {
  //       this._line1.setColor(this.layout.colors.line);
  //       this._line2.setColor(this.layout.colors.line);
  //     } else {
  //       this._line1.setColor(this.layout.colors.disabled);
  //       this._line2.setColor(this.layout.colors.disabled);
  //     }
  //   }
  // }

  // makeMoveableLine() {
  //   const { width } = this.layout.moveableLine;
  //   const { end, middle, full } = this.layout.moveableLine.length;

  //   const line = this.diagram.shapes.collection(new Transform()
  //     .rotate(0)
  //     .translate(0, 0));
  //   line.pulse.transformMethod = s => new Transform().scale(1, s);
  //   line.hasTouchableElements = true;
  //   line.isMovable = true;
  //   line.touchInBoundingRect = true;
  //   line.isTouchable = true;
  //   const bounds = this.layout.moveableLine.boundary;
  //   line.setTransformCallback = (t) => {
  //     const r = t.r();
  //     if (r != null) {
  //       const w = Math.abs(this.layout.moveableLine.length.full / 2 * Math.cos(r));
  //       const h = Math.abs(this.layout.moveableLine.length.full / 2 * Math.sin(r));
  //       line.move.maxTransform.updateTranslation(
  //         bounds.right - w,
  //         bounds.top - h,
  //       );
  //       line.move.minTransform.updateTranslation(
  //         bounds.left + w,
  //         bounds.bottom + h,
  //       );
  //       if (r > 2 * Math.PI) {
  //         line.transform.updateRotation(r - 2 * Math.PI);
  //       }
  //       if (r < 0) {
  //         line.transform.updateRotation(r + 2 * Math.PI);
  //       }
  //     }
  //     this.checkForParallel();
  //     this.updateOppositeAngles();
  //   };
  //   line.setTransform(new Transform().rotate(0).translate(0, 0));

  //   const end1 = this.diagram.shapes.horizontalLine(
  //     new Point(-full / 2, 0),
  //     end, width,
  //     0, this.layout.colors.line, new Transform(),
  //   );
  //   end1.isTouchable = true;
  //   end1.movementAllowed = 'rotation';

  //   const end2 = this.diagram.shapes.horizontalLine(
  //     new Point(middle / 2, 0),
  //     end, width,
  //     0, this.layout.colors.line, new Transform(),
  //   );
  //   end2.isTouchable = true;
  //   end2.movementAllowed = 'rotation';

  //   const mid = this.diagram.shapes.horizontalLine(
  //     new Point(-middle / 2, 0),
  //     middle, width,
  //     0, this.layout.colors.line, new Transform(),
  //   );
  //   mid.isTouchable = true;
  //   mid.movementAllowed = 'translation';

  //   const increaseBorderSize = (element: MoveableLinePrimativeType) => {
  //     // eslint-disable-next-line no-param-reassign
  //     // element.originalBorder = element.vertices.border[0].slice();
  //     for (let i = 0; i < element.vertices.border[0].length; i += 1) {
  //       // eslint-disable-next-line no-param-reassign
  //       element.vertices.border[0][i].y *= 5;
  //     }
  //   };

  //   increaseBorderSize(end1);
  //   increaseBorderSize(end2);
  //   increaseBorderSize(mid);

  //   line.add('end1', end1);
  //   line.add('mid', mid);
  //   line.add('end2', end2);
  //   return line;
  // }


  addSelector() {
    addSelectorHTML(
      this.diagram,
      this,
      'selector',
      'lesson__related_angles_selector',
      this.selectorClicked.bind(this),
      'horizontal',
    );
    this._selector.setPosition(this.layout.selector.position);
  }

  makeUnitsSelector() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.09;
    font.setColor(this.layout.colors.diagram.disabled);
    const list = new SelectorList();
    list.add('deg', 'degrees');
    list.add('rad', 'radians');
    const selector = makeSelectorText(
      list,
      'deg',
      this.diagram,
      this.selectorClicked.bind(this),
      0,
      font,
      this.layout.colors.diagram.text.base,
      '/',
      0.1,
    );
    selector.setPosition(this.layout.units.position);
    return selector;
  }

  // makeAngle(name: 'a' | 'b' | 'c' | 'd') {
  //   const eqn = this.diagram.equation.makeEqn();
  //   eqn.createElements(
  //     {
  //       a: 'a',
  //       b: 'b',
  //       c: 'c',
  //       d: 'd',
  //       equals: ' = ',
  //       minus: ' \u2212 ',
  //       _180: '180º',
  //       pi: 'π',
  //     },
  //     this.layout.colors.diagram.text.base,
  //   );

  //   eqn.formAlignment.fixTo = new Point(0, 0);
  //   eqn.formAlignment.hAlign = 'center';
  //   eqn.formAlignment.vAlign = 'middle';
  //   eqn.formAlignment.scale = 0.7;

  //   eqn.setElem('a', this.layout.colors.angleA);
  //   eqn.setElem('b', this.layout.colors.angleB);
  //   eqn.setElem('c', this.layout.colors.angleA);
  //   eqn.setElem('d', this.layout.colors.angleB);

  //   eqn.addForm('a', ['a']);
  //   eqn.addForm('b', ['b']);
  //   eqn.addForm('c', ['c']);
  //   eqn.addForm('d', ['d']);

  //   eqn.showForm = (form: string) => {
  //     eqn.setCurrentForm(form);
  //     eqn.render();
  //   };
  //   eqn.showForm(name);

  //   const arcLayout = this.layout.angle.arc;

  //   const color = name === 'a' || name === 'c'
  //     ? this.layout.colors.angleA : this.layout.colors.angleB;
  //   const radius = name === 'a' || name === 'c'
  //     ? arcLayout.radius : arcLayout.radius * 0.9;
  //   const label = eqn.collection;
  //   const arc = this.diagram.shapes.polygon(
  //     arcLayout.sides, radius, arcLayout.width,
  //     0, 1, arcLayout.sides, color,
  //     new Transform(),
  //   );
  //   const angle = this.diagram.shapes.collection(new Transform()
  //     .scale(1, 1).rotate(0).translate(0, 0));
  //   angle.add('arc', arc);
  //   angle.add('label', label);
  //   angle.eqn = eqn;

  //   angle.updateAngle = (start: number, size: number) => {
  //     angle._arc.angleToDraw = size;
  //     angle.transform.updateRotation(start);
  //     angle._label.transform.updateRotation(-start);

  //     let labelWidth = 0;
  //     let labelHeight = 0;
  //     if (eqn.currentForm != null) {
  //       labelWidth = eqn.currentForm.width / 2;
  //       labelHeight = eqn.currentForm.height * 0.4;
  //     }
  //     const equationRotation = eqn.collection.transform.r();
  //     // const equation
  //     if (equationRotation != null) {
  //       const labelPosition = polarToRect(
  //         this.layout.angle.label.radius
  //         + Math.max(
  //           Math.abs(labelWidth * Math.cos(start + size / 2)),
  //           labelHeight,
  //         ),
  //         size / 2,
  //       );
  //       angle._label.setPosition(labelPosition);
  //     }
  //   };
  //   return angle;
  // }

  constructor(diagram: LessonDiagramType, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('unitsSelector', this.makeUnitsSelector());
    this.addSelector();
    // this.add('line1', this.makeMoveableLine());
    // this._line1.setPosition(this.layout.line1.parallel.position.x, 0);
    // this.add('line2', this.makeMoveableLine());
    // this._line2.setPosition(this.layout.line2.parallel.position.x, 0);
    // this.add('line3', this.makeMoveableLine());
    // this.add('angleA', this.makeAngle('a'));
    // this.add('angleB', this.makeAngle('b'));
    // this.add('angleC', this.makeAngle('c'));
    // this.add('angleD', this.makeAngle('d'));
    this.add('parallel', new ParallelCollection(diagram, this.layout));
    this.add('opposite', new OppositeCollection(diagram, this.layout));
    // this.isParallelHighlighting = true;
  }

  selectorClicked(title: string) {
    if (title === 'parallel') {
      this.diagram.lesson.goToSection('Parallel Lines');
    }
    if (title === 'opposite') {
      this.diagram.lesson.goToSection('Opposite Angles');
    }
  }

  // pulseParallel() {
  //   this._line1.pulseScaleNow(1, 3);
  //   this._line2.pulseScaleNow(1, 3);
  //   this.diagram.animateNextFrame();
  // }

  // rotateLine1ToParallel() {
  //   this._line1.stop();
  //   this._line2.stop();
  //   const r1 = this._line1.transform.r();
  //   const r2 = this._line2.transform.r();
  //   const velocity = this._line1.transform.constant(0);
  //   velocity.updateRotation(2 * Math.PI / 6);
  //   if (r1 != null && r2 != null) {
  //     this._line1.animateRotationTo(r2, 0, velocity, this.pulseParallel.bind(this));
  //   }
  //   this.diagram.animateNextFrame();
  // }

  // toggleOppositeAngles() {
  //   if (this._angleA.isShown) {
  //     this._angleB.eqn.showForm('b');
  //     this._angleD.eqn.showForm('b');
  //     this._angleB.show();
  //     this._angleB._arc.show();
  //     this._angleD.show();
  //     this._angleD._arc.show();
  //     this._angleA.hide();
  //     this._angleC.hide();
  //   } else {
  //     this._angleB.hide();
  //     this._angleD.hide();
  //     this._angleA.eqn.showForm('a');
  //     this._angleC.eqn.showForm('a');
  //     this._angleA.show();
  //     this._angleC.show();
  //     this._angleA._arc.show();
  //     this._angleC._arc.show();
  //   }
  //   this.diagram.animateNextFrame();
  // }

  // updateOppositeAngles() {
  //   if (this._line1 && this._line2 && this._angleA) {
  //     const r1 = this._line1.transform.r();
  //     const r2 = this._line2.transform.r();
  //     if (r1 != null && r2 != null) {
  //       if (this._angleA.isShown || this._angleB.isShown || this._angleC.isShown || this._angleD.isShown) {
  //         const minAngle = minAngleDiff(r2, r1);
  //         if (minAngle > 0) {
  //           this._angleA.updateAngle(r1, minAngle);
  //           this._angleB.updateAngle(r2, Math.PI - minAngle);
  //           this._angleC.updateAngle(r1 + Math.PI, minAngle);
  //           this._angleD.updateAngle(r2 + Math.PI, Math.PI - minAngle);
  //         } else {
  //           this._angleA.updateAngle(r1, Math.PI - Math.abs(minAngle));
  //           this._angleB.updateAngle(r2, Math.abs(minAngle));
  //           this._angleC.updateAngle(r1 + Math.PI, Math.PI - Math.abs(minAngle));
  //           this._angleD.updateAngle(r2 + Math.PI, Math.abs(minAngle));
  //         }
  //         this._angleA.setPosition(this._line1.transform.t() || new Point(0, 0));
  //         this._angleB.setPosition(this._line1.transform.t() || new Point(0, 0));
  //         this._angleC.setPosition(this._line1.transform.t() || new Point(0, 0));
  //         this._angleD.setPosition(this._line1.transform.t() || new Point(0, 0));
  //       }
  //     }
  //   }
  // }

  moveToPosition(
    element: MoveableLineType,
    angleType: 'parallel' | 'opposite',
    animationTime: ?number = null,
    callback: () => void,
  ) {
    element.stop();
    const target = element.transform.constant(0);
    target.updateTranslation(this.layout[element.name][angleType].position);
    target.updateRotation(this.layout[element.name][angleType].rotation);
    let time = 1;
    if (typeof animationTime !== 'number') {
      const velocity = element.transform.constant(0);
      velocity.updateTranslation(new Point(1 / 2, 1 / 2));
      velocity.updateRotation(2 * Math.PI / 6);
      time = getMaxTimeFromVelocity(element.transform._dup(), target, velocity, 0);
    } else {
      time = animationTime;
    }
    console.log(time)

    element.animateTo(target, time, 0, callback);
    return time;
  }
}

export default RelatedAnglesCollection;
