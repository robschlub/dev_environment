// @flow

import {
  LessonContent, clickWord, onClickId, centerV,
  click, highlightWord } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import HTMLEquation from '../../../js/diagram/DiagramElements/Equation/HTMLEquation';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

const unit = (deg: string, rad: string, angleType: string, num: number = 1) => `<span id="id_${angleType}_deg${num}" class="highlight_word">${deg}&deg;</span><span id="id_${angleType}_rad${num}" class="highlight_word">${rad} radians</span>
  `;

// const fraction = (id: string, numerator: string, denominator: string) => {
//   const eqn = new HTMLEquation(`${id}`);
//   eqn.createEq([eqn.frac(numerator, denominator)]);
//   return eqn.render();
// };

// const _piOn2 = '<sup>&pi;</sup>&frasl;<sub>2</sub>';
// const _piOn2 = '<sup>1</sup>&frasl;<sub>2</sub>';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Sine';
    this.iconLink = '/Lessons/Math/Sine';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;
    const diag = this.diagram.elements;

    // diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
    // this.addSection({
    //   title: 'Introduction',
    //   setContent: centerV(`
    //     <p class="lesson__diagram_text_p_width_45">
    //       |Rotating| a |line| around a fixed point creates an |arc|, whose length depends on the |angle| of rotation.
    //     </p>
    //     <p class="lesson__diagram_text_p_width_45">
    //       The arc forms a |circle| with complete rotation.
    //     </p>
    //   `),
    //   modifiers: {
    //     Rotating: click(diag.pushRadius, [diag], colors.radius),
    //     line: click(diag.pulseRadius, [diag], colors.radius),
    //     arc: click(diag.pulseArc, [diag], colors.arc),
    //     angle: click(diag.pulseAngle, [diag], colors.angleText),
    //     circle: click(diag.rotateTo, [diag, Math.PI * 1.999, 2, 2], colors.circle),
    //   },
    //   setEnterState: () => {
    //     diag._angleText.setText('Angle');
    //     diag._angleText._text.vertices.element.classList.remove('lesson__math_stye');
    //     diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
    //     diag.resetCircle('right', 0.001);
    //     diag.showRadians();
    //     diag.toggleUnits('rad');
    //   },
    //   showOnly: [
    //     circle,
    //     circle._radius,
    //     circle._arc,
    //     diag._unitsSelector,
    //   ],
    //   show: [
    //     diag._angleText,
    //     circle._axes,
    //     circle._angle,
    //   ],
    //   transitionFromAny: (done) => {
    //     diag.transitionCircle(done, 'right', null, 5);
    //   },
    //   setSteadyState: () => {
    //     diag._angleText.showAll();
    //     onClickId('id_angle_text', diag.pulseAngle, [diag]);
    //   },
    // });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45 lesson__font_0p9">
          As a |line_rotates|, its |vertical| height and |horizontal| length  change.
        </p>
      `),
      modifiers: {
        line_rotates: click(diag.pushRadius, [diag], colors.radius),
        vertical: click(diag.pulseSineLine, [diag], colors.sine),
        horizontal: click(diag.pulseCosineLine, [diag], colors.cosine),
      },
      setEnterState: () => {
        // diag._angleText.setText('Angle');
        // diag._angleText._text.vertices.element.classList.remove('lesson__math_stye');
        // diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        // diag._angleText.setFirstTransform();
        circle._sineLine.setText('vertical');
        circle._cosineLine.setText('horizontal');
        circle._cosineLine.textXLimit = 0;
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textYMultiplier = 0.5;
        circle._sineLine.textOffset = 0.2;
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        circle._axes,
        circle._cosineLine,
        circle._sineLine,
      ],
      setSteadyState: () => {
        // circle._axes.showAll();
        diag.resetCircle('right', Math.PI / 6);
        // onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45 lesson__font_0p9">
          The verical height is called the |sine|.
        </p>
        <p class="lesson__diagram_text_p_width_45 lesson__font_0p9">
          The horizontal length is called the |cosine|.
        </p>
      `),
      modifiers: {
        sine: click(diag.pulseSineLine, [diag], colors.sine),
        cosine: click(diag.pulseCosineLine, [diag], colors.cosine),
      },
      setEnterState: () => {
        // diag._angleText.setText('Angle');
        // diag._angleText._text.vertices.element.classList.remove('lesson__math_stye');
        // diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        // diag._angleText.setFirstTransform();
        circle._sineLine.setText('sine');
        circle._cosineLine.setText('cosine');
        circle._cosineLine.textXLimit = 0;
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textYMultiplier = 0.5;
        circle._sineLine.textOffset = 0.13;
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        circle._axes,
        circle._cosineLine,
        circle._sineLine,
      ],
      setSteadyState: () => {
        // circle._axes.showAll();
        // onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45 lesson__font_0p9"
           style="margin-top: 5%">
          The |sine| and |cosine| change with rotation angle.
        </p>
        <p class="lesson__diagram_text_p_width_40 lesson__font_0p9"
           style="margin-top: 5%">
          Therefore, when we refer to the |angle| as |theta|, then we usually use the names |sine_theta| and |cosine_theta|.
        </p>
        <p class="lesson__diagram_text_p_width_45 lesson__font_0p9"
           style="margin-top: 5%">
          Often this is shortened to |sin_theta| and |cos_theta| where the brackets can be removed if the expression is clear.
        </p>
      `),
      modifiers: {
        sine: click(diag.pulseSineLine, [diag], colors.sine),
        cosine: click(diag.pulseCosineLine, [diag], colors.cosine),
        theta: highlightWord('θ', 'diagram__equation_text diagram__theta'),
        sine_theta: clickWord('sine(θ)', 'id_sine_theta', diag.pulseSineLine, [diag], 'diagram__sine_text'),
        cosine_theta: clickWord('cosine(θ)', 'id_cosine_theta', diag.pulseCosineLine, [diag], 'diagram__cosine_text'),
        sin_theta: clickWord('sin θ', 'id_sine_theta2', diag.pulseSineLine, [diag], 'diagram__sine_text'),
        cos_theta: clickWord('cos θ', 'id_cosine_theta2', diag.pulseCosineLine, [diag], 'diagram__cosine_text'),
        angle: click(diag.pulseMainAngle, [diag], colors.angleText),
      },
      setEnterState: () => {
        circle._sineLine.setText('sin θ');
        circle._cosineLine.setText('cos θ');
        circle._cosineLine.textXLimit = 0;
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textYMultiplier = 0.5;
        circle._sineLine.textOffset = 0.16;
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        circle._axes,
        circle._cosineLine,
        circle._sineLine,
        circle._mainAngle,
      ],
      setSteadyState: () => {
        diag.updateRotation();
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40 lesson__font_0p9">
          The name |sine| originally comes from |Sanskrit| where it was called |ardha|, meaning “half |bow| string”.
        </p>
        
      `),
      modifiers: {
        Sanskrit: highlightWord('Sanskrit', 'lesson__sanskrit'),
        ardha: highlightWord('ardha-jyās', 'lesson__sanskrit'),
        jya: highlightWord('jyā', 'lesson__sanskrit'),
        sine: click(diag.pulseSineLine, [diag], colors.sine),
        cosine: click(diag.pulseCosineLine, [diag], colors.cosine),
        bow: click(diag.showBow, [diag], colors.bowString),
      },
      setEnterState: () => {
        circle._sineLine.setText('sine');
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textYMultiplier = 0.5;
        circle._sineLine.textOffset = 0.13;
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        circle._axes,
        circle._sineLine,
      ],
      transitionFromAny: (done) => {
        diag.showBow(done);
      },
      setSteadyState: () => {
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__font_0p9">
          Over time |ardha| simply became |jya|.
        </p>
        <p class="lesson__font_0p9" style="margin-top: 5%">
          This was then translated to Arabic |jiba| and then Latin.
        </p>
        <p class="lesson__font_0p9" style="margin-top: 5%">
          However, when it was translated to Latin, it was likely confused with the Arabic word |jaib|, which means “bundle, bosom, fold in a garment”.
        </p>
        <p class="lesson__font_0p9" style="margin-top: 5%">
          The Latin word for "fold in a garment" and "bosom" is |sinus|, which is where our name |sine| derives.
        </p>
      `),
      modifiers: {
        ardha: highlightWord('ardha-jyās', 'lesson__sanskrit'),
        jya: highlightWord('jyā', 'lesson__sanskrit'),
        jiba: highlightWord('jiba', 'lesson__arabic'),
        jaib: highlightWord('jaib', 'lesson__arabic'),
        sinus: highlightWord('sinus', 'lesson__latin'),
      },
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__font_0p9">
          So, if we were naming |sine| today, we might call it something more obvious, like |vertical component| or |half bow string|.
        </p>
        <p class="lesson__font_0p9">
          However, as its name comes from millenia past, it is no longer intuitive, and we just have to remember it.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__font_0p9">
          The name |cosine| comes from the phrase |complimentary sine|, which means |sine of the complimentary angle|.
        </p>
        <p class="lesson__font_0p9">
          In other words, the horiztonal component, has the same length as the vertical component of the complementary angle.
        </p>
      `),
    });
    this.addSection({
      title: 'cosine',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40 lesson__font_0p9">
          The name |sine| originally comes from |Sanskrit| where it was called |ardha|, meaning “half |bow| string”.
        </p>
      `),
      modifiers: {
        Sanskrit: highlightWord('Sanskrit', 'lesson__sanskrit'),
        ardha: highlightWord('ardha-jyās', 'lesson__sanskrit'),
        jya: highlightWord('jyā', 'lesson__sanskrit'),
        sine: click(diag.pulseSineLine, [diag], colors.sine),
        cosine: click(diag.pulseCosineLine, [diag], colors.cosine),
        bow: click(diag.showBow, [diag], colors.bowString),
      },
      setEnterState: () => {
        circle._sineLine.setText('sin θ');
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textYMultiplier = 0.5;
        circle._sineLine.textOffset = 0.13;
        circle._cosineLine.setText('cos θ');
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        circle._axes,
        circle._sineLine,
        circle._cosineLine,
        circle._complimentarySineCollection,
      ],
      // transitionFromAny: (done) => {
      //   diag.showBow(done);
      // },
      setSteadyState: () => {
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40 lesson__font_0p8">
          The change is dependent on angle of rotation.
        </p>
      `),
      modifiers: {
        vertical: click(diag.pulseSineLine, [diag], colors.sine),
        horizontal: click(diag.pulseCosineLine, [diag], colors.cosine),
      },
      setEnterState: () => {
        diag._angleText.setText('Angle');
        diag._angleText._text.vertices.element.classList.remove('lesson__math_stye');
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        circle._sineLine.setText('vertical');
        circle._cosineLine.setText('horizontal');
        circle._cosineLine.textXLimit = 0;
        circle._sineLine.textYLimit = 0;
        circle._sineLine.textOffset = 0.2;
        diag.showRadians();
        diag.toggleUnits('rad');
      },
      showOnly: [
        circle,
        circle._radius,
        circle._circumference,
        diag._unitsSelector,
      ],
      show: [
        diag._angleText,
        circle._axes,
        circle._angle,
        circle._cosineLine,
        circle._sineLine,
      ],
      // transitionFromAny: (done) => {
      //   // diag.transitionCircle(done, 'right', Math.PI / 4, 5);
      //   diag.showBow(done);
      // },
      setSteadyState: () => {
        circle._axes.showAll();
        // diag.resetCircle('right');
        diag.showRadians();
        diag.toggleUnits('rad');
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
      // setLeaveState: () => {
      //   circle._angle.setColor(colors.angle);
      // },
    });
    this.addSection({
      setContent: centerV(`
        <p>
          Understanding the |relationship| between a line's |angle of rotation|, and its |vertical| and |horizontal| components is key to understanding more about circles and triangles.
        </p>
        <p>
          |This lesson| will examine the relationship between the |angle| and |vertical| component.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45">
          To make it easier to examine:
        </p>
        <ul class="lesson__sine_simplify_bullets">
          <li>Overlay on a grid</li>
          <li>Place circle center at origin</li>
          <li>Use a radius of 1</li>
          <li>Label the angle as 𝜽</li>
        </ul>
      `),
      setEnterState: () => {
        circle._sineLine.setText('');
        diag._sineText.setText('Vertical');
        diag._angleText.setText('θ');
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._sineText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText._text.vertices.element.classList.add('lesson__math_stye');
      },
      showOnly: [
        circle,
        circle._radius,
        diag._unitsSelector,
        circle._circumference,
      ],
      show: [
        circle._mainAngle,
        circle._grid,
        circle._sineLine,
        diag._angleText,
        diag._sineText,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        diag.showRadians();
        diag.toggleUnits('rad');
        diag.updateRotation();
      },
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45">
          It can be seen how the vertical length changes with angle.
        </p>
        <p class="lesson__diagram_text_p_width_45">
          Is the a way to calculate this?
        </p>
        <
      `),
      setEnterState: () => {
        circle._sineLine.setText('');
        diag._sineText.setText('Vertical');
        diag._angleText.setText('θ');
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._sineText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText._text.vertices.element.classList.add('lesson__math_stye');
      },
      showOnly: [
        circle,
        circle._radius,
        diag._unitsSelector,
        circle._circumference,
      ],
      show: [
        circle._mainAngle,
        circle._grid,
        circle._sineLine,
        diag._angleText,
        diag._sineText,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        diag.showRadians();
        diag.toggleUnits('rad');
        diag.updateRotation();
      },
    });
    this.addSection({
      title: 'How to calculate',
      setContent: [`
        <p>
          For quadrant (quarter circle):
        </p>
        <table class="lesson__quadrant_selector_table">
          <tr>
            <td>|q1|</td>
            <td>|q2|</td>
            <td>|q3|</td>
            <td>|q4|</td>
          </tr>
        </table>
      `,
      `<p>
        To calculate |sin_theta|:
      </p>
      <div id="id__sine_paragraph_quad0" class="lesson__sine_paragraph_quad0">
        
          Use either geometry or the series equation.
      
      </div>
      <div id="id__sine_paragraph_quad123">
        <ul class="lesson__quadrant_steps">
          <li id="id_lesson_quadrant_steps_1">
            Calculate symmetric angle
          </li>
          <li id="id_lesson_quadrant_steps_2">
            Use symmetry to find angle in 1st quadrant
          </li>
          <li id="id_lesson_quadrant_steps_3">
            Calculate sine of 1st quadrant angle
          </li>
          <li id="id_lesson_quadrant_steps_4">
            Generalize
          </li>
        </ul>
      </div>
      `,
      ],
      modifiers: {
        sin_theta: highlightWord('sin θ', 'lesson__highlight_sin_theta'),
        q1: clickWord('1', 'id_lesson__quadrant_selector_1', diag.goToQuadrant, [diag, 0]),
        q2: clickWord('2', 'id_lesson__quadrant_selector_2', diag.goToQuadrant, [diag, 1]),
        q3: clickWord('3', 'id_lesson__quadrant_selector_3', diag.goToQuadrant, [diag, 2]),
        q4: clickWord('4', 'id_lesson__quadrant_selector_4', diag.goToQuadrant, [diag, 3]),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag.interactiveSinePage = true;
        circle._sineLine.setText('sin θ');
        circle._sineLine.textOffset = 0.15;
      },
      showOnly: [
        circle,
        circle._radius,
        diag._unitsSelector,
        circle._circumference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        circle._mainAngle.showAll();
        circle._sineLine.showAll();
        circle._grid.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText.showAll();
        diag.showRadians();
        diag.toggleUnits('rad');
        diag.setQuadrantNumberInTable(0);
        diag.toggleParagraphs(0);
        onClickId('id_lesson_quadrant_steps_1', diag.goToStep, [diag, 0]);
        onClickId('id_lesson_quadrant_steps_2', diag.goToStep, [diag, 1]);
        onClickId('id_lesson_quadrant_steps_3', diag.goToStep, [diag, 2]);
        onClickId('id_lesson_quadrant_steps_4', diag.goToStep, [diag, 3]);
        diag.goToStep(-1);
        diag.updateRotation();
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
      setLeaveState: () => {
        diag.interactiveSinePage = false;
      },
    });
  }
}

export default Content;
