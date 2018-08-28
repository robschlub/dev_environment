// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, polarToRect, Rect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';

type MoveableLinePrimativeType = {
  movementAllowed: 'rotation' | 'translation';
} & DiagramElementPrimative;

export type MoveableLineType = {
  _end1: MoveableLinePrimativeType;
  _end2: MoveableLinePrimativeType;
  _mid: MoveableLinePrimativeType;
  updateTransform: (Transform) => void;
} & DiagramElementCollection;

export type TypeLabeledLine = {
  _label: DiagramElementCollection;
  eqn: Equation;
  updateLabel: (number) => void;
} & MoveableLineType;

export type TypeAngle = {
  _label: DiagramElementCollection;
  _arc: DiagramElementPrimative;
  eqn: Equation;
  updateAngle: (number, number, ?number) => void;
} & DiagramElementCollection;

export function makeMoveableLine(
  diagram: Diagram,
  layout: {
    length: {
      full: number,
      end: number,
      middle: number,
    },
    label: {
      length: number,
    },
    width: number,
    boundary: Rect,
  },
  color: Array<number>,
): MoveableLineType {
  const { width } = layout;
  const { end, middle, full } = layout.length;

  const line = diagram.shapes.collection(new Transform()
    .rotate(0)
    .translate(0, 0));
  line.hasTouchableElements = true;
  line.isMovable = true;
  // line.touchInBoundingRect = true;
  line.isTouchable = true;
  const bounds = layout.boundary;

  line.updateTransform = (t: Transform) => {
    const r = t.r();
    if (r != null && line._end1.movementAllowed === 'rotation') {
      const w = Math.abs(layout.length.full / 2 * Math.cos(r));
      const h = Math.abs(layout.length.full / 2 * Math.sin(r));
      line.move.maxTransform.updateTranslation(
        bounds.right - w,
        bounds.top - h,
      );
      line.move.minTransform.updateTranslation(
        bounds.left + w,
        bounds.bottom + h,
      );
      if (r > 2 * Math.PI) {
        line.transform.updateRotation(r - 2 * Math.PI);
      }
      if (r < 0) {
        line.transform.updateRotation(r + 2 * Math.PI);
      }
    }
  };
  line.setTransform(new Transform().rotate(0).translate(0, 0));

  const end1 = diagram.shapes.horizontalLine(
    new Point(-full / 2, 0),
    end, width,
    0, color, new Transform(),
  );
  end1.isTouchable = true;
  end1.movementAllowed = 'rotation';

  const end2 = diagram.shapes.horizontalLine(
    new Point(middle / 2, 0),
    end, width,
    0, color, new Transform(),
  );
  end2.isTouchable = true;
  end2.movementAllowed = 'rotation';

  const mid = diagram.shapes.horizontalLine(
    new Point(-middle / 2, 0),
    middle, width,
    0, color, new Transform(),
  );
  mid.isTouchable = true;
  mid.movementAllowed = 'translation';

  end1.pulse.transformMethod = s => new Transform().scale(1, s);
  end2.pulse.transformMethod = s => new Transform().scale(1, s);
  mid.pulse.transformMethod = s => new Transform().scale(1, s);

  const increaseBorderSize = (element: DiagramElementPrimative) => {
    for (let i = 0; i < element.vertices.border[0].length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      element.vertices.border[0][i].y *= 5;
    }
  };

  increaseBorderSize(end1);
  increaseBorderSize(end2);
  increaseBorderSize(mid);

  line.pulseWidth = () => {
    end1.pulseScaleNow(1, 3);
    end2.pulseScaleNow(1, 3);
    mid.pulseScaleNow(1, 3);
  };

  line.add('end1', end1);
  line.add('mid', mid);
  line.add('end2', end2);
  return line;
}

export function makeLabeledLine(
  diagram: Diagram,
  layout: {
    length: {
      full: number,
      end: number,
      middle: number,
    },
    label: {
      length: number,
    },
    width: number,
    boundary: Rect,
  },
  color: Array<number>,
  labelText: string,
) {
  // $FlowFixMe
  const line: labeledLineType = makeMoveableLine(diagram, layout);
  line.setTransformCallback = (t: Transform) => {
    line.updateTransform(t);
  };
  line._end1.movementAllowed = 'rotation';
  line._end2.movementAllowed = 'rotation';
  line._mid.movementAllowed = 'rotation';

  const eqn = diagram.equation.makeEqn();
  eqn.createElements({ label: labelText }, color);

  eqn.formAlignment.fixTo = new Point(0, 0);
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 0.6;

  eqn.addForm('base', ['label']);
  eqn.setCurrentForm('base');

  line.eqn = eqn;
  line.add('label', eqn.collection);

  line.updateLabel = (newAngle: number) => {
    line._label.transform.updateRotation(-newAngle);
    let labelWidth = 0;
    let labelHeight = 0;
    if (eqn.currentForm != null) {
      labelWidth = eqn.currentForm.width / 2 + 0.04;
      labelHeight = eqn.currentForm.height / 2 + 0.04;
    }

    const a = labelWidth + layout.label.length;
    const b = labelHeight + layout.label.length;
    const r = a * b / Math.sqrt((b * Math.cos(newAngle)) ** 2 + (a * Math.sin(newAngle)) ** 2);
    line._label.setPosition(r, 0);
  };

  return line;
}

export function makeLabeledAngle(
  diagram: Diagram,
  layout: Object,
  radius: number,
  color: Array<number>,
) {
  const eqn = diagram.equation.makeEqn();
  eqn.createElements(
    {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      equals: ' = ',
      minus: ' \u2212 ',
      _180: '180º',
      pi: 'π',
    },
    layout.colors.diagram.text.base,
  );

  eqn.formAlignment.fixTo = new Point(0, 0);
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 0.7;

  eqn.setElem('a', layout.colors.angleA);
  eqn.setElem('b', layout.colors.angleB);
  eqn.setElem('c', layout.colors.angleC);
  eqn.setElem('d', layout.colors.angleD);

  eqn.addForm('a', ['a']);
  eqn.addForm('b', ['b']);
  eqn.addForm('c', ['c']);
  eqn.addForm('d', ['d']);

  const arcLayout = layout.angle.arc;

  const label = eqn.collection;
  const arc = diagram.shapes.polygon(
    arcLayout.sides, radius, arcLayout.width,
    0, 1, arcLayout.sides, color,
    new Transform(),
  );
  const angle = diagram.shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(0, 0));
  angle.add('arc', arc);
  angle.add('label', label);
  angle.eqn = eqn;

  angle.updateAngle = (start: number, size: number, labelRotationOffset: number = 0) => {
    angle._arc.angleToDraw = size;
    angle.transform.updateRotation(start);
    angle._label.transform.updateRotation(-start - labelRotationOffset);
    let labelWidth = 0;
    let labelHeight = 0;
    if (eqn.currentForm != null) {
      labelWidth = eqn.currentForm.width / 2 + 0.04;
      labelHeight = eqn.currentForm.height / 2 + 0.04;
    }
    const a = labelWidth + layout.angle.label.radius;
    const b = labelHeight + layout.angle.label.radius;
    const r = a * b / Math.sqrt((b * Math.cos(start + size / 2 + labelRotationOffset)) ** 2
      + (a * Math.sin(start + size / 2 + labelRotationOffset)) ** 2);
    const labelPosition = polarToRect(r, size / 2);
    angle._label.setPosition(labelPosition);
    // if (eqn.currentForm != null) { console.log(eqn.currentForm.name); }
  };

  eqn.showForm = (form: string) => {
    Object.getPrototypeOf(eqn).showForm.call(eqn, form);
    const start = angle.transform.r();
    const size = angle._arc.angleToDraw;
    if (start != null) {
      angle.updateAngle(start, size);
    }
  };
  return angle;
}

export type TypeSupplementaryAngle = {
  scaleAndDisolve: () => {};
} & DiagramElementPrimative;

export function makeSupplementaryAngle(
  diagram: Diagram,
  layout: Object,
) {
  const arcLayout = layout.angle.arc;
  const arc = diagram.shapes.polygon(
    arcLayout.sides, arcLayout.radius, arcLayout.width * 2,
    0, 1, arcLayout.sides / 2, layout.colors.supplementary,
    new Transform().rotate(0).translate(0, 0),
  );

  arc.scaleAndDisolve = () => {
    arc.stop();
    arc.stop();
    arc.show();
    arc.pulseScaleNow(2, 1.2, 0.25,
      () => {
        arc.disolveOut(2);
      });
  };
  // arc.setPosition(layout.line1.opposite.position);
  return arc;
}
