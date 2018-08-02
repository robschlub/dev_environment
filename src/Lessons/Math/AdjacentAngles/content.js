// @flow

import { LessonContent, clickWord, onClickId, click, highlight } from '../../../js/Lesson/LessonContent';
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

const _piOn2 = '<sup>&pi;</sup>&frasl;<sub>2</sub>';
// const _piOn2 = '<sup>1</sup>&frasl;<sub>2</sub>';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Adjacent Angles';
    this.iconLink = '/Lessons/Math/AdjacentAngles';
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
        <table class="lesson__adjacent_angles_table">
          <tr>
            <td>|Adjacent|</td>
            <td>|Complementary|</td>
            <td>|Supplementary|</td>
            <td>|Explementary|</td>
          </tr>
        </table>
        <div id="id_unit_selection"
             class="lesson__important_angles_unit_selection">
          <span id="id_radians">Radians</span>
          /
          <span id="id_degrees">Degrees</span>
        </div>
      `,
      `<div id="id_adjacent_text">
        <p class="lesson__diagram_text_p_width_40"
          style="margin-top:17%">
          Adjacent angles are any angles that share a common vertex and edge.
        </p>
        <p class="lesson__font_0p5" style="margin-top:16.2%; margin-left: 4%">
          <span class="english">Adjacent</span> |from_Latin| <i class="latin">adjacent</i>: "lying near to"
        </p>
      </div>`,
      `<div id="id_complementary_text">
        <p class="lesson__diagram_text_p_width_40"
           style="margin-top:17%">
          Complementary angles add up to a right angle.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          a + b = ${unit('90', _piOn2, 'complementary')}
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:12%; margin-left: 4%">
          <span class="english">Complementary</span> |from_Latin| <i class="latin">complementum</i>: “that which fills up or completes”
        </p>
      </div>`,
      `<div id="id_supplementary_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:17%">
          Supplementary angles add up to a straight angle.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          a + b = ${unit('180', '&pi;', 'supplementary')}
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:12%; margin-left: 4%">
          <span class="english">Supplementary</span> |from_Latin| <i class="latin">supplementum</i>: “fill up, complete”
        </p>
      </div>`,
      `<div id="id_explementary_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:17%">
          |Explementary angles| add up to a full angle.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          a + b = ${unit('360', '2&pi;', 'explementary')}
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:12%; margin-left: 4%">
          <span class="english">Explementary</span> |from_Latin| <i class="latin">explementum</i>: “something that fills up, stuff”
        </p>
      </div>`,
      // `<div id="id_reflex_text">
      //   <p class="lesson__diagram_text_p_width_40"
      //     style="margin-top:17%">
      //     A |reflex_angle| is any angle between
      //     ${unit('180', '&pi;', 'reflex')}
      //     and ${unit('360', '2&pi;', 'reflex', 2)}.
      //   </p>
      //   <p class="lesson__font_0p5"
      //     style="margin-top:21%; margin-left: 4%">
      //     <span class="english">Reflex</span> |from_Late_Latin| <i class="latin">reflexus</i>: “to bend back”
      //   </p>
      // </div>`,
      // `<div id="id_full_text">
      //   <p class="lesson__diagram_text_p_width_40"
      //     style="margin-top:20%">
      //     A |full_angle| is an angle of
      //     ${unit('360', '2&pi;', 'full')}.
      //   </p>
      //   <p class="lesson__font_0p5"
      //     style="margin-top:23.2%; margin-left: 4%">
      //     <span class="english">Full</span>: “containing all that can be received; perfect, entire”
      //   </p>
      // </div>`,
      ],
      modifiers: {
        Adjacent: clickWord('Adjacent', 'id_adjacent', diag.goToAdjacent, [diag]),
        Complementary: clickWord('Complementary', 'id_complementary', diag.goToComplementary, [diag]),
        Supplementary: clickWord('Supplementary', 'id_supplementary', diag.goToSupplementary, [diag]),
        Explementary: clickWord('Explementary', 'id_explementary', diag.goToExplementary, [diag]),
        // Reflex: clickWord('Reflex', 'id_reflex', diag.goToReflex, [diag]),
        // Full: clickWord('Full', 'id_full', diag.goToFull, [diag]),
        // acute_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // straight_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // obtuse_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // right_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // reflex_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // full_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // quarter_circle: highlight(),
        // square: click(diag.toggleRightAngleLine, [diag, true], colors.angleText),
        from_Latin: highlight('lesson__important_angles_from_Latin'),
        from_Late_Latin: highlight('lesson__important_angles_from_Latin'),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._startLine,
        circle._endLine,
        // circle._reference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        // circle._angle.showAll();
        // circle._axes.showAll();
        // diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        // diag._angleText.showAll();
        // diag.showRadians();
        diag.selectAngle('adjacent');
        onClickId('id_unit_selection', diag.toggleUnits, [diag, null]);
        diag.toggleUnits('deg');
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
    });
  }
}

export default Content;
