// @flow
import { LessonContent } from '../../../../../js/Lesson/LessonContent';
import { click } from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
import lessonLayout from '../quickReference/layout';
import details from '../details';
import imgLink from '../tile.png';
import imgLinkGrey from '../tile-grey.png';

const layout = lessonLayout();

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

    this.addSection({
      title: 'QR Test',
      setContent: `
        <p>|corresponding|</p>
        <p>|alternate|</p>
        <p>|interior|</p>
        <p>|opposite|</p>
      `,
      modifiers: {
        corresponding: click(diag._corresponding.show, [diag._corresponding]),
        alternate: click(diag._alternate.show, [diag._alternate]),
        interior: click(diag._interior.show, [diag._interior]),
        opposite: click(diag._opposite.show, [diag._opposite]),
      },
    });
  }
}

export default Content;
