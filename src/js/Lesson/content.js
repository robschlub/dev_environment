// import getColors from '../diagram/colors';
import ShapesDiagram from './shapesDiagram';
// import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
// import { Point } from '../diagram/tools/g2';
// @flow

function actionWord(text, id = '', classes = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Page {
  title: string;
  content: string;
  modifiers: Object;

  constructor() {
    this.title = 'Shapes and Corners';
    this.content =
      '<p>Many shapes have |_corners|.</p>' +
      '<p>Somes corners are |_more_sharp|, while others are |_less_sharp|.</p>' +
      '<p>The sharpness of the corner is a property that can describe a shape.</p>' +
      '<p>So how can you measure sharpness?</p>' +
      '<p>What name do we give to the sharpness?</p>';

    this.modifiers = {
      _corners:
        actionWord('corners', 'id_corners', 'class_corners'),
      _more_sharp:
        actionWord('more sharp', 'id_more_sharp', 'L2_col_more_sharp'),
      _less_sharp:
        actionWord('less sharp', 'id_less_sharp', 'L2_col_less_sharp'),
    };
    this.modifyContent();
  }

  modifyContent() {
    Object.keys(this.modifiers).forEach((key) => {
      const expression = new RegExp(`\\|${key}\\|`, 'gi');
      this.content = this.content.replace(expression, this.modifiers[key]);
    });
  }

  static setState(diagram: ShapesDiagram) {
    diagram.elements.hideOnly([
      diagram.elements._square._lessSharpCorners,
      diagram.elements._triangle._moreSharpCorners,
      diagram.elements._pent._moreSharpCorners,
      diagram.elements._pent._lessSharpCorners,
    ]);

    const corners = document.getElementById('id_corners');
    if (corners) {
      corners.onclick = diagram.toggleCorners.bind(diagram);
    }

    const moreSharp = document.getElementById('id_more_sharp');
    if (moreSharp) {
      moreSharp.onclick = diagram.toggleMoreSharpCorners.bind(diagram);
    }

    const lessSharp = document.getElementById('id_less_sharp');
    if (lessSharp) {
      lessSharp.onclick = diagram.toggleLessSharpCorners.bind(diagram);
    }
  }
}

export default Page;
