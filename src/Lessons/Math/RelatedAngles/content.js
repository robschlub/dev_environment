// @flow

import {
  LessonContent, clickWord, onClickId, click, highlight, centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import Definition from '../../../LessonsCommon/tools/definition';
import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

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
    selector.add('opposite', 'Opposite', 'Angles');
    selector.add('corresponding', 'Corresponding', 'Angles');
    selector.add('alternate', 'Alternate', 'Angles');
    selector.add('interior', 'Interior', 'Angles');
    selector.selectWithoutExecution('parallel');
  }

  addSections() {
    const diag = this.diagram.elements;
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
        Parallel_lines: click(diag.rotateLine1ToParallel, [diag], colors.line),
      },
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('parallel');
        diag.isParallelHighlighting = true;
        diag._line1.setColor(layout.colors.line);
        diag._line2.setColor(layout.colors.line);

        diag._line1._end1.movementAllowed = 'rotation';
        diag._line1._end2.movementAllowed = 'rotation';
        diag._line1._mid.movementAllowed = 'translation';
        diag._line2._end1.movementAllowed = 'rotation';
        diag._line2._end2.movementAllowed = 'rotation';
        diag._line2._mid.movementAllowed = 'translation';
      },
      showOnly: [
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        diag._line1,
        diag._line2,
      ],
      transitionFromAny: (done) => {
        const time = diag.moveToPosition(diag._line1, 'parallel');
        diag.moveToPosition(diag._line2, 'parallel', time, done);
      },
      setSteadyState: () => {
        diag.isParallelHighlighting = true;
      },
    });

    this.addSection({
      title: 'Opposite Angles',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          When two lines intersect, 4 angles are created.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          |Opposite_Angles| at the intersection are equal.
        </p>
        ${new Definition('Opposite', 'Latin', ['oppositus', 'set against, opposing']).html('id_lesson__related_angles_definition')}
      `),
      modifiers: {
        Opposite_Angles: click(diag.rotateLine1ToParallel, [diag], colors.line),
      },
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('opposite');
        diag.isParallelHighlighting = false;
        diag._line1._end1.movementAllowed = 'rotation';
        diag._line1._end2.movementAllowed = 'rotation';
        diag._line1._mid.movementAllowed = 'rotation';
        diag._line2._end1.movementAllowed = 'rotation';
        diag._line2._end2.movementAllowed = 'rotation';
        diag._line2._mid.movementAllowed = 'rotation';
        diag._line1.setColor(layout.colors.line);
        diag._line2.setColor(layout.colors.line);
      },
      showOnly: [
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        diag._line1,
        diag._line2,
        diag._angleA,
        diag._angleB,
        // diag._angleC,
        // diag._angleD,
      ],
      transitionFromAny: (done) => {
        diag._angleA.eqn.showForm('a');
        diag._angleB.eqn.showForm('b');
        const time = diag.moveToPosition(diag._line1, 'opposite');
        diag.moveToPosition(diag._line2, 'opposite', time, done);
      },
      setSteadyState: () => {
        diag.isParallelHighlighting = false;
        diag._angleA.eqn.showForm('a');
        diag._angleB.eqn.showForm('b');
        // console.log(diag)
      },
    });
  }
}

export default Content;
