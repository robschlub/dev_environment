// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord, highlight, click,
  centerVH, centerV,
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
        circle: click(diag.rotateTo, [diag, Math.PI * 1.999, 1], colors.circle),
        rotating: click(diag.pushRadius, [diag], colors.action),
        fixed: click(diag.pulseAnchor, [diag], colors.anchor),
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
        circle._anchor,
      ],
    });

    this.addSection({
      setContent: `
        <p>
          An |corner| is formed by |rotating| one |line| relative to another. The |angle| is the amount of rotation.
        </p>
      `,
      modifiers: {
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        rotating: click(diag.pushRadius, [diag], colors.action),
        line: click(diag.pulseRadius, [diag], colors.radius),
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
          |Any| |angle| less than maximum, will only form a portion of a |circle|.
        </p>
      `,
      modifiers: {
        Any: click(diag.rotateToRandom, [diag], colors.action),
        circle: click(diag.pulseArc, [diag], colors.circle),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
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
            So |angle| describes the sharpness of a corner, and the amount of a circle that is drawn.
          </p>
          <p>
            A |small angle| results in a sharp corner, and smaller portion of a circle.
          </p>
          <p>
            A |large angle| results in a less sharp corner, and larger portion of a circle.
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
        rotate: click(diag.rotateToRandom, [diag, 1], colors.rotation),
        angle: click(diag.pulseAngle, [diag], colors.angleText),
        _12_Portions: click(diag.toggler, [diag, 0], 'portions_selected'),
        _100_Portions: click(diag.toggler, [diag, 1]),
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
      setContent: () =>
        `
        <p>
          The second common way to define an |angle| is to |relate| it to a circle's properties |radius| and |arc_length|.
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

    this.addSection({
      setContent: () =>
        `
        <p>
          If we relate |angle|, |radius| and |arc_length|, then we only need to know or measure two and then we can |calculate the third|.
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
    this.addSection({
      setContent: () =>
        `
        <p>
          Rotate the stick till the |arc_length| is the |same| length as the |radius|.
        </p>
        <p>
          |Straighten| the arc to check.
        </p>
        `,
      modifiers: {
        // angle: click(diag.pulseAngle, [diag], colors.angle),
        radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
        Straighten: click(diag.straightenArc, [diag], colors.action),
        same: click(diag.rotateTo, [diag, 1, 2], colors.action),
      },
      setEnterState: () => {
        diag.rotateTo(1);
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
          The angle where the radius and arc length are equal, is the same no matter the size of the circle. You can |check_it|.
        </p>
        `,
      modifiers: {
        // angle: click(diag.pulseAngle, [diag], colors.angle),
        radius: click(diag.pulseRadius, [diag], colors.radius),
        arc_length: click(diag.pulseArc, [diag], colors.circle),
        check_it: click(diag.straightenArc, [diag], colors.action),
        same: click(diag.rotateTo, [diag, 1, 2], colors.action),
      },
      setEnterState: () => {
        diag.rotateTo(1);
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
  }
}

export default Content;
