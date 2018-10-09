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


    let mods = {
      add_up_to_180: clickWord('add up to 180º', 'add_up_to_180', qr._tri.show, [qr._tri], colors.diagram.action),
      a: highlight(colors.angles),
      b: highlight(colors.angles),
    };
    rect.abEqn.changeDescription('0', 'Angles in a triangle |add_up_to_180|.', mods);
    rect.abEqn.changeDescription('1', 'Subtract 90º from both sides of the equation.');
    rect.abEqn.changeDescription('2a', '90º is cancelled and goes to 0º on left side.');
    rect.abEqn.changeDescription('2b', '0º on left side can be removed');
    rect.abEqn.changeDescription('2c', '180º is reduced to 90º on right side.');
    rect.abEqn.changeDescription('3', 'Right side remainder is 90º.');
    rect.abEqn.changeDescription('4', 'Subtract angle |a| from both sides of the equation.', mods);
    rect.abEqn.changeDescription('5', '|a| cancels on the left side', mods);
    rect.abEqn.changeDescription('5a', 'No |a| remaining on left side, so can be removed', mods);
    rect.abEqn.changeDescription('6', 'End with |b| in terms of |a|.', mods);


    mods = {
      Complementary: click(qr._comp.show, [qr._comp], colors.diagram.action),
      a: highlight(colors.angles),
      d: highlight(colors.angles),
    };
    rect.adEqn.changeDescription('0', '|Complementary| angles add to 90º.', mods);
    rect.adEqn.changeDescription('1', 'Subtract |a| from both sides.', mods);
    rect.adEqn.changeDescription('2', '|a| cancels on the left side', mods);
    rect.adEqn.changeDescription('3', 'No |a| remaining on left side, so can be removed.', mods);
    rect.adEqn.changeDescription('4', 'End with |d| in terms of |a|.', mods);


    common = {
      setContent: '',
      showOnly: [
        quad, quad._quad1, quad._quad2, quad._quad3, qr,
      ],
      show: [],
      hide: [],
      setEnterState: () => {},
      setSteadyState: () => {},
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
        // rect.resetColors();
      },
      showOnly: [
        qr, rect, rect._rect,
        rect._rect._lineA, rect._rect._lineA._line,
        rect._rect._lineB, rect._rect._lineB._line,
        rect._rect._lineC, rect._rect._lineC._line,
        rect._rect._lineD, rect._rect._lineD._line,
      ],
      show: [
        rect._rect._rightAngle1, rect._rect._rightAngle2,
        rect._rect._rightAngle3, rect._rect._rightAngle4,
      ],
      hide: [],
      transitionFromAny: (done) => {
        rect.moveToScenario(rect._rect, layout.rect.scenarios.start, 1, done);
      },
      setSteadyState: () => {
        rect.setScenario(rect._rect, layout.rect.scenarios.start);
      },
      setLeaveState: () => {
        rect.resetColors();
      },
    };

    this.addSection(common, {
      title: 'Rectangle',
      setContent: `<p>
        A special type of quadrilateral is one where all the |angles are equal to 90º|. This shape is called a |rectangle|.
      </p>
      ${new Definition('Rectangle', 'Latin', ['rectus', 'right', 'angulus', 'corner, angle']).html('id_lesson__rectangle_definition', 'lesson__definition_low')}
      `,
      setEnterState: () => {
        rect.resetColors();
        if (this.comingFrom === 'prev') {
          rect.setScenario(rect._rect, layout.rect.scenarios.start);
        }
      },
    });

    common.show = [
      rect._rect._rightAngle1, rect._rect._rightAngle2,
      rect._rect._rightAngle3, rect._rect._rightAngle4,
      rect._rect._lineA, rect._rect._lineB,
      rect._rect._lineC, rect._rect._lineD,
    ];
    this.addSection(common, {
      setContent: `<p>
        The first properties to note are the four |side_lengths| and four |angles|.
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
      rect._rect._rightAngle1, rect._rect._rightAngle2,
      rect._rect._rightAngle3, rect._rect._rightAngle4,
      rect._rect._lineA, rect._rect._lineB,
      rect._rect._lineC, rect._rect._lineD,
      rect._rect._lineE,
    ];
    this.addSection(common);

    this.addSection(common, {
      setContent: `<p>
        These triangles |look| the same, or in other words look |congruent|. If they are, then that will tell us some of the sides will be equal to others.
      </p>`,
      modifiers: {
        congruent: click(qr._congruent.show, [qr._congruent], colors.diagram.action),
      },
    });

    common.setContent = `<p>
      Let's start by looking at just one triangle.
    </p>`;
    this.addSection(common);
    common.showOnly = [
      qr, rect, rect._rect, rect._rect._lineE, rect._rect._lineE._line,
      rect._rect._lineA, rect._rect._lineA._line,
      rect._rect._lineB, rect._rect._lineB._line,
      rect._rect._lineC, rect._rect._lineC._line,
      rect._rect._lineD, rect._rect._lineD._line,
    ];
    common.setEnterState = () => {
      rect._nav.setEquation(rect.abEqn);
      rect._rect._angleB.showForm('0');
      rect._rect._lineC.setColor(colors.diagram.disabledDark);
      rect._rect._lineD.setColor(colors.diagram.disabledDark);
    };
    common.show = [
      rect._rect._rightAngle2,
    ];
    common.modifiers = {
      b: highlight(colors.angles),
      a: highlight(colors.angles),
    };

    this.addSection(common);
    common.setContent = `<p>
      Unknown angles can then be labelled |a| and |b|.
    </p>`;
    this.addSection(common);
    common.show = [
      rect._rect._rightAngle2,
      rect._rect._angleA, rect._rect._angleB,
    ];
    common.hide = [
      rect._rect._angleB._label.__1,
    ];
    common.setSteadyState = () => {
      rect._rect._angleB.showForm('0');
      rect.setScenario(rect._rect, layout.rect.scenarios.start);
    };
    this.addSection(common);

    common.setContent = `<p>
      We know the third angle is a right angle, so we can find angle |b| in terms of angle |a|.
    </p>`;
    this.addSection(common);
    
    // common.setSteadyState = () => {
    //   rect._rect._angleB.showForm('0');
    //   rect.rectEqn.showForm('0');
    //   console.log("asdf");
    //   rect.setScenario(rect._rect, layout.rect.scenarios.analysis);
    // };
    common.transitionFromAny = (done) => {
      rect.moveToScenario(rect._rect, layout.rect.scenarios.analysis, 1, done);
    };

    this.addSection(common, {
      title: 'adsf',
      interactiveElements: [
        rect._nav._prev,
        rect._nav._prevDescription,
        rect._nav._refresh,
      ],
      setSteadyState: () => {
        rect._nav.showAll();
        rect._rect._angleB.showForm('0');
        rect.abEqn.showForm('0');
        rect.setScenario(rect._rect, layout.rect.scenarios.analysis);
        rect._nav.updateButtons();
      },
    });

    this.addSection(common, {
      interactiveElements: [
        rect._nav._prev,
        rect._nav._prevDescription,
        rect._nav._refresh,
      ],
      setSteadyState: () => {
        rect._nav.showAll();
        rect._rect._angleB.showForm('1');
        rect.abEqn.showForm('6');
        rect.setScenario(rect._rect, layout.rect.scenarios.analysis);
        rect._nav.updateButtons();
        rect.pulseAngleB();
      },
    });

    common.setContent = `<p>
      Next we consider the second triangle that forms the rectangle.
    </p>`;
    common.modifiers = {
      d: highlight(colors.angles),
      a: highlight(colors.angles),
    };
    common.setSteadyState = () => {
      rect._rect._angleB.showForm('1');
      rect.setScenario(rect._rect, layout.rect.scenarios.analysis);
    };
    this.addSection(common);

    common.setEnterState = () => {
      rect._rect._angleA.setColor(colors.diagram.disabledDark);
      rect._rect._angleB.setColor(colors.diagram.disabledDark);
      rect._rect._lineA.setColor(colors.diagram.disabledDark);
      rect._rect._lineB.setColor(colors.diagram.disabledDark);
      rect._rect._rightAngle2.setColor(colors.diagram.disabledDark);
    };
    this.addSection(common);

    common.setContent = `<p>
      Once again, start by labelling all the angles.
    </p>`;
    // this.addSection(common);
    common.show = [
      rect._rect._rightAngle2,
      rect._rect._angleA, rect._rect._angleB,
    ];
    common.hide = [
      rect._rect._angleB._label.__0,
      rect._rect._angleC._label.__1,
      rect._rect._angleD._label.__1,
    ];
    common.setSteadyState = () => {
      rect._rect._angleB.showForm('1');
      rect._rect._angleC.showForm('0');
      rect._rect._angleD.showForm('0');
      rect.setScenario(rect._rect, layout.rect.scenarios.analysis);
    };
    this.addSection(common);

    common.show = [
      rect._rect._rightAngle2, rect._rect._rightAngle4,
      rect._rect._angleA, rect._rect._angleB,
      rect._rect._angleC, rect._rect._angleD,
    ];
    this.addSection(common);

    common.setContent = `<p>
      We know |a| and |d| add to a right angle, so we can get |d| in terms of |a|.
    </p>`;
    this.addSection(common);

    common.setEnterState = () => {
      rect._nav.setEquation(rect.adEqn);
      rect._rect._angleA.setColor(colors.diagram.disabledDark);
      rect._rect._angleB.setColor(colors.diagram.disabledDark);
      rect._rect._lineA.setColor(colors.diagram.disabledDark);
      rect._rect._lineB.setColor(colors.diagram.disabledDark);
      rect._rect._rightAngle2.setColor(colors.diagram.disabledDark);
    };
    this.addSection(common, {
      setSteadyState: () => {
        common.setSteadyState();
        rect._nav.showAll();
        rect._nav.updateButtons();
        rect.adEqn.showForm('0');
      },
    });

    this.addSection(common, {
      setSteadyState: () => {
        common.setSteadyState();
        rect._nav.showAll();
        rect.adEqn.showForm('4');
        rect._rect._angleD.showForm('1');
        rect._nav.updateButtons();
        rect.pulseAngleD();
      },
    });
  }
}

export default Content;
