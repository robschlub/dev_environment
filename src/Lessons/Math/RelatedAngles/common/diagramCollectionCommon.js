// @flow

import Diagram from '../../../../js/diagram/Diagram';
import {
  Transform, Point, Rect, minAngleDiff, normAngle, Line,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../../js/diagram/Element';
import { Equation } from '../../../../js/diagram/DiagramElements/Equation/GLEquation';
import makeAngleAnnotation from '../../../../LessonsCommon/tools/angleAnnotation';

type MoveableLinePrimativeType = {
  movementAllowed: 'rotation' | 'translation';
} & DiagramElementPrimative;

export type MoveableLineType = {
  _end1: MoveableLinePrimativeType;
  _end2: MoveableLinePrimativeType;
  _mid: MoveableLinePrimativeType;
  updateTransform: (Transform) => void;
  pulseWidth: () => void;
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
  line.isTouchable = true;
  const bounds = layout.boundary;

  line.updateTransform = (t: Transform) => {
    const r = t.r();
    if (r != null) {
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
  end1.move.type = 'rotation';
  end1.move.element = line;
  end1.isMovable = true;
  end1.move.canBeMovedAfterLoosingTouch = true;

  const end2 = diagram.shapes.horizontalLine(
    new Point(middle / 2, 0),
    end, width,
    0, color, new Transform(),
  );
  end2.isTouchable = true;
  end2.move.type = 'rotation';
  end2.move.element = line;
  end2.isMovable = true;
  end2.move.canBeMovedAfterLoosingTouch = true;

  const mid = diagram.shapes.horizontalLine(
    new Point(-middle / 2, 0),
    middle, width,
    0, color, new Transform(),
  );
  mid.isTouchable = true;
  mid.move.type = 'translation';
  mid.move.element = line;
  mid.isMovable = true;
  mid.move.canBeMovedAfterLoosingTouch = true;

  end1.pulse.transformMethod = s => new Transform().scale(1, s);
  end2.pulse.transformMethod = s => new Transform().scale(1, s);
  mid.pulse.transformMethod = s => new Transform().scale(1, s);

  const increaseBorderSize = (element: DiagramElementPrimative) => {
    for (let i = 0; i < element.vertices.border[0].length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      element.vertices.border[0][i].y *= 15;
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
  line._end1.move.type = 'rotation';
  line._end2.move.type = 'rotation';
  line._mid.move.type = 'rotation';

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

  const angle = makeAngleAnnotation(diagram, layout.angle, color, eqn);
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

export function makeAnglesClose(
  element1: DiagramElementCollection | DiagramElementPrimative,
  element2: DiagramElementCollection | DiagramElementPrimative,
) {
  const r1 = element1.transform.r();
  const r2 = element2.transform.r();
  if (r1 != null && r2 != null) {
    if (Math.abs(minAngleDiff(r2, r1)) > Math.PI / 2) {
      element2.transform.updateRotation(normAngle(r2 + Math.PI));
    }
  }
}

export function checkForParallel(
  element1: DiagramElementPrimative | DiagramElementCollection,
  element2: DiagramElementPrimative | DiagramElementCollection,
  makeRotationEqual: boolean = false,
  distanceThreshold: number,
  rotThreshold: number = Math.PI / 300,
) {
  // if (!this._line1 || !this._line2) {
  //   return;
  // }
  const angleSameThreshold = rotThreshold;
  // const distanceThreshold = this.layout.parallelLine.width * 1.1;
  const r1 = element1.transform.r();
  const r2 = element2.transform.r();
  const t1 = element1.transform.t();
  const t2 = element2.transform.t();
  if (r1 != null && r2 != null && t1 != null && t2 != null) {
    let isParallel = true;
    const lineRotationDifference = Math.min(
      Math.abs(minAngleDiff(r1, r2)),
      Math.abs(minAngleDiff(r1, r2 - Math.PI)),
    );
    if (lineRotationDifference > angleSameThreshold) {
      isParallel = false;
    }

    if (isParallel && makeRotationEqual) {
      if (!element2.state.isBeingMoved) {
        element1.transform.updateRotation(r2);
      } else if (!element1.state.isBeingMoved) {
        element2.transform.updateRotation(r1);
      }
    }

    if (isParallel) {
      const line2 = new Line(t2, t2.add(Math.cos(r2), Math.sin(r2)));
      const line2DistanceToLineCenter1 = line2.distanceToPoint(t1);
      if (line2DistanceToLineCenter1 < distanceThreshold) {
        isParallel = false;
      }
    }
    return isParallel;
  }
  return false;
}
