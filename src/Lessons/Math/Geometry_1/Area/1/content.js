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
    const shapes = diag._shapes;
    const meas = diag._measure;

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
        <p>Shape properties examined so far include |side lengths|, |angle sizes|, |width| (like diameter of a circle) and the |relationships| between them.<p>
      `),
    });

    this.addSection(common, {
      setContent: centerV(`
        <p>
          Another important property of shapes is |how much space they take up|.
        </p>
        <p>
          For instance, if you want to |cover| a |large rectangle wall| with |small square tiles|, then the amount of space the two shapes take up will tell you |how many| tiles you will need.
        </p>
      `),
    });
    this.addSection(common, {
      setContent: centerV(`
        <p>
          This property is named |area|.
        </p>
        <p>
          The word was originally |Latin| where it means a |vacant piece of level ground|. In the mid 16th century, the word was used to describe a |space allocated for a specific purpose|. And so today, we use it to describe |how much space a shape takes up|.
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
        shapes, shapes._square1, shapes._square2,
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
        shapes, shapes._circle, shapes._square2,
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

    common.showOnly = [meas];
    this.addSection(common, {
      setContent: [
        'Well, |length| is measured by counting |reference lengths|.',
        'A line of length |_4_meters|, has four |_1_meter| reference lengths.',
      ],
      modifiers: {
        _4_meters: highlight(colors.line),
        _1_meter: highlight(colors.reference),
      },
      show: [
        meas._length,
      ],
    });
    this.addSection(common, {
      setContent: [
        '|Angle| is measured by counting |reference angles|.',
        'An angle of |_60deg|, has sixty |_1deg| reference angles.',
      ],
      modifiers: {
        _60deg: highlightWord('60º', colors.line),
        _1deg: highlightWord('1º', colors.reference),
      },
      show: [
        meas._angle,
      ],
    });
    this.addSection(common, {
      setContent: [
        'Similarly, |area| is measured by counting |reference areas|.',
      ],
      show: [
        meas._squareGrid, meas._squareA,
        meas._circleA, meas._triangleA,
      ],
    });
    this.addSection(common, {
      setContent: [
        'But what reference |shape| should be used?',
      ],
      modifiers: {
        shape: click(meas.toggleGrid, [meas], colors.diagram.action),
      },
      show: [
        meas._squareGrid, meas._squareA,
        meas._circleA, meas._triangleA,
      ],
    });
    this.addSection(common, {
      setContent: [
        'There are many shapes to choose from, but some will be more |convenient| to use.',
      ],
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid,
      ],
    });

    common.setContent = [
      'For instance, selecting a shape that |completely fills in space| without gaps is needed to fully cover a space.',
      '|Circles can only be stacked with gaps|, and is therefore not the best choice.',
    ];
    this.addSection(common, {
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid,
      ],
    });
    this.addSection(common, {
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid, meas._crossCircle,
      ],
    });

    common.setContent = [
      'Selecting a shape that is |simple|, |symmetric| and |easy to analyze| will also be more convenient.',
      'The |curves| and |lack of symmetry| of the wavy shape will make it |harder| to work with.',
    ];
    this.addSection(common, {
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid, meas._crossCircle,
      ],
    });
    this.addSection(common, {
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid, meas._crossCircle,
        meas._crossGeneric,
      ],
    });

    this.addSection(common, {
      setContent: [
        'While this is only comparing a square to two other shapes, doing a similar analysis with any other shapes would still result in |squares as the most convenient shape|.',
      ],
      show: [
        meas._smallSquareGrid, meas._smallGenericGrid,
        meas._smallCircleGrid, meas._crossCircle,
        meas._crossGeneric,
      ],
    });

    this.addSection(common, {
      title: 'asdf',
      setContent: [
        'Therefore |area| is most often measured in |squares|.',
      ],
      show: [
        meas._squareGrid, meas._squareA,
        meas._circleA, meas._triangleA,
        meas._triLabel, meas._squareLabel, meas._circleLabel,
      ],
    });
  }
}

export default Content;
