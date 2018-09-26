// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, highlight, clickWord,
} from '../../../../js/tools/htmlGenerator';
import Definition from '../../../../LessonsCommon/tools/definition';
import LessonDiagram from './diagram';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import details from '../details';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    const diag = this.diagram.elements;
    const tri = diag._triangle;

    this.addSection({
      title: 'Congruent Triangles',
      setContent: `
        <p class="lesson__font_0p9">
          Shapes are |congruent| when they are the |same size and shape|. Triangles are congruent when they have the same set of |side_lengths| and |angles|.
        </p>
        <p class="lesson__font_0p9">
          Shapes remain |congruent| if one is |rotated| or |flipped|.
        </p>
        ${new Definition('Congruent', 'Latin', ['congruent', 'agreeing, meeting together']).html('id_lesson__congruent_angles_definition', 'lesson__definition_low')}
      `,
      modifiers: {
        rotated: click(tri.toggleCongruentRotate, [tri], colors.diagram.action),
        flipped: click(tri.toggleCongruentFlip, [tri], colors.diagram.action),
        side_lengths: highlight(colors.lineLabels),
        angles: highlight(colors.angleLabels),
      },
      setInfo: [
        '<ul>',
        '<li>Drag the right triangle or touch the |rotated| text to rotate the triangle and see the angles and sides stay the same.</li>',
        '<li>Touch the |flipped| text to flip the triangle and see the angles and sides stay the same.</li>',
        '</ul>',
      ],
      infoModifiers: {
        rotated: highlight(colors.diagram.action),
        flipped: highlight(colors.diagram.action),
      },
      setEnterState: () => {
        const lay = layout.triangles.congruent;
        tri.setTriangleScenarios(
          lay.points, lay.points,
          lay.tri1.scenario, lay.tri2.scenario,
        );
        tri._tri2.isMovable = true;
        tri._tri2.isTouchable = true;
        tri._tri2.touchInBoundingRect = true;
        tri._tri2.move.type = 'rotation';
      },
      show: [tri],
    });

    this.addSection({
      title: 'Congruency Tests',
      setContent: `
        <p class="lesson__font_0p9">
          |All sides and angles can be measured| to show two triangles are congruent. There are also some combinations of |three properties| that can show congruency.
        </p>
        <div class="lesson__congruent_angles_summary__sub_title lesson__diagram_text_p_width_40" style="margin-top: 10%">
        Combinations that <b>CAN</b> show congruency.
        </div>
          <ul class="lesson__congruent_angles_summary__list">
            <li>|SAS|</li>
            <li>|SSS|</li>
            <li>|ASA|</li>
            <li>|AAS|</li>
          </ul>
        <div class="lesson__congruent_angles_summary__sub_title lesson__diagram_text_p_width_40">
        Combinations that <b>CANNOT</b> show congruency.
        </div>
          <ul class="lesson__congruent_angles_summary__list lesson__congruent_angles_summary__cannot_list">
            <li>|AAA|</li>
            <li>|SSA|</li>
          </ul>
      `,
      modifiers: {
        SAS: clickWord(
          'Side Angle Side', 'id_lesson__congruent_SAS',
          diag.showCombination, [diag, 'sas'], colors.diagram.text.base,
        ),
        SSS: clickWord(
          'Side Side Side', 'id_lesson__congruent_SSS',
          diag.showCombination, [diag, 'sss'], colors.diagram.text.base,
        ),
        ASA: clickWord(
          'Angle Side Angle', 'id_lesson__congruent_ASA',
          diag.showCombination, [diag, 'asa'], colors.diagram.text.base,
        ),
        AAS: clickWord(
          'Angle Angle Side', 'id_lesson__congruent_AAS',
          diag.showCombination, [diag, 'aas'], colors.diagram.text.base,
        ),
        AAA: clickWord(
          'Angle Angle Angle', 'id_lesson__congruent_AAA',
          diag.showCombination, [diag, 'aaa'], colors.diagram.text.warning,
        ),
        SSA: clickWord(
          'Side Side Angle', 'id_lesson__congruent_SSA',
          diag.showCombination, [diag, 'ssa'], colors.diagram.text.warning,
        ),
      },
      setEnterState: () => {
        const lay = layout.triangles.congruent;
        tri.setTriangleScenarios(
          lay.points, lay.points,
          lay.tri1CongruencyTests.scenario, lay.tri1CongruencyTests.scenario,
        );
      },
      showOnly: [tri],
      show: [tri._tri1, diag._label],
    });
  }
}

export default Content;
