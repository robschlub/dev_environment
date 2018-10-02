// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  Point,
} from '../../../../js/diagram/tools/g2';
import {
  click, centerV, highlight, clickWord,
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
    const quad = diag._quad;
    const qr = diag._qr;
    let common = {};

    common = {
      setContent: '',
      showOnly: [
        quad, quad._quad1, quad._quad2, quad._quad3, qr,
      ],
    }
    this.addSection(common, {
      title: 'Quadrilateral',
      setContent: `
        <p>
          A |quadrilateral| is a shape with |four sides| and |four angles|.
        </p>
        ${new Definition('Quadrilateral', 'Latin', ['quadri', 'four', 'latus, later', 'side']).html('id_lesson__congruent_angles_definition')}
      `,
    });

    this.addSection(common, {
      setContent: `
        <p>
          The four side lengths and four angles are |properties| of a quadrilateral. 
        </p>
      `,
    });

    this.addSection(common, {
      title: 'Total Angle',
      setContent: `
        <p>
          Similar to a |triangle|, all the angles in a quadrilateral are related to each other and will |always add up to the same angle|.
        </p>
      `,
      modifiers: {
        triangle: click(qr._tri.show, [qr._tri], colors.diagram.action),
      },
    });

    common.setContent = `
      <p>
        We can show this by drawing a line between opposite corners of a quadrilateral.
      </p>
    `;
    this.addSection(common);

    common.showOnly = [qr];
    common.show = [quad];
    this.addSection(common);

    this.addSection(common, {
      setContent: `<p>
        A quadrilateral can always be split into two triangles.
      </p>`,
    })

    this.addSection(common, {
      setContent: `<p>
        As each |triangle|, has a total angle of 180º, the the total angle of a quadrilateral must be two times that, or |360º|.
      </p>`,
      modifiers: {
        triangle: click(qr._tri.show, [qr._tri], colors.diagram.action),
      },
    })

    this.addSection({
      setContent: centerV(`
        <p>
          So to summarize, a |quadrilateral| is a shape with |four sides| and |four angles|.
        </p>
        <p>
          A quadrilateral's angles will |always add up to 360º| (|2π radians|).
        </p>
      `),
    })

    // common = {
    //   setContent: `
    //     <p>
    //       For two triangles to be the same size and shape, and therefore |congruent|, the corresponding |side_lengths| and |angles| and of each triangle must be the same as the other.
    //     </p>
    //   `,
    //   setEnterState: () => {},
    //   modifiers: {
    //     side_lengths: click(tri.showLineLabels, [tri, null], colors.lineLabels),
    //     angles: click(tri.showAngleLabels, [tri, null], colors.angleLabels),
    //   },
    //   setInfo: [
    //     '<ul>',
    //     '<li>Touch the |side_lengths| and |angles| text toggle the side and angle annotations.</li>',
    //     '</ul>',
    //   ],
    //   infoModifiers: {
    //     side_lengths: highlight(colors.lineLabels),
    //     angles: highlight(colors.angleLabels),
    //   },
    //   showOnly: [
    //     tri,
    //     tri._tri1,
    //     tri._tri1._line,
    //     tri._tri2,
    //     tri._tri2._line,
    //   ],
    // };
    // this.addSection(common, {
    //   setEnterState: () => {
    //     const lay = layout.triangles.congruent;
    //     const { scenario } = lay.tri1;
    //     tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
    //   },
    // });
  }
}

export default Content;
