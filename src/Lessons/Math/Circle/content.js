// @flow

import {
  LessonContent, actionWord, onClickId, highlightWord,
  centerVH, centerV,
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
      title: 'Angle Measurement',
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
      // modifiers: {
      //   _angle1: actionWord('Angle', 'id_angle1', colors.angleText),
      //   _angle2: actionWord('Angle', 'id_angle2', colors.angleText),
      //   _rotation: actionWord('rotation', 'id_rotation', colors.rotation),
      // },
      showOnly: [
        // circle,
        elements._moon,
        elements._wheel,
        elements._ball,
        elements._clock,
        elements._circleShape,
      ],
      setState: () => {
        elements.varState.shapeTurn = 0;
        elements._moon.transform.updateTranslation(layout.moon.center);
        elements._wheel.transform.updateTranslation(layout.wheel.center);
        elements._ball.transform.updateTranslation(layout.ball.center);
        elements._clock.transform.updateTranslation(layout.clock.center);
        elements._circleShape.transform.updateTranslation(layout.circleShape.center);
        onClickId('id_common', elements.toggleShape, [elements]);
        // circle._reference.transform.updateRotation(0);
        // circle._radius.transform.updateTranslation(0, 0);
        // circle.transform.updateTranslation(layout.circle.center);
        // onClickId('id_angle1', elements.pulseAngle, [elements]);
        // onClickId('id_angle2', elements.pulseAngle, [elements]);
        // onClickId('id_rotation', elements.pushRadius, [elements]);
        // if (circle._radius.transform.r() < 0.2) {
        //   circle._radius.transform.updateRotation(Math.PI / 6);
        // }
        // elements.updateRotation();
      },
    });
  }
}

export default Content;
