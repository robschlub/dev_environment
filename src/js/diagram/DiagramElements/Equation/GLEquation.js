// @flow
import {
  Point, Rect, Transform,
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
  scale: number;

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
    if (content instanceof DiagramElementCollection
        || content instanceof DiagramElementPrimative) {
      // Update translation and scale
      content.transform.updateTranslation(location.x, location.y);
      content.transform.updateScale(scale, scale);
      content.updateLastDrawTransform();

      // Get the boundaries of element
      const r = content.getRelativeDiagramBoundingRect();
      this.location = location._dup();
      this.scale = scale;
      this.ascent = r.top;
      this.descent = -r.bottom;
      this.height = r.height;
      this.width = r.width;
    }
  }

  _dup(namedCollection: Object) {
    const c = new Element(namedCollection[this.content.name]);
    c.ascent = this.ascent;
    c.descent = this.descent;
    c.width = this.width;
    c.location = this.location._dup();
    c.height = this.height;
    c.scale = this.scale;
    return c;
  }

  getAllElements() {
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
      if (e instanceof Element) {
        elements.push(e.content);
      } else {
        elements = [...elements, ...e.getAllElements()];
      }
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
    this.vSpaceDenom = scale * 0.02;
    this.lineVAboveBaseline = scale * 0.07 / this.scaleModifier;
    this.lineWidth = scale * 0.02;

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
    'italic',
    0.2,
    '200',
    'left',
    'alphabetic',
    color,
  );
  if (colorOrFont instanceof DiagramFont) {
    font = colorOrFont;
    if (font.color != null) {
      color = RGBToArray(font.color);
    }
  }

  const collection = new DiagramElementCollection(
    new Transform().scale(1, 1).rotate(0).translate(0, 0),
    diagramLimits,
  );
  Object.keys(elems).forEach((key) => {
    if (typeof elems[key] === 'string') {
      const dT = new DiagramText(new Point(0, 0), elems[key], font);
      const to = new TextObject(drawContext2D, [dT]);
      const p = new DiagramElementPrimative(
        to,
        new Transform().scale(1, 1).translate(0, 0),
        color,
        diagramLimits,
      );
      collection.add(key, p);
    }
    if (elems[key] instanceof DiagramElementPrimative) {
      collection.add(key, elems[key]);
    }
    if (elems[key] instanceof DiagramElementCollection) {
      collection.add(key, elems[key]);
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
    const diagramElement = getDiagramElement(collection, content);
    if (diagramElement) {
      elementArray.push(new Element(diagramElement));
    }
  // Otherwise, if the input content is an array, then process each element
  // and add it to the ElementArray
  } else if (Array.isArray(content)) {
    content.forEach((c) => {
      if (typeof c === 'string') {
        const diagramElement = getDiagramElement(collection, c);
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
    boolean, number, number, ?(?mixed)) => void;
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
} & Elements;

export class EquationForm extends Elements {
  collection: DiagramElementCollection;
  name: string;

  constructor(collection: DiagramElementCollection) {
    super([]);
    this.collection = collection;
  }

  _dup(collection: DiagramElementCollection) {
    const equationCopy = new EquationForm(collection);
    // equationCopy.collection = collection;

    // const allCollectionElements = collection.getAllElements();
    const namedElements = {};
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
        const diagramElement = getDiagramElement(this.collection, c);
        if (diagramElement) {
          elements.push(new Element(diagramElement));
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
    // let { height } = this;
    if (fixTo instanceof DiagramElementPrimative
        || fixTo instanceof DiagramElementCollection) {
      const t = fixTo.transform.t();
      if (t != null) {
        const rect = fixTo.getRelativeDiagramBoundingRect();
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
    appear: boolean = true,
    delay: number = 0.01,
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
        if (delay > 0) {
          e.disolveInWithDelay(delay, time, callbackToUse);
          callbackToUse = null;
        }
      } else {
        e.disolveOutWithDelay(delay, time, callbackToUse);
        callbackToUse = null;
      }
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
      show.forEach(e => e.show());
    } else {
      this.dissolveElements(show, true, 0.01, showTime, null);
    }

    if (hideTime === 0) {
      hide.forEach(e => e.hide());
    } else {
      this.dissolveElements(hide, false, showTime, hideTime, callback);
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
      this.dissolveElements(hide, false, 0.01, hideTime, null);
    }
    if (showTime === 0) {
      show.forEach(e => e.show());
      if (callback != null) {
        callback();
      }
    } else {
      this.dissolveElements(show, true, hideTime, showTime, callback);
    }
  }

  animatePositionsTo(
    // location: Point,
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
    // this.arrange(scale, xAlign, yAlign, fixElement);
    this.setPositions();
    const animateToTransforms = this.collection.getElementTransforms();

    this.collection.setElementTransforms(currentTransforms);
    this.dissolveElements(elementsToHide, false, 0.01, 0.01, null);
    const t = this.collection.animateToTransforms(
      animateToTransforms,
      time,
      0,
      // this.dissolveElements.bind(this, elementsToShow, true, 0, 0.5, callback),
    );
    this.dissolveElements(elementsToShow, true, t + 0.001, 0.5, callback);
  }

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
    this.dissolveElements(elementsToHide, false, 0.00, 0.01, null);
    this.collection.animateToTransforms(animateToTransforms, time, 0);
    this.dissolveElements(elementsToShow, true, time, 0.5, callback);
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
};

export class Equation {
  collection: DiagramElementCollection;
  diagramLimits: Rect;
  firstTransform: Transform;
  form: Object;
  formSeries: Array<EquationForm>;
  drawContext2D: DrawContext2D;
  currentForm: ?EquationForm;
  formTypeOrder: Array<string>;
  // currentFormName: string;
  // currentFormType: string;
  formAlignment: {
    vAlign: TypeVAlign;
    hAlign: TypeHAlign;
    fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
    scale: number;
  };

  constructor(
    drawContext2D: DrawContext2D,
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
    firstTransform: Transform = new Transform()
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
    this.currentForm = null;
    this.formTypeOrder = ['base'];
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
      if (!(name in this.form)) {
        newForm[name] = {};
      }
      Object.keys(this.form[name]).forEach((formType) => {
        newForm[name][formType] = this.form[name][formType]._dup(newCollection);
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
  ) {
    this.collection = createEquationElements(
      elems,
      this.drawContext2D,
      colorOrFont,
      this.diagramLimits,
      this.firstTransform,
    );
  }

  setPosition(position: Point) {
    this.collection.setPosition(position);
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
    formType: string = 'base',
  ) {
    if (!(name in this.form)) {
      this.form[name] = {};
    }

    this.form[name][formType] = new EquationForm(this.collection);
    this.form[name].name = name;
    this.form[name][formType].name = name;

    const form = this.form[name][formType];
    form.createEq(content);
    form.type = formType;
    form.arrange(
      this.formAlignment.scale,
      this.formAlignment.hAlign,
      this.formAlignment.vAlign,
      this.formAlignment.fixTo,
    );
  }

  scaleForm(name: string, scale: number, formType: string = 'base') {
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
        this.scaleForm(name, scale, formType);
      });
    });
  }

  // TODO add formType
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

  // TODO add formType
  nextForm(name: ?string) {
    this.collection.stop();
    this.collection.stop();
    let nextIndex = 0;
    if (name == null) {
      let index = 0;
      if (this.currentForm != null) {
        index = this.formSeries.indexOf(this.currentForm);
        if (index < 0) {
          index = 0;
        }
      }
      nextIndex = index + 1;
      if (nextIndex === this.formSeries.length) {
        nextIndex = 0;
      }
    } else {
      this.formSeries.forEach((form, index) => {
        if (form.name === name) {
          nextIndex = index;
        }
      });
    }

    this.formSeries[nextIndex].animatePositionsTo(2);
    this.setCurrentForm(this.formSeries[nextIndex]);
  }

  render() {
    const form = this.currentForm;
    if (form != null) {
      form.showHide();
      form.setPositions();
    }
  }

  setCurrentForm(
    formOrName: EquationForm | string,
    formType: string = 'base',
  ) {
    if (typeof formOrName === 'string') {
      this.currentForm = null;
      if (formOrName in this.form) {
        if (formType in this.form[formOrName]) {
          this.currentForm = this.form[formOrName][formType];
        }
      }
    } else {
      this.currentForm = formOrName;
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
      const form = this.currentForm;
      if (form != null) {
        this.showForm(form.name);
      }
    }
    // if (this.currentForm != null) {
    //   if (units === 'deg' && this.currentForm.name.startsWith('rad')) {
    //     this.showForm(`deg${this.currentForm.name.slice(3)}`);
    //   }
    //   if (units === 'rad' && this.currentForm.name.startsWith('deg')) {
    //     this.showForm(`rad${this.currentForm.name.slice(3)}`);
    //   }
    // }
  }

  showForm(
    formOrName: EquationForm | string,
    formType: ?string,
  ) {
    // console.log(formOrName)
    if (typeof formOrName === 'string') {
      if (formOrName in this.form) {
        let formTypeToUse = formType;
        if (formTypeToUse == null) {
          const possibleFormTypes 
            = this.formTypeOrder.filter(fType => fType in this.form[formOrName])
          if (possibleFormTypes.length) {
            formTypeToUse = possibleFormTypes[0];
          }
        }
        // console.log(formTypeToUse, this.formTypeOrder)
        this.setCurrentForm(formOrName, formTypeToUse);
        this.render();
      }
    } else {
      this.setCurrentForm(formOrName);
      this.render();
    }
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
}
