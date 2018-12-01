// @flow
import WebGLInstance from '../webgl/webgl';
import {
  Rect, Point, Transform,
} from '../tools/g2';
import {
  DiagramElementCollection,
} from '../Element';
import { joinObjects } from '../../tools/tools';
import DrawContext2D from '../DrawContext2D';
import {
  DiagramFont,
} from '../DrawingObjects/TextObject/TextObject';
import Integral from '../DiagramElements/Equation/Integral';
import Bracket from '../DiagramElements/Equation/Bracket';
import Bar from '../DiagramElements/Equation/Bar';
import SquareBracket from '../DiagramElements/Equation/SquareBracket';
import Brace from '../DiagramElements/Equation/Brace';
import RoundedSquareBracket from '../DiagramElements/Equation/RoundedSquareBracket';

import {
  EquationForm, createEquationElements, Equation,
} from '../DiagramElements/Equation/GLEquation';
import type {
  TypeHAlign, TypeVAlign,
} from '../DiagramElements/Equation/GLEquation';
import HTMLEquation from '../DiagramElements/Equation/HTMLEquation';

export type TypeEquationArray =
  string
  | Array<string
    | TypeEquationArray
    | {                                 // Fraction and SmallFraction
      numerator: TypeEquationArray;
      denominator: TypeEquationArray;
      vinculum: string;
      scaleModifier?: number;
    }
    | {                                 // Superscript and Subscript
      content: TypeEquationArray;
      subscript?: TypeEquationArray;
      superscript?: TypeEquationArray;
    }
    | {                                 // Strike
      content: TypeEquationArray;
      strike: string;
      strikeInSize?: boolean;
    }
    | {                                 // Annotation
      content: TypeEquationArray;
      annotationArray: Array<{
        content: TypeEquationArray;
        xPosition?: 'left' | 'right' | 'center';
        yPosition?: 'bottom' | 'top' | 'middle' | 'baseline';
        xAlign?: 'left' | 'right' | 'center';
        yAlign?: 'bottom' | 'top' | 'middle' | 'baseline';
        scale?: number;
      }>;
      annotationInSize?: boolean;
    }
    | {                                 // Bracket
      content: TypeEquationArray;
      left: string;
      right: string;
      space?: number;
    }
    | {                                 // Top and Bottom Bar
      content: TypeEquationArray;
      bar: string;
      space?: number;
      outsideSpace?: number;
    }
    | {                                 // Top and Bottom Comment
      content: TypeEquationArray;
      comment: TypeEquationArray;
      bar: string;
      space?: number;
      outsideSpace?: number;
    }>;

export default class DiagramEquation {
  webgl: WebGLInstance;
  draw2D: DrawContext2D;
  limits: Rect;
  shapes: Object;

  constructor(
    shapes: Object,
  ) {
    this.webgl = shapes.webgl;
    this.draw2D = shapes.draw2D;
    this.limits = shapes.limits;
    this.shapes = shapes;
  }

  elements(
    elems: Object,
    colorOrFont: Array<number> | DiagramFont = [],
    firstTransform: Transform = new Transform('elements'),
  ): DiagramElementCollection {
    return createEquationElements(
      elems,
      this.draw2D,
      colorOrFont,
      this.limits,
      firstTransform,
    );
  }

  vinculum(color: Array<number> = [1, 1, 1, 1]) {
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('vinculum').scale(1, 1).translate(0, 0),
    );
  }

  strike(color: Array<number> = [1, 1, 1, 1]) {
    return this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
  }

  xStrike(color: Array<number> = [1, 1, 1, 1]) {
    const cross = this.shapes.collection(new Transform('strike').scale(1, 1).rotate(0).translate(0, 0));
    cross.color = color;
    const strike1 = this.shapes.horizontalLine(
      new Point(0, 0),
      1, 1, 0,
      color,
      new Transform('strike').scale(1, 1).rotate(0).translate(0, 0),
    );
    const strike2 = strike1._dup();
    cross.add('s1', strike1);
    cross.add('s2', strike2);
    return cross;
  }

  integral(
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Integral(
      this.webgl,
      color,
      numLines,
      new Transform('integral').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  bracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bracket(
      this.webgl,
      color,
      side,
      numLines,
      new Transform('bracket').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  bar(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Bar(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  squareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new SquareBracket(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  brace(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new Brace(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  roundedSquareBracket(
    side: 'left' | 'right' | 'top' | 'bottom',
    numLines: number = 1,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    return new RoundedSquareBracket(
      this.webgl, color, side, numLines,
      new Transform('bar').scale(1, 1).translate(0, 0),
      this.limits,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  make(equationCollection: DiagramElementCollection) {
    return new EquationForm(equationCollection);
  }

  // eslint-disable-next-line class-methods-use-this
  makeHTML(id: string = '', classes: string | Array<string> = []) {
    return new HTMLEquation(id, classes);
  }

  makeEqn() {
    return new Equation(
      this.draw2D,
      this.limits,
      // diagram.diagramToGLSpaceTransform,
    );
  }

  makeDescription(id: string) {
    return this.shapes.htmlElement(
      document.createElement('div'),
      id,
      'lesson__equation_description',
      new Point(0, 0), 'middle', 'left',
    );
  }

  // eslint-disable-next-line class-methods-use-this
  makeEqnFromOptions(...options: Array<{
    color?: Array<number>,
    position?: Point,
    currentForm?: string,
    addToCollection?: DiagramElementCollection;
    name?: string,
    elements: {
      [elementName: string]: string | {
        text: string,
        color?: Array<number>,
        isTouchable?: boolean,
        onClick?: () => void | null,
        direction?: '' | 'up' | 'left' | 'down' | 'right',
        mag?: number,
        z?: number,      // higher numbers are above lower numbers
        fontOrStyle?: DiagramFont | null,
        diagramElement: string | null,
        side?: 'up' | 'left' | 'down' | 'right',
        numLines?: number,
      },
    };
    formAlignment?: {
      fixTo?: Point | string,
      scale?: number,
      alignH?: TypeHAlign | null,
      alignV?: TypeVAlign | null,
    },
    forms?: {
      [formName: string]: TypeEquationArray | {
        content: TypeEquationArray,
        elementMods?: {
          [elementName: string]: {
            style?: 'linear' | 'curved',
            color?: Array<number>,
            direction?: '' | 'up' | 'left' | 'down' | 'right',
            mag?: number,
          }
        },
        type?: string,
        alignment?: {
          fixTo?: Point | string,
          scale?: number,
          alignH?: TypeHAlign | null,
          alignV?: TypeVAlign | null,
        },
      },
    },
    formSeries?: {
      [seriesName: string]: Array<string>,
    },
  }>) {
    const eqn = this.makeEqn();
    const defaultOptions = {
      color: [0.5, 0.5, 0.5, 1],
      position: new Point(0, 0),
      currentForm: 'base',
      formAlignment: {
        fixTo: new Point(0, 0),
        scale: 0.7,
        alignH: 'left',
        alignV: 'baseline',
      },
      elements: {},
      forms: {},
      formSeries: {},
    };
    const optionsToUse = joinObjects(defaultOptions, ...options);

    // Create Equation Elements
    const defElementOptions = {
      text: '',
      color: optionsToUse.color,
      isTouchable: false,
      onClick: null,
      direction: '',
      mag: 0,
      fontOrStyle: null,
      z: 1,
      diagramElement: null,
      side: 'left',
      numLines: 1,
    };
    Object.keys(optionsToUse.elements).forEach((elementName, index) => {
      const elementValue = optionsToUse.elements[elementName];
      let elementOptions;
      if (typeof elementValue === 'string') {
        elementOptions = joinObjects(defElementOptions, { text: elementValue });
      } else {
        elementOptions = joinObjects(defElementOptions, elementValue);
      }
      if (elementOptions.obj != null) {
        let diagramElement;
        if (elementOptions.obj === 'vinculum') {
          diagramElement = this.vinculum(elementOptions.color);
        }
        if (elementOptions.obj === 'bracket') {
          diagramElement = this.bracket(
            elementOptions.side, elementOptions.numLines, elementOptions.color,
          );
        }
        if (elementOptions.obj === 'brace') {
          diagramElement = this.brace(
            elementOptions.side, elementOptions.numLines, elementOptions.color,
          );
        }
        if (elementOptions.obj === 'bar') {
          diagramElement = this.brace(
            elementOptions.side, elementOptions.numLines, elementOptions.color,
          );
        }
        if (elementOptions.obj === 'squareBracket') {
          diagramElement = this.squareBracket(
            elementOptions.side, elementOptions.numLines, elementOptions.color,
          );
        }
        if (elementOptions.obj === 'roundedSquareBracket') {
          diagramElement = this.roundedSquareBracket(
            elementOptions.side, elementOptions.numLines, elementOptions.color,
          );
        }
        if (elementOptions.obj === 'strike') {
          diagramElement = this.strike(elementOptions.color);
        }
        if (elementOptions.obj === 'xStrike') {
          diagramElement = this.xStrike(elementOptions.color);
        }
        if (elementOptions.obj === 'integral') {
          diagramElement = this.integral(elementOptions.color);
        }
        if (diagramElement != null) {
          diagramElement.isTouchable = elementOptions.isTouchable;
          diagramElement.onClick = elementOptions.onClick;
          diagramElement.animate.transform.translation
            .options.direction = elementOptions.direction;
          diagramElement.animate.transform.translation
            .options.magnitude = elementOptions.mag;
          elementOptions = diagramElement;
        }
      }
      if (index === 0) {
        eqn.createElements({ elementName: elementOptions });
      } else {
        eqn.createElements(
          { elementName: elementOptions },
          [], null, new Point(0, 0),
          eqn.collection,
        );
      }
    });

    // Create Equation Forms
    const defElementMods = {
      style: 'linear',
      color: defElementOptions.color,
      direction: defElementOptions.direction,
      mag: defElementOptions.mag,
    };
    const defForm = {
      alignment: defaultOptions.formAlignment,
      type: 'base',
      elementMods: {},
      animationTime: null,
      addToSeries: false,
    };
    const makePhrase = (phrase: TypeEquationArray) => {
      const out = [];
      if (typeof phrase === 'string') {
        return [phrase];
      }
      for (let i = 0; i < phrase.length; i += 1) {
        const element = phrase[i];
        if (typeof element === 'string') {
          if (element.startsWith('.') && i < phrase.length - 1) {
            if (element === '.frac') {
              const parameters = phrase[i + 1];
              if (Array.isArray(parameters)) {
                const [num, den, vinculum] = parameters;
                out.push(eqn.frac(
                  makePhrase(num),
                  makePhrase(den),
                  vinculum,
                ));
              } else {
                const { numerator, denominator, vinculum } = parameters;
                out.push(eqn.frac(
                  makePhrase(numerator),
                  makePhrase(denominator),
                  vinculum,
                ));
              }
            }
            if (element === '.sfrac') {
              const parameters = phrase[i + 1];
              if (Array.isArray(parameters)) {
                const [num, den, vinculum] = parameters;
                out.push(eqn.frac(
                  makePhrase(num),
                  makePhrase(den),
                  vinculum,
                ));
              } else {
                const { numerator, denominator, vinculum } = parameters;
                out.push(eqn.frac(
                  makePhrase(numerator),
                  makePhrase(denominator),
                  vinculum,
                ));
              }
            }
          } else {
            out.push(element);
          }
        }
      }
      return out;
    };
    Object.keys(optionsToUse.forms).forEach((name) => {
      const form = optionsToUse.forms[name];
      let formOptions;
      if (Array.isArray(form)) {
        formOptions = joinObjects(defForm, { content: form });
      } else {
        formOptions = joinObjects(defForm, form);
      }
      Object.keys(formOptions.elementMods).forEach((key) => {
        formOptions.elementMods[key] = joinObjects(
          defElementMods,
          formOptions.elementMods[key],
        );
      });
      eqn.addForm(
        name,
        makePhrase(formOptions.content),
        {
          animationTime: formOptions.animationTime,
          elementMods: formOptions.elementMods,
          formType: formOptions.type,
          addToSeries: formOptions.addToSeries,
        },
      );
    });
    eqn.collection.setPosition(optionsToUse.position);
    eqn.setCurrentForm(optionsToUse.currentForm);
    const { addToCollection } = optionsToUse;
    if (addToCollection != null) {
      addToCollection.eqns[optionsToUse.name] = eqn;
      addToCollection.add(optionsToUse.name, eqn.collection);
    }
    return eqn;
  }

  fraction(...options: Array<{
      numerator?: string,
      denominotor?: string,
      color?: Array<number>,
      scale?: number,
    }>) {
    const defaultOptions = {
      numerator: '1',
      denominator: 'NOT DEFINED',
      color: [1, 0, 0, 1],
      scale: 0.5,
    };
    const optionsToUse = joinObjects(defaultOptions, ...options);

    const eqn = this.makeEqn();
    eqn.createElements({
      num: optionsToUse.numerator,
      den: optionsToUse.denominator,
      v: this.vinculum(optionsToUse.color),
    }, optionsToUse.color);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'baseline';
    eqn.formAlignment.scale = optionsToUse.scale;
    eqn.addForm('base', [eqn.frac('num', 'den', 'v')]);
    eqn.setCurrentForm('base');
    return eqn;
  }

  fractionPre(...options: Array<{
      numerator?: string,
      denominotor?: string,
      main?: string,
      color?: Array<number>,
      scale?: number,
      fracScale?: number,
    }>) {
    const defaultOptions = {
      numerator: '1',
      denominator: 'NOT DEFINED',
      main: 'NOT DEFINED',
      color: [1, 0, 0, 1],
      scale: 0.5,
      fracScale: 0.6,
    };
    const optionsToUse = joinObjects(defaultOptions, ...options);

    const eqn = this.makeEqn();
    eqn.createElements({
      num: optionsToUse.numerator,
      den: optionsToUse.denominator,
      main: optionsToUse.main,
      v: this.vinculum(optionsToUse.color),
    }, optionsToUse.color);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'baseline';
    eqn.formAlignment.scale = optionsToUse.scale;
    eqn.addForm('base', [eqn.sfrac('num', 'den', 'v', optionsToUse.fracScale), 'space', 'main']);
    eqn.setCurrentForm('base');
    return eqn;
  }
}
