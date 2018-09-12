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
    const examples = diag._examples;
    const custom = diag._custom;

    this.addSection({
      title: 'Introduction',
      setContent: `
        <p>
          A triangle is a shape formed by |three straight lines| connected at |three corners| (or angles). 
        </p>
        <p>
          Hence the name |tri| (three) |angle| (corner).
        </p>
      `,
      showOnly: [
        diag,
      ],
      show: [
        examples,
      ],
      setSteadyState: () => {
        examples.setScenario(examples._tri1, layout.examples.tri1.position);
        examples.setScenario(examples._tri2, layout.examples.tri2.position);
        examples.setScenario(examples._tri3, layout.examples.tri3.position);
      },
    });

    this.addSection({
      setContent: `
        <p>
          Another way to make a triangle is to draw lines between any three points.
        </p>
      `,
      // showOnly: [
      //   tri,
      // ],
      show: [
        custom,
      ],
      setSteadyState: () => {
      },
    });
  }
}

export default Content;
