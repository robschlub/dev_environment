// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  click,
} from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
import Definition from '../../../../LessonsCommon/tools/definition';
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
    const parallel = diag._parallel;

    this.addSection({
      title: 'Parallel Lines',
      setContent: `
        <p>
          |Parallel| lines are lines that never meet.
          They have the same rotation, and do not touch.
        </p>
        ${new Definition('Parallel', 'Greek', ['para', 'beside', 'allelois', 'each other']).html('id_lesson__related_angles_definition')}
      `,
      modifiers: {
        Parallel: click(parallel.rotateLine1ToParallel, [parallel], colors.line),
      },
      setInfo: [
        '<ul>',
        '<li>Move and rotate the lines to see when they are parallel.</li>',
        '<li>Move the line by dragging its <i>middle</i>.</li>',
        '<li>Rotate the line by dragging one of its <i>ends</i>.</li>',
        '<li>The lines will have color when they are parallel.</li>',
        '<li>Touch |Parallel| to make the lines parallel.</li>',
        '</ul>',
      ],
      setEnterState: () => {
        parallel.setPosition(layout.position);
        parallel._line1.setColor(colors.line);
      },
      showOnly: [
      ],
      show: [
        parallel,
        parallel._line1,
        parallel._line2,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(parallel._line1),
          diag.getTimeToMoveToScenario(parallel._line2),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(parallel._line1, '', time);
        diag.moveToScenario(parallel._line2, '', time, done);
      },
      setSteadyState: () => {
        diag.isParallelHighlighting = true;
        diag.moveToScenario(parallel._line1, '', 0.001);
        diag.moveToScenario(parallel._line2, '', 0.001);
      },
    });
  }
}

export default Content;
