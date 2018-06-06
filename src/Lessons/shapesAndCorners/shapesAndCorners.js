// @flow

// import { Lesson } from '../../js/Lesson/Lesson';
import { LessonContent, actionWord, onClickId } from '../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Transform } from '../../js/diagram/tools/g2';
import { easeinout } from '../../js/diagram/tools/mathtools';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Shapes and Corners';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const shapes = this.diagram.elements._shapes;
    const circle = this.diagram.elements._circle;

    this.addSection({
      title: 'Corners',
      setContent: () =>
        `<p style="margin-top:10%">
          Many |_shapes| have |_corners|.
        </p> <p>
          Somes corners are |_more_sharp|, while others are |_less_sharp|.
        </p> <p style="margin-top:35%">
          The sharpness of the corner is a property that can describe a shape.
        </p> <p>
          So how can we <b>measure</b> sharpness? What <b>name</b> do we give to the sharpness?
        </p>`,
      modifiers: {
        _shapes: actionWord('shapes', 'id_shapes'),
        _corners: actionWord('corners', 'id_corners'),
        _more_sharp: actionWord('more sharp', 'id_more_sharp'),
        _less_sharp: actionWord('less sharp', 'id_less_sharp'),
      },
      hideOnly: [
        circle,
        shapes._square._corners,
        shapes._square._lessSharpCorners,
        shapes._triangle._moreSharpCorners,
        shapes._triangle._corners,
        shapes._pent._corners,
        shapes._pent._moreSharpCorners,
        shapes._pent._lessSharpCorners,
      ],
      setState: () => {
        const { diagram } = this;
        const collection = diagram.elements._shapes;

        onClickId('id_shapes', collection.pulseShapes, [collection]);
        onClickId('id_corners', collection.toggleCorners, [collection]);
        onClickId('id_more_sharp', collection.toggleMoreSharpCorners, [collection]);
        onClickId('id_less_sharp', collection.toggleLessSharpCorners, [collection]);
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:10%">
          Let's start with two |_lines|.
        </p>
        <p style="margin-top:40%">
          Let's now move the two lines on top of each other and anchor one end.
        </p>
        `,
      modifiers: {
        _lines: actionWord('lines', 'id_line'),
      },
      showOnly: () => {
        this.diagram.elements.showOnly([
          circle._fakeRadius,
          circle._reference,
          circle,
        ]);
      },
      setState: () => {
        const { diagram } = this;
        const collection = diagram.elements._circle;

        circle._fakeRadius.transform.updateTranslation(-1, 0);
        circle._fakeRadius.transform.updateRotation(Math.PI / 2);
        circle._reference.transform.updateTranslation(1, 0);
        circle._reference.transform.updateRotation(Math.PI / 2);

        onClickId('id_line', collection.pulseLines, [collection]);
      },
      transitionFromAny: (done) => {
        circle._fakeRadius.animateTo(new Transform()
          .rotate(Math.PI / 2)
          .translate(-1, 0), 1);

        circle._reference.animateTo(new Transform()
          .rotate(Math.PI / 2)
          .translate(1, 0), 1, 0, easeinout, done);
      },
      transitionFromPrev: (done) => {
        circle._fakeRadius.transform.updateTranslation(-4.5, 1);
        circle._fakeRadius.transform.updateRotation(0);
        circle._reference.transform.updateTranslation(4.5, 1);
        circle._reference.transform.updateRotation(Math.PI);
        done();
      },
      transitionFromNext: (done) => {
        const t = circle._radius.transform.t();
        const r = circle._radius.transform.r();
        circle._fakeRadius.transform.updateTranslation(t.x, t.y);
        circle._fakeRadius.transform.updateRotation(r);
        done();
      },
    });
    this.addSection({
      setContent: () => `
        <p style="margin-top:10%">
          Let's now move the two lines on top of each other and anchor one end.
        </p>
        `,
      modifiers: {
        // _lines: actionWord('lines', 'id_line'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arrow,
      ],
      setState: () => {
        const { diagram } = this;
        const collection = diagram.elements._circle;

        circle._radius.transform.updateRotation(0);
        circle._radius.transform.updateTranslation(0, 0);
        circle._reference.transform.updateRotation(0);
        circle._reference.transform.updateTranslation(0, 0);
        onClickId('id_line', collection.pulseLines, [collection]);
      },
      transitionPrev: (done) => {
        circle._fakeRadius.transform = circle._radius.transform.copy();
        done();
      },
      transitionFromPrev: (done) => {
        const t = circle._fakeRadius.transform.t();
        circle._radius.transform.updateTranslation(t.x, t.y);
        circle._radius.transform.updateRotation(circle._fakeRadius.transform.r());

        circle._reference.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 1);
        circle._radius.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 2, 0, easeinout, done);
      },
    });

    this.addSection({
      setContent: () => `
        |_circle_diagram|
        <p>
          Let's start with two lines |_anchored| at one end. One |_line| can be
          rotated around the anchor.
        </p>
        `,
      modifiers: {
        _line: actionWord('line', 'id_line'),
        _anchored: actionWord('anchored', 'id_anchor'),
        // _circle_diagram: diagramCanvas('circle_container', LessonDiagram),
      },
      getState: () => {
        const angle = this.diagram.elements._circle._radius.transform.r();
        return {
          angle,
        };
      },
      transitionNext: (done) => {
        circle.rotateTo(3, 0, 1, done);
      },

      setState: (previousState: Object) => {
        const { diagram } = this;
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

        onClickId('id_line', collection.pulseRadius, [collection]);
        onClickId('id_anchor', collection.pulseAnchor, [collection]);
      },
    });

  /* eslint-disable */
    // class Section2 extends Section {
    //   setContent() {
    //     return 
    //   }
    //   setModifiers() {
    //     return {
    //       _line: actionWord('line', 'id_line'),
    //       _anchored: actionWord('anchored', 'id_anchor'),
    //       _circle_diagram: diagramCanvas('circle_container', LessonDiagram),
    //     };
    //   }

    //   getState(diagrams: Object): Object {
    //     const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    //     const collection = diagram.elements._circle;
    //     const angle = collection._radius.transform.r();
    //     return {
    //       angle,
    //     };
    //   }

    //   transitionNext(diagrams, done) {
    //     const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    //     const collection = diagram.elements._circle;
    //     if (diagram) {
    //       collection.rotateTo(3, 0, 1, done);
    //     }
    //   }

      
    // }

    // class Section3 extends Section {
    //   setTitle() {
    //     return 'Make a corner';
    //   }
    //   setContent() {
    //     return `
    //       <p>
    //         The two lines form a |_corner| at the anchor.
    //       </p><p>
    //         |_Small_rotation| results in a |_sharper_corner| corner. |_Large_rotation| results in a |_less_sharp_corner| corner.
    //       </p>`;
    //   }
    //   setModifiers() {
    //     return {
    //       _corner: actionWord('corner', 'id_corner'),
    //       _Small_rotation: actionWord('Small Rotation', 'id_small_rotation'),
    //       _Large_rotation: actionWord('Large Rotation', 'id_large_rotation'),
    //       _sharper_corner: actionWord('sharper', 'id_more_sharp_cornern'),
    //       _less_sharp_corner: actionWord('less sharp', 'id_less_sharp_corner'),
    //     };
    //   }

    //   setSinglePagePrimary() {
    //     return false;
    //   }

    //   getState(diagrams: Object): Object {
    //     const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    //     const collection = diagram.elements._circle;
    //     const angle = collection._radius.transform.r();
    //     return {
    //       angle,
    //     };
    //   }

    //   setState(
    //     diagrams: Object,
    //     previousState: Object,
    //     lessonType: 'multiPage' | 'singlePage',
    //   ) {
    //     const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    //     const collection = diagram.elements._circle;
    //     if (diagram) {
    //       if (lessonType === 'multiPage') {
    //         const t = collection._radius.transform.copy();
    //         if ('angle' in previousState) {
    //           t.updateRotation(previousState.angle);
    //         } else {
    //           t.updateRotation(Math.PI / 3);
    //         }
    //         collection._radius.setTransform(t);

    //         collection.hideOnly([
    //           collection._cornerRad,
    //           collection._cornerRef,
    //           diagram.elements._shapes,
    //         ]);
    //       }
    //       // const diagram = diagrams.circle_container;
    //       this.onClickId('id_corner', collection.toggleCorners, [collection]);
    //       const smallRotation = [collection, Math.PI / 6, 0, 1, () => {}];
    //       const largeRotation = [collection, 5 * Math.PI / 6, 0, 1, () => {}];
    //       this.onClickId('id_small_rotation', collection.rotateTo, smallRotation);
    //       this.onClickId('id_large_rotation', collection.rotateTo, largeRotation);
    //       this.onClickId('id_more_sharp_cornern', collection.rotateTo, smallRotation);
    //       this.onClickId('id_less_sharp_corner', collection.rotateTo, largeRotation);
    //     }
    //   }

    //   transitionPrev(diagrams, done) {
    //     const diagram = diagrams.circle_container || diagrams.multipage_diagram;
    //     const collection = diagram.elements._circle;
    //     if (diagram) {
    //       collection.rotateTo(1, 0, 1, done);
    //     }
    //   }
    // }
    /* eslint-enable */
  }
}

// const content = new newContent(
//   'Shapes and Corners',
//   [],
//   LessonDiagram,
// );

export default Content;
