// @flow

// import Diagram from '../Diagram';
import {
  Transform, Point, distance, Line, polarToRect, normAngle, Rect,
} from '../tools/g2';
import {
  roundNum,
} from '../tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../Element';
import EquationLabel from './EquationLabel';
import { Equation } from '../DiagramElements/Equation/GLEquation';

// p1, p2
// p1, length, angle, 'end' | 'middle', 

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

class LineLabel extends EquationLabel {
  offset: number;
  location: TypeLineLabelLocation;
  subLocation: TypeLineLabelSubLocation;
  orientation: TypeLineLabelOrientation;
  linePosition: number;

  constructor(
    equation: Object,
    labelText: string | Equation | Array<string>,
    color: Array<number>,
    offset: number,
    location: TypeLineLabelLocation = 'top',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'horizontal',
    linePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    super(equation, labelText, color);
    this.offset = offset;
    this.location = location;
    this.subLocation = subLocation;
    this.orientation = orientation;
    this.linePosition = linePosition;
  }
}

function makeStraightLine(
  shapes: Object,
  length: number,
  width: number,
  position: Point,
  color: Array<number>,
  largerTouchBorder: boolean,
  isTouchDevice: boolean,
) {
  const straightLine = shapes.horizontalLine(
    position,
    length, width,
    0, color, new Transform().scale(1, 1).translate(0, 0),
  );
  if (largerTouchBorder) {
    const multiplier = isTouchDevice ? 16 : 8;
    const increaseBorderSize = (element: DiagramElementPrimative) => {
      for (let i = 0; i < element.drawingObject.border[0].length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        element.drawingObject.border[0][i].y *= multiplier;
      }
    };
    increaseBorderSize(straightLine);
  }
  return straightLine;
}
// export type TypeLine = {
//   _line: DiagramElementPrimative;
//   currentLength: number;
//   setLength: (number) => void;
//   setEndPoints: (Point, Point, number) => void;
//   animateLengthTo: (number, number, boolean, ?() => void) => void;
//   grow: (number, number, boolean, ?() => void) => void;
//   reference: 'center' | 'end';
//   showRealLength: boolean;
//   label: ?LineLabel;
//   _label: DiagramElementCollection;
//   arrow1: null | {
//     height: number;
//   };
//   arrow2: null | {
//     height: number;
//   };
//   setMovable: (?boolean) => void;

//   addArrow1: (number, number) => void;
//   addArrow2: (number, number) => void;
//   addLabel: (string, number, TypeLineLabelLocation,
//              TypeLineLabelSubLocation, TypeLineLabelOrientation, number
//             ) => void;
//   setEndPoints: (Point, Point, ?number) => void;
//   animateLengthTo: (number, number, boolean, ?() => void) => void;
//   grow: (number, number, boolean, ?() => void) => void;
//   pulseWidth: () => void;
//   updateLabel: (?number) => {};
//   offset: number;
// } & DiagramElementCollection;

export class DiagramObjectLine extends DiagramElementCollection {
  _line: DiagramElementPrimative;
  currentLength: number;
  setLength: (number) => void;
  setEndPoints: (Point, Point, number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
  vertexOrigin: 'start' | 'end' | 'middle' | number | Point;
  showRealLength: boolean;
  label: ?LineLabel;
  _label: ?{
    _base: DiagramElementPrimative;
  } & DiagramElementCollection;

  _arrow1: ?DiagramElementPrimative;
  _arrow2: ?DiagramElementPrimative;
  arrow1: null | {
    height: number;
  };

  arrow2: null | {
    height: number;
  };

  setMovable: (?boolean) => void;

  addArrow1: (number, number) => void;
  addArrow2: (number, number) => void;
  addLabel: (string | Equation | Array<string>, number, TypeLineLabelLocation,
             TypeLineLabelSubLocation, TypeLineLabelOrientation, number
            ) => void;

  setEndPoints: (Point, Point, ?number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
  pulseWidth: () => void;
  updateLabel: (?number) => {};
  start: number;
  shapes: Object;
  equation: Object;
  animateNextFrame: void => void;
  vertexSpaceLength: number;
  vertexSpaceStart: Point;
  offset: number;
  _midLine: ?DiagramElementPrimative;
  width: number;
  isTouchDevice: boolean;
  largerTouchBorder: boolean;
  multiMove: {
    vertexSpaceMidLength: number;
    bounds: Rect,
  };

  line: Line;
  length: number;
  angle: number;
  p1: Point;
  p2: Point;
  position: Point;
  // p1: Point;
  // p2: Point;

  constructor(
    shapes: Object,
    equation: Object,
    isTouchDevice: boolean,
    animateNextFrame: void => void,
    position: Point,
    length: number,
    angle: number,
    vertexOrigin: 'start' | 'end' | 'middle' | number | Point,
    width: number,
    color: Array<number>,
    showLine: boolean = true,
    largerTouchBorder: boolean = true,
  ) {
    super(new Transform('Line')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0));
    this.setColor(color);

    this.shapes = shapes;
    this.equation = equation;

    this.offset = 0;
    this.width = width;
    this.largerTouchBorder = largerTouchBorder;
    this.isTouchDevice = isTouchDevice;

    // Calculate and store the line geometry
    //    The length, angle, p1 and p2 properties also exist in this.line,
    //    but are at this level for convenience
    // let p1 = position;
    this.position = position;
    // let line = new Line(p1, length, angle);
    // if (reference === 'middle') {
    //   p1 = position.add(polarToRect(length / 2, angle + Math.PI));
    //   line = new Line(p1, length, angle);
    // } else if (reference === 'end') {
    //   p1 = position.add(polarToRect(length, angle + Math.PI));
    //   line = new Line(p1, length, angle);
    // } else if (typeof reference === 'number') {
    //   p1 = position.add(polarToRect(length * reference, angle + Math.PI));
    //   line = new Line(p1, length, angle);
    // }
    this.length = length;
    // this.currentLength = 1; // to deprecate?
    this.angle = angle;
    // this.updateLineGeometry();
    // this.p1 = line.getPoint(1);
    // this.p2 = line.getPoint(2);
    // this.line = line;

    // Line is defined in vertex space as horiztonal along the x axis.
    // The reference will define how it is offset where:
    //    - start: line extends from 0 to length in x
    //    - end: line extends from -length to 0 in length
    //    - middle: line extends from -length / 2 to length / 2
    //    - percent: line extends from -length * % to length * (1 - %)
    this.vertexSpaceLength = 1;
    this.vertexSpaceStart = new Point(0, 0);
    if (vertexOrigin === 'end') {
      this.vertexSpaceStart = new Point(-1, 0);
    } else if (vertexOrigin === 'middle') {
      this.vertexSpaceStart = new Point(-0.5, 0);
    } else if (typeof vertexOrigin === 'number') {
      this.vertexSpaceStart = new Point(-vertexOrigin, 0);
    } else if (vertexOrigin instanceof Point) {
      this.vertexSpaceStart = vertexOrigin;
    }
    this.vertexOrigin = vertexOrigin;

    // MultiMove means the line has a middle section that when touched
    // translates the line collection, and when the rest of the line is
    // touched then the line collection is rotated.
    this.multiMove = {
      vertexSpaceMidLength: 0,
      bounds: new Rect(-1, -1, 2, 2),
    };
    this._midLine = null;

    // If the line is to be shown (and not just a label) then make it
    if (showLine) {
      const straightLine = makeStraightLine(
        this.shapes, this.vertexSpaceLength, width,
        new Point(this.vertexSpaceStart, 0),
        color, largerTouchBorder, isTouchDevice,
      );
      this.add('line', straightLine);
    }

    // Arrow related properties
    this.arrow1 = null;
    this.arrow2 = null;

    // Label related properties
    this.label = null;
    this.showRealLength = false;

    // // For pulsing width
    // if (this._line != null) {
    //   this._line.pulse.transformMethod = s => new Transform().scale(1, s);
    // }

    this.setLength(length);
  }

  pulseWidth() {
    if (this._line != null) {
      this._line.stopPulsing();
      const oldTransformMethod = this._line.pulse.transformMethod;
      const oldPulseCallback = this._line.pulse.callback;
      const finishPulsing = () => {
        this._line.pulse.transformMethod = oldTransformMethod;
        this._line.pulse.callback = oldPulseCallback;
      };
      this._line.pulse.callback = finishPulsing;
      this._line.pulse.transformMethod = s => new Transform().scale(1, s);
      this._line.pulseScaleNow(1, 3);
    }
    this.animateNextFrame();
  }

  addArrow(
    index: 1 | 2,
    height: number = this.width * 4,
    width: number = height,
  ) {
    const a = this.shapes.arrow(
      width, 0, height, 0,
      this.color, new Transform().translate(this.start, 0), new Point(0, 0), Math.PI / 2,
    );
    // $FlowFixMe
    this[`arrow${index}`] = { height };
    this.add(`arrow${index}`, a);
    this.setLength(this.currentLength);
  }

  addArrow1(
    arrowHeight: number = this.width * 4,
    arrowWidth: number = arrowHeight,
  ) {
    this.addArrow(1, arrowHeight, arrowWidth);
  }

  addArrow2(
    arrowHeight: number = this.width * 4,
    arrowWidth: number = arrowHeight,
  ) {
    this.addArrow(2, arrowHeight, arrowWidth);
  }

  addArrowStart(
    arrowHeight: number = this.width * 4,
    arrowWidth: number = arrowHeight,
  ) {
    this.addArrow1(arrowHeight, arrowWidth);
  }

  addArrowEnd(
    arrowHeight: number = this.width * 4,
    arrowWidth: number = arrowHeight,
  ) {
    this.addArrow2(arrowHeight, arrowWidth);
  }

  setMovable(movable: boolean = true) {
    if (movable) {
      this.isTouchable = true;
      this.isMovable = true;
      this.hasTouchableElements = true;
      if (this._line != null) {
        this._line.isTouchable = true;
      }
    } else {
      this.isMovable = false;
    }
  }

  setMultiMovable(middleLengthPercent: number, bounds: Rect) {
    this.multiMove.vertexSpaceMidLength = middleLengthPercent * this.vertexSpaceLength;
    const start = new Point(
      this.start + this.vertexSpaceLength / 2 - this.multiMove.vertexSpaceMidLength / 2,
      0,
    );
    const midLine = makeStraightLine(
      this.shapes, this.multiMove.vertexSpaceMidLength, this.width,
      start, [1, 0, 0, 1], // this.color,
      this.largerTouchBorder, this.isTouchDevice,
    );
    midLine.isTouchable = true;
    midLine.move.type = 'translation';
    midLine.move.element = this;
    midLine.isMovable = true;
    midLine.move.canBeMovedAfterLoosingTouch = true;
    this.add('midLine', midLine);
    if (this._line) {
      this._line.isTouchable = true;
      this._line.move.type = 'rotation';
      this._line.move.element = this;
      this._line.isMovable = true;
      this._line.move.canBeMovedAfterLoosingTouch = true;
    }
    this.hasTouchableElements = true;
    this.isTouchable = false;
    this.isMovable = false;
    this.multiMove.bounds = bounds;
    this.setLength(this.currentLength);
  }

  updateMultiMoveTransform(t: Transform) {
    const r = t.r();
    const { bounds } = this.multiMove;
    if (r != null) {
      const w = Math.abs(this.currentLength / 2 * Math.cos(r));
      const h = Math.abs(this.currentLength / 2 * Math.sin(r));
      this.move.maxTransform.updateTranslation(
        bounds.right - w,
        bounds.top - h,
      );
      this.move.minTransform.updateTranslation(
        bounds.left + w,
        bounds.bottom + h,
      );
      if (r > 2 * Math.PI) {
        this.transform.updateRotation(r - 2 * Math.PI);
      }
      if (r < 0) {
        this.transform.updateRotation(r + 2 * Math.PI);
      }
    }
  }

  addLabel(
    labelText: string | Equation | Array<string>,
    offset: number,
    location: TypeLineLabelLocation = 'top',
    subLocation: TypeLineLabelSubLocation = 'left',
    orientation: TypeLineLabelOrientation = 'horizontal',
    linePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    // const eqnLabel = new EquationLabel(this.equation, labelText, this.color);
    this.label = new LineLabel(
      this.equation, labelText, this.color,
      offset, location, subLocation, orientation, linePosition,
    );
    this.add('label', this.label.eqn.collection);
    // this.label = Object.assign({}, {
    //   offset,
    //   location,
    //   subLocation,
    //   orientation,
    //   linePosition,
    // }, eqnLabel);
    // console.log(this.label)
    this.updateLabel();
  }

  updateLabel(parentRotationOffset: number = 0) {
    const { label } = this;
    if (label == null) {
      return;
    }
    const lineAngle = normAngle(this.transform.r() || 0);
    let labelAngle = 0;
    if (this.showRealLength && this._label) {
      this._label._base.drawingObject.setText(roundNum(this.currentLength, 2).toString());
      label.eqn.reArrangeCurrentForm();
    }
    const labelPosition = new Point(
      this.start * this.currentLength + label.linePosition * this.currentLength,
      0,
    );
    let labelOffsetAngle = Math.PI / 2;
    const labelOffsetMag = label.offset;
    if (label.location === 'end1' || label.location === 'end2') {
      if (label.location === 'end1') {
        labelPosition.x = this.start * this.currentLength - label.offset;
        labelOffsetAngle = -Math.PI;
      }
      if (label.location === 'end2') {
        labelPosition.x = this.start * this.currentLength + this.currentLength + label.offset;
        labelOffsetAngle = 0;
      }
    } else {
      const offsetTop = Math.cos(lineAngle) < 0 ? -Math.PI / 2 : Math.PI / 2;
      const offsetBottom = -offsetTop;
      const offsetLeft = Math.sin(lineAngle) > 0 ? Math.PI / 2 : -Math.PI / 2;
      const offsetRight = -offsetLeft;

      if (label.location === 'top') {
        labelOffsetAngle = offsetTop;
      }
      if (label.location === 'bottom') {
        labelOffsetAngle = offsetBottom;
      }
      if (label.location === 'right') {
        labelOffsetAngle = offsetRight;
      }
      if (label.location === 'left') {
        labelOffsetAngle = offsetLeft;
      }
      if (roundNum(Math.sin(lineAngle), 4) === 0
        && (label.location === 'left' || label.location === 'right')
      ) {
        if (label.subLocation === 'top') {
          labelOffsetAngle = offsetTop;
        }
        if (label.subLocation === 'bottom') {
          labelOffsetAngle = offsetBottom;
        }
      }
      if (roundNum(Math.cos(lineAngle), 4) === 0
        && (label.location === 'top' || label.location === 'bottom')
      ) {
        if (label.subLocation === 'right') {
          labelOffsetAngle = offsetRight;
        }
        if (label.subLocation === 'left') {
          labelOffsetAngle = offsetLeft;
        }
      }
      if (label.location === 'inside') {
        labelOffsetAngle = -Math.PI / 2;
      }
      if (label.location === 'outside') {
        labelOffsetAngle = Math.PI / 2;
      }
    }

    if (label.orientation === 'horizontal') {
      labelAngle = -lineAngle;
    }
    if (label.orientation === 'baseToLine') {
      if (labelPosition.y < 0) {
        labelAngle = Math.PI;
      }
    }
    if (label.orientation === 'baseAway') {
      if (labelPosition.y > 0) {
        labelAngle = Math.PI;
      }
    }
    if (label.orientation === 'baseUpright') {
      if (Math.cos(lineAngle) < 0) {
        labelAngle = Math.PI;
      }
    }

    label.updateRotation(
      labelAngle - parentRotationOffset,
      labelPosition, labelOffsetMag, labelOffsetAngle,
    );
  }

  setLength(newLength: number) {
    const lineStart = this.vertexSpaceStart.x * newLength;
    const lineLength = newLength;
    let straightLineLength = lineLength;
    let straightLineStart = lineStart;

    if (this.arrow1 && this._arrow1) {
      straightLineLength -= this.arrow1.height;
      straightLineStart += this.arrow1.height;
      this._arrow1.setPosition(lineStart);
    }
    if (this.arrow2 && this._arrow2) {
      straightLineLength -= this.arrow2.height;
      this._arrow2.setPosition(lineStart + lineLength, 0);
    }
    if (this._line) {
      // console.log("Asdf")
      this._line.transform.updateScale(straightLineLength, 1);
      this._line.setPosition(straightLineStart, 0);
    }
    if (this._midLine) {
      const midLine = this._midLine;
      midLine.transform.updateScale(newLength, 1);
      midLine.setPosition(lineStart + lineLength / 2, 0);
    }

    this.length = newLength;
    this.updateLineGeometry();
    this.currentLength = newLength; // to deprecate?
    this.updateLabel();
  }

  updateLineGeometry() {
    const t = this.transform.t();
    const r = this.transform.r();
    if (t != null && r != null) {
      this.position = t;
      this.angle = r;
      let p1 = this.position;
      let line = new Line(p1, this.length, this.angle);
      if (this.vertexOrigin === 'middle') {
        p1 = this.position
          .add(polarToRect(this.length / 2, this.angle + Math.PI));
        line = new Line(p1, this.length, this.angle);
      } else if (this.vertexOrigin === 'end') {
        p1 = this.position.add(polarToRect(this.length, this.angle + Math.PI));
        line = new Line(p1, this.length, this.angle);
      } else if (typeof this.vertexOrigin === 'number') {
        p1 = this.position
          .add(polarToRect(this.length * this.vertexOrigin, this.angle + Math.PI));
        line = new Line(p1, this.length, this.angle);
      } else if (this.vertexOrigin instanceof Point) {
        p1 = this.position.add(this.vertexOrigin);
        line = new Line(p1, this.length, this.angle);
      }
      this.p1 = line.getPoint(1);
      this.p2 = line.getPoint(2);
      this.line = line;
    }
  }

  setEndPoints(p: Point, q: Point, offset: number = this.offset) {
    this.offset = offset;
    const pq = new Line(p, q);
    this.angle = pq.angle();
    this.length = pq.length();

    this.position = p;
    if (this.vertexOrigin === 'middle') {
      this.position = pq.midpoint();
    } else if (this.vertexOrigin === 'end') {
      this.position = q;
    } else if (typeof this.vertexOrigin === 'number') {
      this.position = p.add(polarToRect(this.vertexOrigin * this.length, this.angle));
    } else if (this.vertexOrigin instanceof Point) {
      this.position = p.add(this.vertexOrigin);
    }
    // this.updateLineGeometry();

    // const newLength = distance(q, p);
    // const pq = new Line(p, q);
    this.transform.updateRotation(pq.angle());
    const offsetdelta = polarToRect(offset, pq.angle() + Math.PI / 2);
    // if (this.reference === 'center') {
    this.transform.updateTranslation(this.position.add(offsetdelta));
    // } else {
    //   this.transform.updateTranslation(p.add(offsetdelta));
    // }
    this.setLength(this.length);
    this.updateLabel();
  }

  animateLengthTo(
    toLength: number = 1,
    time: number = 1,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    this.stop();
    const initialLength = this.currentLength;
    const deltaLength = toLength - this.currentLength;
    const func = (percent) => {
      this.setLength(initialLength + deltaLength * percent);
    };
    const done = () => {
      if (finishOnCancel) {
        this.setLength(initialLength + deltaLength);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    this.animateCustomTo(func, time, 0, done);
  }

  grow(
    fromLength: number = 0,
    time: number = 1,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    this.stop();
    const target = this.currentLength;
    this.setLength(fromLength);
    this.animateLengthTo(target, time, finishOnCancel, callback);
  }
}

export type TypeLine = DiagramObjectLine;

export class MovableLine extends DiagramObjectLine {
  // constructor(
  //   fullLength: number,
  //   endLength: number,
  //   width: number,
  //   boundary: Rect,
  // ) {

  // }
}

export type TypeMovableLine = MovableLine;
