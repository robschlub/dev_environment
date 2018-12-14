// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight, clickWord,
} from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
import Definition from '../../../../LessonsCommon/tools/definition';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import imgLinkGrey from '../tile-grey.png';
import details from '../details';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
    this.iconLinkGrey = imgLinkGrey;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    const diag = this.diagram.elements;
    const iso = diag._iso;
    const qr = diag._qr;
    const iTri = iso._tri;
    const left = iso._left;
    const right = iso._right;
    const rec = iso._rect;
    const equil = diag._equil;

    let common = {
      setContent: '',
      setInfo: '',
      modifiers: {},
      infoModifiers: {},
      setEnterState: () => {},
      showOnly: [],
      show: [],
      hide: [],
      setSteadyState: () => {},
      setLeaveState: () => {},
    };

    this.addSection({
      title: 'Introduction',
      setContent: centerV([
        'There are several |types of triangle| commonly found in many applications.',
        'Being able to |identify| these types of triangle can make |understanding| a problem |quicker and easier|.',
      ]),
      // setSteadyState: () => {
        // iso.show();
        // equil.showAll();
        // iso._tri.showAll();
        // iso._rect.showAll();
        // iso._rect._tri1._angle2.update();
        // iso._rect._tri2._angle2.update();
        // iso._isoEqn.showAll();
        // iso.eqns.isoEqn.showForm('3');
        // iso._testEqn.setPosition(-1, 1);
        // iso._testEqn.showForm('1');
        // iso._testNav.setPosition(-1, 1);
        // iso._testNav.showForm('0');
      // },
    });

    this.addSection({
      setContent: centerV([
        'Triangles are commonly grouped by either their |side lengths| or |angles|.',
      ]),
    });


    common = {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common, {
      title: 'Equal Sides',
      setContent: [
        'A triangle with |two_sides| of |equal length| is called an |Isosceles| triangle.',
        `${new Definition('Isosceles', 'Greek', ['isoskeles', '', 'isos', 'equal', 'skelos', 'leg']).html('id_lesson__isosceles_definition')}`,
      ],
      modifiers: {
        two_sides: click(iso.pulseEqualSides, [iso], colors.equalLength),
        // equal_length: click(iso.pulseEqualSides, [iso], colors.equalLength),
      },
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
    });


    this.addSection(common, {
      setContent: 'When |two sides| of a triangle are |equal|, the triangle\'s |angles| have a special relationship.',
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    });
   

    common = {
      setContent: 'We can show this by |drawing_a_line| from the |point| between the equal sides to the |middle| of the opposite side.',
      modifiers: {
        drawing_a_line: highlight(colors.lines),
        point: click(iso.pulseTopPoint, [iso], colors.points),
        middle: click(iso.pulseMidPoint, [iso], colors.points),
      },
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common);
    common.modifiers = {
      drawing_a_line: click(iso.growSplit, [iso], colors.lines),
      point: click(iso.pulseTopPoint, [iso], colors.points),
      middle: click(iso.pulseMidPoint, [iso], colors.points),
    };
    this.addSection(common, {
      show: [iTri._side12, iTri._side23, iTri._side31, iso._split],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
        iso.growSplit();
      },
    });

    common = {
      setContent: 'This line will have some length, which we can label |C|.',
      showOnly: [
        iso, iTri, iTri._line, left,
        // left, left._line, right, right._line,
      ],
      show: [iTri._side12, iTri._side23, iTri._side31, iso._split],
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.center);
        iso.setScenario(right, layout.iso.right.scenario.center);
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common);
    this.addSection(common, {
      show: [iTri._side12, iTri._side23, iTri._side31, iso._split, left._side23],
    });

    this.addSection(common, {
      setContent: 'This line splits the triangle into two.',
      showOnly: [
        iso, qr,
        left, left._line,
        right, right._line,
      ],
      show: [
        left._side31, right._side23, left._side23,
        // left._side12, left._side31, left._side23,
        // right._side12, right._side23,
      ],
      transitionFromPrev: (done) => {
        iso.moveToScenario(left, layout.iso.left.scenario.left, 1, done);
        iso.moveToScenario(right, layout.iso.right.scenario.right, 1);
      },
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
        right._side12.showAll();
        left._side12.showAll();
        right._side31.showAll();
      },
    });


    common = {
      setContent: 'The |Side_Side_Side| triangle congruency test says that if two triangles share the same side lengths, then their |angles| are also |equal|.',
      modifiers: {
        Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action),
      },
      showOnly: [
        iso, qr,
        left, left._line,
        right, right._line,
      ],
      show: [
        left._side12, left._side31, left._side23,
        right._side12, right._side23, right._side31,
      ],
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
      },
    };
    this.addSection(common);
    common.setContent = 'These two triangles do |share the same side lengths|, and therefore their |angles are also the same|.';
    this.addSection(common);
    common.show = [
      left, right,
    ];
    this.addSection(common, {
      show: [iso._left, iso._right],
      transitionFromPrev: (done) => {
        left._angle1.pulseScaleNow(1, 1.5);
        left._angle2.pulseScaleNow(1, 1.5);
        left._angle3.pulseScaleNow(1, 1.5);
        right._angle1.pulseScaleNow(1, 1.5);
        right._angle2.pulseScaleNow(1, 1.5);
        right._angle3.pulseScaleNow(1, 1.5);
        done();
      },
      setSteadState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
      },
    });

    common = {
      setContent: 'Angles |b| and |c|, and side |C_| were not part of the original isosceles triangles, so we can remove them.',
      modifiers: {
        b: highlight(colors.angles),
        c: highlight(colors.angles),
        C_: highlight(colors.lines),
      },
      showOnly: [iso, qr],
      show: [left, right],
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
      },
    };
    this.addSection(common);
    common.showOnly = [
      iso, qr,
      left, left._line,
      right, right._line,
    ];
    common.show = [
      left._angle1, left._side31, left._side12,
      right._angle2, right._side23, right._side12,
    ];
    this.addSection(common);
    common.setContent = 'Now we can |join| the two triangles to re-form the |isoceles triangle|.';
    this.addSection(common, {
      transitionFromPrev: (done) => {
        iso.moveToScenario(left, layout.iso.left.scenario.center, 1, done);
        iso.moveToScenario(right, layout.iso.right.scenario.center, 1);
      },
      setSteadyState: () => {
        iso.setScenario(iso._left, layout.iso.left.scenario.center);
        iso.setScenario(iso._right, layout.iso.right.scenario.center);
        iTri.show();
        iTri._line.show();
        iso._left._line.hide();
        iso._right._line.hide();
        iso._split.showAll();
      },
    });
    common.showOnly = [iso, iTri, iTri._line, qr];
    common.show = [
      iTri._angle1, iTri._angle2,
      iTri._side12, iTri._side23, iTri._side31,
    ];
    common.setSteadyState = () => {
      iso.setScenario(left, layout.iso.left.scenario.center);
      iso.setScenario(right, layout.iso.right.scenario.center);
      iso.setScenario(iTri, layout.iso.scenario.center);
    };
    this.addSection(common);
    this.addSection(common, {
      setContent: 'And so we can see, when a triangle has two equal |sides|, it also has two equal |angles|.',
      modifiers: {
        sides: click(iso.pulseEqualSides, [iso], colors.equalLength),
        angles: click(iso.pulseEqualAngles, [iso], colors.angles),
      },
    });

    common.showOnly = [iso, iTri, iTri._line, qr];
    common.show = [
      iTri._angle1, iTri._angle2,
      iTri._side12, iTri._side23, iTri._side31,
    ];
    common.setSteadyState = () => {
      iso.setScenario(left, layout.iso.left.scenario.center);
      iso.setScenario(right, layout.iso.right.scenario.center);
      iso.setScenario(iTri, layout.iso.scenario.center);
    };

    common = {
      setContent: 'However, if we |only know| a triangle has two |equal_angles|, can we also show it has two equal sides?',
      modifiers: {
        equal_angles: click(iso.pulseEqualAngles, [iso], colors.angles),
        rectangle: click(qr._rect.show, [qr._rect], colors.construction),
        right_angles: highlight(colors.angles),
        right_angles_: click(iso.pulseRectRightAngles, [iso], colors.angles),
        Alternate_Angles: click(qr._alt.show, [qr._alt], colors.diagram.action),
        Angle_Angle_Side: click(qr._aas.show, [qr._aas], colors.diagram.action),
        two_angles: click(iso.pulseEqualAngles, [iso], colors.angles),
        two_sides: click(iso.pulseEqualSides, [iso], colors.equalLength),
        triangles_: click(iso.pulseRectTriangles, [iso], colors.construction),
        side_: click(iso.pulseRectHeight, [iso], colors.lines),
        two_angles_: click(iso.pulseRectAngles, [iso], colors.angles),
        angles: highlight(colors.angles),
      },
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._angle1, iTri._angle2],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common, {
      title: 'Equal Angles',
      transitionFromNext: (done) => {
        iso.moveToScenario(iTri, layout.iso.scenario.center, 1, done);
      },
    });

    // common.setContent = 'We can start by |labeling| the side between the equal angles.';
    // this.addSection(common);
    // common.show = [iTri._angle1, iTri._angle2, iTri._side12];
    // this.addSection(common, {
    //   transitionFromPrev: (done) => {
    //     iTri._side12._label.pulseScaleNow(1, 2);
    //     done();
    //   },
    // });

    common.setContent = 'Start by drawing a |rectangle| around the triangle.';
    // common.modifiers = {
    //   rectangle: click(qr._rect.show, [qr._rect], colors.construction),
    // };
    common.showOnly = [iso, iTri, iTri._line, rec, rec._tri1, rec._tri2, qr];
    this.addSection(common);
    common.show = [
      iTri._angle1, iTri._angle2,
      rec._tri1._line, rec._tri2._line,
    ];
    this.addSection(common);

    common.setContent = 'The |vertical sides| of the |rectangle| are the same as the |height| of the triangle, so we can label them.';
    this.addSection(common);
    common.show = [
      iTri._angle1, iTri._angle2,
      rec._tri1._line, rec._tri2._line, rec._tri1._side12, rec._tri2._side12,
    ];
    this.addSection(common);


    common.setContent = 'The |angles| of the |rectangle| are all |right_angles| and so we can label them.';
    this.addSection(common);
    common.setContent = 'The |angles| of the |rectangle| are all |right_angles_| and so we can label them.';
    common.show = [
      iTri._angle1, iTri._angle2,
      rec._tri1._line, rec._tri2._line, rec._tri1._side12, rec._tri2._side12,
      rec._tri1._angle2, rec._tri2._angle2,
    ];
    this.addSection(common);

    common.setContent = 'As the sides of |rectangle| are parallel, we can use |Alternate_Angles| to find two top angles.';
    this.addSection(common);
    common.show = [...common.show, rec._tri1._angle1];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        rec._tri1._angle1.pulseScaleNow(1, 1.5);
        iTri._angle1.pulseScaleNow(1, 1.5);
        done();
      },
    });
    common.show = [...common.show, rec._tri2._angle1];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        rec._tri2._angle1.pulseScaleNow(1, 1.5);
        iTri._angle2.pulseScaleNow(1, 1.5);
        done();
      },
    });

    common.setContent = 'Let\'s |simplify| the diagram to consider just the two outside triangles.';
    this.addSection(common);
    common.showOnly = [iso, rec, rec._tri1, rec._tri2, qr];
    common.show = [
      rec._tri1._line, rec._tri2._line, rec._tri1._side12, rec._tri2._side12,
      rec._tri1._angle2, rec._tri2._angle2,
      rec._tri1._angle1, rec._tri2._angle1,
      rec._tri1._closeLine, rec._tri2._closeLine,
    ];
    this.addSection(common);
    common.setContent = 'We can see the triangles have the same |two_angles_| and |side_|.';
    this.addSection(common);
    common.setContent = 'The |Angle_Angle_Side| triangle congruency test can therefore be used to say that these two |triangles_| are the |same|.';
    this.addSection(common);
    common.setContent = 'As these |triangles_| are the |same|, then their |sides| are also |equal|.';
    this.addSection(common);
    common.show = [
      rec._tri1._line, rec._tri2._line, rec._tri1._side12, rec._tri2._side12,
      rec._tri1._angle2, rec._tri2._angle2,
      rec._tri1._angle1, rec._tri2._angle1,
      rec._tri1._closeLine, rec._tri2._closeLine,
      rec._tri1._side31, rec._tri2._side31,
    ];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        rec._tri1._side31._label.pulseScaleNow(1, 1.5);
        rec._tri2._side31._label.pulseScaleNow(1, 1.5);
        done();
      },
    });

    common.setContent = 'Let\'s show the |original triangle|, and remove the rectangle.';
    this.addSection(common);
    common.showOnly = [iso, iTri, iTri._line, rec, rec._tri1, rec._tri2, qr];
    common.show = [
      iTri._angle1, iTri._angle2, iTri._side23, iTri._side31,
      rec._tri1._line, rec._tri2._line, rec._tri1._side12, rec._tri2._side12,
      rec._tri1._angle2, rec._tri2._angle2,
      rec._tri1._angle1, rec._tri2._angle1,
    ];
    this.addSection(common);
    common.show = [
      iTri._angle1, iTri._angle2, iTri._side23, iTri._side31,
    ];
    this.addSection(common);

    common.setContent = 'So, if a triangle has |two_angles| that are the |same|, then the |two_sides| not between the angles must also be the same';
    this.addSection(common);

    this.addSection({
      setContent: centerV([
        'If you know a triangle has |two_equal_sides|, then you know it is an |isosceles triangle| and also has |two_equal_angles|.',
        'Similarly, if you know a triangle has |two_equal_angles|, then you know it also has |two_equal_sides| and is an |isosceles triangle|.',
      ]),
      modifiers: {
        two_equal_sides: highlight(colors.equalLength),
        two_equal_angles: highlight(colors.angles),
      },
    });

    this.addSection({
      setContent: centerV([
        'We can now use the knowledge that |two angles are the same| to consider the relationship between all the angles in an |isosceles| triangle.',
      ]),
    });

    common.setSteadyState = () => {
      iso.setScenario(iTri, layout.iso.scenario.bottom);
    };
    this.addSection(common, {
      title: 'Angle Relationships',
      setContent: [
        'We know |angles| in a triangle are related: their |sum| always equals |_180|. Therefore to calculate |all| angles, |two must be known|.',
      ],
      modifiers: {
        _180: clickWord(
          '180º', 'id_important_triangles_sum1',
          qr._tri.show, [qr._tri], colors.diagram.action,
        ),
        angles: highlight(colors.angles),
      },
      transitionFromPrev: (done) => {
        iso.moveToScenario(iTri, layout.iso.scenario.bottom, 1, done);
      },
    });

    this.addSection(common, {
      setContent: 'But, if we |also know that two angles are equal|, then actually we only need to know |one angle| to calculate all three.',
    });

    common = {
      setContent: 'We start by labelling the |third angle| as |b| and adding all the angles to |_180|.',
      modifiers: {
        _180: clickWord(
          '180º', 'id_important_triangles_sum1',
          qr._tri.show, [qr._tri], colors.diagram.action,
        ),
        b: highlight(colors.angles),
        a: highlight(colors.angles),
        rearrange: click(iso._eqnANav.clickNext, [iso._eqnANav], colors.diagram.action),
      },
      showOnly: [iso, iTri, iTri._line, qr],
      show: [
        iTri._angle1, iTri._angle2, iTri._angle3,
        iTri._side23, iTri._side31,
      ],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
      },
    };
    this.addSection(common, {
      hide: [iTri._angle3],
    });
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso.pulseAngle3();
        iso._eqnANav.showForm('0');
        iso._eqnAEqn.isTouchable = false;
      },
    });
    common.setContent = 'We can now |rearrange| for either |a| or |b|. We will start by rearranging for |b|.';
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso._eqnANav.showForm('0');
        iso._eqnAEqn.isTouchable = true;
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso._eqnANav.showForm('5');
      },
    });

    common = {
      setContent: 'Similarly, if we know |a| we can |rearrange| to find |b|.',
      modifiers: {
        b: highlight(colors.angles),
        a: highlight(colors.angles),
        rearrange: click(iso._eqnANav.clickNext, [iso._eqnBNav], colors.diagram.action),
      },
      showOnly: [iso, iTri, iTri._line, qr],
      show: [
        iTri._angle1, iTri._angle2, iTri._angle3,
        iTri._side23, iTri._side31,
      ],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
      },
    };
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso._eqnBNav.showForm('0');
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso._eqnBNav.showForm('9');
      },
    });

    this.addSection({
      setContent: centerV([
        'And so we have found that only |one angle| is needed in an |isosceles triangle| to |calculate all three|.',
      ]),
    });


    // ***************************************************************
    // ***************************************************************
    // ***************************************************************
    // ***************************************************************
    // ***************************************************************
    // ***************************************************************
    common = {
      setContent: '',
      showOnly: [equil, equil._tri],
      show: [
        equil._tri._line,
        // equil._tri._angle1, equil._tri._angle2, equil._tri._angle3,
        equil._tri._side12, equil._tri._side23, equil._tri._side31,
      ],
      setSteadyState: () => {
        equil.setScenario(equil._tri, layout.equil.scenario.center);
      },
    };
    this.addSection(common, {
      title: 'Equilateral',
      setContent: [
        'A triangle that has all |three sides| the |same length| is called an |equilateral| triangle.',
        `${new Definition('Equilateral', 'Latin', ['aequilateralis', '', 'aequi', 'equal', 'lateralis', 'side']).html('id_lesson__eqiuilateral_definition')}`,
      ],
    });

    common.setContent = 'An |equilateral| triangle is a special case of an |isosceles| triangle.';
    this.addSection(common);

    common.setContent = 'We know for an isosceles triangle that the two angles not between the two equal sides are equal.';
    this.addSection(common);

    this.addSection({
      
      setContent: '|test|',
      modifiers: {
        test: click(equil.toggleIsoOrientation, [equil, null], colors.diagram.action),
      },
      setSteadyState: () => {
        equil.showAll();
      },
    });
    // eslint-disable-next-line
    // common.setContent = 'If instead the line is drawn from a |different| triangle point, this same procedure can be used to show the |third angle| is the |same| as the other two.';
    // common.modifiers = {
    //   different: click(iso.toggleSplitLines, [iso, null], colors.diagram.action),
    // };

    // this.addSection(common);
    // common.show = [
    //   iso._tri._angle1, iso._tri._angle2, iso._tri._angle3,
    //   iso._tri._side12, iso._tri._side23, iso._tri._side31,
    // ];
    // this.addSection(common);

    // common.title = 'adf';
    // eslint-disable-next-line
    // common.setContent = 'All angles in a triangle are equal, and a triangle\'s angles sum to |_180|. Therefore each angle must be a third of 180º, or |60º|.';
    // common.modifiers = {
    // eslint-disable-next-line
    //   _180: clickWord('180º', 'id_important_triangles_sum', qr._tri.show, [qr._tri], colors.diagram.action),
    // };
    // this.addSection(common);

    // common.setSteadyState = () => {
    //   iso.setScenario(iso._left, layout.iso.left.scenario.center);
    //   iso.setScenario(iso._right, layout.iso.right.scenario.center);
    //   iso._tri._angle1.label.eqn.showForm('1');
    //   iso._tri._angle2.label.eqn.showForm('1');
    //   iso._tri._angle3.label.eqn.showForm('1');
    // };
    // this.addSection(common);

    // this.addSection(common, {
    //   title: 'isoateral',
    //   setContent: [
    //     'An |Equilateral| triangle is a triangle whose sides are all the |same length|.',
    // eslint-disable-next-line
    //     `${new Definition('Equilateral', 'Latin', ['aequi', 'equal', 'lateralis', 'lateral, of or pertaining to the side']).html('id_lesson__equilateral_definition')}`,
    //   ],
    //   showOnly: [equil, iso._tri, iso._tri._tri],
    //   show: [iso._tri._side12, iso._tri._side23, iso._tri._side31],
    // });
  }
}

export default Content;
