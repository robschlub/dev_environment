// @flow
import {
  LessonContent,
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
      setSteadyState: () => {
        diag.show();
        diag._eqn.showAll();
        diag.eqn.showForm('a');
      },
    });
  }
}

export default Content;
