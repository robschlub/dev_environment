// @flow

import { LessonContent, clickWord, onClickId, click, highlight } from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';
// import HTMLEquation from '../../../js/diagram/DiagramElements/Equation/HTMLEquation';

import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;

const unit = (deg: string, rad: string, angleType: string, num: number = 1) => `<span id="id_${angleType}_deg${num}" class="highlight_word">${deg}&deg;</span><span id="id_${angleType}_rad${num}" class="highlight_word">${rad} radians</span>
  `;

// const fraction = (id: string, numerator: string, denominator: string) => {
//   const eqn = new HTMLEquation(`${id}`);
//   eqn.createEq([eqn.frac(numerator, denominator)]);
//   return eqn.render();
// };

// const _piOn2 = '<sup>&pi;</sup>&frasl;<sub>2</sub>';
// const _piOn2 = '<sup>1</sup>&frasl;<sub>2</sub>';

class Content extends LessonContent {
  setTitle() {
    this.title = 'Sine';
    this.iconLink = '/Lessons/Math/Sine';
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
        This is a test
      `,
      modifiers: {
        // Acute: clickWord('Acute', 'id_acute', diag.goToAcute, [diag]),
        // Right: clickWord('Right', 'id_right', diag.goToRight, [diag]),
        // Obtuse: clickWord('Obtuse', 'id_obtuse', diag.goToObtuse, [diag]),
        // Straight: clickWord('Straight', 'id_straight', diag.goToStraight, [diag]),
        // Reflex: clickWord('Reflex', 'id_reflex', diag.goToReflex, [diag]),
        // acute_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // straight_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // obtuse_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // right_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // reflex_angle: click(diag.pulseAngle, [diag], colors.angleText),
        // quarter_circle: highlight(),
        // square: click(diag.toggleRightAngleLine, [diag, true], colors.angleText),
        // from_Latin: highlight('lesson__important_angles_from_Latin'),
        // from_Late_Latin: highlight('lesson__important_angles_from_Latin'),
      },
      setEnterState: () => {
        diag.setRotation(Math.PI / 3);
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        circle,
        circle._radius,
        diag._unitsSelector,
        // circle._symmetricLine,
        // circle._quad2,
        // circle._quad3,
        // circle._quad4,
        // circle._reference,
      ],
      setSteadyState: () => {
        diag.resetCircle('right', Math.PI / 3);
        circle._mainAngle.showAll();
        circle._sineLine.showAll();
        circle._grid.showAll();
        circle._quad0Angle.showAll();
        circle._quad1Angle.showAll();
        circle._quad2Angle.showAll();
        circle._quad3Angle.showAll();
        circle._symmetry.showAll();
        diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
        diag._angleText.showAll();
        diag.showRadiasn();
        diag.toggleUnits('rad');
        diag.selectAngle(1);
      },
    });
  }
}

export default Content;
