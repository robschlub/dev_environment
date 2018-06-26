// @flow
import { Point } from '../../tools/g2';
import { roundNum } from '../../tools/mathtools';
import { DiagramElementPrimative, DiagramElementCollection } from '../../Element';
// import { TextObject } from './DrawingObjects/TextObject/TextObject';
// import { HTMLObject } from './DrawingObjects/HTMLObject/HTMLObject';

// Equation is a class that takes a set of drawing objects (TextObjects,
// DiagramElementPrimatives or DiagramElementCollections and HTML Objects
// and arranges their size in a )

class Element {
  content: DiagramElementPrimative | DiagramElementCollection;
  ascent: number;
  descent: number;
  width: number;
  location: Point;
  height: number;

  constructor(content: DiagramElementPrimative | DiagramElementCollection) {
    this.content = content;
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
    this.location = new Point(0, 0);
    this.height = 0;
  }

  calcSize(location: Point, scale: number) {
    const { content } = this;
    if (content instanceof DiagramElementCollection ||
        content instanceof DiagramElementPrimative) {
      // Update translation and scale
      content.transform.updateTranslation(location.x, location.y);
      content.transform.updateScale(scale, scale);
      content.updateLastDrawTransform();

      // Get the boundaries of element
      const r = content.getRelativeDiagramBoundingRect();
      this.ascent = r.top;
      this.descent = -r.bottom;
      this.height = r.height;
      this.width = r.width;
    }
  }
  getAllElements() {
    return [this.content];
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

  calcSize(location: Point, scale: number) {
    let des = 0;
    let asc = 0;
    const loc = location.copy();

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
    this.location = location.copy();
    this.height = this.descent + this.ascent;
  }
  getAllElements() {
    let elements = [];
    this.content.forEach((e) => {
      if (e instanceof Element) {
        elements.push(e.content);
      } else {
        elements = [...elements, ...e.getAllElements()];
      }
    });
    return elements;
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
  mini: boolean;

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
    this.mini = false;
  }

  calcSize(location: Point, incomingScale: number) {
    const scale = this.mini ? incomingScale * 0.35 : incomingScale;
    this.location = location.copy();
    this.numerator.calcSize(location, scale);
    this.denominator.calcSize(location, scale);
    this.width = Math.max(this.numerator.width, this.denominator.width) + scale * 0.4;
    const xNumerator = (this.width - this.numerator.width) / 2;
    const xDenominator = (this.width - this.denominator.width) / 2;

    this.vSpaceNum = scale * 0.05;
    this.vSpaceDenom = scale * 0.02;
    this.lineVAboveBaseline = this.mini ? incomingScale * 0.35 : scale * 0.07;
    this.lineWidth = scale * 0.02;

    const yNumerator = this.numerator.descent +
                        this.vSpaceNum + this.lineVAboveBaseline;

    const yDenominator = this.denominator.ascent +
                         this.vSpaceDenom - this.lineVAboveBaseline;

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

    this.descent = this.vSpaceNum + this.lineWidth / 2 - this.lineVAboveBaseline +
                   this.denominator.ascent + this.denominator.descent;
    this.ascent = this.vSpaceNum + this.lineWidth / 2 + this.lineVAboveBaseline +
                   this.numerator.ascent + this.numerator.descent;

    const { vinculum } = this;
    if (vinculum) {
      vinculum.transform.updateScale(this.width, this.lineWidth);
      vinculum.transform.updateTranslation(
        this.location.x,
        this.location.y + this.lineVAboveBaseline,
      );
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

  calcSize(location: Point, scale: number) {
    this.location = location.copy();
    const loc = location.copy();
    this.mainContent.calcSize(loc, scale);
    let w = this.mainContent.width;
    let asc = this.mainContent.ascent;
    let des = this.mainContent.descent;

    const { superscript } = this;
    if (superscript !== null) {
      const superLoc = new Point(
        this.location.x + this.mainContent.width + this.xBias,
        this.location.y + this.mainContent.ascent - scale / 3,
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
      const subLoc = new Point(
        this.location.x + this.mainContent.width - this.subscriptXBias + this.xBias,
        this.location.y - this.mainContent.descent,
      );
      subscript.calcSize(subLoc, scale / 2);
      w = Math.min(
        w,
        subLoc.x - this.location.x + subscript.width,
      );
      asc = Math.max(asc, subscript.ascent + subLoc.y - this.location.y);
      des = Math.max(des, subscript.descent + (this.location.y - subLoc.y));
    }
    this.width = w;
    this.ascent = asc;
    this.descent = des;
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

  calcSize(location: Point, scale: number) {
    this.location = location.copy();
    const loc = location.copy();
    const contentBounds = new Bounds();
    const limitMinBounds = new Bounds();
    const limitMaxBounds = new Bounds();
    const integralGlyphBounds = new Bounds();

    const { mainContent } = this;
    if (mainContent instanceof Elements) {
      mainContent.calcSize(loc.copy(), scale);
      contentBounds.width = mainContent.width;
      contentBounds.height = mainContent.ascent + mainContent.descent;
      contentBounds.ascent = mainContent.ascent;
      contentBounds.descent = mainContent.descent;
    }

    const { limitMax } = this;
    if (limitMax instanceof Elements) {
      limitMax.calcSize(loc.copy(), scale / 2);
      limitMaxBounds.width = limitMax.width;
      limitMaxBounds.height = limitMax.ascent + limitMax.descent;
      limitMaxBounds.ascent = limitMax.ascent;
      limitMaxBounds.descent = limitMax.descent;
    }

    const { limitMin } = this;
    if (limitMin instanceof Elements) {
      limitMin.calcSize(loc.copy(), scale / 2);
      limitMinBounds.width = limitMin.width;
      limitMinBounds.height = limitMin.ascent + limitMin.descent;
      limitMinBounds.ascent = limitMin.ascent;
      limitMinBounds.descent = limitMin.descent;
    }

    const integralMinHeight =
      contentBounds.ascent + contentBounds.descent +
      limitMinBounds.height +
      limitMaxBounds.height;
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
      const bounds = integralGlyph.vertices
        .getRelativeGLBoundingRect(integralGlyph.transform.matrix());
      integralGlyphBounds.width = bounds.width;
      integralGlyphBounds.height = -bounds.bottom + bounds.top;
      integralGlyphBounds.ascent = bounds.top;
      integralGlyphBounds.descent = -bounds.bottom;
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
  }
}


type EquationInput = Array<Elements | Element | string> | Elements | Element | string;

export default class DiagramGLEquation extends Elements {
  collection: DiagramElementCollection;

  constructor(collection: DiagramElementCollection) {
    super([]);
    this.collection = collection;
  }

  // eslint-disable-next-line function-paren-newline
  getDiagramElement(name: string |
    DiagramElementPrimative |
    DiagramElementCollection): DiagramElementPrimative |
  DiagramElementCollection | null {
    if (typeof name === 'string') {
      if (this.collection && `_${name}` in this.collection) {
      // $FlowFixMe
        return this.collection[`_${name}`];
      }
      return null;
    }
    return name;
  }

  createEq(content: Array<Elements | Element | string>) {
    const elements = [];
    content.forEach((c) => {
      if (typeof c === 'string') {
        const diagramElement = this.getDiagramElement(c);
        if (diagramElement) {
          elements.push(new Element(diagramElement));
        }
      } else {
        elements.push(c);
      }
      this.content = elements;
    });
  }

  calcSize(location: Point = new Point(0, 0), scale: number = 1) {
    const elementsShowing = this.collection.getAllElements()
      .filter(e => e.isShown);
    this.collection.hideAll();
    this.collection.show();
    super.calcSize(location, scale);
    this.collection.showOnly(elementsShowing);
  }

  // eslint-disable-next-line class-methods-use-this
  dissolveElements(
    elements: Array<DiagramElementPrimative | DiagramElementCollection>,
    appear: boolean = true,
    time: number = 1,
    callback: ?(?mixed) => void = null,
  ) {
    let callbackToUse = callback;
    if (elements.length === 0) {
      if (callback) {
        callback();
      }
    }
    elements.forEach((e) => {
      if (appear) {
        e.disolveIn(time, callbackToUse);
        callbackToUse = null;
      } else {
        e.disolveOut(time, callbackToUse);
        callbackToUse = null;
      }
    });
  }


  animateTo(
    location: Point,
    scale: number,
    time: number = 1,
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

    this.calcSize(location, scale);
    const animateToTransforms = this.collection.getElementTransforms();
    this.collection.setElementTransforms(currentTransforms);
    this.dissolveElements(elementsToHide, false, 0.5, null);
    this.collection.animateToTransforms(
      animateToTransforms, time, 0,
      this.dissolveElements.bind(this, elementsToShow, true, 0.5, callback),
    );
  }

  contentToElement(content: EquationInput): Elements {
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
      const diagramElement = this.getDiagramElement(content);
      if (diagramElement) {
        elementArray.push(new Element(diagramElement));
      }
    // Otherwise, if the input content is an array, then process each element
    // and add it to the ElementArray
    } else if (Array.isArray(content)) {
      content.forEach((c) => {
        if (typeof c === 'string') {
          const diagramElement = this.getDiagramElement(c);
          if (diagramElement) {
            elementArray.push(new Element(diagramElement));
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

  sfrac(
    numerator: EquationInput,
    denominator: EquationInput,
    vinculum: DiagramElementPrimative | DiagramElementCollection | string,
  ) {
    const f = this.frac(numerator, denominator, vinculum);
    f.mini = true;
    return f;
  }
  frac(
    numerator: EquationInput,
    denominator: EquationInput,
    vinculum: string | DiagramElementPrimative | DiagramElementCollection,
  ) {
    return new Fraction(
      this.contentToElement(numerator),
      this.contentToElement(denominator),
      this.getDiagramElement(vinculum),
    );
  }

  sub(
    content: EquationInput,
    subscript: EquationInput,
  ) {
    return new SuperSub(
      this.contentToElement(content),
      null,
      this.contentToElement(subscript),
    );
  }

  sup(
    content: EquationInput,
    superscript: EquationInput,
  ) {
    return new SuperSub(
      this.contentToElement(content),
      this.contentToElement(superscript),
      null,
    );
  }

  supsub(
    content: EquationInput,
    superscript: EquationInput,
    subscript: EquationInput,
  ) {
    return new SuperSub(
      this.contentToElement(content),
      this.contentToElement(superscript),
      this.contentToElement(subscript),
    );
  }

  int(
    limitMin: EquationInput,
    limitMax: EquationInput,
    content: EquationInput,
    integralGlyph: DiagramElementPrimative,
  ) {
    return new Integral(
      this.contentToElement(limitMin),
      this.contentToElement(limitMax),
      this.contentToElement(content),
      this.getDiagramElement(integralGlyph),
    );
  }
}
