// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, centerV, unit,
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

    const common = {
      setEnterState: () => {
        adjacent.calculateFuturePositions(adjacent.angleType);
        diag._unitsSelector.select(diag.units);
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
        diag._unitsSelector.hide();
      },
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
    this.addSection(common, {
      title: 'Adjacent Angles',
      setContent: `
        <p>
          |Adjacent_angles| are any angles that share a common vertex and edge.
        </p>
      `,
      modifiers: {
        Adjacent_angles: click(adjacent.goToRandomAdjacentAngle, [adjacent], colors.diagram.action),
      },
      setEnterState: () => {
        adjacent.angleType = 'adjacent';
        common.setEnterState();
      },
      setSteadyState: () => {
        common.setSteadyState();
        adjacent._lines._line3.move.element = adjacent._lines._line3;
      },
    });
    this.addSection(common, {
      setContent: `
        <p>
          The sum of |adjacent_angles|, is the |larger_angle|. When you know any two angles, you can |calculate_the_other|.
        </p>
      `,
      modifiers: {
        adjacent_angles: click(adjacent.goToRandomAdjacentAngle, [adjacent], colors.diagram.action),
        larger_angle: click(adjacent.pulseAngleC, [adjacent], colors.angleC),
        calculate_the_other: click(
          adjacent.adjacentNextEquationform, [adjacent],
          colors.diagram.action,
        ),
      },
      interactiveElements: [
        adjacent._eqn._a,
        adjacent._eqn._b,
        adjacent._eqn._c,
      ],
      setEnterState: () => {
        adjacent.angleType = 'adjacentAdd';
        common.setEnterState();
      },
      setSteadyState: () => {
        common.setSteadyState();
        adjacent.showAngles([
          [adjacent._lines._angleC, 'c', colors.angleC],
        ], false);
        adjacent._eqn.show();
        adjacent.eqn.showForm('adj_add');
        adjacent._lines._line3.move.element = adjacent._lines._line3;
      },
    });

    this.addSection({
      setContent: centerV(`
        <p>
          This lesson examines adjacent angles that make up |common larger angles|. 
        </p>
        <p>
          Even though the adjacent angle's names are different for each case, the concept is always the same: |adjacent angles add up to the larger angle|.
        </p>
      `),
    });
    this.addSection(common, {
      setContent: `
        <p>
          |Complementary angles| add up to be a right angle (${unit('|90&deg;|', '|&pi;/2 radians|')}). 
        </p>
      `,
      setEnterState: () => {
        adjacent.angleType = 'complementary';
        common.setEnterState();
      },
      show: [
        diag._unitsSelector,
      ],
      setSteadyState: () => {
        common.setSteadyState();
        adjacent._eqn.show();
        adjacent.eqn.showForm('com_add');
        adjacent._lines._line3.move.element = adjacent._lines;
      },
    });

    // this.addSection(commonAdjacent, {
    //   setContent: `
    //     <p>
    //       A smaller angle is the difference between the larger angle and the other smaller angle.
    //     </p>
    //   `,
    //   modifiers: {
    //     adjacent_angles: click(adjacent.goToRandomAdjacentAngle, [adjacent], colors.diagram.action),
    //     larger_angle: click(adjacent.pulseAngleC, [adjacent], colors.angleC),
    //   },
    //   setEnterState: () => {
    //     commonAdjacent.setEnterState();
    //     adjacent.calculateFuturePositions('adjacentAdd');
    //   },
    //   setSteadyState: () => {
    //     commonAdjacent.setSteadyState();
    //     adjacent.showAngles([
    //       [adjacent._lines._angleC, 'c', colors.angleC],
    //     ], false);
    //     adjacent._eqn.show();
    //     adjacent.eqn.showForm('adj_add');
    //     adjacent._eqn.hasTouchableElements = false;
    //   },
    // });

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
