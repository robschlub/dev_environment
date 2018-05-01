// @flow

// import getColors from '../diagram/colors';
import ShapesDiagram from './shapesDiagram';
import CircleDiagram from './circleDiagram';
import Diagram from '../diagram/Diagram';

// import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
// import { Point } from '../diagram/tools/g2';


function actionWord(text, id = '', classes = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Paragraph {
  type: 'text' | 'diagram' | 'html';
  id: string;
  text: string;
  DiagramClass: Function;

  constructor(
    type: 'text' | 'diagram' | 'html' = 'html',
    content: string | Diagram = '',
    id: string = '',
  ) {
    this.type = type;
    if ((type === 'text' || type === 'html') && typeof content === 'string') {
      this.text = content;
    }
    if (type === 'diagram' && typeof content === 'function') {
      this.DiagramClass = content;
    }
    this.id = id;
  }
}

class Section {
  title: string;
  paragraphs: Array<Paragraph>;

  constructor() {
    this.makeTitle();
    // this.makeContent();
    this.makeContent();
  }

  makeTitle() {
    this.title = this.setTitle();
  }

  setContent(): Array<Paragraph | string> {
    return [];
  }
  setTitle(): string {
    return '';
  }
  setModifiers(): Object {
    return {};
  }

  makeContent(): void {
    this.paragraphs = []
    const content = this.setContent();
    const modifiers = this.setModifiers();
    content.forEach((paragraphOrText) => {
      let newParagraph;
      if (typeof paragraphOrText === 'string') {
        if (paragraphOrText[0] === '<') {
          newParagraph = new Paragraph('html', paragraphOrText);
        } else {
          newParagraph = new Paragraph('text', `<p>${paragraphOrText}</p>`)
        }
      } else {
        newParagraph = paragraphOrText;
      }
      if (newParagraph.type === 'text' || newParagraph.type === 'html') {
        Object.keys(modifiers).forEach((key) => {
          const expression = new RegExp(`\\|${key}\\|`, 'gi');
          newParagraph.text =
            newParagraph.text.replace(expression, modifiers[key])
        });
      }
      this.paragraphs.push(newParagraph);
    });
  }

  // eslint-disable-next-line
  setState(diagram: any) {
  }
}

class Page {
  title: string;
  sections: Array<Section>;
  constructor() {
    this.title = '';
    this.sections = [];
  }
}

class Section1 extends Section {
  setTitle() {
    return 'Shapes and Corners';
  }
  setContent() {
    return [
      'Many |_shapes| have |_corners|.',
      'Somes corners are |_more_sharp|, while others are |_less_sharp|.',
      new Paragraph('diagram', ShapesDiagram, 'shapes'),
    ];
  }
  setModifiers() {
    return {
      _shapes: actionWord('shapes', 'id_shapes'),
      _corners: actionWord('corners', 'id_corners'),
      _more_sharp: actionWord('more sharp', 'id_more_sharp'),
      _less_sharp: actionWord('less sharp', 'id_less_sharp'),
    };
  }
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

    const shapes = document.getElementById('id_shapes');
    if (shapes) {
      shapes.onclick = diagram.pulseShapes.bind(diagram);
    }

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

class Section2 extends Section {
  setContent() {
    return [
      'The sharpness of the corner is a property that can describe a shape.',
      `So how can you measure sharpness? What name do we give to the
      sharpness?`,
      `Let's start with two lines |_anchored| at one end. One |_line| can be
      rotated around the anchor. The two lines form a |_corner| at the
      anchor.`,
      new Paragraph('diagram', CircleDiagram, 'circle'),
    ];
  }
  setModifiers() {
    return {
      _line: actionWord('line', 'id_line'),
      _anchored: actionWord('anchored', 'id_anchor'),
      _corner: actionWord('corner', 'id_corner'),
    };
  }

  setState(diagram: CircleDiagram) {
    diagram.elements.hideOnly([
      diagram.elements._cornerRad,
      diagram.elements._cornerRef,
    ]);
    const t = diagram.elements._radius.transform.copy();
    t.updateRotation(Math.PI / 3);
    diagram.elements._radius.setTransform(t);

    const line = document.getElementById('id_line');
    if (line) {
      line.onclick = diagram.pulseRadius.bind(diagram);
    }
    const anchor = document.getElementById('id_anchor');
    if (anchor) {
      anchor.onclick = diagram.pulseAnchor.bind(diagram);
    }

    const corner = document.getElementById('id_corner');
    if (corner) {
      corner.onclick = diagram.toggleCorners.bind(diagram);
    }
  }
}

const page1 = new Page();
page1.title = '';
page1.sections = [
  new Section1(),
  new Section2(),
];

export { Paragraph, Section, Page, page1 };
