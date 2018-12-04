// @flow
import {
  Point, Transform,
} from '../../tools/g2';
// import { roundNum } from '../../tools/mathtools';
import { RGBToArray, joinObjects } from '../../../tools/tools';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../Element';
import {
  DiagramText, DiagramFont, TextObject,
} from '../../DrawingObjects/TextObject/TextObject';
// import DrawContext2D from '../../DrawContext2D';
// import * as html from '../../../tools/htmlGenerator';
// import { TextObject } from './DrawingObjects/TextObject/TextObject';
// import HTMLObject from '../../DrawingObjects/HTMLObject/HTMLObject';
import { BlankElement, Element, Elements } from './Elements/Element';
import Fraction from './Elements/Fraction';
import EquationForm from './EquationForm';
import type {
  TypeHAlign, TypeVAlign,
} from './EquationForm';

// import Strike from './Elements/Strike';
// import SuperSub from './Elements/SuperSub';
// import { Brackets, Bar } from './Elements/Brackets';
// import { Annotation, AnnotationInformation } from './Elements/Annotation';
// // Equation is a class that takes a set of drawing objects (TextObjects,
// // DiagramElementPrimatives or DiagramElementCollections and HTML Objects
// // and arranges their size in a )

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

function contentToElement(
  collection: DiagramElementCollection,
  content: TypeEquationInput,
): Elements {
  // If input is alread an Elements object, then return it
  if (content instanceof Elements) {
    return content._dup();
  }

  // If it is not an Elements object, then create an Element(s) array
  // and create a new Elements Object
  const elementArray: Array<Elements | Element | null> = [];

  // If the content is a string, then find the corresponding
  // DiagramElement associated with the string
  if (typeof content === 'string') {
    if (content.startsWith('space')) {
      const spaceNum = parseFloat(content.replace(/space[_]*/, '')) || 0.03;
      elementArray.push(new Element(new BlankElement(spaceNum)));
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
        if (c.startsWith('space')) {
          const spaceNum = parseFloat(c.replace(/space[_]*/, '')) || 0.03;
          elementArray.push(new Element(new BlankElement(spaceNum)));
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

// export type TypeEquation = {
//   +collection: DiagramElementCollection;
//   diagramLimits: Rect;
//   firstTransform: Transform;
//   _dup: () => TypeEquation;
//   form: Object;
//   unitsForm: Object;
//   currentForm: ?EquationForm;
//   // currentFormName: string;
//   formAlignment: {
//     vAlign: TypeVAlign;
//     hAlign: TypeHAlign;
//     fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
//     scale: number;
//   };
//   addForm: (string, Array<Elements | Element | string>) => void;
//   scaleForm: (string, number) => void;
//   setElem: (DiagramElementCollection | DiagramElementPrimative | string,
//             Array<number> | null,
//             boolean,
//             'up' | 'down' | 'left' | 'right' | '',
//             number) => void;
//   frac: (
//       TypeEquationInput,
//       TypeEquationInput,
//       string | DiagramElementPrimative | DiagramElementCollection,
//     ) => Fraction;
//   sfrac: (
//       TypeEquationInput,
//       TypeEquationInput,
//       string | DiagramElementPrimative | DiagramElementCollection, number,
//     ) => Fraction;
//   setCurrentForm: (EquationForm | string) => void;
//   render: () => void;
//   setPosition: (Point) => void;
//   stop: () => void;
//   scale: (number) => void;
//   isAnimating: boolean;

//   +showForm: (EquationForm | string, ?string) => {};
// };

class EquationFunctions {
  // eslint-disable-next-line no-use-before-define
  collection: EquationNew;
  shapes: {};

  // eslint-disable-next-line no-use-before-define
  constructor(collection: EquationNew) {
    this.collection = collection;
  }

  frac(options: {
      numerator: TypeEquationInput,
      denominator: TypeEquationInput,
      symbol: string | DiagramElementPrimative | DiagramElementCollection,
    }
    | [
        TypeEquationInput,
        TypeEquationInput,
        string | DiagramElementPrimative | DiagramElementCollection
      ]) {
    let numerator;
    let denominator;
    let symbol;
    if (Array.isArray(options)) {
      [numerator, denominator, symbol] = options;
    } else {
      ({ numerator, denominator, symbol } = options);
    }
    return new Fraction(
      contentToElement(this.collection, numerator),
      contentToElement(this.collection, denominator),
      getDiagramElement(this.collection, symbol),
    );
  }

  vinculum(options: { color?: Array<number> } = {}) {
    let { color } = options;
    if (color == null) {
      color = [0.5, 0.5, 0.5, 1];
    }
    return this.collection.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }
}


export type TypeEquationPhrase =
  string
  | Array<string
    | TypeEquationPhrase
    | {                                 // Fraction and SmallFraction
      numerator: TypeEquationPhrase;
      denominator: TypeEquationPhrase;
      symbol: string;
      scaleModifier?: number;
    }
    | {                                 // Superscript and Subscript
      content: TypeEquationPhrase;
      subscript?: TypeEquationPhrase;
      superscript?: TypeEquationPhrase;
    }
    | {                                 // Strike
      content: TypeEquationPhrase;
      symbol: string;
      strikeInSize?: boolean;
    }
    | {                                 // Annotation
      content: TypeEquationPhrase;
      annotationArray: Array<{
        content: TypeEquationPhrase;
        xPosition?: 'left' | 'right' | 'center';
        yPosition?: 'bottom' | 'top' | 'middle' | 'baseline';
        xAlign?: 'left' | 'right' | 'center';
        yAlign?: 'bottom' | 'top' | 'middle' | 'baseline';
        scale?: number;
      }>;
      annotationInSize?: boolean;
    }
    | {                                 // Bracket
      content: TypeEquationPhrase;
      symbol: string;
      symbol: string;
      space?: number;
    }
    | {                                 // Top and Bottom Bar
      content: TypeEquationPhrase;
      symbol: string;
      space?: number;
      outsideSpace?: number;
    }
    | {                                 // Top and Bottom Comment
      content: TypeEquationPhrase;
      comment: TypeEquationPhrase;
      symbol: string;
      space?: number;
      outsideSpace?: number;
    }>;

// Priority:
//   1. symbol
//   2. text
export type TypeEquationElements = {
  [elementName: string]: string | {
    // Text only
    text?: string;
    font?: DiagramFont;
    style?: 'italic' | 'normal' | null;
    // Symbol Only
    symbol?: string;
    numLines?: number;
    orientation?: 'up' | 'left' | 'down' | 'right';
    // Both Text and Symbol
    color?: Array<number>;
    elementOptions?: {};
  } | DiagramElementPrimative | DiagramElementCollection;
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

export type TypeEquationForms = {
  [formName: string]: TypeEquationPhrase
    | TypeEquationFormObject
    | {
      [subFormName: string]: TypeEquationFormObject;
    }
};

export type TypeEquationOptions = {
  color?: Array<number>;
  fontMath?: DiagramFont;
  fontText?: DiagramFont;
  position?: Point;
  defaultFormAlignment?: {
    fixTo?: Point;
    hAlign?: TypeHAlign;
    vAlign?: TypeVAlign;
  };
  //
  elements: TypeEquationElements;
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
    } };
    functions: {};
    currentForm: string;
    currentSubForm: string;
    fontMath: DiagramFont;
    fontText: DiagramFont;

    subFormPriority: Array<string>,
    //
    formSeries: { [seriesName: String]: Array<EquationForm> };
    currentFormSeries: string;

    //
    defaultFormAlignment: {
      fixTo: DiagramElementPrimative | DiagramElementCollection | Point;
      hAlign: TypeHAlign;
      vAlign: TypeVAlign;
      scale: number,
    };

    getCurrentFormSeries: () => ?Array<EquationForm>;
    getCurrentForm: () => ?EquationForm;
    //
    showForm: (EquationForm | string, ?string) => {};
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
        hAlign: 'left',
        vAlign: 'baseline',
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
    this.setPosition(optionsToUse.position);
    // this.isTouchDevice = isTouchDevice;
    // this.animateNextFrame = animateNextFrame;

    // Set default values
    this.eqn = {
      forms: {},
      currentForm: '',
      currentSubForm: '',
      subFormPriority: ['base'],
      formSeries: {},
      currentFormSeries: '',
      defaultFormAlignment: optionsToUse.defaultFormAlignment,
      functions: new EquationFunctions(this),
      fontMath: optionsToUse.fontMath,
      fontText: optionsToUse.fontText,
    };

    if (optionsToUse.elements != null) {
      this.addElements(optionsToUse.elements);
    }

    if (optionsToUse.forms != null) {
      this.addForms(optionsToUse.forms);
    }
  }

  // addElements(
  //   elems: Object,
  //   // colorOrFont: Array<number> | DiagramFont = [],
  //   // descriptionElement: DiagramElementPrimative | null = null,
  //   // descriptionPosition: Point = new Point(0, 0),
  // ) {
  //   this.addEquationElements(elems);
  //   // this.addDescriptionElement(descriptionElement, descriptionPosition);
  // }

  addElements(
    elems: TypeEquationElements,
    // colorOrFont: Array<number> | DiagramFont = [],
  ) {
    // Helper function to add text element
    const makeTextElem = (options: { text: string, font?: DiagramFont, style?: 'italic' | 'normal', color?: Array<number> }) => {
      // Priority:
      //  1. color
      //  2. font
      //  3. style
      //  4. fontMath or fontText based on actual text
      let fontToUse: DiagramFont = this.eqn.fontMath;
      if (options.style != null) {
        if (options.style === 'italic') {
          fontToUse = this.eqn.fontText;
        }
        if (options.style === 'normal') {
          fontToUse = this.eqn.fontMath;
        }
      } else if (options.font != null) {
        fontToUse = options.font;
      } else if (options.text.match(/[A-Z,a-z]/)) {
        fontToUse = this.eqn.fontText;
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
    orientation?: 'up' | 'left' | 'down' | 'right', color?: Array<number>}) => {
      let symbol = null;
      if (this.eqn.functions[options.symbol] != null) {
        symbol = this.eqn.functions[options.symbol](options);
      } else {
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
      if (typeof elems[key] === 'string') {
        if (!key.startsWith('space')) {
          this.add(key, makeTextElem({ text: elems[key] }));
        }
      } else if (elems[key] instanceof DiagramElementPrimative) {
        this.add(key, elems[key]);
      } else if (elems[key] instanceof DiagramElementCollection) {
        this.add(key, elems[key]);
      } else {
        let elem;
        const {
          text, symbol, elementOptions,
        } = elems[key];
        if (symbol != null) {
          elem = makeSymbolElem(elems[key]);
        } else if (text != null) {
          elem = makeTextElem(elems[key]);
        }
        if (elem != null) {
          if (elementOptions != null) {
            elem.setProperties(elementOptions);
          }
          this.add(key, elem);
        }
      }
    });

    this.setFirstTransform(this.transform);
  }

  addForms(forms: TypeEquationForms,) {

  }

  addForm(
    name: string,
    content: Array<Elements | Element | string>,
    options: {
      subForm?: string,
      addToSeries?: string,
      elementMods?: Object,
      time?: number | null | { fromPrev?: number, fromNext?: number },
      description?: string,
      modifiers?: Object,
    } = {},
  ) {
    if (!(name in this.eqn.forms)) {
      this.eqn.forms[name] = {};
    }
    const defaultOptions = {
      subForm: 'base',
      addToSeries: '',
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
      subForm, description, modifiers,
      animationTime, elementMods, addToSeries,
    } = optionsToUse;
    const time = animationTime;
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
      form[name].time = {
        fromPrev: time, fromNext: time, fromAny: time,
      };
    } else {
      form[subForm].time = time;
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
    // const form = this.form[name][formType];
    form[subForm].createEq(content);
    // form[subForm].subForm = formType;
    form[subForm].arrange(
      this.eqn.defaultFormAlignment.scale,
      this.eqn.defaultFormAlignment.hAlign,
      this.eqn.defaultFormAlignment.vAlign,
      this.eqn.defaultFormAlignment.fixTo,
    );
    // if (addToSeries != null && addToSeries !== '') {
    //   if (this.eqn.formSeries[addToSeries] == null) {
    //     this.eqn.formSeries[addToSeries] = [];
    //   }
    //   this.eqn.formSeries[addToSeries].push(this.eqn.forms[name]);
    // }
    // make the first form added also equal to the base form as always
    // need a base form for some functions
    if (this.eqn.forms[name].base === undefined) {
      const baseOptions = Object.assign({}, options);
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

  getCurrentForm() {
    console.log(this.eqn.currentForm, this.eqn.currentSubForm, this.eqn.forms)
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
    // console.log(formType, this.form[formOrName])
    if (formOrName in this.eqn.forms) {
      let formTypeToUse = subForm;
      if (formTypeToUse == null) {
        const possibleFormTypes
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
}
