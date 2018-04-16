let equ = (function() {

  function make(equation, id='', classes = ''){
    let out_str = '<div '+ makeIdText(id) + ' class="equation ' + classes + ' element">';
    out_str += equation;
    out_str += '</div>';
    return out_str;
  }

  function text(inputText, id='', classes = '') {
    let out_str = '<div '+makeIdText(id)+' class="equation_text ' + classes + ' element">';
    out_str += inputText;
    out_str += '</div>';
    return out_str;
  }

  function elem(inputText, id='', classes = '') {
    let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">\n'
    out_str += text(inputText);
    out_str += '</div>\n'
    return out_str;
  }

  function frac(numerator, denominator, id='', classes = '') {
    let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">\n';
    out_str += '<div class="fraction element">\n'
    out_str += '<div class="numerator element">\n';
    out_str += numerator;
    out_str += '</div>\n';
    out_str += '<div class="fraction_line"> </div>';
    out_str += '<div class="denominator element">\n';
    out_str += denominator;
    out_str += '</div>\n';
    out_str += '</div>\n';
    out_str += '</div>\n';
    return out_str;
  }

  function makeIdText(id) {
    return id ? 'id="'+id+'"' : '';
  }

  function sup(superText, id='', classes = '') {
    let out_str = '<div '+makeIdText(id)+' class="superscript ' + classes + ' element">';
    out_str += superText;
    out_str += '</div>';
    return out_str;
  }

  function sub(subText, id='', classes = '') {
    let out_str = '<div '+ makeIdText(id) + ' class="subscript ' + classes + ' element">';
    out_str += subText;
    out_str += '</div>';
    return out_str;
  }

  function sqrt(text, id='', classes = '') {
    let out_str = '<div '+ makeIdText(id) + ' class="equation_element ' + classes + ' element">';
    out_str +=      '<div class="square_root element">';
    out_str +=        '<div class="equation_element radical element">';
    out_str +=          '&radic;';
    out_str +=        '</div>';
    out_str +=        text;
    out_str +=      '</div>';
    out_str +=    '</div>';
    return out_str;
  }

  return {
    make: make,
    elem: elem,
    text: text,
    frac: frac,
    sup: sup,
    sub: sub,
    sqrt: sqrt,
  };
}
)();