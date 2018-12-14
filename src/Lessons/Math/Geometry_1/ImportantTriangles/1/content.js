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
      title: 'Isosceles',
      setContent: [
        'A triangle with |two_sides| of |equal_length| is called an |Isosceles| triangle.',
        `${new Definition('Isosceles', 'Greek', ['isoskeles', '', 'isos', 'equal', 'skelos', 'leg']).html('id_lesson__isosceles_definition')}`,
      ],
      modifiers: {
        two_sides: click(iso.pulseEqualSides, [iso], colors.equalLength),
        equal_length: click(iso.pulseEqualSides, [iso], colors.equalLength),
      },
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
    });


    // common = {
    //   showOnly: [iso, iTri, iTri._line, qr],
    //   show: [
    //     iTri._side12, iTri._side23, iTri._side31,
    //     iTri._angle1, iTri._angle2,
    //   ],
    //   setSteadyState: () => {
    //     iso.setScenario(iTri, layout.iso.scenario.center);
    //   },
    // };
    this.addSection(common, {
      setContent: 'When |two sides| of a triangle are |equal|, the triangle\'s |angles| have a special relationship.',
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._side12, iTri._side23, iTri._side31],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    });
    // this.addSection(common, {
    //   setContent: [
    //     'An |Isoceles| triangle also has |two_equal_angles|.',
    //   ],
    //   modifiers: {
    //     two_equal_angles: click(iso.pulseEqualAngles, [iso], colors.angles),
    //   },
    // });
    // this.addSection(common, {
    //   setContent: [
    //     'This can be shown using |Side_Side_Side| triangle congruency.',
    //   ],
    //   modifiers: { Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action) },
    // });


    common = {
      setContent: 'We can show this by |drawing_a_line| from the |point| between the equal sides to the |middle| of the opposite side.',
      modifiers: {
        drawing_a_line: highlight(colors.diagram.lines),
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
      drawing_a_line: click(iso.growSplit, [iso], colors.diagram.lines),
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
      setContent: 'If instead we start knowing a triangle has |two equal angles|, we can also show that it will have |two equal sides|.',
      showOnly: [iso, iTri, iTri._line],
      show: [iTri._angle1, iTri._angle2],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
      },
    };
    this.addSection(common, {
      title: 'Start With Equal Angles',
      transitionFromNext: (done) => {
        iso.moveToScenario(iTri, layout.iso.scenario.center, 1, done);
      },
    });

    common.setContent = 'We can start by |labeling| the side between the equal angles, then |splitting| the triangle as before.';
    this.addSection(common);
    common.show = [iTri._angle1, iTri._angle2, iTri._side12];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        iTri._side12._label.pulseScaleNow(1, 2);
        done();
      },
    });
    this.addSection(common, {
      show: [iTri._angle1, iTri._angle2, iTri._side12, iso._split],
      setSteadyState: () => {
        iso.setScenario(iTri, layout.iso.scenario.center);
        iso.growSplit();
      },
    });
    common.showOnly = [iso, iTri, iTri._line, left, right];
    common.show = [
      iTri._angle1, iTri._angle2, iTri._side12, iso._split, left._side23,
    ];
    this.addSection(common);
    this.addSection(common, {
      show: [
        iTri._angle1, iTri._angle2, iTri._side12, iso._split,
        left._side23, left._side12, right._side12,
      ],
    });
    this.addSection(common, {
      showOnly: [
        iso, qr,
        left, left._line,
        right, right._line,
      ],
      show: [
        left._side23,
        left._angle1, right._angle2,
        left._side12, right._side12,
      ],
      transitionFromPrev: (done) => {
        iso.moveToScenario(left, layout.iso.left.scenario.left, 1, done);
        iso.moveToScenario(right, layout.iso.right.scenario.right, 1);
      },
      setSteadyState: () => {
        iso.setScenario(left, layout.iso.left.scenario.left);
        iso.setScenario(right, layout.iso.right.scenario.right);
        right._side31.showAll();
      },
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
      setContent: centerV([
        'An |isosceles triangle| has |two equal sides| and |two equal angles|.',
        'A triangle with |two equal sides|, must also have |two equal angles|.',
        'A triangle has |two equal angles|, must also have |two equal sides|.',
        '|All| angles in an |isosceles triangle| can be calculated from just |one| angle.',
      ]),
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
