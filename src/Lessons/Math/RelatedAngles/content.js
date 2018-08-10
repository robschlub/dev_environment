// @flow

import {
  LessonContent, clickWord, onClickId, click, highlight,
} from '../../../js/Lesson/LessonContent';
import LessonDiagram from './diagram';

import lessonLayout from './layout';

const layout = lessonLayout();
// const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = 'Related Angles';
    this.iconLink = '/Lessons/Math/RelatedAngles';
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    // const circle = this.diagram.elements._circle;

    const diag = this.diagram.elements;
    console.log(diag)
    this.addSection({
      title: 'Parallel',
      setContent:`
        <div id="id_unit_selection"
             class="lesson__adjacent_angles_unit_selection">
          <span id="id_radians">Radians</span>
          /
          <span id="id_degrees">Degrees</span>
        </div>
      `,
      modifiers: {
        Parallel: clickWord(
          'Parallel', 'id_related_angles__parallel',
          diag.goToParallel, [diag],
        ),
        Vertically_Opposite: clickWord(
          'Vertically Opposite', 'id_related_angles__vertically_opposite',
          diag.goToOpposite, [diag],
        ),
        Corresponding: clickWord(
          'Corresponding', 'id_related_angles__corresponding',
          diag.goToCorresponding, [diag],
        ),
        Alternate: clickWord(
          'Alternate', 'id_related_angles__alternate',
          diag.goToAlternate, [diag],
        ),
        Interior: clickWord(
          'Interior', 'id_related_angles__interior',
          diag.goToInterior, [diag],
        ),
      },
      setEnterState: () => {
        console.log(diag)
        // diag.setRotation(Math.PI / 3);
        // diag._angleText.setPosition(layout.angleEqualsText.bottomRight);
      },
      showOnly: [
        // diag.__selector,
        // circle,
        // circle._radius,
        // circle._startLine,
        // circle._endLine,
        // circle._angleA,
        // circle._angleA._arc,
        // circle._angleB,
        // circle._angleB._arc,
      ],
      show: [
        diag.__selector,
      ],
      setSteadyState: () => {
        // diag.__selector.showAll();
        // diag.resetCircle('right', Math.PI / 3);
        // diag.setEndLineRotation(Math.PI / 3);
        // diag.setRotation(Math.PI / 6);
        // circle.transform.updateRotation(0);
        // diag.selectAnglePair('adjacent');
        // onClickId('id_unit_selection', diag.toggleUnits, [diag, null]);
        // onClickId('id_angle_text', diag.pulseAngle, [diag]);
        // diag.toggleUnits('deg');
        // diag.goToAdjacent();
      },
    });
  }
}

export default Content;