// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, Rect,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';

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

export function makeLine(
  diagram: Diagram,
  start: Point,
  length: number,
  width: number,
  color: Array<number>,
  arrow: ?{
    width: number,
    height: number,
    end1: boolean,
    end2: boolean,
  } = null,
) {
  const line = diagram.shapes.collection(new Transform()
    .scale(1, 1)
    .rotate(0)
    .translate(0, 0));

  // let lineLength = length;
  // if (arrow) {
  //   if (arrow.end1) {
  //     lineLength -= arrow.height;
  //   }
  //   if (arrow.end2) {
  //     lineLength -= arrow.height;
  //   }
  // }
  // const startToUse = start._dup();
  // let lengthToUse = length;
  // const start = new Point(0, 0);

  // let lengthToUse = 1;
  if (arrow) {
    if (arrow.end1) {
      const a = diagram.shapes.arrow(
        arrow.width, 0, arrow.height, 0,
        color, new Transform().translate(0, 0), new Point(0, 0), Math.PI / 2,
      );
      line.add('arrow1', a);
      // startToUse.x += arrow.height;
      // lengthToUse -= arrow.height;
    }
    if (arrow.end2) {
      const a = diagram.shapes.arrow(
        arrow.width, 0, arrow.height, 0,
        color, new Transform().translate(1, 0), new Point(0, 0), -Math.PI / 2,
      );
      line.add('arrow2', a);
      // lengthToUse -= arrow.height;
    }
  }

  const straightLine = diagram.shapes.horizontalLine(
    new Point(0, 0),
    1, width,
    0, color, new Transform().scale(1, 1).translate(0, 0),
  );
  // straightLine.setPosition(startToUse);
  line.add('line', straightLine);

  line.setLength = (newLength: number) => {
    // const scale = newLength / length;

    let straightLineLength = newLength;

    // const newStart = new Point(start.x * scale, start.y);
    // const newEnd = newStart.add(new Point(newLength, 0));
    // const straightLineStart = newStart._dup();
    let straightLineStart = 0;

    if (arrow) {
      if (arrow.end1) {
        straightLineLength -= arrow.height;
        // line._arrow1.setPosition(newStart);
        straightLineStart += arrow.height;
      }
      if (arrow.end2) {
        straightLineLength -= arrow.height;
        line._arrow2.setPosition(newLength, 0);
      }
    }
    // console.log(scale, straightLineLength, newStart, newEnd)
    straightLine.transform.updateScale(straightLineLength, 1);
    straightLine.setPosition(straightLineStart, 0);
  };

  line.setLength(1);

  return line;
}
