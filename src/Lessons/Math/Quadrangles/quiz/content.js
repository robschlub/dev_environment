// @flow
import {
  LessonContent, interactiveItem,
} from '../../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import details from '../details';

const layout = lessonLayout();
// const { colors } = layout;

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

    this.addSection({
      title: 'Quiz',
      setContent: `
        <p>
          Calculate the unknown angle in the quadrangle.
        </p>
      `,
      show: [
        diag._input, diag._quad,
      ],
      setEnterState: () => {
        diag.calculateFuturePositions();
      },
      setSteadyState: () => {
        diag.showCheck();
        diag.setFuturePositions();
        diag.updateAngles();
      },
    });
  }
}

export default Content;
