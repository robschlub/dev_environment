// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, highlight,
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
      title: 'Summary',
      setContent: `
        <p>
          Shapes are |congruent| when they are the |same size and shape|. Triangles are congruent when they have the same set of |side_lengths| and |angles|.
        </p>
        <p>
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
  }
}

export default Content;
