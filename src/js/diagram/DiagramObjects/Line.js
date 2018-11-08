// @flow

// import Diagram from '../Diagram';
import {
  Transform, Point, distance, Line, polarToRect, normAngle,
} from '../tools/g2';
import {
  roundNum,
} from '../tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../Element';
import EquationLabel from './EquationLabel';


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
  _line: DiagramElementPrimative;
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
  } & EquationLabel;
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
  setEndPoints: (Point, Point, ?number) => void;
  animateLengthTo: (number, number, boolean, ?() => void) => void;
  grow: (number, number, boolean, ?() => void) => void;
  pulseWidth: () => void;
  updateLabel: (?number) => {};

} & DiagramElementCollection;

export default class makeLine extends DiagramElementCollection {
  _line: DiagramElementPrimative;
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
  } & EquationLabel;

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
  addLabel: (string, number, TypeLineLabelLocation,
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

  constructor(
    shapes: Object,
    equation: Object,
    isTouchDevice: boolean,
    animateNextFrame: void => void,
    referenceOrP1: 'center' | 'end' | Point = 'center',
    lengthOrP2: number | Point,
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

    this.start = -0.5;
    let reference = 'end';
    if (typeof referenceOrP1 === 'string') {
      reference = referenceOrP1;
    }
    let length = 1;
    if (typeof lengthOrP2 === 'number') {
      length = lengthOrP2;
    }

    this.reference = reference;
    if (reference === 'end') {
      this.start = 0;
    }
    this.vertexSpaceLength = 1;

    let straightLine = null;
    if (showLine) {
      straightLine = shapes.horizontalLine(
        new Point(0, 0),
        this.vertexSpaceLength, width,
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
      this.add('line', straightLine);
    }
    this.currentLength = 1;
    this.label = null;
    this.arrow1 = null;
    this.arrow2 = null;
    // this._label = shapes.collection(new Transform());
    this.showRealLength = false;

    if (this._line != null) {
      this._line.pulse.transformMethod = s => new Transform().scale(1, s);
    }

    this.setLength(length);

    if (lengthOrP2 instanceof Point && referenceOrP1 instanceof Point) {
      this.setEndPoints(referenceOrP1, lengthOrP2);
    }
  }

  pulseWidth() {
    if (this._line != null) {
      this._line.pulseScaleNow(1, 3);
    }
    this.animateNextFrame();
  }
  // const line = diagram.shapes.collection(new Transform()
  //   .scale(1, 1)
  //   .rotate(0)
  //   .translate(0, 0));


  addArrow1(arrowHeight: number, arrowWidth: number) {
    const a = this.shapes.arrow(
      arrowWidth, 0, arrowHeight, 0,
      this.color, new Transform().translate(this.start, 0), new Point(0, 0), Math.PI / 2,
    );
    this.arrow1 = { height: arrowHeight };
    this.add('arrow1', a);
    this.setLength(this.currentLength);
  }

  addArrow2(arrowHeight: number, arrowWidth: number) {
    const a = this.shapes.arrow(
      arrowWidth, 0, arrowHeight, 0,
      this.color, new Transform().translate(this.start + this.vertexSpaceLength, 0),
      new Point(0, 0), -Math.PI / 2,
    );
    this.arrow2 = { height: arrowHeight };
    this.add('arrow2', a);
    this.setLength(this.currentLength);
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

  addLabel(
    labelText: string,
    offset: number,
    location: TypeLineLabelLocation,
    subLocation: TypeLineLabelSubLocation,
    orientation: TypeLineLabelOrientation,
    linePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    const eqnLabel = new EquationLabel(this.equation, labelText, this.color);
    this.add('label', eqnLabel.eqn.collection);
    this.label = Object.assign({}, {
      offset,
      location,
      subLocation,
      orientation,
      linePosition,
    }, eqnLabel);
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
    let straightLineLength = newLength;
    let straightLineStart = this.start * newLength;

    if (this.arrow1 && this._arrow1) {
      straightLineLength -= this.arrow1.height;
      straightLineStart += this.arrow1.height;
      this._arrow1.setPosition(this.start * newLength);
    }
    if (this.arrow2 && this._arrow2) {
      straightLineLength -= this.arrow2.height;
      this._arrow2.setPosition(this.start * newLength + newLength, 0);
    }
    if (this._line) {
      // console.log("Asdf")
      this._line.transform.updateScale(straightLineLength, 1);
      this._line.setPosition(straightLineStart, 0);
    }
    this.currentLength = newLength;
    this.updateLabel();
  }

  setEndPoints(p: Point, q: Point, offset: number = 0) {
    const newLength = distance(q, p);
    const pq = new Line(p, q);
    this.transform.updateRotation(pq.angle());
    const offsetdelta = polarToRect(offset, pq.angle() + Math.PI / 2);
    if (this.reference === 'center') {
      this.transform.updateTranslation(pq.midpoint().add(offsetdelta));
    } else {
      this.transform.updateTranslation(p.add(offsetdelta));
    }
    this.setLength(newLength);
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
