// @flow

import {
  LessonContent, clickWord, onClickId, click, highlight,
} from '../../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import imgLink from '../tile.png';
import lessonLayout from './layout';
import details from '../details';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;

    const diag = this.diagram.elements;
    this.addSection({
      title: 'Summary',
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
             class="lesson__adjacent_angles_unit_selection">
          <span id="id_radians">Radians</span>
          /
          <span id="id_degrees">Degrees</span>
        </div>
      `,
      `<div id="id_adjacent_text">
        <p class="lesson__diagram_text_p_width_40"
          style="margin-top:17%">
          |Adjacent_angles| are any angles that share a common vertex and edge.
        </p>
        <p class="lesson__font_0p5" style="margin-top:15.6%; margin-left: 4%">
          <span class="english">Adjacent</span> |from_Latin| <i class="latin">adjacent</i>: "lying near to"
        </p>
      </div>`,
      `<div id="id_complementary_text">
        <p class="lesson__diagram_text_p_width_40"
           style="margin-top:17%">
          |Complementary_angles| add up to a |right_angle|.
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:21%; margin-left: 4%">
          <span class="english">Complementary</span> |from_Latin| <i class="latin">complementum</i>: “that which fills up or completes”
        </p>
        <p class="lesson__font_0p3" style="margin-top:0.5%; margin-left: 4%">
          <span class="lesson__note"><i>Complementary</i>, <i>Supplementary</i> and <i>Explementary</i> all come from latin roots that mean “to fill up or to complete". When used in geometry, they are used to make a distinction between filling up a right angle, straight angle, or full angle.
          </span>
        </p>
      </div>`,
      `<div id="id_supplementary_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:17%">
          |Supplementary_angles| add up to a |straight_angle|.
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:21%; margin-left: 4%">
          <span class="english">Supplementary</span> |from_Latin| <i class="latin">supplementum</i>: “fill up, complete”
        </p>
        <p class="lesson__font_0p3" style="margin-top:0.5%; margin-left: 4%">
          <span class="lesson__note"><i>Complementary</i>, <i>Supplementary</i> and <i>Explementary</i> all come from latin roots that mean “to fill up or to complete". When used in geometry, they are used to make a distinction between filling up a right angle, straight angle, or full angle.
          </span>
        </p>
      </div>`,
      `<div id="id_explementary_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:17%">
          |Explementary_angles| add up to a |full_angle|.
        </p>
        <p class="lesson__font_0p5"
          style="margin-top:21%; margin-left: 4%">
          <span class="english">Explementary</span> |from_Latin| <i class="latin">explementum</i>: “something that fills up, stuff”
        </p>
        <p class="lesson__font_0p3" style="margin-top:0.5%; margin-left: 4%">
          <span class="lesson__note"><i>Complementary</i>, <i>Supplementary</i> and <i>Explementary</i> all come from latin roots that mean “to fill up or to complete". When used in geometry, they are used to make a distinction between filling up a right angle, straight angle, or full angle.
          </span>
        </p>
      </div>`,
      ],
      modifiers: {
        Adjacent: clickWord('Adjacent', 'id_adjacent', diag.goToAdjacent, [diag]),
        Complementary: clickWord('Complementary', 'id_complementary', diag.goToComplementary, [diag]),
        Supplementary: clickWord('Supplementary', 'id_supplementary', diag.goToSupplementary, [diag]),
        Explementary: clickWord('Explementary', 'id_explementary', diag.goToExplementary, [diag]),
        Adjacent_angles: click(diag.goToRandomAdjancentAngle, [diag], colors.radius),
        Complementary_angles: click(
          diag.goToRandomAngle, [diag, Math.PI / 2],
          colors.radius,
        ),
        Supplementary_angles: click(
          diag.goToRandomAngle, [diag, Math.PI],
          colors.radius,
        ),
        Explementary_angles: click(
          diag.goToRandomAngle, [diag, Math.PI * 2],
          colors.radius,
        ),
        right_angle: click(diag.pulseRightAngle, [diag], colors.angleText),
        straight_angle: click(diag.pulseStraightAngle, [diag], colors.angleText),
        full_angle: click(diag.pulseFullAngle, [diag], colors.angleText),
        from_Latin: highlight('lesson__adjacent_angles_from_Latin'),
        from_Late_Latin: highlight('lesson__adjacent_angles_from_Latin'),
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
        circle._angleA,
        circle._angleA._arc,
        circle._angleB,
        circle._angleB._arc,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        diag.setEndLineRotation(Math.PI / 3);
        diag.setRotation(Math.PI / 6);
        circle.transform.updateRotation(0);
        diag.selectAnglePair('adjacent');
        onClickId('id_unit_selection', diag.toggleUnits, [diag, null]);
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
        diag.toggleUnits('deg');
        diag.goToAdjacent();
      },
    });
  }
}

export default Content;