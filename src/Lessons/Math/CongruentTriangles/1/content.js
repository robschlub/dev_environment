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
    const aaa = diag._aaa;
    const sas = diag._sas;
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
      title: 'Three Angles',
      setContent: `
        <p>
          First consider the scenario where you know all three angles. Can triangles of different sizes be created that have the same angles?
        </p>
      `,
      showOnly: [
        aaa,
        aaa._tri,
        aaa._tri._line,
        aaa._corner1,
        aaa._corner2,
        aaa._corner3,
      ],
      show: [
        aaa._corner1._angle,
        aaa._corner2._angle,
        aaa._corner3._angle,
      ],
      setSteadyState: () => {
        aaa.setCornerScenarios('AAA');
        aaa._corner1.setTransformCallback = aaa.recalculateTriangle.bind(aaa, 1);
      },
    });
    this.addSection({
      setContent: `
        <p>
          Yes. You can |move| the bottom corners of the triangle to see the same angles can make triangles of different sizes.
        </p>
      `,
      modifiers: {
        move: click(aaa.changeTriangleSize, [aaa, null], colors.diagram.action),
      },
      show: [
        aaa,
      ],
      hide: [
        aaa._corner1._line,
        aaa._corner2._line,
        aaa._corner3._line,
        aaa._tri._dimension12,
        aaa._tri._dimension23,
        aaa._tri._dimension31,
      ],
      setSteadyState: () => {
        aaa.setCornerScenarios('AAA');
        aaa._corner1.setTransformCallback = aaa.recalculateTriangle.bind(aaa, 1);
        aaa._corner2.setTransformCallback = aaa.recalculateTriangle.bind(aaa, 2);
        aaa._corner1._touchPoint.isTouchable = true;
        aaa._corner1._touchPoint.isMovable = true;
        aaa._corner2._touchPoint.isTouchable = true;
        aaa._corner2._touchPoint.isMovable = true;
      },
      setLeaveState: () => {
        aaa._corner1._touchPoint.isTouchable = false;
        aaa._corner1._touchPoint.isMovable = false;
        aaa._corner2._touchPoint.isTouchable = false;
        aaa._corner2._touchPoint.isMovable = false;
      },
    });
    this.addSection({
      setContent: centerV(`
        <p>
          So triangles with the same angles, can have different side lengths.
        </p>
        <p>
          |Only knowing two triangles have the same angles, is not enough to know they are congruent.|
        </p>
      `),
    });
    common = {
      setEnterState: () => {
        sas.setCornerScenarios('SASStart');
      },
      show: [
        sas,
      ],
      hide: [
        sas._corner2,
      ],
    };
    this.addSection(common, {
      title: 'Side-Angle-Side',
      setContent: `
        <p>
          Now consider if you know |two side lengths| and the |angle between| those two sides.
        </p>
      `,
    });
    this.addSection(common, {
      setContent: `
        <p>
         How many triangles can be made with these constraints?
        </p>
      `,
    });
    this.addSection(common, {
      setContent: `
        <p>
         Well, there is only |one line| that can be drawn that connects the two end points.
        </p>
      `,
    });
    this.addSection(common, {
      setContent: `
        <p>
         Well, there is only |one_line| that can be drawn that connects the two end points.
        </p>
      `,
      modifiers: {
        one_line: click(
          sas.growCorner2, [sas, 0, layout.corner.SAS.c2.side1, 1, false],
          colors.diagram.action,
        ),
      },
      setEnterState: () => {
        sas.setCornerScenarios('SASZero');
      },
      hide: [
        sas._corner2._angle,
      ],
      setSteadyState: () => {
        sas.growCorner2(0, layout.corner.SAS.c2.side1, 1, false);
      },
    });
    this.addSection(common, {
      setContent: `
        <p>
         The side can only be one |length|. If the line were |shorter|, or |longer|, it would not be a triangle.
        </p>
      `,
      modifiers: {
        length: click(
          sas.growCorner2, [sas, null, 1.5, 1, false], colors.diagram.action,
        ),
        shorter: click(
          sas.growCorner2, [sas, null, 1, 1, false], colors.diagram.action,
        ),
        longer: click(
          sas.growCorner2, [sas, null, 2, 1, false], colors.diagram.action,
        ),
      },
      setEnterState: () => {
        sas.setCornerScenarios('SAS');
      },
      hide: [
        sas._corner2._angle,
      ],
    });
    common = {
      show: [
        sas,
      ],
    };
    this.addSection(common, {
      setContent: `
        <p>
         The side can only have one angle.
        </p>
      `,
      setEnterState: () => {
        if (this.comingFrom !== 'prev' && this.comingFrom !== 'next') {
          sas.setCornerScenarios('SAS');
        }
      },
      hide: [
        sas._corner2._angle,
      ],
      transitionFromAny: (done) => {
        if (sas._corner2.side1 !== 1.5) {
          sas.growCorner2(null, 1.5, 1, false, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        sas.setCornerScenarios('SAS');
      },
    });
    this.addSection(common, {
      setContent: `
        <p>
         The side can also only have |one angle|.
        </p>
      `,
      setEnterState: () => {
        if (this.comingFrom !== 'prev' || this.comingFrom !== 'next') {
          sas.setCornerScenarios('SAS');
        }
      },
      // hide: [
      //   sas._corner2._angle,
      // ],
      transitionFromAny: (done) => {
        if (sas._corner2.side1 !== 1.5) {
          sas.growCorner2(null, 1.5, 1, false, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        sas._corner2._angle.showAll();
        sas._corner2._angle.pulseScaleNow(1, 1.2);
      },
    });
    this.addSection(common, {
      setContent: `
        <p>
         If the line were at a |different| angle, it would not be a triangle.
        </p>
      `,
      setEnterState: () => {
        sas.setCornerScenarios('SAS');
      },
      // hide: [
      //   sas._corner2._angle,
      // ],
    });
    this.addSection(common, {
      setContent: `
        <p>
         If the line were at a |different| angle, it would not be a triangle.
        </p>
      `,
      modifiers: {
        different: click(
          sas.rotateCorner2, [sas, null, 1, false, null],
          colors.diagram.action,
        ),
      },
      setEnterState: () => {
        if (this.comingFrom !== 'prev' && this.comingFrom !== 'next') {
          sas.setCornerScenarios('SAS');
        }
      },
      transitionFromAny: (done) => {
        sas.rotateCorner2(null, 1, false, done);
      },
    });
    // this.addSection(common, {
    //   setContent: `
    //     <p>
    //      Well, there is only |one_line| that can be drawn that connects the two end points. It has only one length, and only one angle.
    //     </p>
    //   `,
    //   setModifiers: {
    //     one_line: click(
    //       sas.growCorner2,
    //       [sas.growCorner2, 0, layout.corner.SAS.c2.side1, 1.5, false],
    //       colors.action,
    //     ),
    //   },
    //   setEnterState: () => {
    //     sas.setCornerScenarios('SAS');
    //   },
    //   hide: [],
    //   setSteadyState: () => {
    //     sas.growCorner2(0, layout.corner.SAS.c2.side1, 1.5, false);
    //   },
    // });
  }
}

export default Content;
