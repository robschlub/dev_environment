// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Rect, distance, Line, polarToRect,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeEquationLabel from './equationLabel';

export type MoveableLineType = {
  _end1: DiagramElementPrimative;
  _end2: DiagramElementPrimative;
  _mid: DiagramElementPrimative;
  updateTransform: (Transform) => void;
  pulseWidth: () => void;
} & DiagramElementCollection;

export type TypeLabeledLine = {
  _label: {
    _label: DiagramElementPrimative;
  } & DiagramElementCollection;
  eqn: Equation;
  updateLabel: (number) => void;
} & MoveableLineType;

export function makeMoveableLine(
  diagram: Diagram,
  layout: {
    length: {
      full: number,
      end: number,
      middle: number,
    },
    width: number,
    boundary: Rect,
  },
  color: Array<number>,
): MoveableLineType {
  const { width } = layout;
  const { end, middle, full } = layout.length;
  const line = diagram.shapes.collection(new Transform()
    .scale(1, 1)
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
  line.setTransform(new Transform().scale(1, 1).rotate(0).translate(0, 0));

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

  const multiplier = diagram.isTouchDevice ? 16 : 8;
  const increaseBorderSize = (element: DiagramElementPrimative) => {
    for (let i = 0; i < element.vertices.border[0].length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      element.vertices.border[0][i].y *= multiplier;
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

export type TypeLine = {
  _straightLine: DiagramElementPrimative;
  setLength: (number) => void;
  setEndPoints: (Point, Point, number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
} & DiagramElementCollection;

export type TypeArrow1 = {
  _arrow1: {
    height: number;
  } & DiagramElementPrimative
};

export type TypeArrow2 = {
  _arrow2: {
    height: number;
  } & DiagramElementPrimative
};

export type TypeArrows = TypeArrow2 & TypeArrow1;

export type TypeArrowsLayout = {
  width: number,
  height: number,
  end1: boolean,
  end2: boolean
};

export function makeLine(
  diagram: Diagram,
  reference: 'center' | 'end' = 'center',
  length: number,
  width: number,
  color: Array<number>,
) {
  const line = diagram.shapes.collection(new Transform()
    .scale(1, 1)
    .rotate(0)
    .translate(0, 0));

  let start = -0.5;
  if (reference === 'end') {
    start = 0;
  }
  const vertexSpaceLength = 1;

  const straightLine = diagram.shapes.horizontalLine(
    new Point(0, 0),
    vertexSpaceLength, width,
    0, color, new Transform().scale(1, 1).translate(0, 0),
  );
  line.add('line', straightLine);
  line.currentLength = 1;

  line.addArrows = (arrow: TypeArrowsLayout) => {
    if (arrow.end1) {
      const a = diagram.shapes.arrow(
        arrow.width, 0, arrow.height, 0,
        color, new Transform().translate(start, 0), new Point(0, 0), Math.PI / 2,
      );
      a.height = arrow.height;
      line.add('arrow1', a);
    }
    if (arrow.end2) {
      const a = diagram.shapes.arrow(
        arrow.width, 0, arrow.height, 0,
        color, new Transform().translate(start + vertexSpaceLength, 0),
        new Point(0, 0), -Math.PI / 2,
      );
      a.height = arrow.height;
      line.add('arrow2', a);
    }
  };

  line.addLabel = (labelText: string, offset: number) => {
    const eqn = makeEquationLabel(diagram, labelText, color);
    line.add('label', eqn.collection);
    line.labelEqn = eqn;
    line.hasLabel = true;
    line.labelOffset = offset;
    line.labelOrientation = 'horizontal, withLine'
    line.labelLocation = 'top, right, left, bottom'
  };

  line.setLength = (newLength: number) => {
    let straightLineLength = newLength;
    let straightLineStart = start * newLength;

    if (line._arrow1) {
      straightLineLength -= line._arrow1.height;
      straightLineStart += line._arrow1.height;
      line._arrow1.setPosition(start * newLength);
    }
    if (line._arrow2) {
      straightLineLength -= line._arrow2.height;
      line._arrow2.setPosition(start * newLength + newLength, 0);
    }
    straightLine.transform.updateScale(straightLineLength, 1);
    straightLine.setPosition(straightLineStart, 0);
    line.currentLength = newLength;
  };

  line.setEndPoints = (p: Point, q: Point, offset: number = 0) => {
    const newLength = distance(q, p);
    line.setLength(newLength);
    const pq = new Line(p, q);
    line.transform.updateRotation(pq.angle());
    const offsetdelta = polarToRect(offset, pq.angle() + Math.PI / 2);
    if (reference === 'center') {
      line.transform.updateTranslation(pq.midpoint().add(offsetdelta));
    } else {
      line.transform.updateTranslation(p.add(offsetdelta));
    }
    line.currentLength = newLength;
  };

  line.animateLengthTo = function animateToLength(
    toLength: number = 1,
    time: number = 1,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    line.stop();
    const initialLength = line.currentLength;
    const deltaLength = toLength - line.currentLength;
    const func = (percent) => {
      line.setLength(initialLength + deltaLength * percent);
    };
    const done = () => {
      if (finishOnCancel) {
        line.setLength(initialLength + deltaLength);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    line.animateCustomTo(func, time, 0, done);
  };

  line.grow = function grow(
    fromLength: number = 0,
    time: number = 1,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    line.stop();
    const target = line.currentLength;
    line.setLength(fromLength);
    line.animateLengthTo(target, time, finishOnCancel, callback);
  };

  line.setLength(length);

  return line;
}
