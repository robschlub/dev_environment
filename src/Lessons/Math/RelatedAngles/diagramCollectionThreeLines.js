// @flow
import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import { makeLabeledLine, makeLabeledAngle } from './diagramCollectionCommon';
import type { TypeLabeledLine, TypeAngle, TypeSupplementaryAngle } from './diagramCollectionCommon';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

type TypeIndexAngle = {
  lineIndex: number;
  angleIndex: number;
} & TypeAngle;

export default class ThreeLinesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: TypeLabeledLine;
  _line2: TypeLabeledLine;
  _line3: TypeLabeledLine;
  _angleA1: TypeIndexAngle;
  _angleB1: TypeIndexAngle;
  _angleC1: TypeIndexAngle;
  _angleD1: TypeIndexAngle;
  _angleA2: TypeIndexAngle;
  _angleB2: TypeIndexAngle;
  _angleC2: TypeIndexAngle;
  _angleD2: TypeIndexAngle;
  _supplementary: TypeSupplementaryAngle;

  _equation1: {
    eqn: Equation;
  } & DiagramElementCollection;

  _equation2: {
    eqn: Equation;
  } & DiagramElementCollection;

  makeParallelLine(labelText: string) {
    const line = makeLabeledLine(
      this.diagram,
      this.layout.parallelLine,
      this.layout.colors.line,
      labelText,
    );
    line.isMovable = false;
    return line;
  }

  makeIntersectingLine(labelText: string) {
    const line = makeLabeledLine(
      this.diagram,
      this.layout.intersectingLine,
      this.layout.colors.line,
      labelText,
    );
    return line;
  }

  makeAngle(
    name: 'a' | 'b' | 'c' | 'd',
    lineIndex: number,
    angleIndex: number,
  ) {
    const color = this.layout.colors[`angle${name.toUpperCase()}`];
    const arcLayout = this.layout.angle.arc;
    const radius = name === 'a' || name === 'c'
      ? arcLayout.radius : arcLayout.radius * 1.0;
    const angle = makeLabeledAngle(this.diagram, this.layout, radius, color);

    angle.eqn.addForm('b_equals', ['_180', 'minus', 'a'], 'deg');
    angle.eqn.addForm('b_equals', ['pi', 'minus', 'a'], 'rad');
    angle.eqn.addForm('a_equals', ['_180', 'minus', 'b'], 'deg');
    angle.eqn.addForm('a_equals', ['pi', 'minus', 'b'], 'rad');
    angle.eqn.showForm(name);

    angle.lineIndex = lineIndex;
    angle.angleIndex = angleIndex;
    return angle;
  }

  addThreeLines() {
    const line1 = this.makeParallelLine('1');
    const line2 = this.makeParallelLine('2');
    const line3 = this.makeIntersectingLine('3');
    this.add('line2', line2);
    this.add('line1', line1);
    this.add('line3', line3);
    line1.setPosition(this.layout.line3.corresponding.position);
    line2.setPosition(this.layout.line3.corresponding.position);
    line3.setPosition(this.layout.line3.corresponding.position);
    line3.transform.updateRotation(Math.PI / 2);
    line3.move.maxTransform.updateRotation(Math.PI - Math.PI / 3.7);
    line3.move.minTransform.updateRotation(Math.PI / 3.7);
    line3.setColor(this.layout.colors.intersectingLine);

    line1._end1.move.element = this;
    line1._end2.move.element = this;
    line1._mid.move.element = this;
    line2._end1.move.element = this;
    line2._end2.move.element = this;
    line2._mid.move.element = this;
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform().rotate(0).translate(0, 0),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.position);
    this.addThreeLines();
    this.add('angleA2', this.makeAngle('a', 2, 0));
    this.add('angleB2', this.makeAngle('b', 2, 1));
    this.add('angleC2', this.makeAngle('c', 2, 2));
    this.add('angleD2', this.makeAngle('d', 2, 3));
    this.add('angleA1', this.makeAngle('a', 1, 0));
    this.add('angleB1', this.makeAngle('b', 1, 1));
    this.add('angleC1', this.makeAngle('c', 1, 2));
    this.add('angleD1', this.makeAngle('d', 1, 3));

    this._line3.setTransformCallback = (t: Transform) => {
      this._line3.updateTransform(t);
      this.updateIntersectingLineAngle();
      this.updateParallelLineTranlsation();
    };
    this._line1.setTransformCallback = (t: Transform) => {
      this._line3.updateTransform(t);
      this.updateParallelLineTranlsation();
      this.updateIntersectingLineAngle();
    };
    this.hasTouchableElements = true;
    this.setTransformCallback = this.updateIntersectingLineAngle.bind(this);
  }

  updateAngle(angle: TypeIndexAngle, intersect: Point, r: number) {
    const threeLinesRotation = this.transform.r();
    if (threeLinesRotation != null) {
      angle.setPosition(intersect);
      if (angle.angleIndex === 0) {
        angle.updateAngle(0, r, threeLinesRotation);
      } else if (angle.angleIndex === 1) {
        angle.updateAngle(r, Math.PI - r, threeLinesRotation);
      } else if (angle.angleIndex === 2) {
        angle.updateAngle(Math.PI, r, threeLinesRotation);
      } else if (angle.angleIndex === 3) {
        angle.updateAngle(r + Math.PI, Math.PI - r, threeLinesRotation);
      }
    }
  }

  updateParallelLineTranlsation() {
    if (this._line1.isMovable) {
      const t1 = this._line1.transform.t();
      const t2 = this._line2.transform.t();
      const r = this._line3.transform.r();
      if (t1 != null && r != null && t2 != null) {
        this._line1.transform.updateTranslation(
          t1.y / Math.tan(r),
          t1.y,
        );
        this._line2.transform.updateTranslation(
          t2.y / Math.tan(r),
          t2.y,
        );
      }
      this.diagram.animateNextFrame();
    }
  }

  moveLine2ToLine1() {
    this._line2.setPositionToElement(this._line1);
    this._angleA2.setPositionToElement(this._angleA1);
    this._angleB2.setPositionToElement(this._angleB1);
    this._angleC2.setPositionToElement(this._angleC1);
    this._angleD2.setPositionToElement(this._angleD1);
    this.diagram.animateNextFrame();
  }

  updateIntersectingLineAngle() {
    const r = this._line3.transform.r();
    const t1 = this._line1.transform.t();
    const t2 = this._line2.transform.t();
    const t3 = this._line3.transform.t();
    if (r != null && t1 != null && t2 != null && t3 != null) {
      const intersectT1 = new Point(
        (t1.y - t3.y) / Math.tan(r) + t3.x,
        (t1.y - t3.y),
      );
      const intersectT2 = new Point(
        (t2.y - t3.y) / Math.tan(r) + t3.x,
        (t2.y - t3.y),
      );
      this.updateAngle(this._angleA1, intersectT1, r);
      this.updateAngle(this._angleA2, intersectT2, r);
      this.updateAngle(this._angleB1, intersectT1, r);
      this.updateAngle(this._angleB2, intersectT2, r);
      this.updateAngle(this._angleC1, intersectT1, r);
      this.updateAngle(this._angleC2, intersectT2, r);
      this.updateAngle(this._angleD1, intersectT1, r);
      this.updateAngle(this._angleD2, intersectT2, r);
    }
  }

  pulseLine(index: number = 1) {
    this.elements[`line${index}`].pulseWidth();
    this.diagram.animateNextFrame();
  }

  pulseParallel() {
    this.pulseLine(1);
    this.pulseLine(2);
  }

  translateLine1() {
    this.moveLine2ToLine1();
    let y = Math.max(Math.random(), 0.5);
    const t = this._line1.transform.t();
    if (t != null) {
      if (t.y >= 0) {
        y *= -1;
      }
      const position = new Point(
        this.layout.line1.corresponding.position.x,
        y + t.y,
      );
      this._line1.stop();
      this._line1.animateTranslationTo(position, 1);
      this.diagram.animateNextFrame();
    }
  }

  toggleCorrespondingAngles(make2Disabled: boolean = false) {
    let disable2 = make2Disabled;
    if (typeof disable2 !== 'boolean') {
      disable2 = false;
    }
    if (this._angleA1.isShown) {
      if (disable2) {
        this.showOnlyAngles(['B1'], this.layout.colors.angleA, ['B2']);
      } else {
        this.showOnlyAngles(['B1', 'B2']);
      }
    } else if (this._angleB1.isShown) {
      if (disable2) {
        this.showOnlyAngles(['C1'], this.layout.colors.angleA, ['C2']);
      } else {
        this.showOnlyAngles(['C1', 'C2']);
      }
    } else if (this._angleC1.isShown) {
      if (disable2) {
        this.showOnlyAngles(['D1'], this.layout.colors.angleA, ['D2']);
      } else {
        this.showOnlyAngles(['D1', 'D2']);
      }
    } else if (disable2) {
      this.showOnlyAngles(['A1'], this.layout.colors.angleA, ['A2']);
    } else {
      this.showOnlyAngles(['A1', 'A2']);
    }
    this.diagram.animateNextFrame();
  }

  toggleAlternateAngles() {
    if (this._angleA1.isShown) {
      this.showOnlyAngles(['B1', 'D2']);
    } else if (this._angleB1.isShown) {
      this.showOnlyAngles(['C1', 'A2']);
    } else if (this._angleC1.isShown) {
      this.showOnlyAngles(['D1', 'B2']);
    } else {
      this.showOnlyAngles(['A1', 'C2']);
    }
    this.diagram.animateNextFrame();
  }

  setUnits(units: 'deg' | 'rad') {
    this._angleA2.eqn.setUnits(units);
    this._angleB2.eqn.setUnits(units);
  }

  toggleInteriorAngles() {
    if (this._angleC1.isShown) {
      this.showOnlyAngles(['D1', 'A2']);
      this._angleA2.eqn.showForm('a_equals');
    } else {
      this.showOnlyAngles(['C1', 'B2']);
      this._angleB2.eqn.showForm('b_equals');
    }
    this.diagram.animateNextFrame();
  }

  showOnlyAngles(
    anglesToShow: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D1' | 'D2'>,
    color: Array<number> = this.layout.colors.angleA.slice(),
    anglesToShowDisabled: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D1' | 'D2'> = [],
  ) {
    const allAngles = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    const anglesToHide = allAngles.filter(angleString => anglesToShow.indexOf(angleString) === -1
      && anglesToShowDisabled.indexOf(angleString) === -1);
    const showAngle = (angleString: string, col: Array<number>, pulse: boolean = false) => {
      // $FlowFixMe
      const angle = this[`_angle${angleString}`];
      angle.show();
      angle._arc.show();
      let angleLabel = angleString[0].toLowerCase();
      if (angleLabel === 'c') {
        angleLabel = 'a';
      }
      if (angleLabel === 'd') {
        angleLabel = 'b';
      }
      angle.eqn.showForm(angleLabel);
      angle.setColor(col);
      if (pulse) {
        angle.pulseScaleNow(1, 1.2);
      }
    };
    anglesToShow.forEach((angleString) => {
      showAngle(angleString, color, true);
    });
    anglesToShowDisabled.forEach((angleString) => {
      showAngle(angleString, this.layout.colors.disabled);
    });
    anglesToHide.forEach((angleString) => {
      // $FlowFixMe
      const angle = this[`_angle${angleString}`];
      angle.hide();
    });
  }

  showCorrespondingAnglesInterior() {
    if (this._angleC1.isShown) {
      this.showOnlyAngles(['C1', 'C2'], this.layout.colors.angleB);
    } else {
      this.showOnlyAngles(['D1', 'D2'], this.layout.colors.angleB);
    }
    this.diagram.animateNextFrame();
  }

  showCorrespondingAngles() {
    if (this._angleA1.isShown) {
      this.showOnlyAngles(['A1', 'A2'], this.layout.colors.angleB);
    }
    if (this._angleB1.isShown) {
      this.showOnlyAngles(['B1', 'B2'], this.layout.colors.angleB);
    }
    if (this._angleC1.isShown) {
      this.showOnlyAngles(['C1', 'C2'], this.layout.colors.angleB);
    }
    if (this._angleD1.isShown) {
      this.showOnlyAngles(['D1', 'D2'], this.layout.colors.angleB);
    }
    this.diagram.animateNextFrame();
  }

  showOppositeAngles() {
    if (this._angleA1.isShown) {
      this.showOnlyAngles(['A2', 'C2'], this.layout.colors.angleC, ['A1']);
    }
    if (this._angleB1.isShown) {
      this.showOnlyAngles(['B2', 'D2'], this.layout.colors.angleC, ['B1']);
    }
    if (this._angleC1.isShown) {
      this.showOnlyAngles(['C2', 'A2'], this.layout.colors.angleC, ['C1']);
    }
    if (this._angleD1.isShown) {
      this.showOnlyAngles(['D2', 'B2'], this.layout.colors.angleC, ['D1']);
    }
    this.diagram.animateNextFrame();
  }

  showSupplementary() {
    const r = this._line3.transform.r();
    if (r != null) {
      if (this._angleC1.isShown) {
        this.showOnlyAngles(['B2', 'C2'], this.layout.colors.angleC, ['C1']);
        this._angleB2.eqn.showForm('b_equals');
      } else {
        this.showOnlyAngles(['A2', 'D2'], this.layout.colors.angleC, ['D1']);
        this._angleA2.eqn.showForm('a_equals');
      }
    }
    this.diagram.animateNextFrame();
  }

  showAlternateAngles() {
    const disabledColor = JSON.stringify(this.layout.colors.disabled);
    const isDisabled = (element: TypeAngle) => JSON.stringify(element._arc.color) === disabledColor;
    if (this._angleA1.isShown) {
      if (isDisabled(this._angleA1) || isDisabled(this._angleC2)) {
        this.showOnlyAngles(['A1', 'C2'], this.layout.colors.angleA, ['A2']);
      } else {
        this.toggleAlternateAngles();
        return;
      }
    }
    if (this._angleB1.isShown) {
      if (isDisabled(this._angleB1) || isDisabled(this._angleD2)) {
        this.showOnlyAngles(['B1', 'D2'], this.layout.colors.angleA, ['B2']);
      } else {
        this.toggleAlternateAngles();
        return;
      }
    }
    if (this._angleC1.isShown) {
      if (isDisabled(this._angleC1) || isDisabled(this._angleA2)) {
        this.showOnlyAngles(['C1', 'A2'], this.layout.colors.angleA, ['C2']);
      } else {
        this.toggleAlternateAngles();
        return;
      }
    }
    if (this._angleD1.isShown) {
      if (isDisabled(this._angleD1) || isDisabled(this._angleB2)) {
        this.showOnlyAngles(['D1', 'B2'], this.layout.colors.angleA, ['D2']);
      } else {
        this.toggleAlternateAngles();
        return;
      }
    }
    this.diagram.animateNextFrame();
  }

  showInteriorAngles() {
    const disabledColor = JSON.stringify(this.layout.colors.disabled);
    const correspondingColor = JSON.stringify(this.layout.colors.angleB);
    const isDisabled =
      (element: TypeAngle) => JSON.stringify(element._arc.color) === disabledColor;
    const isCorresponding =
      (element: TypeAngle) => JSON.stringify(element._arc.color) === correspondingColor;
    if (this._angleC1.isShown) {
      if (isDisabled(this._angleC1)
        || isDisabled(this._angleB2)
        || isCorresponding(this._angleC1)) {
        this.showOnlyAngles(['C1', 'B2'], this.layout.colors.angleA, ['C2']);
        this._angleB2.eqn.showForm('b_equals');
      } else {
        this.toggleInteriorAngles();
        return;
      }
    } else if (isDisabled(this._angleD1)
        || isDisabled(this._angleA2)
        || isCorresponding(this._angleD1)) {
      this.showOnlyAngles(['D1', 'A2'], this.layout.colors.angleA, ['D2']);
      this._angleA2.eqn.showForm('a_equals');
    } else {
      this.toggleInteriorAngles();
      return;
    }
    this.diagram.animateNextFrame();
  }
}
