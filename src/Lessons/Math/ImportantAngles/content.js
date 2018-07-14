// @flow

import { LessonContent, clickWord, onClickId, centerV } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';

import lessonLayout from './layout';

const layout = lessonLayout();

class Content extends LessonContent {
  setTitle() {
    this.title = 'Important Angles';
    this.iconLink = '/Lessons/Math/ImportantAngles';
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
        <table class="lesson__important_angles_table">
          <tr>
            <td>|Acute|</td>
            <td>|Right|</td>
            <td>|Obtuse|</td>
            <td>|Straight|</td>
            <td>|Reflex|</td>
          </tr>
        </table>
        <div id="id_unit_selection"
             class="lesson__important_angles_unit_selection">
          <span id="id_radians">Radians</span>
          /
          <span id="id_degrees">Degrees</span>
        </div>
      `,
      `<div id="id_acute_text">
        <p class="lesson__diagram_text_p_width_45"
          style="margin-top:20%">
          An acute angle is any angle less than 90
            <span id="id_acute_deg1">&deg;</span>
            <span id="id_acute_rad1">radians</span>.
        </p>
      </div>`,
      `<div id="id_obtuse_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:20%">
          An obtuse angle is any angle greater than 90
            <span id="id_obtuse_deg1">&deg;</span>
            <span id="id_obtuse_rad1">radians</span>
          and less than 180
            <span id="id_obtuse_deg2">&deg;</span>
            <span id="id_obtuse_rad2">radians</span>.
        </p>
      </div>`,
      `<div id="id_straight_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:20%">
          An straight angle is an angle of 180
          <span id="id_straight_deg1">&deg;</span>
          <span id="id_straight_rad1">radians</span>.
        </p>
      </div>`,
      `<div id="id_right_text">
        <p class="lesson__diagram_text_p_width_45"
           style="margin-top:10%">
          A right angle is an angle of 90
          <span id="id_right_deg1">&deg;</span>
          <span id="id_right_rad1">radians</span>.
        </p>
        <p class="lesson__diagram_text_p_width_45">
          It can also be thought of as the angle of a quarter turn or circle.
        </p>
      </div>`,
      `<div id="id_reflex_text">
        <p class="lesson__diagram_text_p_width_45"
          style="margin-top:20%">
          A reflex angle is any angle greater than 180
            <span id="id_reflex_deg1">&deg;</span>
            <span id="id_reflex_rad1">radians</span>
          and less than 360
            <span id="id_reflex_deg2">&deg;</span>
            <span id="id_reflex_rad2">radians</span>.
        </p>
      </div>`,
      ],
      modifiers: {
        Acute: clickWord('Acute', 'id_acute', diag.goToAcute, [diag]),
        Right: clickWord('Right', 'id_right', diag.goToRight, [diag]),
        Obtuse: clickWord('Obtuse', 'id_obtuse', diag.goToObtuse, [diag]),
        Straight: clickWord('Straight', 'id_straight', diag.goToStraight, [diag]),
        Reflex: clickWord('Reflex', 'id_reflex', diag.goToReflex, [diag]),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        circle._angle.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText.showAll();
        diag.showRadians();
        diag.selectAngle('acute');
        onClickId('id_unit_selection', diag.toggleUnits, [diag, null]);
        diag.toggleUnits('deg');
      },
    });
  }
}

export default Content;
