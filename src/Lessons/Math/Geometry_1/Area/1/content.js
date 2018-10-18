// @flow
import {
  LessonContent,
} from '../../../../../js/Lesson/LessonContent';
import {
  click, centerV, highlight, highlightWord,
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

  addSections() {
    const diag = this.diagram.elements;
    const areaShapes = diag._areaShapes;

    let common = {
      setContent: [],
      setInfo: '',
      modifiers: {},
      infoModifiers: {},
      setEnterState: () => {},
      showOnly: [],
      show: [],
      hide: [],
      setSteadyState: () => {},
      setLeaveState: () => {},
    };
    this.addSection(common, {
      title: 'Introduction',
      setContent: centerV(`
        <p>The properties examined so far for |circles|, |triangles| and |quadrangles| have been their |side lengths|, |angle sizes|, |width| and the |relationships| between them.<p>
      `),
    });

    this.addSection(common, {
      setContent: centerV(`
        <p>
          An important property of shapes is |how much space they take up|.
        </p>
        <p>
          For instance, if you want to |cover| a large rectangle wall with small square tiles, then the amount of space the two shapes take up will tell you |how many| tiles you need to cover the wall.
        </p>
      `),
    });
    this.addSection(common, {
      setContent: centerV(`
        <p>
          This property is named |area|.
        </p>
        <p>
          The word comes from |Latin| where it means a |vacant piece of level ground|. In the mid 16th century, the word was used to describe a |space allocated for a specific purpose|. And so today, we use it to describe how much space a shape takes up.
        </p>
      `),
    });
    this.addSection(common, {
      setContent: [
        'Shapes with |large_area| take up more space than shapes with |small_area|.',
      ],
      modifiers: {
        large_area: highlight(colors.square1),
        small_area: highlight(colors.square2),
      },
      showOnly: [
        areaShapes, areaShapes._square1, areaShapes._square2,
      ],
    });
    this.addSection(common, {
      setContent: [
        'Area is a property that any shape can have. So circles with |large_area|, take up more space than squares with |small_area|.',
      ],
      modifiers: {
        large_area: highlight(colors.square1),
        small_area: highlight(colors.square2),
      },
      showOnly: [
        areaShapes, areaShapes._circle, areaShapes._square2,
      ],
    });
    this.addSection(common, {
      title: 'Measurement',
      setContent: centerV(`
        <p>
          |Area| is a property that has now been |identified| and |named|.
        </p>
        <p>
          How can we |measure| it?
        </p>
      `),
    });
    this.addSection(common, {
      setContent: [
        'Well, |length| is measured by counting |reference lengths|.',
        'A line of length |_4_meters|, has four |_1_meter| reference lengths.',
      ],
      modifiers: {
        _4_meters: highlight(colors.line),
        _1_meter: highlight(colors.reference),
      },
      showOnly: [
        areaShapes,
      ],
      show: [
        areaShapes._length,
      ],
    });
    this.addSection(common, {
      setContent: [
        'Similarly, |angle| is measured by counting |reference angles|.',
        'An angle of |_60deg|, has sixty |_1deg| reference angles.',
      ],
      modifiers: {
        _60deg: highlightWord('60º', colors.line),
        _1deg: highlightWord('1º', colors.reference),
      },
      showOnly: [
        areaShapes,
      ],
      show: [
        areaShapes._angle,
      ],
    });
    this.addSection(common, {
      setContent: [
        '|Area| is is also measured by counting |reference areas|.',
      ],
      showOnly: [
        areaShapes,
      ],
      show: [
        areaShapes._squareGrid, areaShapes._squareA,
        areaShapes._circleA, areaShapes._triangleA,
      ],
    });
    this.addSection(common, {
      setContent: [
        'But what reference |shape| should be used?',
      ],
      modifiers: {
        shape: click(areaShapes.toggleGrid, [areaShapes], colors.diagram.action),
      },
      showOnly: [
        areaShapes,
      ],
      show: [
        areaShapes._squareGrid, areaShapes._squareA,
        areaShapes._circleA, areaShapes._triangleA,
      ],
    });
    this.addSection(common, {
      setContent: [
        'There are many shapes to choose from, but some will be more |convenient|.',
      ],
      showOnly: [
        areaShapes,
      ],
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid,
      ],
    });

    common.showOnly = [areaShapes];
    common.setContent = [
      'For instance, selecting a shape that |completely fills in the space|  will be simpler and more representative.',
      'In this case, the circles do not fill in all the space.',
    ];
    this.addSection(common, {
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid,
      ],
    });
    this.addSection(common, {
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid, areaShapes._crossCircle,
      ],
    });

    common.setContent = [
      'Selecting a shape that is |simple|, |symmetric| and |easy to analyze| will also be more convenient. The wavy shape will be hard analyze.',
    ];
    this.addSection(common, {
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid, areaShapes._crossCircle,
      ],
    });
    this.addSection(common, {
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid, areaShapes._crossCircle,
        areaShapes._crossGeneric,
      ],
    });

    this.addSection(common, {
      setContent: [
        'Doing this analysis with any other shape would still result in |squares as the most convenient|, and so they are |used to measure area|.',
      ],
      show: [
        areaShapes._smallSquareGrid, areaShapes._smallGenericGrid,
        areaShapes._smallCircleGrid, areaShapes._crossCircle,
        areaShapes._crossGeneric,
      ],
    });
  }
}

export default Content;
