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
    const quad = diag._quad;
    const qr = diag._qr;
    let common = {};

    this.addSection({
      title: 'Introduction',
      setContent: `
        <p>
          A |quadrilateral| is a shape with four straight sides and four angles.
        </p>
      `,
      show: [
        quad,
      ],
    });

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
