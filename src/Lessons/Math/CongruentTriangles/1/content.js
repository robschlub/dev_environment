// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight,
} from '../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
import Definition from '../../../../LessonsCommon/tools/definition';
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
    const tri = diag._triangle;
    // const examples = diag._examples;
    // const custom = diag._custom;
    // const properties = diag._properties;
    // const totalAngle = diag._totalAngle;
    // const qr = diag._qr;
    // // const qr = this.diagram.elements;
    let common = {};

    this.addSection({
      title: 'Introduction',
      setContent: centerV(`
        <p>
          The word |congruent| is originally Latin and means |"agreeing, meeting together"|.
        </p>
        <p>
          In mathematics, two shapes are |congruent| if they have the |same size and shape|.
        </p>
        <p>
          Congruent shapes include those which are mirror images of each other.
        </p>
      `),
    });

    common = {
      modifiers: {
        side_lengths: click(tri.showLineLabels, [tri, null], colors.lineLabels),
        angles: click(tri.showAngleLabels, [tri, null], colors.angleLabels),
      },
      showOnly: [
        tri,
        tri._tri1,
        tri._tri1._line,
        tri._tri2,
        tri._tri2._line,
      ],
    };
    this.addSection(common, {
      setContent: `
        <p>
          For two triangles to be the same size and shape, the |angles| and |side_lengths| and  of each shape must be the same as the other.
        </p>
      `,
      setEnterState: () => {
        const lay = layout.triangles.congruent;
        tri.updateTriangle(tri._tri1, lay.points, lay.tri1.scenario);
        tri.updateTriangle(tri._tri2, lay.points, lay.tri2.scenario);
      },
    });
    this.addSection(common, {
      setContent: `
        <p>
          If they are rotated, their |angles| and |side_lengths| can still be the same as each other.
        </p>
      `,
      setEnterState: () => {
        tri.futurePositions = [
          { element: tri._tri1, scenario: layout.triangles.congruentRot.tri1.scenario },
          { element: tri._tri2, scenario: layout.triangles.congruentRot.tri2.scenario },
        ];
      },
      transitionFromAny: (done) => {
        tri.moveToFuturePositions(1.5, done);
      },
      setSteadyState: () => {
        const lay = layout.triangles.congruentRot;
        tri.updateTriangle(tri._tri1, lay.points, lay.tri1.scenario);
        tri.updateTriangle(tri._tri2, lay.points, lay.tri2.scenario);
      },
    });
  }
}

export default Content;
