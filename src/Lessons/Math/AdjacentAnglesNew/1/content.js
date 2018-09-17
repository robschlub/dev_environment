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

    const commonAdjacent = {
      setEnterState: () => {
        adjacent.calculateFuturePositions('adjacent');
      },
      showOnly: () => {
        adjacent.show();
        adjacent._lines.show();
        adjacent._lines._line1.showAll();
        adjacent._lines._line2.showAll();
        adjacent._lines._line3.showAll();
        adjacent.showAngles([
          [adjacent._lines._angleA, 'a', colors.angleA],
          [adjacent._lines._angleB, 'b', colors.angleB],
        ]);
        adjacent._eqn.hideAll();
      },
      // hide: [
      //   adjacent._eqn,
      // ],
      transitionFromAny: (done) => {
        adjacent.moveToFuturePositions(null, done, 2);
      },
      setSteadyState: () => {
        adjacent.setFuturePositions();
        adjacent.showAngles([
          [adjacent._lines._angleA, 'a', colors.angleA],
          [adjacent._lines._angleB, 'b', colors.angleB],
        ]);
      },
    };
    this.addSection(commonAdjacent, {
      title: 'Adjacent Angles',
      setContent: `
        <p>
          |Adjacent_angles| are any angles that share a common vertex and edge.
        </p>
      `,
      modifiers: {
        Adjacent_angles: click(adjacent.goToRandomAdjacentAngle, [adjacent], colors.diagram.action),
      },
    });
    this.addSection(commonAdjacent, {
      setContent: `
        <p>
          The sum of |adjacent_angles|, is the |larger_angle|.
        </p>
      `,
      modifiers: {
        adjacent_angles: click(adjacent.goToRandomAdjacentAngle, [adjacent], colors.diagram.action),
        larger_angle: click(adjacent.pulseAngleC, [adjacent], colors.angleC),
      },
      setSteadyState: () => {
        commonAdjacent.setSteadyState();
        adjacent.showAngles([
          [adjacent._lines._angleC, 'c', colors.angleC],
        ], false);
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
