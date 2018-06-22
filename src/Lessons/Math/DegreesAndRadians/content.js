// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord, action,
  centerVH, centerV,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import { Transform } from '../../../js/diagram/tools/g2';
import { easeinout } from '../../../js/diagram/tools/mathtools';

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
    const { elements } = this.diagram;

    this.addSection({
      title: 'Angle Measurement',
      setContent: () => `
        <p>
        |_angle1| is the word that describes how large a corner is. 
        </p>
        <p>
        |_angle2| describes how much |rotation| there is between two connected lines.
        </p>
        `,
      modifiers: {
        _angle1: actionWord('Angle', 'id_angle1', colors.angleText),
        _angle2: actionWord('Angle', 'id_angle2', colors.angleText),
        rotation: action('id_rotation', colors.rotation),
      },
      setSteadyState: () => {
        circle.setPosition(layout.circle.center);
        onClickId('id_angle1', elements.pulseAngle, [elements]);
        onClickId('id_angle2', elements.pulseAngle, [elements]);
        onClickId('id_rotation', elements.pushRadius, [elements]);
        if (circle._radius.transform.r() < 0.2) {
          circle._radius.transform.updateRotation(Math.PI / 5);
        }
        elements.updateRotation();
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
      ],
    });

    this.addSection({
      setContent: () => `
        <p>
        A corner can have a |minimum| angle of 0.
        </p>
        <p>
        A corner's |maximum| angle, is when the rotation is a |full circle|.
        </p>
        `,
      modifiers: {
        minimum: action('id_minimum', colors.angleText),
        maximum: action('id_maximum', colors.angleText),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
      ],
      setSteadyState: () => {
        circle.setPosition(layout.circle.center);
        onClickId('id_minimum', elements.rotateTo, [elements, 0, -1, 1, null]);
        onClickId('id_maximum', elements.rotateTo, [elements, Math.PI * 1.999, 1, 1, null]);
      },
    });

    this.addSection({
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
          One way, is to |divide| the |maximum_angle| into |portions|.
        </p>
        <p>
          For example, here are |12 equal portions| (like a clock).
        </p>
        `,
      modifiers: {
        maximum_angle: action('id_max_angle', colors.angleText),
        portions: action('id_portions', colors.radialLines),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        circle._radialLinesA,
      ],
      transitionFromAny: (done) => {
        elements.toggleRadialLines(2);
        if (circle.transform.t().isNotEqualTo(layout.circle.center)) {
          circle.animateTranslationTo(layout.circle.center, 1, easeinout, done);
        } else {
          done();
        }
      },
      setSteadyState: () => {
        circle.setPosition(layout.circle.center);
        onClickId('id_max_angle', elements.rotateTo, [elements, Math.PI * 1.999, 1, 1, () => {}]);
        onClickId('id_portions', elements.pulseRadialLines, [elements]);
      },
    });

    this.addSection({
      setContent: () =>
        `
        <p>
          Now, as you |_rotate| the line to change the |_angle|, you can count how many portions there are.
        </p>
        <p>Try different portion sizes:
          <ul>
            <li>|_12_Portions|</li>
            <li>|_100_Portions|</li>
          </ul>
        </p>
        `,
      modifiers: {
        _rotate: actionWord('rotate', 'id_rotate', colors.rotation),
        _angle: actionWord('angle', 'id_angle', colors.angleText),
        _12_Portions: actionWord('12 portions', 'id_12p', 'portions_selected'),
        _100_Portions: actionWord('100 portions', 'id_100p'),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        elements._angleText,
      ],
      setSteadyState: () => {
        elements._angleText.showAll();
        elements.toggleRadialLines(0);
        elements._angleText._units.vertices.element.innerHTML = 'portions';
        elements._angleText.transform.updateTranslation(layout.angleEqualsText.left);
        circle.transform.updateTranslation(layout.circle.right);
        onClickId('id_rotate', elements.rotateToRandom, [elements, 1]);
        onClickId('id_angle', elements.pulseAngle, [elements]);
        onClickId('id_angle_text', elements.pulseAngle, [elements]);
        const toggler = (index) => {
          elements.toggleRadialLines(index);
          const elem12 = document.getElementById('id_12p');
          const elem100 = document.getElementById('id_100p');
          if (index && elem12 && elem100) {
            if (elem12.classList.contains('portions_selected')) {
              elem12.classList.remove('portions_selected');
            }
            elem100.classList.add('portions_selected');
          } else {
            if (elem100) {
              if (elem100.classList.contains('portions_selected')) {
                elem100.classList.remove('portions_selected');
              }
            }
            if (elem12) {
              elem12.classList.add('portions_selected');
            }
          }
        };
        onClickId('id_100p', toggler, [elements, 1]);
        onClickId('id_12p', toggler, [elements, 0]);
      },
      transitionFromAny: (done) => {
        elements.toggleRadialLines(0);
        if (circle.transform.t().isNotEqualTo(layout.circle.right)) {
          circle.animateTranslationTo(layout.circle.right, 1);
          elements.rotateTo(layout.splitCircleAngleStart, 1, 1, done);
        } else {
          done();
        }
      },
    });

    this.addSection({
      title: 'Degree',
      setContent: () =>
        centerV(`
          <p>
            So how many portions should we use?
          </p>
          <p>
            There are two common practices. The first is dividing into |_360| portions.
          </p>
          <p>
            Each portion is usually called a |_degree| and is represented by the symbol |_deg|.
          </p>
        `),
      modifiers: {
        _360: highlightWord('360', 'english'),
        _degree: highlightWord('degree', 'english'),
        _deg: highlightWord('&deg;', 'english'),
      },
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>
            The word |_degree| comes from |_Latin|:
          </p>
          <ul>
            <li>|_de|: |_down|</li>
            <li>|_gradus|: |_step|</li>
          </ul>
          <p>
            So 360 degrees (360&deg;) is the same as saying there are 360 smaller steps or pieces.
          </p>
        `),
      modifiers: {
        _degree: highlightWord('degree', 'english'),
        _Latin: highlightWord('Latin', 'latin'),
        _de: highlightWord('de', 'latin'),
        _down: highlightWord('down', 'english'),
        _gradus: highlightWord('gradus', 'latin'),
        _step: highlightWord('step', 'english'),
      },
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>|_Why_choose_360| </p>
          <p>If you were defining it today, you could choose anything!</p>
          <p>But angle is a concept people have worked on and understood for thousands of years.</p>
          <p>For instance, Babylonians divided a circle into 360 portions |_over_3000_years_ago|.</p>
        `),
      modifiers: {
        _Why_choose_360: highlightWord('Why choose 360?', 'highlight_word'),
        _over_3000_years_ago: highlightWord('over 3000 years ago', 'highlight_word'),
      },
    });

    this.addSection({
      setContent: () =>
        centerV(`
          <p>|_So_why_did_they_choose_360|</p>
          <p>It's not known, but one reason might be 360 is an easy number to work with when you don't have a calculator.</p>
          <p>360 has a lot of numbers that can divide into it without a remainder:</p>
          <p>|_factors|<p>
        `),
      modifiers: {
        _So_why_did_they_choose_360:
          highlightWord('So why did they choose 360?', 'highlight_word'),
        _360_is_an_easy_number_to_work_with:
          highlightWord('360 is an easy number to work with', 'highlight_word'),
        _factors: highlightWord('1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360', '', 'lesson__small_text'),
      },
    });

    this.addSection({
      setContent: () =>
        `
          <p>This means it's easy to work with portions of a circle. For example:</p>
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
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        // elements._angleText,
        // circle.radialLinesDeg,
      ],
      setSteadyState: () => {
        circle.transform.updateTranslation(layout.circle.right);
        elements._angleText.transform.updateTranslation(layout.angleEqualsText.top);
        elements.showDegrees();
        const bindArray = deg => [elements, deg / 180 * Math.PI, 0, 1, () => {}];
        onClickId('id_angle', elements.pulseAngle, [elements]);
        onClickId('id_angle_text', elements.pulseAngle, [elements]);
        onClickId('id_180', elements.rotateTo, bindArray(180));
        onClickId('id_120', elements.rotateTo, bindArray(120));
        onClickId('id_90', elements.rotateTo, bindArray(90));
        onClickId('id_72', elements.rotateTo, bindArray(72));
        onClickId('id_60', elements.rotateTo, bindArray(60));
        onClickId('id_45', elements.rotateTo, bindArray(45));
        onClickId('id_40', elements.rotateTo, bindArray(40));
        onClickId('id_36', elements.rotateTo, bindArray(36));
      },
      transitionFromAny: (done) => {
        if (circle.transform.t().isNotEqualTo(layout.circle.right)) {
          circle.animateTranslationTo(layout.circle.right, 1);
          elements.rotateTo(layout.splitCircleAngleStart, 1, 1, done);
        } else {
          done();
        }
      },
    });
  }
}

export default Content;
