// import getColors from '../diagram/colors';
import ShapesDiagram from './shapesDiagram';
import CircleDiagram from './circleDiagram';

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
    this.setContent();
    this.modifyContent();
  }

  setContent() { // eslint-disable-line class-methods-use-this
  }

  modifyContent() {
    Object.keys(this.modifiers).forEach((key) => {
      const expression = new RegExp(`\\|${key}\\|`, 'gi');
      this.content = this.content.replace(expression, this.modifiers[key]);
    });
  }
}
class Page1 extends Page {
  setContent() {
    this.title = 'Shapes and Corners';
    this.content =
      '<p>Many shapes have |_corners|.</p>' +
      '<p>Somes corners are |_more_sharp|, while others are |_less_sharp|.</p>';

    this.modifiers = {
      _corners: actionWord('corners', 'id_corners'),
      _more_sharp: actionWord('more sharp', 'id_more_sharp'),
      _less_sharp: actionWord('less sharp', 'id_less_sharp'),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  setState(diagram: ShapesDiagram) {
    diagram.elements.hideOnly([
      diagram.elements._square._corners,
      diagram.elements._square._lessSharpCorners,
      diagram.elements._triangle._moreSharpCorners,
      diagram.elements._triangle._corners,
      diagram.elements._pent._corners,
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

class Page2 extends Page {
  title: string;
  content: string;
  modifiers: Object;

  setContent() {
    this.title = 'Shapes and Corners';
    this.content =
      '<p>The sharpness of the corner is a property that can describe a shape.</p>' +
      '<p>So how can you measure sharpness? What name do we give to the sharpness?</p>' +
      '<p>Let\'s start with two |_lines| on top of each other, |_anchored| at one end. One |_line| can be rotated around the anchor, and at the anchor the two lines form a corner';

    this.modifiers = {
      _lines: actionWord('lines', 'id_lines'),
      _line: actionWord('line', 'id_line'),
      _anchored: actionWord('anchored', 'id_anchor'),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  setState(diagram: CircleDiagram) {
    diagram.elements.showAll();

    const lines = document.getElementById('id_lines');
    if (lines) {
      lines.onclick = diagram.pulseLines.bind(diagram);
    }
    const line = document.getElementById('id_line');
    if (line) {
      line.onclick = diagram.pulseRadius.bind(diagram);
    }
    const anchor = document.getElementById('id_anchor');
    if (anchor) {
      anchor.onclick = diagram.pulseAnchor.bind(diagram);
    }
  }
}

const content = [
  new Page1(),
  new Page2(),
];
export default content;
