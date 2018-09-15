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
    const examples = diag._examples;
    const custom = diag._custom;
    const properties = diag._properties;
    const qr = diag._qr;
    // const qr = this.diagram.elements;

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
      // showOnly: [
      //   diag,
      // ],
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
        <p>
          Another way to make a triangle is to draw lines between any |three_points|.
        </p>
      `,
      modifiers: {
        three_points: click(custom.newTriangle, [custom], colors.pointText),
      },
      show: [
        custom,
      ],
      setEnterState: () => {
        custom.calculateFuturePositions();
        custom._triangle._point1.setPosition(0.1, 0.1);
        custom._triangle._point1.setPosition(0.1, -0.1);
        custom._triangle._point1.setPosition(-0.1, 0.1);
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
          What properties does a triangle have? Well, its definition gives us some, |three_side_lengths|, and |three_angle_sizes|.
        </p>
      `,
      modifiers: {
        three_side_lengths: click(properties.growDimensions, [properties], colors.dimensions),
        three_angle_sizes: click(properties.pulseAngles, [properties], colors.angleText),
      },
      setEnterState: () => {
        if (this.comingFrom === 'prev') {
          const tri = custom._triangle;
          properties._triangle.updatePoints(tri.p1, tri.p2, tri.p3);
        }
        properties.calculateFuturePositions();
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
      transitionFromAny: (done) => {
        if (this.comingFrom === 'prev') {
          properties.moveToFuturePositions(2, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        properties.setFuturePositions();
        properties._triangle.showDimensions(false);
        properties._triangle.showAngles(false);
      },
    });

    this.addSection({
      setContent: centerV(`
        <p>
          Once properties are identified, the next question is |are they related?|
        </p>
        <p>
          If they are, then future analysis of the shape is simplified as you only need to know some properties to calculate the rest.
        </p>

      `),
    });

    this.addSection({
      setContent: centerV(`
        <p>
          In fact, a triangle's side lengths and angles |are all related|. If you know any three, you can calculate the other three!
        </p>
        <p>
          In this lesson we will focus on the |relationship between angles|. The relationship to sides requires knowledge of the sine function, which which is in a later lesson.
        </p>
      `),
    });
    this.addSection({
      title: 'asdf',
      setContent: centerV(`
        <p>
          To find this relationship, we need to have knowledge of |supplementary angles| and |adjacent_angles|.
        </p>
      `),
      modifiers: {
        adjacent_angles: click(qr._alternateAngles.show, [qr._alternateAngles], colors.line),
      },
      showOnly: [
        qr,
      ],
      // show: [
      //   qr,
      // ],
      setSteadyState: () => {
        // qr._alternateAngles.show();
      },
      setLeaveState: () => {
        // qr._alternateAngles.hideAll();
        // qr._alternateAngles.qrBox.toggle(false);
      },
    });
  }
}

export default Content;
