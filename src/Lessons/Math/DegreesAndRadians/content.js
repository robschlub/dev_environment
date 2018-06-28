// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord, highlight, click,
  centerVH, centerV, toHTML, clickWord,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
import HTMLEquation from '../../../js/diagram/DiagramElements/Equation/HTMLEquation';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = 'Angle Measurement';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;
    const diag = this.diagram.elements;
    this.addSection({
      title: 'Introduction',
      setContent: centerVH(`
        <p>
          |Circles| and |Angles| are closely related.
        </p>
      `),
      // setSteadyState: () => {
      //   console.log(diag.getAllElements())
      // }
    });
    this.addSection({
      setContent: `
        <p style="text-align:center;margin-top:8%">
          A |circle| is formed by |rotating| a line around a |fixed| end.
        </p>
      `,
      modifiers: {
        circle: click(diag.rotateTo, [diag, Math.PI * 1.999, 2], colors.circle),
        rotating: click(diag.pushRadius, [diag], colors.action),
        fixed: click(diag.pulseAnchor, [diag], colors.anchor),
      },
      setEnterState: () => {
        diag.resetCircle('center');
        diag.setRotation(0.001);
      },
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center', Math.PI * 1.999, 3);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._arc,
        circle._anchor,
      ],
      setSteadyState: () => {
        diag.setRotation(Math.PI * 1.999);
      },
    });

    this.addSection({
      setContent: `
        <p>
          A |corner| is formed by |rotating| one |line| relative to |another|. The amount of rotation is called |angle|.
        </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        rotating: click(diag.pushRadius, [diag], colors.action),
        line: click(diag.pulseRadius, [diag], colors.radius),
        another: click(diag.pulseReference, [diag], colors.radius),
      },
      // blank: [
      //   'fromNext',
      //   'fromPrev',
      // ],
      setEnterState: () => {
        diag.resetCircle('center');
        diag.updateRotation();
      },
      transitionFromPrev: (done) => {
        diag.transitionCircle(done, 'center', Math.PI / 3);
      },
      setSteadyState: () => {
        diag.setRotation(Math.PI / 3);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
      ],
      show: [
        circle._angle,
      ],
    });

    this.addSection({
      setContent: `
        <p>
          To form a |circle|, the |line| must therefore be |rotated| to the |maximum| |angle|.
        </p>
      `,
      modifiers: {
        maximum: click(diag.rotateTo, [diag, Math.PI * 1.999, 1], colors.action),
        circle: click(diag.pulseArc, [diag], colors.circle),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        rotated: click(diag.pushRadius, [diag], colors.action),
        line: click(diag.pulseRadius, [diag], colors.radius),
      },
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center', Math.PI * 1.999);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._arc,
        circle._reference,
      ],
      show: [
        circle._angle,
      ],
      setSteadyState: () => {
        diag.resetCircle('center', Math.PI * 1.999);
      },
    });
    this.addSection({
      setContent: centerV(`
        <p class="lesson__p_width_50">
          |Rotating| the line any |angle| less than maximum, will only form part of a circle.
        </p>
        <p>
          This part is named an |arc|.
        </p>
        <p class="lesson__p_width_50">
          The name |arc1| comes from the |Latin| word |arcus| and means a |bow| or |arch|.
        </p>
      `),
      modifiers: {
        Rotating: click(diag.rotateToRandom, [diag], colors.action),
        arc: click(diag.pulseArc, [diag], colors.circle),
        arc1: clickWord('arc', 'id_arc', diag.pulseArc, [diag], colors.circle),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        Latin: highlight('latin'),
        arcus: highlight('latin'),
        bow: highlight('english'),
        arch: highlight('english'),
      },
      transitionFromPrev: (done) => {
        diag.transitionCircle(done, 'mostRight');
      },
      blank: ['fromPrev'],
      showOnly: [
        circle,
        circle._radius,
        circle._arc,
        circle._reference,
      ],
      show: [
        circle._angle,
      ],
      setSteadyState: () => {
        diag.resetCircle('mostRight');
      },
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>
            So |angle| describes the sharpness of a corner, and the amount of a circle, or |arc| that is drawn.
          </p>
          <p>
            A |small angle| results in a sharp corner, and short arc.
          </p>
          <p>
            A |large angle| results in a less sharp corner, and long arc.
          </p>
        `),
    });
    this.addSection({
      title: 'How to Measure?',
      setContent: () =>
        centerVH(`
          <p>
            How do we |measure| angle?
          </p> 
        `),
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          One way, is to |divide| the circle into |portions|.
        </p>
        <p>
          For example, here are |12 equal portions| (like a clock).
        </p>
        `,
      modifiers: {
        portions: click(diag.pulseRadialLines, [diag], colors.radialLines),
      },
      setEnterState: () => {
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._radialLinesA,
      ],
      show: [
        circle._angle,
      ],

      transitionFromNext: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
      },
    });

    this.addSection({
      setContent: () =>
        `
        <p>
          Now, as you |rotate| the line to change the |angle|, you can count how many portions there are.
        </p>
        <p>Try different portion sizes:
          <ul>
            <li>|_12_Portions|</li>
            <li>|_100_Portions|</li>
          </ul>
        </p>
        `,
      modifiers: {
        rotate: click(diag.rotateToRandom, [diag, 1], colors.action),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        _12_Portions: toHTML('12 Portions', 'id_12p', 'portions_selected'),
        _100_Portions: toHTML('100 Portions', 'id_100p'),
      },
      setEnterState: () => {
        diag.toggleRadialLines(0);
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        diag._angleText,
        circle._radialLinesA,
      ],
      show: [
        circle._angle,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'right', layout.circle.angle.large);
      },
      setSteadyState: () => {
        circle.setPosition(layout.circle.right);
        diag._angleText.showAll();
        // diag.toggleRadialLines(0);
        diag._angleText._units.vertices.element.innerHTML = 'portions';
        diag._angleText.transform.updateTranslation(layout.angleEqualsText.left);
        // circle.transform.updateTranslation(layout.circle.right);
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
        onClickId('id_12p', diag.toggler, [diag, 0]);
        onClickId('id_100p', diag.toggler, [diag, 1]);
      },
    });

    this.addSection({
      title: 'Degrees',
      setContent: () =>
        centerV(`
          <p>
            So how many portions should we use?
          </p>
          <p>
            There are two common practices. The first is dividing into |360| portions.
          </p>
          <p>
            Each portion is usually called a |degree| and is represented by the symbol |&deg;|.
          </p>
        `),
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>
            The word |degree| comes from |Latin|:
          </p>
          <ul>
            <li>|de|: |down|</li>
            <li>|gradus|: |step|</li>
          </ul>
          <p>
            So 360 degrees (360&deg;) is the same as saying there are 360 smaller steps or pieces.
          </p>
        `),
      modifiers: {
        degree: highlight('english'),
        Latin: highlight('latin'),
        de: highlight('latin'),
        down: highlight('english'),
        gradus: highlight('latin'),
        step: highlight('english'),
      },
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>|Why choose 360?| </p>
          <p>If you were defining it today, you could choose anything!</p>
          <p>But angle is a concept people have worked on and understood for thousands of years.</p>
          <p>For instance, Babylonians divided a circle into 360 portions |over 3000 years ago|.</p>
        `),
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>So |why did they| choose 360?</p>
          <p>It's not known, but one reason might be |360 is an easy number to work with| when you don't have a calculator.</p>
          <p>360 has a lot of numbers that can divide into it without a remainder:</p>
          <ul>
            <li>|_factors|</li>
          </ul>
        `),
      modifiers: {
        _factors: highlightWord('1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360', 'lesson__small_text'),
      },
    });

    this.addSection({
      setContent: () =>
        `
          <p>This means it's easy to work with fractions of a circle.</p>
          <ul style="margin-top:15%;margin-left:15%">
                <li>${String.fromCharCode(190)} circle =   |_270deg|</li>
                <li>${String.fromCharCode(8532)} circle = |_240deg|</li>
                <li>${String.fromCharCode(189)} circle = |_180deg|</li>
                <li>${String.fromCharCode(8531)} circle = |_120deg|</li>
                <li>${String.fromCharCode(188)} circle = |_90deg|</li>
                <li>${String.fromCharCode(8533)} circle = |_72deg|</li>
                <li>${String.fromCharCode(8537)} circle = |_60deg|</li>
          </ul>
        `,
      modifiers: {
        _270deg: actionWord('270&deg;', 'id_270', colors.diagram.text.keyword),
        _240deg: actionWord('240&deg;', 'id_240', colors.diagram.text.keyword),
        _180deg: actionWord('180&deg;', 'id_180', colors.diagram.text.keyword),
        _120deg: actionWord('120&deg;', 'id_120', colors.diagram.text.keyword),
        _90deg: actionWord('90&deg;', 'id_90', colors.diagram.text.keyword),
        _72deg: actionWord('72&deg;', 'id_72', colors.diagram.text.keyword),
        _60deg: actionWord('60&deg;', 'id_60', colors.diagram.text.keyword),
      },
      setEnterState: () => {
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'right');
      },
      setSteadyState: () => {
        diag.resetCircle('right');
        diag._angleText.transform.updateTranslation(layout.angleEqualsText.top);
        diag.showDegrees();
        const bindArray = deg => [diag, deg / 180 * Math.PI, 0, 1, () => {}];
        onClickId('id_angle', diag.pulseAngle, [diag]);
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
        onClickId('id_270', diag.rotateTo, bindArray(270));
        onClickId('id_240', diag.rotateTo, bindArray(240));
        onClickId('id_180', diag.rotateTo, bindArray(180));
        onClickId('id_120', diag.rotateTo, bindArray(120));
        onClickId('id_90', diag.rotateTo, bindArray(90));
        onClickId('id_72', diag.rotateTo, bindArray(72));
        onClickId('id_60', diag.rotateTo, bindArray(60));
      },
    });

    this.addSection({
      title: 'Radians',
      setContent: centerVH(`
        <p>
        The second common way to measure angle is |relative to the radius|.
        </p>
      `),
    });

    this.addSection({
      setContent: `
        <p>
        Instead of thinking of angle as |portions_of_a_circle|, we can think of it as how many |radius_lengths_are_on_the_arc|.
        </p>
      `,
      modifiers: {
        portions_of_a_circle: click(diag.toggleDegreesRadians, [diag, 'deg'], colors.action),
        radius_lengths_are_on_the_arc: click(diag.toggleDegreesRadians, [diag, 'rad'], colors.action),
      },
      setEnterState: () => {
        diag.updateRotation();
        diag._angleText.transform.updateTranslation(layout.angleEqualsText.leftCenter);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
        // circle._radiusOnArc,
        // circle._radiusToArc,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'right');
      },
      setSteadyState: () => {
        diag.resetCircle('right');
        diag.showDegrees();
        diag.updateRotation();
      },
    });

    this.addSection({
      setContent: `
        <p>
          Rotate the |line|, till the |arc_length| is the |same| as the |radius_length|.
        </p>
        <p>
          This |angle| is called a |radian|.
        </p>
      `,
      /* <p>
          Observe some examples:
          <ul>
            <li>|one_radian|</li>
            <li>|two_radians|</li>
            <li>|threeP5_radians|</li>
            <li>|five_radians|</li>
          </ul>
        <p>
      */
      modifiers: {
        line: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.arc),
        same: click(diag.rotateTo, [diag, 1, 2, 2], colors.action),
        radius_length: click(diag.pulseRadiusOnArc, [diag, 1], colors.radiusLight),
        angle: click(diag.pulseAngle, [diag], colors.angle),
        // one_radian: toHTML('1 radian', 'id_1_rad', '', colors.radiusLight),
        // two_radians: toHTML('2 radians', 'id_2_rad', '', colors.radiusLight),
        // threeP5_radians: toHTML('3.5 radians', 'id_3p5_rad', '', colors.radiusLight),
        // five_radians: toHTML('5 radians', 'id_5_rad', '', colors.radiusLight),

      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
        circle._radiusOnArc,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'right');
      },
      setSteadyState: () => {
        diag.resetCircle('right');
        // onClickId('id_1_rad', diag.rotateTo, [diag, 1, 2, 2]);
        // onClickId('id_2_rad', diag.rotateTo, [diag, 2, 2, 2]);
        // onClickId('id_3p5_rad', diag.rotateTo, [diag, 3.5, 2, 2]);
        // onClickId('id_5_rad', diag.rotateTo, [diag, 5, 2, 2]);
      },
      // blank: [
      //   'toNext',
      // ],
    });
    this.addSection({
      setContent: `
        <p style="margin-top:10%">
          So we can see when the angle is:
          <ul>
            <li>|one_radian|: </li>
            <li class="lesson__li_indent">|arc_length| = |one| |radius_ length|</li>
            <li>|two_radians|: </li>
            <li class="lesson__li_indent">|arc_length| = |two| |radius_lengths|.</li>
            <li>|five_radians|: </li>
            <li class="lesson__li_indent">|arc_length| = |five| |radius_lengths|.</li>
          </ul>
        </p>
        <p style="margin-top:7%">
          Or in general:
        </p>
      `,
      modifiers: {
        arc_length: highlight('arc_length_text'),
        radius_lengths: highlight('radius_length_text'),
        radius_length: highlight('radius_length_text'),
        one: highlightWord('1', 'angle_text'),
        two: highlightWord('2', 'angle_text'),
        five: highlightWord('5', 'angle_text'),
        one_radian: toHTML('1 radian', 'id_1_rad', '', colors.angle),
        two_radians: toHTML('2 radians', 'id_2_rad', '', colors.angle),
        five_radians: toHTML('5 radians', 'id_5_rad', '', colors.angle),
      },
      setEnterState: () => {
        diag._arcEquation.setPosition(layout.arcEquation.left);
        diag.arcEqn.arrange();
      },
      blank: [
        'fromPrev',
        'toNext',
      ],
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
        circle._radiusOnArc,
        // diag._arcEquation,
      ],
      // hide: [
      //   diag._arcEquation._v,
      // ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'middleMostRight');
      },
      setSteadyState: () => {
        diag._arcEquation.showAll();
        diag._arcEquation.hideOnly([diag._arcEquation._v]);
        diag.resetCircle('middleMostRight');
        function rotateToAndPulse(angle: number, num: number) {
          diag.rotateTo(angle, 2, 1.5, diag.pulseRadiusOnArc.bind(diag, num));
        }
        onClickId('id_1_rad', rotateToAndPulse, [this, 1, 1]);
        onClickId('id_2_rad', rotateToAndPulse, [this, 2, 2]);
        onClickId('id_5_rad', rotateToAndPulse, [this, 5, 5]);
        // onClickId('id_1_rad', diag.rotateTo, [diag, 1, 2, 2]);
        // onClickId('id_2_rad', diag.rotateTo, [diag, 2, 2, 2]);
        // onClickId('id_5_rad', diag.rotateTo, [diag, 5, 2, 2]);
        diag._arcEquation._angle.onClick = diag.pulseAngle.bind(diag);
        diag._arcEquation._radius.onClick = diag.pulseRadius.bind(diag);
        diag._arcEquation._arc.onClick = diag.pulseArc.bind(diag);
      },
      transitionToNext: (done) => {
        circle.hideAll();
        diag._arcEquation.animateTranslationTo(layout.arcEquation.centerTop, 1.5, done);
        // diag.arcEqn.animateTo(layout.arcEquation.centerTop, 1, 2, done);
        // diag._arcEquation.hideOnly([diag._arcEquation._v]);
      },
    });
    // this.addSection({
    //   setContent: `
    //     <p>
    //       Increasing the angle by 1 radian, increases the arc length by 1 radius length.
    //     </p>
    //     <p>
    //       So, when you have a radius of 1 meter, and an angle of 2
    //       radians, then the arc length will be 2 meters.
    //     </p>
    //     <p>
    //       In other words:
    //         arc length = angle * radius
    //     </p>
    //     <p>
    //       Note, this only works when the angle is in radians.
    //       It does not work if the angle is in degrees!
    //     </p>
    //   `,
    // });
    this.addSection({
      setContent: centerVH(`
        <p>
          This is |only| true when angle is expressed in |radians|.
        </p>
        <p>
          This is |not| true for |other units|, such as degrees.
        </p>
      `),
      setEnterState: () => {
        diag._arcEquation.setPosition(layout.arcEquation.centerTop);
        diag.arcEqn.arrange();
        // }
      },
      blank: [
        'fromPrev',
      ],
      show: [
        diag._arcEquation,
      ],
      hide: [
        diag._arcEquation._v,
      ],
      // setSteadyState: () => {
      // },
    });
    this.addSection({
      setContent: `
        <p style="margin-top: 5%;text-align:center">
          How many radians are there in a half circle and full circle?
        </p>
        <ul style="margin-top: 23%">
        <li>A |half_circle| has about 3.14 radians.</li>
        <li>A |full_circle| has about 6.28 radians.</li>
        </ul>
      `,
      modifiers: {
        half_circle: click(diag.rotateTo, [diag, Math.PI], colors.action),
        full_circle: click(diag.rotateTo, [diag, Math.PI * 1.999], colors.action),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
        circle._radiusOnArc,
      ],
      setSteadyState: () => {
        diag.resetCircle('middleMostRight');
        diag._angleText.setPosition(layout.angleEqualsText.bottomMostRight);
        diag.showRadians();
        diag.updateRotation();
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
      },
    });
    this.addSection({
      setContent: centerV(`
        <p>
          Saying a half circle has |3.14| radians is a |rough approximation|.
        </p>
        <p>
          Actually, the digits after the 3 go on forever.
        </p>
        <p>
          A more accurate |approximation| is |3.141593...|.
        </p>
      `),
    });

    // TODO include how to calculate this number here

    this.addSection({
      setContent: centerV(`
        <p>
          At first glance, dividing a circle into |6.283185...| portions isn't as convenient as dividing it into 360.
        </p>
        <p>
          A radian is a big portion, and there are plenty of applications that will require a |fraction of a radian|.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          For example, if you want to use the angle of a |quarter circle|, instead of a simple calculation in degrees:
        </p>
        <p style="text-align: center">|360 ${String.fromCharCode(247)} 4 = 90|</p>
        <p>you might need to use a calculator for radians:</p>
        <p style="text-align: center">|6.283185... ${String.fromCharCode(247)} 4 = 1.570796...|</p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          In addition, a circle cannot be divided |evenly| in radians without a remainder. 
        </p>
        <p>
          6 radians go into a circle, but we are left with |0.283185... radians remaining|.
        </p>
      `),
    });
    this.addSection({
      title: 'eqn',
      setContent: `
        <p style="margin-top: 15%">
          But as radians relate |angle|, |radius| and |arc_length|, it means you can calculate one property from the other two.
        </p>
        <p>
          You only need to |measure the two easiest properties|, to have all three.
        </p>
      `,
      modifiers: {
        angle: click(diag.animateEquation, [diag, 'angle'], colors.angle),
        radius: click(diag.animateEquation, [diag, 'radius'], colors.radius),
        arc_length: click(diag.animateEquation, [diag, 'arc'], colors.arc),
      },
      setEnterState: () => {
        const { scale } = layout.arcEquation;
        diag.radiusEqn.arrange(scale, diag._arcEquation._equals);
        diag.angleEqn.arrange(scale, diag._arcEquation._equals);
        diag.arcEqn.arrange(scale, diag._arcEquation._equals);
        diag._arcEquation.setPosition(layout.arcEquation.centerBottom);
      },
      setSteadyState: () => {
        diag._arcEquation.showArc();
        diag._arcEquation._angle.onClick =
          diag.animateEquation.bind(diag, 'angle');
        diag._arcEquation._radius.onClick =
          diag.animateEquation.bind(diag, 'radius');
        diag._arcEquation._arc.onClick =
          diag.animateEquation.bind(diag, 'arc');
      },
    });
    this.addSection({
      setContent: centerV(`
        <p style="text-align:center">
          This is |very powerful|. 
        </p>
        <p>
          So powerful that people work with this weird
          angular size because its |advantages outweigh the disadvantages|.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          One way they work with it, is instead of writing out the approximate value |3.14159...| each time, they substitute the value with the greek letter |&pi;| (prounounced |pi|).
        </p>
        `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          Instead of saying there are |3.14159... radians| in a |half circle|, you can simply say there are |&pi; radians|.
        </p>
        <p>
          Instead of saying there are |6.28319... radians| in a |circle|, you say there are |2&pi; radians|.
        </p>
        <p>
          The number is only used when a calculation needs to be done.
        </p>
      `),
    });
    this.addSection({
      title: 'Common Angles',
      setContent: () => {
        const fraction = (id: string, numerator: string, denominator: string) => {
          const eqn = new HTMLEquation(`${id}`);
          eqn.createEq([eqn.frac(numerator, denominator)]);
          return eqn.render();
        };
        const _2pi = '2&pi;';
        const _pi = '&pi;';
        const _3piOn2 = fraction('id_3pi_2', '3&pi;', '2');
        const _2piOn3 = fraction('id_2pi', '2&pi;', '3');
        const _piOn2 = fraction('id_pi_2', '&pi;', '2');
        const _piOn3 = fraction('id_pi_3', '&pi;', '3');
        return `
          <p>
            Let's look at some angles in degrees and radians
          </p>
          <table class="lesson__table lesson__common_angles_table">
            <tr>
              <td>Full circle:</td><td>|_360deg|</td><td>${_2pi}</td><td>rad</td>
            </tr>
            <tr>
              <td>Three quarter circle:</td><td>|_270deg|</td><td>${_3piOn2}</td><td>rad</td>
            </tr>
            <tr>
              <td>Half circle:</td><td>|_180deg|</td><td>${_pi}</td><td>rad</td>
            </tr>
            <tr>
              <td>One third circle:</td><td>|_120deg|</td><td>${_2piOn3}</td><td>rad</td>
            </tr>
            <tr>
              <td>One quarter circle:</td><td>|_90deg|</td><td>${_piOn2}</td><td>rad</td>
            </tr>
            <tr>
              <td>One sixth circle:</td><td>|_60deg|</td><td>${_piOn3}</td><td>rad</td>
            </tr>
          </table>
        `;
      }, 
      modifiers: {
        _360deg: actionWord('360&deg;', 'id_360', colors.diagram.text.keyword),
        _270deg: actionWord('270&deg;', 'id_270', colors.diagram.text.keyword),
        _180deg: actionWord('180&deg;', 'id_180', colors.diagram.text.keyword),
        _120deg: actionWord('120&deg;', 'id_120', colors.diagram.text.keyword),
        _90deg: actionWord('90&deg;', 'id_90', colors.diagram.text.keyword),
        _60deg: actionWord('60&deg;', 'id_60', colors.diagram.text.keyword),
      },
      setEnterState: () => {
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
      ],
      // transitionFromAny: (done) => {
      //   diag.transitionCircle(done, 'middleMostRight');
      // },
      setSteadyState: () => {
        diag.resetCircle('middleMostRight');
        diag._angleText.transform.updateTranslation(layout.angleEqualsText.bottomMostRightDeg);
        diag.showDegrees();
        const bindArray = deg => [diag, deg / 180 * Math.PI, 0, 1, () => {}];
        onClickId('id_angle', diag.pulseAngle, [diag]);
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
        onClickId('id_360', diag.rotateTo, bindArray(359.99));
        onClickId('id_270', diag.rotateTo, bindArray(270));
        onClickId('id_180', diag.rotateTo, bindArray(180));
        onClickId('id_120', diag.rotateTo, bindArray(120));
        onClickId('id_90', diag.rotateTo, bindArray(90));
        onClickId('id_60', diag.rotateTo, bindArray(60));
        onClickId('id_')
      },
    });


/* eslint-disable */
//     '<p>Rotate the stick, till the |_arc_length| is the |_same| as the stick length (|_radius|).</p>' +
//             '<p>|_Compare| the |_arc_length1| to the |_radius1| length at different angles.<p>' +
//             '<p>We can define the angle as how many radius lengths the arc length is.</p>'


//      '<p>The |_angle| formed when |_arc_length| equals |_radius_length| is called a |_radian|.</p>' +
//             '<p>The word radian comes from the word radius.</p>' +
//             '<p>Increasing the angle by 1 radian, increases the arc length by a radius length.</p>' +
//             '<p>So, if you have an angle of |_2_radians|, and the radius is 1 meter, then the arc length will be 2 meters.</p>' +
//             '<p>In other words:</p>' +
//             '   <dim id="inline_equation"></dim>' +
//             '<p>Note, you can only use this equation when the angle is in radians! It does not work if the angle is measured in degrees.</p>' +

//     '<p>How many radians are there in a half circle and full circle?</p>' +
//             '<p>A |_half_circle| has 3.14 radians.</p>' +
//             '<p>A |_full_circle| has 6.28 radians.</p>' +
//             '<p>We will often say there are 3.14 radians in a circle. But this is an approximation.</p>'+
//             '<p>A more accurate approximation is 3.141592653589793.</p>'+
//             '';

// '<p>At first glance, splitting a circle up into 6.28 slices isn\'t as convenient as splitting it up into 360 slices.</p>'+
//             '<p>A radian is a big slice, and there are plenty of applications that will require a portion of a radian.</p>'+
//             '<p>For example, if you want to use a quarter circle, instead of a simple calculation in degrees:</p>'+
//             '<p>360/4 = 90</p>'+
//             '<p>you need to whip out the calculator for radians:</p>'+
//             '<p>6.28/4 = 1.57.</p>'+
//             '<p>Also, a radian doesn\'t even go into a circle without a remainder. 6 radians go into a circle, but we are left with 0.28 radians remaining.</p>'+
//             ''

//     '<p>But, because we |_related| the |_angle| unit to the |_radius| and |_arc_length|, we only need two ' +
//                 'of the properties to find the third - which is very very powerful. So powerful, that people deal '+
//                 'with this weird angular size because the advantages outweigh the disadvantages.</p>'+
//             '<p>One way they deal with it, is instead of writing out the approximate value 3.14159... each time, '+
//                 'they just substite the value with the greek letter |_pi|.</p>'+
//             '<p>So instead of saying there are 3.14159 radians in a half circle, you can simply say there are |_pi_radians|.</p>'+
//             '<p>Instead of saying there are 6.2832 radians in a circle, you say there are |_2pi_radians|.</p>'+
//             '';
   
//     '<p>Let\'s use what we\'ve learned about radians to calculate the |_circumference| of any circle that we know the radius of.</p>' +
//             '<p>When using radians, angle and radius is related to arc length by:</p>' +
//             '   <dim id="inline_equation1"></dim>' +
//             '<p>Now, a complete circle has an angle of 6.28, or 2&pi; radians.</p>' +
//             '<p>Therefore, we can calculate the circumference of any circle just by knowing the radius:<p>'+
//             '   <dim id="inline_equation2"></dim>' +
    /* eslint-enable */
    this.addSection({
      setContent: `
      <p>
      |Radius|, |angle| and |arc_length| are related.
      </p>
      <p>
        |Change| the radius and angle and the arc length will change.
      </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angle),
        Radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
        Straighten: click(diag.straightenArc, [diag], colors.action),
        Change: click(diag.pulseSlider, [diag], colors.action),
      },
      setEnterState: () => {
        if (this.comingFrom !== 'next') {
          diag.straighten(0);
          diag.updateRotation();
          diag._slider.setValue(1.0);
        }
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._compareRadius,
        diag._compareText,
      ],
      show: [
        circle._angle,
        circle._straightArc,
        diag._slider,
      ],
      transitionFromAny: (done) => {
        if (this.comingFrom !== 'next') {
          diag.transitionCircle(done, 'center');
        } else {
          done();
        }
      },
      setSteadyState: () => {
        if (this.comingFrom !== 'next') {
          diag.resetCircle('center');
        }
        onClickId('id_compare_text', diag.straightenArc, [diag]);
      },
      setLeaveState: () => {
        if (this.goingTo !== 'next') {
          diag.straighten(0);
          diag.varState.straightening = false;
        } else if (diag.varState.straightening) {
          diag.straighten(1);
        } else {
          diag.straighten(0);
        }
      },
    });

    this.addSection({
      setContent: `
      <p>
      The |arc_length| increases with either an increase in |radius|, or |angle|.
      </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angle),
        Radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
        Compare: click(diag.straightenArc, [diag], colors.action),
      },
      setEnterState: () => {
        if (this.comingFrom !== 'prev') {
          diag.straighten(0);
          diag.updateRotation();
          diag._slider.setValue(1.0);
        }
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._compareRadius,
        diag._compareText,
      ],
      show: [
        circle._angle,
        circle._straightArc,
        diag._slider,
      ],
      transitionFromAny: (done) => {
        if (this.comingFrom !== 'prev') {
          diag.transitionCircle(done, 'center');
        } else {
          done();
        }
      },
      setSteadyState: () => {
        if (this.comingFrom !== 'prev') {
          diag.resetCircle('center');
        }
        onClickId('id_compare_text', diag.straightenArc, [diag]);
      },
      setLeaveState: () => {
        if (this.goingTo !== 'prev') {
          diag.straighten(0);
          diag.varState.straightening = false;
        } else if (diag.varState.straightening) {
          diag.straighten(1);
        } else {
          diag.straighten(0);
        }
      },
    });

    this.addSection({
      setContent: `
      <p>
      The |arc length| increases with either an increase in |radius|, or |angle|.
      </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angle),
        Radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
        Straighten: click(diag.straightenArc, [diag], colors.action),
      },
      setEnterState: () => {
        diag.straighten(0);
        diag.updateRotation();
        diag._slider.setValue(1.0);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._compareRadius,
      ],
      show: [
        circle._angle,
        circle._straightArc,
        diag._slider,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
      },
      setLeaveState: () => {
        diag.straighten(0);
      },
    });
    this.addSection({
      title: 'Radians',
      setContent: () =>
        `
        <p>
          The second common way to define an |angle| is to |relate| it to a circle's |radius| and |arc_length|.
        </p>
        `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angle),
        radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
      },
      setEnterState: () => {
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
      ],
      show: [
        circle._angle,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
      },
    });
    // this.addSection({
    //   setContent: centerV(`
    //     <p>
    //     To |relate| them, we can find the |angle| where |radius length| equals the |arc length|.
    //     </p>
    //   `),
    // });

    // this.addSection({
    //   setContent: () =>
    //     `
    //     <p>
    //       If we relate |angle|, |radius| and |arc_length|, then we
    //    only need to know or measure two and then we can |calculate the third|.
    //     </p>
    //     `,
    //   modifiers: {
    //     angle: click(diag.pulseAngle, [diag], colors.angle),
    //     radius: click(diag.pulseRadius, [diag], colors.radius),
    //     arc_length: click(diag.pulseArc, [diag], colors.circle),
    //   },
    //   setEnterState: () => {
    //     diag.updateRotation();
    //   },
    //   showOnly: [
    //     circle,
    //     circle._radius,
    //     circle._reference,
    //     circle._arc,
    //   ],
    //   show: [
    //     circle._angle,
    //   ],
    //   transitionFromAny: (done) => {
    //     diag.transitionCircle(done, 'center');
    //   },
    //   setSteadyState: () => {
    //     diag.resetCircle('center');
    //   },
    // });
    this.addSection({
      setContent: () =>
        `
        <p>
          To |relate these properties|, you can observe how the arc length depends on the radius and the .
        </p>
        <p>
          To do this, |rotate| the line and |straighten| the arc.
        </p>
        `,
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          To |relate these properties|, find the |angle| where the |radius| length equals the |arc| length.
        </p>
        <p>
          To do this, |rotate| the line and |straighten| the arc.
        </p>
        `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angle),
        rotate: click(diag.pulseRadius, [diag], colors.action),
        radius: click(diag.pulseRadius, [diag], colors.radius),
        arc: click(diag.pulseArc, [diag], colors.circle),
        straighten: click(diag.straightenArc, [diag], colors.action),

        // same: click(diag.rotateTo, [diag, 1, 2], colors.action),
      },
      setEnterState: () => {
        // diag.rotateTo(1);
        diag.straighten(0);
        diag.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._compareRadius,
      ],
      show: [
        circle._angle,
        circle._straightArc,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
      },
      setLeaveState: () => {
        diag.straighten(0);
      },
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          We can then use this angle as the portion size.
        </p>
        <p>
          This portion is called a |radian| - a word that comes from the word |radius|.
        </p>
        `,
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._radialLinesRad,
      ],
      show: [
        circle._angle,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
      },
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          |Change| the size of the circle and see the |angle| where arc length and radius are equal stays the same. 
        </p>

        <p>
          |Straighten| the arc to compare.
        </p>
        `,
      modifiers: {
        Change: click(diag.pulseSlider, [diag], colors.action),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        // angle: click(diag.pulseAngle, [diag], colors.angle),
        // radius: click(diag.pulseRadius, [diag], colors.radius),
        // arc_length: click(diag.pulseArc, [diag], colors.circle),
        Straighten: click(diag.straightenArc, [diag], colors.action),
        // same: click(diag.rotateTo, [diag, 1, 2], colors.action),
      },
      setEnterState: () => {
        // diag.rotateTo(1);
        diag.straighten(0);
        diag.updateRotation();
        diag._slider.setValue(1.0);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._arc,
        circle._compareRadius,
      ],
      show: [
        circle._angle,
        circle._straightArc,
        diag._slider,
      ],
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center');
      },
      setSteadyState: () => {
        diag.resetCircle('center');
        // diag.showDegrees();
      },
      setLeaveState: () => {
        diag.straighten(0);
      },
    });
  }
}

export default Content;
