// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord,
  centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import { Transform } from '../../../js/diagram/tools/g2';
// import { easeinout } from '../../../js/diagram/tools/mathtools';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = 'Circle';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;
    const { elements } = this.diagram;

    this.addSection({
      title: 'Angle Measurement',
      setContent: () => centerV(`
        <p>
          The first shape we will explore is one you see every time you look at the |_moon|, a |_wheel|, a |_ball| and a |_ring|.
        </p>
        `),
      modifiers: {
        _moon: highlightWord('moon', '', 'english'),
        _wheel: highlightWord('wheel', '', 'english'),
        _ball: highlightWord('ball', '', 'english'),
        _ring: highlightWord('ring', '', 'english'),
      },
    });
    this.addSection({
      setContent: () => `
        <p>
          Their size, mass and what they are made of is very different.
        </p>
        <p>
          But they all have a |_common_shape|.
        </p>
        `,
      modifiers: {
        _common_shape: actionWord('common shape', 'id_common', colors.circle),
      },
      showOnly: [
        elements._moon,
        elements._wheel,
        elements._ball,
        elements._ring,
        elements._circleShape,
      ],
      setState: () => {
        elements.resetColors();
        elements.varState.shapeTurn = 0;
        elements._moon.transform.updateTranslation(layout.moon.center);
        elements._wheel.transform.updateTranslation(layout.wheel.center);
        elements._ball.transform.updateTranslation(layout.ball.center);
        elements._ring.transform.updateTranslation(layout.ring.center);
        elements._circleShape.transform.updateTranslation(layout.circleShape.center);
        onClickId('id_common', elements.toggleShape, [elements]);
      },
    });
    this.addSection({
      title: 'Name',
      setContent: () => centerV(`
        <p>
          If you were naming this shape today, you might name it after a familiar object. 
        </p>
        <p>
          For example, you might call it a |_moon| shape, or a |_ring|.
        </p>
        <p>
          However, this shape has been studied for thousands of years, and therefore it already has a common name.
        </p>
        `),
      modifiers: {
        _moon: highlightWord('moon', '', 'english'),
        _ring: highlightWord('ring', '', 'english'),
      },
    });
    this.addSection({
      setContent: () => centerV(`
        <p>
          In ancient |_Greek|, the name |_krikos| was used. This was also their word for |_ring|.
        </p>
        <p>
          In |_Latin|, the word for |_ring| was also used, |_circulus|.
        </p>
        <p>
          Today, we use the name |_circle| which comes from the Latin root.
        </p>
        `),
      modifiers: {
        _Greek: highlightWord('Greek', '', 'greek'),
        _krikos: highlightWord('krikos', '', 'greek'),
        _ring: highlightWord('ring', '', 'english'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _circulus: highlightWord('circulus', '', 'latin'),
        _circle: highlightWord('circle', '', 'english'),
      },
    });
    this.addSection({
      title: 'Create a Circle',
      setContent: () =>
        `
        <p>
          We can create a circle, by |_anchoring| a |_line| at one end and |_pushing| the other.
        </p>
        <p>
          If we trace the free end, we get a |_circle|.
        </p>
        `,
      modifiers: {
        _anchoring: actionWord('anchoring', 'id_anchor', colors.anchor),
        _line: actionWord('line', 'id_line', colors.radius),
        _pushing: actionWord('pushing', 'id_push', colors.circle),
        _circle: actionWord('circle', 'id_circle', colors.circle),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._anchor,
        circle._arc,
      ],
      setState: () => {
        elements.resetCircle();
        elements.resetColors();
        circle.transform.updateTranslation(layout.circle.center);
        circle._radius.transform.updateRotation(0.001);
        elements.updateRotation();
        onClickId('id_anchor', elements.pulseAnchor, [elements]);
        onClickId('id_line', elements.pulseRadius, [elements]);
        onClickId('id_push', elements.pushRadius, [elements]);
        onClickId('id_circle', elements.rotateTo, [elements, Math.PI * 1.999, 1, 1, elements.pulseArc.bind(elements)]);
      },
    });
    this.addSection({
      setContent: () => centerV(`
        <p>
          We've now identified a shape, named it, and know how to create it.
        </p>
        <p>
          Next we need to be able to describe it, by identifying some of its |_properties|.
        </p>
        `),
      modifiers: {
        _properties: highlightWord('properties', '', colors.diagram.text.keyword),
      },
    });
    this.addSection({
      setContent: () => centerV(`
        <p>
          Similar to the word circle, when properties were first studied they were given names that used words from every day language.
        </p>
        <p>
          Many property names we use today come from their ancient roots.
        </p>
        <p>
          However, as language has changed considerably in that time, these property names are less intuitive, and often just have to be remembered.
        </p>
        `),
      // modifiers: {
      //   _properties: highlightWord('properties', '', colors.diagram.text.keyword),
      //   _intuitive: highlightWord('intuitive', '', colors.diagram.text.keyword),
      // },
    });
    this.addSection({
      title: 'Center',
      setContent: () => `
        <p>
          The first property we will consider is the |_anchor|, which is normally called the |_center_point|.
        </p>
        <p>
          The word |_center| comes from the |_Latin| word |_centrum| which means |_middle|. 
        </p>
        `,
      modifiers: {
        _center_point: actionWord('center point', 'id_center', colors.anchor),
        _anchor: actionWord('anchor', 'id_anchor', colors.anchor),
        _center: highlightWord('center', '', 'english'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _centrum: highlightWord('centrum', '', 'latin'),
        _middle: highlightWord('middle', '', 'english'),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._anchor.color = colors.anchor;
        onClickId('id_anchor', elements.pulseAnchor, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        // circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_center| property can be used to describe the |_location| of the circle.
        </p>
        `,
      modifiers: {
        _center: actionWord('center', 'id_center', colors.anchor),
        _location: highlightWord('location', '', 'english'),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._anchor.color = colors.anchor;
        onClickId('id_anchor', elements.pulseAnchor, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        // circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      setContent: () => `
        <p>
          |_move| the circle around and observe how the center point is its |_location|.
        </p>
        `,
      modifiers: {
        _move: actionWord('Move', 'id_push', colors.push),
        _location: actionWord('location', 'id_loc', colors.anchor),
      },
      setState: () => {
        circle.moveLocation();
        elements._grid._linesAndLabels.showAll();
        elements._grid._locationText.showAll();
        elements.updateLocation();

        onClickId('id_location_text', elements.pulseAnchor, [elements]);
        onClickId('id_push', elements.pushCircle, [elements]);
        onClickId('id_loc', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._circumference,
        elements._grid,
        elements._grid._linesAndLabels,
        elements._grid._locationText,
      ],
    });

    this.addSection({
      title: 'Radius',
      setContent: () => `
        <p>
          Another property is the length of the |_line|, which we call |_radius|.
        </p>
        <p>
          |_radius2| comes from the |_Latin| word |_radiusLatin| which means the |_spoke_of_a_chariot_wheel|. 
        </p>
        `,
      modifiers: {
        _radius: actionWord('radius', 'id_radius', colors.radius),
        _radius2: actionWord('Radius', 'id_radius2', colors.radius),
        _line: actionWord('line', 'id_line', colors.radius),
        _radiusLatin: highlightWord('radius', '', 'latin'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _spoke_of_a_chariot_wheel: highlightWord('spoke of a chariot wheel', '', 'english'),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._radius.color = colors.radius;

        onClickId('id_line', elements.pulseRadius, [elements]);
        onClickId('id_radius', elements.pulseRadius, [elements]);
        onClickId('id_radius2', elements.pulseRadius, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_radius| describes the circle's size and is any line between the |_center| and the |_edge|.
        </p>
        <p>
          The circle's |_width| can be thought of as |_two_radius_lengths|.
        </p>
        `,
      modifiers: {
        _radius: actionWord('radius', 'id_radius', colors.radius),
        _center: actionWord('center', 'id_center', colors.anchor),
        _edge: actionWord('edge', 'id_edge', colors.circle),
        _width: highlightWord('width', '', 'english'),
        _two_radius_lengths: highlightWord('two radius lengths', '', 'english'),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._radius.color = colors.radius;
        onClickId('id_radius', elements.pulseRadius, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
        onClickId('id_edge', elements.pulseCircumference, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      title: 'Diameter',
      setContent: () => `
        <p>
          There is another name for the |_width| of a circle: |_diameter|.
        <p>
          In ancient Greek word |_diametros| was used, which itself came from their words |_dia| (|_across|) and |_metros| (|_measure|).
        </p>
        `,
      modifiers: {
        _diametros: highlightWord('diametros', '', 'greek'),
        _dia: highlightWord('dia', '', 'greek'),
        _metros: highlightWord('metros', '', 'greek'),
        _across: highlightWord('across', '', 'english'),
        _width: highlightWord('width', '', 'english'),
        _measure: highlightWord('measure', '', 'english'),
        _diameter: actionWord('diameter', 'id_diameter', colors.diameter),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._diameter.showAll();
        // circle._radius.color = colors.radius;
        onClickId('id_diameter', elements.pulseDiameter, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._diameter,
        circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_diameter| can also be thought of as any line that runs between two points on the circle and through the |_center|.
        <p>
        `,
      modifiers: {
        _diameter: actionWord('diameter', 'id_diameter', colors.diameter),
        _center: actionWord('center', 'id_center', colors.anchor),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._diameter.showAll();
        // circle._radius.color = colors.radius;
        onClickId('id_diameter', elements.pulseDiameter, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._diameter,
        circle._radius,
        circle._circumference,
      ],
    });
    this.addSection({
      title: 'Circumference',
      setContent: () => `
        <p>
          Another property is |_length| of the circle |_edge|.
        </p>
        <p>
          The edge can be |_straightened| out to see the length more easily.
        </p>
        `,
      modifiers: {
        _length: highlightWord('length', '', 'english'),
        _edge: highlightWord('edge', '', 'english'),
        _straightened: actionWord('straightened', 'id_straight', colors.circle),
      },
      setState: () => {
        elements.resetCircle();
        elements._straightCircumference.showAll();
        elements.straighten(0);
        // elements._straightCircumference.transform.updateScale(1, 1);
        // elements._straightCircumference.transform.updateTranslation(layout.circle.center);
        onClickId('id_straight', elements.straightenCircumference, [elements]);
      },
      showOnly: [
        circle,
        elements._straightCircumference,
      ],
    });
    this.addSection({
      setContent: () => `
        <p>
          In |_Latin|, this property's name came from the words |_circum| (|_carry|) and |_ferre| (|_around|) and was |_circumferentia|.
        </p>
        <p>
          Today, we use this Latin root and call it the |_circumference|.
        </p>
        `,
      modifiers: {
        _length: highlightWord('length', '', 'english'),
        _edge: highlightWord('edge', '', 'english'),
        _circum: highlightWord('circum', '', 'latin'),
        _ferre: highlightWord('ferre', '', 'latin'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _circumferentia: highlightWord('circumferentia', '', 'latin'),
        _carry: highlightWord('carry', '', 'english'),
        _around: highlightWord('around', '', 'english'),
        _circumference: actionWord('circumference', 'id_straight', colors.circle),
      },
      setState: () => {
        elements.resetCircle();
        elements._straightCircumference.showAll();
        elements.straighten(0);
        // elements._straightCircumference.transform.updateScale(1, 1);
        // elements._straightCircumference.transform.updateTranslation(layout.circle.center);
        onClickId('id_straight', elements.straightenCircumference, [elements]);
      },
      showOnly: [
        // circle,
        elements._straightCircumference,
      ],
    });
    this.addSection({
      setContent: () => centerV(`
        <p>
          So, if we were discovering the circle today, we might have called it a |_ring|, with properties |_middle|, |_wheel_spoke|, |_width|, and |_carry_around|.
        </p>
        <p>
          This would make it easier for people learning about it today.
        </p>
        <p>
          However, as it was studied a long time ago, it is called a |_circle|, with properties |_center|, |_radius|, |_diameter| and |_circumference|.
        </p>
        `),
      modifiers: {
        _length: highlightWord('length', '', 'english'),
        _wheel_spoke: highlightWord('wheel spoke', '', 'english'),
        _width: highlightWord('width', '', 'english'),
        _ring: highlightWord('ring', '', 'english'),
        _carry_around: highlightWord('carry-around', '', 'english'),
        _middle: highlightWord('middle', '', 'english'),
        _center: highlightWord('center', '', 'english'),
        _radius: highlightWord('radius', '', 'english'),
        _circle: highlightWord('circle', '', 'english'),
        _diameter: highlightWord('diameter', '', 'english'),
        _circumference: highlightWord('circumference', '', 'english'),
      },
    });
    this.addSection({
      title: 'Summary',
      setContent: () => `
        <p>
          Change the |_properties| to see how the |_circle| changes.
        </p>
        `,
      modifiers: {
        _properties: highlightWord('properties', '', 'english'),
        _circle: highlightWord('circle', '', 'english'),
      },
      setState: () => {
        circle.moveLocation();
        elements._grid._locationText.transform.updateTranslation(layout.locationText.top);
        elements._grid.showAll();
        elements._grid._slider.set(0.5);
        elements.updateSlider();
        elements.straighten(0);
        elements._straightCircumference.showAll();
        // elements._straightCircumference.straighten(0);
        onClickId('id_circumference_text', elements.straightenCircumference, [elements]);
        onClickId('id_radius_text', elements.toggleRadius, [elements]);
        onClickId('id_diameter_text', elements.toggleDiameter, [elements]);
        onClickId('id_location_text', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._circumference,
        elements._grid,
        elements._straightCircumference,
      ],
    });
  }
}

export default Content;
