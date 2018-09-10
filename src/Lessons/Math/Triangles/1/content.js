// @flow
import {
  LessonContent, click, centerV, highlight,
} from '../../../../js/Lesson/LessonContent';

import LessonDiagram from './diagram';
// import Definition from '../../../../LessonsCommon/tools/definition';
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
      title: 'Introduction',
      setContent: `
        <p>
          Make a triangle.
        </p>
      `,
      show: [
        tri,
      ],
      setSteadyState: () => {
        console.log(tri)
      },
    });
  }
}

export default Content;
