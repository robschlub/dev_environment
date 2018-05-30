// @flow
import { Point } from './tools/g2';
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
    console.log(this.content)
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

  constructor(
    superscript: E | null,       // eslint-disable-line no-use-before-define
    subscript: E | null,       // eslint-disable-line no-use-before-define
    id: string = '',
    classes: string | Array<string> = '',
    subscriptXBias: number = 0.02,
  ) {
    super(id, classes);
    this.classes.push('supersub');
    this.superscript = superscript;
    this.subscript = subscript;
    this.subscriptXBias = subscriptXBias;
    // console.log(this.subscript.content)
  }

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.location = location.copy();
    let w = 0;
    let asc = 0;
    let des = 0;
    if (this.superscript !== null) {
      const superLoc = new Point(
        this.location.x,
        this.location.y + fontSize / 2,
      );
      this.superscript.calcSize(superLoc, fontSize / 2, ctx);
      w = Math.max(
        w,
        this.superscript.width,
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
        this.location.x - this.subscriptXBias,
        this.location.y - fontSize / 4,
      );
      this.subscript.calcSize(subLoc, fontSize / 2, ctx);
      w = Math.min(w, this.subscript.width);
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
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(null, content, id, classes);
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
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(content, null, id, classes);
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

  calcSize(location: Point, fontSize: number, ctx: CanvasRenderingContext2D) {
    this.vSpaceNum = fontSize * 0.2;
    this.vSpaceDenom = fontSize * 0;
    this.lineVAboveBaseline = fontSize * 0.35;
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

  getDiagramElement(name: string) {
    return this.collection[`_${name}`];
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
    }
    if (Array.isArray(content)) {
      content.forEach((c) => {
        if (typeof c === 'string') {
          elementArray.push(new Text(this.getDiagramElement(c)));
        }
        if (c instanceof E) {
          elementArray.push(c);
        }
      });
    }
    return new E(elementArray);
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

