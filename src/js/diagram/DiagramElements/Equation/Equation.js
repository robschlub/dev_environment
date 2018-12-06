// @flow
import {
  Point, Transform,
} from '../../tools/g2';
import { joinObjects } from '../../../tools/tools';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
import {
  DiagramFont,
} from '../../DrawingObjects/TextObject/TextObject';
import { BlankElement, Element, Elements } from './Elements/Element';
import Fraction from './Elements/Fraction';
import EquationForm from './EquationForm';
import type {
  TypeHAlign, TypeVAlign,
} from './EquationForm';
import HTMLObject from '../../DrawingObjects/HTMLObject/HTMLObject';
import * as html from '../../../tools/htmlGenerator';
import Strike from './Elements/Strike';
// import DiagramPrimatives from '../../DiagramPrimatives/DiagramPrimatives';
import SuperSub from './Elements/SuperSub';
import { Brackets, Bar } from './Elements/Brackets';
import { Annotation, AnnotationInformation } from './Elements/Annotation';
import EquationSymbols from './EquationSymbols';

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

// type TypeEquationInput = Array<Elements | Element | string> | Elements | Element | string;

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
  | [
    TypeEquationPhrase,
    TypeEquationPhrase,
    string,
    ?number,
  ]
  | {                                 // Top Comment
    topComment: {
      content: TypeEquationPhrase;
      comment: TypeEquationPhrase;
      symbol?: string;
      space?: number;
      outsideSpace?: number;
    }
  }
  | [
    TypeEquationPhrase,
    TypeEquationPhrase,
    string,
    ?number,
    ?number,
  ]
  | {                                 // Bottom Comment
    bottomComment: {
      content: TypeEquationPhrase;
      comment: TypeEquationPhrase;
      symbol?: string;
      space?: number;
      outsideSpace?: number;
    }
  }
  | Array<TypeEquationPhrase>;

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
};
export type TypeSupSubArray = [
  TypeEquationPhrase,
  TypeEquationPhrase,
  TypeEquationPhrase,
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
  scale: number,
};
export type TypeAnnotationArray = [
  TypeEquationPhrase,
  'left' | 'right' | 'center' | number,
  'bottom' | 'top' | 'middle' | 'baseline' | number,
  'left' | 'right' | 'center' | number,
  'bottom' | 'top' | 'middle' | 'baseline' | number,
  number,
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

class EquationFunctions {
  // eslint-disable-next-line no-use-before-define
  collection: EquationNew;
  shapes: {};
  contentToElement: (TypeEquationPhrase | Elements) => Elements;

  // [methodName: string]: (TypeEquationPhrase) => {};

  // eslint-disable-next-line no-use-before-define
  constructor(collection: EquationNew) {
    this.collection = collection;
  }

  // eslint-disable-next-line class-methods-use-this
  stringToElement(content: string) {
    if (content.startsWith('space')) {
      const spaceNum = parseFloat(content.replace(/space[_]*/, '')) || 0.03;
      return new Element(new BlankElement(spaceNum));
    }
    const diagramElement = getDiagramElement(this.collection, content);
    if (diagramElement) {
      return new Element(diagramElement);
    }
    return null;
  }

  parseContent(content: ?TypeEquationPhrase) {
    if (content == null) {
      return null;
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
    if (name === 'frac') {
      // $FlowFixMe
      return this.frac(params);
    }
    if (name === 'strike') {
      // $FlowFixMe
      return this.strike(params);
    }
    if (name === 'brac') {
      // $FlowFixMe
      return this.brac(params);
    }
    if (name === 'sub') {
      // $FlowFixMe
      return this.sub(params);
    }
    if (name === 'sup') {
      // $FlowFixMe
      return this.sup(params);
    }
    if (name === 'supSub') {
      // $FlowFixMe
      return this.supSub(params);
    }
    if (name === 'topBar') {
      // $FlowFixMe
      return this.topBar(params);
    }
    if (name === 'bottomBar') {
      // $FlowFixMe
      return this.bottomBar(params);
    }
    if (name === 'annotate') {
      // $FlowFixMe
      return this.annotate(params);
    }
    if (name === 'annotation') {
      // $FlowFixMe
      return this.annotation(params);
    }
    return null;
  }

  frac(options: TypeFracObject | TypeFracArray) {
    let numerator;
    let denominator;
    let symbol;
    let scale;
    if (Array.isArray(options)) {
      [numerator, denominator, symbol, scale] = options;
    } else {
      ({
        numerator, denominator, symbol, scale,
      } = options);
    }
    const f = new Fraction(
      this.contentToElement(numerator),
      this.contentToElement(denominator),
      getDiagramElement(this.collection, symbol),
    );
    if (scale != null) {
      f.scaleModifier = scale;
    }
    return f;
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
      getDiagramElement(this.collection, symbol),
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
      leftBracket = getDiagramElement(this.collection, left);
    }
    let rightBracket = null;
    if (right != null) {
      rightBracket = getDiagramElement(this.collection, right);
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

  supSub(options: TypeSupSubObject | TypeSupSubArray) {
    let content;
    let superscript = null;
    let subscript = null;
    if (Array.isArray(options)) {
      [content, superscript, subscript] = options;
    } else {
      ({
        content, superscript, subscript,
      } = options);
    }
    return new SuperSub(
      this.contentToElement(content),
      this.contentToElement(superscript),
      this.contentToElement(subscript),
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
      getDiagramElement(this.collection, symbol),
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
      getDiagramElement(this.collection, symbol),
      spaceToUse,
      0.03,
      'bottom',
    );
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
      annotation => this.parseContent(annotation),
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

    return new AnnotationInformation(
      this.contentToElement(annotation),
      relativeToContentH,
      relativeToContentV,
      relativeToAnnotationH,
      relativeToAnnotationV,
      scale,
    );
  }
}

// Priority:
//   1. symbol
//   2. text
type TypeEquationElement = string | {
    // Text only
    text?: string;
    font?: DiagramFont;
    style?: 'italic' | 'normal' | null;
    // Symbol Only
    symbol?: string;
    numLines?: number;
    side?: 'top' | 'left' | 'bottom' | 'right';
    // Both Text and Symbol
    color?: Array<number>;
    elementOptions?: {};
  } | DiagramElementPrimative | DiagramElementCollection;

export type TypeEquationElements = {
  [elementName: string]: TypeEquationElement;
}

type TypeEquationFormObject = {
  content: TypeEquationPhrase,
  elementMods?: {
    [elementName: string]: {
      color?: Array<number>,
      direction: 'fromPrev' | 'fromNext' | 'fromAny' | null,
      elementOptions?: {},
    }
  },
  subForm?: string,
  alignment?: {
    fixTo?: Point | string,
    scale?: number,
    alignH?: TypeHAlign | null,
    alignV?: TypeVAlign | null,
  },
};

type TypeEquationForm = TypeEquationPhrase
                        | TypeEquationFormObject
                        | {
                          [subFormName: string]: TypeEquationFormObject
                                                 | TypeEquationPhrase;
                        };

export type TypeEquationForms = {
  [formName: string]: TypeEquationForm
};

export type TypeEquationOptions = {
  color?: Array<number>;
  fontMath?: DiagramFont;
  fontText?: DiagramFont;
  position?: Point;
  defaultFormAlignment?: {
    fixTo?: Point;
    alignH?: TypeHAlign;
    alignV?: TypeVAlign;
  };
  //
  elements?: TypeEquationElements;
  forms?: TypeEquationForms;
  formSeries?: Array<string>;
  //
};

// An Equation is a collection of elements that can be arranged into different
// forms.
// Equation allows setting of forms, and navigating through form series
// Eqn manages different forms of the
export class EquationNew extends DiagramElementCollection {
  eqn: {
    forms: { [formName: string]: {
        base: EquationForm;                   // There is always a base form
        [subFormName: string]: EquationForm;  // Sub forms may differ in units
        name: string;                         // Name of form
      }
    };
    functions: EquationFunctions;
    symbols: EquationSymbols;
    currentForm: string;
    currentSubForm: string;
    fontMath: DiagramFont;
    fontText: DiagramFont;

    subFormPriority: Array<string>,
    //
    // formSeries: { [seriesName: String]: Array<EquationForm> };
    formSeries: Array<string>;
    currentFormSeries: string;

    //
    defaultFormAlignment: {
      fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
      alignH: TypeHAlign;
      alignV: TypeVAlign;
      scale: number,
    };

    isAnimating: boolean;

    descriptionElement: DiagramElementPrimative | null;
    descriptionPosition: Point;

    // getCurrentFormSeries: () => ?Array<EquationForm>;
    // getCurrentForm: () => ?EquationForm;
    //
    // showForm: (EquationForm | string, ?string) => {};
    //
  };

  // isTouchDevice: boolean;
  // animateNextFrame: void => void;
  shapes: Object;

  constructor(
    shapes: Object,
    // equations: Object,
    // equation: Object,
    // isTouchDevice: boolean,
    // animateNextFrame: void => void,
    options: TypeEquationOptions = {},
  ) {
    let { color } = options;
    if (color == null) {
      color = [0.5, 0.5, 0.5, 1];
    }
    const defaultOptions = {
      color,
      fontMath: new DiagramFont(
        'Times New Roman',
        'normal',
        0.2, '200', 'left', 'alphabetic', color,
      ),
      fontText: new DiagramFont(
        'Times New Roman',
        'italic',
        0.2, '200', 'left', 'alphabetic', color,
      ),
      position: new Point(0, 0),
      defaultFormAlignment: {
        fixTo: new Point(0, 0),
        alignH: 'left',
        alignV: 'baseline',
        scale: 0.7,
      },
      elements: {},
    };
    const optionsToUse = joinObjects({}, defaultOptions, options);

    super(new Transform('Equation')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0), shapes.limits);
    this.shapes = shapes;
    this.color = optionsToUse.color;
    // this.isTouchDevice = isTouchDevice;
    // this.animateNextFrame = animateNextFrame;

    // Set default values
    this.eqn = {
      forms: {},
      currentForm: '',
      currentSubForm: '',
      subFormPriority: ['base'],
      formSeries: [],
      currentFormSeries: '',
      defaultFormAlignment: optionsToUse.defaultFormAlignment,
      functions: new EquationFunctions(this),
      symbols: new EquationSymbols(this.shapes, this.color),
      fontMath: optionsToUse.fontMath,
      fontText: optionsToUse.fontText,
      isAnimating: false,
      descriptionElement: null,
      descriptionPosition: new Point(0, 0),
    };

    this.setPosition(optionsToUse.position);

    if (optionsToUse.elements != null) {
      this.addElements(optionsToUse.elements);
    }

    if (optionsToUse.forms != null) {
      this.addForms(optionsToUse.forms);
    }

    if (optionsToUse.formSeries != null) {
      this.setFormSeries(optionsToUse.formSeries);
    }
  }

  addElements(
    elems: TypeEquationElements,
  ) {
    // Helper function to add text element
    const makeTextElem = (options: { text: string, font?: DiagramFont, style?: 'italic' | 'normal', color?: Array<number> }) => {
      // Priority:
      //  1. color
      //  2. font
      //  3. style
      //  4. fontMath or fontText based on actual text
      let fontToUse: DiagramFont = this.eqn.fontMath;
      if (options.text.match(/[A-Z,a-z]/)) {
        fontToUse = this.eqn.fontText;
      }
      if (options.style != null) {
        if (options.style === 'italic') {
          fontToUse = this.eqn.fontText;
        }
        if (options.style === 'normal') {
          fontToUse = this.eqn.fontMath;
        }
      }
      if (options.font != null) {
        fontToUse = options.font;
      }
      const p = this.shapes.txt(
        options.text,
        { location: new Point(0, 0), font: fontToUse },
      );
      if (options.color != null) {
        p.setColor(options.color);
      }
      return p;
    };

    // Helper function to add symbol element
    const makeSymbolElem = (options: { symbol: string, numLines?: number,
    side?: 'top' | 'left' | 'bottom' | 'right', color?: Array<number>}) => {
      let symbol = this.eqn.symbols.get(options.symbol, options);
      // console.log('got', symbol)
      if (symbol == null) {
        symbol = makeTextElem({
          text: `Symbol ${options.symbol} not valid`,
        });
      }
      if (options.color == null) {
        symbol.setColor(this.color);
      }
      return symbol;
    };

    // Go through each element and add it
    Object.keys(elems).forEach((key) => {
      // const [key, elem] = entry;
      const elem = elems[key];
      if (typeof elem === 'string') {
        if (!key.startsWith('space')) {
          this.add(key, makeTextElem({ text: elem }));
        }
      } else if (elem instanceof DiagramElementPrimative) {
        this.add(key, elem);
      } else if (elem instanceof DiagramElementCollection) {
        this.add(key, elem);
      } else {
        let diagramElem;
        if (elem.symbol != null && typeof elem.symbol === 'string') {
          // console.log(elem.symbol)
          // $FlowFixMe
          diagramElem = makeSymbolElem(elem);
        } else if (elem.text != null && elem.text) {
          // $FlowFixMe
          diagramElem = makeTextElem(elem);
        }
        if (diagramElem != null) {
          if (elem.elementOptions != null) {
            diagramElem.setProperties(elem.elementOptions);
          }
          this.add(key, diagramElem);
        }
      }
    });

    this.setFirstTransform(this.transform);
  }

  addDescriptionElement(
    descriptionElement: DiagramElementPrimative | null = null,
    descriptionPosition: Point = new Point(0, 0),
  ) {
    this.eqn.descriptionElement = descriptionElement;
    this.eqn.descriptionPosition = descriptionPosition;
    if (this.eqn.descriptionElement) {
      this.eqn.descriptionElement
        .setPosition(this.getDiagramPosition()
          .add(descriptionPosition));
    }
  }

  setPosition(pointOrX: Point | number, y: number = 0) {
    super.setPosition(pointOrX, y);
    const position = this.getDiagramPosition();
    // console.log(this.eqn, this.eqn.descriptionElement)
    if (this.eqn.descriptionElement != null) {
      this.eqn.descriptionElement.setPosition(position.add(this.eqn.descriptionPosition));
    }
  }

  // scaleForm(name: string, scale: number, subForm: string = 'base') {
  //   // console.log(name, this.form, formType, this.form[name][formType])
  //   if (name in this.eqn.forms) {
  //     if (subForm in this.eqn.forms[name]) {
  //       this.eqn.forms[name][subForm].arrange(
  //         scale,
  //         this.eqn.formAlignment.hAlign,
  //         this.eqn.formAlignment.vAlign,
  //         this.eqn.formAlignment.fixTo,
  //       );
  //     }
  //   }
  // }

  // scale(scale: number) {
  //   Object.keys(this.form).forEach((name) => {
  //     Object.keys(this.form[name]).forEach((formType) => {
  //       if (formType !== 'name') {
  //         this.scaleForm(name, scale, formType);
  //       }
  //     });
  //   });
  // }

  addForms(forms: TypeEquationForms) {
    const isFormString = form => typeof form === 'string';
    const isFormArray = form => Array.isArray(form);
    const isFormMethod = (form) => {
      if (isFormString(form) || isFormArray(form)) {
        return false;
      }
      if (form != null && typeof form === 'object') {
        // $FlowFixMe
        const keys = Object.keys(form);
        if (keys.length === 1 && keys[0] in this.eqn.functions) {
          return true;
        }
      }
      return false;
    };
    const isFormFullObject = (form) => {
      if (isFormString(form) || isFormArray(form) || isFormMethod(form)) {
        return false;
      }
      if (form != null && typeof form === 'object' && form.content != null) {
        return true;
      }
      return false;
    };

    Object.keys(forms).forEach((name) => {
      const form: TypeEquationForm = forms[name];
      if (isFormString(form) || isFormArray(form) || isFormMethod(form)) {
        // $FlowFixMe
        const formContent = [this.eqn.functions.contentToElement(form)];
        this.addForm(name, formContent);
      } else if (isFormFullObject(form)) {
        // $FlowFixMe
        const formContent = [this.eqn.functions.contentToElement(form.content)];
        const {
          // $FlowFixMe
          subForm, addToSeries, elementMods, time, description, modifiers,
        } = form;
        const options = {
          subForm,
          addToSeries,
          elementMods,
          time,
          description,
          modifiers,
        };
        // $FlowFixMe
        this.addForm(name, formContent, options);
      } else {
        Object.entries(form).forEach((subFormEntry) => {
          const [subFormName, subForm] = subFormEntry;
          const subFormOption = { subForm: subFormName };
          if (isFormString(subForm) || isFormArray(subForm) || isFormMethod(subForm)) {
            // $FlowFixMe
            const formContent = [this.eqn.functions.contentToElement(subForm)];
            this.addForm(name, formContent, subFormOption);
          } else {
            // $FlowFixMe
            const formContent = [this.eqn.functions.contentToElement(subForm.content)];
            const {
              // $FlowFixMe
              addToSeries, elementMods, time, description, modifiers,
            } = subForm;
            const options = joinObjects({
              subForm,
              addToSeries,
              elementMods,
              time,
              description,
              modifiers,
            }, subFormOption);
            this.addForm(name, formContent, options);
          }
        });
      }
    });
  }

  addForm(
    name: string,
    content: Array<Elements | Element>,
    options: {
      subForm?: string,
      elementMods?: Object,
      time?: number | null | { fromPrev?: number, fromNext?: number },
      description?: string,
      modifiers?: Object,
    } = {},
  ) {
    if (!(name in this.eqn.forms)) {
      // $FlowFixMe   - its ok for this to start undefined, it will be filled.
      this.eqn.forms[name] = {};
    }
    const defaultOptions = {
      subForm: 'base',
      elementMods: {},
      time: null,                // use velocities instead of time
      description: '',
      modifiers: {},
    };
    let optionsToUse = defaultOptions;
    if (options) {
      optionsToUse = joinObjects({}, defaultOptions, options);
    }
    const {
      subForm, description, modifiers,
      time, elementMods,
    } = optionsToUse;
    this.eqn.forms[name].name = name;
    const form = this.eqn.forms[name];
    form[subForm] = new EquationForm(this);
    // form[subForm].name = subForm;
    form[subForm].description = description;
    form[subForm].modifiers = modifiers;
    form[subForm].name = name;
    form[subForm].subForm = subForm;
    form[subForm].elementMods = {};
    if (typeof time === 'number') {
      form[subForm].time = {
        fromPrev: time, fromNext: time, fromAny: time,
      };
    } else if (time == null) {
      form[subForm].time = null;
    } else {
      const defaultTime = { fromPrev: null, fromNext: null, fromAny: null };
      form[subForm].time = joinObjects(defaultTime, time);
    }
    Object.keys(elementMods).forEach((elementName) => {
      const diagramElement = getDiagramElement(this, elementName);
      if (diagramElement) {
        let color;
        let elementOptions;
        if (Array.isArray(elementMods[elementName])) {
          [color, elementOptions] = elementMods[elementName];
        } else {
          ({
            color, elementOptions,
          } = elementMods[elementName]);
        }
        form[subForm].elementMods[elementName] = {
          element: diagramElement,
          color,
          elementOptions,
        };
      }
    });

    form[subForm].content = content;
    form[subForm].arrange(
      this.eqn.defaultFormAlignment.scale,
      this.eqn.defaultFormAlignment.alignH,
      this.eqn.defaultFormAlignment.alignV,
      this.eqn.defaultFormAlignment.fixTo,
    );
    // const { addToSeries } = optionsToUse;
    // console.log(addToSeries)
    // if (addToSeries != null && addToSeries !== '' && typeof addToSeries === 'string') {
    //   if (this.eqn.formSeries[addToSeries] == null) {
    //     this.eqn.formSeries[addToSeries] = [];
    //   }
    //   this.eqn.formSeries[addToSeries].push(form);
    // }
    // make the first form added also equal to the base form as always
    // need a base form for some functions
    if (this.eqn.forms[name].base === undefined) {
      const baseOptions = joinObjects({}, optionsToUse);
      baseOptions.subForm = 'base';
      this.addForm(name, content, baseOptions);
    }

    if (this.eqn.currentForm === '') {
      this.eqn.currentForm = name;
    }
    if (this.eqn.currentSubForm === '') {
      this.eqn.currentSubForm = 'base';
    }
  }

  setFormSeries(series: Array<string>) {
    this.eqn.formSeries = series.slice();
  }

  getCurrentForm() {
    if (this.eqn.forms[this.eqn.currentForm] == null) {
      return null;
    }
    if (this.eqn.forms[this.eqn.currentForm][this.eqn.currentSubForm] == null) {
      return null;
    }
    return this.eqn.forms[this.eqn.currentForm][this.eqn.currentSubForm];
  }

  render() {
    const form = this.getCurrentForm();
    if (form != null) {
      form.showHide();
      this.show();
      form.setPositions();
      // this.updateDescription();
    }
  }

  setCurrentForm(
    formOrName: EquationForm | string,
    subForm: string = 'base',
  ) {
    if (typeof formOrName === 'string') {
      this.eqn.currentForm = '';
      this.eqn.currentSubForm = '';
      if (formOrName in this.eqn.forms) {
        this.eqn.currentForm = formOrName;
        if (subForm in this.eqn.forms[formOrName]) {
          this.eqn.currentSubForm = subForm;
        }
      }
    } else {
      this.eqn.currentForm = formOrName.name;
      this.eqn.currentSubForm = formOrName.subForm;
    }
  }

  showForm(
    formOrName: EquationForm | string,
    subForm: ?string = null,
  ) {
    this.show();
    let form = formOrName;
    if (typeof formOrName === 'string') {
      form = this.getForm(formOrName, subForm);
    }
    if (form) {
      this.setCurrentForm(form);
      this.render();
    }
  }

  getForm(
    formOrName: string | EquationForm,
    subForm: ?string,
  ): null | EquationForm {
    if (formOrName instanceof EquationForm) {
      return formOrName;
    }
    if (formOrName in this.eqn.forms) {
      let formTypeToUse = subForm;
      if (formTypeToUse == null) {
        const possibleFormTypes     // $FlowFixMe
          = this.eqn.subFormPriority.filter(fType => fType in this.eqn.forms[formOrName]);
        if (possibleFormTypes.length) {
          // eslint-disable-next-line prefer-destructuring
          formTypeToUse = possibleFormTypes[0];
        }
      }
      if (formTypeToUse != null) {
        return this.eqn.forms[formOrName][formTypeToUse];
      }
    }
    return null;
  }

  goToForm(
    name: ?string | number = null,
    time: number | null = null,
    delay: number = 0,
    fromWhere: 'fromPrev' | 'fromNext' | 'fromAny' | null = 'fromAny',
    animate: boolean = true,
    callback: null | () => void = null,
  ) {
    if (this.eqn.isAnimating) {
      this.stop(true, true);
      this.stop(true, true);
      this.eqn.isAnimating = false;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        this.showForm(currentForm);
      }
      return;
    }
    this.stop();
    this.stop();
    this.eqn.isAnimating = false;

    // By default go to the next form in a series
    let nextIndex = 0;
    if (name == null) {
      let index = 0;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        index = this.eqn.formSeries.indexOf(currentForm.name);
        if (index < 0) {
          index = 0;
        }
      }
      nextIndex = index + 1;
      if (nextIndex === this.eqn.formSeries.length) {
        nextIndex = 0;
      }
    } else if (typeof name === 'number') {
      nextIndex = name;
    } else {
      nextIndex = this.eqn.formSeries.indexOf(name);
      if (nextIndex < 0) {
        nextIndex = 0;
      }
    }

    const nextForm = this.eqn.forms[this.eqn.formSeries[nextIndex]];
    let nextSubForm = null;
    let subFormToUse = null;
    const possibleSubForms
          = this.eqn.subFormPriority.filter(sf => sf in nextForm);
    if (possibleSubForms.length) {
      // eslint-disable-next-line prefer-destructuring
      subFormToUse = possibleSubForms[0];
    }

    if (subFormToUse != null) {
      // $FlowFixMe
      nextSubForm = nextForm[subFormToUse];
      if (time === 0) {
        this.showForm(nextSubForm);
        if (callback != null) {
          callback();
        }
      } else {
        this.eqn.isAnimating = true;
        const end = () => {
          this.eqn.isAnimating = false;
          if (callback != null) {
            callback();
          }
        };
        if (animate) {
          let timeToUse = time;
          // $FlowFixMe - this is going to be ok
          if (nextSubForm.time != null && nextSubForm.time[fromWhere] != null) {
            timeToUse = nextSubForm.time[fromWhere];
          }
          nextSubForm.animatePositionsTo(delay, 0.4, timeToUse, 0.4, end);
        } else {
          nextSubForm.allHideShow(delay, 0.5, 0.2, 0.5, end);
        }
        this.setCurrentForm(nextSubForm);
      }
      this.updateDescription();
    }
  }

  getFormIndex(formToGet: EquationForm | string) {
    const form = this.getForm(formToGet);
    let index = -1;
    if (form != null) {
      index = this.eqn.formSeries.indexOf(form.name);
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
        index = this.eqn.formSeries.length - 1;
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
      if (index > this.eqn.formSeries.length - 1) {
        index = 0;
        animate = false;
      }
      this.goToForm(index, time, delay, 'fromPrev', animate);
    }
  }

  replayCurrentForm(time: number) {
    if (this.eqn.isAnimating) {
      this.stop(true, true);
      this.stop(true, true);
      this.eqn.isAnimating = false;
      const currentForm = this.getCurrentForm();
      if (currentForm != null) {
        this.showForm(currentForm);
      }
      return;
    }
    this.stop();
    this.stop();
    this.eqn.isAnimating = false;
    this.prevForm(0);
    this.nextForm(time, 0.5);
  }

  animateToForm(
    name: string,
    time: number | null = null,
    delay: number = 0,
    callback: null | () => void = null,
  ) {
    this.stopAnimatingColor(true, true);
    this.stopAnimatingColor(true, true);
    this.stop();
    this.stop();
    const form = this.getForm(name);
    if (form != null) {
      form.animatePositionsTo(delay, 0.4, time, 0.4, callback);
    }
    this.setCurrentForm(name);
  }


  changeDescription(
    formOrName: EquationForm | string,
    description: string = '',
    modifiers: Object = {},
    subForm: string = 'base',
  ) {
    const form = this.getForm(formOrName, subForm);
    if (form != null) {
      form.description = `${description}`;
      form.modifiers = modifiers;
    }
  }

  updateDescription(
    formOrName: EquationForm | string | null = null,
    subForm: string = 'base',
  ) {
    const element = this.eqn.descriptionElement;
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
      form = this.getForm(formOrName, subForm);
    } else {
      form = formOrName;
    }
    if (form == null) {
      return;
    }
    if (form.description == null) {
      return;
    }

    const { drawingObject } = element;
    if (drawingObject instanceof HTMLObject) {
      drawingObject.change(
        html.applyModifiers(form.description, form.modifiers),
        element.lastDrawTransform.m(),
      );
      html.setOnClicks(form.modifiers);
    }
  }
}
