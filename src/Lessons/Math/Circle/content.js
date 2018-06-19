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
          The first shape we will explore is one you see every time you look at the |_moon|, a |_wheel|, a |_ball| and a |_clock|.
        </p>
        `),
      modifiers: {
        _moon: highlightWord('moon', '', 'english'),
        _wheel: highlightWord('wheel', '', 'english'),
        _ball: highlightWord('ball', '', 'english'),
        _clock: highlightWord('clock', '', 'english'),
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
        elements._clock,
        elements._circleShape,
      ],
      setState: () => {
        elements.resetColors();
        elements.varState.shapeTurn = 0;
        elements._moon.transform.updateTranslation(layout.moon.center);
        elements._wheel.transform.updateTranslation(layout.wheel.center);
        elements._ball.transform.updateTranslation(layout.ball.center);
        elements._clock.transform.updateTranslation(layout.clock.center);
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
      title: 'Center',
      setContent: () => `
        <p>
          One property is the |_anchor|, which is normally called the |_center_point|.
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
          |_move| the circle around and observe how it's |_location| follows the center point.
        </p>
        `,
      modifiers: {
        _move: actionWord('Move', 'id_push', colors.push),
        _location: actionWord('location', 'id_loc', colors.anchor),
        // _center: actionWord('center', 'id_center', colors.anchor),
        // _location: highlightWord('location', '', 'english'),
      },
      setState: () => {
        elements._movingCircle.showAll();
        elements._grid.showAll();
        elements._movingCircle.setMoveBoundaryToDiagram([-2.5, -1.8, 2.5, 1.2]);
        elements._locationText.showAll();
        elements._movingCircle.transform.updateTranslation(layout.movingCircle.center);
        elements.updateLocation();
        // elements._movingCircle.setMoveBoundaryToDiagram();
        // circle._anchor.color = colors.anchor;
        onClickId('id_location_text', elements.pulseMovingCircleAnchor, [elements]);
        onClickId('id_push', elements.pushMovingCircle, [elements]);
        onClickId('id_loc', elements.pulseMovingCircleAnchor, [elements]);
        // onClickId('id_center', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        elements._movingCircle,
        // elements._grid,
        elements._grid,
        elements._locationText,
        // elements._gridd,
      ],
    });

    this.addSection({
      title: 'Radius',
      setContent: () => `
        <p>
          Another property is the length of the |_line|, which we call |_radius|.
        </p>
        <p>
          |_radius2| comes from the |_Latin| word |_radiusLatin| which means the spoke of a chariot wheel. 
        </p>
        `,
      modifiers: {
        _radius: actionWord('radius', 'id_radius', colors.radius),
        _radius2: actionWord('Radius', 'id_radius2', colors.radius),
        _line: actionWord('line', 'id_line', colors.radius),
        _radiusLatin: highlightWord('radius', '', 'latin'),
        _Latin: highlightWord('Latin', '', 'latin'),
      },
      setState: () => {
        elements.greyColors();
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
          The circle's width can be thought of as two radius lengths.
        </p>
        `,
      modifiers: {
        _radius: actionWord('radius', 'id_radius', colors.radius),
        _center: actionWord('center', 'id_center', colors.anchor),
        _edge: actionWord('edge', 'id_edge', colors.circle),
      },
      setState: () => {
        elements.greyColors();
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
          The ancient Greeks described the |_width| of the circle as |_diametros| - from their words |_dia| (|_across|) and |_metros| (|_measure|).
        </p>
        <p>
          Our word comes from this, and is |_diameter|. 
        </p>
        `,
      modifiers: {
        _diametros: highlightWord('diametros', '', 'greek'),
        _dia: highlightWord('dia', '', 'greek'),
        _metros: highlightWord('metros', '', 'greek'),
        _across: highlightWord('across', '', 'english'),
        _width: highlightWord('width', '', 'english'),
        _measure: highlightWord('measure', '', 'english'),
        _diameter: actionWord('diameter', 'id_diameter', colors.radius),
      },
      setState: () => {
        elements.greyColors();
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
  }
}

export default Content;
