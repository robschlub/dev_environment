// @flow
import {
  Point, Rect, Transform, Line, getMoveTime,
} from '../../tools/g2';
import { roundNum } from '../../tools/mathtools';
import { RGBToArray, duplicateFromTo } from '../../../tools/tools';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
import {
  DiagramText, DiagramFont, TextObject,
} from '../../DrawingObjects/TextObject/TextObject';
import DrawContext2D from '../../DrawContext2D';
import * as html from '../../../tools/htmlGenerator';
// import { TextObject } from './DrawingObjects/TextObject/TextObject';
import HTMLObject from '../../DrawingObjects/HTMLObject/HTMLObject';

// Equation is a class that takes a set of drawing objects (TextObjects,
// DiagramElementPrimatives or DiagramElementCollections and HTML Objects
// and arranges their size in a )

class BlankElement {
  ascent: number;
  descent: number;
  width: number;
  height: number;

  constructor(width: number = 0.03, ascent: number = 0, descent: number = 0) {
    this.width = width;
    this.ascent = ascent;
    this.descent = descent;
    this.height = this.ascent + this.descent;
  }
}

class Element {
  content: DiagramElementPrimative | DiagramElementCollection | BlankElement;
  ascent: number;
  descent: number;
  width: number;
  location: Point;
  height: number;
  scale: number;

  constructor(content: DiagramElementPrimative | DiagramElementCollection | BlankElement) {
    this.content = content;
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
    this.location = new Point(0, 0);
    this.height = 0;
  }

  calcSize(location: Point, scale: number) {
    const { content } = this;
    if (content instanceof BlankElement) {
      this.width = content.width * scale;
      this.height = content.height * scale;
      this.ascent = content.ascent * scale;
      this.descent = content.descent * scale;
      this.location = location._dup();
      this.scale = scale;
    }
    if (content instanceof DiagramElementCollection
        || content instanceof DiagramElementPrimative) {
      // Update translation and scale
      content.transform.updateTranslation(location.x, location.y);
      content.transform.updateScale(scale, scale);
      content.updateLastDrawTransform();

      // Get the boundaries of element
      // const t = content.lastDrawTransform._dup();
      // content.lastDrawTransform = content.transform._dup();
      const r = content.getRelativeVertexSpaceBoundingRect();
      // content.lastDrawTransform = t;
      this.location = location._dup();
      this.scale = scale;
      this.ascent = r.top * scale;
      this.descent = -r.bottom * scale;
      this.height = r.height * scale;
      this.width = r.width * scale;
      // console.log(this.height)
    }
  }

  _dup(namedCollection: Object) {
    let c;
    if (this.content instanceof BlankElement) {
      c = new Element(this.content);
    } else {
      c = new Element(namedCollection[this.content.name]);
    }
    c.ascent = this.ascent;
    c.descent = this.descent;
    c.width = this.width;
    c.location = this.location._dup();
    c.height = this.height;
    c.scale = this.scale;
    return c;
  }

  getAllElements() {
    if (this.content instanceof BlankElement) {
      return [];
    }
    return [this.content];
  }

  setPositions() {
    const { content } = this;
    if (content instanceof DiagramElementCollection
        || content instanceof DiagramElementPrimative) {
      content.transform.updateTranslation(this.location.x, this.location.y);
      content.transform.updateScale(this.scale, this.scale);
      content.updateLastDrawTransform();
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
  }
}

class Elements {
  content: Array<Element | Elements>;
  ascent: number;
  descent: number;
  width: number;
  location: Point;
  height: number;
  +getAllElements: () => Array<DiagramElementPrimative | DiagramElementCollection>;

  constructor(content: Array<Element | Elements | null>) {
    const nonNullContent = [];
    content.forEach((c) => {
      if (c !== null) {
        nonNullContent.push(c);
      }
    });
    this.content = nonNullContent;
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
    this.location = new Point(0, 0);
    this.height = 0;
  }

  _dup(namedCollection: Object) {
    const contentCopy = [];
    this.content.forEach(element => contentCopy.push(element._dup(namedCollection)));
    const c = new Elements(contentCopy);
    duplicateFromTo(this, c, ['content']);
    return c;
  }

  calcSize(location: Point, scale: number) {
    let des = 0;
    let asc = 0;
    const loc = location._dup();
    this.content.forEach((element) => {
      element.calcSize(loc, scale);

      loc.x += element.width;
      if (element.descent > des) {
        des = element.descent;
      }
      if (element.ascent > asc) {
        asc = element.ascent;
      }
    });
    this.width = loc.x - location.x;
    this.ascent = asc;
    this.descent = des;
    this.location = location._dup();
    this.height = this.descent + this.ascent;
  }

  getAllElements() {
    let elements = [];
    this.content.forEach((e) => {
      // if (e instanceof Element && !(e.content instanceof BlankElement)) {
      //   elements.push(e.content);
      // } else {
      elements = [...elements, ...e.getAllElements()];
      // }
    });
    return elements;
  }

  setPositions() {
    this.content.forEach((e) => {
      e.setPositions();
    });
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    this.content.forEach((e) => {
      e.offsetLocation(offset);
    });
  }
}

class Fraction extends Elements {
  numerator: Elements;
  denominator: Elements;
  vSpaceNum: number;
  vSpaceDenom: number;
  lineWidth: number;
  lineVAboveBaseline: number;
  vinculum: DiagramElementPrimative | null | DiagramElementCollection;
  // mini: boolean;
  scaleModifier: number
  vinculumPosition: Point;
  vinculumScale: Point;

  constructor(
    numerator: Elements,
    denominator: Elements,
    vinculum: DiagramElementPrimative | null | DiagramElementCollection,
  ) {
    if (vinculum) {
      super([numerator, denominator, new Element(vinculum)]);
    } else {
      super([numerator, denominator]);
    }
    this.vinculum = vinculum;
    this.numerator = numerator;
    this.denominator = denominator;

    this.vSpaceNum = 0;
    this.vSpaceDenom = 0;
    this.lineVAboveBaseline = 0;
    this.lineWidth = 0;
    // this.mini = false;
    this.scaleModifier = 1;
    this.vinculumPosition = new Point(0, 0);
    this.vinculumScale = new Point(1, 0.01);
  }

  _dup(namedCollection: Object) {
    let vinculum = null;
    if (this.vinculum != null) {
      vinculum = namedCollection[this.vinculum.name];
    }
    const fractionCopy = new Fraction(
      this.numerator._dup(namedCollection),
      this.denominator._dup(namedCollection),
      vinculum,
    );
    duplicateFromTo(this, fractionCopy, ['numerator', 'denominator', 'vinculum', 'content']);
    return fractionCopy;
  }

  calcSize(location: Point, incomingScale: number) {
    const scale = incomingScale * this.scaleModifier;
    this.location = location._dup();
    this.numerator.calcSize(location, scale);
    this.denominator.calcSize(location, scale);

    this.width = Math.max(this.numerator.width, this.denominator.width) * 1.3;

    const xNumerator = (this.width - this.numerator.width) / 2;
    const xDenominator = (this.width - this.denominator.width) / 2;
    this.vSpaceNum = scale * 0.05;
    this.vSpaceDenom = scale * 0.05;
    this.lineVAboveBaseline = scale * 0.07 / this.scaleModifier;
    this.lineWidth = Math.max(scale * 0.01, 0.008);

    const yNumerator = this.numerator.descent
                        + this.vSpaceNum + this.lineVAboveBaseline;

    const yDenominator = this.denominator.ascent
                         + this.vSpaceDenom - this.lineVAboveBaseline;

    const yScale = 1;

    const loc = this.location;
    this.numerator.calcSize(
      new Point(loc.x + xNumerator, loc.y + yScale * yNumerator),
      scale,
    );

    this.denominator.calcSize(
      new Point(loc.x + xDenominator, loc.y - yScale * yDenominator),
      scale,
    );

    this.descent = this.vSpaceNum + this.lineWidth / 2
                   - this.lineVAboveBaseline
                   + this.denominator.ascent + this.denominator.descent;
    this.ascent = this.vSpaceNum + this.lineWidth / 2
                  + this.lineVAboveBaseline + this.numerator.ascent
                  + this.numerator.descent;
    this.height = this.descent + this.ascent;

    const { vinculum } = this;
    if (vinculum) {
      this.vinculumPosition = new Point(
        this.location.x,
        this.location.y + this.lineVAboveBaseline,
      );
      this.vinculumScale = new Point(this.width, this.lineWidth);
      vinculum.transform.updateScale(this.vinculumScale);
      vinculum.transform.updateTranslation(this.vinculumPosition);

      vinculum.show();
    }
  }

  getAllElements() {
    let elements = [];
    if (this.numerator) {
      elements = [...elements, ...this.numerator.getAllElements()];
    }
    if (this.denominator) {
      elements = [...elements, ...this.denominator.getAllElements()];
    }
    if (this.vinculum) {
      elements = [...elements, this.vinculum];
    }
    return elements;
  }

  setPositions() {
    this.numerator.setPositions();
    this.denominator.setPositions();
    const { vinculum } = this;
    if (vinculum) {
      vinculum.transform.updateScale(this.vinculumScale);
      vinculum.transform.updateTranslation(this.vinculumPosition);
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    this.numerator.offsetLocation(offset);
    this.denominator.offsetLocation(offset);
    this.vinculumPosition = this.vinculumPosition.add(offset);
  }
}

class StrikeOut extends Elements {
  mainContent: Elements;
  strike: DiagramElementPrimative | null | DiagramElementCollection;
  scaleModifier: number;
  lineWidth: number;
  strikeScale: Point;
  strikeRotation: number;
  strikePosition: Point;
  strikeInSize: boolean;

  constructor(
    mainContent: Elements,
    strike: DiagramElementPrimative | null | DiagramElementCollection,
    strikeInSize: boolean = false,
  ) {
    if (strike) {
      super([mainContent, new Element(strike)]);
    } else {
      super([mainContent]);
    }
    this.strike = strike;
    this.scaleModifier = 1;
    this.lineWidth = 0.1;
    this.mainContent = mainContent;
    this.strikeInSize = strikeInSize;
  }

  _dup(namedCollection: Object) {
    let strike = null;
    if (this.strike != null) {
      strike = namedCollection[this.strike.name];
    }
    const strikeOutCopy = new StrikeOut(
      this.mainContent._dup(namedCollection),
      strike,
    );
    duplicateFromTo(this, strikeOutCopy, ['strike', 'mainContent']);
    return strikeOutCopy;
  }

  calcSize(location: Point, incomingScale: number) {
    const scale = incomingScale * this.scaleModifier;
    this.location = location._dup();
    this.mainContent.calcSize(location, scale);
    this.lineWidth = scale * 0.02;
    const lineExtension = this.lineWidth * 1;
    const bottomLeft = new Point(
      location.x,
      location.y - this.mainContent.descent,
    );
    const topRight = new Point(
      location.x + this.mainContent.width,
      location.y + this.mainContent.ascent * 0.8,
    );
    const strikeLine = new Line(bottomLeft, topRight);
    const strikeBottomLeft = new Line(
      bottomLeft, lineExtension,
      strikeLine.angle() + Math.PI,
    ).getPoint(2);

    const strikeLength = strikeLine.length() + lineExtension * 2;
    if (this.strikeInSize) {
      const strikeTopRight = new Line(
        topRight, lineExtension,
        strikeLine.angle(),
      ).getPoint(2);
      this.width = strikeTopRight.x - strikeBottomLeft.x;
      this.ascent = Math.max(this.mainContent.ascent, strikeTopRight.y - location.y);
      this.descent = Math.max(this.mainContent.descent, location.y - strikeBottomLeft.y);
      const xOffset = this.mainContent.location.x - strikeBottomLeft.x;
      this.mainContent.offsetLocation(new Point(xOffset, 0));
      strikeBottomLeft.x += xOffset;
    } else {
      this.width = this.mainContent.width;
      this.ascent = this.mainContent.ascent;
      this.descent = this.mainContent.descent;
    }
    this.height = this.descent + this.ascent;

    const { strike } = this;
    if (strike) {
      if (strike instanceof DiagramElementCollection) {
        this.strikePosition = strikeBottomLeft._dup();
        this.strikeScale = new Point(strikeLength, this.lineWidth * 0.8);
        this.strikeRotation = strikeLine.angle();
        const width = this.strikeScale.x * Math.cos(this.strikeRotation);
        // $FlowFixMe
        strike._s1.transform.updateScale(this.strikeScale);
        // $FlowFixMe
        strike._s1.transform.updateTranslation(this.strikePosition);
        // $FlowFixMe
        strike._s1.transform.updateRotation(this.strikeRotation);
        // $FlowFixMe
        strike._s2.transform.updateScale(this.strikeScale);
        // $FlowFixMe
        strike._s2.transform.updateTranslation(this.strikePosition.add(width, 0));
        // $FlowFixMe
        strike._s2.transform.updateRotation(Math.PI - this.strikeRotation);
        strike.showAll();
      } else {
        this.strikePosition = strikeBottomLeft._dup();
        this.strikeScale = new Point(strikeLength, this.lineWidth);
        this.strikeRotation = strikeLine.angle();
        strike.transform.updateScale(this.strikeScale);
        strike.transform.updateTranslation(this.strikePosition);
        strike.transform.updateRotation(this.strikeRotation);
        strike.show();
      }
    }
  }

  getAllElements() {
    let elements = [];
    if (this.mainContent) {
      elements = [...elements, ...this.mainContent.getAllElements()];
    }
    if (this.strike) {
      elements = [...elements, this.strike];
    }
    return elements;
  }

  setPositions() {
    this.mainContent.setPositions();
    const { strike } = this;
    if (strike) {
      if (strike instanceof DiagramElementCollection) {
        const width = this.strikeScale.x * Math.cos(this.strikeRotation);
        // $FlowFixMe
        strike._s1.transform.updateScale(this.strikeScale);
        // $FlowFixMe
        strike._s1.transform.updateTranslation(this.strikePosition);
        // $FlowFixMe
        strike._s1.transform.updateRotation(this.strikeRotation);
        // $FlowFixMe
        strike._s2.transform.updateScale(this.strikeScale);
        // $FlowFixMe
        strike._s2.transform.updateTranslation(this.strikePosition.add(width, 0));
        // $FlowFixMe
        strike._s2.transform.updateRotation(Math.PI - this.strikeRotation);
      } else {
        strike.transform.updateScale(this.strikeScale);
        strike.transform.updateTranslation(this.strikePosition);
        strike.transform.updateRotation(this.strikeRotation);
      }
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    this.mainContent.offsetLocation(offset);
    this.strikePosition = this.strikePosition.add(offset);
  }
}


export class AnnotationInformation {
  content: Elements;
  xPosition: 'left' | 'right' | 'center' | number;
  yPosition: 'bottom' | 'top' | 'middle' | 'baseline' | number;
  xAlign: 'left' | 'right' | 'center' | number;
  yAlign: 'bottom' | 'top' | 'middle' | 'baseline' | number;
  annotationScale: number;

  constructor(
    content: Elements,
    xPosition: 'left' | 'right' | 'center' | number = 'right',
    yPosition: 'bottom' | 'top' | 'middle' | 'baseline' | number = 'top',
    xAlign: 'left' | 'right' | 'center' | number = 'left',
    yAlign: 'bottom' | 'top' | 'middle' | 'baseline' | number = 'bottom',
    annotationScale: number = 0.5,
  ) {
    this.content = content;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.xAlign = xAlign;
    this.yAlign = yAlign;
    this.annotationScale = annotationScale;
  }
}
// Create an annotation to a set of Elements
// x/yPosition: annotation location relative to mainContent
// x/yAlign: annotation alignment relative to its location
// Position and Align can be words or numbers where:
//    left: 0
//    right: 1
//    center: 0.5
//    bottom: 0
//    top: 1
//    middle: 0.5
//    baseline: descent / height
//    numbers can be anything (not just between 0 and 1)
//      For example, xPosition of -1 would position the annotation
//      one mainContent width to the left of the mainContent left point
class Annotation extends Elements {
  mainContent: Elements;
  annotations: Array<AnnotationInformation>;
  xPosition: 'left' | 'right' | 'center' | number;
  yPosition: 'bottom' | 'top' | 'middle' | 'baseline' | number;
  xAlign: 'left' | 'right' | 'center' | number;
  yAlign: 'bottom' | 'top' | 'middle' | 'baseline' | number;
  annotationInSize: boolean;
  annotationScale: number;

  constructor(
    mainContent: Elements,
    annotationOrAnnotationArray: Elements | Array<AnnotationInformation>,
    xPositionOrAnnotationInSize: 'left' | 'right' | 'center' | number | boolean = 'right',
    yPosition: 'bottom' | 'top' | 'middle' | 'baseline' | number = 'top',
    xAlign: 'left' | 'right' | 'center' | number = 'left',
    yAlign: 'bottom' | 'top' | 'middle' | 'baseline' | number = 'bottom',
    annotationScale: number = 0.5,
    annotationInSize: boolean = false,
  ) {
    if (Array.isArray(annotationOrAnnotationArray)) {
      const annotationElements = [mainContent];
      annotationOrAnnotationArray.forEach((annotationInfo) => {
        annotationElements.push(annotationInfo.content);
      });
      super(annotationElements);
    } else {
      super([mainContent, annotationOrAnnotationArray]);
    }
    // super([mainContent, annotation]);
    this.mainContent = mainContent;
    this.annotations = [];
    if (Array.isArray(annotationOrAnnotationArray)) {
      this.annotations = annotationOrAnnotationArray;
      if (typeof xPositionOrAnnotationInSize === 'boolean') {
        this.annotationInSize = xPositionOrAnnotationInSize;
      } else {
        this.annotationInSize = false;
      }
    } else {
      let xPosition = 'right';
      if (typeof xPositionOrAnnotationInSize !== 'boolean') {
        xPosition = xPositionOrAnnotationInSize;
      }
      this.annotations = [new AnnotationInformation(
        annotationOrAnnotationArray,
        xPosition,
        yPosition,
        xAlign,
        yAlign,
        annotationScale,
      )];
      this.annotationInSize = annotationInSize;
    }
  }

  _dup(namedCollection: Object) {
    // const annotationsCopy = [];
    const annotationsCopy =
      this.annotations.map(annotationInfo => new AnnotationInformation(
        annotationInfo.content._dup(namedCollection),
        annotationInfo.xPosition,
        annotationInfo.yPosition,
        annotationInfo.xAlign,
        annotationInfo.yAlign,
        annotationInfo.annotationScale,
      ));
    const annotationCopy = new Annotation(
      this.mainContent._dup(namedCollection),
      annotationsCopy,
      this.annotationInSize,
    );
    duplicateFromTo(this, annotationCopy, ['mainContent', 'annotations']);
    return annotationCopy;
  }

  calcSize(location: Point, incomingScale: number) {
    this.location = location._dup();
    this.mainContent.calcSize(location, incomingScale);
    let minX = this.mainContent.location.x;
    let minY = this.mainContent.location.y - this.mainContent.descent;
    let maxX = this.mainContent.location.x + this.mainContent.width;
    let maxY = this.mainContent.location.y + this.mainContent.ascent;
    this.annotations.forEach((annotationInfo) => {
      const annotation = annotationInfo.content;
      const {
        xPosition, yPosition, xAlign,
        yAlign, annotationScale,
      } = annotationInfo;
      annotation.calcSize(location, incomingScale * annotationScale);

      const annotationLoc = this.location._dup();
      let xPos = 0;
      let yPos = this.mainContent.descent / this.mainContent.height;
      if (xPosition === 'right') {
        xPos = 1;
      } else if (xPosition === 'center') {
        xPos = 0.5;
      } else if (typeof xPosition === 'number') {
        xPos = xPosition;
      }
      annotationLoc.x += this.mainContent.width * xPos;

      if (yPosition === 'bottom') {
        yPos = 0;
      } else if (yPosition === 'top') {
        yPos = 1;
      } else if (yPosition === 'middle') {
        yPos = 0.5;
      } else if (typeof yPosition === 'number') {
        yPos = yPosition;
      }

      annotationLoc.y += -this.mainContent.descent + this.mainContent.height * yPos;

      let xOffset = 0;
      let yOffset = annotation.descent / annotation.height;
      if (xAlign === 'right') {
        xOffset = 1;
      } else if (xAlign === 'center') {
        xOffset = 0.5;
      } else if (typeof xAlign === 'number') {
        xOffset = xAlign;
      }

      if (yAlign === 'bottom') {
        yOffset = 0;
      } else if (yAlign === 'top') {
        yOffset = 1;
      } else if (yAlign === 'middle') {
        yOffset = 0.5;
      } else if (typeof yAlign === 'number') {
        yOffset = yAlign;
      }

      const annotationOffset = new Point(
        -xOffset * annotation.width,
        annotation.descent - yOffset * annotation.height,
      );

      annotation.calcSize(annotationLoc, incomingScale * annotationScale);
      annotation.offsetLocation(annotationOffset);

      const annotationMaxX = annotation.location.x + annotation.width;
      const annotationMaxY = annotation.location.y + annotation.ascent;
      const annotationMinX = annotation.location.x;
      const annotationMinY = annotation.location.y - annotation.descent;
      maxX = annotationMaxX > maxX ? annotationMaxX : maxX;
      maxY = annotationMaxY > maxY ? annotationMaxY : maxY;
      minX = annotationMinX < minX ? annotationMinX : minX;
      minY = annotationMinY < minY ? annotationMinY : minY;
    });

    if (this.annotationInSize) {
      const bottomLeft = new Point(minX, minY);
      const topRight = new Point(maxX, maxY);
      this.width = topRight.x - bottomLeft.x;
      this.ascent = topRight.y - this.mainContent.location.y;
      this.descent = this.mainContent.location.y - bottomLeft.y;

      const xOffset = this.mainContent.location.x - bottomLeft;
      if (xOffset) {
        this.mainContent.offsetLocation(new Point(xOffset, 0));
        this.annotations = this.annotations.map(
          annotationInfo => annotationInfo.content
            .offsetLocation(new Point(xOffset, 0)),
        );
      }
    } else {
      this.width = this.mainContent.width;
      this.ascent = this.mainContent.ascent;
      this.descent = this.mainContent.descent;
    }
    this.height = this.descent + this.ascent;
  }

  getAllElements() {
    let elements = [];
    if (this.mainContent) {
      elements = [...elements, ...this.mainContent.getAllElements()];
    }
    this.annotations.forEach((annotationInfo) => {
      elements = [...elements, ...annotationInfo.content.getAllElements()];
    });
    return elements;
  }

  setPositions() {
    this.mainContent.setPositions();
    this.annotations.forEach((annotationInfo) => {
      annotationInfo.content.setPositions();
    });
    // this.annotation.setPositions();
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    this.mainContent.offsetLocation(offset);
    this.annotations.forEach((annotationInfo) => {
      annotationInfo.content.offsetLocation(offset);
    });
    // this.annotation.offsetLocation(offset);
  }
}

class SuperSub extends Elements {
  superscript: Elements | null;
  subscript: Elements | null;
  mainContent: Elements;
  subscriptXBias: number;
  xBias: number;

  constructor(
    content: Elements,
    superscript: Elements | null,
    subscript: Elements | null,
    xBias: number = 0,
    subscriptXBias: number = 0,
  ) {
    super([content, superscript, subscript]);

    this.superscript = superscript;
    this.subscript = subscript;
    this.subscriptXBias = subscriptXBias;
    this.mainContent = content;
    this.xBias = xBias;
  }

  _dup(namedCollection: Object) {
    const superscript = this.superscript == null ? null : this.superscript._dup(namedCollection);
    const subscript = this.subscript == null ? null : this.subscript._dup(namedCollection);
    const superSubCopy = new SuperSub(
      this.mainContent._dup(namedCollection),
      superscript,
      subscript,
      this.xBias,
      this.subscriptXBias,
    );
    duplicateFromTo(this, superSubCopy, ['mainContent', 'superscript', 'subscript', 'content']);
    return superSubCopy;
  }

  calcSize(location: Point, scale: number) {
    this.location = location._dup();
    const loc = location._dup();
    this.mainContent.calcSize(loc, scale);
    let w = this.mainContent.width;
    let asc = this.mainContent.ascent;
    let des = this.mainContent.descent;

    const { superscript } = this;
    if (superscript !== null) {
      const superLoc = new Point(
        this.location.x + this.mainContent.width + this.xBias,
        this.location.y + this.mainContent.ascent * 0.7,
      );
      superscript.calcSize(superLoc, scale / 2);
      w = Math.max(
        w,
        superLoc.x - this.location.x + superscript.width,
      );
      asc = Math.max(
        asc,
        superscript.ascent + superLoc.y - this.location.y,
      );
      des = Math.max(
        des,
        this.location.y - (superLoc.y - superscript.descent),
      );
    }

    const { subscript } = this;
    if (subscript !== null) {
      // TODO - y location should be minus the height of an "m" or "a" not
      // the height of the main content.
      const subLoc = new Point(
        this.location.x + this.mainContent.width - this.subscriptXBias + this.xBias,
        this.location.y - this.mainContent.height * 0.5,
      );
      subscript.calcSize(subLoc, scale / 2);
      w = Math.max(
        w,
        subLoc.x - this.location.x + subscript.width,
      );
      asc = Math.max(asc, subscript.ascent + subLoc.y - this.location.y);
      des = Math.max(des, subscript.descent + (this.location.y - subLoc.y));
    }
    this.width = w;
    this.ascent = asc;
    this.descent = des;
    this.height = this.descent + this.ascent;
  }

  getAllElements() {
    let elements = [];
    if (this.superscript) {
      elements = [...elements, ...this.superscript.getAllElements()];
    }
    if (this.subscript) {
      elements = [...elements, ...this.subscript.getAllElements()];
    }
    if (this.mainContent) {
      elements = [...elements, ...this.mainContent.getAllElements()];
    }
    return elements;
  }

  setPositions() {
    this.mainContent.setPositions();
    if (this.superscript) {
      this.superscript.setPositions();
    }
    if (this.subscript) {
      this.subscript.setPositions();
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    this.mainContent.offsetLocation(offset);
    if (this.superscript) {
      this.superscript.offsetLocation(offset);
    }
    if (this.subscript) {
      this.subscript.offsetLocation(offset);
    }
  }
}

class Bounds {
  width: number;
  height: number;
  ascent: number;
  descent: number;
  constructor() {
    this.width = 0;
    this.height = 0;
    this.ascent = 0;
    this.descent = 0;
  }
}

class Integral extends Elements {
  limitMin: Elements | null;
  limitMax: Elements | null;
  mainContent: Elements | null;
  integralGlyph: DiagramElementPrimative | DiagramElementCollection | null;
  glyphLocation: Point;
  glyphScale: number;

  constructor(
    limitMin: Elements | null,
    limitMax: Elements | null,
    content: Elements | null,
    integralGlyph: DiagramElementPrimative | null | DiagramElementCollection,
  ) {
    const glyph = integralGlyph !== null ? new Element(integralGlyph) : null;
    super([glyph, limitMin, limitMax, content]);

    this.limitMin = limitMin;
    this.limitMax = limitMax;
    this.mainContent = content;
    this.integralGlyph = integralGlyph;
    this.glyphLocation = new Point(0, 0);
    this.glyphScale = 1;
  }

  _dup(namedCollection: Object) {
    const limitMin = this.limitMin == null ? null : this.limitMin._dup(namedCollection);
    const limitMax = this.limitMax == null ? null : this.limitMax._dup(namedCollection);
    const content = this.mainContent == null ? null : this.mainContent._dup(namedCollection);
    const glyph = this.integralGlyph == null ? null : namedCollection[this.integralGlyph.name];
    const integralCopy = new Integral(
      limitMin,
      limitMax,
      content,
      glyph,
    );
    duplicateFromTo(
      this, integralCopy,
      ['limitMin', 'limitMax', 'content', 'integralGlyph', 'content'],
    );
    return integralCopy;
  }

  getAllElements() {
    let elements = [];
    if (this.limitMin) {
      elements = [...elements, ...this.limitMin.getAllElements()];
    }
    if (this.limitMax) {
      elements = [...elements, ...this.limitMax.getAllElements()];
    }
    if (this.mainContent) {
      elements = [...elements, ...this.mainContent.getAllElements()];
    }
    if (this.integralGlyph) {
      elements = [...elements, this.integralGlyph];
    }
    return elements;
  }

  setPositions() {
    const { integralGlyph } = this;
    if (integralGlyph != null) {
      integralGlyph.transform.updateScale(this.glyphScale, this.glyphScale);
      integralGlyph.transform.updateTranslation(
        this.glyphLocation.x,
        this.glyphLocation.y,
      );
    }
    if (this.limitMin) {
      this.limitMin.setPositions();
    }
    if (this.limitMax) {
      this.limitMax.setPositions();
    }
    if (this.mainContent) {
      this.mainContent.setPositions();
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    const { integralGlyph } = this;
    if (integralGlyph != null) {
      this.glyphLocation = this.glyphLocation.add(offset);
    }
    if (this.mainContent) {
      this.mainContent.offsetLocation(offset);
    }
    if (this.limitMax) {
      this.limitMax.offsetLocation(offset);
    }
    if (this.limitMin) {
      this.limitMin.offsetLocation(offset);
    }
  }

  calcSize(location: Point, scale: number) {
    this.location = location._dup();
    const loc = location._dup();
    const contentBounds = new Bounds();
    const limitMinBounds = new Bounds();
    const limitMaxBounds = new Bounds();
    const integralGlyphBounds = new Bounds();

    const { mainContent } = this;
    if (mainContent instanceof Elements) {
      mainContent.calcSize(loc._dup(), scale);
      contentBounds.width = mainContent.width;
      contentBounds.height = mainContent.ascent + mainContent.descent;
      contentBounds.ascent = mainContent.ascent;
      contentBounds.descent = mainContent.descent;
    }

    const { limitMax } = this;
    if (limitMax instanceof Elements) {
      limitMax.calcSize(loc._dup(), scale / 2);
      limitMaxBounds.width = limitMax.width;
      limitMaxBounds.height = limitMax.ascent + limitMax.descent;
      limitMaxBounds.ascent = limitMax.ascent;
      limitMaxBounds.descent = limitMax.descent;
    }

    const { limitMin } = this;
    if (limitMin instanceof Elements) {
      limitMin.calcSize(loc._dup(), scale / 2);
      limitMinBounds.width = limitMin.width;
      limitMinBounds.height = limitMin.ascent + limitMin.descent;
      limitMinBounds.ascent = limitMin.ascent;
      limitMinBounds.descent = limitMin.descent;
    }

    const integralMinHeight = contentBounds.ascent + contentBounds.descent
                              + limitMinBounds.height + limitMaxBounds.height;
    const numLines = roundNum(integralMinHeight / scale, 0);
    const height = numLines * scale * 1.2;
    const integralSymbolLocation = new Point(
      loc.x,
      loc.y - height / 2 + scale * 0.45,
    );

    const { integralGlyph } = this;
    if (integralGlyph instanceof DiagramElementPrimative) {
      integralGlyph.show();
      integralGlyph.transform.updateScale(
        height,
        height,
      );
      integralGlyph.transform.updateTranslation(
        integralSymbolLocation.x,
        integralSymbolLocation.y,
      );
      this.glyphLocation = integralSymbolLocation;
      this.glyphScale = height;
      const bounds = integralGlyph.vertices
        .getRelativeVertexSpaceBoundingRect();
        // .getRelativeGLBoundingRect(integralGlyph.transform.matrix());
      integralGlyphBounds.width = (bounds.width) * height;
      integralGlyphBounds.height = (-bounds.bottom + bounds.top) * height;
      integralGlyphBounds.ascent = bounds.top * height;
      integralGlyphBounds.descent = (-bounds.bottom) * height;
    }

    const minLimitLocation = new Point(
      this.location.x + integralGlyphBounds.width * 0.5,
      integralSymbolLocation.y,
    );

    const maxLimitLocation = new Point(
      this.location.x + integralGlyphBounds.width * 1.2,
      integralSymbolLocation.y + integralGlyphBounds.height - limitMaxBounds.height / 2,
    );

    const contentLocation = new Point(
      this.location.x + integralGlyphBounds.width * 0.8,
      this.location.y,
    );

    if (mainContent instanceof Elements) {
      mainContent.calcSize(contentLocation, scale);
    }
    if (limitMin instanceof Elements) {
      limitMin.calcSize(minLimitLocation, scale / 2);
    }
    if (limitMax instanceof Elements) {
      limitMax.calcSize(maxLimitLocation, scale / 2);
    }

    this.width = Math.max(
      integralGlyphBounds.width,
      limitMinBounds.width + minLimitLocation.x - this.location.x,
      limitMaxBounds.width + maxLimitLocation.x - this.location.x,
      contentBounds.width + contentLocation.x - this.location.x,
    );
    this.ascent = Math.max(
      integralGlyphBounds.ascent,
      limitMaxBounds.ascent + maxLimitLocation.y - this.location.y,
      contentBounds.ascent + contentLocation.y - this.location.y,
    );

    this.descent = Math.max(
      integralGlyphBounds.descent,
      limitMinBounds.descent + this.location.y - minLimitLocation.y,
      contentBounds.ascent + this.location.y - contentLocation.y,
    );

    this.height = this.descent + this.ascent;
  }
}


class Brackets extends Elements {
  mainContent: Elements | null;
  glyph: DiagramElementPrimative | DiagramElementCollection | null;
  rightGlyph: DiagramElementPrimative | DiagramElementCollection | null;
  glyphLocation: Point;
  rightGlyphLocation: Point;
  glyphScale: number;
  space: number;

  constructor(
    content: Elements | null,
    glyph: DiagramElementPrimative | null | DiagramElementCollection,
    rightGlyph: DiagramElementPrimative | null | DiagramElementCollection,
    space: number = 0.03,
  ) {
    const left = glyph !== null ? new Element(glyph) : null;
    const right = rightGlyph !== null ? new Element(rightGlyph) : null;
    super([left, content, right]);
    this.glyph = glyph;
    this.rightGlyph = rightGlyph;
    this.mainContent = content;
    this.glyphLocation = new Point(0, 0);
    this.rightGlyphLocation = new Point(0, 0);
    this.glyphScale = 1;
    this.space = space;
  }

  _dup(namedCollection: Object) {
    const content = this.mainContent == null ? null : this.mainContent._dup(namedCollection);
    const lglyph = this.glyph == null ? null : namedCollection[this.glyph.name];
    const rglyph = this.rightGlyph == null ? null : namedCollection[this.rightGlyph.name];
    const bracketCopy = new Brackets(
      content,
      lglyph,
      rglyph,
      this.space,
    );
    duplicateFromTo(
      this, bracketCopy,
      ['content', 'glyph', 'rightGlyph'],
    );
    // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());
    return bracketCopy;
  }

  getAllElements() {
    let elements = [];
    if (this.mainContent) {
      elements = [...elements, ...this.mainContent.getAllElements()];
    }
    if (this.glyph) {
      elements = [...elements, this.glyph];
    }
    if (this.rightGlyph) {
      elements = [...elements, this.rightGlyph];
    }
    // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());
    return elements;
  }

  setPositions() {
    const { glyph, rightGlyph } = this;
    if (glyph != null) {
      glyph.transform.updateScale(this.glyphScale, this.glyphScale);
      glyph.transform.updateTranslation(
        this.glyphLocation.x,
        this.glyphLocation.y,
      );
    }
    if (rightGlyph != null) {
      rightGlyph.transform.updateScale(this.glyphScale, this.glyphScale);
      rightGlyph.transform.updateTranslation(
        this.rightGlyphLocation.x,
        this.rightGlyphLocation.y,
      );
    }
    if (this.mainContent) {
      this.mainContent.setPositions();
    }
  }

  offsetLocation(offset: Point = new Point(0, 0)) {
    this.location = this.location.add(offset);
    const { glyph, rightGlyph } = this;
    if (glyph != null) {
      this.glyphLocation = this.glyphLocation.add(offset);
    }
    if (rightGlyph != null) {
      this.rightGlyphLocation = this.rightGlyphLocation.add(offset);
    }
    if (this.mainContent) {
      this.mainContent.offsetLocation(offset);
    }
    // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());
  }

  calcSize(location: Point, scale: number) {
    this.location = location._dup();
    const loc = location._dup();
    const contentBounds = new Bounds();
    const glyphBounds = new Bounds();
    const rightGlyphBounds = new Bounds();

    const { mainContent } = this;
    if (mainContent instanceof Elements) {
      mainContent.calcSize(loc._dup(), scale);
      contentBounds.width = mainContent.width;
      contentBounds.height = mainContent.ascent + mainContent.descent;
      contentBounds.ascent = mainContent.ascent;
      contentBounds.descent = mainContent.descent;
    }

    const heightScale = 1.4;
    const height = contentBounds.height * heightScale;
    const bracketScale = height;

    const glyphDescent = contentBounds.descent
        + contentBounds.height * (heightScale - 1) / 1.8;
    const leftSymbolLocation = new Point(
      loc.x + this.space * scale,
      loc.y - glyphDescent,
    );
    const { glyph } = this;
    if (glyph instanceof DiagramElementPrimative) {
      glyph.show();
      glyph.transform.updateScale(
        bracketScale,
        bracketScale,
      );
      glyph.transform.updateTranslation(
        leftSymbolLocation.x,
        leftSymbolLocation.y,
      );
      this.glyphLocation = leftSymbolLocation;
      this.glyphScale = bracketScale;
      const bounds = glyph.vertices
        .getRelativeVertexSpaceBoundingRect();
      glyphBounds.width = bounds.width * bracketScale;
      glyphBounds.height = (-bounds.bottom + bounds.top) * bracketScale;
      glyphBounds.ascent = (bounds.top) * bracketScale;
      glyphBounds.descent = (-bounds.bottom) * bracketScale;
    }

    const rightSymbolLocation = new Point(
      loc.x + contentBounds.width + glyphBounds.width
        + this.space * 3 * scale,
      leftSymbolLocation.y,
    );
    const { rightGlyph } = this;
    if (rightGlyph instanceof DiagramElementPrimative) {
      rightGlyph.show();
      rightGlyph.transform.updateScale(
        bracketScale,
        bracketScale,
      );
      rightGlyph.transform.updateTranslation(
        rightSymbolLocation.x,
        rightSymbolLocation.y,
      );
      this.rightGlyphLocation = rightSymbolLocation;
      const bounds = rightGlyph.vertices
        .getRelativeVertexSpaceBoundingRect();
      rightGlyphBounds.width = bounds.width * bracketScale;
      rightGlyphBounds.height = (-bounds.bottom + bounds.top) * bracketScale;
      rightGlyphBounds.ascent = (bounds.top) * bracketScale;
      rightGlyphBounds.descent = (-bounds.bottom) * bracketScale;
    }
    const contentLocation = new Point(
      this.location.x + glyphBounds.width + this.space * scale * 2,
      this.location.y,
    );

    if (mainContent instanceof Elements) {
      mainContent.offsetLocation(contentLocation.sub(mainContent.location));
    }

    this.width = glyphBounds.width + contentBounds.width
      + rightGlyphBounds.width + this.space * scale * 4;
    this.ascent = glyphBounds.height - glyphDescent;
    this.descent = glyphDescent;
    this.height = this.descent + this.ascent;
    // console.log(this.glyphLocation, this.rightGlyphLocation)
    // console.log(this.glyph.getPosition()._dup(), this.rightGlyph.getPosition()._dup());
  }
}

class Bar extends Brackets {
  barPosition: 'top' | 'bottom';
  outsideSpace: number;

  constructor(
    content: Elements | null,
    barGlyph: DiagramElementPrimative | null | DiagramElementCollection,
    space: number = 0.03,
    outsideSpace: number = 0.03, 
    barPosition: 'top' | 'bottom' = 'top',
  ) {
    super(content, barGlyph, null, space);
    this.barPosition = barPosition;
    this.outsideSpace = outsideSpace;
  }

  calcSize(location: Point, scale: number) {
    this.location = location._dup();
    const loc = location._dup();
    const contentBounds = new Bounds();
    const glyphBounds = new Bounds();

    const { mainContent } = this;
    if (mainContent instanceof Elements) {
      mainContent.calcSize(loc._dup(), scale);
      contentBounds.width = mainContent.width;
      contentBounds.height = mainContent.ascent + mainContent.descent;
      contentBounds.ascent = mainContent.ascent;
      contentBounds.descent = mainContent.descent;
    }

    const widthScale = 1;
    const width = contentBounds.width * widthScale;
    const bracketScale = width;

    const leftSymbolLocation = new Point(
      loc.x - (widthScale - 1) * width / 2,
      loc.y + contentBounds.ascent + this.space * scale,
    );
    if (this.barPosition === 'bottom') {
      leftSymbolLocation.y = loc.y - contentBounds.descent - this.space * scale;
    }
    const { glyph } = this;
    if (glyph instanceof DiagramElementPrimative) {
      glyph.show();
      glyph.transform.updateScale(
        bracketScale,
        bracketScale,
      );
      glyph.transform.updateTranslation(
        leftSymbolLocation.x,
        leftSymbolLocation.y,
      );
      this.glyphLocation = leftSymbolLocation;
      this.glyphScale = bracketScale;
      const bounds = glyph.vertices
        .getRelativeVertexSpaceBoundingRect();
      glyphBounds.width = bounds.width * bracketScale;
      glyphBounds.height = (-bounds.bottom + bounds.top) * bracketScale;
      glyphBounds.ascent = (bounds.top) * bracketScale;
      glyphBounds.descent = (-bounds.bottom) * bracketScale;
    }
    this.width = contentBounds.width;
    if (this.barPosition === 'top') {
      this.ascent = contentBounds.ascent + glyphBounds.height
        + this.space * scale + this.outsideSpace * scale;
      this.descent = contentBounds.descent;
    } else {
      this.ascent = contentBounds.ascent;
      this.descent = contentBounds.descent + glyphBounds.height
        + this.space * scale + this.outsideSpace * scale;
    }
    this.height = this.descent + this.ascent;
  }
}

export function getDiagramElement(
  collection: DiagramElementCollection,
  name: string | DiagramElementPrimative | DiagramElementCollection,
): DiagramElementPrimative | DiagramElementCollection | null {
  if (typeof name === 'string') {
    if (collection && `_${name}` in collection) {
    // $FlowFixMe
      return collection[`_${name}`];
    }
    return null;
  }
  return name;
}

type TypeEquationInput = Array<Elements | Element | string> | Elements | Element | string;

export function createEquationElements(
  elems: Object,
  drawContext2D: DrawContext2D,
  colorOrFont: Array<number> | DiagramFont = [],
  diagramLimits: Rect = new Rect(-1, -1, 2, 2),
  firstTransform: Transform = new Transform(),
) {
  let color = [1, 1, 1, 1];
  if (Array.isArray(colorOrFont)) {
    color = colorOrFont.slice();
  }
  let font = new DiagramFont(
    'Times New Roman',
    'normal',
    0.2,
    '200',
    'left',
    'alphabetic',
    color,
  );
  let fontItalic = new DiagramFont(
    'Times New Roman',
    'italic',
    0.2,
    '200',
    'left',
    'alphabetic',
    color,
  );
  if (colorOrFont instanceof DiagramFont) {
    font = colorOrFont._dup();
    font.style = 'normal';
    fontItalic = colorOrFont._dup();
    fontItalic.style = 'italic';
    if (font.color != null) {
      color = RGBToArray(font.color);
    }
  }

  const collection = new DiagramElementCollection(
    new Transform('Equation Elements Collection').scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits,
  );
  const makeElem = (text: string, fontOrStyle: DiagramFont | string | null) => {
    let fontToUse: DiagramFont = font;
    if (fontOrStyle instanceof DiagramFont) {
      fontToUse = fontOrStyle;
    } else if (fontOrStyle === 'italic') {
      fontToUse = fontItalic;
    } else if (fontOrStyle === 'normal') {
      fontToUse = font;
    } else if (text.match(/[A-Z,a-z]/)) {
      fontToUse = fontItalic;
    }
    const dT = new DiagramText(new Point(0, 0), text, fontToUse);
    const to = new TextObject(drawContext2D, [dT]);
    const p = new DiagramElementPrimative(
      to,
      new Transform('Equation Element').scale(1, 1).translate(0, 0),
      color,
      diagramLimits,
    );
    return p;
  };
  Object.keys(elems).forEach((key) => {
    if (typeof elems[key] === 'string') {
      if (key !== 'space') {
        collection.add(key, makeElem(elems[key], null));
      }
    }
    if (elems[key] instanceof DiagramElementPrimative) {
      collection.add(key, elems[key]);
    }
    if (elems[key] instanceof DiagramElementCollection) {
      collection.add(key, elems[key]);
    }
    if (Array.isArray(elems[key])) {
      const [text, col, isTouchable, onClick, direction, mag, fontOrStyle] = elems[key];
      const elem = makeElem(text, fontOrStyle);
      if (col) {
        elem.setColor(col);
      }
      if (isTouchable) {
        elem.isTouchable = isTouchable;
      }
      if (onClick) {
        elem.onClick = onClick;
      }
      if (direction) {
        elem.animate.transform.translation.style = 'curved';
        elem.animate.transform.translation.options.direction = direction;
      }

      if (mag) {
        elem.animate.transform.translation.style = 'curved';
        elem.animate.transform.translation.options.magnitude = mag;
      }

      collection.add(key, elem);
    }
  });

  collection.setFirstTransform(firstTransform);
  return collection;
}


export function contentToElement(
  collection: DiagramElementCollection,
  content: TypeEquationInput,
): Elements {
  // If input is alread an Elements object, then return it
  if (content instanceof Elements) {
    return content;
  }

  // If it is not an Elements object, then create an Element(s) array
  // and create a new Elements Object
  const elementArray: Array<Elements | Element | null> = [];

  // If the content is a string, then find the corresponding
  // DiagramElement associated with the string
  if (typeof content === 'string') {
    if (content === 'space') {
      elementArray.push(new Element(new BlankElement()));
    } else {
      const diagramElement = getDiagramElement(collection, content);
      if (diagramElement) {
        elementArray.push(new Element(diagramElement));
      }
    }
  // Otherwise, if the input content is an array, then process each element
  // and add it to the ElementArray
  } else if (Array.isArray(content)) {
    content.forEach((c) => {
      if (typeof c === 'string') {
        if (c === 'space') {
          elementArray.push(new Element(new BlankElement()));
        } else {
          const diagramElement = getDiagramElement(collection, c);
          if (diagramElement) {
            elementArray.push(new Element(diagramElement));
          }
        }
      } else if (c !== null) {
        elementArray.push(c);
      }
    });
  // Otherwise, if the input is an Element or Elements object, so just add
  // it to the ElementsArray
  } else if (content !== null) {
    elementArray.push(content);
  }
  return new Elements(elementArray);
}

export type TypeHAlign = 'left' | 'right' | 'center';
export type TypeVAlign = 'top' | 'bottom' | 'middle' | 'baseline';
export type TypeEquationForm = {
  collection: DiagramElementCollection;
  createEq: (Array<Elements | Element | string>) => void;
  arrange: (
    number, TypeHAlign | null, TypeVAlign | null,
    DiagramElementPrimative | DiagramElementCollection | Point
  ) => void;
  dissolveElements: (
    Array<DiagramElementPrimative | DiagramElementCollection>,
    boolean, number, number, ?(?boolean)) => void;
  getElementsToShowAndHide: () => void;
  showHide: (number, number, ?(?mixed)) => void;
  hideShow: (number, number, ?(?mixed)) => void;
  animateTo: (
    number, number,
    DiagramElementPrimative | DiagramElementCollection | Point,
    ?(?mixed) => void,
    'left' | 'center' | 'right', 'top' | 'bottom' | 'middle' | 'baseline',
  ) => void;
  animatePositionsTo: (number, ?(?mixed) => void) => void;
  description: string | null;
  modifiers: Object;
  type: string;
  elementMods: Object;
  time: number | null;
} & Elements;

export class EquationForm extends Elements {
  collection: DiagramElementCollection;
  name: string;
  type: string;
  description: string | null;
  modifiers: Object;
  elementMods: Object;
  time: number | null;

  constructor(collection: DiagramElementCollection) {
    super([]);
    this.collection = collection;
    this.description = null;
    this.modifiers = {};
    this.elementMods = {};
    this.time = null;
  }

  _dup(collection: DiagramElementCollection = this.collection) {
    const equationCopy = new EquationForm(collection);
    // equationCopy.collection = collection;

    // const allCollectionElements = collection.getAllElements();
    const namedElements = {};
    // getAllPrimatives?
    collection.getAllElements().forEach((element) => {
      namedElements[element.name] = element;
    });
    const newContent = [];
    this.content.forEach((contentElement) => {
      newContent.push(contentElement._dup(namedElements));
    });
    equationCopy.content = newContent;

    duplicateFromTo(this, equationCopy, ['content', 'collection', 'form']);
    return equationCopy;
  }

  createEq(content: Array<Elements | Element | string>) {
    const elements = [];
    content.forEach((c) => {
      if (typeof c === 'string') {
        if (c === 'space') {
          elements.push(new Element(new BlankElement()));
        } else {
          const diagramElement = getDiagramElement(this.collection, c);
          if (diagramElement) {
            elements.push(new Element(diagramElement));
          }
        }
      } else {
        elements.push(c);
      }
      this.content = elements;
    });
  }

  // createNewEq(content: Array<Elements | Element | string>) {
  //   const eqn = new EquationForm(this.collection);
  //   eqn.createEq(content);
  //   return eqn;
  // }

  // By default, the colleciton is arranged so the first element in the
  // equation is at (0,0) in colleciton space.
  arrange(
    scale: number = 1,
    alignH: TypeHAlign | null = 'left',
    alignV: TypeVAlign | null = 'baseline',
    fixTo: DiagramElementPrimative | DiagramElementCollection | Point = new Point(0, 0),
  ) {
    // if (this.name === 'com_add') {
    //   console.log(this.name, 'start')
    //   flag = true;
    // }
    // const elementsInEqn = this.getAllElements();
    const elementsInCollection = this.collection.getAllElements();
    const elementsCurrentlyShowing = elementsInCollection.filter(e => e.isShown);
    this.collection.hideAll();
    this.collection.show();
    super.calcSize(new Point(0, 0), scale);
    let fixPoint = new Point(0, 0);
    if (fixTo instanceof DiagramElementPrimative
        || fixTo instanceof DiagramElementCollection) {
      const t = fixTo.transform.t();
      if (t != null) {
        fixPoint = t._dup();
      }
    } else {
      fixPoint = fixTo._dup();
    }
    let w = this.width;
    let h = this.height;
    let a = this.ascent;
    let d = this.descent;
    let p = this.location._dup();
    // if (this.name === 'com_add') {
    //   console.log(this.name, 'stop')
    //   flag = false;
    // }
    // let { height } = this;
    if (fixTo instanceof DiagramElementPrimative
        || fixTo instanceof DiagramElementCollection) {
      const t = fixTo.transform.t();
      if (t != null) {
        const rect = fixTo.getVertexSpaceBoundingRect();
        w = rect.width;
        h = rect.height;
        a = rect.top - t.y;
        d = t.y - rect.bottom;
        p = t._dup();
      }
    }
    if (alignH === 'right') {
      fixPoint.x += w;
    } else if (alignH === 'center') {
      fixPoint.x += w / 2;
    }
    if (alignV === 'top') {
      fixPoint.y += p.y + a;
    } else if (alignV === 'bottom') {
      fixPoint.y += p.y - d;
    } else if (alignV === 'middle') {
      fixPoint.y += p.y - d + h / 2;
    }

    const delta = new Point(0, 0).sub(fixPoint);
    if (delta.x !== 0 || delta.y !== 0) {
      this.offsetLocation(delta);
      this.setPositions();
    }

    this.collection.showOnly(elementsCurrentlyShowing);
  }

  // eslint-disable-next-line class-methods-use-this
  dissolveElements(
    elements: Array<DiagramElementPrimative | DiagramElementCollection>,
    disolve: 'in' | 'out' = 'in',
    delay: number = 0.01,
    time: number = 1,
    callback: ?(boolean) => void = null,
  ) {
    if (elements.length === 0) {
      if (callback) {
        callback(false);
        return;
      }
    }
    const count = elements.length;
    let completed = 0;
    const end = (cancelled: boolean) => {
      completed += 1;
      if (completed === count) {
        if (callback) {
          callback(cancelled);
        }
      }
    };
    elements.forEach((e) => {
      e.disolveWithDelay(delay, time, disolve, end);
    });
  }

  getElementsToShowAndHide() {
    const allElements = this.collection.getAllElements();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsShownTarget = this.getAllElements();
    const elementsToHide =
      elementsShown.filter(e => elementsShownTarget.indexOf(e) === -1);
    const elementsToShow =
      elementsShownTarget.filter(e => elementsShown.indexOf(e) === -1);
    return {
      show: elementsToShow,
      hide: elementsToHide,
    };
  }

  render() {
    this.hideShow();
    this.setPositions();
  }

  showHide(
    showTime: number = 0,
    hideTime: number = 0,
    callback: ?(?mixed) => void = null,
  ) {
    this.collection.stop();
    this.collection.show();
    const { show, hide } = this.getElementsToShowAndHide();
    if (showTime === 0) {
      show.forEach((e) => {
        e.showAll();
        // if (e instanceof DiagramElementCollection) {
        //   e.showAll();
        // } else {
        //   e.show();
        // }
      });
    } else {
      this.dissolveElements(show, 'in', 0.01, showTime, null);
    }

    if (hideTime === 0) {
      hide.forEach(e => e.hide());
    } else {
      this.dissolveElements(hide, 'out', showTime, hideTime, callback);
    }
  }

  hideShow(
    showTime: number = 0,
    hideTime: number = 0,
    callback: ?(?mixed) => void = null,
  ) {
    this.collection.stop();
    this.collection.show();
    const { show, hide } = this.getElementsToShowAndHide();
    if (hideTime === 0) {
      hide.forEach(e => e.hide());
    } else {
      this.dissolveElements(hide, 'out', 0.01, hideTime, null);
    }
    if (showTime === 0) {
      show.forEach((e) => {
        e.showAll();
        // if (e instanceof DiagramElementCollection) {
        //   e.showAll();
        // } else {
        //   e.show();
        // }
      });
      if (callback != null) {
        callback();
      }
    } else {
      this.dissolveElements(show, 'in', hideTime, showTime, callback);
    }
  }

  allHideShow(
    delay: number = 0,
    hideTime: number = 0.5,
    blankTime: number = 0.5,
    showTime: number = 0.5,
    callback: ?(boolean) => void = null,
  ) {
    this.collection.stop();
    const allElements = this.collection.getAllElements();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsToShow = this.getAllElements();
    const elementsToDelayShowing = elementsToShow.filter(e => !e.isShown);
    const elementsToShowAfterDisolve = elementsToShow.filter(e => e.isShown);
    let cumTime = delay;

    if (elementsToShow.length === 0 && elementsShown.length === 0) {
      if (callback != null) {
        callback(false);
        return;
      }
    }
    // disolve out
    // set positions
    // disolve in

    let disolveOutCallback = () => {
      this.setPositions();
    };
    if (elementsToShow.length === 0) {
      disolveOutCallback = (cancelled: boolean) => {
        this.setPositions();
        if (callback != null) {
          callback(cancelled);
        }
      };
    }

    if (elementsShown.length > 0) {
      this.dissolveElements(
        elementsShown, 'out', delay, hideTime, disolveOutCallback,
      );
      cumTime += hideTime;
    } else {
      this.setPositions();
    }

    const count = elementsToShow.length;
    let completed = 0;
    const end = (cancelled: boolean) => {
      completed += 1;
      if (completed === count - 1) {
        if (callback) {
          callback(cancelled);
        }
      }
    };
    elementsToDelayShowing.forEach((e) => {
      e.disolveWithDelay(cumTime + blankTime, showTime, 'in', end);
    });
    elementsToShowAfterDisolve.forEach((e) => {
      e.disolveWithDelay(blankTime, showTime, 'in', end);
    });
  }

  // setColors() {
  //   Object.keys(this.elementMods).forEach((elementName) => {
  //     const mods = this.elementMods[elementName];
  //     const {
  //       element, color, style, direction, mag,
  //     } = mods;
  //     if (element != null) {
  //       if (color != null) {
  //         element.animateColorToWithDelay(color, cumTime, moveTimeToUse);
  //       }
  //       if (style != null) {
  //         element.animate.transform.translation.style = style;
  //       }
  //       if (direction != null) {
  //         element.animate.transform.translation.options.direction = direction;
  //       }
  //       if (mag != null) {
  //         element.animate.transform.translation.options.magnitude = mag;
  //       }
  //     }
  //   });
  // }

  animatePositionsTo(
    // location: Point,
    delay: number,
    disolveOutTime: number,
    moveTime: number | null,
    disolveInTime: number,
    // time: number = 1,
    callback: ?(?mixed) => void = null,
  ) {
    const allElements = this.collection.getAllElements();
    this.collection.stop();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsShownTarget = this.getAllElements();
    const elementsToHide =
      elementsShown.filter(e => elementsShownTarget.indexOf(e) === -1);
    const elementsToShow =
      elementsShownTarget.filter(e => elementsShown.indexOf(e) === -1);

    const currentTransforms = this.collection.getElementTransforms();
    this.setPositions();
    const animateToTransforms = this.collection.getElementTransforms();

    const elementsToMove = [];
    const toMoveStartTransforms = [];
    const toMoveStopTransforms = [];
    Object.keys(animateToTransforms).forEach((key) => {
      const currentT = currentTransforms[key];
      const nextT = animateToTransforms[key];
      if (!currentT.isEqualTo(nextT)) {
        elementsToMove.push(key);
        toMoveStartTransforms.push(currentT);
        toMoveStopTransforms.push(nextT);
      }
    });

    // Find move time to use. If moveTime is null, then a velocity is used.
    let moveTimeToUse;
    if (moveTime === null) {
      moveTimeToUse = getMoveTime(
        toMoveStartTransforms, toMoveStopTransforms, 0,
        new Point(0.35, 0.35),      // 0.25 diagram space per s
        2 * Math.PI / 6,            // 60º per second
        new Point(0.4, 0.4),            // 100% per second
      );
    } else {
      moveTimeToUse = moveTime;
    }
    this.collection.setElementTransforms(currentTransforms);
    let cumTime = delay;

    let moveCallback = null;
    let disolveInCallback = null;
    let disolveOutCallback = null;

    if (elementsToMove.length === 0 && elementsToShow.length === 0) {
      disolveOutCallback = callback;
    } else if (elementsToShow.length === 0) {
      moveCallback = callback;
    } else {
      disolveInCallback = callback;
    }

    if (elementsToHide.length > 0) {
      this.dissolveElements(elementsToHide, 'out', delay, disolveOutTime, disolveOutCallback);
      cumTime += disolveOutTime;
    }

    Object.keys(this.elementMods).forEach((elementName) => {
      const mods = this.elementMods[elementName];
      const {
        element, color, style, direction, mag,
      } = mods;
      if (element != null) {
        if (color != null) {
          element.animateColorToWithDelay(color, cumTime, moveTimeToUse);
        }
        if (style != null) {
          element.animate.transform.translation.style = style;
        }
        if (direction != null) {
          element.animate.transform.translation.options.direction = direction;
        }
        if (mag != null) {
          element.animate.transform.translation.options.magnitude = mag;
        }
      }
    });

    const t = this.collection.animateToTransforms(
      animateToTransforms,
      moveTimeToUse,
      cumTime,
      0,
      moveCallback,
    );
    if (t > 0) {
      cumTime = t;
    }

    if (elementsToShow.length > 0) {
      this.dissolveElements(elementsToShow, 'in', cumTime, disolveInTime, disolveInCallback);
      cumTime += disolveInTime + 0.001;
    }
    return cumTime;
  }

  // deprecate
  animateTo(
    // location: Point,
    scale: number = 1,
    time: number = 1,
    fixElement: DiagramElementPrimative | DiagramElementCollection | Point = new Point(0, 0),
    callback: ?(?mixed) => void = null,
    xAlign: 'left' | 'center' | 'right' = 'left',
    yAlign: 'top' | 'bottom' | 'middle' | 'baseline' = 'baseline',
  ) {
    const allElements = this.collection.getAllElements();
    this.collection.stop();
    const elementsShown = allElements.filter(e => e.isShown);
    const elementsShownTarget = this.getAllElements();
    const elementsToHide =
      elementsShown.filter(e => elementsShownTarget.indexOf(e) === -1);
    const elementsToShow =
      elementsShownTarget.filter(e => elementsShown.indexOf(e) === -1);

    const currentTransforms = this.collection.getElementTransforms();
    this.arrange(scale, xAlign, yAlign, fixElement);
    const animateToTransforms = this.collection.getElementTransforms();
    this.collection.setElementTransforms(currentTransforms);
    this.dissolveElements(elementsToHide, 'out', 0.001, 0.01, null);
    this.collection.animateToTransforms(animateToTransforms, time, 0);
    this.dissolveElements(elementsToShow, 'in', time, 0.5, callback);
  }

  // deprecate
  sfrac(
    numerator: TypeEquationInput,
    denominator: TypeEquationInput,
    vinculum: DiagramElementPrimative | DiagramElementCollection | string,
    scaleModifier: number = 1,
  ) {
    const f = this.frac(numerator, denominator, vinculum);
    f.scaleModifier = scaleModifier;
    return f;
  }

  // deprecate
  frac(
    numerator: TypeEquationInput,
    denominator: TypeEquationInput,
    vinculum: string | DiagramElementPrimative | DiagramElementCollection,
  ) {
    return new Fraction(
      contentToElement(this.collection, numerator),
      contentToElement(this.collection, denominator),
      getDiagramElement(this.collection, vinculum),
    );
  }

  // deprecate
  sub(
    content: TypeEquationInput,
    subscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      null,
      contentToElement(this.collection, subscript),
    );
  }

  // deprecate
  sup(
    content: TypeEquationInput,
    superscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      contentToElement(this.collection, superscript),
      null,
    );
  }

  // deprecate
  supsub(
    content: TypeEquationInput,
    superscript: TypeEquationInput,
    subscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      contentToElement(this.collection, superscript),
      contentToElement(this.collection, subscript),
    );
  }

  // deprecate
  int(
    limitMin: TypeEquationInput,
    limitMax: TypeEquationInput,
    content: TypeEquationInput,
    integralGlyph: DiagramElementPrimative,
  ) {
    return new Integral(
      contentToElement(this.collection, limitMin),
      contentToElement(this.collection, limitMax),
      contentToElement(this.collection, content),
      getDiagramElement(this.collection, integralGlyph),
    );
  }
}


export type TypeEquation = {
  +collection: DiagramElementCollection;
  diagramLimits: Rect;
  firstTransform: Transform;
  _dup: () => TypeEquation;
  form: Object;
  unitsForm: Object;
  currentForm: ?EquationForm;
  // currentFormName: string;
  formAlignment: {
    vAlign: TypeVAlign;
    hAlign: TypeHAlign;
    fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
    scale: number;
  };
  addForm: (string, Array<Elements | Element | string>) => void;
  scaleForm: (string, number) => void;
  setElem: (DiagramElementCollection | DiagramElementPrimative | string,
            Array<number> | null,
            boolean,
            'up' | 'down' | 'left' | 'right' | '',
            number) => void;
  frac: (
      TypeEquationInput,
      TypeEquationInput,
      string | DiagramElementPrimative | DiagramElementCollection,
    ) => Fraction;
  sfrac: (
      TypeEquationInput,
      TypeEquationInput,
      string | DiagramElementPrimative | DiagramElementCollection, number,
    ) => Fraction;
  setCurrentForm: (EquationForm | string) => void;
  render: () => void;
  setPosition: (Point) => void;
  stop: () => void;
  scale: (number) => void;
  isAnimating: boolean;

  +showForm: (EquationForm | string, ?string) => {};
};

export class Equation {
  collection: DiagramElementCollection;
  diagramLimits: Rect;
  firstTransform: Transform;
  form: Object;
  formSeries: Array<EquationForm>;
  drawContext2D: DrawContext2D;
  // currentForm: ?EquationForm;
  currentForm: string;
  currentFormType: string;
  getCurrentForm: () => ?EquationForm;
  formTypeOrder: Array<string>;
  // currentFormName: string;
  // currentFormType: string;
  formAlignment: {
    vAlign: TypeVAlign;
    hAlign: TypeHAlign;
    fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
    scale: number;
  };

  isAnimating: boolean;

  descriptionElement: DiagramElementPrimative | null;
  descriptionPosition: Point;

  +showForm: (EquationForm | string, ?string) => {};

  constructor(
    drawContext2D: DrawContext2D,
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
    firstTransform: Transform = new Transform('Equation')
      .scale(1, 1).rotate(0).translate(0, 0),
  ) {
    this.drawContext2D = drawContext2D;
    this.diagramLimits = diagramLimits;
    this.firstTransform = firstTransform;
    this.form = {};
    this.formAlignment = {
      vAlign: 'baseline',
      hAlign: 'left',
      fixTo: new Point(0, 0),
      scale: 1,
    };
    this.currentForm = '';
    this.currentFormType = '';
    this.formTypeOrder = ['base'];
    this.descriptionPosition = new Point(0, 0);
    this.isAnimating = false;
  }

  _dup() {
    const equationCopy = new Equation(
      this.drawContext2D,
      this.diagramLimits._dup(),
      this.firstTransform._dup(),
    );

    duplicateFromTo(
      this, equationCopy,
      ['collection', 'form', 'drawContext2D', 'formAlignment'],
    );

    const newCollection = this.collection._dup();

    equationCopy.collection = newCollection;
    const newForm = {};
    Object.keys(this.form).forEach((name) => {
      if (!(name in newForm)) {
        newForm[name] = {};
      }
      Object.keys(this.form[name]).forEach((formType) => {
        if (formType !== 'name') {
          newForm[name][formType] = this.form[name][formType]._dup(newCollection);
        } else {
          newForm[name][formType] = this.form[name][formType];
        }
      });
    });
    equationCopy.form = newForm;

    duplicateFromTo(this.formAlignment, equationCopy.formAlignment, ['fixTo']);
    const { fixTo } = this.formAlignment;
    if (fixTo instanceof Point) {
      equationCopy.formAlignment.fixTo = this.formAlignment.fixTo._dup();
    } else {
      Object.keys(newCollection.elements).forEach((key) => {
        if (newCollection.elements[key].name === fixTo.name) {
          equationCopy.formAlignment.fixTo = newCollection.elements[key];
        }
      });
    }
    return equationCopy;
  }

  createElements(
    elems: Object,
    colorOrFont: Array<number> | DiagramFont = [],
    descriptionElement: DiagramElementPrimative | null = null,
    descriptionPosition: Point = new Point(0, 0),
  ) {
    this.collection = createEquationElements(
      elems,
      this.drawContext2D,
      colorOrFont,
      this.diagramLimits,
      this.firstTransform,
    );
    this.addDescriptionElement(descriptionElement, descriptionPosition);
  }

  addDescriptionElement(
    descriptionElement: DiagramElementPrimative | null = null,
    descriptionPosition: Point = new Point(0, 0),
  ) {
    this.descriptionElement = descriptionElement;
    this.descriptionPosition = descriptionPosition;
    if (this.descriptionElement) {
      this.descriptionElement
        .setPosition(this.collection
          .getDiagramPosition()
          .add(descriptionPosition));
    }
  }

  setPosition(position: Point) {
    this.collection.setPosition(position);
    if (this.descriptionElement) {
      this.descriptionElement.setPosition(position.add(this.descriptionPosition));
    }
  }

  stop() {
    this.collection.stop();
  }

  setElem(
    element: DiagramElementCollection | DiagramElementPrimative | string,
    elementColor: Array<number> | null = null,
    isTouchable: boolean = false,
    direction: 'up' | 'down' | 'left' | 'right' | '' = '',
    mag: number = 0.5,
  ) {
    let elem = element;
    if (typeof elem === 'string') {
      elem = getDiagramElement(this.collection, element);
    }
    if (elem instanceof DiagramElementCollection
      || elem instanceof DiagramElementPrimative) {
      if (elementColor != null) {
        elem.setColor(elementColor);
      }
      elem.isTouchable = isTouchable;
      if (isTouchable) {
        this.collection.hasTouchableElements = true;
      }
      elem.animate.transform.translation.style = 'curved';
      elem.animate.transform.translation.options.direction = direction;
      elem.animate.transform.translation.options.magnitude = mag;
    }
  }

  addForm(
    name: string,
    content: Array<Elements | Element | string>,
    options: {
      formType?: string,
      addToSeries?: boolean,
      elementMods?: Object,
      time?: number | null | { fromPrev?: number, fromNext?: number },
      description?: string,
      modifiers?: Object,
    },
  ) {
    if (!(name in this.form)) {
      this.form[name] = {};
    }
    const defaultOptions = {
      formType: 'base',
      addToSeries: true,
      elementMods: {},
      animationTime: null,          // use velocities instead of time
      description: '',
      modifiers: {},
    };
    let optionsToUse = defaultOptions;
    if (options) {
      optionsToUse = Object.assign({}, defaultOptions, options);
    }
    const {
      formType, description, modifiers,
      animationTime, elementMods, addToSeries,
    } = optionsToUse;
    const time = animationTime;

    this.form[name][formType] = new EquationForm(this.collection);
    this.form[name].name = name;
    this.form[name][formType].name = name;
    this.form[name][formType].description = description;
    this.form[name][formType].modifiers = modifiers;
    this.form[name][formType].type = formType;
    this.form[name][formType].elementMods = {};
    if (typeof time === 'number') {
      this.form[name][formType].time = {
        fromPrev: time, fromNext: time, fromAny: time,
      };
    } else {
      this.form[name][formType].time = time;
    }
    Object.keys(elementMods).forEach((elementName) => {
      const diagramElement = getDiagramElement(this.collection, elementName);
      if (diagramElement) {
        let color;
        let style;
        let direction;
        let mag;
        if (Array.isArray(elementMods[elementName])) {
          [color, style, direction, mag] = elementMods[elementName];
        } else {
          ({
            color, style, direction, mag,
          } = elementMods[elementName]);
        }
        this.form[name][formType].elementMods[elementName] = {
          element: diagramElement,
          color,
          style,
          direction,
          mag,
        };
      }
    });
    const form = this.form[name][formType];
    form.createEq(content);
    form.type = formType;
    form.arrange(
      this.formAlignment.scale,
      this.formAlignment.hAlign,
      this.formAlignment.vAlign,
      this.formAlignment.fixTo,
    );
    if (addToSeries) {
      if (this.formSeries == null) {
        this.formSeries = [];
      }
      this.formSeries.push(this.form[name]);
    }
    // make the first form added also equal to the base form as always
    // need a base form for some functions
    if (this.form[name].base === undefined) {
      this.addForm(name, content, 'base', false, elementMods, time, description, modifiers);
    }
  }

  getCurrentForm() {
    if (this.form[this.currentForm] == null) {
      return null;
    }
    if (this.form[this.currentForm][this.currentFormType] == null) {
      return null;
    }
    return this.form[this.currentForm][this.currentFormType];
  }

  reArrangeCurrentForm() {
    const form = this.getCurrentForm();
    if (form == null) {
      return;
    }
    form.arrange(
      this.formAlignment.scale,
      this.formAlignment.hAlign,
      this.formAlignment.vAlign,
      this.formAlignment.fixTo,
    );
  }

  scaleForm(name: string, scale: number, formType: string = 'base') {
    // console.log(name, this.form, formType, this.form[name][formType])
    if (name in this.form) {
      if (formType in this.form[name]) {
        this.form[name][formType].arrange(
          scale,
          this.formAlignment.hAlign,
          this.formAlignment.vAlign,
          this.formAlignment.fixTo,
        );
      }
    }
  }

  scale(scale: number) {
    Object.keys(this.form).forEach((name) => {
      Object.keys(this.form[name]).forEach((formType) => {
        if (formType !== 'name') {
          this.scaleForm(name, scale, formType);
        }
      });
    });
  }

  setFormSeries(series: Array<string | EquationForm>) {
    this.formSeries = [];
    series.forEach((form) => {
      if (typeof form === 'string') {
        this.formSeries.push(this.form[form]);
      } else {
        this.formSeries.push(form);
      }
    });
  }

  getFormIndex(formToGet: EquationForm | string) {
    const form = this.getForm(formToGet);
    let index = -1;
    if (form != null) {
      index = this.formSeries.indexOf(this.form[form.name]);
    }
    return index;
  }

  prevForm(time: number | null = null, delay: number = 0) {
    const currentForm = this.getCurrentForm();
    if (currentForm == null) {
      return;
    }
    let index = this.getFormIndex(currentForm);
    if (index > -1) {
      index -= 1;
      if (index < 0) {
        index = this.formSeries.length - 1;
      }
      this.goToForm(index, time, delay, 'fromNext');
    }
  }

  nextForm(time: number | null = null, delay: number = 0) {
    let animate = true;
    const currentForm = this.getCurrentForm();
    if (currentForm == null) {
      return;
    }
    let index = this.getFormIndex(currentForm);
    if (index > -1) {
      index += 1;
      if (index > this.formSeries.length - 1) {
        index = 0;
        animate = false;
      }
      this.goToForm(index, time, delay, 'fromPrev', animate);
    }
  }

  replayCurrentForm(time: number) {
    if (this.isAnimating) {
      this.collection.stop(true, true);
      this.collection.stop(true, true);
      this.isAnimating = false;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        this.showForm(currentForm);
      }
      return;
    }
    this.collection.stop();
    this.collection.stop();
    this.isAnimating = false;
    this.prevForm(0);
    this.nextForm(time, 0.5);
  }

  goToForm(
    name: ?string | number = null,
    time: number | null = null,
    delay: number = 0,
    fromWhere: 'fromPrev' | 'fromNext' | 'fromAny' = 'fromAny',
    animate: boolean = true,
  ) {
    if (this.isAnimating) {
      this.collection.stop(true, true);
      this.collection.stop(true, true);
      this.isAnimating = false;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        this.showForm(currentForm);
      }
      return;
    }
    this.collection.stop();
    this.collection.stop();
    this.isAnimating = false;
    let nextIndex = 0;
    if (name == null) {
      let index = 0;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        index = this.formSeries.indexOf(this.form[currentForm.name]);
        if (index < 0) {
          index = 0;
        }
      }
      nextIndex = index + 1;
      if (nextIndex === this.formSeries.length) {
        nextIndex = 0;
      }
    } else if (typeof name === 'number') {
      nextIndex = name;
    } else {
      this.formSeries.forEach((form, index) => {
        if (form.name === name) {
          nextIndex = index;
        }
      });
    }
    let form = null;
    let formTypeToUse = null;
    const possibleFormTypes
          = this.formTypeOrder.filter(fType => fType in this.formSeries[nextIndex]);
    if (possibleFormTypes.length) {
      // eslint-disable-next-line prefer-destructuring
      formTypeToUse = possibleFormTypes[0];
    }
    if (formTypeToUse != null) {
      // $FlowFixMe
      form = this.formSeries[nextIndex][formTypeToUse];
      if (time === 0) {
        this.showForm(form);
      } else {
        this.isAnimating = true;
        const end = () => {
          this.isAnimating = false;
        };
        if (animate) {
          let timeToUse = null;
          if (form.time != null && form.time[fromWhere] != null) {
            timeToUse = form.time[fromWhere];
          }
          form.animatePositionsTo(delay, 0.4, timeToUse, 0.4, end);
        } else {
          form.allHideShow(delay, 0.5, 0.2, 0.5, end);
        }
        this.setCurrentForm(form);
      }
      this.updateDescription();
    }
  }

  changeDescription(
    formOrName: EquationForm | string,
    description: string = '',
    modifiers: Object = {},
    formType: string = 'base',
  ) {
    const form = this.getForm(formOrName, formType);
    if (form != null) {
      form.description = `${description}`;
      form.modifiers = modifiers;
    }
  }

  updateDescription(
    formOrName: EquationForm | string | null = null,
    formType: string = 'base',
  ) {
    const element = this.descriptionElement;
    if (element == null) {
      return;
    }
    if (element.isShown === false) {
      return;
    }
    let form = null;
    if (formOrName == null) {
      form = this.getCurrentForm();
    } else if (typeof formOrName === 'string') {
      form = this.getForm(formOrName, formType);
    } else {
      form = formOrName;
    }
    if (form == null) {
      return;
    }
    if (form.description == null) {
      return;
    }

    const drawingObject = element.vertices;
    if (drawingObject instanceof HTMLObject) {
      drawingObject.change(
        html.applyModifiers(form.description, form.modifiers),
        element.lastDrawTransform.m(),
      );
      html.setOnClicks(form.modifiers);
    }
  }

  render() {
    const form = this.getCurrentForm();
    if (form != null) {
      form.showHide();
      this.collection.show();
      form.setPositions();
      this.updateDescription();
    }
  }

  setCurrentForm(
    formOrName: EquationForm | string,
    formType: string = 'base',
  ) {
    if (typeof formOrName === 'string') {
      this.currentForm = '';
      this.currentFormType = '';
      if (formOrName in this.form) {
        this.currentForm = formOrName;
        if (formType in this.form[formOrName]) {
          this.currentFormType = formType;
        }
      }
    } else {
      this.currentForm = formOrName.name;
      this.currentFormType = formOrName.type;
    }
  }


  setUnits(units: 'deg' | 'rad') {
    if (units === 'deg') {
      this.formTypeOrder = ['deg', 'base'];
    }
    if (units === 'rad') {
      this.formTypeOrder = ['rad', 'base'];
    }
    if (this.collection.isShown) {
      this.showForm(this.currentForm);
    }
  }

  showForm(
    formOrName: EquationForm | string,
    formType: ?string = null,
  ) {
    this.collection.show();
    let form = formOrName;
    if (typeof formOrName === 'string') {
      form = this.getForm(formOrName, formType);
    }
    if (form) {
      this.setCurrentForm(form);
      this.render();
    }
  }

  getForm(
    formOrName: string | EquationForm,
    formType: ?string,
  ): null | EquationForm {
    if (formOrName instanceof EquationForm) {
      return formOrName;
    }
    if (formOrName in this.form) {
      let formTypeToUse = formType;
      if (formTypeToUse == null) {
        const possibleFormTypes
          = this.formTypeOrder.filter(fType => fType in this.form[formOrName]);
        if (possibleFormTypes.length) {
          // eslint-disable-next-line prefer-destructuring
          formTypeToUse = possibleFormTypes[0];
        }
      }
      if (formTypeToUse != null) {
        return this.form[formOrName][formTypeToUse];
      }
    }
    return null;
  }

  frac(
    numerator: TypeEquationInput,
    denominator: TypeEquationInput,
    vinculum: string | DiagramElementPrimative | DiagramElementCollection,
  ) {
    return new Fraction(
      contentToElement(this.collection, numerator),
      contentToElement(this.collection, denominator),
      getDiagramElement(this.collection, vinculum),
    );
  }

  strike(
    content: TypeEquationInput,
    strike: string | DiagramElementPrimative | DiagramElementCollection,
    strikeInSize: boolean = false,
  ) {
    return new StrikeOut(
      contentToElement(this.collection, content),
      getDiagramElement(this.collection, strike),
      strikeInSize,
    );
  }

  annotation(
    content: TypeEquationInput,
    annotationArray: Array<AnnotationInformation>,
    annotationInSize: boolean = false,
  ) {
    return new Annotation(
      contentToElement(this.collection, content),
      annotationArray,
      annotationInSize,
    );
  }

  ann(
    content: TypeEquationInput,
    xPosition: 'left' | 'right' | 'center' = 'right',
    yPosition: 'bottom' | 'top' | 'middle' | 'baseline' = 'top',
    xAlign: 'left' | 'right' | 'center' = 'left',
    yAlign: 'bottom' | 'top' | 'middle' | 'baseline' = 'bottom',
    annotationScale: number = 0.5,
  ) {
    return new AnnotationInformation(
      contentToElement(this.collection, content),
      xPosition,
      yPosition,
      xAlign,
      yAlign,
      annotationScale,
    );
  }

  sfrac(
    numerator: TypeEquationInput,
    denominator: TypeEquationInput,
    vinculum: DiagramElementPrimative | DiagramElementCollection | string,
    scaleModifier: number = 1,
  ) {
    const f = this.frac(numerator, denominator, vinculum);
    f.scaleModifier = scaleModifier;
    return f;
  }

  sub(
    content: TypeEquationInput,
    subscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      null,
      contentToElement(this.collection, subscript),
    );
  }

  sup(
    content: TypeEquationInput,
    superscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      contentToElement(this.collection, superscript),
      null,
    );
  }

  supsub(
    content: TypeEquationInput,
    superscript: TypeEquationInput,
    subscript: TypeEquationInput,
  ) {
    return new SuperSub(
      contentToElement(this.collection, content),
      contentToElement(this.collection, superscript),
      contentToElement(this.collection, subscript),
    );
  }

  brac(
    content: TypeEquationInput,
    leftBracket: DiagramElementPrimative | DiagramElementCollection | string,
    rightBracket: DiagramElementPrimative | DiagramElementCollection | string,
    space: number = 0.03,
  ) {
    return new Brackets(
      contentToElement(this.collection, content),
      getDiagramElement(this.collection, leftBracket),
      getDiagramElement(this.collection, rightBracket),
      space,
    );
  }

  topBar(
    content: TypeEquationInput,
    bar: DiagramElementPrimative | DiagramElementCollection | string,
    space: number = 0.03,
    outsideSpace: number = 0.03,
  ) {
    return new Bar(
      contentToElement(this.collection, content),
      getDiagramElement(this.collection, bar),
      space,
      outsideSpace,
      'top',
    );
  }

  bottomBar(
    content: TypeEquationInput,
    bar: DiagramElementPrimative | DiagramElementCollection | string,
    space: number = 0.03,
    outsideSpace: number = 0.03,
  ) {
    return new Bar(
      contentToElement(this.collection, content),
      getDiagramElement(this.collection, bar),
      space,
      outsideSpace,
      'bottom',
    );
  }

  topComment(
    content: TypeEquationInput,
    comment: TypeEquationInput,
    bar: DiagramElementPrimative | DiagramElementCollection | string,
    space: number = 0.03,
    outsideSpace: number = 0.03,
  ) {
    return this.annotation(
      this.topBar(content, bar, space, outsideSpace),
      [this.ann(comment, 'center', 'top', 'center', 'bottom')],
    );
  }

  bottomComment(
    content: TypeEquationInput,
    comment: TypeEquationInput,
    bar: DiagramElementPrimative | DiagramElementCollection | string,
    space: number = 0.0,
    outsideSpace: number = 0.03,
  ) {
    return this.annotation(
      this.bottomBar(content, bar, space, outsideSpace),
      [this.ann(comment, 'center', 'bottom', 'center', 'top')],
    );
  }
}
