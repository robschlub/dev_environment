// @flow
import {
  LessonContent,
} from '../../../../js/Lesson/LessonContent';
import {
  Point,
} from '../../../../js/diagram/tools/g2';
import {
  click, centerV, highlight, clickWord, highlightWord,
} from '../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
import Definition from '../../../../LessonsCommon/tools/definition';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import details from '../details';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  addSections() {
    const diag = this.diagram.elements;
    const quad = diag._quad;
    const rect = diag._rect;
    const qr = diag._qr;
    let common = {};

    common = {
      setContent: '',
      showOnly: [
        quad, quad._quad1, quad._quad2, quad._quad3, qr,
      ],
      show: [],
    };
    this.addSection(common, {
      title: 'Quadrilateral',
      setContent: `
        <p>
          A |quadrilateral| is a shape with |four sides| and |four angles|.
        </p>
        ${new Definition('Quadrilateral', 'Latin', ['quadri', 'four', 'latus, later', 'side']).html('id_lesson__quadrilateral_definition')}
      `,
    });

    this.addSection(common, {
      setContent: `
        <p>
          The four side lengths and four angles are |properties| of a quadrilateral. 
        </p>
      `,
    });

    this.addSection(common, {
      title: 'Total Angle',
      setContent: `
        <p>
          Similar to a |triangle|, all the angles in a quadrilateral are related to each other and will |always add up to the same angle|.
        </p>
      `,
      modifiers: {
        triangle: click(qr._tri.show, [qr._tri], colors.diagram.action),
      },
    });

    common.setContent = `
      <p>
        We can show this by drawing a line between opposite corners of a quadrilateral.
      </p>
    `;
    this.addSection(common);

    common.showOnly = [qr];
    common.show = [quad];
    this.addSection(common);

    this.addSection(common, {
      setContent: `<p>
        A quadrilateral can always be split into two triangles.
      </p>`,
    });

    this.addSection(common, {
      setContent: `<p>
        As each |triangle|, has a total angle of 180º, the the total angle of a quadrilateral must be two times that, or |360º|.
      </p>`,
      modifiers: {
        triangle: click(qr._tri.show, [qr._tri], colors.diagram.action),
      },
    });

    this.addSection({
      setContent: centerV(`
        <p>
          So to summarize, a |quadrilateral| is a shape with |four sides| and |four angles|.
        </p>
        <p>
          A quadrilateral's angles will |always add up to 360º| (|2π radians|).
        </p>
      `),
    });

    common = {
      setContent: '',
      modifiers: {},
      setEnterState: () => {
        rect.resetColors();
      },
      showOnly: [
        qr, rect,
        rect._lineA, rect._lineA._line, rect._lineB, rect._lineB._line,
        rect._lineC, rect._lineC._line, rect._lineD, rect._lineD._line,
      ],
      show: [
        rect._rightAngle1, rect._rightAngle2,
        rect._rightAngle3, rect._rightAngle4,
      ],
      setSteadyState: () => {},
    };
    // common.show = [rect];
    // common.hide = [rect._eqnDescription]
    this.addSection(common, {
      title: 'Rectangle',
      setContent: `<p>
        A special type of quadrilateral is one where all the |angles are equal to 90º|. This shape is called a |rectangle|.
      </p>
      ${new Definition('Rectangle', 'Latin', ['rectus', 'right', 'angulus', 'corner, angle']).html('id_lesson__rectangle_definition', 'lesson__definition_low')}
      `,
      // modifiers: {
      //   angles_are_equal_to_90: higlight(
      //     'angles are equal to 90º',
      //     colors.angles,
      //   ),
      // },
      // setSteadyState: () => {
      //   rect.rectEqn.showForm('1');
      //   rect._angleB.showForm('0');
      //   rect._angleC.showForm('0');
      //   rect._angleD.showForm('0');
      // },
    });
    common.show = [
      rect._rightAngle1, rect._rightAngle2, rect._rightAngle3,
      rect._rightAngle4, rect._lineA, rect._lineB, rect._lineC, rect._lineD,
    ];
    this.addSection(common, {
      setContent: `<p>
        The first properties to note are the four |side_lengths| and four |angles|. When properties are identified, the next question is are they related to each other?
      </p>`,
      modifiers: {
        side_lengths: click(rect.pulseSideLabels, [rect], colors.lines),
        angles: click(rect.pulseRightAngles, [rect], colors.angles),
      },
    });

    this.addSection(common, {
      setContent: `<p>
        When properties are identified, the next question is are they related to each other?
      </p>`,
    });

    this.addSection(common, {
      setContent: `<p>
        We know that all the angles are equal and 90º.
      </p>`,
    });

    common.setContent = `<p>
        To examine the relationship between side lengths, we can |split| the rectangle into |two triangles|.
      </p>`;
    this.addSection(common);

    common.show = [
      rect._rightAngle1, rect._rightAngle2, rect._rightAngle3,
      rect._rightAngle4, rect._lineA, rect._lineB, rect._lineC, rect._lineD,
      rect._lineE,
    ];
    this.addSection(common);

    this.addSection(common, {
      setContent: `<p>
        These triangles |look| the same. If they are |congruent|, then opposite sides in a rectangle are equal. Let's see.
      </p>`,
      modifiers: {
        congruent: click(qr._congruent.show, [qr._congruent], colors.diagram.action),
      },
    });

    common.setContent = `<p>
      Let's start by looking at just one triangle's angles, labelling the unknown angles.
    </p>`;
    this.addSection(common);

    common.showOnly = [
      qr, rect, rect._lineE, rect._lineE._line,
      rect._lineA, rect._lineA._line, rect._lineB, rect._lineB._line,
      rect._lineC, rect._lineC._line, rect._lineD, rect._lineD._line,
    ];
    common.show = [
      rect._rightAngle2,
      rect._angleA, rect._angleB,
    ];
    common.setSteadyState = () => {
      rect._angleB.showForm('0');
      rect._lineC.setColor(colors.diagram.disabledDarkest);
      rect._lineD.setColor(colors.diagram.disabledDarkest);
    };
    this.addSection(common);

    common.setContent = `<p>
      First, we can find angle |b| in terms of angle |a| as we know the third angle is a right angle.
    </p>`;
    common.modifiers = {
      b: highlight(colors.angles),
      a: highlight(colors.angles),
    };
    common.setSteadyState = () => {
      rect._angleB.showForm('0');
      rect.rectEqn.showForm('0');
      rect._lineC.setColor(colors.diagram.disabledDarkest);
      rect._lineD.setColor(colors.diagram.disabledDarkest);
    };

    rect.rectEqn.changeDescription('0', 'Angles in a triangle |add_up_to_180|.', {
      add_up_to_180: clickWord('add up to 180º', 'add_up_to_180', qr._tri.show, [qr._tri], colors.diagram.action),
    });
    rect.rectEqn.changeDescription('1', 'Subtract 90º from both sides of the equation.');
    rect.rectEqn.changeDescription('2a', '90º is cancelled on left side.');
    rect.rectEqn.changeDescription('2b', '0 remaining so can be removed');
    rect.rectEqn.changeDescription('2c', '180º is reduced to 90º on right side.');
    rect.rectEqn.changeDescription('3', 'Clean up into one line.');
    rect.rectEqn.changeDescription('4', 'Subtract angle |a| from both sides of the equation.', {
      a: highlight(colors.angles),
    });
    rect.rectEqn.changeDescription('5', '|a| cancels on the left side', { a: highlight(colors.angles) });
    rect.rectEqn.changeDescription('5a', 'No |a| remaining on left side, so can be removed', { a: highlight(colors.angles) });
    rect.rectEqn.changeDescription('6', 'End with |b| in terms of |a|.',
      { 
        a: highlight(colors.angles),
        b: highlight(colors.angles),
      });

    this.addSection(common, {
      title: 'adsf',
      show: [
        rect._rightAngle2,
        rect._angleA, rect._angleB,
        // rect._rectEqn, rect._rectEqnDescription,
        rect._nav,
      ],
    });
  }
}

export default Content;
