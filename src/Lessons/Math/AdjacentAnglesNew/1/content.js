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
      hide: [
        adjacent._eqn,
      ],
      setSteadyState: () => {
        adjacent.setFuturePositions();
        adjacent.showAngles([
          [adjacent._lines._angleA, 'a', colors.angleA],
          [adjacent._lines._angleB, 'b', colors.angleB],
        ]);
      },
    });
    this.addSection({
      title: 'Introduction',
      setContent: `
        <p>
          Supplementary
        </p>
      `,
      // ],
      setEnterState: () => {
        adjacent.calculateFuturePositions('supplementary');
        diag._unitsSelector.select(diag.units);
        adjacent.angleType = 'supplementary';
      },
      show: [
        adjacent,
        diag._unitsSelector,
      ],
      setSteadyState: () => {
        adjacent.setFuturePositions();
        adjacent.showAngles([
          [adjacent._lines._angleA, 'a', colors.angleA],
          [adjacent._lines._angleB, 'b', colors.angleB],
        ]);
        adjacent.eqn.showForm('sup_add');
      },
    });
  }
}

export default Content;
