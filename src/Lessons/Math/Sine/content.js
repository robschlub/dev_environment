// @flow

import { LessonContent, clickWord, onClickId, click, highlightWord } from '../../../js/Lesson/LessonContent';
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
      setContent: [`
        <p>
          Choose quadrant:
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
      `,
      ],
      modifiers: {
        sin_theta: highlightWord('sin θ', 'lesson__highlight_sin_theta'),
        q1: clickWord('1', 'id_lesson__quadrant_selector_1', diag.goToQuadrant, [diag, 0]),
        q2: clickWord('2', 'id_lesson__quadrant_selector_2', diag.goToQuadrant, [diag, 1]),
        q3: clickWord('3', 'id_lesson__quadrant_selector_3', diag.goToQuadrant, [diag, 2]),
        q4: clickWord('4', 'id_lesson__quadrant_selector_4', diag.goToQuadrant, [diag, 3]),
        // Acute: clickWord('Acute', 'id_acute', diag.goToAcute, [diag]),
        // Right: clickWord('Right', 'id_right', diag.goToRight, [diag]),
        // Obtuse: clickWord('Obtuse', 'id_obtuse', diag.goToObtuse, [diag]),
        // Straight: clickWord('Straight', 'id_straight', diag.goToStraight, [diag]),
        // Reflex: clickWord('Reflex', 'id_reflex', diag.goToReflex, [diag]),
        // acute_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // straight_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // obtuse_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // right_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // reflex_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // quarter_circle: highlight(),
        // square: click(diag.toggleRightAngleLine, [diag, true], colors.angleText),
        // from_Latin: highlight('lesson__important_angles_from_Latin'),
        // from_Late_Latin: highlight('lesson__important_angles_from_Latin'),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        circle,
        circle._radius,
        diag._unitsSelector,
        circle._arc,
        // circle._symmetricLine,
        // circle._quad2,
        // circle._quad3,
        // circle._quad4,
        // circle._reference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        circle._mainAngle.showAll();
        circle._sineLine.showAll();
        circle._grid.showAll();
        // circle._quad0Angle.showAll();
        // circle._quad1Angle.showAll();
        // circle._quad2Angle.showAll();
        // circle._quad3Angle.showAll();
        // circle._symmetry.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText.showAll();
        diag.showRadians();
        diag.toggleUnits('rad');
        diag.setQuadrantNumberInTable(0);

        onClickId('id_lesson_quadrant_steps_1', diag.goToStep, [diag, 0]);
        onClickId('id_lesson_quadrant_steps_2', diag.goToStep, [diag, 1]);
        onClickId('id_lesson_quadrant_steps_3', diag.goToStep, [diag, 2]);
        onClickId('id_lesson_quadrant_steps_4', diag.goToStep, [diag, 3]);
        diag.goToStep(-1);
      },
    });
  }
}

export default Content;
