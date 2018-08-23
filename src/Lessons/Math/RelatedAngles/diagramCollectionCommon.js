// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point,
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


export function makeMoveableLine(
  diagram: Diagram,
  layout: Object,
): MoveableLineType {
  const { width } = layout.moveableLine;
  const { end, middle, full } = layout.moveableLine.length;

  const line = diagram.shapes.collection(new Transform()
    .rotate(0)
    .translate(0, 0));
  line.hasTouchableElements = true;
  line.isMovable = true;
  line.touchInBoundingRect = true;
  line.isTouchable = true;
  const bounds = layout.moveableLine.boundary;
  line.updateTransform = (t: Transform) => {
    const r = t.r();
    if (r != null) {
      const w = Math.abs(layout.moveableLine.length.full / 2 * Math.cos(r));
      const h = Math.abs(layout.moveableLine.length.full / 2 * Math.sin(r));
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
    0, layout.colors.line, new Transform(),
  );
  end1.isTouchable = true;
  end1.movementAllowed = 'rotation';

  const end2 = diagram.shapes.horizontalLine(
    new Point(middle / 2, 0),
    end, width,
    0, layout.colors.line, new Transform(),
  );
  end2.isTouchable = true;
  end2.movementAllowed = 'rotation';

  const mid = diagram.shapes.horizontalLine(
    new Point(-middle / 2, 0),
    middle, width,
    0, layout.colors.line, new Transform(),
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

  line.add('end1', end1);
  line.add('mid', mid);
  line.add('end2', end2);
  return line;
}

export function makeLabeledLine(
  diagram: Diagram,
  layout: Object,
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
  eqn.createElements({ label: labelText }, layout.colors.line);

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

    const a = labelWidth + layout.moveableLine.label.length;
    const b = labelHeight + layout.moveableLine.label.length;
    const r = a * b / Math.sqrt((b * Math.cos(newAngle)) ** 2 + (a * Math.sin(newAngle)) ** 2);
    line._label.setPosition(r, 0);
  };

  return line;
}
