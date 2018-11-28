// @flow

// import Diagram from '../Diagram';
import {
  Transform, Point, Line, polarToRect, normAngle, Rect,
  threePointAngle,
} from '../tools/g2';
import {
  roundNum,
} from '../tools/mathtools';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../Element';
import EquationLabel from './EquationLabel';
import { Equation } from '../DiagramElements/Equation/GLEquation';

export type TypeAngleOptions = {
  position?: Point,
  angle?: number,
  rotation?: number,
  clockwise?: boolean,
  color?: Array<number>,
  curve?: {
    width?: number,
    sides?: number,
    radius?: number,
  },
  p1?: Point,
  p2?: Point,
  p3?: Point,
  arrow1?: {
    width?: number,
    height?: number,
    radius?: number,
  },
  arrow2?: {
    width?: number,
    height?: number,
    radius?: number,
  },
  arrows?: {
    width?: number,
    height?: number,
    radius?: number,
  } | boolean,
  label?: {
    text: string | Array<string>,
    radius?: number,
    curvePosition?: number,
    showRealAngle?: boolean,
  },
  side1?: {
    length?: number,
    width?: number,
    color?: Array<number>,
  },
  side2?: {
    length?: number,
    width?: number,
    color?: Array<number>,
  },
  sides?: {
    length?: number,
    width?: number,
    color?: Array<number>,
  },
};

// Angle is a class that manages:
//   A angle curve
//   Label
//   Arrows
//   Straight Lines
//
// The angle collection comprises:
//   * Positioned at 0, 0 in vertex space
//   * Curve from 0 to angle size (where 0 is along x axis in vertex space)
  // * Curve can be clockwise or anticlockwise
//   * Label in center of curve
//   * Arrows at ends of curve
//   * Straight lines forming the corner
//
// To give the angle a custom position and rotation from 0, the main class's
// transform is used:
//   - Translation for position
//   - Rotation for rotation
//
// An angle can be defined in two ways:
//   - Angle, rotation, position
//   - p1, p2, p3

class AngleLabel extends EquationLabel {
  offset: number;
  curvePosition: number;

  constructor(
    equation: Object,
    labelText: string | Equation | Array<string>,
    color: Array<number>,
    offset: number,
    curvePosition: number = 0.5,     // number where 0 is end1, and 1 is end2
  ) {
    super(equation, { label: labelText, color });
    this.offset = offset;
    this.curvePosition = curvePosition;
  }
}


// A line is always defined as horiztonal with length 1 in vertex space
// The line's position and rotation is the line collection transform
// translation and rotation respectively.
// The line's length is the _line primative x scale.
class DiagramObjectAngle extends DiagramElementCollection {
  // Diagram elements
  _curve: ?DiagramElementPrimative;
  _arrow1: ?DiagramElementPrimative;
  _arrow2: ?DiagramElementPrimative;
  _side1: ?DiagramElementPrimative;
  _side2: ?DiagramElementPrimative;
  _label: null | {
    _base: DiagramElementPrimative;
  } & DiagramElementCollection;

  // lObjects that may or may not exist
  label: ?AngleLabel;
  arrow1: ?{ height: number; width: number, radius: number };
  arrow2: ?{ height: number; width: number, radius: number };
  side1: ?{ width: number, length: number, color: Array<number> };
  side2: ?{ width: number, length: number, color: Array<number> };
  curve: ?{
    width: number,
    sides: number,
    radius: number,
  };

  // angle properties - read only
  angle: number;
  rotation: number;
  position: Point;
  radius: number;
  clockwise: boolean;
  p1: Point;
  p2: Point;
  p3: Point;

  // line properties - read/write
  // showRealAngle: boolean;

  // line properties - private internal use only
  // start: number;
  shapes: Object;
  equation: Object;
  animateNextFrame: void => void;
  isTouchDevice: boolean;
  largerTouchBorder: boolean;

  // line methods
  setAngle: (number) => void;
  setRotation: (number) => void;
  setByPoints: (Point, Point, Point) => void;
  // setLength: (number) => void;
  // setEndPoints: (Point, Point, ?number) => void;
  // animateLengthTo: (?number, ?number, ?boolean, ?() => void) => void;
  grow: (?number, ?number, ?boolean, ?() => void) => void;
  // setMovable: (?boolean, ?('translation' | 'rotation' | 'centerTranslateEndRotation' | 'scaleX' | 'scaleY' | 'scale'), ?number, ?Rect) => void;
  // addArrow1: (?number, ?number) => void;
  // addArrow2: (?number, ?number) => void;
  // addArrow: (number, ?number, ?number) => void;
  pulseWidth: () => void;
  updateLabel: (?number) => {};
  // addLabel: (string | Equation | Array<string>, number, ?TypeLineLabelLocation,
  //            ?TypeLineLabelSubLocation, ?TypeLineLabelOrientation, ?number
  //           ) => void;


  // eslint-disable-next-line class-methods-use-this
  calculateFromP1P2P3(
    p1: Point,
    p2: Point,
    p3: Point,
  ) {
    const position = p2._dup();
    const L21 = new Line(p2, p1);
    const rotation = L21.angle();
    const angle = threePointAngle(p1, p2, p3);
    return { position, rotation, angle };
  }

  constructor(
    shapes: Object,
    equation: Object,
    isTouchDevice: boolean,
    animateNextFrame: void => void,
    options: TypeAngleOptions = {},
  ) {
    const defaultOptions = {
      position: new Point(0, 0),
      rotation: 0,
      angle: 1,
      // radius: 0.1,
      color: [0, 1, 0, 1],
      // clockwise: false,
      curve: null,
      sides: null,
      sideStart: null,
      sideStop: null,
      arrows: null,
      arrow1: null,
      arrow2: null,
      label: null,
      p1: null,       // if p1, p2 and p3 are defined, position, angle and
      p2: null,       // rotation will be overridden
      p3: null,
    };
    const optionsToUse = Object.assign({}, defaultOptions, options);

    super(new Transform('Line')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0), shapes.limits);
    this.setColor(optionsToUse.color);

    this.shapes = shapes;
    this.equation = equation;
    this.largerTouchBorder = optionsToUse.largerTouchBorder;
    this.isTouchDevice = isTouchDevice;
    this.animateNextFrame = animateNextFrame;

    // Calculate and store the angle geometry
    this.position = optionsToUse.position;
    this.rotation = optionsToUse.rotation;
    this.angle = optionsToUse.angle;
    // this.clockwise = optionsToUse.clockwise;
    // this.radius = optionsToUse.radius;
    if (optionsToUse.p1 != null
      && optionsToUse.p2 != null
      && optionsToUse.p3 != null
    ) {
      const { position, rotation, angle } = this.calculateFromP1P2P3(
        optionsToUse.p1, optionsToUse.p2, optionsToUse.p3,
      );
      this.angle = angle;
      this.rotation = rotation;
      this.position = position;
    }
    this.transform.updateTranslation(this.position);
    this.transform.updateRotation(this.rotation);

    // Setup default values for sides, arrows, curve and label
    this.side1 = null;
    this.side2 = null;
    this.arrow1 = null;
    this.arrow2 = null;
    this.curve = null;
    this.label = null;

    // If the curve is to be shown (and not just a label) then make it
    this._curve = null;
    if (optionsToUse.curve) {
      this.addCurve(optionsToUse.curve);
    }

    let defaultArrowDimension = 0.04;
    if (this.curve) {
      defaultArrowDimension = this.curve.width * 4;
    }
    let defaultArrowRadius = 0.1;
    if (this.curve) {
      defaultArrowRadius = this.curve.radius;
    }
    const defaultArrowOptions = {
      width: defaultArrowDimension,
      height: defaultArrowDimension,
      radius: defaultArrowRadius,
    };
    if (optionsToUse.arrow1) {
      const arrowOptions = Object.assign({}, defaultArrowOptions, optionsToUse.arrow1);
      this.addArrow(1, arrowOptions.height, arrowOptions.width, arrowOptions.radius);
    }

    if (optionsToUse.arrow2) {
      const arrowOptions = Object.assign({}, defaultArrowOptions, optionsToUse.arrow2);
      this.addArrow(2, arrowOptions.height, arrowOptions.width, arrowOptions.radius);
    }

    // // Arrows overrides arrowStart or arrowEnd
    // if (optionsToUse.arrows) {
    //   let arrows = {};
    //   if (typeof optionsToUse.arrows === 'object') {
    //     ({ arrows } = optionsToUse);
    //   }
    //   const arrowOptions = Object.assign({}, defaultArrowOptions, arrows);
    //   this.addArrow(1, arrowOptions.height, arrowOptions.width, arrowOptions.radius);
    //   this.addArrow(2, arrowOptions.height, arrowOptions.width, arrowOptions.radius);
    // }

    // const defaultLabelOptions = {
    //   text: '',
    //   offset: 0,
    //   location: 'top',
    //   subLocation: 'left',
    //   orientation: 'horizontal',
    //   linePosition: 0.5,
    // };
    // if (optionsToUse.label) {
    //   const labelOptions = Object.assign({}, defaultLabelOptions, optionsToUse.label);
    //   this.addLabel(
    //     labelOptions.text,
    //     labelOptions.offset,
    //     labelOptions.location,
    //     labelOptions.subLocation,
    //     labelOptions.orientation,
    //     labelOptions.linePosition,
    //   );
    // }
  }

  addCurve(curveOptions: {
    width?: number,
    sides?: number,
  } = {}) {
    const defaultCurveOptions = {
      width: 0.01,
      sides: 50,
    };
    const optionsToUse = Object.assign(
      {}, defaultCurveOptions, curveOptions,
    );
    const curve = this.shapes.polygon({
      sides: optionsToUse.sides,
      radius: optionsToUse.radius,
      width: optionsToUse.width,
      // sidesToDraw: Math.floor(this.angle / (Math.PI * 2) * optionsToUse.sides),
      color: this.color,
      fill: false,
      transform: new Transform('AngleCurve').rotate(0),
    });
    this.curve = optionsToUse;
    this.add('curve', curve);
  }

  // pulseWidth() {
  //   const line = this._line;
  //   if (line != null) {
  //     line.stopPulsing();
  //     const oldTransformMethod = line.pulse.transformMethod;
  //     const oldPulseCallback = line.pulse.callback;
  //     const finishPulsing = () => {
  //       line.pulse.transformMethod = oldTransformMethod;
  //       line.pulse.callback = oldPulseCallback;
  //     };
  //     line.pulse.callback = finishPulsing;
  //     line.pulse.transformMethod = s => new Transform().scale(1, s);
  //     line.pulseScaleNow(1, 3);
  //   }
  //   const arrow1 = this._arrow1;
  //   const arrow2 = this._arrow2;
  //   if (arrow1 != null) {
  //     arrow1.pulseScaleNow(1, 2);
  //   }
  //   if (arrow2 != null) {
  //     arrow2.pulseScaleNow(1, 2);
  //   }

  //   const label = this._label;
  //   if (label != null) {
  //     label.pulseScaleNow(1, 1.5);
  //   }
  //   this.animateNextFrame();
  // }

  addArrow(
    index: 1 | 2,
    height: number | null = null,
    width: number | null = height,
    radius: number | null = null,
  ) {
    let r = Math.PI / 2;
    if (index === 2) {
      r = Math.PI / 2 * 3;
    }
    let heightToUse = 0.04;
    if (height) {
      heightToUse = height;
    } else if (this.curve) {
      heightToUse = this.curve.width * 4;
    }
    let widthToUse = 0.04;
    if (width) {
      widthToUse = width;
    } else if (this.curve) {
      widthToUse = this.curve.width * 4;
    }
    let radiusToUse = 0.1;
    if (radius) {
      radiusToUse = radius;
    } else if (this.curve) {
      radiusToUse = this.curve.radius;
    }

    const a = this.shapes.arrow(
      widthToUse, 0, heightToUse, 0,
      this.color, new Transform().rotate(0).translate(0, 0), new Point(0, 0), r,
    );
    // $FlowFixMe
    this[`arrow${index}`] = {
      height: heightToUse,
      width: widthToUse,
      radius: radiusToUse,
    };
    this.add(`arrow${index}`, a);
    this.update();
  }

  update() {
    let rotationForArrow1 = 0;
    let curveAngle = this.angle;

    const { _arrow1, arrow1 } = this;
    if (_arrow1 && arrow1) {
      _arrow1.transform.updateTranslation(arrow1.radius, 0);
      const arrowLengthAngle = arrow1.height / arrow1.radius;
      rotationForArrow1 = arrowLengthAngle;
      curveAngle -= arrowLengthAngle;
      _arrow1.transform.updateRotation(Math.PI / 2 + arrowLengthAngle);
    }

    const { _arrow2, arrow2 } = this;
    if (_arrow2 && arrow2) {
      _arrow2.transform.updateTranslation(polarToRect(arrow2.radius, this.angle));
      const arrowLengthAngle = arrow2.height / arrow2.radius;
      curveAngle -= arrowLengthAngle * 0.5;
      _arrow2.transform.updateRotation(this.angle + Math.PI / 2 - arrowLengthAngle);
    }

    this.transform.updateTranslation(this.position);
    this.transform.updateRotation(this.rotation);
    const { _curve, curve } = this;
    if (_curve != null && curve != null) {
      curveAngle = Math.max(curveAngle, 0);
      console.log(curveAngle, this.angle);
      _curve.angleToDraw = curveAngle;
      _curve.transform.updateRotation(rotationForArrow1);
    }
  }

  addArrows(
    arrowHeight: number = this.width * 4,
    arrowWidth: number = arrowHeight,
  ) {
    this.addArrow1(arrowHeight, arrowWidth);
    this.addArrow2(arrowHeight, arrowWidth);
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

  setMovable(
    movable: boolean = true,
    moveType: 'translation' | 'rotation' | 'centerTranslateEndRotation' | 'scaleX' | 'scaleY' | 'scale' = this.move.type,
    middleLengthPercent: number = 0.333,
    translationBounds: Rect = this.diagramLimits,
  ) {
    if (movable) {
      if (moveType === 'translation' || moveType === 'rotation'
        || moveType === 'scale' || moveType === 'scaleX'
        || moveType === 'scaleY'
      ) {
        this.move.type = moveType;
        this.isTouchable = true;
        this.isMovable = true;
        this.hasTouchableElements = true;
        if (this._line != null) {
          this._line.isTouchable = true;
          this._line.isMovable = false;
        }
        if (this._midLine) {
          this._midLine.isMovable = false;
        }
        this.multiMove.bounds = translationBounds;
      } else {
        this.setMultiMovable(middleLengthPercent, translationBounds);
      }
    } else {
      this.isMovable = false;
    }
  }

  updateMoveTransform(t: Transform) {
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
    this.label = new LineLabel(
      this.equation, labelText, this.color,
      offset, location, subLocation, orientation, linePosition,
    );
    if (this.label != null) {
      this.add('label', this.label.eqn.collection);
    }
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
      this.vertexSpaceStart.x * this.currentLength + label.linePosition * this.currentLength,
      0,
    );
    let labelOffsetAngle = Math.PI / 2;
    const labelOffsetMag = label.offset;
    if (label.location === 'end1' || label.location === 'end2') {
      if (label.location === 'end1') {
        labelPosition.x = this.vertexSpaceStart.x * this.currentLength - label.offset;
        labelOffsetAngle = -Math.PI;
      }
      if (label.location === 'end2') {
        labelPosition.x = this.vertexSpaceStart.x * this.currentLength
          + this.currentLength + label.offset;
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
    let startOffset = 0;

    if (this.arrow1 && this._arrow1) {
      straightLineLength -= this.arrow1.height;
      startOffset = this.arrow1.height;
      this._arrow1.setPosition(lineStart);
    }
    if (this.arrow2 && this._arrow2) {
      straightLineLength -= this.arrow2.height;
      this._arrow2.setPosition(lineStart + lineLength, 0);
    }
    const line = this._line;
    if (line) {
      if (this.dashStyle) {
        line.lengthToDraw = straightLineLength;
        // const newStart = this.vertexSpaceStart.x * straightLineLength;
        // const delta = lineStart + startOffset - newStart;
        line.setPosition(lineStart + startOffset - this.vertexSpaceStart.x, 0);
      } else {
        line.transform.updateScale(straightLineLength, 1);
        const newStart = this.vertexSpaceStart.x * straightLineLength;
        const delta = lineStart + startOffset - newStart;
        line.setPosition(delta, 0);
      }
    }

    const midLine = this._midLine;
    if (midLine) {
      midLine.transform.updateScale(newLength, 1);
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
      const p1 = this.vertexSpaceStart.transformBy(new Transform()
        .scale(this.length)
        .rotate(this.angle)
        .translate(this.position)
        .m());
      const line = new Line(p1, this.length, this.angle);
      this.p1 = line.getPoint(1);
      this.p2 = line.getPoint(2);
      this.line = line;
    }
  }

  setLineDimensions() {
    const offset = polarToRect(this.offset, this.angle + Math.PI / 2);
    this.transform.updateTranslation(this.position.add(offset));
    this.transform.updateRotation(this.angle);
    this.setLength(this.length);
    this.updateLabel();
  }

  setEndPoints(p: Point, q: Point, offset: number = this.offset) {
    this.offset = offset;
    const { length, angle, position } = this.calculateFromP1P2(p, q);
    this.angle = angle;
    this.length = length;
    this.position = position;
    this.setLineDimensions();
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

  showLineOnly() {
    this.show();
    if (this._line) {
      this._line.show();
    }
    if (this._arrow1) {
      this._arrow1.show();
    }
    if (this._arrow2) {
      this._arrow2.show();
    }
    if (this._label) {
      this._label.hideAll();
    }
  }
}

export { DiagramObjectAngle };

// export type TypeLine = DiagramObjectLine;

// export type TypeMovableLine = MovableLine;
