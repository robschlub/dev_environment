// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
// import {
//   click, highlight,
// } from '../../../../js/tools/htmlGenerator';
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
    const tri = diag._triangle;

    this.addSection({
      title: 'Quiz',
      setContent: `
        <p>
          Can you determine if the triangles are congruent based on the properities shown?
        </p>
      `,
      // setInfo: 'Touch the grey box to enter the angle',
      setEnterState: () => {
        diag.calcRandomTriangles();
      },
      showOnly: [tri,
        tri._tri1, tri._tri1._line,
        tri._tri1._point1, tri._tri1._point2, tri._tri1._point3,
        tri._tri2, tri._tri2._line,
        tri._tri2._point1, tri._tri2._point2, tri._tri2._point3,
        diag._answerBox,
      ],
      transitionFromAny: (done) => {
        diag.moveToFuturePositions(1, done);
      },
      setSteadyState: () => {
        diag.setFuturePositions();
        diag.showAnglesAndSides();
      },
    });
  }
}

export default Content;
