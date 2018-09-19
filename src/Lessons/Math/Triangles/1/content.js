// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight,
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
    const totalAngle = diag._totalAngle;
    const qr = diag._qr;
    // const qr = this.diagram.elements;
    let common = {};

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
      setContent: centerV(`
        <p>
          To find this relationship, we can use knowledge of |supplementary_angles| and |alternate_angles| when a line intersects parallel lines.
        </p>
      `),
      modifiers: {
        alternate_angles: click(qr._alternateAngles.show, [qr._alternateAngles], colors.line),
        supplementary_angles: click(qr._supplementary.show, [qr._supplementary], colors.line),
      },
      showOnly: [
        qr,
      ],
    });
    this.addSection({
      title: 'Total Angle',
      setContent: `
        <p>
          Take |any| triangle and for convenience orient it so one side is horizontal.
        </p>
      `,
      showOnly: [
        totalAngle,
      ],
      show: [
        totalAngle._triangle,
        totalAngle._angleC,
      ],
    });

    common = {
      setContent: `
        <p>
          Draw parallel lines that enclose the triangle and align with the bottom side of the sides
        </p>
      `,
      showOnly: [
        totalAngle,
      ],
      show: [
        totalAngle._triangle,
        totalAngle._angleC,
      ],
    };
    this.addSection(common, {
    });

    this.addSection(common, {
      show: [...common.show, totalAngle._line1, totalAngle._line2],
      transitionFromAny: (done) => {
        totalAngle._line1.grow(0, 1, true, null);
        totalAngle._line2.grow(0, 1, true, done);
      },
      skipWhenComingFromNext: true,
    });


    common = {
      setContent: `
        <p>
          In a system of one line intersecting two parallel lines, the |alternate_angles| are equal, so we can identify the alternate angle of |a|.
        </p>
      `,
      modifiers: {
        alternate_angles: click(qr._alternateAngles.show, [qr._alternateAngles], colors.line),
        a: click(totalAngle.pulseAlternateA, [totalAngle], colors.angleA),
      },
      setEnterState: () => {
        totalAngle._triangle._angle2.setColor(colors.diagram.disabled);
        totalAngle._angleC.setColor(colors.diagram.disabled);
      },
      showOnly: [
        qr,
        totalAngle,
      ],
      show: [
        totalAngle._triangle,
        totalAngle._line1,
        totalAngle._line2,
        totalAngle._angleC,
      ],
      setLeaveState: () => {
        totalAngle.resetColors();
      },
    };
    this.addSection(common, {
    });
    this.addSection(common, {
      show: [
        ...common.show,
        totalAngle._angleA,
      ],
      setSteadyState: () => {
        totalAngle.pulseAlternateA();
      },
    });


    common = {
      setContent: `
        <p>
          We can similarly identify the alternate angle of |b|.
        </p>
      `,
      modifiers: {
        alternate_angles: click(qr._alternateAngles.show, [qr._alternateAngles], colors.line),
        b: click(totalAngle.pulseAlternateB, [totalAngle], colors.angleB),
      },
      setEnterState: () => {
        totalAngle._triangle._angle1.setColor(colors.diagram.disabled);
        totalAngle._angleC.setColor(colors.diagram.disabled);
        totalAngle._angleA.setColor(colors.diagram.disabled);
      },
      showOnly: [
        qr,
        totalAngle,
      ],
      show: [
        totalAngle._triangle,
        totalAngle._line1,
        totalAngle._line2,
        totalAngle._angleC,
        totalAngle._angleA,
      ],
      setLeaveState: () => {
        totalAngle.resetColors();
      },
    };

    this.addSection(common, {
    });

    this.addSection(common, {
      show: [...common.show, totalAngle._angleB],
      setSteadyState: () => {
        totalAngle.pulseAlternateB();
      },
    });

    this.addSection({
      setContent: `
        <p>
          Around the triangle's top point, |a|, |b| and |c| form a straight angle and are therefore |supplementary_angles|.
        </p>
      `,
      modifiers: {
        supplementary_angles: click(qr._supplementary.show, [qr._supplementary], colors.line),
        b: click(totalAngle.pulseAlternateB, [totalAngle], colors.angleB),
        a: click(totalAngle.pulseAlternateA, [totalAngle], colors.angleA),
        c: click(totalAngle.pulseAlternateC, [totalAngle], colors.angleC),
      },
      setEnterState: () => {
        totalAngle._triangle._angle1.setColor(colors.diagram.disabled);
        totalAngle._triangle._angle2.setColor(colors.diagram.disabled);
      },
      showOnly: [
        qr,
        totalAngle,
        totalAngle._eqn,
      ],
      show: [
        totalAngle._triangle,
        totalAngle._line1,
        totalAngle._line2,
        totalAngle._angleC,
        totalAngle._angleA,
        totalAngle._angleB,
      ],
      setSteadyState: () => {
        totalAngle.eqn.showForm('base');
      },
      setLeaveState: () => {
        totalAngle.resetColors();
      },
    });

    this.addSection({
      setContent: `
        <p>
         Therefore, we know |a|, |b| and |c| are angles in the triangle and
        </p>

         <p style="margin-top:85%">
         Therefore, all the angles in a triangle add up to 180º.
        </p>
      `,
      modifiers: {
        supplementary_angles: click(qr._supplementary.show, [qr._supplementary], colors.line),
        b: highlight(colors.angleB),
        a: highlight(colors.angleA),
        c: highlight(colors.angleC),
      },
      setEnterState: () => {
        // totalAngle._triangle._angle1.setColor(colors.diagram.disabled);
        // totalAngle._triangle._angle2.setColor(colors.diagram.disabled);
      },
      showOnly: [
        qr,
        totalAngle,
      ],
      show: [
        totalAngle._triangle,
        // totalAngle._line1,
        // totalAngle._line2,
        totalAngle._angleC,
        // totalAngle._angleA,
        // totalAngle._angleB,
      ],
      setSteadyState: () => {
        totalAngle.eqn.showForm('base');
      },
      setLeaveState: () => {
        totalAngle.resetColors();
      },
    });
  }
}

export default Content;
