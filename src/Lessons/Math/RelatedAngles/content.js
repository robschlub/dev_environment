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
        if (opp.isShown) {
          parallel._line1.setTransform(opp._line1.transform._dup());
          parallel._line2.setTransform(opp._line2.transform._dup());
        }
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
        let time = Math.max(
          diag.getTimeToMoveToPosition(parallel._line1, 'parallel'),
          diag.getTimeToMoveToPosition(parallel._line2, 'parallel'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToPosition(parallel._line1, 'parallel', time);
        diag.moveToPosition(parallel._line2, 'parallel', time, done);
      },
      setSteadyState: () => {
        diag.isParallelHighlighting = true;
        diag.moveToPosition(parallel._line1, 'parallel', 0.001);
        diag.moveToPosition(parallel._line2, 'parallel', 0.001);
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
        if (parallel.isShown) {
          opp._line1.transform = parallel._line1.transform._dup();
          opp._line2.transform = parallel._line2.transform._dup();
        }
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._angleC,
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        opp._line1,
        opp._line2,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToPosition(opp._line1, 'opposite'),
          diag.getTimeToMoveToPosition(opp._line2, 'opposite'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToPosition(opp._line1, 'opposite', time);
        diag.moveToPosition(opp._line2, 'opposite', time, done);
      },
      setSteadyState: () => {
        diag.moveToPosition(opp._line1, 'opposite', 0.001);
        diag.moveToPosition(opp._line2, 'opposite', 0.001);
        opp._angleC.setColor(layout.colors.angleA);
        opp._angleD.setColor(layout.colors.angleB);
        opp._angleA._arc.show();
        opp._angleC._arc.show();
        opp._angleA.eqn.showForm('a');
        opp._angleC.eqn.showForm('a');
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          This can be shown by considering the four angles separately, and
          recognizing the |supplementary_angles|.
        </p>
      `),
      modifiers: {
        supplementary_angles: click(opp.pulseSupplementaryAngle, [opp], colors.supplementary),
      },
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('opposite');
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._angleB,
        opp._angleC,
        opp._angleD,
      ],
      show: [
        diag._unitsSelector,
        diag._selector,
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleC.setColor(layout.colors.angleC);
        opp._angleD.setColor(layout.colors.angleD);
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.eqn.showForm('a');
        opp._angleB.eqn.showForm('b');
        opp._angleC.eqn.showForm('c');
        opp._angleD.eqn.showForm('d');
      },
    });
  }
}

export default Content;
