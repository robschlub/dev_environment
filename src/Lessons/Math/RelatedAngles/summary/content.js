// @flow
import {
  LessonContent, click, centerV, unit, interactiveItem,
} from '../../../../js/Lesson/LessonContent';
import {
  Point,
} from '../../../../js/diagram/tools/g2';

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

  setElementContent() {
    const { selector } = this.diagram.elements._selector;
    selector.add('parallel', 'Parallel', 'Lines');
    selector.add('opposite', 'Opposite', 'Angles');
    selector.add('corresponding', 'Corresponding', 'Angles');
    selector.add('alternate', 'Alternate', 'Angles');
    selector.add('interior', 'Interior', 'Angles');
    // selector.add('quiz', 'Quiz', '');
    selector.selectWithoutExecution('parallel');
  }

  addSections() {
    const diag = this.diagram.elements;
    const opp = diag._opposite;
    const parallel = diag._parallel;
    const threeLines = diag._threeLines;
    // const quiz = diag._quiz;

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
      setInfo: `<ul>
          <li>Move a line by dragging its middle.</li>
          <li>Rotate a line by dragging one of its ends.</li>
          <li>The lines will be blue when they are parallel.</li>
          <li>Touch |Parallel Lines| to make lines parallel.</li>
          </ul>
      `,
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('parallel');
        parallel.setPosition(layout.position);
        if (opp.isShown) {
          parallel._line1.setTransform(opp._line1.transform._dup());
          parallel._line2.setTransform(opp._line2.transform._dup());
        }
        parallel._line1.setColor(colors.line);
      },
      showOnly: [
      ],
      show: [
        diag._selector,
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


    this.addSection({
      title: 'Opposite Angles',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          When two lines intersect, four angles are created.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          |Opposite_Angles| at the intersection are equal.
        </p>
        ${new Definition('Opposite', 'Latin', ['oppositus', 'set against, opposing']).html('id_lesson__related_angles_definition')}
      `),
      modifiers: {
        Opposite_Angles: click(opp.toggleOppositeAngles, [opp], colors.angleA),
      },
      setInfo: `<ul>
          <li>Rotate the lines to change the angle.</li>
          <li>Click |Opposite Angles| to see the other pair of angles.</li>
          </ul>
      `,
      interactiveElementsRemove: [
        opp._line1._mid,
        opp._line2._mid,
      ],
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('opposite');
        if (parallel.isShown) {
          opp._line1.transform = parallel._line1.transform._dup();
          opp._line2.transform = parallel._line2.transform._dup();
        }
        opp._angleA.setColor(layout.colors.angleA);
        opp._angleB.setColor(layout.colors.angleB);
        opp._angleC.setColor(layout.colors.angleA);
        opp._angleD.setColor(layout.colors.angleB);
        opp._line1.setColor(layout.colors.line);
        opp._line2.setColor(layout.colors.line);
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._angleC,
        opp._line1,
        opp._line1._end1,
        opp._line1._end2,
        opp._line1._mid,
        opp._line2,
        opp._line2._end1,
        opp._line2._end2,
        opp._line2._mid,
      ],
      show: [
        // diag._unitsSelector,
        diag._selector,
        // opp._line1,
        // opp._line2,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(opp._line1, 'opposite'),
          diag.getTimeToMoveToScenario(opp._line2, 'opposite'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(opp._line1, 'opposite', time);
        diag.moveToScenario(opp._line2, 'opposite', time, done);
      },
      setSteadyState: () => {
        diag.moveToScenario(opp._line1, 'opposite', 0.001);
        diag.moveToScenario(opp._line2, 'opposite', 0.001);
        opp._angleA._arc.show();
        opp._angleC._arc.show();
        opp._angleA.showForm('a');
        opp._angleC.showForm('a');
      },
    });

    this.addSection({
      title: 'Corresponding Angles',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Corresponding_Angles| are the angles in the same relative position at the intersection of |two_lines| and an |intersecting| line.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          When the two lines are |parallel|, corresponding angles are always |equal|.
        </p>
      `),
      modifiers: {
        Corresponding_Angles: click(
          threeLines.toggleCorrespondingAngles, [threeLines],
          colors.angleA,
        ),
        parallel: click(threeLines.pulseParallel, [threeLines], colors.line),
        two_lines: click(threeLines.pulseParallel, [threeLines], colors.line),
        intersecting: click(threeLines.pulseLine, [threeLines, 3], colors.intersectingLine),
      },
      setInfo: `<ul>
          <li>Rotate the intersecting line to change the angle.</li>
          <li>Rotate the parallel lines to change perspective.</li>
          <li>Touch |Corresponding Angles| to change the angle pair.</li>
          </ul>
      `,
      interactiveElementsRemove: [
        threeLines._line3._mid,
        threeLines._line1._mid,
        threeLines._line2._mid,
      ],
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('corresponding');
        if (parallel.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = parallel._line1.transform._dup();
          threeLines._line2.transform = parallel._line2.transform._dup();
        }
        if (opp.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = opp._line1.transform._dup();
          threeLines._line2.transform = opp._line2.transform._dup();
        }
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.line);
      },
      showOnly: [
        threeLines,
        threeLines._line1,
        threeLines._line1._end1,
        threeLines._line1._end2,
        threeLines._line1._mid,
        threeLines._line2,
        threeLines._line2._end1,
        threeLines._line2._end2,
        threeLines._line2._mid,
        threeLines._line3,
        threeLines._line3._end1,
        threeLines._line3._end2,
        threeLines._line3._mid,
      ],
      show: [
        diag._selector,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(threeLines._line1, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line2, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(threeLines._line1, 'corresponding', time);
        diag.moveToScenario(threeLines._line2, 'corresponding', time);
        diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
      },
      setSteadyState: () => {
        diag.moveToScenario(threeLines._line1, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line2, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        threeLines.toggleCorrespondingAngles(false);
      },
    });

    this.addSection({
      title: 'Alternate Angles',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Alternate_angles| are the angles that are on opposite sides of the |intersecting| line that crosses |two_lines|.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          When the two lines are |parallel|, the alternate angles are always |equal|.
        </p>
      `),
      modifiers: {
        Alternate_angles: click(
          threeLines.toggleAlternateAngles, [threeLines],
          colors.angleA,
        ),
        parallel: click(threeLines.pulseParallel, [threeLines], colors.line),
        two_lines: click(threeLines.pulseParallel, [threeLines], colors.line),
        intersecting: click(threeLines.pulseLine, [threeLines, 3], colors.intersectingLine),
      },
      setInfo: `<ul>
          <li>Rotate the intersecting line to change the angle.</li>
          <li>Rotate the parallel lines to change perspective.</li>
          <li>Touch |Alternate Angles| to change the angle pair.</li>
          </ul>
      `,
      interactiveElementsRemove: [
        threeLines._line3._mid,
        threeLines._line1._mid,
        threeLines._line2._mid,
      ],
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('alternate');
        if (parallel.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = parallel._line1.transform._dup();
          threeLines._line2.transform = parallel._line2.transform._dup();
        }
        if (opp.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = opp._line1.transform._dup();
          threeLines._line2.transform = opp._line2.transform._dup();
        }
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.line);
        // threeLines._line3.setColor(layout.colors.line);
      },
      showOnly: [
        threeLines,
        threeLines._line1,
        threeLines._line1._end1,
        threeLines._line1._end2,
        threeLines._line1._mid,
        threeLines._line2,
        threeLines._line2._end1,
        threeLines._line2._end2,
        threeLines._line2._mid,
        threeLines._line3,
        threeLines._line3._end1,
        threeLines._line3._end2,
        threeLines._line3._mid,
      ],
      show: [
        diag._selector,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(threeLines._line1, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line2, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(threeLines._line1, 'corresponding', time);
        diag.moveToScenario(threeLines._line2, 'corresponding', time);
        diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
      },
      setSteadyState: () => {
        diag.moveToScenario(threeLines._line1, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line2, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        threeLines.toggleAlternateAngles();
      },
    });

    this.addSection({
      title: 'Interior Angles',
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Interior_angles| are the inside angles on the same side of the |intersecting| line that crosses |two_lines|.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          When the two lines are |parallel|, the interior angles always add up to ${unit('|180&deg;|', '|&pi; radians|')}.
        </p>
      `),
      modifiers: {
        Interior_angles: click(
          threeLines.toggleInteriorAngles, [threeLines],
          colors.angleA,
        ),
        parallel: click(threeLines.pulseParallel, [threeLines], colors.line),
        two_lines: click(threeLines.pulseParallel, [threeLines], colors.line),
        intersecting: click(threeLines.pulseLine, [threeLines, 3], colors.intersectingLine),
      },
      setInfo: `<ul>
          <li>Rotate the intersecting line to change the angle.</li>
          <li>Rotate the parallel lines to change perspective.</li>
          <li>Touch |Interior Angles| to change the angle pair.</li>
          </ul>
      `,
      interactiveElementsRemove: [
        threeLines._line3._mid,
        threeLines._line1._mid,
        threeLines._line2._mid,
      ],
      setEnterState: () => {
        diag._selector.selector.selectWithoutExecution('interior');
        if (parallel.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = parallel._line1.transform._dup();
          threeLines._line2.transform = parallel._line2.transform._dup();
        }
        if (opp.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = opp._line1.transform._dup();
          threeLines._line2.transform = opp._line2.transform._dup();
        }
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.line);
        // threeLines._line3.setColor(layout.colors.line);
        diag._unitsSelector.select(diag.units);
      },
      showOnly: [
        threeLines,
        threeLines._line1,
        threeLines._line1._end1,
        threeLines._line1._end2,
        threeLines._line1._mid,
        threeLines._line2,
        threeLines._line2._end1,
        threeLines._line2._end2,
        threeLines._line2._mid,
        threeLines._line3,
        threeLines._line3._end1,
        threeLines._line3._end2,
        threeLines._line3._mid,
      ],
      show: [
        diag._selector,
        diag._unitsSelector,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(threeLines._line1, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line2, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(threeLines);
        diag.moveToScenario(threeLines._line1, 'corresponding', time);
        diag.moveToScenario(threeLines._line2, 'corresponding', time);
        diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
      },
      setSteadyState: () => {
        diag.moveToScenario(threeLines._line1, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line2, 'corresponding', 0.001);
        diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        diag.moveToScenario(threeLines, null, 0.001);
        threeLines.toggleInteriorAngles();
        diag._unitsSelector.select(diag.units);
      },
    });
  }
}

export default Content;
