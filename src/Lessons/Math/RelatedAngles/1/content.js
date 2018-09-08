// @flow
import {
  LessonContent, click, highlight, centerV, unit, centerH,
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
    const opp = diag._opposite;
    const threeLines = diag._threeLines;

    this.addSection({
      title: 'Introduction',
      setContent: centerV(`
        <p>
          |Related angles| are angles that have the same value, but are in different locations. 
        </p>
        <p>
          This lesson will look at related angles in two scenarios:
          <ul>
            <li>when two lines intersect</li>
            <li>when a line intersects two parallel lines</li>
          </ul>
        </p>
      `),
    });
    this.addSection({
      setContent: `
      <p>
        When two lines intersect, |four_angles| are formed. If you know one angle, all others can be calculated.
      </p>
      `,
      modifiers: {
        four_angles: click(opp.toggleAngles, [opp], layout.colors.angleA),
      },
      interactiveElementsRemove: [
        opp._line1._mid,
        opp._line2._mid,
      ],
      setInfo: `
      <ul>
        <li>Drag the lines to rotate.</li>
        <li>Touch |four_angles| to toggle the angles.</li>
      </ul>
      `,
      infoModifiers: {
        four_angles: highlight(colors.angleA),
      },
      setEnterState: () => {
        opp._line1.setColor(colors.line);
        opp._line2.setColor(colors.line);
        opp._angleA.setColor(colors.angleA);
        opp._angleB.setColor(colors.angleA);
        opp._angleC.setColor(colors.angleA);
        opp._angleD.setColor(colors.angleA);
        opp.calculateFuturePositions();
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._line1,
        opp._line1._end1,
        opp._line1._end2,
        opp._line1._mid,
        opp._line2,
        opp._line2._end1,
        opp._line2._end2,
        opp._line2._mid,
      ],
      transitionFromAny: (done) => {
        opp.moveToFuturePositions(done);
      },
      setSteadyState: () => {
        diag.moveToScenario(opp._line1, 'opposite', 0.001);
        diag.moveToScenario(opp._line2, 'opposite', 0.001);
        opp.showAngles([opp._angleA], ['a']);
        opp.setFuturePositions();
      },
    });

    this.addSection({
      setContent: `
      <p>
        First consider angles |a| and |b|. These are supplementary angles, and therefore, they add up to ${unit('|180&deg;|', '|&pi; radians|')}.
      </p>
      `,
      modifiers: {
        four_angles: click(opp.toggleAngles, [opp], colors.angleA),
        a: highlight(colors.angleA),
        b: highlight(colors.angleB),
      },
      interactiveElementsRemove: [
        opp._line1._mid,
        opp._line2._mid,
      ],
      setInfo: `
      <ul>
        <li>Drag the lines to rotate.</li>
      </ul>
      `,
      infoModifiers: {
        four_angles: highlight(colors.angleA),
      },
      setEnterState: () => {
        opp._line1.setColor(colors.line);
        opp._line2.setColor(colors.line);
        opp._angleA.setColor(colors.angleA);
        opp._angleB.setColor(colors.angleB);
        opp.calculateFuturePositions();
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._angleB,
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
        diag._unitsSelector,
      ],
      transitionFromAny: (done) => {
        // let time = Math.max(
        //   diag.getTimeToMoveToScenario(opp._line1, 'opposite'),
        //   diag.getTimeToMoveToScenario(opp._line2, 'opposite'),
        // );
        // time = time > 2 ? 2 : time;
        // diag.moveToScenario(opp._line1, 'opposite', time);
        // diag.moveToScenario(opp._line2, 'opposite', time, done);
        opp.moveToFuturePositions(done);
      },
      setSteadyState: () => {
        opp.setFuturePositions();
        diag.moveToScenario(opp._line1, 'opposite', 0.001);
        diag.moveToScenario(opp._line2, 'opposite', 0.001);
        opp.showAngles([opp._angleA, opp._angleB], ['a', 'b']);
        diag._unitsSelector.select(diag.units);
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
        Opposite_Angles: click(opp.toggleOppositeAngles, [opp], colors.line),
      },
      setEnterState: () => {
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
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          This can be shown by considering the four angles separately, and
          recognizing the |supplementary_angles|.
        </p>
      `),
      modifiers: {
        supplementary_angles: click(opp.pulseSupplementaryAngle, [opp, null], colors.supplementary),
      },
      setEnterState: () => {
        opp._angleA.setColor(layout.colors.angleA);
        opp._angleB.setColor(layout.colors.angleB);
        opp._angleC.setColor(layout.colors.angleC);
        opp._angleD.setColor(layout.colors.angleD);
        opp._line1.setColor(layout.colors.line);
        opp._line2.setColor(layout.colors.line);
      },
      showOnly: [
        opp,
        opp._angleA,
        opp._angleB,
        opp._angleC,
        opp._angleD,
      ],
      show: [
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.showForm('a');
        opp._angleB.showForm('b');
        opp._angleC.showForm('c');
        opp._angleD.showForm('d');
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Line_1| is straight, therefore angles |a| and |b| are |supplementary|. This means they add up to ${unit('|180&deg;|', '|&pi; radians|')}.
        </p>
        <p class="lesson__diagram_text_p_width_40" style="margin-top:18%">
          Therefore:
        </p>
      `),
      modifiers: {
        supplementary: click(opp.pulseSupplementaryAngle, [opp, 0], colors.supplementary),
        a: highlight('lesson__related_angles__angleA'),
        b: highlight('lesson__related_angles__angleB'),
        Line_1: click(opp.pulseLine, [opp, 1], colors.line),
      },
      setEnterState: () => {
        // diag._selector.selector.selectWithoutExecution('opposite');
        opp._angleA.setColor(layout.colors.angleA);
        opp._angleB.setColor(layout.colors.angleB);
        opp._angleC.setColor(layout.colors.disabled);
        opp._angleD.setColor(layout.colors.disabled);
        opp._line1.setColor(layout.colors.line);
        opp._line2.setColor(layout.colors.disabled);
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
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.showForm('a');
        opp._angleB.showForm('b');
        opp._angleC.showForm('c');
        opp._angleD.showForm('d');
        diag._unitsSelector.select(diag.units);
        opp._equation1.eqn.showForm('a_plus_b');
        opp._equation2.eqn.showForm('b');
        opp._equation1.eqn.setPosition(layout.equation1.aPlusB);
        opp._equation2.eqn.setPosition(layout.equation2.b);
      },
    });

    this.addSection({
      setContent: `
        <p class="lesson__diagram_text_p_width_40" style="margin-top:20%">
          |Line_2| is straight, therefore angles |b| and |c| are |supplementary|. 
        </p>
      `,
      modifiers: {
        supplementary: click(opp.pulseSupplementaryAngle, [opp, 1], colors.supplementary),
        c: highlight('lesson__related_angles__angleC'),
        b: highlight('lesson__related_angles__angleB'),
        Line_2: click(opp.pulseLine, [opp, 2], colors.line),
      },
      setEnterState: () => {
        opp._angleA.setColor(layout.colors.disabled);
        opp._angleB.setColor(layout.colors.angleB);
        opp._angleC.setColor(layout.colors.angleC);
        opp._angleD.setColor(layout.colors.disabled);
        opp._line1.setColor(layout.colors.disabled);
        opp._line2.setColor(layout.colors.line);
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
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.showForm('a');
        opp._angleB.showForm('b_equals');
        opp._angleC.showForm('c');
        opp._angleD.showForm('d');
        opp._equation1.eqn.showForm('c');
        opp._equation2.eqn.showForm('c_equals_a_full');
        opp._equation3.eqn.showForm('c_equals_a');
        opp._equation1.eqn.setPosition(layout.equation1.bPlusC);
        opp._equation2.eqn.setPosition(layout.equation2.c);
        opp._equation3.eqn.setPosition(layout.equation3.cEqualsA);
      },
    });

    this.addSection({
      setContent: `
        <p class="lesson__diagram_text_p_width_40" style="margin-top:20%">
          Also, as |Line_2| is straight, angles |a| and |d| are |supplementary|. 
        </p>
      `,
      modifiers: {
        supplementary: click(opp.pulseSupplementaryAngle, [opp, 3], colors.supplementary),
        a: highlight('lesson__related_angles__angleA'),
        d: highlight('lesson__related_angles__angleD'),
        Line_2: click(opp.pulseLine, [opp, 2], colors.line),
      },
      setEnterState: () => {
        opp._angleA.setColor(layout.colors.angleA);
        opp._angleB.setColor(layout.colors.disabled);
        opp._angleC.setColor(layout.colors.disabled);
        opp._angleD.setColor(layout.colors.angleD);
        opp._line1.setColor(layout.colors.disabled);
        opp._line2.setColor(layout.colors.line);
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
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.showForm('a');
        opp._angleB.showForm('b_equals');
        opp._angleC.showForm('a');
        opp._angleD.showForm('d');
        opp._equation1.eqn.showForm('d');
        opp._equation2.eqn.showForm('d_equals_b');
        opp._equation1.eqn.setPosition(layout.equation1.bPlusC);
        opp._equation2.eqn.setPosition(layout.equation2.c);
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          And therefore, opposite angles are equal. 
        </p>
      `),
      modifiers: {
      },
      setEnterState: () => {
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
        opp._angleB,
        opp._angleC,
        opp._angleD,
      ],
      show: [
        opp._line1,
        opp._line2,
      ],
      setSteadyState: () => {
        opp._angleA._arc.show();
        opp._angleB._arc.show();
        opp._angleC._arc.show();
        opp._angleD._arc.show();
        opp._angleA.showForm('a');
        opp._angleB.showForm('b');
        opp._angleC.showForm('a');
        opp._angleD.showForm('b');
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
      setEnterState: () => {
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
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          When two lines intersect, an |angle| is formed.
        </p>
        <p class="lesson__diagram_text_p_width_40">
          This angle doesn't change when one line is |moved| without rotation.
        </p>
      `),
      modifiers: {
        angle: click(threeLines.toggleCorrespondingAngles, [threeLines, true], colors.angleA),
        moved: click(threeLines.translateLine1, [threeLines], colors.line),
      },
      setEnterState: () => {
        threeLines._angleA2.setColor(layout.colors.disabled);
        threeLines._angleB2.setColor(layout.colors.disabled);
        threeLines._angleC2.setColor(layout.colors.disabled);
        threeLines._angleD2.setColor(layout.colors.disabled);
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.disabled);
      },
      showOnly: [
        threeLines,
        threeLines._line1,
        threeLines._line1._end1,
        threeLines._line1._end2,
        threeLines._line1._mid,
        threeLines._line3,
        threeLines._line3._end1,
        threeLines._line3._end2,
        threeLines._line3._mid,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(threeLines._line1, 'center'),
          diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
          diag.getTimeToMoveToScenario(threeLines),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(threeLines);
        diag.moveToScenario(threeLines._line1, 'center', time);
        diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
      },
      setSteadyState: () => {
        threeLines._angleA1.show();
        threeLines._angleA1._arc.show();
        threeLines._angleA1.showForm('a');
        threeLines._angleA2.show();
        threeLines._angleA2._arc.show();
        threeLines._angleA2.showForm('a');

        diag.moveToScenario(threeLines._line1, 'center', 0.001);
        diag.moveToScenario(threeLines._line2, 'center', 0.001);
        diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        diag.moveToScenario(threeLines, null, 0.001);

        threeLines._line1.isMovable = true;
        threeLines._line1.move.maxTransform.updateTranslation(
          10,
          layout.line1.corresponding.position.y,
        );
        threeLines._line1.move.minTransform.updateTranslation(
          -10,
          layout.line2.corresponding.position.y,
        );
        threeLines.moveLine2ToLine1();
        threeLines._line2.show();
        threeLines._line2._end1.show();
        threeLines._line2._end2.show();
        threeLines._line2._mid.show();
        threeLines._line2.isTouchable = false;
      },
      setLeaveState: () => {
        threeLines._line1.isMovable = false;
        threeLines._line2.isTouchable = true;
      },
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Moving| a line without rotation means the line is |parallel| to its original.
        </p>
      `),
      modifiers: {
        Moving: click(threeLines.translateLine1, [threeLines, true], colors.line),
        parallel: click(threeLines.pulseParallel, [threeLines], colors.line),
      },
      setEnterState: () => {
        threeLines._angleA2.setColor(layout.colors.disabled);
        threeLines._angleB2.setColor(layout.colors.disabled);
        threeLines._angleC2.setColor(layout.colors.disabled);
        threeLines._angleD2.setColor(layout.colors.disabled);
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.disabled);
      },
      showOnly: () => {
        if (this.comingFrom !== 'prev') {
          this.diagram.elements.showOnly([
            threeLines,
            threeLines._line1,
            threeLines._line1._end1,
            threeLines._line1._end2,
            threeLines._line1._mid,
            threeLines._line3,
            threeLines._line3._end1,
            threeLines._line3._end2,
            threeLines._line3._mid,
          ]);
        }
      },
      transitionFromAny: (done) => {
        if (this.comingFrom !== 'prev') {
          let time = Math.max(
            diag.getTimeToMoveToScenario(threeLines._line1, 'center'),
            diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
            diag.getTimeToMoveToScenario(threeLines),
          );
          time = time > 2 ? 2 : time;
          diag.moveToScenario(threeLines);
          diag.moveToScenario(threeLines._line1, 'center', time);
          diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        if (this.comingFrom !== 'prev') {
          threeLines._angleA1.show();
          threeLines._angleA1._arc.show();
          threeLines._angleA1.showForm('a');
          threeLines._angleA2.show();
          threeLines._angleA2._arc.show();
          threeLines._angleA2.showForm('a');

          diag.moveToScenario(threeLines._line1, 'center', 0.001);
          diag.moveToScenario(threeLines._line2, 'center', 0.001);
          diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
          diag.moveToScenario(threeLines, null, 0.001);
          threeLines._line1.isMovable = true;
          threeLines._line1._end1.movementAllowed = 'translation';
          threeLines._line1._end2.movementAllowed = 'translation';
          threeLines._line1._mid.movementAllowed = 'translation';
          threeLines._line1.move.maxTransform.updateTranslation(
            10,
            layout.line1.corresponding.position.y,
          );
          threeLines._line1.move.minTransform.updateTranslation(
            -10,
            layout.line2.corresponding.position.y,
          );
          threeLines.moveLine2ToLine1();
        }
        threeLines._line2.show();
        threeLines._line2._end1.show();
        threeLines._line2._end2.show();
        threeLines._line2._mid.show();
        threeLines._line2.isTouchable = false;
        threeLines._line1.isMovable = true;
        threeLines._line2.isTouchable = false;
      },
      setLeaveState: () => {
        threeLines._line1.isMovable = false;
        threeLines._line2.isTouchable = true;
      },
    });

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          Therefore comparing the original and moved line, shows |corresponding_angles| are |equal|.
        </p>
      `),
      modifiers: {
        corresponding_angles: click(
          threeLines.toggleCorrespondingAngles, [threeLines],
          colors.angleA,
        ),
      },
      setEnterState: () => {
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
        threeLines.toggleCorrespondingAngles();
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
      setEnterState: () => {
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
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Corresponding_angles| are equal.
        </p>
        <p class="lesson__diagram_text_p_width_40" style="margin-top:6%">
          |Opposite_angles| are equal.
        </p>
        <p class="lesson__diagram_text_p_width_40" style="margin-top:6%">
          Therefore, |alternate_angles| are equal.
        </p>
      `),
      modifiers: {
        alternate_angles: click(
          threeLines.showAlternateAngles, [threeLines],
          colors.angleA,
        ),
        Corresponding_angles: click(
          threeLines.showCorrespondingAngles, [threeLines],
          colors.angleB,
        ),
        Opposite_angles: click(threeLines.showOppositeAngles, [threeLines], colors.angleC),
      },
      setEnterState: () => {
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
      transitionFromAny: (done) => {
        if (this.comingFrom !== 'prev') {
          let time = Math.max(
            diag.getTimeToMoveToScenario(threeLines._line1, 'corresponding'),
            diag.getTimeToMoveToScenario(threeLines._line2, 'corresponding'),
            diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
          );
          time = time > 2 ? 2 : time;
          diag.moveToScenario(threeLines._line1, 'corresponding', time);
          diag.moveToScenario(threeLines._line2, 'corresponding', time);
          diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        if (this.comingFrom !== 'prev') {
          diag.moveToScenario(threeLines._line1, 'corresponding', 0.001);
          diag.moveToScenario(threeLines._line2, 'corresponding', 0.001);
          diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        }
        threeLines.toggleAlternateAngles();
        threeLines.showCorrespondingAngles();
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
      setEnterState: () => {
        if (opp.isShown) {
          threeLines.transform.updateRotation(0);
          threeLines._line1.transform = opp._line1.transform._dup();
          threeLines._line2.transform = opp._line2.transform._dup();
        }
        threeLines._line1.setColor(layout.colors.line);
        threeLines._line2.setColor(layout.colors.line);
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

    this.addSection({
      setContent: centerV(`
        <p class="lesson__diagram_text_p_width_40">
          |Corresponding_angles| are equal.
        </p>
        <p class="lesson__diagram_text_p_width_40" style="margin-top:6%">
          |Supplementary_angles| add up to ${unit('|180&deg;|', '|&pi; radians|')}.
        </p>
        <p class="lesson__diagram_text_p_width_40" style="margin-top:6%">
          Therefore, |interior_angles| add up to ${unit('|180&deg;|', '|&pi; radians|')}.
        </p>
      `),
      modifiers: {
        interior_angles: click(
          threeLines.showInteriorAngles, [threeLines],
          colors.angleA,
        ),
        Corresponding_angles: click(
          threeLines.showCorrespondingAnglesInterior, [threeLines],
          colors.angleB,
        ),
        Supplementary_angles: click(
          threeLines.showSupplementary, [threeLines],
          colors.angleC,
        ),
      },
      setEnterState: () => {
        diag._unitsSelector.select(diag.units);
      },
      showOnly: () => {
        if (this.comingFrom !== 'prev') {
          this.diagram.elements.showOnly([threeLines]);
          this.diagram.elements.show([
            diag._unitsSelector,
            threeLines._line1,
            threeLines._line2,
            threeLines._line3,
          ]);
          this.diagram.elements.hide([
            threeLines._line1._label,
            threeLines._line2._label,
            threeLines._line3._label,
          ]);
        }
      },

      transitionFromAny: (done) => {
        if (this.comingFrom !== 'prev') {
          let time = Math.max(
            diag.getTimeToMoveToScenario(threeLines._line1, 'corresponding'),
            diag.getTimeToMoveToScenario(threeLines._line2, 'corresponding'),
            diag.getTimeToMoveToScenario(threeLines._line3, 'corresponding'),
          );
          time = time > 2 ? 2 : time;
          diag.moveToScenario(threeLines._line1, 'corresponding', time);
          diag.moveToScenario(threeLines._line2, 'corresponding', time);
          diag.moveToScenario(threeLines._line3, 'corresponding', time, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        if (this.comingFrom !== 'prev') {
          diag.moveToScenario(threeLines._line1, 'corresponding', 0.001);
          diag.moveToScenario(threeLines._line2, 'corresponding', 0.001);
          diag.moveToScenario(threeLines._line3, 'corresponding', 0.001);
        }
        threeLines.showCorrespondingAnglesInterior();
        diag._unitsSelector.select(diag.units);
      },
    });
  }
}

export default Content;
