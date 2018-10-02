// @flow
import {
  LessonContent, interactiveItem,
} from '../../../../js/Lesson/LessonContent';
import {
  click, centerH,
} from '../../../../js/tools/htmlGenerator';
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
    const quizA1 = diag._quizA1;

    this.addSection({
      title: 'Related Angles 1',
      setContent: centerH(`
        <p style="margin-top:3%">
          Enter the unknown angle in degrees.
        </p>
      `),
      modifiers: {
        red_line: click(quizA1.pulseLine2, [quizA1], colors.quizLine),
        blue_line: click(quizA1.pulseLine1, [quizA1], colors.line),
      },
      setInfo: 'Touch the grey box to enter the angle',
      interactiveElements: [
        interactiveItem(quizA1._input, ''),
      ],
      setEnterState: () => {
        quizA1.setPosition(0, 0);
        quizA1.hasTouchableElements = true;
        quizA1.randomizeLines();
        quizA1._input.setValue('');
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
        quizA1._input.enable();
        quizA1._check.show();
      },
    });
  }
}

export default Content;
