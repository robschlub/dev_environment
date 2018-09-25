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
    const tri = diag._triangle;
    const aaa = diag._aaa;
    const sas = diag._sas;
    const sss = diag._sss;
    const qr = diag._qr;
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
        tri._tri1.showAll();
        tri._tri2.showAll();
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
        tri._tri1.showAll();
        tri._tri2.showAll();
        tri._tri1.showDimensions(true);
        tri._tri2.showDimensions(true);
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
        tri._tri1.showAll();
        tri._tri2.showAll();
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

    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
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

    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    common = {
      setEnterState: () => {
        sas.setCornerScenarios('SASStart');
      },
      showOnly: [sas],
      show: [
        sas._corner1,
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
         How many triangles can be made with these constraints? There is only |one_line| that can be drawn that connects the two end points.
        </p>
      `,
      modifiers: {
        one_line: click(
          sas.growCorner, [sas, 2, 0, layout.corner.SAS.c2.side1, 1, false],
          colors.diagram.safe,
        ),
      },
    });

    common = {
      showOnly: [sas],
      show: [
        sas._corner1, sas._corner2,
      ],
    };
    this.addSection(common, {
      setContent: `
         <p>
         How many triangles can be made with these constraints? There is only |one_line| that can be drawn that connects the two end points.
        </p>
      `,
      modifiers: {
        one_line: click(
          sas.growCorner, [sas, 2, 0, layout.corner.SAS.c2.side1, 1, false],
          colors.diagram.safe,
        ),
      },
      setEnterState: () => {
        sas.setCornerScenarios('SASZero');
      },
      hide: [
        sas._corner2._angle,
      ],
      setSteadyState: () => {
        sas.growCorner(2, 0, layout.corner.SAS.c2.side1, 1, false);
      },
    });
    // common = {
    //   showOnly: [sas],
    //   show: [
    //     sas._corner1, sas._corner2,
    //   ],
    // };
    this.addSection(common, {
      setContent: `
        <p>
         Therefore, the remaining side can only have one |length| and |angle|. If it were a |different_length| or had a |different_angle|, it would not form a triangle. 
        </p>
      `,
      modifiers: {
        length: click(
          sas.growCorner, [sas, 2, null, 1.5, 0.5, false], colors.diagram.safe,
        ),
        angle: click(
          sas.rotateCorner2, [sas, Math.PI / 3, 0.5, false], colors.diagram.safe,
        ),
        different_length: click(
          sas.growCorner, [sas, 2, null, null, 0.5, false], colors.diagram.warning,
        ),
        different_angle: click(
          sas.rotateCorner2, [sas, null, 0.5, false], colors.diagram.warning,
        ),
      },
      setEnterState: () => {
        sas.setCornerScenarios('SAS');
      },
    });
    this.addSection({
      setContent: centerV(`
        <p>
         Therefore, triangles are congruent if they have two sides, and the angle formed by those two sides, the same.
        </p>
        <p>
          This case is often called the |Side-Angle-Side| case.
        </p> 
      `),
    });


    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    common = {
      setContent: '',
      modifiers: {},
      setEnterState: () => {
        sss.calcFutureLinePositions('SSSStart');
      },
      showOnly: [
        sss,
      ],
      show: [
        sss._line1, sss._line2, sss._line3,
      ],
      setSteadyState: () => {
        sss.resetDiagram();
        sss.setFuturePositions();
      },
      setLeaveState: () => {
        sss.resetDiagram();
      },
    };

    common.setContent = `
        <p>
          Next consider the case where only the |three side lengths| are known. How many triangles can be created with just this knowledge?
        </p>
      `;
    this.addSection(common, {
      title: 'Side-Side-Side',
    });


    common.setContent = `
        <p>
          We know a triangle is formed by connecting the three lines together, so we can start by connecting one line's ends to the other two lines.
        </p>
    `;
    this.addSection(common);
    this.addSection(common, {
      setEnterState: () => {
        sss.calcFutureLinePositions('SSSConnected');
      },
      transitionFromAny: (done) => {
        sss.moveToFuturePositions(1.5, done);
      },
    });


    common.setContent = `
        <p>
          Now, how can the end lines be rotated, to form a triangle, and can only one triangle be formed?
        </p>
    `;
    common.setEnterState = () => {
      sss.calcFutureLinePositions('SSSConnectedNoRot');
    };
    common.setSteadyState = () => {
      sss.resetDiagram();
      sss.setFuturePositions();
      sss._line2.setMovable(true);
      sss._line3.setMovable(true);
    };
    common.setLeaveState = () => {
      sss.resetDiagram();
      sss._line2.setMovable(false);
      sss._line3.setMovable(false);
    };
    this.addSection(common);


    common.setContent = `
      <p>
        One way to see this is to trace all the possible end locations of the |left| and |right| line.
      </p>
    `;
    common.modifiers = {
      left: click(sss.drawCircle, [sss, 2], colors.diagram.action),
      right: click(sss.drawCircle, [sss, 3], colors.diagram.action),
    };
    this.addSection(common);
    common.show = [...common.show, sss._circ2, sss._circ3];
    this.addSection(common);


    common.setContent = `
      <p>
        There are only |two| locations where the traces meet, and therefore two triangles are possible.
      </p>`;
    common.modifiers = {
      two: click(sss.moveLinesToIntersect, [sss, null], colors.intersect),
    };
    this.addSection(common);
    common.show = [...common.show, sss._intersectUp, sss._intersectDown];
    this.addSection(common);


    common.setContent = `
      <p>
        Now, you might also see that the horizontal line, and circles have |symmetry|.
      </p>
      `;
    common.modifiers = {
      symmetry: highlight(colors.diagram.action),
    };
    this.addSection(common);
    this.addSection(common, { show: [...common.show, sss._symmetry] });
    common.show = [sss._circ2, sss._circ3, sss._symmetry, sss._line1];
    this.addSection(common);
    common.modifiers = {
      symmetry: click(sss.pulseSymmetry, [sss], colors.diagram.action),
    };
    common.show = [...common.show, sss._circ2Shaddow, sss._circ3Shaddow];
    this.addSection(common, {
      transitionFromAny: (done) => {
        sss.pulseSymmetry(done);
      },
    });


    common.setContent = `
      <p>
        This means that the upper triangle is also |symmetric| with the lower triangle.
      </p>
    `;
    common.modifiers = { symmetric: highlight(colors.diagram.action) };
    this.addSection(common);
    common.show = [
      sss._circ2, sss._circ3, sss._symmetry, sss._triangle,
      sss._circ2Shaddow, sss._circ3Shaddow, sss._triangleShaddow,
    ];
    this.addSection(common);
    this.addSection(common, {
      modifiers: {
        symmetric: click(sss.pulseSymmetry, [sss], colors.diagram.action),
      },
      transitionFromAny: (done) => {
        sss.pulseSymmetry(done);
      },
    });

    common.setContent = `
      <p>
        Symmetric triangles have the same side lengths and angles, and are therefore |congruent|.
      </p>
    `;
    this.addSection(common);

    this.addSection({
      setContent: centerV(`
      <p>
        So for a fixed three side lengths, there is only one set of angles that can form the sides into a triangle.
      </p>
      <p>
        Therefore, when two triangles have the same side lengths, they will also have the same angles, and therefore be congruent.
      </p>
      <p>
        This method of testing for congruency, is often referred to as the |Side-Side-Side| method.
      </p>
      `),
    });


    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    common = {
      setContent: '',
      modifiers: {},
      setEnterState: () => {
        sas.setCornerScenarios('ASAStart');
      },
      showOnly: [
        sas, qr,
      ],
      show: [
        sas._corner1, sas._corner2,
      ],
    };

    common.setContent = `
      <p>
        The next case to consider is where one side and its adjacent angles are known.
      </p>
    `;
    this.addSection(common, {
      title: 'Angle-Side-Angle',
    });

    common.setContent = `
      <p>
        As the two angles are fixed, the only way to complete the triangle is to |extend| the sides till they meet.
      </p>
    `;
    this.addSection(common, {
      modifiers: { extend: highlight(colors.diagram.action) },
    });
    this.addSection(common, {
      modifiers: {
        extend: click(
          sas.growBothCorners, [
            sas, 0.5, layout.corner.SAS.c1.side2, 0.5,
            layout.corner.SAS.c2.side1,
          ], colors.diagram.action,
        ),
      },
      setSteadyState: () => {
        sas.growBothCorners(0.5, layout.corner.SAS.c1.side2, 0.5, layout.corner.SAS.c2.side1);
      },
    });

    common.setContent = `
      <p>
        Only |one_length| for each side will form the triangle. Different lengths of the |left| or |right| side will not result in a triangle shape. 
      </p>
    `;
    common.setEnterState = () => {
      sas.setCornerScenarios('ASA');
    };
    this.addSection(common, {
      modifiers: {
        one_length: click(
          sas.growBothCorners, [
            sas, null, layout.corner.SAS.c1.side2, null,
            layout.corner.SAS.c2.side1,
          ], colors.diagram.action,
        ),
        left: click(
          sas.growCorner, [
            sas, 1, null, null, 1, false, null, 2, 2.598,
          ], colors.diagram.action,
        ),
        right: click(
          sas.growCorner, [
            sas, 2, null, null, 1, false, null, 2, 1.5,
          ], colors.diagram.action,
        ),
      },
    });
    common.setContent = `
      <p>
        In addition, the remaining unknown angle can be calculated as a |triangles| angles always add up to 180º.
      </p>
    `;
    common.modifiers = {
      triangles: clickWord(
        'triangle\'s', 'id_triangles_angles',
        qr._tri.show, [qr._tri], colors.line,
      ),
    };
    this.addSection(common);
    common.show = [sas._corner1, sas._corner2, sas._corner3];
    this.addSection(common);

    this.addSection(common, {
      setContent: `
        <p>
          So for a |fixed side between two fixed angles|, there is only one set of side lengths and angles possible. 
        </p>
      `,
    });

    this.addSection({
      setContent: centerV(`
      <p>
        Therefore, when two triangles have a two angles and the side between them being equal, then they will be congruent.
      </p>
      <p>
        This method of testing for congruency, is often referred to as the |Angle-Side-Angle| method.
      </p>
      `),
    });

    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    /* ********************************************************************* */
    common = {
      setContent: '',
      modifiers: {},
      setEnterState: () => {
        sas.setCornerScenarios('AASStart');
      },
      showOnly: [
        sas, qr,
      ],
      show: [
        sas._corner1, sas._corner2,
      ],
      setSteadyState: () => {},
    };
    common.setContent = `
      <p>
        The next case is when two angles and a side not between them is known.
      </p>
    `;
    this.addSection(common, {
      title: 'Angle-Angle-Side',
    });

    common.setContent = `
      <p>
        First, we know the angles in |triangles| always add up to 180º. Therefore, we can calculate the third angle.
      </p>
      `;
    common.modifiers = {
      triangles: click(qr._tri.show, [qr._tri], colors.line),
    };
    this.addSection(common);
    common.show = [sas._corner1, sas._corner2, sas._corner3];
    this.addSection(common);

    common.setContent = `
      <p>
        We also know from the |Angle_Side_Angle| congruency test, that if we know two angles and the side between them, then there can only be one solution for the remaining side lengths.
      </p>
    `;
    common.modifiers = {
      Angle_Side_Angle: clickWord('Angle-Side-Angle', 'id_angle_side_angle', qr._asa.show, [qr._asa], colors.line),
    };
    this.addSection(common);
    common.setContent = `
      <p>
        We also know from the |Angle_Side_Angle| congruency test, that if we know two angles and the side between them, then there can only be one solution for the remaining side lengths.
      </p>
    `;
    this.addSection(common);
    // common.setContent = `
    //   <p>
    //     First, the angles need to be lined up as a side needs to connect them.
    //   </p>
    // `;
    // this.addSection(common);
    // common.setSteadyState = () => { sas.setCornerScenarios('AASAlign'); };
    // this.addSection(common, {
    //   setEnterState: () => {
    //     sas.futurePositions = [{
    //       element: sas._corner1,
    //       scenario: layout.corner.AASAlign.c1.scenario,
    //     }];
    //     sas._corner1.setTransformCallback = sas.updateCornerTextForRotation.bind(sas, sas._corner1);
    //   },
    //   transitionFromPrev: (done) => {
    //     sas.moveToFuturePositions(1.5, done);
    //   },
    // });

    // common.setContent = `
    //   <p>
    //     Now, for each unknown side length, is there more than one side length that can be used to make a triangle?
    //   </p>
    // `;
    // this.addSection(common);

    // common.setContent = `
    //   <p>
    //     Well, the left angle can have its side |extended| to intersect with the known side.
    //   </p>
    // `;
    // this.addSection(common, {
    //   modifiers: { extended: highlight(colors.diagram.action) },
    // });
    // this.addSection(common, {
    //   modifiers: {
    //     extended: click(sas.growC1S2ToC2S1, [sas], colors.diagram.action),
    //   },
    //   setEnterState: () => {
    //     sas.setCornerScenarios('AASAlign');
    //   },
    //   setSteadyState: () => {
    //     sas.growCorner(1, 0.5, sas.calcC1S2ToIntersectWithC2S1(), 1, false, null, 0.5);
    //   },
    // });
    // common.setContent = `
    //   <p>
    //     Now the left angle can be moved to |intersect| with the known side.
    //   </p>
    // `;
    // this.addSection(common, {
    //   modifiers: {
    //     intersect: click(sas.moveC1ToAASPosition, [sas, () => {}], colors.diagram.action),
    //   },
    //   setEnterState: () => { sas.setCornerScenarios('AASAlignJoin'); },
    //   setSteadyState: () => {
    //     sas.setCornerScenarios('AASAlignJoin');
    //     sas._corner1.isTouchable = true;
    //     sas._corner1.isMovable = true;
    //     sas._corner1.touchInBoundingRect = true;
    //     sas._corner1.setTransformCallback = sas.updateC1SideLength.bind(sas);
    //     sas._corner1.move.limitLine = layout.corner.AAS.c1.limitLine;
    //   },
    //   transitionToNext: (done) => {
    //     sas.moveC1ToAASPosition(done);
    //   },
    // });

    // common.setContent = `
    //   <p>
    //     And finally the final side is completed.
    //   </p>
    // `;
    // this.addSection(common, {
    //   setSteadyState: () => {
    //     sas.setCornerScenarios('AAS');
    //   },
    // });
    // this.addSection(common, {
    //   setSteadyState: () => {
    //     sas.setCornerScenarios('AASComplete');
    //   },
    // });
  }
}

export default Content;
