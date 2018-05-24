import {
  EquationText, EquationElement, EquationFraction,
  Equation,
} from './Equation';

describe('HTML Equation', () => {
  test('EquationText', () => {
    const t = new EquationText('test', 'id1', 'c1');
    const rendered = t.render();
    const expected = '<div id="id1" class="equation_text equation_element c1">\n  test\n</div>';
    expect(rendered).toBe(expected);
  });
  test('EquationElement', () => {
    const t1 = new EquationText('a+b', 'id1', 'c1');
    const t2 = new EquationText('=', 'id2', 'c2');
    const t3 = new EquationText('c', 'id3', 'c3');

    const expected =
`<div id="id_e1" class="equation_element class_e1">
  <div id="id1" class="equation_text equation_element c1">
    a+b
  </div>
  <div id="id2" class="equation_text equation_element c2">
    =
  </div>
  <div id="id3" class="equation_text equation_element c3">
    c
  </div>
</div>`;
    const equation = new EquationElement(
      [t1, t2, t3],
      'id_e1',
      'class_e1',
    );
    expect(equation.render()).toBe(expected);
  });

  test('Fraction', () => {
    const n = new EquationElement(
      [new EquationText('a + b')],
      'id_n1',
      'class_n1',
    );
    const d = new EquationElement(
      [new EquationText('c')],
      'id_d1',
      'class_d1',
    );
    const f = new EquationFraction(
      n,
      d,
      'id_f1',
      'class_f1',
    );
    const expected =
`<div id="id_f1" class="fraction equation_element class_f1">
  <div class="numerator element">
    <div id="id_n1" class="equation_element class_n1">
      <div  class="equation_text equation_element ">
        a + b
      </div>
    </div>
  </div>
  <div class="fraction_line"> </div>
  <div class="denominator element">
    <div id="id_d1" class="equation_element class_d1">
      <div  class="equation_text equation_element ">
        c
      </div>
    </div>
  </div>
</div>`;
    expect(f.render()).toBe(expected);
  });
  describe('Equation', () => {
    test('a + b = c', () => {
      const e = new Equation('e1').text('a + b = c');
      const expected =
`<div id="e1" class="equation ">
  <div  class="equation_text equation_element ">
    a + b = c
  </div>
</div>`;
      expect(e.render()).toBe(expected);
    });
  });
});
