// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  highlight, //click, centerV,
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
      selector.add(numSides.toString(), numSides.toString());
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
    common.transitionFromAny = (done) => {
      circ.moveToScenario(circ, layout.collection.scenarios.center, null, done);
    };
    common.setSteadyState = () => {
      circ.setScenario(circ, layout.collection.scenarios.center);
    };
    common.showOnly = [circ];
    this.addSection(common, {
      title: 'Introduction',
      setContent: ['The area of a circle can initially seem challenging to calculate as its |edge is curved|.'],
      show: [circ._circle],
    });
    common.setContent = 'Curves don\'t line up with straight lines.';
    this.addSection(common, { show: [circ._circle] });
    this.addSection(common, { show: [circ._circle, circ._grid] });
    this.addSection(common, {
      setContent: ['So we have to start by making an |approximation|.'],
      show: [circ._grid, circ._circle],
    });

    common.setContent = 'Start by splitting the circle into |6 equal pieces|.';
    this.addSection(common, { show: [circ._grid, circ._circle] });
    this.addSection(common, { show: [circ._circle] });
    this.addSection(common, { show: [circ._circle, circ._lines6] });

    common.setContent = 'These pieces can be make into |6 equal triangles|.';
    this.addSection(common, { show: [circ._circle, circ._lines6] });
    this.addSection(common, { show: [circ._circle, circ._lines6, circ._poly6] });
    this.addSection(common, { show: [circ._backgroundCircle, circ._lines6, circ._poly6] });

    common.setContent = 'Each triangle has a |height| and a |base|.';
    common.modifiers = {
      height: highlight(colors.height),
      base: highlight(colors.border),
      area: highlight(colors.area),
    };
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
      ],
    });
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
        circ._height6, circ._base6,
      ],
    });

    common.setContent = 'And therefore each triangle has an |area|.';
    const show = [
      circ._backgroundCircle, circ._lines6, circ._poly6,
      circ._height6, circ._base6,
    ];
    this.addSection(common, {
      show: [
        circ._backgroundCircle, circ._lines6, circ._poly6,
        circ._height6, circ._base6,
      ],
    });
    common.transitionFromAny = (done) => {
      circ.moveToScenario(circ, layout.collection.scenarios.left, null, done);
    };
    this.addSection(common, {
      show: [...show],
      setSteadyState: () => {
        circ.setScenario(circ, layout.collection.scenarios.left);
        circ._triFill6.show();
        circ.eqns.triRectEqn.showForm('0');
      },
    });

    common.setContent = 'As all the triangles are |equal|, then all |height|, |base| and |area| properties are also |equal|.';
    common.show = [...show, circ._triFill6];
    common.setEnterState = () => {
      circ.setScenario(circ, layout.collection.scenarios.left);
    };
    this.addEqnStep(circ.eqns.triRectEqn, '0', '0', common, {title: 'asdf'});
    // this.addSection(common, {
    //   show: [...show, circ._triFill6],
    //   setSteadyState: () => {
    //     circ.setScenario(circ, layout.collection.scenarios.left);
    //     circ.eqns.triRectEqn.showForm('0', '0');
    //   },
    // });

    common.setContent = 'And therefore the area of |all triangles| is |6 times one triangle|.';
    this.addEqnStep(circ.eqns.triRectEqn, '0', '0', common);
    common.show = [...show, circ._fill6];
    this.addEqnStep(circ.eqns.triRectEqn, '0', ['1', '0'], common);

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
