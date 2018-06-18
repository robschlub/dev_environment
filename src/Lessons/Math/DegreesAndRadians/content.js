// @flow

import { LessonContent, actionWord, onClickId, highlightWord, centerVH } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import { Transform } from '../../../js/diagram/tools/g2';
// import { easeinout } from '../../../js/diagram/tools/mathtools';

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
      setContent: () => `
        <p>
        |_angle1| is the word that describes how large a corner is.
        </p>
        <p>
        |_angle2| describes how much |_rotation| there is between two connected lines.
        </p>
        `,
      modifiers: {
        _angle1: actionWord('Angle', 'id_angle1', colors.angleText),
        _angle2: actionWord('Angle', 'id_angle2', colors.angleText),
        _rotation: actionWord('rotation', 'id_rotation', colors.rotation),
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        // elements._angleText,
      ],
      setState: () => {
        // elements._angleText.showAll();
        circle._reference.transform.updateTranslation(0, 0);
        circle._reference.transform.updateRotation(0);
        circle._radius.transform.updateTranslation(0, 0);
        circle.transform.updateTranslation(layout.circle.center);
        onClickId('id_angle1', elements.pulseAngle, [elements]);
        onClickId('id_angle2', elements.pulseAngle, [elements]);
        onClickId('id_rotation', elements.pushRadius, [elements]);
        if (circle._radius.transform.r() < 0.2) {
          circle._radius.transform.updateRotation(Math.PI / 6);
        }
        elements.updateRotation();
      },
    });

    this.addSection({
      setContent: () =>
        centerVH(`
          <p>
            How do we |_measure| angle?
          </p> 
        `),
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
      },
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          One way, is to |_divide| the |_maximum_angle| into portions.
        </p>
        <p>
          For example, here are |_12_equal_portions| (like a clock).
        </p>
        `,
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        circle._radialLinesA,
      ],
      modifiers: {
        _maximum_angle: actionWord('maximum angle', 'id_max_angle', colors.angleText),
        _divide: highlightWord('divide', 'highlight_word'),
        _12_equal_portions: highlightWord('12 equal portions', 'highlight_word'),
      },
      setState: () => {
        onClickId('id_max_angle', elements.rotateTo, [elements, Math.PI * 1.999, 1, 1, () => {}]);
      },
      transitionFromAny: (done) => {
        elements.toggleRadialLines(2);
        if (circle.transform.t().isNotEqualTo(layout.circle.center)) {
          circle.animateTranslationTo(layout.circle.center, 1);
          // elements.rotateTo(layout.splitCircleAngleStart, 1, 1, done);
        } else {
          done();
        }
      },
    });

    this.addSection({
      setContent: () =>
        `
        <p>
          Now, as you |_rotate| the stick to change the |_angle|, you can count how many portions there are.
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
      setState: () => {
        elements._angleText.showAll();
        elements.toggleRadialLines(0);
        circle.transform.updateTranslation(layout.circle.right);
        onClickId('id_rotate', elements.rotateToRandom, [elements, 1]);
        onClickId('id_angle', elements.pulseAngle, [elements]);
        onClickId('id_angle_text', elements.pulseAngle, [elements]);
        const toggler = (index) => {
          elements.toggleRadialLines(index);
          const elem12 = document.getElementById('id_12p');
          const elem100 = document.getElementById('id_100p');
          if(index) {
            if (elem12.classList.contains('portions_selected')) {
              elem12.classList.remove('portions_selected');
            }
            elem100.classList.add('portions_selected');
          } else {
            if (elem100.classList.contains('portions_selected')) {
              elem100.classList.remove('portions_selected');
            }
            elem12.classList.add('portions_selected');
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
      setContent: () =>
        centerVH(`
          <p>
            How many sections should we choose?
          </p>
        `),
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
      },
    });
  }
}

export default Content;
