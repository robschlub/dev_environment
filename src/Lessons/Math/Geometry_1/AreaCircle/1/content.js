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
      setContent: ['The |area of a circle| can seem challenging to find as its |edge is curved| and doesn\'t align with straight lines.'],
      show: [circ._circle, circ._grid],
    });
    // common.setContent = 'Curves don\'t line up with straight lines.';
    // this.addSection(common, { show: [circ._circle, circ._grid] });
    common.setContent = 'However, |we can do it| if we start by making an |approximation| of a circle, that we later |refine|.';
    this.addSection(common, { show: [circ._grid, circ._circle] });
    // this.addSection(common, { show: [circ._circle] });

    const leastSides = layout.polygonSides[0];
    const mostSides = layout.polygonSides[2];
    common.setContent = `Start by splitting the circle into |${leastSides} equal pieces|.`;
    this.addSection(common, { show: [circ._circle] });
    this.addSection(common, { show: [circ._circle, circ._lines0] });

    common.setContent = `These pieces can be made into |${leastSides} equal triangles|.`;
    this.addSection(common, { show: [circ._circle, circ._lines0] });
    this.addSection(common, { show: [circ._circle, circ._lines0, circ._poly0] });
    this.addSection(common, { show: [circ._backgroundCircle, circ._lines0, circ._poly0] });

    common.setContent = 'Each triangle has the same |height| and |base|.';
    common.modifiers = {
      height: highlight(colors.height),
      base: highlight(colors.border),
      area: highlight(colors.area),
      all: click(circ.rotateArea, [circ, leastSides, null], colors.diagram.action),
      Each: click(circ.rotateArea, [circ, leastSides, null], colors.diagram.action),
      each_: click(circ.rotateArea, [circ, leastSides, null], colors.diagram.action),
      border: click(circ.pulseBorder, [circ], colors.border),
      border_: highlight(colors.border),
    };
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines0, circ._poly0,
      ],
    });
    common.setContent = '|Each| triangle has the same |height| and |base|.';
    common.showOnly = [circ, circ._tri0];
    common.setEnterState = () => {
      circ.rotateArea(leastSides, circ.triRotation);
    };
    common.setLeaveState = () => {
      circ.rotateArea(leastSides, 0);
    };
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines0, circ._poly0,
        circ._tri0._height, circ._tri0._base,
      ],
    });

    common.setContent = 'And therefore |each_| triangle has the same |area|.';
    let show = [
      circ._backgroundCircle, circ._lines0, circ._poly0,
      circ._tri0._height, circ._tri0._base,
    ];
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines0, circ._poly0,
        circ._tri0._height, circ._tri0._base,
      ],
    });
    this.addSection(common, {
      show: [...show],
      transitionFromPrev: (done) => {
        circ.moveToScenario(circ, layout.collection.scenarios.left, null, done);
      },
      setSteadyState: () => {
        circ.setScenario(circ, layout.collection.scenarios.left);
        circ._tri0._fill.show();
        circ.eqns.triRectEqn.showForm('0');
      },
    });

    common.setLeaveState = () => {};
    common.show = [...show, circ._tri0._fill];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
    };
    common.setSteadyState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
    };
    common.setContent = `The |area| of |all triangles| is then |${leastSides} | times the area of |one triangle|.`;
    this.addEqnStep(circ.eqns.triRectEqn, '0', '0', common);
    common.show = [...show, circ._fill0];
    this.addEqnStep(circ.eqns.triRectEqn, '0', ['1', '0'], common);

    common.setContent = `Similarly, the |border_| of |all triangles| is |${leastSides}| times the |base| lengths of |one triangle|.`;
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '0'], ['1', '0'], common);
    common.show = [...show, circ._fill0, circ._border0];
    common.setContent = `Similarly, the |border| of |all triangles| is |${leastSides}| times the |base| lengths of |one triangle|.`;
    common.setSteadyState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
      circ.eqns.borderEqn.showForm('0', '0');
    };
    this.addEqnStep(circ.eqns.triRectEqn, ['1', '0'], ['1', '0'], common);

    common.setContent = 'The |area| equation can be rewritten in terms of the |border| instead of the |base|.';
    this.addEqnsStep([
      [circ.eqns.triRectEqn, ['1', '0'], ['1', '0']],
      [circ.eqns.borderEqn, '0', '0'],
      ], common, {title: 'qwreq'});
    this.addEqnsStep([
      [circ.eqns.triRectEqn, ['1', '0'], ['2', '0']],
      [circ.eqns.borderEqn, '0', '0'],
      ], common);
    this.addEqnsStep([
      [circ.eqns.triRectEqn, ['2', '0'], '3'],
      [circ.eqns.borderEqn, '0', '0'],
      ], common);

    common.setSteadyState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
    };

    common.setContent = 'The |area| of the |triangles|, is a rough |approximation| of the |circle area|.';
    this.addEqnStep(circ.eqns.triRectEqn, '3', '3', common);

    common.setContent = 'The |border| of the |triangles|, is a rough |approximation| of the |circle circumference|.';
    this.addEqnStep(circ.eqns.triRectEqn, '3', '3', common);

    common.setContent = 'Now, what happens when we |increase| the number of triangles?';
    this.addEqnStep(circ.eqns.triRectEqn,  '3', '3', common);

    common.setContent = 'Touch the numbers near the circle to change the number of triangles.';
    common.show = [...show, circ._fill0, circ._selector];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
      circ._selector.selector.select(leastSides.toString());
      circ.rotateArea(leastSides, 0);
    };
    this.addEqnStep(circ.eqns.triRectEqn,  '3', '3', common);

    common.setContent = 'As the number of triangles is |increased| the |area appoximation| becomes |better|.';
    common.showOnly = [circ, circ._tri2];
    show = [
      circ._backgroundCircle, circ._lines2, circ._poly2,
      circ._tri2._height, circ._tri2._base, circ._fill2,
    ];
    common.show = [...show, circ._selector];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
      circ._selector.selector.select(mostSides.toString());
      circ.rotateArea(leastSides, 0);
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
  }
}

export default Content;
