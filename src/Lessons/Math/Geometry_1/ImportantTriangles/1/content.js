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

    const common = {
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

    this.addSection(common, {
      title: 'Introduction',
      setContent: centerV([
        'There are several |types of triangle| commonly found in many applications.',
        'Being able to |identify| these types of triangle can make |understanding| a problem |quicker and easier|.',
      ]),
    });

    this.addSection(common, {
      setContent: centerV([
        'Triangles are commonly grouped by either their |side lengths| or |angles|.',
      ]),
    });


    this.addSection(common, {
      title: 'Isoceles',
      setContent: [
        'An |Isoceles| triangle has |two sides with equal length|.',
        `${new Definition('Isoceles', 'Greek', ['isoskeles', '', 'isos', 'equal', 'skelos', 'leg']).html('id_lesson__isoceles_definition')}`,
      ],
      showOnly: [iso, iso._tri, iso._tri._tri],
      show: [iso._tri._side12, iso._tri._side23, iso._tri._side31],
    });

    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
    };
    common.showOnly = [iso, qr];
    common.show = [iso._tri];
    this.addSection(common, {
      setContent: [
        'An |Isoceles| triangle also has |two equal angles|.',
      ],
      modifiers: { angles: highlight(colors.angles) },
    });

    this.addSection(common, {
      setContent: [
        'This can be shown using |Side_Side_Side| triangle congruency.',
      ],
      modifiers: { Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action) },
    });

    common.setContent = 'Start by drawing a |line| from one |point| to the |opposite side|.';
    common.showOnly = [iso, iso._tri, iso._tri._tri];
    common.show = [iso._tri._side12, iso._tri._side23, iso._tri._side31];
    this.addSection(common, {});
    common.showOnly = [
      iso, iso._tri, iso._tri._tri,
      iso._left, iso._left._tri, iso._right, iso._right._tri,
    ];
    this.addSection(common, {});
    common.showOnly = [
      iso, iso._tri, iso._tri._tri,
      iso._left, iso._left._tri, iso._right, iso._right._tri,
    ];
    // common.show = [
    //   iso._tri._side12, iso._tri._side23, iso._tri._side31,
    //   iso._left._side12, iso._right._side12, iso._left._side23,
    // ];
    common.show = [
      iso._tri._side12,
      iso._left._side12, iso._left._side31, iso._left._side23,
      iso._right._side12, iso._right._side23,
    ];
    this.addSection(common, {});

    common.setContent = 'This line splits the triangle into two.';
    this.addSection(common, {});
    common.showOnly = [
      iso, qr,
      iso._left, iso._left._tri,
      iso._right, iso._right._tri,
    ];
    common.show = [
      iso._left._side12, iso._left._side31, iso._left._side23,
      iso._right._side12, iso._right._side23,
    ];
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.left);
      iso.setScenario(iso._right, layout.iso.right.scenario.right);
      iso._right._side31.showAll();
    };
    this.addSection(common, {
      transitionFromPrev: (done) => {
        iso.moveToScenario(iso._left, layout.iso.left.scenario.left, 1, done);
        iso.moveToScenario(iso._right, layout.iso.right.scenario.right, 1);
      },
    });

    common.setContent = 'The |Side_Side_Side| triangle congruency test says that if two triangles share the same sides, then they also share the |same angles|.';
    common.modifiers = { Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action) };
    this.addSection(common, {});

    common.setContent = 'These two triangles |share the same side lengths|, and therefore their |angles are also the same|.';
    this.addSection(common, {});
    common.show = [
      iso._left, iso._right,
    ];
    this.addSection(common, {});

    common.setContent = 'And so we have shown that two angles in an |equilateral| triangle are the same.';
    common.modifiers = { a: highlight(colors.angles) };
    this.addSection(common, {});
    common.show = [
      iso._left._angle1, iso._left._side31, iso._left._side12,
      iso._right._angle2, iso._right._side23, iso._right._side12,
    ];
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.left);
      iso.setScenario(iso._right, layout.iso.right.scenario.right);
    };
    this.addSection(common, {});
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
    };
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
    };
    this.addSection(common, {
      transitionFromPrev: (done) => {
        iso.moveToScenario(iso._left, layout.iso.left.scenario.center, 1, done);
        iso.moveToScenario(iso._right, layout.iso.right.scenario.center, 1);
      },
    });
    common.showOnly = [iso, iso._tri, iso._tri._tri, qr];
    common.show = [
      iso._tri._angle1, iso._tri._angle2,
      iso._tri._side12, iso._tri._side23, iso._tri._side31,
    ];
    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
      iso._tri._angle1.label.eqn.showForm('0');
      iso._tri._angle2.label.eqn.showForm('0');
      iso._tri._angle3.label.eqn.showForm('0');
    };
    this.addSection(common);

    common.setContent = 'If instead the line is drawn from a |different| triangle point, this same procedure can be used to show the |third angle| is the |same| as the other two.';
    common.modifiers = {
      different: click(iso.toggleSplitLines, [iso, null], colors.diagram.action),
    };

    this.addSection(common);
    common.show = [
      iso._tri._angle1, iso._tri._angle2, iso._tri._angle3,
      iso._tri._side12, iso._tri._side23, iso._tri._side31,
    ];
    this.addSection(common);

    common.title = 'adf';
    common.setContent = 'All angles in a triangle are equal, and a triangle\'s angles sum to |_180|. Therefore each angle must be a third of 180º, or |60º|.';
    common.modifiers = {
      _180: clickWord('180º', 'id_important_triangles_sum', qr._tri.show, [qr._tri], colors.diagram.action),
    };
    this.addSection(common);

    common.setSteadyState = () => {
      iso.setScenario(iso._left, layout.iso.left.scenario.center);
      iso.setScenario(iso._right, layout.iso.right.scenario.center);
      iso._tri._angle1.label.eqn.showForm('1');
      iso._tri._angle2.label.eqn.showForm('1');
      iso._tri._angle3.label.eqn.showForm('1');
    };
    this.addSection(common);

    // this.addSection(common, {
    //   title: 'isoateral',
    //   setContent: [
    //     'An |Equilateral| triangle is a triangle whose sides are all the |same length|.',
    //     `${new Definition('Equilateral', 'Latin', ['aequi', 'equal', 'lateralis', 'lateral, of or pertaining to the side']).html('id_lesson__equilateral_definition')}`,
    //   ],
    //   showOnly: [equil, iso._tri, iso._tri._tri],
    //   show: [iso._tri._side12, iso._tri._side23, iso._tri._side31],
    // });
  }
}

export default Content;
