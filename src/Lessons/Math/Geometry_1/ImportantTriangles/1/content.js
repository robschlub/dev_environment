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
      setSteadyState: () => {
        // iso.show();
        // iso._isoEqn.showAll();
        // iso.eqns.isoEqn.showForm('3');
        // iso._testEqn.setPosition(-1, 1);
        // iso._testEqn.showForm('1');
        // iso._testNav.setPosition(-1, 1);
        // iso._testNav.showForm('0');
      },
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
      title: 'Isoceles',
      setContent: [
        'A triangle with |two_sides| of |equal_length| is called an |Isoceles| triangle.',
        `${new Definition('Isoceles', 'Greek', ['isoskeles', '', 'isos', 'equal', 'skelos', 'leg']).html('id_lesson__isoceles_definition')}`,
      ],
      modifiers: {
        two_sides: click(iso.pulseEqualSides, [iso], colors.equalLength),
        equal_length: click(iso.pulseEqualSides, [iso], colors.equalLength),
      },
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
    });


    common = {
      showOnly: [iso, iTri, iTri._line, qr],
      show: [
        iTri._side12, iTri._side23, iTri._side31,
        iTri._angle1, iTri._angle2,
      ],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common, {
      setContent: [
        'An |Isoceles| triangle also has |two_equal_angles|.',
      ],
      modifiers: {
        two_equal_angles: click(iso.pulseEqualAngles, [iso], colors.angles),
      },
    });
    this.addSection(common, {
      setContent: [
        'This can be shown using |Side_Side_Side| triangle congruency.',
      ],
      modifiers: { Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action) },
    });


    common = {
      setContent: 'Start by |drawing_a_line| from the |point| between the equal sides to the |middle| of the opposite side.',
      modifiers: {
        drawing_a_line: click(iso._split.grow, [iso._split, 0, 1], colors.lines),
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
    this.addSection(common, {
      show: [iTri._side12, iTri._side23, iTri._side31, iso._split],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
        iso._split.grow(0, 1);
      },
    });

    common = {
      setContent: 'This line will have some length, which we can label |C|.',
      showOnly: [
        iso, iTri, iTri._line, left,
        left, left._line, right, right._line,
      ],
      show: [iTri._side12, iTri._side23, iTri._side31],
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.center);
        iso.setScenario(right, layout.iso.right.scenario.center);
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common);
    this.addSection(common, {
      show: [iTri._side12, iTri._side23, iTri._side31, left._side31],
    });
    // this.addSection(common, {
    //   showOnly: [
    //     iso, iTri, iTri._line,
    //     left, left._line, right, right._line,
    //   ],
    //   show: [
    //     iTri._side12,
    //     left._side12, left._side31, left._side23,
    //     right._side12, right._side23,
    //   ],
    // });


    // common = {
    //   setContent: 'This line splits the triangle into two.',
    //   showOnly: [
    //     iso, qr,
    //     iTri, iTri._line,
    //     left, left._line,
    //     right, right._line,
    //   ],
    //   show: [
    //     iTri._side12,
    //     left._side12, left._side31, left._side23,
    //     right._side12, right._side23,
    //   ],
    //   setSteadyState: () => {
    //     iso.setScenario(left, layout.iso.left.scenario.center);
    //     iso.setScenario(right, layout.iso.right.scenario.center);
    //   },
    // };
    // this.addSection(common);
    this.addSection(common, {
      setContent: 'This line splits the triangle into two.',
      showOnly: [
        iso, qr,
        left, left._line,
        right, right._line,
      ],
      show: [
        left._side31, right._side23,
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
        left._side12, left._side31, // left._side23,
        right._side12, right._side23, // right._side31,
      ],
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
      },
    };
    this.addSection(common);
    common.setContent = 'These two triangles |share the same side lengths|, and therefore their |angles are also the same|.';
    this.addSection(common);
    common.show = [
      left, right,
    ];
    this.addSection(common, { show: [iso._left, iso._right] });

    common = {
      setContent: 'Now, |join| the two triangles back.',
      modifiers: { a: highlight(colors.angles) },
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
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
    };
    this.addSection(common, {
      transitionFromPrev: (done) => {
        iso.moveToScenario(left, layout.iso.left.scenario.center, 1, done);
        iso.moveToScenario(right, layout.iso.right.scenario.center, 1);
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
      setContent: 'And so we have shown that two angles in an |isoceles| triangle are the same.',
      transitionFromNext: (done) => {
        iso.moveToScenario(iTri, layout.iso.scenario.center, 1, done);
      },
    });

    common.setSteadyState = () => {
      iso.setScenario(iTri, layout.iso.scenario.bottom);
    };
    this.addSection(common, {
      title: 'Third Angle',
      setContent: 'With the understanting |two angles are the same|, we can find the |relationship| between the |equal angles| and the |third angle|.',
      transitionFromPrev: (done) => {
        iso.moveToScenario(iTri, layout.iso.scenario.bottom, 1, done);
      },
    });


    common = {
      setContent: 'We start by labelling the third angle and recalling all the angles in a triangle add to |_180|. If we know |b| we can find |a|.',
      modifiers: {
        _180: clickWord(
          '180º', 'id_important_triangles_sum1',
          qr._tri.show, [qr._tri], colors.diagram.action,
        ),
        b: highlight(colors.angles),
        a: highlight(colors.angles),
      },
      showOnly: [iso, iTri, iTri._line, qr],
      show: [
        iTri._angle1, iTri._angle2, iTri._angle3,
        iTri._side12, iTri._side23, iTri._side31,
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
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.bottom);
        iso._eqnANav.showForm('5');
      },
    });

    common = {
      setContent: 'Similarly, if we know |a| we can find |b|.',
      modifiers: {
        b: highlight(colors.angles),
        a: highlight(colors.angles),
      },
      showOnly: [iso, iTri, iTri._line, qr],
      show: [
        iTri._angle1, iTri._angle2, iTri._angle3,
        iTri._side12, iTri._side23, iTri._side31,
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
      setContent: centerV(['Therefore, if we have an |isoceles triangle|, and we know |any angle|, we can |calculate| the other |two angles|.']),
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
