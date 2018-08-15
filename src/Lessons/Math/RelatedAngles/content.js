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
    const opp = diag._opposite;
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
        diag._selector.selector.selectWithoutExecution('parallel');
        // diag.isParallelHighlighting = true;
        parallel._line1.setColor(layout.colors.line);
        parallel._line2.setColor(layout.colors.line);

        parallel._line1._end1.movementAllowed = 'rotation';
        parallel._line1._end2.movementAllowed = 'rotation';
        parallel._line1._mid.movementAllowed = 'translation';
        parallel._line2._end1.movementAllowed = 'rotation';
        parallel._line2._end2.movementAllowed = 'rotation';
        parallel._line2._mid.movementAllowed = 'translation';
      },
      showOnly: [
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        parallel,
        parallel._line1,
        parallel._line2,
      ],
      transitionFromAny: (done) => {
        const time = diag.moveToPosition(parallel._line1, 'parallel');
        diag.moveToPosition(parallel._line2, 'parallel', time, done);
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
        Opposite_Angles: click(opp.toggleOppositeAngles, [opp], colors.line),
      },
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('opposite');
        // diag.isParallelHighlighting = false;
        opp._line1._end1.movementAllowed = 'rotation';
        opp._line1._end2.movementAllowed = 'rotation';
        opp._line1._mid.movementAllowed = 'rotation';
        opp._line2._end1.movementAllowed = 'rotation';
        opp._line2._end2.movementAllowed = 'rotation';
        opp._line2._mid.movementAllowed = 'rotation';
        // opp._line1.setColor(layout.colors.line);
        // opp._line2.setColor(layout.colors.line);
      },
      showOnly: [
        opp,
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        opp._line1,
        opp._line2,
        opp._angleA,
        opp._angleC,
      ],
      transitionFromAny: (done) => {
        opp._angleA.eqn.showForm('a');
        opp._angleC.eqn.showForm('a');
        const time = diag.moveToPosition(opp._line1, 'opposite');
        diag.moveToPosition(opp._line2, 'opposite', time, done);
        console.log(time)
      },
      setSteadyState: () => {
        // diag.isParallelHighlighting = false;
        opp._angleA.eqn.showForm('a');
        opp._angleC.eqn.showForm('a');
      },
    });
  }
}

export default Content;
