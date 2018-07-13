// @flow

import { LessonContent, clickWord } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';

import lessonLayout from './layout';

const layout = lessonLayout();

class Content extends LessonContent {
  setTitle() {
    this.title = 'Important Angles';
    this.iconLink = '/Lessons/Math/ImportantAngles';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId);
  }

  addSections() {
    const circle = this.diagram.elements._circle;
    const diag = this.diagram.elements;
    this.addSection({
      title: 'Introduction',
      setContent: `
        <table class="lesson__important_angles_table">
          <tr>
            <td>|Acute|</td>
            <td>|Right|</td>
            <td>|Obtuse|</td>
            <td>|Straight|</td>
            <td>|Reflex|</td>
          </tr>
        </table>
      `,
      modifiers: {
        Acute: clickWord('Acute', 'id_acute', diag.goToAcute, [diag]),
        Right: clickWord('Right', 'id_right', diag.goToRight, [diag]),
        Obtuse: clickWord('Obtuse', 'id_obtuse', diag.goToObtuse, [diag]),
        Straight: clickWord('Straight', 'id_straight', diag.goToStraight, [diag]),
        Reflex: clickWord('Reflex', 'id_reflex', diag.goToReflex, [diag]),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        circle,
        circle._radius,
        circle._reference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        circle._angle.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText.showAll();
        diag.showRadians();
        diag.selectAngle('acute');
      },
    });
  }
}

export default Content;
