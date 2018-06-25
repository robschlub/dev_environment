// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord, highlight, click,
  centerVH, centerV, toHTML,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';

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
    });
    this.addSection({
      setContent: `
        <p>
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
    });

    this.addSection({
      setContent: `
        <p>
          An |corner| is formed by |rotating| one |line| relative to |another|. The |angle| is the amount of rotation.
        </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        rotating: click(diag.pushRadius, [diag], colors.action),
        line: click(diag.pulseRadius, [diag], colors.radius),
        another: click(diag.pulseReference, [diag], colors.radius),
      },
      setEnterState: () => {
        diag.resetCircle('center');
        diag.setRotation(0.001);
        diag.updateRotation();
      },
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center', Math.PI / 3);
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
      setEnterState: () => {
        diag.resetCircle('center');
        diag.setRotation(0.001);
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
    });

    this.addSection({
      setContent: `
        <p>
          |Any| |angle| less than maximum, will only form a part of a circle, called an |arc|.
        </p>
        <p>
          The word comes from the |Latin| word |arcus| and means a |bow| or |arch|.
        </p>
      `,
      modifiers: {
        Any: click(diag.rotateToRandom, [diag], colors.action),
        arc: click(diag.pulseArc, [diag], colors.circle),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        Latin: highlight('latin'),
        arcus: highlight('latin'),
        bow: highlight('english'),
        arch: highlight('english'),
      },
      setEnterState: () => {
        diag.resetCircle('center');
        diag.setRotation(0.001);
      },
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'center', Math.PI / 3);
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
    });
    // this.addSection({
    //   title: 'Introduction',
    //   setContent: () => `
    //     <p>
    //     Two |lines| connected at a point for a corner. 
    //     The sharpness of the corner is described by the word |angle|.
    //     </p>
    //     <p>
    //       |Rotate| the |line| to change the angle.
    //     </p>
    //     `,
    //   modifiers: {
    //     angle: click(diag.pulseAngle, [diag], colors.angleText),
    //     line: click(diag.pulseRadius, [diag], colors.radius),
    //     lines: click(diag.pulseLines, [diag], colors.radius),
    //     // angle: actionWord('Angle', 'id_angle1', colors.angleText),
    //     // Angle2: actionWord('Angle', 'id_angle2', colors.angleText),
    //     Rotate: click(diag.pushRadius, [diag], colors.rotation),
    //   },
    //   setSteadyState: () => {
    //     circle.setPosition(layout.circle.center);
    //     diag.setRotation(layout.circle.angle.small);
    //     onClickId('id_angle1', diag.pulseAngle, [diag]);
    //     onClickId('id_angle2', diag.pulseAngle, [diag]);
    //     if (circle._radius.transform.r() < 0.2) {
    //       circle._radius.transform.updateRotation(Math.PI / 5);
    //     }
    //     diag.updateRotation();
    //   },
    //   showOnly: [
    //     circle,
    //     circle._radius,
    //     circle._reference,
    //     circle._angle,
    //   ],
    // });

    // this.addSection({
    //   setContent: () => `
    //     <p>
    //     A corner can have a |minimum| angle of 0.
    //     </p>
    //     <p>
    //     A corner's |maximum| angle, is when the rotation is a |full circle|.
    //     </p>
    //     `,
    //   modifiers: {
    //     minimum: click(diag.rotateTo, [diag, 0, -1], colors.angleText),
    //     maximum: click(diag.rotateTo, [diag, Math.PI * 1.999], colors.angleText),
    //   },
    //   showOnly: [
    //     circle,
    //     circle._radius,
    //     circle._reference,
    //     circle._angle,
    //   ],
    //   setSteadyState: () => {
    //     circle.setPosition(layout.circle.center);
    //   },
    // });
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
          <p>|_factors|<p>
        `),
      modifiers: {
        _factors: highlightWord('1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360', 'lesson__small_text'),
      },
    });

    this.addSection({
      setContent: () =>
        `
          <p>This means it's easy to work with fractions of a circle. For example:</p>
          <ul>
                <li>1/2 of a circle is |_180deg|</li>
                <li>1/3 of a circle is |_120deg|</li>
                <li>1/4 of a circle is |_90deg|</li>
                <li>1/5 of a circle is |_72deg|</li>
                <li>1/6 of a circle is |_60deg|</li>
                <li>1/8 of a circle is |_45deg|</li>
                <li>1/9 of a circle is |_40deg|</li>
                <li>1/10 of a circle is |_36deg|</li>
                <li>etc</li>
          </ul>
        `,
      modifiers: {
        _180deg: actionWord('180&deg;', 'id_180', colors.diagram.text.keyword),
        _120deg: actionWord('120&deg;', 'id_120', colors.diagram.text.keyword),
        _90deg: actionWord('90&deg;', 'id_90', colors.diagram.text.keyword),
        _72deg: actionWord('72&deg;', 'id_72', colors.diagram.text.keyword),
        _60deg: actionWord('60&deg;', 'id_60', colors.diagram.text.keyword),
        _45deg: actionWord('45&deg;', 'id_45', colors.diagram.text.keyword),
        _40deg: actionWord('40&deg;', 'id_40', colors.diagram.text.keyword),
        _36deg: actionWord('36&deg;', 'id_36', colors.diagram.text.keyword),
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
      setSteadyState: () => {
        diag.resetCircle('right');
        // circle.transform.updateTranslation(layout.circle.right);
        diag._angleText.transform.updateTranslation(layout.angleEqualsText.top);
        diag.showDegrees();
        const bindArray = deg => [diag, deg / 180 * Math.PI, 0, 1, () => {}];
        onClickId('id_angle', diag.pulseAngle, [diag]);
        onClickId('id_angle_text', diag.pulseAngle, [diag]);
        onClickId('id_180', diag.rotateTo, bindArray(180));
        onClickId('id_120', diag.rotateTo, bindArray(120));
        onClickId('id_90', diag.rotateTo, bindArray(90));
        onClickId('id_72', diag.rotateTo, bindArray(72));
        onClickId('id_60', diag.rotateTo, bindArray(60));
        onClickId('id_45', diag.rotateTo, bindArray(45));
        onClickId('id_40', diag.rotateTo, bindArray(40));
        onClickId('id_36', diag.rotateTo, bindArray(36));
      },
      transitionFromAny: (done) => {
        diag.transitionCircle(done, 'right');
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
      title: 'Radians',
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
        radius_length: click(diag.pulseRadiusOnArc, [diag], colors.radiusLight),
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
    });
    this.addSection({
      setContent: `
        <p>
          So we can see:
          <ul>
            <li>At |one_radian|: arc length = |1| radius length</li>
            <li>At |two_radians|: arc length = |2| radius lengths.</li>
            <li>At |five_radians|: arc length = |5| radius lengths.</li>
          </ul>
        </p>
        <p>
          Which can be generalized:
        </p>
      `,
      modifiers: {
        one_radian: toHTML('1 radian', 'id_1_rad', '', colors.radiusLight),
        two_radians: toHTML('2 radians', 'id_2_rad', '', colors.radiusLight),
        five_radians: toHTML('5 radians', 'id_5_rad', '', colors.radiusLight),
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
        onClickId('id_1_rad', diag.rotateTo, [diag, 1, 2, 2]);
        onClickId('id_2_rad', diag.rotateTo, [diag, 2, 2, 2]);
        onClickId('id_5_rad', diag.rotateTo, [diag, 5, 2, 2]);
      },
    })
    this.addSection({
      setContent: `
        <p>
          Increasing the angle by 1 radian, increases the arc length by 1 radius length.
        </p>
        <p>
          So, when you have a radius of 1 meter, and an angle of 2 radians, then the arc length will be 2 meters.
        </p>
        <p>
          In other words:
            arc length = angle * radius
        </p>
        <p>
          Note, this only works when the angle is in radians. It does not work if the angle is in degrees!
        </p>
      `,
    });
    this.addSection({
      setContent: `
        <p>
          How many radians are there in a half circle and full circle?
        </p>
        <p>A |_half_circle| has about 3.14 radians.</p>
        <p>A |_full_circle| has about 6.28 radians.</p>
        <p>
          We will often say there are 3.14 radians in a half circle. But this is a rough approximation.
        </p>
        <p>
          A more accurate approximation is 3.141592653589793.
        </p>
      `,
    });
    this.addSection({
      setContent: centerV(`
        <p>
          At first glance, splitting a circle up into 6.28 portions isn't as convenient as splitting it up into 360.
        </p>
        <p>
          A radian is a big portion, and there are plenty of applications that will require a |fraction of a radian|.
        </p>
        <p>
          For example, if you want to use a quarter circle, instead of a simple calculation in degrees:
        </p>
        <p>360/4 = 90</p>
        <p>you need to whip out the calculator for radians:</p>
        <p>6.28/4 = 1.57.</p>
        <p>
          Also, a radian doesn't even go into a circle without a remainder. 6 radians go into a circle, but we are left with 0.28 radians remaining.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          But as radians relate |angle|, |radius| and |arc length|, it means you can calculate one property from the other two.
        </p>
        <p>
          You no longer need to measure all three properties of the circle, you only need to measure the two easiest. 
        </p>
        <p>
          This is very powerful. So powerful that people deal with this weird
          angular size because the advantages outweigh the disadvantages.
        </p>
      `),
    });
    this.addSection({
      setContent: centerV(`
        <p>
          One way they deal with it, is instead of writing out the approximate value 3.14159... each time, they just substite the value with the greek letter |&pi;|
        </p>
        <p>
          Instead of saying there are 3.14159 radians in a half circle, you can simply say there are |&pi; radians|
        </p>
        <p>
          Instead of saying there are 6.28319 radians in a circle, you say there are |2&pi; radians|.
        </p>
        <p>
          We can then substitude the number back in when we need to do the final calculation.
        </p>
      `),
    });




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
    //       If we relate |angle|, |radius| and |arc_length|, then we only need to know or measure two and then we can |calculate the third|.
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
    })
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
