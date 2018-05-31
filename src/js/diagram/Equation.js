// @flow
import { Point } from './tools/g2';
import { roundNum } from './tools/mathtools';
import { DiagramElementPrimative, DiagramElementCollection } from './Element';
// import { TextObject } from './DrawingObjects/TextObject/TextObject';
// import { HTMLObject } from './DrawingObjects/HTMLObject/HTMLObject';

// Equation is a class that takes a set of drawing objects (TextObjects, DiagramElementPrimatives or DiagramElementCollections and HTML Objects and arranges their size in a )

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
      // const { parentCount } = content.lastDrawElementTransformPosition;
      // const tPos = content.lastDrawTransform.order.length - parentCount - 1;
      // const sPos = content.lastDrawTransform.order.length - parentCount - 2;

      // content.lastDrawTransform.order[sPos].x = scale;
      // content.lastDrawTransform.order[sPos].y = scale;
      // content.lastDrawTransform.order[tPos].x = location.x;
      // content.lastDrawTransform.order[tPos].y = location.y;
      // content.lastDrawTransform.calcMatrix();
      // if (content.name === 'a') {
      //   console.log("2", content.lastDrawTransform.order)
      // }
      // console.log(content.lastDrawTransform.matrix())
      // // Update the last draw transform matrix with the new translation
      // // and scale so calculating relative diagram boundaries is correct
      // const transformLength = content.transform.order.length;
      // content.lastDrawTransform.order = content.lastDrawTransform.order
      //   .slice(0, -transformLength)
      //   .concat(content.transform.order);
      // content.lastDrawTransform.calcMatrix();
      // console.log(content.lastDrawTransform.matrix())
      // Get the boundaries of element
      const r = content.getRelativeDiagramBoundingRect();
      this.ascent = r.top;
      this.descent = -r.bottom;
      this.height = r.height;
      this.width = r.width;
      content.show = true;
    }
  }
}

class Elements {
  content: Array<Element | Elements>;
  ascent: number;
  descent: number;
  width: number;
  location: Point;
  height: number;

  constructor(content: Array<Element | Elements | null>) {
    const filteredContent = [];
    content.forEach((c) => {
      if (c !== null) {
        filteredContent.push(c);
      }
    });
    this.content = filteredContent;
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
}

class FractionNew extends Elements {
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

    this.vSpaceNum = scale * 0.15;
    this.vSpaceDenom = scale * 0.15;
    this.lineVAboveBaseline = this.mini ? incomingScale * 0.35 : scale * 0.35;
    this.lineWidth = scale * 0.05;

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
      vinculum.show = true;
    }
  }
}

class SuperSubNew extends Elements {
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
class IntegralNew extends Elements {
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
    const integralSymbolLocation = new Point(
      loc.x,
      loc.y - Math.max(
        limitMinBounds.ascent + contentBounds.height / 2,
        scale / 3,
      ),
    );
    const numLines = roundNum(integralMinHeight / scale, 0);

    const { integralGlyph } = this;
    if (integralGlyph instanceof DiagramElementPrimative) {
      integralGlyph.show = true;
      const height = numLines * scale * 1.5;
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

class DiagramEquationNew extends Elements {
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

  calcSize(location: Point, scale: number) {
    this.collection.hideAll();
    this.collection.show = true;
    super.calcSize(location, scale);
  }
  animateTo(
    location: Point,
    scale: number,
    time: number = 1,
  ) {
    const currentTransforms = this.collection.getElementTransforms();
    this.calcSize(location, scale);
    const animateToTransforms = this.collection.getElementTransforms();
    this.collection.setElementTransforms(currentTransforms);
    this.collection.animateToTransforms(animateToTransforms, time);
  }

  contentToElement(content: EquationInput): Elements {
    // If input is alread an Elements object, then return it
    if (content instanceof Elements) {
      return content;
    }

    // If it is not an Elements object, then create an Element(s) array
    // and create a new Elements Object
    const elementArray: Array<Elements | Element> = [];

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
    return new FractionNew(
      this.contentToElement(numerator),
      this.contentToElement(denominator),
      this.getDiagramElement(vinculum),
    );
  }

  sub(
    content: EquationInput,
    subscript: EquationInput,
  ) {
    return new SuperSubNew(
      this.contentToElement(content),
      null,
      this.contentToElement(subscript),
    );
  }

  sup(
    content: EquationInput,
    superscript: EquationInput,
  ) {
    return new SuperSubNew(
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
    return new SuperSubNew(
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
    return new IntegralNew(
      this.contentToElement(limitMin),
      this.contentToElement(limitMax),
      this.contentToElement(content),
      this.getDiagramElement(integralGlyph),
    );
  }
}


function makeDiv(
  id: string,
  classes: Array<string>,
  text: string,
  indent: number = 0,
) {
  const indentStr = ' '.repeat(indent);
  const idStr = id ? ` id="${id}"` : '';
  const classString = classes ? ` ${classes.join(' ')}` : '';
  let out = `${indentStr}<div${idStr} class="equation_element${classString}">\n`;
  out += `${text}\n`;
  out += `${indentStr}</div>`;
  return out;
}

// Most fundamental Equation Element properties includes element size and
// location, as well as html id and classes.
class ElementProperties {
  id: string;
  classes: Array<string>;
  ascent: number;
  descent: number;
  width: number;
  location: Point;

  constructor(id: string = '', classes: string | Array<string> = '') {
    this.id = id;
    if (Array.isArray(classes)) {
      this.classes = classes;
    } else if (classes.length > 0) {
      this.classes = classes.split(' ');
    } else {
      this.classes = [];
    }
  }

  render(indent: number = 0, text: string = '') {
    return makeDiv(
      this.id,
      this.classes,
      text,
      indent,
    );
  }

  // eslint-disable-next-line no-unused-vars
  calcSize(loc: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.ascent = 0;
    this.descent = 0;
    this.width = 0;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  draw(ctx: CanvasRenderingContext2D) {
  }
}


class Text extends ElementProperties {
  text: string;
  textElement: DiagramElementPrimative | DiagramElementCollection;

  constructor(
    text: string | DiagramElementPrimative | DiagramElementCollection = '',
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.classes.push('equation_text');
    this.text = '';
    if (typeof text === 'string') {
      this.text = text;
    } else {
      this.textElement = text;
    }
  }

  render(indent: number = 0) {
    return super.render(indent, `${' '.repeat(indent + 2)}${this.text}`);
  }

  setFont(fontSize: number) {
    if (this.textElement) {
      this.textElement.setFont(fontSize);
    }
  }
  calcSize(loc: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    if (this.text) {
      ctx.font = 'italic 20px Times New Roman';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      const m = ctx.measureText(this.text);
      this.width = m.actualBoundingBoxRight + m.actualBoundingBoxLeft;
      this.descent = m.actualBoundingBoxDescent;
      this.ascent = m.actualBoundingBoxAscent;
      this.location = loc.copy();
    } else {
      this.setFont(fontSize);
      const m = this.textElement.getRelativeDiagramBoundingRect();
      this.width = m.width;
      this.descent = -m.bottom;
      this.ascent = m.top;
      this.location = loc.copy();
      this.textElement.transform.updateTranslation(loc.x, loc.y);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.text, this.location.x, this.location.y);
  }
}

class E extends ElementProperties {
  content: Array<ElementProperties>;

  constructor(
    content: string | Array<ElementProperties> | DiagramElementCollection | DiagramElementPrimative,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.applyContent(content);
  }

  applyContent(content: string | Array<ElementProperties> |
               DiagramElementCollection | DiagramElementPrimative) {
    if (Array.isArray(content)) {
      this.content = content;
    } else if (typeof content === 'string') {
      this.content = [new Text(content)];
    } else {
      this.content = [new Text(content)];
    }
  }

  render(indent: number = 0) {
    return super.render(indent, this.content.map(c => c.render(indent + 2)).join('\n'));
  }

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    // ctx.font = 'italic 20px Times New Roman';
    let des = 0;
    let asc = 0;
    const loc = location.copy();
    // console.log(this.content)
    this.content.forEach((element) => {
      element.calcSize(loc, fontSize, ctx);
      // console.log(loc)
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
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.content.forEach((element) => {
      element.draw(ctx);
    });
  }
}

class SuperSub extends ElementProperties {
  superscript: E | null;
  subscript: E | null;
  subscriptXBias: number;
  content: E;
  bias: number;

  constructor(
    content: E,
    superscript: E | null,       // eslint-disable-line no-use-before-define
    subscript: E | null,       // eslint-disable-line no-use-before-define
    id: string = '',
    classes: string | Array<string> = '',
    bias: number = 0,
    subscriptXBias: number = 0,
  ) {
    super(id, classes);
    this.classes.push('supersub');
    this.superscript = superscript;
    this.subscript = subscript;
    this.subscriptXBias = subscriptXBias;
    this.content = content;
    this.bias = bias;
    // console.log(this.subscript.content)
  }

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.location = location.copy();
    const loc = location.copy();
    this.content.calcSize(loc, fontSize, ctx);
    let w = this.content.width;
    let asc = this.content.ascent;
    let des = this.content.descent;

    if (this.superscript !== null) {
      const superLoc = new Point(
        this.location.x + this.content.width + this.bias,
        this.location.y + this.content.ascent - fontSize / 3,
      );
      this.superscript.calcSize(superLoc, fontSize / 2, ctx);
      w = Math.max(
        w,
        superLoc.x - this.location.x + this.superscript.width,
      );
      asc = Math.max(
        asc,
        this.superscript.ascent + superLoc.y - this.location.y,
      );
      des = Math.max(
        des,
        this.location.y - (superLoc.y - this.superscript.descent),
      );
    }

    if (this.subscript !== null) {
      const subLoc = new Point(
        this.location.x + this.content.width - this.subscriptXBias + this.bias,
        this.location.y - this.content.descent,
      );
      this.subscript.calcSize(subLoc, fontSize / 2, ctx);
      w = Math.min(
        w,
        subLoc.x - this.location.x + this.subscript.width,
      );
      asc = Math.max(asc, this.subscript.ascent + subLoc.y - this.location.y);
      des = Math.max(des, this.subscript.descent + (this.location.y - subLoc.y));
    }
    this.width = w;
    this.ascent = asc;
    this.descent = des;
  }

  render(indent: number = 0) {
    const s = ' '.repeat(indent + 2);
    let out = '';
    out += `${s}<div class="super_sub_super superscript element">\n`;
    if (this.superscript !== null) {
      out += this.superscript.render(indent + 4);
    }
    out += `\n${s}</div>\n`;
    out += `${s}<div class="super_sub_sub subscript element">\n`;
    if (this.subscript !== null) {
      out += this.subscript.render(indent + 4);
    }
    out += `\n${s}</div>`;
    return super.render(indent, out);
  }
}

class Subscript extends SuperSub {
  constructor(
    content: E,       // eslint-disable-line no-use-before-define
    subscript: E,
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(content, null, subscript, id, classes);
    const index = this.classes.indexOf('supersub');
    if (index > -1) {
      this.classes.splice(index, 1);
    }
    this.classes.push('subscript');
  }
}

class Superscript extends SuperSub {
  constructor(
    content: E,       // eslint-disable-line no-use-before-define
    superscript: E,
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(content, superscript, null, id, classes);
    const index = this.classes.indexOf('supersub');
    if (index > -1) {
      this.classes.splice(index, 1);
    }
    this.classes.push('superscript');
  }
}

class Fraction extends ElementProperties {
  numerator: E;
  denominator: E;
  vSpaceNum: number;
  vSpaceDenom: number;
  lineWidth: number;
  lineVAboveBaseline: number;
  vinculum: DiagramElementPrimative;
  fontScaleFactor: number;

  constructor(
    numerator: E,     // eslint-disable-line no-use-before-define
    denominator: E,   // eslint-disable-line no-use-before-define
    vinculmOrId: string | DiagramElementPrimative = '',
    classes: string | Array<string> = [],
  ) {
    let id = '';
    if (typeof vinculmOrId === 'string') {
      id = vinculmOrId;
    }
    super(id, classes);
    if (vinculmOrId instanceof DiagramElementPrimative) {
      this.vinculum = vinculmOrId;
    }
    this.classes.push('fraction');
    this.numerator = numerator;
    this.denominator = denominator;

    this.vSpaceNum = 0;
    this.vSpaceDenom = 0;
    this.lineVAboveBaseline = 0;
    this.lineWidth = 0;
    this.fontScaleFactor = 1;
  }
  render(indent: number = 0) {
    const s = ' '.repeat(indent + 2);
    let out = '';
    out += `${s}<div class="numerator">\n`;
    out += this.numerator.render(indent + 4);
    out += `\n${s}</div>\n`;
    out += `${s}<div class="fraction_line"> </div>\n`;
    out += `${s}<div class="denominator">\n`;
    out += this.denominator.render(indent + 4);
    out += `\n${s}</div>`;
    return super.render(indent, out);
  }

  calcSize(location: Point, inFontSize: number, ctx: CanvasRenderingContext2D) {
    const fontSize = inFontSize * this.fontScaleFactor;
    this.vSpaceNum = fontSize * 0.15;
    this.vSpaceDenom = fontSize * 0.1;
    this.lineVAboveBaseline = inFontSize * 0.35;
    this.lineWidth = fontSize * 0.05;

    this.location = location.copy();
    const loc = location.copy();
    this.numerator.calcSize(loc, fontSize, ctx);

    this.denominator.calcSize(loc, fontSize, ctx);
    this.width = Math.max(this.numerator.width, this.denominator.width) + fontSize * 0.5;
    const xNumerator = (this.width - this.numerator.width) / 2;
    const xDenominator = (this.width - this.denominator.width) / 2;
    const yNumerator = this.numerator.descent +
                        this.vSpaceNum + this.lineVAboveBaseline;

    const yDenominator = this.denominator.ascent +
                         this.vSpaceDenom - this.lineVAboveBaseline;

    let yScale = 1;
    if (ctx) {
      yScale = -1;
    }
    this.numerator.calcSize(
      new Point(loc.x + xNumerator, loc.y + yScale * yNumerator),
      fontSize,
      ctx,
    );

    this.denominator.calcSize(
      new Point(loc.x + xDenominator, loc.y - yScale * yDenominator),
      fontSize,
      ctx,
    );

    this.descent = this.vSpaceNum + this.lineWidth / 2 - this.lineVAboveBaseline +
                   this.denominator.ascent + this.denominator.descent;
    this.ascent = this.vSpaceNum + this.lineWidth / 2 + this.lineVAboveBaseline +
                   this.numerator.ascent + this.numerator.descent;
    if (this.vinculum) {
      this.vinculum.transform.updateScale(this.width, this.lineWidth);
      this.vinculum.transform.updateTranslation(
        this.location.x,
        this.location.y + this.lineVAboveBaseline,
      );
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.numerator.draw(ctx);
    this.denominator.draw(ctx);
    ctx.fillStyle = 'red';
    ctx.fillRect(
      this.location.x,
      this.location.y - Math.floor(this.lineWidth / 2) -
        this.lineVAboveBaseline,
      this.width, this.lineWidth,
    );
    // ctx.beginPath();
    // ctx.moveTo(this.location.x, this.location.y + this.lineVAboveBaseline);
    // ctx.lineTo(this.width, this.location.y + this.lineVAboveBaseline);
    // ctx.stroke();
  }
}

class Integral extends ElementProperties {
  limitMin: E | null;
  limitMax: E | null;
  content: E | null;
  integralSymbol: DiagramElementPrimative;

  constructor(
    limitMin: E | null,
    limitMax: E | null,
    content: E | null,
    integralSymbolOrId: string | DiagramElementPrimative = '',
    classes: Array<string> = [],
  ) {
    let id = '';
    if (typeof integralSymbolOrId === 'string') {
      id = integralSymbolOrId;
    }
    super(id, classes);
    if (integralSymbolOrId instanceof DiagramElementPrimative) {
      this.integralSymbol = integralSymbolOrId;
    }
    this.classes.push('integral');
    this.limitMin = limitMin;
    this.limitMax = limitMax;
    this.content = content;
    // console.log(limitMin)
  }

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.location = location.copy();
    const loc = location.copy();
    let contentBounds = { width: 0, height: 0, ascent: 0, descent: 0 };
    let limitMinBounds = { width: 0, height: 0, ascent: 0, descent: 0 };
    let limitMaxBounds = { width: 0, height: 0, ascent: 0, descent: 0 };
    let integralSymbolBounds = { width: 0, height: 0, ascent: 0, descent: 0 };

    if (this.content instanceof E) {
      this.content.calcSize(loc.copy(), fontSize, ctx);
      contentBounds = {
        width: this.content.width,
        height: this.content.ascent + this.content.descent,
        ascent: this.content.ascent,
        descent: this.content.descent,
      };
    }
    if (this.limitMax instanceof E) {
      this.limitMax.calcSize(loc.copy(), fontSize / 2, ctx);
      limitMaxBounds = {
        width: this.limitMax.width,
        height: this.limitMax.ascent + this.limitMax.descent,
        ascent: this.limitMax.ascent,
        descent: this.limitMax.descent,
      };
    }
    if (this.limitMin instanceof E) {
      this.limitMin.calcSize(loc.copy(), fontSize / 2, ctx);
      limitMinBounds = {
        width: this.limitMin.width,
        height: this.limitMin.ascent + this.limitMin.descent,
        ascent: this.limitMin.ascent,
        descent: this.limitMin.descent,
      };
    }

    const integralMinHeight =
      contentBounds.ascent + contentBounds.descent +
      limitMinBounds.height + // limitMinBounds.descent +
      limitMaxBounds.height; // + limitMaxBounds.ascent;
    const integralSymbolLocation = new Point(
      loc.x,
      loc.y - Math.max(
        limitMinBounds.ascent + contentBounds.height / 2,
        fontSize / 3,
      ),
    );
    const numLines = roundNum(integralMinHeight / fontSize, 0);
    if (this.integralSymbol) {
      const height = numLines * fontSize * 1.3;
      this.integralSymbol.transform.updateScale(
        height,
        height,
      );
      this.integralSymbol.transform.updateTranslation(
        integralSymbolLocation.x,
        integralSymbolLocation.y,
      );
    const bounds = this.integralSymbol.vertices.getRelativeGLBoundingRect(this.integralSymbol.transform.matrix());
      integralSymbolBounds = {
        width: bounds.width,
        height: -bounds.bottom + bounds.top,
        ascent: bounds.top,
        descent: -bounds.bottom,
      };
    }

    const minLimitLocation = new Point(
      this.location.x + integralSymbolBounds.width * 0.5,
      integralSymbolLocation.y,
    );

    const maxLimitLocation = new Point(
      this.location.x + integralSymbolBounds.width * 1.2,
      integralSymbolLocation.y + integralSymbolBounds.height - limitMaxBounds.height / 2,
    );

    const contentLocation = new Point(
      Math.max(
        this.location.x + integralSymbolBounds.width * 0.8,
        // maxLimitLocation.x + limitMaxBounds.width,
        // minLimitLocation.x + limitMinBounds.width,
      ),
      this.location.y,
    );

    if (this.content instanceof E) {
      this.content.calcSize(contentLocation, fontSize, ctx);
    }
    if (this.limitMin instanceof E) {
      this.limitMin.calcSize(minLimitLocation, fontSize / 2, ctx);
    }
    if (this.limitMax instanceof E) {
      this.limitMax.calcSize(maxLimitLocation, fontSize / 2, ctx);
    }

    this.width = Math.max(
      integralSymbolBounds.width,
      limitMinBounds.width + minLimitLocation.x - this.location.x,
      limitMaxBounds.width + maxLimitLocation.x - this.location.x,
      contentBounds.width + contentLocation.x - this.location.x,
    );
    this.ascent = Math.max(
      integralSymbolBounds.ascent,
      limitMaxBounds.ascent + maxLimitLocation.y - this.location.y,
      contentBounds.ascent + contentLocation.y - this.location.y,
    );

    this.descent = Math.max(
      integralSymbolBounds.descent,
      limitMinBounds.descent + this.location.y - minLimitLocation.y,
      contentBounds.ascent + this.location.y - contentLocation.y,
    );
  }
}


class Root extends ElementProperties {
  content: E;

  constructor(
    content: E,     // eslint-disable-line no-use-before-define
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.content = content;
  }
  render(indent: number = 0) {
    const s = ' '.repeat(indent + 2);
    let out = '';
    out += `${s}<div class="square_root element">\n`;
    out += `${s}  <div class="equation_element radical element">\n`;
    out += `${s}    &radic;\n`;
    out += `${s}  </div>\n`;
    out += this.content.render(indent + 4);
    out += `\n${s}</div>`;
    return super.render(indent, out);
  }
}

function contentToE(content: string | E): E {
  let c;
  if (typeof content === 'string') {
    c = new E(content);
  } else {
    c = content;
  }
  return c;
}

function supsub(
  superscript: E | string,
  subscript: E | string,
  id: string = '',
  classes: string | Array<string> = [],
) {
  return new SuperSub(
    contentToE(superscript),
    contentToE(subscript),
    id,
    classes,
  );
}
function sub(
  content: E | string,
  id: string = '',
  classes: string | Array<string> = [],
) {
  return new Subscript(contentToE(content), id, classes);
}

function sup(
  content: E | string,
  id: string = '',
  classes: string | Array<string> = [],
) {
  return new Superscript(contentToE(content), id, classes);
}


function e(
  content: string | Array<ElementProperties>,
  id: string = '',
  classes: string | Array<string> = [],
) {
  return new E(content, id, classes);
}

function frac(
  numerator: E | string,     // eslint-disable-line no-use-before-define
  denominator: E | string,   // eslint-disable-line no-use-before-define
  vinculumOrid: string | DiagramElementPrimative = '',
  classes: string | Array<string> = [],
) {
  return new Fraction(contentToE(numerator), contentToE(denominator), vinculumOrid, classes);
}

function sqrt(
  content: E | string,     // eslint-disable-line no-use-before-define
  id: string = '',
  classes: string | Array<string> = [],
) {
  return new Root(contentToE(content), id, classes);
}


// class Line extends Element {
//   content: Array<Element>;

//   constructor(
//     content: Array<Element> = [],
//     id: string = '',
//     classes: string | Array<string> = [],
//   ) {
//     super(id, classes);
//     this.content = content;
//   }

//   render(indent: number = 0) {
//     return super.render(indent, this.content.map(c => c.render(indent + 2)).join('\n'));
//   }

//   text(
//     text: string = '',
//     id: string = '',
//     classes: string | Array<string> = [],
//   ) {
//     // eslint-disable-next-line no-use-before-define
//     const t = new Text(text, id, classes);
//     this.content.push(t);
//     return this;
//   }

//   frac(
//     numerator: Line,
//     denominator: Line,
//     id: string = '',
//     classes: string = '',
//   ) {
//     // eslint-disable-next-line no-use-before-define
//     const f = new Fraction(numerator, denominator, id, classes);
//     this.content.push(f);
//     return this;
//   }

//   sup(
//     content: string | Array<Element> = [],
//     id: string = '',
//     classes: string | Array<string> = [],
//   ) {
//     let c;
//     if (typeof content === 'string') {
//       // eslint-disable-next-line no-use-before-define
//       c = [new Text(content, '', ['superscript_text'])];
//     } else {
//       c = content;
//     }
//     // eslint-disable-next-line no-use-before-define
//     const line = new Superscript(c, id, classes);
//     this.content.push(line);
//     return this;
//   }

//   inc(content: Element | Array<Element>) {
//     if (Array.isArray(content)) {
//       this.content = this.content.concat(content);
//     } else {
//       this.content.push(content);
//     }
//     return this;
//   }
// }

// class Superscript extends Line {
//   constructor(
//     content: Array<Element> = [],
//     id: string = '',
//     classes: string | Array<string> = '',
//   ) {
//     super(content, id, classes);
//     this.classes.push('superscript');
//   }
// }


// class SuperAndSubscript extends Element {
//   sup: Superscript | Line;
//   sub: Subscript | Line;

//   constructor(
//     sup: Superscript | Line,
//     sub: Subscript | Line,
//     id: string = '',
//     classes: string | Array<string> = '',
//   ) {
//     super(id, classes);
//     this.classes.push('super_sub');
//     this.sup = sup;
//     this.sub = sub;
//   }

//   render(indent: number = 0) {
//     const s = ' '.repeat(indent + 2);
//     let out = '';
//     out += `${s}<div class="super_sub_super element">\n`;
//     out += this.sup.render(indent + 4);
//     out += `\n${s}</div>\n`;
//     out += `${s}<div class="super_sub_sub element">\n`;
//     out += this.sup.render(indent + 4);
//     out += `\n${s}</div>`;
//     return super.render(indent, out);
//   }
// }

class DiagramEquation extends E {
  // content: Array<Element>;
  // location: Point;
  collection: DiagramElementCollection;

  constructor(collection: DiagramElementCollection) {
    super([], '', '');
    this.collection = collection;
  }

  animateTo(
    location: Point,
    fontSize: number,
    ctx: CanvasRenderingContext2D,
    time: number = 1,
  ) {
    const currentTransforms = this.collection.getElementTransforms();
    this.calcSize(location, fontSize, ctx);
    const animateToTransforms = this.collection.getElementTransforms();
    this.collection.setElementTransforms(currentTransforms);
    this.collection.animateToTransforms(animateToTransforms, time);
  }

  getDiagramElement(name: string | DiagramElementPrimative) {
    if (name instanceof DiagramElementPrimative) {
      return name;
    }
    if (this.collection && `_${name}` in this.collection) {
      return this.collection[`_${name}`];
    }
    return name;
  }

  createEq(content: Array<E | string>) {
    const elements = [];
    content.forEach((c) => {
      if (typeof c === 'string') {
        elements.push(new Text(this.getDiagramElement(c)));
      } else {
        elements.push(c);
      }
      this.content = elements;
    });
  }

  contentToElement(content: Array<E | string> | E | string) {
    if (content instanceof E) {
      return content;
    }

    const elementArray: Array<E> = [];
    if (typeof content === 'string') {
      elementArray.push(new Text(this.getDiagramElement(content)));
    } else if (Array.isArray(content)) {
      content.forEach((c) => {
        if (typeof c === 'string') {
          elementArray.push(new Text(this.getDiagramElement(c)));
        } else {
          elementArray.push(c);
        }
      });
    } else {
      elementArray.push(content);
    }
    return new E(elementArray);
  }

  sFrac(
    numerator: Array<E | string> | E | string,
    denominator: Array<E | string> | E | string,
    vinculumOrid: string | DiagramElementPrimative = '',
    classes: string | Array<string> = [],
  ) {
    const f = this.frac(numerator, denominator, vinculumOrid, classes);
    f.fontScaleFactor = 0.4;
    return f;
  }
  frac(
    numerator: Array<E | string> | E | string,
    denominator: Array<E | string> | E | string,
    vinculumOrid: string | DiagramElementPrimative = '',
    classes: string | Array<string> = [],
  ) {
    return new Fraction(
      this.contentToElement(numerator),
      this.contentToElement(denominator),
      this.getDiagramElement(vinculumOrid),
      classes,
    );
  }

  sub(
    content: Array<E | string> | E | string,
    subscript: Array<E | string> | E | string,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    return new Subscript(
      this.contentToElement(content),
      this.contentToElement(subscript),
      id,
      classes,
    );
  }

  supSub(
    content: Array<E | string> | E | string,
    superscript: Array<E | string> | E | string,
    subscript: Array<E | string> | E | string,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    return new SuperSub(
      this.contentToElement(content),
      this.contentToElement(superscript),
      this.contentToElement(subscript),
      id,
      classes,
    );
  }

  sup(
    content: Array<E | string> | E | string,
    superscript: Array<E | string> | E | string,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    return new Superscript(
      this.contentToElement(content),
      this.contentToElement(superscript),
      id,
      classes,
    );
  }

  int(
    limitMin: Array<E | string> | E | string,
    limitMax: Array<E | string> | E | string,
    content: Array<E | string> | E | string,
    integralSymbolOrid: string | DiagramElementPrimative = '',
    classes: string | Array<string> = [],
  ) {
    // console.log(this.contentToElement(limitMin))
    return new Integral(
      this.contentToElement(limitMin),
      this.contentToElement(limitMax),
      this.contentToElement(content),
      this.getDiagramElement(integralSymbolOrid),
      classes,
    );
  }
}

class Equation extends ElementProperties {
  content: E;

  constructor(
    content: E | Array<ElementProperties>,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    if (Array.isArray(content)) {
      this.content = new E(content);
    } else {
      this.content = content;
    }
    this.classes.push('equation');
  }

  render(indent: number = 0) {
    return super.render(indent, this.content.render(indent + 2));
  }

  htmlElement() {
    const element = document.createElement('div');
    element.setAttribute('id', this.id);
    element.innerHTML = this.content.render();
    this.classes.forEach((c) => {
      if (c) {
        element.classList.add(c);
      }
    });
    return element;
  }

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.location = location.copy();
    this.content.calcSize(location.copy(), fontSize, ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = '20px';
    ctx.fillStyle = 'rgba(255,0,0,255)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    this.content.draw(ctx);
    ctx.restore();
  }
}

export { Text, Fraction, Equation, e, frac, sqrt, sub, sup, supsub, DiagramEquation, DiagramEquationNew };


// class Equation {
//   tree: Object;
//   constructor(){
//     self.tree = {}
//   }

//   function sqrt(text, id='', classes = '') {
//     let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">';
//     out_str +=      '<div class="square_root element">';
//     out_str +=        '<div class="equation_element radical element">';
//     out_str +=          '&radic;';
//     out_str +=        '</div>';
//     out_str +=        text;
//     out_str +=      '</div>';
//     out_str +=    '</div>';
//     return out_str;
//   }

//   return {
//     make: make,
//     elem: elem,
//     text: text,
//     frac: frac,
//     sup: sup,
//     sub: sub,
//     sqrt: sqrt,
//   };
// }

