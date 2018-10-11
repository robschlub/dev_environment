// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, Rect, distance, Line, polarToRect, normAngle,
} from '../../../js/diagram/tools/g2';
import {
  roundNum,
} from '../../../js/diagram/tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';
import makeEquationLabel from './equationLabel';
import type { TypeEquationLabel } from './equationLabel';

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
  // line.isTouchable = true;
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


// top - text is on top of line (except when line is vertical)
// bottom - text is on bottom of line (except when line is vertical)
// left - text is to left of line (except when line is horiztonal)
// right - text is to right of line (except when line is horiztonal)
// end1 - text is on first end of line
// end2 - text is on second end of line
// outside - text is on left of line when line is vertical from 0 to 1
//           or, if a polygon is defined clockwise, outside will be outside.
// inside - text is on right of line when line is vertical from 0 to 1
//           or, if a polygon is defined anti-clockwise, outside will be outside.
export type TypeLineLabelLocation = 'top' | 'left' | 'bottom' | 'right'
                                    | 'end1' | 'end2' | 'outside' | 'inside';
// top - text is on top of line if line is horiztonal
// bottom - text is on bottom of line if line is horiztonal
// left - text is to left of line if line is vertical
// right - text is to right of line if line is vertical
export type TypeLineLabelSubLocation = 'top' | 'left' | 'bottom' | 'right';
// horizontal - text is always horizontal;
// baseToLine - text angle is same as line, with baseline toward line
// baseToLine - text angle is same as line, with baseline away from line
// baseToLine - text angle is same as line, with text upright
export type TypeLineLabelOrientation = 'horizontal' | 'baseToLine' | 'baseAway'
                                      | 'baseUpright';

export type TypeLine = {
  _straightLine: DiagramElementPrimative;
  currentLength: number;
  setLength: (number) => void;
  setEndPoints: (Point, Point, number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
  reference: 'center' | 'end';
  showRealLength: boolean;
  label: null | {
    offset: number;
    location: TypeLineLabelLocation;
    subLocation: TypeLineLabelSubLocation;
    orientation: TypeLineLabelOrientation;
    linePosition: number;
  } & TypeEquationLabel;
  _label: DiagramElementCollection;
  arrow1: null | {
    height: number;
  };
  arrow2: null | {
    height: number;
  };
  setMovable: (?boolean) => void;

  addArrow1: (number, number) => void;
  addArrow2: (number, number) => void;
  addLabel: (string, number, TypeLineLabelLocation,
             TypeLineLabelSubLocation, TypeLineLabelOrientation, number
            ) => void;
  setEndPoints: (Point, Point, number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
  pulseWidth: () => void;

} & DiagramElementCollection;

export function makeLine(
  diagram: Diagram,
  reference: 'center' | 'end' = 'center',
  length: number,
  width: number,
  color: Array<number>,
  showLine: boolean = true,
  largerTouchBorder: boolean = true,
) {
  const line = diagram.shapes.collection(new Transform()
    .scale(1, 1)
    .rotate(0)
    .translate(0, 0));

  let start = -0.5;
  line.reference = reference;
  if (reference === 'end') {
    start = 0;
  }
  const vertexSpaceLength = 1;

  let straightLine = null;
  if (showLine) {
    straightLine = diagram.shapes.horizontalLine(
      new Point(0, 0),
      vertexSpaceLength, width,
      0, color, new Transform().scale(1, 1).translate(0, 0),
    );
    if (largerTouchBorder) {
      const multiplier = diagram.isTouchDevice ? 16 : 8;
      const increaseBorderSize = (element: DiagramElementPrimative) => {
        for (let i = 0; i < element.vertices.border[0].length; i += 1) {
          // eslint-disable-next-line no-param-reassign
          element.vertices.border[0][i].y *= multiplier;
        }
      };
      increaseBorderSize(straightLine);
    }
    line.add('line', straightLine);
  }
  line.currentLength = 1;
  line.label = null;
  line.arrow1 = null;
  line.arrow2 = null;
  line._label = diagram.shapes.collection(new Transform());
  line.showRealLength = false;

  line.addArrow1 = (arrowHeight: number, arrowWidth: number) => {
    const a = diagram.shapes.arrow(
      arrowWidth, 0, arrowHeight, 0,
      color, new Transform().translate(start, 0), new Point(0, 0), Math.PI / 2,
    );
    line.arrow1 = { height: arrowHeight };
    line.add('arrow1', a);
    line.setLength(line.currentLength);
  };

  line.addArrow2 = (arrowHeight: number, arrowWidth: number) => {
    const a = diagram.shapes.arrow(
      arrowWidth, 0, arrowHeight, 0,
      color, new Transform().translate(start + vertexSpaceLength, 0),
      new Point(0, 0), -Math.PI / 2,
    );
    line.arrow2 = { height: arrowHeight };
    line.add('arrow2', a);
    line.setLength(line.currentLength);
  };

  line.setMovable = (movable: boolean = true) => {
    if (movable) {
      line.isTouchable = true;
      line.isMovable = true;
      line.hasTouchableElements = true;
      if (straightLine != null) {
        straightLine.isTouchable = true;
        // const multiplier = diagram.isTouchDevice ? 16 : 8;
        // const increaseBorderSize = (element: DiagramElementPrimative) => {
        //   for (let i = 0; i < element.vertices.border[0].length; i += 1) {
        //     // eslint-disable-next-line no-param-reassign
        //     element.vertices.border[0][i].y *= multiplier;
        //   }
        // };
        // increaseBorderSize(straightLine);
      }
    } else {
      line.isMovable = false;
    }
  };

  line.addLabel = function addLabel(
    labelText: string,
    offset: number,
    location: TypeLineLabelLocation,
    subLocation: TypeLineLabelSubLocation,
    orientation: TypeLineLabelOrientation,
    linePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    const eqnLabel = makeEquationLabel(diagram, labelText, color);
    line.add('label', eqnLabel.eqn.collection);
    line.label = Object.assign({}, eqnLabel, {
      offset,
      location,
      subLocation,
      orientation,
      linePosition,
    });
    line.updateLabel();
  };

  line.updateLabel = (parentRotationOffset: number = 0) => {
    if (line.label == null) {
      return;
    }
    const lineAngle = normAngle(line.transform.r() || 0);
    let labelAngle = 0;
    if (line.showRealLength) {
      line._label._base.vertices.setText(roundNum(line.currentLength, 2).toString());
      line.label.eqn.reArrangeCurrentForm();
    }
    const labelPosition = new Point(
      start * line.currentLength + line.label.linePosition * line.currentLength,
      0,
    );
    let labelOffsetAngle = Math.PI / 2;
    const labelOffsetMag = line.label.offset;
    if (line.label.location === 'end1' || line.label.location === 'end2') {
      if (line.label.location === 'end1') {
        labelPosition.x = start * line.currentLength - line.label.offset;
        labelOffsetAngle = -Math.PI;
      }
      if (line.label.location === 'end2') {
        labelPosition.x = start * line.currentLength + line.currentLength + line.label.offset;
        labelOffsetAngle = 0;
      }
    } else {
      const offsetTop = Math.cos(lineAngle) < 0 ? -Math.PI / 2 : Math.PI / 2;
      const offsetBottom = -offsetTop;
      const offsetLeft = Math.sin(lineAngle) > 0 ? Math.PI / 2 : -Math.PI / 2;
      const offsetRight = -offsetLeft;

      if (line.label.location === 'top') {
        labelOffsetAngle = offsetTop;
      }
      if (line.label.location === 'bottom') {
        labelOffsetAngle = offsetBottom;
      }
      if (line.label.location === 'right') {
        labelOffsetAngle = offsetRight;
      }
      if (line.label.location === 'left') {
        labelOffsetAngle = offsetLeft;
      }
      if (roundNum(Math.sin(lineAngle), 4) === 0
        && (line.label.location === 'left' || line.label.location === 'right')
      ) {
        if (line.label.subLocation === 'top') {
          labelOffsetAngle = offsetTop;
        }
        if (line.label.subLocation === 'bottom') {
          labelOffsetAngle = offsetBottom;
        }
      }
      if (roundNum(Math.cos(lineAngle), 4) === 0
        && (line.label.location === 'top' || line.label.location === 'bottom')
      ) {
        if (line.label.subLocation === 'right') {
          labelOffsetAngle = offsetRight;
        }
        if (line.label.subLocation === 'left') {
          labelOffsetAngle = offsetLeft;
        }
      }
      if (line.label.location === 'inside') {
        labelOffsetAngle = -Math.PI / 2;
      }
      if (line.label.location === 'outside') {
        labelOffsetAngle = Math.PI / 2;
      }
    }

    if (line.label.orientation === 'horizontal') {
      labelAngle = -lineAngle;
    }
    if (line.label.orientation === 'baseToLine') {
      if (labelPosition.y < 0) {
        labelAngle = Math.PI;
      }
    }
    if (line.label.orientation === 'baseAway') {
      if (labelPosition.y > 0) {
        labelAngle = Math.PI;
      }
    }
    if (line.label.orientation === 'baseUpright') {
      if (Math.cos(lineAngle) < 0) {
        labelAngle = Math.PI;
      }
    }

    line.label.updateRotation(
      labelAngle - parentRotationOffset,
      labelPosition, labelOffsetMag, labelOffsetAngle,
    );
  };

  line.setLength = (newLength: number) => {
    let straightLineLength = newLength;
    let straightLineStart = start * newLength;

    if (line.arrow1) {
      straightLineLength -= line.arrow1.height;
      straightLineStart += line.arrow1.height;
      line._arrow1.setPosition(start * newLength);
    }
    if (line.arrow2) {
      straightLineLength -= line.arrow2.height;
      line._arrow2.setPosition(start * newLength + newLength, 0);
    }
    if (straightLine) {
      // console.log("Asdf")
      straightLine.transform.updateScale(straightLineLength, 1);
      straightLine.setPosition(straightLineStart, 0);
    }
    line.currentLength = newLength;
    line.updateLabel();
  };

  line.setEndPoints = (p: Point, q: Point, offset: number = 0) => {
    const newLength = distance(q, p);
    const pq = new Line(p, q);
    line.transform.updateRotation(pq.angle());
    const offsetdelta = polarToRect(offset, pq.angle() + Math.PI / 2);
    if (reference === 'center') {
      line.transform.updateTranslation(pq.midpoint().add(offsetdelta));
    } else {
      line.transform.updateTranslation(p.add(offsetdelta));
    }
    line.setLength(newLength);
    line.updateLabel();
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

  if (straightLine != null) {
    straightLine.pulse.transformMethod = s => new Transform().scale(1, s);
  }

  line.pulseWidth = () => {
    if (straightLine != null) {
      straightLine.pulseScaleNow(1, 3);
    }
    diagram.animateNextFrame();
  };


  line.setLength(length);

  return line;
}
