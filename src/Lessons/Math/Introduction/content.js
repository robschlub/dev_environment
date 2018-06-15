// @flow

import {
  LessonContent, actionWord, onClickId,
  highlightWord, centerVH, centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Point } from '../../../js/diagram/tools/g2';
import { easeinout } from '../../../js/diagram/tools/mathtools';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = 'Why study shapes?';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;

    this.addSection({
      title: 'Introduction',
      setContent: () =>
        centerVH(`
          <p>
            |_mathematics_is_a_powerful_tool|
          </p> 
          <p>
            We use it to understand and predict the world around us.
          </p>
        `),
      modifiers: {
        _mathematics_is_a_powerful_tool:
          highlightWord('Mathematics is a powerful tool.', '', 'english'),
      },
    });
    this.addSection({
      setContent: () =>
        centerV(`
          <p>
            Mathematics describes an object or phenomenon in a more |_simple|, and more |_general| way.
          </p>
          <p>
            Describing something more |_simply|, makes it easier to study and understand.
          </p>
          <p>
            Describing something more |_generally|, means the understanding can be reapplied to other scenarios.
          </p>
        `),
      showOnly: [],
      modifiers: {
        _simple: highlightWord('simple', '', 'english'),
        _general: highlightWord('general', '', 'english'),
        _simply: highlightWord('simply', '', 'english'),
        _generally: highlightWord('generally', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => 
        centerV(`
          <p>
            A large area of mathematics is the study of |_shapes|.
          </p>
          <p>
            |_Shape| are simple generalizations of |_objects| and the |_paths| they travel.
          </p>
        `),
      showOnly: [],
      modifiers: {
        _shapes: highlightWord('shapes', '', 'english'),
        _Shape: highlightWord('Shapes', '', 'english'),
        _objects: highlightWord('objects', '', 'english'),
        _paths: highlightWord('paths', '', 'english'),
      },
    });

    this.addSection({
      title: 'Shape',
      setContent: () => `
        <p style="margin-top:5%;">
          For example, a |_wheel| is a physical thing.
        </p>
        <p>
          It is made of different materials, has mass, size, location and smell.
        </p>
        <p>
        `,
      showOnly: [
        circle,
        circle._wheel,
      ],
      modifiers: {
        _wheel: highlightWord('wheel', '', 'english'),
        _shape: actionWord('shape', 'id_shape', colors.circle),
      },
      setState: () => {
        circle._wheel.transform.updateTranslation(0, 0);
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:10%;">
        In mathematics, a |_shape| can be used to describe the wheel in a more simple, general way.
        </p>
        `,
      showOnly: [
        circle,
        circle._wheel,
        circle._wheelShape,
      ],
      modifiers: {
        _wheel: highlightWord('wheel', '', 'english'),
        _shape: actionWord('shape', 'id_shape', colors.circle),
      },
      setState: () => {
        circle._wheel.transform.updateTranslation(-1, 0);
        circle._wheelShape.transform.updateTranslation(1, 0);
        onClickId('id_shape', circle.showWheelShape, [circle, () => {}]);
      },
      transitionFromAny: (done) => {
        if (circle._wheel.transform.t().x === 0) {
          circle.showWheelShape(done);
        } else {
          done();
        }
      },
    });

    this.addSection({
      title: 'Properties',
      setContent: () => `
        <p>
          The shape can then be studied.
        </p>
        <p>
          |_Properties| can be discovered that describe the shape, and |_predict| other properties.
        </p>
        `,
      showOnly: [
        circle,
        circle._wheelShape,
        circle._diameterDimension,
        circle._circumferenceDimension,
      ],
      modifiers: {
        _Properties: actionWord('Properties', 'id_properties', colors.dimensions),
        _predict: actionWord('predict', 'id_predict', colors.dimensions),
      },
      transitionFromAny: (done) => {
        circle._wheelShape.transform.updateTranslation(1, 0);
        const tDiameter = 1;
        const t = circle._wheelShape.transform.t();
        circle._circumferenceDimension.transform.updateTranslation(t.x, t.y);
        circle._diameterDimension.transform.updateTranslation(t.x, t.y);
        circle.resetColors();
        circle._diameterDimension.appear(0.5);
        circle._diameterDimension.animateCustomTo(
          circle._diameterDimension.grow.bind(circle),
          tDiameter,
        );

        const makeEquation = () => {
          circle._equation.transform.updateTranslation(0, 0);
          circle._equation.show();
          circle.equationTextToInitialPositions();
          circle.eqn.animateTo(new Point(-1, 0), 1, 2);
          circle._equation._d.disolveIn(1);
          circle._equation._c.disolveIn(1);
          circle._equation._equals.disolveInWithDelay(1.5, 1);
          circle._equation._pi.disolveInWithDelay(1.5, 1, done);
        };

        circle._circumferenceDimension.appearWithDelay(tDiameter, 1);
        circle._circumferenceDimension.animateCustomToWithDelay(
          tDiameter,
          circle._circumferenceDimension.grow.bind(circle),
          1.5,
          easeinout,
          makeEquation.bind(circle),
        );
      },
      setState: () => {
        circle._circumferenceDimension.showAll();
        circle._diameterDimension.showAll();
        onClickId('id_properties', circle.pulseProperties, [circle]);
        onClickId('id_predict', circle.pulseEquation, [circle]);
      },
    });

    this.addSection({
      setContent: () => `
        <p>
        The |_properties|, and their relationships can then be applied to all other objects that have that same shape, no matter their location, size or material!
        </p>
        `,
      showOnly: [
        circle,
        circle._ball,
        circle._earth,
        circle._clock,
      ],
      modifiers: {
        _properties: actionWord('properties', 'id_properties', colors.dimensions),
      },
      setState: () => {
        circle.eqn.calcSize(new Point(0, 0), 1);
        circle._clock.transform.updateTranslation(-1.8, 0);
        circle._ball.transform.updateTranslation(0, 0);
        circle._earth.transform.updateTranslation(1.8, 0);
        onClickId('id_properties', circle.toggleProperties, [circle]);
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:10%;">
          This is tremendously powerful, and allowed the first |_calculation| of the size of our planet over 2000 years ago!
        </p>
        `,
      showOnly: [
        circle,
        circle._earth,
      ],
      setState: () => {
        circle._earth.transform.updateTranslation(-1, 0);
        onClickId('id_calculation', circle.calculateEarth, [circle]);
      },
      modifiers: {
        _calculation: actionWord('calculation', 'id_calculation', colors.dimensions),
      },
    });

    this.addSection({
      setContent: () => 
        centerV(`
          <p>
            The mathematics from studying shapes also helps us understand phenonmum we don't see, like |_sound|, |_gravity|, |_electricity|, |_radio_waves| and |_magnetism|.
          </p>
          <p>
            It is the basis of most engineering and science disciplines.
          </p>
          <p>
           But most importantly, it can be used to simply |_better_understand|.
          </p>
        `),
      modifiers: {
        _sound: highlightWord('sound', '', 'english'),
        _gravity: highlightWord('gravity', '', 'english'),
        _electricity: highlightWord('electricity', '', 'english'),
        _radio_waves: highlightWord('radio waves', '', 'english'),
        _magnetism: highlightWord('magnetism', '', 'english'),
        _better_understand: highlightWord('better understand the world we live in', '', 'english'),
      },
    });

    this.addSection({
      setContent: () => `
        <p style="margin-top:35%; ; text-align:center;">
          All from the study of simple shapes.
        </p>
        `,
    });
  }
}

export default Content;
