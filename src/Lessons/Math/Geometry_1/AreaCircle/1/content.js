// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
// import {
//   click, centerV, highlight,
// } from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
// import Definition from '../../../../LessonsCommon/tools/definition';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import imgLinkGrey from '../tile-grey.png';
import details from '../details';

const layout = lessonLayout();
// const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
    this.iconLinkGrey = imgLinkGrey;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  setElementContent() {
    const { selector } = this.diagram.elements._circ._selector;
    layout.polygons.sides.forEach((numSides) => {
      selector.add(numSides.toString(), numSides.toString());
    });
    selector.selectWithoutExecution('1');
  }

  addSections() {
    const diag = this.diagram.elements;
    const circ = diag._circ;

    const common = {
      setContent: '',
      setInfo: '',
      modifiers: {},
      infoModifiers: {},
      setEnterState: () => {},
      showOnly: [],
      show: [circ],
      hide: [],
      setSteadyState: () => {},
      setLeaveState: () => {},
    };
    this.addSection(common, {
      title: 'Enter_title_here',
      setContent: ['Enter_content_here'],
      showOnly: [circ],
      show: [circ],
      transitionFromPrev: (done) => {
        circ.moveToScenario(circ, layout.circle.scenarios.center, null, done);
      },
      setSteadyState: () => {
        circ.setScenario(circ, layout.circle.scenarios.center);
        console.log(circ)
        circ.eqns.triRectEqn.showForm('8', 'base');
        // console.log(circ)
      },
    });
  }
}

export default Content;
