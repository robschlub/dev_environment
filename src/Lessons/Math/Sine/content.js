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
    this.addSection({
      title: 'Introduction',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45">
          |Rotating| a |line| around a fixed point creates an |arc|, whose length depends on the |angle| of rotation.
        </p>
        <p class="lesson__diagram_text_p_width_45">
          The arc forms a |circle| with complete rotation.
        </p>
      `),
      modifiers: {
        Rotating: click(diag.pushRadius, [diag], colors.radius),
        line: click(diag.pulseRadius, [diag], colors.radius),
        arc: click(diag.pulseArc, [diag], colors.arc),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        circle: click(diag.rotateTo, [diag, Math.PI * 1.999, 2, 2], colors.circle),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._arc,
        circle._reference,
        diag._unitsSelector,
      ],
      setSteadyState: () => {
        circle._angle.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight2);
        diag._angleText.showAll();
        diag.resetCircle('bottomRight', Math.PI / 3);
        diag.showRadians();
        diag.toggleUnits('rad');
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
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
