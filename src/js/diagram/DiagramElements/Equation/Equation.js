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

// import Strike from './Elements/Strike';
// import SuperSub from './Elements/SuperSub';
// import { Brackets, Bar } from './Elements/Brackets';
// import { Annotation, AnnotationInformation } from './Elements/Annotation';

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

export type TypeEquationPhrase =
  string
  | number
  | {                                 // Fraction
    frac: {
      numerator: TypeEquationPhrase;
      denominator: TypeEquationPhrase;
      symbol: string;
      scale?: number;
    };
  }
  | {
    sup: {                            // Superscript
      content: TypeEquationPhrase;
      superscript: TypeEquationPhrase;
    }
  }
  | {
    sub: {                            // Subscript
      content: TypeEquationPhrase;
      subscript: TypeEquationPhrase;
    }
  }
  | {                                 // Superscript and Subscript
    supsub: {
      content: TypeEquationPhrase;
      subscript?: TypeEquationPhrase;
      superscript?: TypeEquationPhrase;
    }
  }
  | {                                 // Strike
    strike: {
      content: TypeEquationPhrase;
      symbol: string;
      strikeInSize?: boolean;
    }
  }
  | {                                 // Annotation
    annotate: {
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
  }
  | {                                 // Bracket
    brac: {
      content: TypeEquationPhrase;
      leftSymbol?: string;
      rightSymbol?: string;
      space?: number;
    }
  }
  | {                                 // Top
    topBar: {
      content: TypeEquationPhrase;
      symbol: string;
      space?: number;
      outsideSpace?: number;
    }
  }
  | {                                 // Bottom Bar
    bottomBar: {
      content: TypeEquationPhrase;
      symbol: string;
      space?: number;
      outsideSpace?: number;
    }
  }
  | {                                 // Top Comment
    topComment: {
      content: TypeEquationPhrase;
      comment: TypeEquationPhrase;
      symbol?: string;
      space?: number;
      outsideSpace?: number;
    }
  }
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

class EquationFunctions {
  // eslint-disable-next-line no-use-before-define
  collection: EquationNew;
  shapes: {};

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

  parseContent(content: TypeEquationPhrase) {
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
          elementArray.push(this.parseContent(c));
        }
      });
      return elementArray;
    }
    // Otherwise its an object
    const [method, params] = Object.entries(content)[0];
    if (this[method] != null) {
      return this[method](params);
    }
    return null;
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

  frac(options: {
      numerator: TypeEquationInput,
      denominator: TypeEquationInput,
      symbol: string | DiagramElementPrimative | DiagramElementCollection,
      scale?: number,
    }
    | [
        TypeEquationInput,
        TypeEquationInput,
        string | DiagramElementPrimative | DiagramElementCollection,
        ?number,
      ]) {
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

  addForms(forms: TypeEquationForms) {
    Object.entries(forms).forEach((entry) => {
      const [name, form] = entry;
      const formContent = [this.eqn.functions.contentToElement(form)];
      this.addForm(name, formContent);
      // console.log(name, form, )
      // this.addForm(name, this.eqn.functions.contentToElement(form));
    });
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
      animationTime, elementMods,
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
    // form[subForm].createEq(content);
    form[subForm].content = content;
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
