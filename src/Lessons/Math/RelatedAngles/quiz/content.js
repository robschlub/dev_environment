// @flow
import {
  LessonContent, click, centerH,
} from '../../../../js/Lesson/LessonContent';

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
    const quizP1 = diag._quizP1;
    const quizP2 = diag._quizP2;
    const quizA1 = diag._quizA1;

    this.addSection({
      title: 'Parallel Lines 1',
      setContent: centerH(`
        <p style="margin-top:3%">
          Move the |red_line| to be parallel with the |blue_line|.
        </p>
      `),
      modifiers: {
        red_line: click(quizP1.pulseLine2, [quizP1], colors.quizLine),
        blue_line: click(quizP1.pulseLine1, [quizP1], colors.line),
      },
      setEnterState: () => {
        quizP1.setPosition(0, 0);
        quizP1._line2.setColor(colors.quizLine);
        quizP1.hasTouchableElements = true;
      },
      showOnly: [
        quizP1,
      ],
      show: [
        quizP1._line1,
        quizP1._line2,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(quizP1._line1, layout.quiz.first.line1),
          diag.getTimeToMoveToScenario(quizP1._line2, layout.quiz.first.line2),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(quizP1._line1, layout.quiz.first.line1, time);
        diag.moveToScenario(quizP1._line2, layout.quiz.first.line2, time, done);
      },
      setSteadyState: () => {
        diag.setScenario(quizP1._line1, layout.quiz.first.line1);
        diag.setScenario(quizP1._line2, layout.quiz.first.line2);
        quizP1._check.show();
      },
    });

    this.addSection({
      title: 'Parallel Lines 2',
      setContent: centerH(`
        <p style="margin-top:3%">
          Select two parallel lines.
        </p>
      `),
      modifiers: {
        red_line: click(quizP1.pulseLine2, [quizP1], colors.quizLine),
        blue_line: click(quizP1.pulseLine1, [quizP1], colors.line),
      },
      setEnterState: () => {
        quizP2.setPosition(0, 0);
        quizP2.hasTouchableElements = true;
        quizP2.randomizeFuturePositions();
        quizP2.resetLines();
      },
      showOnly: [
        quizP2,
      ],
      show: [
        quizP2._line1,
        quizP2._line2,
        quizP2._line3,
        quizP2._line4,
        quizP2._line5,
        quizP2._line6,
      ],
      transitionFromAny: (done) => {
        quizP2.moveToFuturePositions(2, done);
      },
      setSteadyState: () => {
        quizP2.setFuturePositions();
        quizP2._check.show();
      },
    });

    this.addSection({
      title: 'Related Angles 1',
      setContent: centerH(`
        <p style="margin-top:3%">
          Enter the unknown angle in degrees.
        </p>
      `),
      modifiers: {
        red_line: click(quizA1.pulseLine2, [quizP1], colors.quizLine),
        blue_line: click(quizA1.pulseLine1, [quizP1], colors.line),
      },
      setEnterState: () => {
        quizA1.setPosition(0, 0);
        quizA1.hasTouchableElements = true;
        quizA1.randomizeLines();
      },
      showOnly: [
        quizA1,
        quizA1._lines,
      ],
      show: [
        quizA1._lines._line1,
        quizA1._lines._line2,
        quizA1._lines._line3,
      ],
      transitionFromAny: (done) => {
        quizA1.moveToFuturePositions(2, done);
      },
      setSteadyState: () => {
        quizA1.setFuturePositions();
        quizA1.showAngles();
        quizA1._check.show();
      },
    });
  }
}

export default Content;
