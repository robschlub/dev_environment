// @flow

// import { Lesson } from '../../js/Lesson/Lesson';
import { LessonContent, actionWord, onClickId, highlightWord } from '../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Transform, Point } from '../../js/diagram/tools/g2';
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
      setContent: () =>
        `<p style="margin-top:27%; text-align:center;">
          |_mathematics_is_a_powerful_tool|
        </p> 
        <p style="margin-top:10%; text-align:center;">
          We use it to understand and predict the world around us.
        </p>
        `,
      modifiers: {
        _mathematics_is_a_powerful_tool:
          highlightWord('Mathematics is a powerful tool.', '', 'english'),
      },
    });
    this.addSection({
      setContent: () => `
        <p style="margin-top:23%;">
          Mathematics describes an object or phenomenon in a more |_simple|, and more |_general| way.
        </p>
        <p style="margin-top:5%;">
          Describing something more |_simply|, makes it easier to study and understand.
        </p>
        <p style="margin-top:5%;">
          Describing something more |_generally|, means the understanding can be reapplied to other scenarios.
        </p>
        `,
      showOnly: [],
      modifiers: {
        _simple: highlightWord('simple', '', 'english'),
        _general: highlightWord('general', '', 'english'),
        _simply: highlightWord('simply', '', 'english'),
        _generally: highlightWord('generally', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:27%;">
          A large area of mathematics is the study of |_shapes|.
        </p>
        <p style="margin-top:10%;">
          |_Shape| are simple generalizations of |_objects| and the |_paths| they travel.
        </p>
        `,
      showOnly: [],
      modifiers: {
        _shapes: highlightWord('shapes', '', 'english'),
        _Shape: highlightWord('Shapes', '', 'english'),
        _objects: highlightWord('objects', '', 'english'),
        _paths: highlightWord('paths', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:5%;">
          For example, a |_wheel| is a physical thing.
        </p>
        <p>
          It is made of different materials, has mass, size, location and a smell.
        </p>
        <p>
        In mathematics, a |_shape| can be used to describe the wheel in a more simple, general way.
        </p>
        `,
      showOnly: [
        circle,
        circle._wheel,
      ],
      modifiers: {
        _wheel: highlightWord('wheel', '', 'english'),
        _shape: actionWord('shape', 'id_shape'),
      },
      setState: () => {
        circle._wheel.transform.updateTranslation(0, 0);
        onClickId('id_shape', circle.showWheelShape, [circle, () => {}]);
      },
      transitionNext: (done) => {
        if (circle._wheel.transform.t().x === 0) {
          circle.showWheelShape(done);
        } else {
          done();
        }
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:5%;">
          The shape can then be studied.
        </p>
        <p>
          |_Properties| can be discovered that describe the shape, and predict
          other properties.
        </p>
        `,
      showOnly: [
        circle,
        circle._wheelShape,
        circle._diameterDimension,
        circle._circumferenceDimension,
      ],
      modifiers: {
        _Properties: highlightWord('Properties', '', 'english'),
      },
      transitionFromAny: (done) => {
        circle._circumferenceDimension.showAll();
        circle._diameterDimension.showAll();

        const t = circle._wheelShape.transform.t();
        circle._circumferenceDimension.transform.updateTranslation(t.x, t.y);
        circle._diameterDimension.transform.updateTranslation(t.x, t.y);
        circle._diameterDimension.appear(1);
        circle._diameterDimension.animateCustomTo(
          circle._diameterDimension.grow.bind(circle),
          1.5,
        );

        const makeEquation = () => {
          circle._equation.show = true;
          circle.equationTextToInitialPositions();
          circle._equation._d.disolveIn(0.5);
          circle._equation._c.disolveIn(0.5);
          circle.eqn.animateTo(new Point(-1, 0), 1, 2);
          circle._equation._equals.disolveInWithDelay(2, 1);
          circle._equation._pi.disolveInWithDelay(2, 1, done);
        };

        circle._circumferenceDimension.appearWithDelay(1.5, 1);
        circle._circumferenceDimension.animateCustomToWithDelay(
          1.5,
          circle._circumferenceDimension.grow.bind(circle),
          1.5,
          easeinout,
          makeEquation.bind(circle),
        );
      },
      setState: () => {
        circle._circumferenceDimension.showAll();
        circle._diameterDimension.showAll();
        // circle._wheel.transform.updateTranslation(0, 0);
        onClickId('id_shape', circle.showWheelShape, [circle]);
      },
    });

    this.addSection({
      title: 'Corners',
      setContent: () =>
        `<p style="margin-top:10%">
          Many |_shapes| have not |_corners|.
        </p> <p>
          Somes corners are |_more_sharp|, while others are |_less_sharp|.
        </p><p style="margin-top:35%">
          The |_sharpness| of the corner is a property that can describe a shape.
        </p>`,
      modifiers: {
        _shapes: actionWord('shapes', 'id_shapes'),
        _corners: actionWord('corners', 'id_corners'),
        _more_sharp: actionWord('more sharp', 'id_more_sharp'),
        _less_sharp: actionWord('less sharp', 'id_less_sharp'),
        _sharpness: highlightWord('sharpness', '', 'english'),
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
        // const { diagram } = this;
        // const collection = diagram.elements._shapes;

        onClickId('id_shapes', shapes.pulseShapes, [shapes]);
        onClickId('id_corners', shapes.toggleCorners, [shapes]);
        onClickId('id_more_sharp', shapes.toggleMoreSharpCorners, [shapes]);
        onClickId('id_less_sharp', shapes.toggleLessSharpCorners, [shapes]);
      },
    });

    this.addSection({
      setContent: () =>
        `<p style="margin-top:25%; text-align:center;">
          How can we |_measure| corner sharpness?
        </p> <p style="margin-top:10%; text-align:center;">
          What |_name| do we give to the sharpness?
        </p>`,
      showOnly: [],
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
        _name: highlightWord('name', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:10%">
          Let's start with two |_lines|.
        </p>
        `,
      modifiers: {
        _lines: actionWord('lines', 'id_reference_lines'),
      },
      showOnly: () => {
        this.diagram.elements.showOnly([
          circle._fakeRadius,
          circle._reference,
          circle,
        ]);
      },
      setState: () => {
        // const { diagram } = this;
        circle._fakeRadius.transform.updateTranslation(-1, 0);
        circle._fakeRadius.transform.updateRotation(Math.PI / 2);
        circle._reference.transform.updateTranslation(1, 0);
        circle._reference.transform.updateRotation(Math.PI / 2);

        onClickId('id_reference_lines', circle.pulseLines, [circle]);
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
        circle._fakeRadius.transform = circle._radius.transform.copy();
        done();
      },
    });
    this.addSection({
      setContent: () => `
        <p style="margin-top:10%">
          Let's now move the two lines on top of each other and |_anchor| one end.
        </p>
        <p>
          Rotate one line by |_pushing| the free end.
        </p>
        `,
      modifiers: {
        _anchor: actionWord('anchor', 'id_anchor'),
        _pushing: actionWord('pushing', 'id_push'),
        _corner: actionWord('corner', 'id_corner'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._anchor,
      ],
      setState: () => {
        // const { diagram } = this;
        // const collection = diagram.elements._circle;

        circle._radius.transform.updateRotation(0.01);
        circle._radius.transform.updateTranslation(0, 0);
        circle._reference.transform.updateRotation(0);
        circle._reference.transform.updateTranslation(0, 0);
        circle._anchor.color = circle.colors.anchor.slice();
        onClickId('id_anchor', circle.pulseAnchor, [circle]);
        onClickId('id_push', circle.pushRadius, [circle]);
        // onClickId('id_corner', circle.toggleCorners, [circle]);
        circle._arrow.show = true;
        circle.pulseArrow();
      },
      transitionPrev: (done) => {
        circle._fakeRadius.transform = circle._radius.transform.copy();
        done();
      },
      transitionFromAny: (done) => {
        circle._reference.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 1);
        circle._radius.animateTo(new Transform()
          .rotate(0)
          .translate(0, 0), 1.3, 0, easeinout, done);

        if (circle._anchor.color[3] === 0.01) {
          circle._anchor.color[3] = 1;
          circle._anchor.disolveInWithDelay(1, 0.3);
        }
      },
      transitionFromPrev: (done) => {
        circle._anchor.color[3] = 0.01;
        circle._radius.transform = circle._fakeRadius.transform.copy();
        done();
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:10%">
        The two lines form a |_corner|.</p>
        <p>|_Small_rotation| results in a sharp corner.
        |_Large_rotation| results in a less sharp corner.</p>
        `,
      modifiers: {
        _Small_rotation: actionWord('Small rotation', 'id_small_rotation'),
        _Large_rotation: actionWord('Large rotation', 'id_large_rotation'),
        _corner: actionWord('corner', 'id_corner'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._anchor,
      ],
      setState: () => {
        const smallRotation = [circle, Math.PI / 7, 0, 1, () => {}];
        const largeRotation = [circle, 5 * Math.PI / 6, 0, 1, () => {}];
        circle._anchor.color = circle.colors.anchor.slice();
        onClickId('id_small_rotation', circle.rotateTo, smallRotation);
        onClickId('id_large_rotation', circle.rotateTo, largeRotation);
        onClickId('id_corner', circle.toggleCorners, [circle]);
        circle._reference.transform.updateTranslation(0, 0);
        circle._reference.transform.updateRotation(0);
        circle._radius.transform.updateTranslation(0, 0);
      },
      transitionFromAny: (done) => {
        if (circle._radius.transform.r() < Math.PI / 6) {
          circle._reference.animateTo(new Transform()
            .rotate(0)
            .translate(0, 0), Math.PI / 6);
          circle._radius.animateTo(new Transform()
            .rotate(0.5)
            .translate(0, 0), Math.PI / 6, 0, easeinout, done);
        }
      },
    });

    this.addSection({
      title: 'Angle',
      setContent: () => `
        <p>
        So the |_amount| of |_rotation| determines the sharpness of the corner.
        </p>
        `,
      modifiers: {
        _amount: actionWord('amount', 'id_amount'),
        _rotation: actionWord('rotation', 'id_push'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._anchor,
        circle._angle,
      ],
      setState: () => {
        onClickId('id_push', circle.pushRadius, [circle]);
        onClickId('id_amount', circle.pulseAngle, [circle]);
        onClickId('id_angle', circle.pulseAngle, [circle]);
        onClickId('id_corner', circle.toggleCorners, [circle]);
        if (circle._radius.transform.r() < 0.2) {
          circle._radius.transform.updateRotation(Math.PI / 6);
        }
        circle.updateRotation();
      },
    });

    this.addSection({
      setContent: () =>
        `<p style="margin-top:20%; text-align:center;">
          What |_name| do we use for corner sharpness?
        </p> 
        <p style="margin-top:10%; text-align:center;">
          Well, the Latin word for |_corner| is |_angulus|.</p>
        <p style="margin-top:10%; text-align:center;">
          Our word for |_corner_sharpness| comes from this Latin root and is |_angle|.</p>
        </p>`,
      showOnly: [],
      modifiers: {
        _angle: highlightWord('angle', '', 'english'),
        _angulus: highlightWord('angulus', '', 'latin'),
        _corner: highlightWord('corner', '', 'english'),
        _corner_sharpness: highlightWord('corner sharpness', '', 'english'),
        _name: highlightWord('name', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p>
        So |_angle| is the word that describes how sharp a corner is.
        </p>
        <p>
        A |_larger_angle| is a less sharp corner, and a |_smaller_angle| is a more sharp corner.
        </p>
        `,
      modifiers: {
        _angle: actionWord('angle', 'id_angle'),
        _smaller_angle: actionWord('small angle', 'id_small_rotation'),
        _larger_angle: actionWord('large angle', 'id_large_rotation'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
      ],
      setState: () => {
        const smallRotation = [circle, Math.PI / 7, 0, 1, () => {}];
        const largeRotation = [circle, 5 * Math.PI / 6, 0, 1, () => {}];
        circle._anchor.color = circle.colors.anchor.slice();
        onClickId('id_small_rotation', circle.rotateTo, smallRotation);
        onClickId('id_large_rotation', circle.rotateTo, largeRotation);

        onClickId('id_angle', circle.pulseAngle, [circle]);
        if (circle._radius.transform.r() < 0.2) {
          circle._radius.transform.updateRotation(Math.PI / 6);
        }
        circle.updateRotation();
      },
    });

    this.addSection({
      setContent: () =>
        `<p style="margin-top:25%; text-align:center;">
          Now, describing the angle as more sharp or less sharp is not that useful.
        </p> 
        <p style="margin-top:15%; text-align:center;">
          So how can we more precisely describe, or |_measure| the angle?
        `,
      showOnly: [],
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
        _angle: highlightWord('angle', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p>
        First, what happens when we trace the path the line takes as we rotate it?
        </p>
        <p>
          We get a |_circle|!
        </p>
        <p>
          So one way to think of angle, is to also think of it as a portion of a circle.
        </p>
        `,
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        circle._arc,
      ],
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
        _angle: highlightWord('angle', '', 'english'),
      },
    });


    // this.addSection({
    //   setContent: () => `
    //     <p>
    //     One way is to divide a circle up into portions, and count the number of portions in an |_angle|.
    //     </p>
    //     <p>Here, a circle is divided into 12 equal portions (like a clock).
    //     </p>
    //     `,
    //   showOnly: [],
    //   modifiers: {
    //     _measure: highlightWord('measure', '', 'english'),
    //     _angle: highlightWord('angle', '', 'english'),
    //   },
    // });
  }
}

export default Content;
