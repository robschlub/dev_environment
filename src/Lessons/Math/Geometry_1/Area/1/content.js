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
    const areaShapes = diag._areaShapes;

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
    this.addSection(common, {
      title: 'Introduction',
      setContent: centerV(`
        <p>The properties examined so far for |circles|, |triangles| and |quadrangles| have been their |side lengths|, |angle sizes|, |width| and the |relationships| between them.<p>
      `),
    });

    this.addSection(common, {
      title: 'Introduction',
      setContent: centerV(`
        <p>
          An important property of shapes is |how much space they take up|.
        </p>
        <p>
          For instance, if you want to |cover| a large rectangle wall with small square tiles, then the amount of space the two shapes take up will tell you |how many| tiles you need to cover the wall.
        </p>
      `),
    });
    this.addSection(common, {
      setContent: centerV(`
        <p>
          This property is named |area|.
        </p>
        <p>
          The word comes from |Latin| where it means a |vacant piece of level ground|. In the mid 16th century, the word was used to describe a |space allocated for a specific purpose|. And so today, we use it to describe how much space a shape takes up.
        </p>
      `),
    });
  }
}

export default Content;
