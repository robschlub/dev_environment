// @flow

// import { Lesson } from '../../../js/Lesson/Lesson';
import { LessonContent, actionWord, onClickId } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Point } from '../../../js/diagram/tools/g2';
// import CircleDiagram from './diagramCircle';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Shapes and Corners';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    this.addSection({
      title: 'Shapes',
      setContent: () =>
        `<div id="section1__upper">
        <p>Many |_shapes| have |_corners|.</p>
        <p>
          Somes corners are |_more_sharp|, while others are |_less_sharp|.
        </p>
        </div>,
        <div id="section1__lower">,
        <p>
          The sharpness of the corner is a property that can describe a shape.
        </p>
        <p>
          So how can you measure sharpness? What name do we give to the 
          sharpness?
        <p>
        </div>`,
      modifiers: {
        _shapes: actionWord('shapes', 'id_shapes'),
        _corners: actionWord('corners', 'id_corners'),
        _more_sharp: actionWord('more sharp', 'id_more_sharp'),
        _less_sharp: actionWord('less sharp', 'id_less_sharp'),
      },
      setSteadyState: () => {
        const collection = this.diagram.elements._shapes;
        this.diagram.elements.hideOnly([
          this.diagram.elements._circle,
          collection._square._corners,
          collection._square._lessSharpCorners,
          collection._triangle._moreSharpCorners,
          collection._triangle._corners,
          collection._pent._corners,
          collection._pent._moreSharpCorners,
          collection._pent._lessSharpCorners,
        ]);

        // console.log("setState", diagram.elements._shapes.lastDrawTransform.matrix())
        // diagram.elements._shapes.eq1.calcSize(new Point(-1, -1), 0.2, null);
        this.diagram.elements._shapes.eq5.calcSize(new Point(-2, 1), 0.2);
        this.diagram.elements._shapes._eq5Elements.setMoveBoundaryToDiagram();
        // diagram.elements._shapes.isTouchable = false;
        // diagram.elements._shapes._eq2Elements.LimitMoveToDiagram();

        onClickId('id_shapes', collection.pulseShapes, [collection]);
        onClickId('id_corners', collection.toggleCorners, [collection]);
        onClickId('id_more_sharp', collection.toggleMoreSharpCorners, [collection]);
        onClickId('id_less_sharp', collection.toggleLessSharpCorners, [collection]);
      },
    });
    this.addSection({
      setContent: () =>
        `<p>
          Let's start with two lines |_anchored| at one end. One |_line| can be
          rotated around the anchor.
        </p>`,
      modifiers: {
        _line: actionWord('line', 'id_line'),
        _anchored: actionWord('anchored', 'id_anchor'),
        // _circle_diagram: diagramCanvas('circle_container', LessonDiagram),
      },
      getState: () => {
        const collection = this.diagram.elements._circle;
        const angle = collection._radius.transform.r();
        return {
          angle,
        };
      },
      transitionNext(done) {
        this.diagram.elements._circle.rotateTo(3, 0, 1, done);
      },

      setSteadyState: (previousState: Object) => {
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
        diagram.elements._shapes.hideAll();
        // diagram.elements._shapes._eq2Elements.showAll();
        diagram.elements._shapes.show();
        // diagram.elements._shapes.eq3.animateTo(new Point(-1, -1), 0.2, null, 2);
        diagram.elements._shapes.eq6.animateTo(new Point(-2, 1), 0.2, 2);

        onClickId('id_line', collection.pulseRadius, [collection]);
        onClickId('id_anchor', collection.pulseAnchor, [collection]);
      },
    });

    this.addSection({
      title: 'Make a corner',
      setContent: () =>
        `<p>
          The two lines form a |_corner| at the anchor.
        </p><p>
          |_Small_rotation| results in a |_sharper_corner| corner. |_Large_rotation| results in a |_less_sharp_corner| corner.
        </p>`,
      modifiers: {
        _corner: actionWord('corner', 'id_corner'),
        _Small_rotation: actionWord('Small Rotation', 'id_small_rotation'),
        _Large_rotation: actionWord('Large Rotation', 'id_large_rotation'),
        _sharper_corner: actionWord('sharper', 'id_more_sharp_cornern'),
        _less_sharp_corner: actionWord('less sharp', 'id_less_sharp_corner'),
      },
      getState: () => {
        const angle = this.diagram.elements._circle._radius.transform.r();
        return {
          angle,
        };
      },

      setSteadyState: (previousState: Object) => {
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
          collection._grid,
        ]);

        // const diagram = diagrams.circle_container;
        onClickId('id_corner', collection.toggleCorners, [collection]);
        const smallRotation = [collection, Math.PI / 6, 0, 1, () => {}];
        const largeRotation = [collection, 5 * Math.PI / 6, 0, 1, () => {}];
        onClickId('id_small_rotation', collection.rotateTo, smallRotation);
        onClickId('id_large_rotation', collection.rotateTo, largeRotation);
        onClickId('id_more_sharp_cornern', collection.rotateTo, smallRotation);
        onClickId('id_less_sharp_corner', collection.rotateTo, largeRotation);
      },

      transitionPrev: (done) => {
        this.diagram.elements._circle.rotateTo(1, 0, 1, done);
      },
    });
  }
}

export default Content;
