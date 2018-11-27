// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  highlight,
} from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
// import Definition from '../../../../LessonsCommon/tools/definition';
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
    const circ = diag._circ;

    this.addSection({
      title: 'Summary',
      setContent: '|Circle area| is the product of |π| and the |radius| squared.',
      modifiers: { radius: highlight(colors.radius) },
      setInfo: [
        'Touch |Area| in the equation to toggle the area fill.',
        'Touch |r| in the equation to highlight the circle\'s radius.',
      ],
      showOnly: [circ],
      show: [circ._circle, circ._radius],
      setSteadyState: () => {
        circ.eqns.triRectEqn.showForm('14');
        circ.setScenario(circ, layout.collection.scenarios.left);
        circ.setScenario(circ._radius, { rotation: 0 });
      },
    });
  }
}

export default Content;
