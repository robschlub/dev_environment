// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, highlight,
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
    const tri = diag._triangle;

    this.addSection({
      title: 'Summary',
      setContent: `
        <p>
          Find the unknown angle in the triangle.
        </p>
      `,
      // modifiers: {
      //   Triangle: click(tri.randomize, [tri], colors.line),
      // },
      // setInfo: [
      //   '<ul>',
      //   '<li>Drag the triangle corners or touch the |Triangle| text to change the triangle\'s shape.</li>',
      //   '</ul>',
      // ],
      // infoModifiers: {
      //   Triangle: highlight(colors.line),
      // },
      setEnterState: () => {
        tri._triangle.hasTouchableElements = true;
        tri._triangle.autoShowAngles = true;
        diag._input.setValue('');
        diag.randomizeFuturePositions();
      },
      show: [tri],
      hide: [
        tri._line1,
        tri._line2,
        tri._angleA,
        tri._angleB,
        tri._eqn,
      ],
      transitionFromAny: (done) => {
        tri.moveToFuturePositions(1, done);
      },
      setSteadyState: () => {
        tri.setFuturePositions();
        diag._input.enable();
        diag._check.show();
        diag.showAngles();
        console.log(diag)
      },
    });
  }
}

export default Content;
