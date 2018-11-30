// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight,
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
    const equil = diag._equil;
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
      title: 'Equilateral',
      setContent: [
        'An |Equilateral| triangle is a triangle whose sides are all the |same length|.',
        `${new Definition('Equilateral', 'Latin', ['aequi', 'equal', 'lateralis', 'lateral, of or pertaining to the side']).html('id_lesson__equilateral_definition')}`,
      ],
      showOnly: [equil, equil._tri, equil._tri._tri],
      show: [equil._tri._side12, equil._tri._side23, equil._tri._side31],
    });

    common.setSteadyState = () => {
      equil._tri._angle1.label.eqn.showForm('0');
      equil._tri._angle2.label.eqn.showForm('0');
      equil._tri._angle3.label.eqn.showForm('0');
      equil.setScenario(equil._left, layout.equil.left.scenario.center);
      equil.setScenario(equil._right, layout.equil.right.scenario.center);
    };
    common.showOnly = [equil, qr];
    common.show = [equil._tri];
    this.addSection(common, {
      setContent: [
        'An |Equilateral| triangle\'s |angles| are also all |equal|.',
      ],
      modifiers: { angles: highlight(colors.angles) },
    });

    this.addSection(common, {
      setContent: [
        'This can be shown using |Side_Side_Side| triangle congruency.',
      ],
      modifiers: { Side_Side_Side: click(qr._sss.show, [qr._sss], colors.diagram.action) },
    });

    common.setContent = 'Start by drawing a |line| from the top point to the |middle| of the |base| side.';
    common.showOnly = [equil, equil._tri, equil._tri._tri];
    common.show = [equil._tri._side12, equil._tri._side23, equil._tri._side31];
    this.addSection(common, {});
    common.showOnly = [
      equil, equil._tri, equil._tri._tri,
      equil._left, equil._left._tri, equil._right, equil._right._tri,
    ];
    this.addSection(common, {});
    common.showOnly = [
      equil, equil._tri, equil._tri._tri,
      equil._left, equil._left._tri, equil._right, equil._right._tri,
    ];
    // common.show = [
    //   equil._tri._side12, equil._tri._side23, equil._tri._side31,
    //   equil._left._side12, equil._right._side12, equil._left._side23,
    // ];
    common.show = [
      equil._tri._side12,
      equil._left._side12, equil._left._side31, equil._left._side23,
      equil._right._side12, equil._right._side23,
    ];
    this.addSection(common, {});

    common.setContent = 'We now have two triangles, are they the same?';
    this.addSection(common, {});
    common.showOnly = [
      equil,
      equil._left, equil._left._tri,
      equil._right, equil._right._tri,
    ];
    common.show = [
      equil._left._side12, equil._left._side31, equil._left._side23,
      equil._right._side12, equil._right._side23,
    ];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        equil.moveToScenario(equil._left, layout.equil.left.scenario.left, 1, done);
        equil.moveToScenario(equil._right, layout.equil.right.scenario.right, 1);
      },
      setSteadyState: () => {
        equil.setScenario(equil._left, layout.equil.left.scenario.left);
        equil.setScenario(equil._right, layout.equil.right.scenario.right);
        equil._right._side31.showAll();
      },
    });
  }
}

export default Content;
