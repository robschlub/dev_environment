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
    const properties = diag._properties;

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
          Another way to make a triangle is to draw lines between any |three_points|.
        </p>
      `,
      modifiers: {
        three_points: click(custom.newTriangle, [custom], colors.point),
      },
      show: [
        custom,
      ],
      setEnterState: () => {
        custom.calculateFuturePositions();
        custom._p1.setPosition(0.1, 0.1);
        custom._p2.setPosition(0.1, -0.1);
        custom._p3.setPosition(-0.1, 0.1);
      },
      transitionFromAny: (done) => {
        custom.moveToFuturePositions(1.5, done);
      },
      setSteadyState: () => {
        custom.setFuturePositions();
      },
    });

    this.addSection({
      title: 'Properties',
      setContent: `
        <p>
          What properties does a triangle have? Well, its definition gives us the first properties of three |side_lengths|, and three |angle_sizes|.
        </p>
      `,
      modifiers: {
        side_lengths: click(properties.growDimensions, [properties], colors.dimensions),
        angle_sizes: click(properties.pulseAngles, [properties], colors.angleText),
      },
      setEnterState: () => {
        if (this.comingFrom === 'prev') {
          properties._triangle.updatePoints(
            custom._triangle.p1,
            custom._triangle.p2,
            custom._triangle.p3,
          );
        }
        properties.calculateFuturePositions();
        console.log(properties.futurePositions)
      },
      showOnly: [
        diag,
        properties,
        properties._triangle,
        properties._triangle._line,
        properties._triangle._point1,
        properties._triangle._point2,
        properties._triangle._point3,
      ],
      // show: [
      //   properties,
      // ],
      transitionFromAny: (done) => {
        if (this.comingFrom === 'prev') {
          properties.moveToFuturePositions(2, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        properties._triangle.showDimensions(false);
        properties.setFuturePositions();
      },
    });
  }
}

export default Content;
