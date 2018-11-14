// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  highlight, click, // centerV,
} from '../../../../../js/tools/htmlGenerator';
import LessonDiagram from './diagram';
// import Definition from '../../../../LessonsCommon/tools/definition';
import lessonLayout from './layout';
import imgLink from '../tile.png';
import imgLinkGrey from '../tile-grey.png';
import details from '../details';

const layout = lessonLayout();
const { colors } = layout;

class Content extends LessonContent {
  setTitle() {
    this.title = details.details.title;
    this.iconLink = imgLink;
    this.iconLinkGrey = imgLinkGrey;
  }

  setDiagram(htmlId: string = '') {
    this.diagram = new LessonDiagram(htmlId, layout);
  }

  setElementContent() {
    const { selector } = this.diagram.elements._circ._selector;
    layout.polygonSides.forEach((numSides) => {
      selector.add(numSides.toString(), `${numSides.toString()}`);
    });
    selector.selectWithoutExecution('1');
  }

  addSections() {
    const diag = this.diagram.elements;
    const circ = diag._circ;

    const common = {
      setContent: '',
      setInfo: '',
      modifiers: {},
      infoModifiers: {},
      setEnterState: () => {},
      showOnly: [],
      show: [circ],
      hide: [],
      setSteadyState: () => {},
      setLeaveState: () => {},
      transitionFromAny: (done) => { done(); },
    };
    // common.setEnterState = () => {
    //   circ.setScenario(circ, layout.collection.scenarios.center);
    //   // circ._circle.setColor(colors.lines);
    // };
    // common.transitionFromPrev = (done) => {
    //   circ.moveToScenario(circ, layout.collection.scenarios.center, null, done);
    // };
    common.setSteadyState = () => {
      circ.setScenario(circ, layout.collection.scenarios.center);
    };
    common.showOnly = [circ];
    this.addSection(common, {
      title: 'Introduction',
      setContent: ['The area of a circle can initially seem challenging to calculate as its |edge is curved|.'],
      show: [circ._circle, circ._grid],
    });
    common.setContent = 'Curves don\'t line up with straight lines.';
    this.addSection(common, { show: [circ._circle, circ._grid] });
    common.setContent = 'So we have to start by making an |approximation|.';
    this.addSection(common, { show: [circ._grid, circ._circle] });
    this.addSection(common, { show: [circ._circle] });

    common.setContent = 'Start by splitting the circle into |6 equal pieces|.';
    this.addSection(common, { show: [circ._circle] });
    this.addSection(common, { show: [circ._circle, circ._lines6] });

    common.setContent = 'These pieces can be made into |6 equal triangles|.';
    this.addSection(common, { show: [circ._circle, circ._lines6] });
    this.addSection(common, { show: [circ._circle, circ._lines6, circ._poly6] });
    this.addSection(common, { show: [circ._backgroundCircle, circ._lines6, circ._poly6] });

    common.setContent = 'Each triangle has the same |height| and |base|.';
    common.modifiers = {
      height: highlight(colors.height),
      base: highlight(colors.border),
      area: highlight(colors.area),
      all: click(circ.rotateArea, [circ, 6, null], colors.diagram.action),
      Each: click(circ.rotateArea, [circ, 6, null], colors.diagram.action),
      each_: click(circ.rotateArea, [circ, 6, null], colors.diagram.action),
    };
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
      ],
    });
    common.setContent = '|Each| triangle has the same |height| and |base|.';
    common.showOnly = [circ, circ._tri6];
    common.setEnterState = () => {
      circ.rotateArea(6, circ.triRotation);
    };
    common.setLeaveState = () => {
      circ.rotateArea(6, 0);
    };
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
        circ._tri6._height, circ._tri6._base,
      ],
    });

    common.setContent = 'And therefore |each_| triangle has the same |area|.';
    let show = [
      circ._backgroundCircle, circ._lines6, circ._poly6,
      circ._tri6._height, circ._tri6._base,
    ];
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
        circ._tri6._height, circ._tri6._base,
      ],
    });
    this.addSection(common, {
      show: [...show],
      transitionFromPrev: (done) => {
        circ.moveToScenario(circ, layout.collection.scenarios.left, null, done);
      },
      setSteadyState: () => {
        circ.setScenario(circ, layout.collection.scenarios.left);
        circ._tri6._fill.show();
        circ.eqns.triRectEqn.showForm('0');
      },
    });

    common.setLeaveState = () => {};
    common.show = [...show, circ._tri6._fill];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
    };
    common.setContent = 'The area of |all triangles| is |6 times one triangle|.';
    this.addEqnStep(circ.eqns.triRectEqn, '0', '0', common);
    common.show = [...show, circ._fill6];
    this.addEqnStep(circ.eqns.triRectEqn, '0', ['1', '0'], common);

    common.setContent = 'The area of the |triangles|, is a rough |approximation| of the |circle| area.';
    // common.modifiers = {
    //   triangles: click(circ.showTriangles, [circ, 6, 'tris', false], colors.areaTriLabel),
    //   circle: click(circ.showTriangles, [circ, 6, 'circle', false], colors.areaCircleLabel),
    // };
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '0'], ['1', '0'], common);

    common.setContent = 'Now, what happens when we |increase| the number of triangles?';
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '0'], ['1', '0'], common);

    common.setContent = 'Touch the numbers near the circle to change the number of triangles.';
    common.show = [...show, circ._fill6, circ._selector];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
      circ._selector.selector.select('6');
      circ.rotateArea(6, 0);
    };
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '0'], ['1', '0'], common);

    common.setContent = 'As the number of triangles is |increased| the area appoximation becomes |better|.';
    common.showOnly = [circ, circ._tri25];
    show = [
      circ._backgroundCircle, circ._lines25, circ._poly25,
      circ._tri25._height, circ._tri25._base, circ._fill25,
    ];
    common.show = [...show, circ._selector];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
      circ._selector.selector.select('25');
      circ.rotateArea(6, 0);
    };
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '2'], ['1', '2'], common);

    common.setContent = 'Also the |height| gets closer to the |radius| length, and the outside |border| gets closer to the circle |circumference|.';
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '2'], ['1', '2'], common, {title: 'asdf'});

    common.setContent = 'If we look closer at equation for area, the last two terms are the same as the border length.';
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '2'], ['1', '2'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '2'], ['2', '2'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['2', '2'], ['3'], common);

    common.setContent = 'Now, we is assume a large number of triangles, then the |height| is approximately equal to the |radius|.';
    common.hide = [circ._selector];
    this.addEqnStep(circ.eqns.triRectEqn, ['3'], ['3'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['3'], ['4'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['4'], ['5'], common);

    common.setContent = 'And the border is approximately equal to the circle circumference |2πr|.';
    common.hide = [circ._selector];
    this.addEqnStep(circ.eqns.triRectEqn, ['5'], ['5'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['5'], ['6'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['6'], ['7'], common);

    common.setContent = 'We can rearrange the equation to get a general relationship for area.';
    this.addEqnStep(circ.eqns.triRectEqn, ['7'], ['7'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['7'], ['8'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['8'], ['9'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['9'], ['10'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['10'], ['11'], common);
    this.addEqnStep(circ.eqns.triRectEqn, ['11'], ['12'], common);

    common.setContent = 'In addition, as the number of triangles increases, the outside border length gets closer to that of the circle circumference.';
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '2'], ['1', '2'], common);

    this.addSection(common, {
      title: 'Introduction',
      setContent: ['The area of a circle can initially seem challenging to calculate as its edge is curved.'],
      showOnly: [circ],
      show: [circ],
      transitionFromPrev: (done) => {
        circ.moveToScenario(circ, layout.collection.scenarios.left, null, done);
      },
      setSteadyState: () => {
        circ.setScenario(circ, layout.collection.scenarios.left);
        circ.eqns.triRectEqn.showForm('6', 'base');
      },
    });
  }
}

export default Content;
