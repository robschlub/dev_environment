// @flow

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
  let out = `${indentStr}<div${idStr} class="equation_element element${classString}">\n`;
  out += `${text}\n`;
  out += `${indentStr}</div>`;
  return out;
}

class Element {
  id: string;
  classes: Array<string>;

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
}

class Line extends Element {
  content: Array<Element>;

  constructor(
    content: Array<Element> = [],
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.content = content;
  }

  render(indent: number = 0) {
    return super.render(indent, this.content.map(c => c.render(indent + 2)).join('\n'));
  }

  text(
    text: string = '',
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    const t = new Text(text, id, classes);
    this.content.push(t);
    return this;
  }

  frac(
    numerator: Line,
    denominator: Line,
    id: string = '',
    classes: string = '',
  ) {
    const f = new Fraction(numerator, denominator, id, classes);
    this.content.push(f);
    return this;
  }

  sup(
    content: string | Array<Element> = [],
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    let c = content;
    if (typeof content === 'string') {
      c = [new Text(content, '', ['superscript_text'])];
    }
    const line = new Superscript(c, id, classes);
    this.content.push(line);
    return this;
  }

  inc(content: Element | Array<Element>) {
    if (Array.isArray(content)) {
      this.content = this.content.concat(content);
    } else {
      this.content.push(content);
    }
    return this;
  }
}

class Text extends Element {
  text: string;

  constructor(
    text: string = '',
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.classes.push('equation_text');
    this.text = text;
  }

  render(indent: number = 0) {
    return super.render(indent, `${' '.repeat(indent + 2)}${this.text}`);
  }
}

class Superscript extends Line {
  constructor(
    content: Array<Element> = [],
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(content, id, classes);
    this.classes.push('superscript');
  }
}

class Subscript extends Line {
  constructor(
    content: Array<Element> = [],
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(content, id, classes);
    this.classes.push('subscript');
  }
}

class SuperAndSubscript extends Element {
  sup: Superscript;
  sub: Subscript;

  constructor(
    sup: Superscript,
    sub: Subscript,
    id: string = '',
    classes: string | Array<string> = '',
  ) {
    super(id, classes);
    this.classes.push('super_sub');
    this.sup = sup;
    this.sub = sub;
  }

  render(indent: number = 0) {
    const s = ' '.repeat(indent + 2);
    let out = '';
    out += `${s}<div class="super_sub_super element">\n`;
    out += this.sup.render(indent + 4);
    out += `\n${s}</div>\n`;
    out += `${s}<div class="super_sub_sub element">\n`;
    out += this.sup.render(indent + 4);
    out += `\n${s}</div>`;
    return super.render(indent, out);
  }
}

class Fraction extends Element {
  numerator: Line;
  denominator: Line;

  constructor(
    numerator: Line,
    denominator: Line,
    id: string = '',
    classes: string | Array<string> = [],
  ) {
    super(id, classes);
    this.classes.push('fraction');
    this.numerator = numerator;
    this.denominator = denominator;
  }
  render(indent: number = 0) {
    const s = ' '.repeat(indent + 2);
    let out = '';
    out += `${s}<div class="numerator element">\n`;
    out += this.numerator.render(indent + 4);
    out += `\n${s}</div>\n`;
    out += `${s}<div class="fraction_line"> </div>\n`;
    out += `${s}<div class="denominator element">\n`;
    out += this.denominator.render(indent + 4);
    out += `\n${s}</div>`;
    return super.render(indent, out);
  }
}

class Equation extends Line {
  // line: Line;

  constructor(
    id: string = '',
    content: Array<Element> = [],
    classes: string | Array<string> = '',
  ) {
    super(content, id, classes);
    this.classes.push('equation');
  }

  // eslint-disable-next-line class-methods-use-this
  render(indent: number = 0) {
    return super.render(indent);
    // return super.render(indent, this.line.render(indent + 2));
  }

  htmlElement() {
    const element = document.createElement('div');
    element.setAttribute('id', this.id);
    element.innerHTML = this.content.map(c => c.render()).join('');
    this.classes.forEach((c) => {
      if (c) {
        element.classList.add(c);
      }
    });
    return element;
  }

  // text(text: string = '', id: string = '', classes: string = '') {
  //   const t = new Text(text, id, classes);
  //   this.content.push(t);
  //   return this;
  // }

  // frac(
  //   numerator: Line,
  //   denominator: Line,
  //   id: string = '',
  //   classes: string = '',
  // ) {
  //   const f = new Fraction(numerator, denominator, id, classes);
  //   this.content.push(f);
  //   return this;
  // }

  // line(
  //   content: Array<Element>,
  //   id: string,
  //   classes: string = '',
  // ) {
  //   const e = new line(content, id, classes);
  //   this.content.push(e);
  //   return this;
  // }
}

export { Text, Line, Fraction, Equation, Superscript, Subscript, SuperAndSubscript };


// class Equation {
//   tree: Object;
//   constructor(){
//     self.tree = {}
//   }


// let equ = (function() {

//   function make(equation, id='', classes = ''){
//     let out_str = '<div '+ makeIdText(id) + ' class="equation ' + classes + ' element">';
//     out_str += equation;
//     out_str += '</div>';
//     return out_str;
//   }

//   function text(inputText, id='', classes = '') {
//     let out_str = '<div '+makeIdText(id)+' class="equation_text ' + classes + ' element">';
//     out_str += inputText;
//     out_str += '</div>';
//     return out_str;
//   }

//   function elem(inputText, id='', classes = '') {
//     let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">\n'
//     out_str += text(inputText);
//     out_str += '</div>\n'
//     return out_str;
//   }

//   function frac(numerator, denominator, id='', classes = '') {
//     let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">\n';
//     out_str += '<div class="fraction element">\n'
//     out_str += '<div class="numerator element">\n';
//     out_str += numerator;
//     out_str += '</div>\n';
//     out_str += '<div class="fraction_line"> </div>';
//     out_str += '<div class="denominator element">\n';
//     out_str += denominator;
//     out_str += '</div>\n';
//     out_str += '</div>\n';
//     out_str += '</div>\n';
//     return out_str;
//   }

//   function makeIdText(id) {
//     return id ? 'id="'+id+'"' : '';
//   }

//   function sup(superText, id='', classes = '') {
//     let out_str = '<div '+makeIdText(id)+' class="superscript ' + classes + ' element">';
//     out_str += superText;
//     out_str += '</div>';
//     return out_str;
//   }

//   function sub(subText, id='', classes = '') {
//     let out_str = '<div '+ makeIdText(id) + ' class="subscript ' + classes + ' element">';
//     out_str += subText;
//     out_str += '</div>';
//     return out_str;
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

