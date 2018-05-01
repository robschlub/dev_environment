// @flow

import { Lesson, Section, Paragraph, actionWord } from '../../js/Lesson/LessonBase';
import ShapesDiagram from './diagramShapes';
import CircleDiagram from './diagramCircle';

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

const lesson = new Lesson();
lesson.title = '';
lesson.sections = [
  new Section1(),
  new Section2(),
];

export default lesson;
