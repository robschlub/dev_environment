// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight, highlightWord,
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
    const meas = diag._measure;
    const rect = diag._rect;


    let common = {
      setContent: [],
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
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Measure
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    common.showOnly = [meas];
    this.addSection(common, {
      title: 'Area',
      setContent: [
        '|Area| is the |amount of space| a shape takes up and is measured in |squared length| units, such as |square meters| normally written as |m<sup>2</sup>|.',
        `${new Definition('Area', 'Mid 16<sup>th</sup> century', ['area', 'space allocated for a specific purpose'], 'Latin', ['area', 'vacant piece of level ground']).html('id_lesson__area_definition', 'lesson__definition_low')}`,
      ],
      show: [
        meas._mediumGrid, meas._squareA,
        meas._circleA, meas._triangleA,
        meas._triLabelMeters, meas._squareLabelMeters, meas._circleLabelMeters,
      ],
    });

  }
}

export default Content;
