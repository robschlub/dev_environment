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
      setSteadyState: () => {
        equil._angle1.update();
        equil._angle2.update();
        equil._angle3.update();
      },
      setLeaveState: () => {},
    };
    this.addSection(common, {
      title: 'Enter_title_here',
      setContent: ['Enter_content_here'],
      show: [equil],
    });
  }
}

export default Content;
