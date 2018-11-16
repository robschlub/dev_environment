// @flow
import { LessonContent } from '../../../../../js/Lesson/LessonContent';
import { click, centerH } from '../../../../../js/tools/htmlGenerator';
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
      setContent: () => {
        let out = '<p>Quick Reference Popups</p><p></p>';
        Object.keys(diag.elements).forEach((key) => {
          out = `${out}<p style="margin-top:0%">|${key}|</p>`;
        });
        return centerH(out);
      },
      modifiers: () => {
        const out = {};
        Object.keys(diag.elements).forEach((key) => {
          out[key] = click(diag.elements[`${key}`].show, [diag.elements[`${key}`]]);
        });
        return out;
      },
    });
  }
}

export default Content;
