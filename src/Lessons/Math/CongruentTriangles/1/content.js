// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  Point,
} from '../../../../js/diagram/tools/g2';
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
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    const diag = this.diagram.elements;
    const tri = diag._triangle;
    const sas = diag._sas;
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
      `),
    });

    common = {
      setContent: `
        <p>
          For two triangles to be the same size and shape, and therefore |congruent|, the |side_lengths| and |angles| and of each triangle must be the same as the other.
        </p>
      `,
      setEnterState: () => {},
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
      setEnterState: () => {
        const lay = layout.triangles.congruent;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
      },
    });
    this.addSection(common, {
      setEnterState: () => {
        const lay = layout.triangles.congruent;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
        tri.calcTriFuturePositions(scenario, lay.tri2.scenario);
      },
      transitionFromAny: (done) => {
        tri.moveToFuturePositions(1.5, done);
      },
      setSteadyState: () => {
        tri.setFuturePositions();
      },
    });

    common.setContent = `
        <p>
           If one triangle is |rotated|, the triangles are congruent as the |side_lengths| and |angles| are the same.
        </p>
      `;
    this.addSection(common, {
      setEnterState: () => {
        const lay = layout.triangles.congruentRot;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
      },
    });
    this.addSection(common, {
      setEnterState: () => {
        const lay = layout.triangles.congruentRot;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
        tri.calcTriFuturePositions(scenario, lay.tri2.scenario);
      },
      transitionFromAny: (done) => {
        tri.moveToFuturePositions(1.5, done);
      },
      setSteadyState: () => {
        tri.setFuturePositions();
      },
    });

    common.setContent = `
        <p>
          If one triangle is |flipped|, the triangles are congruent as the |side_lengths| and |angles| are the same.
        </p>
      `;
    this.addSection(common, {
      setEnterState: () => {
        const lay = layout.triangles.congruentFlip;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
      },
    });
    this.addSection(common, {
      setEnterState: () => {
        const lay = layout.triangles.congruentFlip;
        const { scenario } = lay.tri1;
        tri.setTriangleScenarios(lay.points, lay.points, scenario, scenario);
        tri.calcTriFuturePositions(scenario, lay.tri2.scenario);
      },
      transitionFromAny: (done) => {
        tri.moveToFuturePositions(1.5, done);
      },
      setSteadyState: () => {
        tri.setFuturePositions();
        tri._tri2.setTriangleCollectionScaleTo(new Point(1, 1));
      },
    });

    this.addSection({
      title: 'Determining Congruency',
      setContent: centerV(`
        <p>
          So |how| can you figure out if two triangles are congruent?
        </p>
        <p>
          One way is to measure all the angles and sides and see if they are equal.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          But sometimes, it is even easier. There are some combinations of just |three properties|, that when they are the same on both triangles can guarantee the triangles are congruent.
        </p>
        <p>
          We will look at different combinations of properties, and see how many triangles can be formed with those combinations. If just one can be formed, this will tell us that if two triangles share those same properties, then they must be congruent.
        </p>
      `),
    });
    this.addSection({
      title: 'sas',
      setContent: `
        <p>
          First consider the scenario where you know all three angles. Is there more than one size of triangle that can be made with these same angles?
        </p>
      `,
      showOnly: [
        sas,
        sas._tri,
        sas._tri._line,
        sas._corner1,
        sas._corner2,
        sas._corner3,
      ],
      show: [
        sas._corner1._angle,
        sas._corner2._angle,
        sas._corner3._angle,
      ],
      setSteadyState: () => {
        sas.setCornerScenarios('AAA');
        sas._corner1.setTransformCallback = sas.recalculateTriangle.bind(sas, 1);
      },
    });
    this.addSection({
      title: 'sas',
      setContent: `
        <p>
          You can move the bottom left corner of the triangle to see.
        </p>
      `,
      show: [
        sas,
      ],
      hide: [
        sas._corner1._line,
        sas._corner2._line,
        sas._corner3._line,
      ],
      setSteadyState: () => {
        sas.setCornerScenarios('AAA');
        sas._corner1.setTransformCallback = sas.recalculateTriangle.bind(sas, 1);
        sas._corner2.setTransformCallback = sas.recalculateTriangle.bind(sas, 2);
        sas._corner1._touchPoint.isTouchable = true;
        sas._corner1._touchPoint.isMovable = true;
        sas._corner2._touchPoint.isTouchable = true;
        sas._corner2._touchPoint.isMovable = true;
      },
      setLeaveState: () => {
        sas._corner1._touchPoint.isTouchable = false;
        sas._corner1._touchPoint.isMovable = false;
        sas._corner2._touchPoint.isTouchable = false;
        sas._corner2._touchPoint.isMovable = false;
      },
    });
  }
}

export default Content;
