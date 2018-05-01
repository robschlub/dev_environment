// import getColors from '../diagram/colors';
import ShapesDiagram from './shapesDiagram';
import CircleDiagram from './circleDiagram';

// import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
// import { Point } from '../diagram/tools/g2';
// @flow

function actionWord(text, id = '', classes = '') {
  return `<span id="${id}" class="${classes} action_word">${text}</span>`;
}

class Section {
  title: string;
  paragraphs: Array<string | Object>;
  modifiers: Object;

  constructor() {
    this.setContent();
    this.modifyContent();
  }

  // eslint-disable-next-line class-methods-use-this
  setContent() {
  }

  modifyContent() {
    Object.keys(this.modifiers).forEach((key) => {
      const expression = new RegExp(`\\|${key}\\|`, 'gi');
      for (let i = 0; i < this.paragraphs.length; i += 1) {
        const paragraph = this.paragraphs[i];
        if (typeof paragraph === 'string') {
          this.paragraphs[i] = paragraph.replace(expression, this.modifiers[key]);
        }
      }
    });
  }
}

class Section1 extends Section {
  setContent() {
    this.title = 'Shapes and Corners';
    this.paragraphs = [
      'Many |_shapes| have |_corners|.',
      'Somes corners are |_more_sharp|, while others are |_less_sharp|.',
      {
        Diagram: ShapesDiagram,
        id: 'shapes',
      },
    ];

    this.modifiers = {
      _shapes: actionWord('shapes', 'id_shapes'),
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
  title: string;
  paragraphs: Array<string | Object>;
  modifiers: Object;

  setContent() {
    this.title = 'Shapes and Corners';
    this.paragraphs = [
      'The sharpness of the corner is a property that can describe a shape.',
      `So how can you measure sharpness? What name do we give to the
      sharpness?`,
      `Let's start with two lines |_anchored| at one end. One |_line| can be
      rotated around the anchor. The two lines form a |_corner| at the
      anchor.`,
      {
        Diagram: CircleDiagram,
        id: 'circle',
      },
    ];

    this.modifiers = {
      _line: actionWord('line', 'id_line'),
      _anchored: actionWord('anchored', 'id_anchor'),
      _corner: actionWord('corner', 'id_corner'),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  setState(diagram: CircleDiagram) {
    diagram.elements.hideOnly([
      diagram.elements._cornerRad,
      diagram.elements._cornerRef,
    ]);
    const t = diagram.elements._radius.transform.copy();
    t.updateRotation(Math.PI / 3);
    diagram.elements._radius.setTransform(t);
    // diagram.updateRotation(Math.PI / 3);

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

const page = [
  new Section1(),
  new Section2(),
];

export default page;
