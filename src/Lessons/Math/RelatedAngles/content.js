// @flow

import {
  LessonContent, clickWord, onClickId, click, highlight, centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';

import lessonLayout from './layout';

const layout = lessonLayout();
// const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = 'Related Angles';
    this.iconLink = '/Lessons/Math/RelatedAngles';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  setElementContent() {
    const { selector } = this.diagram.elements._selector;
    selector.add('parallel', 'Parallel', 'Lines');
    selector.add('opposite', 'Vertically Opposite', 'Angle');
    selector.add('corresponding', 'Corresponding', 'Angle');
    selector.add('alternate', 'Alternate', 'Angle');
    selector.add('interior', 'Interior', 'Angle');
    selector.selectWithoutExecution('interior');
  }

  addSections() {
    const diag = this.diagram.elements;
    this.addSection({
      title: 'Parallel',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_45">
          Parallel lines are lines that have the same rotation and are not on top of each other.
        </p>
        <p class="lesson__diagram_text_p_width_45">
          Parallel lines can never cross or touch each other.
        </p>
      `),
      modifiers: {
      },
      setEnterState: () => {
        diag._line1.setPosition(layout.line1.position);
        diag._line2.setPosition(layout.line2.position);
      },
      showOnly: [
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        diag._line1,
        diag._line2,
      ],
      setSteadyState: () => {
      },
    });
  }
}

export default Content;
