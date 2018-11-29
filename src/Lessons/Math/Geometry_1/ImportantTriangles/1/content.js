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

    this.addSection(common, {
      setContent: [
        'An |Equilateral| triangle\'s |angles| are also all |equal|.',
      ],
      modifiers: {
        angles: highlight(colors.angles),
      },
      showOnly: [equil],
      show: [equil._tri],
      setSteadyState: () => {
        equil._tri._angle1.label.eqn.showForm('0');
        equil._tri._angle2.label.eqn.showForm('0');
        equil._tri._angle3.label.eqn.showForm('0');
      },
    });
  }
}

export default Content;
