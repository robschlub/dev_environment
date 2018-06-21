// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord,
  centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import { Transform, Point } from '../../../js/diagram/tools/g2';
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
    const { elements } = this.diagram;
    const circle = elements._circle;
    const grid = elements._grid;

    this.addSection({
      title: 'Angle Measurement',
      setContent: () => centerV(`
        <p>
          The first shape we will explore is one you see every time you look at the |_moon|, a |_wheel|, a |_ball| or a |_ring|.
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
          Their size, mass and material is very different.
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
          If you were naming this shape today, you might name it after a |_familiar_object|. 
        </p>
        <p>
          For example, you might call it a |_moon| shape, or a |_ring|.
        </p>
        <p>
          However, this shape has been studied for thousands of years, and therefore it already has a common name.
        </p>
        `),
      modifiers: {
        _familiar_object: highlightWord('familiar object', '', 'english'),
        _moon: highlightWord('moon', '', 'english'),
        _ring: highlightWord('ring', '', 'english'),
      },
    });
    this.addSection({
      setContent: () => centerV(`
        <p>
          In ancient |_Greek|, this shape was named |_krikos|, which was their word for |_ring|.
        </p>
        <p>
          Similary |_Latin| also used the word for |_ring|, with |_circulus|.
        </p>
        <p>
          Today, our name comes from the Latin root and is |_circle|.
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
          Similar to the word |_circle|, when properties were first studied they were given names that used words from every day language.
        </p>
        <p>
          Many property names we use today come from their |_historical_roots|.
        </p>
        <p>
          However, as language has changed considerably in that time, these property names are |_less_intuitive|, and often just have to be |_remembered|.
        </p>
        `),
      modifiers: {
        _circle: highlightWord('circle', '', 'english'),
        _historical_roots: highlightWord('historical roots', '', 'english'),
        _less_intuitive: highlightWord('less intuitive', '', 'english'),
        _remembered: highlightWord('remembered', '', 'english'),
      },
    });
    this.addSection({
      title: 'Center',
      setContent: () => `
        <div class="lesson__sub_title">Property:</div>
        <p>
          |_center_point|
        </p>
        <div class="lesson__sub_title">Word Origin:</div>
        <p>
          |_Latin| word |_centrum| which means |_middle|. 
        </p>
        <div class="lesson__sub_title">Description:</div>
        <p>
          The middle of the circle.
        </p>
        `,
      modifiers: {
        // _Property: highlightWord('Property', '', colors.disabled),
        _Word_origin: highlightWord('Word origin', '', colors.disabled),
        _center_point: actionWord('Center point', 'id_center', colors.anchor),
        // _anchor: actionWord('anchor', 'id_anchor', colors.anchor),
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
          The |_center_point| can be used to describe the |_location| of the circle.
        </p>
        <p>
          It is the only point on the circle that can be identified independent of rotation.
        </p>
        `,
      modifiers: {
        _center_point: actionWord('center point', 'id_center', colors.anchor),
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
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
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
      setInitialState: () => {
        grid._locationText
          .transform.updateTranslation(layout.locationText.bottom.position);
        grid._locationText._text
          .transform.updateTranslation(layout.locationText.bottom.offset, 0);
        grid._locationText.setFirstTransform(grid.lastDrawTransform);
      },
      setState: () => {
        elements.resetCircle('forMoving');
        circle.isMovable = true;
        elements._grid._linesAndLabels.showAll();
        elements._grid._locationText.showAll();
        elements.updateLocation();
        circle.updateBoundaries();

        onClickId('id_location_text', elements.pulseAnchor, [elements]);
        onClickId('id_push', elements.pushCircle, [elements]);
        onClickId('id_loc', elements.pulseAnchor, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._circumference,
        grid,
        grid._linesAndLabels,
        grid._locationText,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
    });

    this.addSection({
      title: 'Radius',
      setContent: () => `
        <div class="lesson__sub_title">Property:</div>
        <p>
        |_radius|
        </p>
        <div class="lesson__sub_title">Word Origin:</div>
        <p>
          |_Latin| word |_radiusLatin| which means the |_spoke_of_a_chariot_wheel|. 
        </p>
        <div class="lesson__sub_title">Description:</div>
        <p>
          Length from center point to edge.
        </p>
        
        `,
      modifiers: {
        _radius: actionWord('Radius', 'id_radius', colors.radius),
        // _radius2: actionWord('Radius', 'id_radius2', colors.radius),
        // _line: actionWord('line', 'id_line', colors.radius),
        _radiusLatin: highlightWord('radius', '', 'latin'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _spoke_of_a_chariot_wheel: highlightWord('spoke of a chariot wheel', '', 'english'),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._radius.color = colors.radius;

        // onClickId('id_line', elements.pulseRadius, [elements]);
        onClickId('id_radius', elements.pulseRadius, [elements]);
        // onClickId('id_radius2', elements.pulseRadius, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._radius,
        circle._circumference,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_radius| describes the circle's size and is |_any_line| between the |_center| and the |_edge|.
        </p>
        <p>
          The |_radius2| is half the circle |_width|.
        </p>
        `,
      modifiers: {
        _radius: actionWord('radius', 'id_radius', colors.radius),
        _center: actionWord('center', 'id_center', colors.anchor),
        _edge: actionWord('edge', 'id_edge', colors.circle),
        _width: highlightWord('width', '', 'english'),
        _radius2: highlightWord('radius', '', 'english'),
        _any_line: actionWord('any line', 'id_spin', colors.radius),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._radius.color = colors.radius;
        onClickId('id_radius', elements.pulseRadius, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
        onClickId('id_edge', elements.pulseCircumference, [elements]);
        onClickId('id_spin', elements.spinRadius, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._radius,
        circle._circumference,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
    });
    this.addSection({
      title: 'Diameter',
      setContent: () => `
        <div class="lesson__sub_title">Property:</div>
        <p>
          |_diameter|
        </p>
        <div class="lesson__sub_title">Word Origin:</div>
        <p>
          Ancient Greek word |_diametros|, which itself came from the words |_dia| (|_across|) and |_metros| (|_measure|).
        </p>
        <div class="lesson__sub_title">Description:</div>
        <p>
          The circle |_width|.
        </p>
        `,
      modifiers: {
        _diametros: highlightWord('diametros', '', 'greek'),
        _dia: highlightWord('dia', '', 'greek'),
        _metros: highlightWord('metros', '', 'greek'),
        _across: highlightWord('across', '', 'english'),
        _width: highlightWord('width', '', 'english'),
        _measure: highlightWord('measure', '', 'english'),
        _diameter: actionWord('Diameter', 'id_diameter', colors.diameter),
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
        // circle._radius,
        circle._circumference,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_diameter| is |_any_line| that runs between two points on the circle's |_edge| and through the |_center|.
        <p>
        <p>
          Historically diameter was used instead of radius as it was easier to measure, but today radius is often more useful.
        <p>
        `,
      modifiers: {
        _diameter: actionWord('diameter', 'id_diameter', colors.diameter),
        _center: actionWord('center', 'id_center', colors.anchor),
        _any_line: actionWord('any line', 'id_spin', colors.diameter),
        _edge: actionWord('edge', 'id_edge', colors.circle),
      },
      setState: () => {
        // elements.greyColors();
        elements.resetCircle();
        circle._diameter.showAll();
        // circle._radius.color = colors.radius;
        onClickId('id_diameter', elements.pulseDiameter, [elements]);
        onClickId('id_center', elements.pulseAnchor, [elements]);
        onClickId('id_spin', elements.spinDiameter, [elements]);
        onClickId('id_edge', elements.pulseCircumference, [elements]);
      },
      showOnly: [
        circle,
        circle._anchor,
        circle._diameter,
        // circle._radius,
        circle._circumference,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done);
      },
    });
    this.addSection({
      title: 'Circumference',
      setContent: () => `
        <div class="lesson__sub_title">Property:</div>
        <p>
          |_circumference|
        </p>
        <div class="lesson__sub_title">Word Origin:</div>
        <p>
          The |_Latin| word |_circumferentia| which comes from the words |_circum| (|_carry|) and |_ferre| (|_around|).
        </p>
        <div class="lesson__sub_title">Description:</div>
        <p>
          Length of circle |_edge|.
        </p>
        `,
      modifiers: {
        // _length: highlightWord('length', '', 'english'),
        _edge: actionWord('edge', 'id_edge', colors.circle),
        _circumference: actionWord('Circumference', 'id_circum', colors.circle),
        // _Length: highlightWord('Length', '', 'english'),
        _circum: highlightWord('circum', '', 'latin'),
        _ferre: highlightWord('ferre', '', 'latin'),
        _Latin: highlightWord('Latin', '', 'latin'),
        _circumferentia: highlightWord('circumferentia', '', 'latin'),
        _carry: highlightWord('carry', '', 'english'),
        _around: highlightWord('around', '', 'english'),
      },
      setState: () => {
        elements.resetCircle('right');
        elements._straightCircumference.showAll();
        elements.straighten(0);
        onClickId('id_edge', elements.pulseCircumference, [elements]);
        onClickId('id_circum', elements.pulseCircumference, [elements]);
      },
      showOnly: [
        circle,
        circle._circumference,
        elements._straightCircumference,
      ],
      transitionFromAny: (done) => {
        elements.straighten(0);
        elements._straightCircumference.showAll();
        elements._straightCircumference.showAll();
        elements.transitionCircle(done, 'right');
      },
    });
    this.addSection({
      setContent: () => `
        <p>
          The |_length| of the edge can be seen more easily when it is |_straightened| out.
        </p>
        `,
      modifiers: {
        _length: highlightWord('length', '', 'english'),
        _straightened: actionWord('straightened', 'id_straight', colors.circle),
        _circumference: actionWord('circumference', 'id_circum', colors.circle),
      },
      setInitialState: () => {
        elements.resetCircle('right');
        elements.straighten(0);
      },
      showOnly: [
        circle,
        circle._circumference,
        elements._straightCircumference,
      ],
      transitionFromAny: (done) => {
        // elements.straighten(0);
        elements._straightCircumference.showAll();
        // elements._straightCircumference.showAll();
        elements.transitionCircle(done, 'right');
      },
      setState: () => {
        // elements.resetCircle('right');
        // elements._straightCircumference.showAll();
        // elements.straighten(0);
        onClickId('id_straight', elements.straightenCircumference, [elements]);
        onClickId('id_circum', elements.straightenCircumference, [elements]);
      },
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
        elements.resetCircle('forMoving');
        circle.isMovable = true;
        if (Math.abs(circle._diameter.transform.r()
          - circle._radius.transform.r()) < Math.PI / 10) {
          if (circle._radius.transform.r() > Math.PI) {
            circle._radius.transform
              .updateRotation(circle._radius.transform.r() - Math.PI / 3);
          } else {
            circle._radius.transform
              .updateRotation(circle._radius.transform.r() + Math.PI / 3);
          }
        }

        onClickId('id_circumference_text', elements.straightenCircumference, [elements]);
        onClickId('id_radius_text', elements.toggleRadius, [elements]);
        onClickId('id_diameter_text', elements.toggleDiameter, [elements]);
        onClickId('id_location_text', elements.pulseAnchor, [elements]);
      },
      setInitialState: () => {
        grid._locationText
          .transform.updateTranslation(layout.locationText.top.position);
        grid._locationText._text
          .transform.updateTranslation(layout.locationText.top.offset, 0);
        grid._locationText.setFirstTransform(grid.lastDrawTransform);
        elements.straighten(0);
        grid._slider.set(0.8);
        elements.updateSlider();
      },
      show: [
        circle,
        elements._grid,
        elements._straightCircumference,
      ],
      transitionFromAny: (done) => {
        elements.transitionCircle(done, 'forMoving', elements.percentToScale(0.8));
      },
      transitionToAny: (done) => {
        elements.resetCircle();
        done();
      },
    });
  }
}

export default Content;

// plannedPositions

// initialState
// showOnly
// hideOnly
// show
// hide
// transitionFromAny
// transitionFromPrev/Next
// setPlannedPositions?
// finalState
// transitionToPrev/Next
// transitionToAny
