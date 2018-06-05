// @flow

// import { Lesson } from '../../js/Lesson/Lesson';
import { LessonContent, actionWord, onClickId } from '../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Transform } from '../../js/diagram/tools/g2';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Shapes and Corners';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
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
        // _shapes_diagram: diagramCanvas('shapes_container', LessonDiagram),
      },
      setState: () => {
        const { diagram } = this;
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
      setState: () => {
        const { diagram } = this;
        const collection = diagram.elements._circle;

        diagram.elements.showOnly([
          collection._fakeRadius,
          collection._reference,
          collection,
        ]);

        collection._fakeRadius.transform.updateTranslation(-4.5, 1);
        collection._fakeRadius.transform.updateRotation(0);
        collection._fakeRadius.animateTo(new Transform()
          .rotate(Math.PI / 2)
          .translate(-1, 0), 1, 1);

        collection._reference.transform.updateTranslation(4.5, 1);
        collection._reference.transform.updateRotation(Math.PI);
        collection._reference.animateTo(new Transform()
          .rotate(Math.PI / 2)
          .translate(1, 0), 1, -1);


        onClickId('id_line', collection.pulseLines, [collection]);
      },
      // position: {
      //   _circle_reference: true,
      // },
      // showOnly: {
      //   circle: [
      //     'reference',
      //     'fakeReference',
      //   ],
      // },
      // position: {
      //   circle: {
      //     reference: new Transform().rotate(Math.PI / 2).translate(1, 0),
      //     fakeRadius: new Transform().rotate(Math.PI / 2).translate(-1, 0),
      //   },
      // },
      // animateFromPrev: {
      //   circle: {
      //     reference: 1,
      //     fakeRadius: 1,
      //   },
      // },
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
      setState: () => {
        const { diagram } = this;
        const collection = diagram.elements._circle;

        diagram.elements.showOnly([
          collection._radius,
          collection._reference,
          collection._arrow,
          collection,
        ]);

        const t = collection._fakeRadius.transform.t();
        collection._radius.transform.updateTranslation(t.x, t.y);
        collection._radius.transform.updateRotation(collection._fakeRadius.transform.r());
        collection._radius.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 2);

        collection._reference.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 1);


        onClickId('id_line', collection.pulseLines, [collection]);
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
        this.diagram.elements._circle.rotateTo(3, 0, 1, done);
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
  }
}

// const content = new newContent(
//   'Shapes and Corners',
//   [],
//   LessonDiagram,
// );

export default Content;
