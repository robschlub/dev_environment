// @flow

// import { Lesson } from '../../js/Lesson/Lesson';
import { Content, Section, actionWord, diagramCanvas } from '../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import CircleDiagram from './diagramCircle';

class Section1 extends Section {
  setTitle() {
    return 'Shapes and Corners';
  }
  setContent() {
    return [
      '<p>Many |_shapes| have |_corners|.</p>',
      `<p>
        Somes corners are |_more_sharp|, while others are |_less_sharp|.
      </p>`,
      '|_shapes_diagram|',
      `<p>
        The sharpness of the corner is a property that can describe a shape.
      </p>
      <p>
        So how can you measure sharpness? What name do we give to the 
        sharpness?
      <p>`,
    ];
  }
  setModifiers() {
    return {
      _shapes: actionWord('shapes', 'id_shapes'),
      _corners: actionWord('corners', 'id_corners'),
      _more_sharp: actionWord('more sharp', 'id_more_sharp'),
      _less_sharp: actionWord('less sharp', 'id_less_sharp'),
      _shapes_diagram: diagramCanvas('shapes_container', LessonDiagram),
    };
  }

  setState(diagrams: Object) {
    const diagram = diagrams.shapes_container || diagrams.multipage_diagram;
    const collection = diagram.elements._shapes;
    diagram.elements.hideOnly([
      diagram.elements._circle,
      collection._square._corners,
      collection._square._lessSharpCorners,
      collection._triangle._moreSharpCorners,
      collection._triangle._corners,
      collection._pent._corners,
      collection._pent._moreSharpCorners,
      collection._pent._lessSharpCorners,
    ]);

    this.onClickId('id_shapes', collection.pulseShapes, [collection]);
    this.onClickId('id_corners', collection.toggleCorners, [collection]);
    this.onClickId('id_more_sharp', collection.toggleMoreSharpCorners, [collection]);
    this.onClickId('id_less_sharp', collection.toggleLessSharpCorners, [collection]);
  }
}

class Section2 extends Section {
  setContent() {
    return `
      |_circle_diagram|
      <p>
        Let's start with two lines |_anchored| at one end. One |_line| can be
        rotated around the anchor.
      </p>
      `;
  }
  setModifiers() {
    return {
      _line: actionWord('line', 'id_line'),
      _anchored: actionWord('anchored', 'id_anchor'),
      _circle_diagram: diagramCanvas('circle_container', LessonDiagram),
    };
  }

  // setSinglePagePrimary() {
  //   return true;
  // }

  getState(diagrams: Object): Object {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    const angle = collection._radius.transform.r();
    return {
      angle,
    };
  }

  transitionNext(diagrams: Object, done: () => void) {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    if (diagram) {
      collection.rotateTo(3, 0, 1, done);
    }
  }

  setState(
    diagrams: Object,
    previousState: Object,
  ) {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    const t = collection._radius.transform.copy();
    if ('angle' in previousState) {
      t.updateRotation(previousState.angle);
    } else {
      t.updateRotation(Math.PI / 3);
    }
    collection._radius.setTransform(t);

    collection.hideOnly([
      collection._cornerRad,
      collection._cornerRef,
      diagram.elements._shapes,
    ]);

    this.onClickId('id_line', collection.pulseRadius, [collection]);
    this.onClickId('id_anchor', collection.pulseAnchor, [collection]);
  }
}

class Section3 extends Section {
  setContent() {
    return `
      <p>
        The two lines form a |_corner| at the anchor.
      </p><p>
        |_Small_rotation| results in a |_sharper_corner|.
      </p><p>
        |_Large_rotation| results in a |_less_sharp_corner|. Lets see how far this goes
      </p>
      `;
  }
  setModifiers() {
    return {
      _corner: actionWord('corner', 'id_corner'),
      _Small_rotation: actionWord('Small Rotation', 'id_small_rotation'),
      _Large_rotation: actionWord('Large Rotation', 'id_large_rotation'),
      _sharper_corner: actionWord('sharper corner', 'id_more_sharp_cornern'),
      _less_sharp_corner: actionWord('less sharp corner', 'id_less_sharp_corner'),
    };
  }

  setSinglePagePrimary() {
    return false;
  }

  getState(diagrams: Object): Object {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    const angle = collection._radius.transform.r();
    return {
      angle,
    };
  }

  setState(
    diagrams: Object,
    previousState: Object,
    lessonType: 'multiPage' | 'singlePage',
  ) {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    if (diagram) {
      if (lessonType === 'multiPage') {
        const t = collection._radius.transform.copy();
        if ('angle' in previousState) {
          t.updateRotation(previousState.angle);
        } else {
          t.updateRotation(Math.PI / 3);
        }
        collection._radius.setTransform(t);

        collection.hideOnly([
          collection._cornerRad,
          collection._cornerRef,
          diagram.elements._shapes,
        ]);
      }
      // const diagram = diagrams.circle_container;
      this.onClickId('id_corner', collection.toggleCorners, [collection]);
      const smallRotation = [collection, Math.PI / 6, 0, 1, () => {}];
      const largeRotation = [collection, 5 * Math.PI / 6, 0, 1, () => {}];
      this.onClickId('id_small_rotation', collection.rotateTo, smallRotation);
      this.onClickId('id_large_rotation', collection.rotateTo, largeRotation);
      this.onClickId('id_more_sharp_cornern', collection.rotateTo, smallRotation);
      this.onClickId('id_less_sharp_corner', collection.rotateTo, largeRotation);
    }
  }

  transitionPrev(diagrams: Object, done: () => void) {
    const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    const collection = diagram.elements._circle;
    if (diagram) {
      collection.rotateTo(1, 0, 1, done);
    }
  }
}

const content = new Content(
  'Shapes and Corners',
  [
    new Section1(),
    new Section2(),
    new Section3(),
  ],
  LessonDiagram,
);

export default content;
