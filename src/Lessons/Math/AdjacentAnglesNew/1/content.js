// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, centerV,
} from '../../../../js/tools/htmlGenerator';
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
    // this.overlayDiagram = new OverlayLessonDiagram(htmlId, layout);
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    const diag = this.diagram.elements;
    const adjacent = diag._adjacent;

    this.addSection({
      title: 'Introduction',
      setContent: `
        <p>
          A triangle is a shape formed by |three straight lines| connected at |three corners| (or angles). 
        </p>
      `,
      // ],
      setEnterState: () => {
        adjacent.calculateFuturePositions('adjacent');
      },
      show: [
        adjacent,
      ],
      setSteadyState: () => {
        adjacent.setFuturePositions();
        // console.log(diag, adjacent._tr1, layout.examples.tri1.position)
        // adjacent.setScenario(adjacent._tri1, layout.examples.tri1.position);
        // adjacent.setScenario(adjacent._tri2, layout.examples.tri2.position);
        // adjacent.setScenario(adjacent._tri3, layout.examples.tri3.position);
      },
    });
  }
}

export default Content;
