// @flow
import {
  LessonContent, click, centerV,
} from '../../../../js/Lesson/LessonContent';

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
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Parallel_lines| are lines that never meet.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          They have the same rotation, and do not touch.
        </p>
        ${new Definition('Parallel', 'Greek', ['para', 'beside', 'allelois', 'each other']).html('id_lesson__related_angles_definition')}
      `),
      modifiers: {
        Parallel_lines: click(parallel.rotateLine1ToParallel, [parallel], colors.line),
      },
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
          diag.getTimeToMoveToScenario(parallel._line1, 'parallel'),
          diag.getTimeToMoveToScenario(parallel._line2, 'parallel'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(parallel._line1, 'parallel', time);
        diag.moveToScenario(parallel._line2, 'parallel', time, done);
      },
      setSteadyState: () => {
        diag.isParallelHighlighting = true;
        diag.moveToScenario(parallel._line1, 'parallel', 0.001);
        diag.moveToScenario(parallel._line2, 'parallel', 0.001);
      },
    });
  }
}

export default Content;
