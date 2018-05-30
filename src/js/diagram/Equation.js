// @flow
import { Point, Rect } from './tools/g2';
import { roundNum } from './tools/mathtools';
import { DiagramElementPrimative, DiagramElementCollection } from './Element';
// function makeIdText(id) {
//   return id ? `id="${id}"` : '';
// }

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

class Element {
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


class Text extends Element {
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
      // console.log(this.textElement.name, this.textElement.transform.t())
      // console.log(this.textElement.name, this.textElement.getRelativeGLBoundingRect());
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.text, this.location.x, this.location.y);
  }
}

class E extends Element {
  content: Array<Element>;

  constructor(
    content: string | Array<Element> | DiagramElementCollection | DiagramElementPrimative,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.applyContent(content);
  }

  applyContent(content: string | Array<Element> |
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

class SuperSub extends Element {
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

class Fraction extends Element {
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

class Integral extends Element {
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
    console.log(limitMin)
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


class Root extends Element {
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
  content: string | Array<Element>,
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
    console.log(this.contentToElement(limitMin))
    return new Integral(
      this.contentToElement(limitMin),
      this.contentToElement(limitMax),
      this.contentToElement(content),
      this.getDiagramElement(integralSymbolOrid),
      classes,
    );
  }
}

class Equation extends Element {
  content: E;

  constructor(
    content: E | Array<Element>,
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

export { Text, Fraction, Equation, e, frac, sqrt, sub, sup, supsub, DiagramEquation };


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

