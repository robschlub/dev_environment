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
import EquationForm from './EquationForm';
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
  insideSpace?: number;
  outsideSpace?: number;
  useMinLineHeight?: boolean;
  heightScale?: number;
};
export type TypeBracketArray = [
  TypeEquationPhrase,
  ?string,
  ?string,
  ?number,
  ?number,
  ?boolean,
  ?number,
];
export type TypeSubObject = {
  content: TypeEquationPhrase;
  subscript: TypeEquationPhrase;
  scale?: number,
  bias?: TypeParsablePoint,
};
export type TypeSubArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  ?number,
  ?TypeParsablePoint,
];
export type TypeSupObject = {
  content: TypeEquationPhrase;
  superscript: TypeEquationPhrase;
  scale?: number,
  bias?: TypeParsablePoint,
};
export type TypeSupArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  ?number,
  ?TypeParsablePoint,
];
export type TypeSupSubObject = {
  content: TypeEquationPhrase;
  subscript: TypeEquationPhrase;
  superscript: TypeEquationPhrase;
  scale?: number;
  superscriptBias?: TypeParsablePoint;
  subscriptBias?: TypeParsablePoint;
};
export type TypeSupSubArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  TypeEquationPhrase,
  ?number,
  ?TypeParsablePoint,
  ?TypeParsablePoint,
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
  content: TypeEquationPhrase,                              // $FlowFixMe
  withAnnotations: Array<TypeEquationPhrase | AnnotationInformation>
                  | AnnotationInformation | TypeEquationPhrase,
  includeAnnotationInSize?: boolean,
};
export type TypeAnnotateArray = [
  TypeEquationPhrase,
  Array<TypeEquationPhrase>,
  ?boolean,
];

// There are lots of FlowFixMes in this file. This is not perfect, but
// haven't been able to come up with a quick work around. The problem statement
// is each function can accept as arguements either a full object definition
// or the definition split over parameters.
// The problem is then the first arguement can be so many types, some of which
// are subsets of the other, then when its parameters are extracted, their type
// is all confused.
export class EquationFunctions {
  // eslint-disable-next-line no-use-before-define
  elements: { [name: string]: DiagramElementCollection | DiagramElementPrimative };
  shapes: {};
  contentToElement: (TypeEquationPhrase | Elements) => Elements;
  phrases: {
    [phraseName: string]: TypeEquationPhrase,
  };

  fullLineHeight: EquationForm | null;

  // [methodName: string]: (TypeEquationPhrase) => {};

  // eslint-disable-next-line no-use-before-define
  constructor(elements: { [name: string]: DiagramElementCollection | DiagramElementPrimative }) {
    this.elements = elements;
    this.phrases = {};
    this.fullLineHeight = null;
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
    if (content in this.phrases) {
      return this.parseContent(this.phrases[content]);
    }
    return null;
  }

  parseContent(content: ?TypeEquationPhrase) {
    if (content == null) {
      return null;
    }
    if (typeof content === 'number') {
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
    content: TypeEquationPhrase | Elements | DiagramElementPrimative | DiagramElementCollection,
  ): Elements {
    // If input is alread an Elements object, then return it
    if (content instanceof Elements) {
      return content._dup();
    }
    if (content instanceof DiagramElementCollection
      || content instanceof DiagramElementPrimative
    ) {
      return new Elements([new Element(content)]);
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

  sup(
    optionsOrContent: TypeSupObject | TypeSupArray | TypeEquationPhrase,
    sup: TypeEquationPhrase | null = null,
    scriptScale: number | null = null,
    scriptBias: TypeParsablePoint | null = null,
  ) {
    let content;
    let superscript = null;
    let scale = null;
    let superscriptBias = null;
    if (!(sup == null && scriptScale == null && scriptBias == null)) {
      content = optionsOrContent;
      superscript = sup;
      scale = scriptScale;
      superscriptBias = scriptBias;
    } else if (Array.isArray(optionsOrContent)) {           // $FlowFixMe
      [content, superscript, scale, superscriptBias] = optionsOrContent;
    } else {
      ({                                                    // $FlowFixMe
        content, superscript, scale, superscriptBias,
      } = optionsOrContent);
    }

    // $FlowFixMe
    superscriptBias = superscriptBias == null ? null : parsePoint(superscriptBias);

    return new SuperSub(                                    // $FlowFixMe
      this.contentToElement(content),                       // $FlowFixMe
      this.contentToElement(superscript),                   // $FlowFixMe
      null,                                                 // $FlowFixMe
      scale,                                                // $FlowFixMe
      superscriptBias,                                      // $FlowFixMe
      null,
    );
  }

  sub(
    optionsOrContent: TypeSubObject | TypeSubArray | TypeEquationPhrase,
    sub: TypeEquationPhrase | null = null,
    scriptScale: number | null = null,
    scriptBias: TypeParsablePoint | null = null,
  ) {
    let content;
    let subscript = null;
    let scale = null;
    let subscriptBias = null;
    if (!(sub == null && scriptScale == null && scriptBias == null)) {
      content = optionsOrContent;
      subscript = sub;
      scale = scriptScale;
      subscriptBias = scriptBias;
    } else if (Array.isArray(optionsOrContent)) {           // $FlowFixMe
      [content, subscript, scale, subscriptBias] = optionsOrContent;
    } else {
      ({                                                    // $FlowFixMe
        content, subscript, scale, subscriptBias,
      } = optionsOrContent);
    }

    // $FlowFixMe
    subscriptBias = subscriptBias == null ? null : parsePoint(subscriptBias);

    return new SuperSub(                                    // $FlowFixMe
      this.contentToElement(content),                       // $FlowFixMe
      null,                                                 // $FlowFixMe
      this.contentToElement(subscript),                     // $FlowFixMe
      scale,                                                // $FlowFixMe
      null,                                                 // $FlowFixMe
      subscriptBias,
    );
  }

  strike(
    optionsOrContent: TypeStrikeObject | TypeStrikeArray | TypeEquationPhrase,
    sym: string | null = null,
    inSize: boolean | null = null,
    // options: TypeStrikeObject | TypeStrikeArray) {
  ) {
    let content;
    let symbol;
    let strikeInSize;
    if (!(sym == null && inSize == null)) {
      content = optionsOrContent;
      symbol = sym;
      strikeInSize = inSize;
    } else if (Array.isArray(optionsOrContent)) {         // $FlowFixMe
      [content, symbol, strikeInSize] = optionsOrContent;
    } else {
      ({                                                  // $FlowFixMe
        content, symbol, strikeInSize,
      } = optionsOrContent);
    }
    return new Strike(                                    // $FlowFixMe
      this.contentToElement(content),                     // $FlowFixMe
      getDiagramElement(this.elements, symbol),           // $FlowFixMe
      strikeInSize,
    );
  }


  annotate(
    optionsOrContent: TypeAnnotateObject
                      | TypeAnnotateArray
                      | TypeEquationPhrase,               // $FlowFixMe
    withAnnotationsArray: Array<TypeEquationPhrase | AnnotationInformation>
                        | AnnotationInformation | TypeEquationPhrase | null = null,
    includeAnnotationInSizeCalc: boolean | null = null,
  ) {
    let content;
    let withAnnotations;
    // let withAnnotation;
    let includeAnnotationInSize;
    if (!(withAnnotationsArray == null && includeAnnotationInSizeCalc == null)) {
      content = optionsOrContent;
      withAnnotations = withAnnotationsArray;
      includeAnnotationInSize = includeAnnotationInSizeCalc;
    } else if (Array.isArray(optionsOrContent)) {
      [content, withAnnotations, includeAnnotationInSize] = optionsOrContent;
    } else {
      ({                                                    // $FlowFixMe
        content, withAnnotations, includeAnnotationInSize,
      } = optionsOrContent);
      // console.log(withAnnotation)
      // if (withAnnotation != null) {
      //   withAnnotations = withAnnotation;
      // }
    }
    let annotations;
    // Case of single annotation in array form or array of annotations
    if (Array.isArray(withAnnotations)) {
      annotations = withAnnotations.map(
        (annotation) => {
          // annotation is an already instantiated AnnotationInformation
          if (annotation instanceof AnnotationInformation) {
            return annotation;
          }
          const parsedContent = this.parseContent(annotation);
          // case that annotation is a method object
          if (parsedContent instanceof AnnotationInformation) {
            return parsedContent;
          }                                                     // $FlowFixMe
          // Case of single annotation in array form
          if (Array.isArray(annotation)) {
            const annotationFromArray = this.annotation(annotation);
            if (annotationFromArray instanceof AnnotationInformation) {
              return annotationFromArray;
            }
          }
          return null;
        },
      );
      // Case of single annotation in array form
      if (annotations[0] === null) {                           // $FlowFixMe
        annotations = [this.annotation(withAnnotations)];
      }
    // Case of annotation as a Method Object, Method Array or
    // AnnotationInformation instantiation
    } else if (withAnnotations != null) {
      if (withAnnotations instanceof AnnotationInformation) {
        annotations = [withAnnotations];
      } else {
        const parsedContent = this.parseContent(withAnnotations);
        // Method Object
        if (parsedContent instanceof AnnotationInformation) {
          annotations = [parsedContent];
        // Array form only
        } else {                                                 // $FlowFixMe
          annotations = [this.annotation(withAnnotations)];
        }
      }
    }
    let includeAnnotationInSizeToUse = true;
    if (includeAnnotationInSize != null) {
      includeAnnotationInSizeToUse = includeAnnotationInSize;
    }
    return new Annotation(               // $FlowFixMe
      this.contentToElement(content),    // $FlowFixMe
      annotations,                       // $FlowFixMe
      includeAnnotationInSizeToUse,
    );
  }

  annotation(
    optionsOrAnnotation: TypeAnnotationObject | TypeAnnotationArray | TypeEquationPhrase,
    positionRelativeToContentH: 'left' | 'right' | 'center' | number | null = null,
    positionRelativeToContentV: 'bottom' | 'top' | 'middle' | 'baseline' | number | null = null,
    positionRelativeToAnnotationH: 'left' | 'right' | 'center' | number | null = null,
    positionRelativeToAnnotationV: 'bottom' | 'top' | 'middle' | 'baseline' | number | null = null,
    annotationScale: number | null = null,
  ) {
    let annotation;
    let relativeToContentH;
    let relativeToContentV;
    let relativeToAnnotationH;
    let relativeToAnnotationV;
    let scale;
    if (!(positionRelativeToContentH == null
          && positionRelativeToContentV == null
          && positionRelativeToAnnotationH == null
          && positionRelativeToAnnotationV == null
          && annotationScale == null)
    ) {
      annotation = optionsOrAnnotation;
      relativeToContentH = positionRelativeToContentH;
      relativeToContentV = positionRelativeToContentV;
      relativeToAnnotationH = positionRelativeToAnnotationH;
      relativeToAnnotationV = positionRelativeToAnnotationV;
      scale = annotationScale;
    } else if (Array.isArray(optionsOrAnnotation)) {
      [
        annotation, relativeToContentH, relativeToContentV,   // $FlowFixMe
        relativeToAnnotationH, relativeToAnnotationV, scale,  // $FlowFixMe
      ] = optionsOrAnnotation;
    } else {
      let relativeToContent;
      let relativeToAnnotation;
      ({                                                      // $FlowFixMe
        annotation, relativeToContent, relativeToAnnotation, scale,
      } = optionsOrAnnotation);
      [relativeToContentH, relativeToContentV] = relativeToContent;
      [relativeToAnnotationH, relativeToAnnotationV] = relativeToAnnotation;
    }

    let scaleToUse = 0.6;
    if (scale != null) {
      scaleToUse = scale;
    }

    return new AnnotationInformation(           // $FlowFixMe
      this.contentToElement(annotation),        // $FlowFixMe
      relativeToContentH,                       // $FlowFixMe
      relativeToContentV,                       // $FlowFixMe
      relativeToAnnotationH,                    // $FlowFixMe
      relativeToAnnotationV,                    // $FlowFixMe
      scaleToUse,
    );
  }

  brac(
    optionsOrContent: TypeBracketObject | TypeBracketArray | TypeEquationPhrase,
    leftBracketString: string | null = null,
    rightBracketString: string | null = null,
    insideSpaceToContent: number | null = null,
    outsideSpaceToContent: number | null = null,
    useMinLineHeightForLine: boolean | null = null,
    bracketHeightScale: number | null = null,
  ) {
    let content;
    let left;
    let right;
    let insideSpace;
    let outsideSpace;
    let useMinLineHeight;
    let heightScale;
    if (!(leftBracketString == null
          && rightBracketString == null
          && insideSpaceToContent == null
          && outsideSpaceToContent == null
          && useMinLineHeightForLine == null)
    ) {
      content = optionsOrContent;
      left = leftBracketString;
      right = rightBracketString;
      insideSpace = insideSpaceToContent;
      outsideSpace = outsideSpaceToContent;
      useMinLineHeight = useMinLineHeightForLine;
      heightScale = bracketHeightScale;
    } else if (Array.isArray(optionsOrContent)) {
      [                                                    // $FlowFixMe
        content, left, right, insideSpace, outsideSpace,   // $FlowFixMe
        useMinLineHeight, heightScale,
      ] = optionsOrContent;
    } else {
      ({                                                   // $FlowFixMe
        content, left, right, insideSpace, outsideSpace, useMinLineHeight, heightScale,
      } = optionsOrContent);
    }
    let leftBracket = null;
    if (left != null) {                                    // $FlowFixMe
      leftBracket = getDiagramElement(this.elements, left);
    }
    let rightBracket = null;
    if (right != null) {                                   // $FlowFixMe
      rightBracket = getDiagramElement(this.elements, right);
    }
    let insideSpaceToUse;
    if (insideSpace != null) {
      insideSpaceToUse = insideSpace;
    }
    let outsideSpaceToUse;
    if (outsideSpace != null) {
      outsideSpaceToUse = outsideSpace;
    }
    let minLineHeight = this.fullLineHeight;
    if (useMinLineHeight != null && useMinLineHeight === false) {
      minLineHeight = null;
    }
    let heightScaleToUse;
    if (heightScale != null) {
      heightScaleToUse = heightScale;
    }
    return new Brackets(                                   // $FlowFixMe
      this.contentToElement(content),                      // $FlowFixMe
      leftBracket,                                         // $FlowFixMe
      rightBracket,                                        // $FlowFixMe
      insideSpaceToUse,                                    // $FlowFixMe
      outsideSpaceToUse,
      minLineHeight,                                       // $FlowFixMe
      heightScaleToUse,
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

}
