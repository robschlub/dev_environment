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
    const quiz = diag._quiz;

    this.addSection({
      title: 'Parallel Lines',
      setContent: centerH(`
        <p style="margin-top:3%">
          Move the |red_line| to be parallel with the |blue_line|.
        </p>
      `),
      modifiers: {
        red_line: click(quiz.pulseLine2, [quiz], colors.quizLine),
        blue_line: click(quiz.pulseLine1, [quiz], colors.line),
      },
      setEnterState: () => {
        quiz.setPosition(0, 0);
        quiz._line2.setColor(colors.quizLine);
        quiz.hasTouchableElements = true;
      },
      showOnly: [
        quiz,
      ],
      show: [
        quiz._line1,
        quiz._line2,
      ],
      transitionFromAny: (done) => {
        let time = Math.max(
          diag.getTimeToMoveToScenario(quiz._line1, layout.quiz.first.line1),
          diag.getTimeToMoveToScenario(quiz._line2, layout.quiz.first.line2),
        );
        time = time > 2 ? 2 : time;
        diag.moveToScenario(quiz._line1, layout.quiz.first.line1, time);
        diag.moveToScenario(quiz._line2, layout.quiz.first.line2, time, done);
      },
      setSteadyState: () => {
        diag.setScenario(quiz._line1, layout.quiz.first.line1);
        diag.setScenario(quiz._line2, layout.quiz.first.line2);
        quiz._check.show();
        quiz._check.vertices.element.onclick = quiz.checkAnswer.bind(quiz);
      },
    });
  }
}

export default Content;
