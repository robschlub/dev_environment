// @flow
import {
  Point,
} from '../../tools/g2';
// import { joinObjects } from '../../../tools/tools';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
import { BlankElement, Element, Elements } from './Elements/Element';
import Fraction from './Elements/Fraction';
import Strike from './Elements/Strike';
// import DiagramPrimatives from '../../DiagramPrimatives/DiagramPrimatives';
import SuperSub from './Elements/SuperSub';
import { Brackets, Bar } from './Elements/Brackets';
import { Annotation, AnnotationInformation } from './Elements/Annotation';

export function getDiagramElement(
  elementsObject: { [string: string]: DiagramElementPrimative |
                    DiagramElementCollection }
                  | DiagramElementCollection,
  name: string | DiagramElementPrimative | DiagramElementCollection,
): DiagramElementPrimative | DiagramElementCollection | null {
  if (typeof name !== 'string') {
    return name;
  }
  if (elementsObject instanceof DiagramElementCollection) {
    if (elementsObject && `_${name}` in elementsObject) {
    // $FlowFixMe
      return elementsObject[`_${name}`];
    }
    return null;
  }

  if (elementsObject && name in elementsObject) {
    return elementsObject[name];
  }

  return null;
}

export type TypeParsablePoint = [number, number] | Point | { x: number, y: number};
// point can be defined as:
//    - Point instance
//    - [1, 1]
//    - { x: 1, y: 1 }
export const parsePoint = (point: TypeParsablePoint) => {
  if (point instanceof Point) {
    return point;
  }
  if (Array.isArray(point)) {
    if (point.length === 2) {
      return new Point(point[0], point[1]);
    }
    return point;
  }
  if (typeof (point) === 'object') {
    const keys = Object.keys(point);
    if (keys.indexOf('x') > -1 && keys.indexOf('y') > -1) {
      return new Point(point.x, point.y);
    }
  }
  return point;
};

/* eslint-disable no-use-before-define */
export type TypeEquationPhrase =
  string
  | number
  | { frac: TypeFracObject } | TypeFracArray
  | { strike: TypeStrikeObject } | TypeStrikeArray
  | { brac: TypeBracketObject } | TypeBracketArray
  | { sub: TypeSubObject } | TypeSubArray
  | { sup: TypeSupObject } | TypeSupArray
  | { supSub: TypeSupSubObject } | TypeSupSubArray
  | { topBar: TypeBarObject } | TypeBarArray
  | { bottomBar: TypeBarObject } | TypeBarArray
  | { annotation: TypeAnnotationObject } | TypeAnnotationArray
  | { annotate: TypeAnnotateObject } | TypeAnnotateArray
  | { topComment: TypeCommentObject } | TypeCommentArray
  | { bottomComment: TypeCommentObject } | TypeCommentArray
  | [
    TypeEquationPhrase,
    TypeEquationPhrase,
    string,
    ?number,
  ]
  | Array<TypeEquationPhrase>
  | DiagramElementPrimative
  | DiagramElementCollection
  | Elements
  | Element;

/* eslint-enable no-use-before-define */
export type TypeFracObject = {
  numerator: TypeEquationPhrase;
  denominator: TypeEquationPhrase;
  symbol: string;
  scale?: number;
};
export type TypeFracArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  string,
  ?number,
];
export type TypeStrikeObject = {
  content: TypeEquationPhrase;
  symbol: string;
  strikeInSize?: boolean;
};
export type TypeStrikeArray = [
  TypeEquationPhrase,
  string,
  ?boolean,
];
export type TypeBracketObject = {
  content: TypeEquationPhrase;
  left?: string;
  right?: string;
  space?: number;
};
export type TypeBracketArray = [
  TypeEquationPhrase,
  ?string,
  ?string,
  ?number,
];
export type TypeSubObject = {
  content: TypeEquationPhrase;
  subscript: TypeEquationPhrase;
};
export type TypeSubArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
];
export type TypeSupObject = {
  content: TypeEquationPhrase;
  superscript: TypeEquationPhrase;
};
export type TypeSupArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
];
export type TypeSupSubObject = {
  content: TypeEquationPhrase;
  subscript: TypeEquationPhrase;
  superscript: TypeEquationPhrase;
  scale?: number;
  superscriptBias?: Point;
  subscriptBias?: Point;
};
export type TypeSupSubArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  TypeEquationPhrase,
  ?number,
  ?Point,
  ?Point,
];
export type TypeBarObject = {
  content: TypeEquationPhrase;
  symbol: string;
  space?: number;
};
export type TypeBarArray = [
  TypeEquationPhrase,
  string,
  ?number,
];
export type TypeCommentObject = {
  content: TypeEquationPhrase;
  comment: TypeEquationPhrase;
  symbol?: string;
  contentSpace?: number;
  commentSpace?: number;
  scale?: number;
};
export type TypeCommentArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  string,
  ?number,
  ?number,
  ?number,
];

export type TypeAnnotationObject = {
  annotation: TypeEquationPhrase,
  relativeToContent: [
    'left' | 'right' | 'center' | number,
    'bottom' | 'top' | 'middle' | 'baseline' | number,
  ],
  relativeToAnnotation: [
    'left' | 'right' | 'center' | number,
    'bottom' | 'top' | 'middle' | 'baseline' | number,
  ],
  scale?: number,
};
export type TypeAnnotationArray = [
  TypeEquationPhrase,
  'left' | 'right' | 'center' | number,
  'bottom' | 'top' | 'middle' | 'baseline' | number,
  'left' | 'right' | 'center' | number,
  'bottom' | 'top' | 'middle' | 'baseline' | number,
  ?number,
];
export type TypeAnnotateObject = {
  content: TypeEquationPhrase,
  // withAnnotations: Array<TypeAnnotationObject | TypeAnnotationArray>,
  withAnnotations: Array<TypeEquationPhrase>,
  includeAnnotationInSize?: boolean,
};
export type TypeAnnotateArray = [
  TypeEquationPhrase,
  Array<TypeEquationPhrase>,
  ?boolean,
];

export class EquationFunctions {
  // eslint-disable-next-line no-use-before-define
  elements: DiagramElementCollection;
  shapes: {};
  contentToElement: (TypeEquationPhrase | Elements) => Elements;

  // [methodName: string]: (TypeEquationPhrase) => {};

  // eslint-disable-next-line no-use-before-define
  constructor(elements: DiagramElementCollection) {
    this.elements = elements;
  }

  // eslint-disable-next-line class-methods-use-this
  stringToElement(content: string) {
    if (content.startsWith('space')) {
      const spaceNum = parseFloat(content.replace(/space[_]*/, '')) || 0.03;
      return new Element(new BlankElement(spaceNum));
    }
    const diagramElement = getDiagramElement(this.elements, content);
    if (diagramElement) {
      return new Element(diagramElement);
    }
    return null;
  }

  parseContent(content: ?TypeEquationPhrase) {
    if (content == null) {
      return null;
    }
    if (content instanceof Elements) {
      return content;
    }
    if (typeof content === 'string') {
      return this.stringToElement(content);
    }
    if (Array.isArray(content)) {
      let elementArray = [];
      content.forEach((c) => {
        const result = this.parseContent(c);
        if (Array.isArray(result)) {
          elementArray = [...elementArray, ...result];
        } else {
          elementArray.push(result);
        }
      });
      return elementArray;
    }
    // Otherwise its an object
    const [method, params] = Object.entries(content)[0];
    // if (this[method] != null) {
    // return this[method](params);
    // }
    // $FlowFixMe
    return this.eqnMethod(method, params);
  }

  contentToElement(
    content: TypeEquationPhrase | Elements,
  ): Elements {
    // If input is alread an Elements object, then return it
    if (content instanceof Elements) {
      return content._dup();
    }
    let elementArray = this.parseContent(content);
    if (!Array.isArray(elementArray)) {
      elementArray = [elementArray];
    }
    return new Elements(elementArray);
  }

  eqnMethod(name: string, params: {}) {
    // $FlowFixMe
    if (name === 'frac') { return this.frac(params); }        // $FlowFixMe
    if (name === 'strike') { return this.strike(params); }    // $FlowFixMe
    if (name === 'brac') { return this.brac(params); }        // $FlowFixMe
    if (name === 'sub') { return this.sub(params); }          // $FlowFixMe
    if (name === 'sup') { return this.sup(params); }          // $FlowFixMe
    if (name === 'supSub') { return this.supSub(params); }    // $FlowFixMe
    if (name === 'topBar') { return this.topBar(params); }    // $FlowFixMe
    if (name === 'bottomBar') { return this.bottomBar(params); }
    // $FlowFixMe
    if (name === 'annotate') { return this.annotate(params); }
    // $FlowFixMe
    if (name === 'annotation') { return this.annotation(params); }
    // $FlowFixMe
    if (name === 'bottomComment') { return this.bottomComment(params); }
    // $FlowFixMe
    if (name === 'topComment') { return this.topComment(params); }
    return null;
  }

  frac(
    optionsOrNum: TypeFracObject | TypeFracArray | TypeEquationPhrase,
    den: TypeEquationPhrase | null = null,
    sym: string | null = null,
    fractionScale?: number | null = null,
  ) {
    let numerator;
    let denominator;
    let symbol;
    let scale;

    // This is imperfect type checking, as the assumption is if den, sym
    // and fractionScale is null, then they weren't defined by the caller
    // and therefore the caller is passing in a TypeFracObject or TypeFracArray
    // All the flow errors go away if TypeEquationPhrase is removed from
    // optionsOrNum (and then also remove the first if statement below)
    if (!(den == null && sym == null && fractionScale == null)) {
      numerator = optionsOrNum;
      denominator = den;
      symbol = sym;
      scale = fractionScale;
    } else if (Array.isArray(optionsOrNum)) {       // $FlowFixMe
      [numerator, denominator, symbol, scale] = optionsOrNum;
    } else {
      ({                                            // $FlowFixMe
        numerator, denominator, symbol, scale,
      } = optionsOrNum);
    }
    const f = new Fraction(                         // $FlowFixMe
      this.contentToElement(numerator),             // $FlowFixMe
      this.contentToElement(denominator),           // $FlowFixMe
      getDiagramElement(this.elements, symbol),     // $FlowFixMe
    );
    if (scale != null) {                            // $FlowFixMe
      f.scaleModifier = scale;
    }
    return f;
  }

  supSub(
    optionsOrContent: TypeSupSubObject | TypeSupSubArray | TypeEquationPhrase,
    sup: TypeEquationPhrase | null = null,
    sub: TypeEquationPhrase | null = null,
    scriptScale: number | null = null,
    supBias: TypeParsablePoint | null = null,
    subBias: TypeParsablePoint | null = null,
  ) {
    let content;
    let superscript = null;
    let subscript = null;
    let scale = null;
    let subscriptBias = null;
    let superscriptBias = null;
    if (!(sup == null && sub == null && scriptScale == null)) {
      content = optionsOrContent;
      superscript = sup;
      subscript = sub;
      scale = scriptScale;
      subscriptBias = subBias;
      superscriptBias = supBias;
    } else if (Array.isArray(optionsOrContent)) {           // $FlowFixMe
      [content, superscript, subscript, scale, superscriptBias, subscriptBias] = optionsOrContent;
    } else {
      ({                                                    // $FlowFixMe
        content, superscript, subscript, scale, superscriptBias, subscriptBias,
      } = optionsOrContent);
    }

    // $FlowFixMe
    subscriptBias = subscriptBias == null ? null : parsePoint(subscriptBias);
    // $FlowFixMe
    superscriptBias = superscriptBias == null ? null : parsePoint(superscriptBias);

    return new SuperSub(                                    // $FlowFixMe
      this.contentToElement(content),                       // $FlowFixMe
      this.contentToElement(superscript),                   // $FlowFixMe
      this.contentToElement(subscript),                     // $FlowFixMe
      scale,                                                // $FlowFixMe
      superscriptBias,                                      // $FlowFixMe
      subscriptBias,
    );
  }

  strike(options: TypeStrikeObject | TypeStrikeArray) {
    let content;
    let symbol;
    let strikeInSize;
    if (Array.isArray(options)) {
      [content, symbol, strikeInSize] = options;
    } else {
      ({
        content, symbol, strikeInSize,
      } = options);
    }
    return new Strike(
      this.contentToElement(content),
      getDiagramElement(this.elements, symbol),
      strikeInSize,
    );
  }

  brac(options: TypeBracketObject | TypeBracketArray) {
    let content;
    let left;
    let right;
    let space;
    if (Array.isArray(options)) {
      [content, left, right, space] = options;
    } else {
      ({
        content, left, right, space,
      } = options);
    }
    let leftBracket = null;
    if (left != null) {
      leftBracket = getDiagramElement(this.elements, left);
    }
    let rightBracket = null;
    if (right != null) {
      rightBracket = getDiagramElement(this.elements, right);
    }
    let spaceToUse = 0.03;
    if (space != null) {
      spaceToUse = space;
    }
    return new Brackets(
      this.contentToElement(content),
      leftBracket,
      rightBracket,
      spaceToUse,
    );
  }

  sub(options: TypeSubObject | TypeSubArray) {
    let content;
    let subscript;
    if (Array.isArray(options)) {
      [content, subscript] = options;
    } else {
      ({
        content, subscript,
      } = options);
    }
    return new SuperSub(
      this.contentToElement(content),
      null,
      this.contentToElement(subscript),
    );
  }

  sup(options: TypeSupObject | TypeSupArray) {
    let content;
    let superscript;
    if (Array.isArray(options)) {
      [content, superscript] = options;
    } else {
      ({
        content, superscript,
      } = options);
    }
    return new SuperSub(
      this.contentToElement(content),
      this.contentToElement(superscript),
      null,
    );
  }

  

  topBar(options: TypeBarObject | TypeBarArray) {
    let content;
    let symbol;
    let space;
    if (Array.isArray(options)) {
      [content, symbol, space] = options;
    } else {
      ({
        content, symbol, space,
      } = options);
    }
    let spaceToUse = 0.03;
    if (space != null) {
      spaceToUse = space;
    }
    return new Bar(
      this.contentToElement(content),
      getDiagramElement(this.elements, symbol),
      spaceToUse,
      0.03,
      'top',
    );
  }

  bottomBar(options: TypeBarObject | TypeBarArray) {
    let content;
    let symbol;
    let space;
    if (Array.isArray(options)) {
      [content, symbol, space] = options;
    } else {
      ({
        content, symbol, space,
      } = options);
    }
    let spaceToUse = 0.03;
    if (space != null) {
      spaceToUse = space;
    }
    return new Bar(
      this.contentToElement(content),
      getDiagramElement(this.elements, symbol),
      spaceToUse,
      0.03,
      'bottom',
    );
  }

  bottomComment(options: TypeCommentObject | TypeCommentArray) {
    let content;
    let comment;
    let symbol;
    let contentSpace;
    let commentSpace;
    let scale;
    if (Array.isArray(options)) {
      [content, comment, symbol, contentSpace, commentSpace, scale] = options;
    } else {
      ({
        content, comment, symbol, contentSpace, commentSpace, scale,
      } = options);
    }
    let contentSpaceToUse = 0.03;
    if (contentSpace != null) {
      contentSpaceToUse = contentSpace;
    }
    let commentSpaceToUse = 0.03;
    if (commentSpace != null) {
      commentSpaceToUse = commentSpace;
    }
    let scaleToUse = 0.6;
    if (scale != null) {
      scaleToUse = scale;
    }
    let contentToUse;
    if (symbol) {
      contentToUse = new Bar(
        this.contentToElement(content),
        getDiagramElement(this.elements, symbol),
        contentSpaceToUse,
        commentSpaceToUse,
        'bottom',
      );
    } else {
      contentToUse = content;
    }
    return this.annotate({
      content: contentToUse,
      withAnnotations: [
        this.annotation({
          annotation: comment,
          relativeToContent: ['center', 'bottom'],
          relativeToAnnotation: ['center', 'top'],
          scale: scaleToUse,
        }),
      ],
    });
  }

  topComment(options: TypeCommentObject | TypeCommentArray) {
    let content;
    let comment;
    let symbol;
    let contentSpace;
    let commentSpace;
    let scale;
    if (Array.isArray(options)) {
      [content, comment, symbol, contentSpace, commentSpace, scale] = options;
    } else {
      ({
        content, comment, symbol, contentSpace, commentSpace, scale,
      } = options);
    }
    let contentSpaceToUse = 0.03;
    if (contentSpace != null) {
      contentSpaceToUse = contentSpace;
    }
    let commentSpaceToUse = 0.03;
    if (commentSpace != null) {
      commentSpaceToUse = commentSpace;
    }
    let scaleToUse = 0.6;
    if (scale != null) {
      scaleToUse = scale;
    }

    let contentToUse;
    if (symbol) {
      contentToUse = new Bar(
        this.contentToElement(content),
        getDiagramElement(this.elements, symbol),
        contentSpaceToUse,
        commentSpaceToUse,
        'top',
      );
    } else {
      contentToUse = content;
    }
    return this.annotate({
      content: contentToUse,
      withAnnotations: [
        this.annotation({
          annotation: comment,
          relativeToContent: ['center', 'top'],
          relativeToAnnotation: ['center', 'bottom'],
          scale: scaleToUse,
        }),
      ],
    });
  }

  annotate(options: TypeAnnotateObject | TypeAnnotateArray) {
    let content;
    let withAnnotations;
    let includeAnnotationInSize;
    if (Array.isArray(options)) {
      [content, withAnnotations, includeAnnotationInSize] = options;
    } else {
      ({
        content, withAnnotations, includeAnnotationInSize,
      } = options);
    }
    const annotations = withAnnotations.map(
      (annotation) => {
        if (annotation instanceof AnnotationInformation) {
          return annotation;
        }
        return this.parseContent(annotation);
      },
    );
    let includeAnnotationInSizeToUse = true;
    if (includeAnnotationInSize != null) {
      includeAnnotationInSizeToUse = includeAnnotationInSize;
    }
    return new Annotation(
      this.contentToElement(content),    // $FlowFixMe
      annotations,
      includeAnnotationInSizeToUse,
    );
  }

  annotation(options: TypeAnnotationObject | TypeAnnotationArray) {
    let annotation;
    let relativeToContentH;
    let relativeToContentV;
    let relativeToAnnotationH;
    let relativeToAnnotationV;
    let scale;
    if (Array.isArray(options)) {
      [
        annotation, relativeToContentH, relativeToContentV,
        relativeToAnnotationH, relativeToAnnotationV, scale,
      ] = options;
    } else {
      let relativeToContent;
      let relativeToAnnotation;
      ({
        annotation, relativeToContent, relativeToAnnotation, scale,
      } = options);
      [relativeToContentH, relativeToContentV] = relativeToContent;
      [relativeToAnnotationH, relativeToAnnotationV] = relativeToAnnotation;
    }

    let scaleToUse = 0.6;
    if (scale != null) {
      scaleToUse = scale;
    }

    return new AnnotationInformation(
      this.contentToElement(annotation),
      relativeToContentH,
      relativeToContentV,
      relativeToAnnotationH,
      relativeToAnnotationV,
      scaleToUse,
    );
  }
}
