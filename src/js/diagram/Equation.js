// @flow

// function makeIdText(id) {
//   return id ? `id="${id}"` : '';
// }

function makeDiv(
  id: string,
  classes: string,
  specialClass: string,
  text: string,
  indent: number = 0,
) {
  const indentStr = ' '.repeat(indent);
  const idStr = id ? `id="${id}"` : '';
  let out = `${indentStr}<div ${idStr} class="${specialClass} ${classes}">\n`;
  out += `${text}\n`;
  out += `${indentStr}</div>`;
  return out;
}


class EquationElement {
  content: Array<EquationElement>;
  id: string;
  classes: string;

  constructor(
    content: Array<EquationElement>,
    id: string = '',
    classes: string = '',
  ) {
    this.content = content;
    this.id = id;
    this.classes = classes;
  }

  // eslint-disable-next-line class-methods-use-this
  render(indent: number = 0) {
    return makeDiv(
      this.id,
      this.classes,
      'equation_element',
      this.content.map(c => c.render(indent + 2)).join('\n'),
      indent,
    );
  }
}

class EquationText {
  text: string;
  id: string;
  classes: string;

  constructor(text: string = '', id: string = '', classes: string = '') {
    this.text = text;
    this.id = id;
    this.classes = classes;
  }

  render(indent: number = 0) {
    return makeDiv(
      this.id,
      this.classes,
      'equation_text equation_element',
      `${' '.repeat(indent + 2)}${this.text}`,
      indent,
    );
  }
}

class EquationFraction {
  numerator: EquationElement;
  denominator: EquationElement;
  id: string;
  classes: string;

  constructor(
    numerator: EquationElement,
    denominator: EquationElement,
    id: string = '',
    classes: string = '',
  ) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.id = id;
    this.classes = classes;
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

    return makeDiv(
      this.id,
      this.classes,
      'fraction equation_element',
      out,
      indent,
    );
  }
}

class Equation {
  elements: Array<Object>;
  id: string;
  classes: string;

  constructor(
    id: string = '',
    elements: Array<Object> = [],
    classes: string = '',
  ) {
    this.elements = elements;
    this.id = id;
    this.classes = classes;
  }

  // eslint-disable-next-line class-methods-use-this
  render(indent: number = 0) {
    return makeDiv(
      this.id,
      this.classes,
      'equation',
      this.elements.map(c => c.render(indent + 2)).join('\n'),
      indent,
    );
  }

  htmlElement() {
    const element = document.createElement('div');
    element.setAttribute('id', this.id);
    element.innerHTML = this.elements.map(c => c.render()).join('\n');
    // const inside = document.createTextNode("Asdf");
    // element.appendChild(inside);
    element.classList.add('equation');
    const classes = this.classes.split(' ');
    classes.forEach((c) => {
      // console.log(c)
      if (c) {
        element.classList.add(c);
      }
    });
    // element.classList.add(this.classes);
    return element;
  }

  text(text: string = '', id: string = '', classes: string = '') {
    const t = new EquationText(text, id, classes);
    this.elements.push(t);
    return this;
  }

  frac(
    numerator: EquationElement,
    denominator: EquationElement,
    id: string = '',
    classes: string = '',
  ) {
    const f = new EquationFraction(numerator, denominator, id, classes);
    this.elements.push(f);
    return this;
  }

  elem(
    content: Array<EquationElement>,
    id: string,
    classes: string = '',
  ) {
    const e = new EquationElement(content, id, classes);
    this.elements.push(e);
    return this;
  }
}

export { EquationText, EquationElement, EquationFraction, Equation };


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

