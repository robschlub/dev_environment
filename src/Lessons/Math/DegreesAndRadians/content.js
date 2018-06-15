// @flow

import { LessonContent, actionWord, onClickId, highlightWord } from '../../../js/Lesson/LessonContent';
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
        `<p style="margin-top:35%; text-align:center;">
          How do we |_measure| angle?
        </p> 
        `,
      modifiers: {
        _measure: highlightWord('measure', '', 'english'),
      },
    });
    this.addSection({
      setContent: () =>
        `
        <p>
          One way, is we can |_split| up the |_maximum_angle| into equal sections.
        </p>
        <p>
          We can then count the number of sections in the |_angle|.
        </p>
        `,
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
        circle._angle,
        elements._angleText,
      ],
      modifiers: {
        _maximum_angle: actionWord('maximum angle', 'id_max_angle', colors.angleText),
        _angle: actionWord('angle', 'id_angle', colors.angleText),
        _split: actionWord('split', 'id_split', colors.radialLinesText),
      },
      setState: () => {
        elements._angleText.showAll();
        elements.toggleRadialLines(2);
        circle.transform.updateTranslation(layout.circle.right);
        onClickId('id_max_angle', elements.rotateTo, [elements, Math.PI * 1.999, 1, 1, () => {}]);
        onClickId('id_angle', elements.rotateToRandom, [elements, 1]);
        onClickId('id_split', elements.toggleRadialLines, [elements]);
      },
      transitionFromAny: (done) => {
        elements.toggleRadialLines(2);
        elements._sectionTitle.disolveIn(1);
        elements._angleEqualsText.disolveIn(1);
        circle.animateTranslationTo(layout.circle.right, 1);
        elements.rotateTo(layout.splitCircleAngleStart, 1, 1, done);
      },
    });
  }
}

export default Content;
