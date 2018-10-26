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
    const size = diag._size;
    const rect = diag._rect;
    const tri = diag._tri;

    const mods = {
      m: highlight(colors.unit),
    };
    // rect.eqns.rectEqn.changeDescription('0', 'Area is 6 rows of 10 squares', mods);
    rect.eqns.rectEqn.changeDescription('0', 'Rectangle area is product of width and height.', mods);
    rect.eqns.rectEqn.changeDescription('1', 'Expand both 6|m| and 10|m| as 6|m| is the same as saying 6 lots of 1|m|.', mods);
    rect.eqns.rectEqn.changeDescription('2', 'Reorder equation so all |m| terms are on the right.', mods);
    rect.eqns.rectEqn.changeDescription('3', 'Calculate 6 ⨉ 10', mods);
    rect.eqns.rectEqn.changeDescription('4', 'Replace 6 ⨉ 10 with calculated result', mods);
    rect.eqns.rectEqn.changeDescription('5', 'Multiplying anything by 1 doesn\'t change the result.', mods);
    rect.eqns.rectEqn.changeDescription('6', 'Simplify by removing 1s', mods);
    rect.eqns.rectEqn.changeDescription('7', 'Multiplying something by itself is the same as squaring it.', mods);
    rect.eqns.rectEqn.changeDescription('8', 'Resulting area of rectangle', mods);


    tri.eqns.tri2AreaEqn.changeDescription('0', 'Area of the triangle is the sum of the two smaller triangle areas.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('1', 'The smaller triangle areas are half the area of the rectangle they are in.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('2', 'The smaller triangle areas are half the area of the rectangles they are in.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('3', 'Prepare for factoring out common terms.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('4', 'Factor out common terms.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('5', 'Simplify the terms in the brackets.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('6', 'B and D sum to the base side length of the triangle.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('7', 'B and D sum to the base side length of the triangle.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('8', 'A is the height of the triangle.', mods);
    tri.eqns.tri2AreaEqn.changeDescription('9', 'Area of a triangle is half the base times the height.', mods);

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

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Measure
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
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
      setContent: [
        'Therefore |area| is most often measured in |squares|.',
      ],
      show: [
        meas._squareGrid, meas._squareA,
        meas._circleA, meas._triangleA,
        meas._triLabel, meas._squareLabel, meas._circleLabel,
      ],
    });

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Size
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    common.showOnly = [size];
    this.addSection(common, {
      setContent: centerV(`
        <p>
          What |size| are the reference squares used to measure area?
        </p>
        <p>
          Similar to |length|, there are several common sizes used depending on the size of the shape you are measuring.
        </p>
        `),
    });
    this.addSection(common, {
      setContent: [
        'A square with side |1mm| would be used for small areas, like the size of silicon chips.',
      ],
      show: [
        size._mm,
      ],
    });
    this.addSection(common, {
      setContent: [
        'A square with side |1m| would be used for larger areas, like a house.',
      ],
      show: [
        size._m,
      ],
    });

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Rectangle
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    common.showOnly = [rect];
    this.addSection(common, {
      title: 'Rectangle',
      setContent: centerV(`
        <p>
          We can now examine the area of a |rectangle|, |square| and |triangle| and see if it is |related| to any other properties of the shape.
        </p>
        `),
    });

    common.show = [rect._grid, rect._line];
    this.addSection(common, {
      setContent: [
        'Using reference squares as the unit of area makes it particularly convenient to examine the |area of a rectangle|.',
      ],
    });

    this.addSection(common, {
      setContent: [
        'In this case, there are |six_rows| of |ten_squares|.',
      ],
      modifiers: {
        six_rows: click(rect.toggleRow, [rect, null], colors.row),
        ten_squares: click(rect.toggleRow, [rect, null], colors.row),
      },
      setSteadyState: () => {
        rect.rowIndex = 5;
      },
    });

    this.addSection(common, {
      setContent: [
        'Therefore, the area of a rectangle can be calculated:',
      ],
      setSteadyState: () => {
        rect.eqns.simpleRectEqn.showForm('0');
      },
    });

    common.setContent = [
      'In other words, area can be calculated by multiplying the number of squares for two |adjacent sides|.',
    ];
    this.addSection(common, {
      setSteadyState: () => {
        rect.eqns.simpleRectEqn.showForm('0');
      },
    });

    common.show = [rect._grid, rect._line, rect._sideA, rect._sideB];
    this.addSection(common, {
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('0');
      },
    });

    common.setContent = [
      'As each square has a length, then the |number of squares in a rectangle side is the same as the side\'s length|.',
    ];
    this.addSection(common, {
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('0');
      },
    });

    this.addSection(common, {
      transitionFromPrev: (done) => {
        rect._numSquaresEqn.showForm('0');
        rect.eqns.numSquaresEqn.getForm('1')
          .animatePositionsTo(0, 0.5, 1, 0.5, done);
      },
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('1');
      },
    });

    this.addSection(common, {
      setContent: [
        'So the area of a rectangle is also equal to the product of |two adjacent side lengths|.',
      ],
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('1');
      },
    });

    this.addSection(common, {
      setContent: [
        '|Length| is usually assumed, and so it can be removed from the equation for simplicity.',
      ],
      transitionFromPrev: (done) => {
        rect._numSquaresEqn.showForm('1');
        rect.eqns.numSquaresEqn.getForm('2')
          .animatePositionsTo(0, 0.5, 1, 0.5, done);
      },
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('2');
      },
    });

    common.setContent = [
      'Often, a rectangle\'s sides are renamed to be something more |intuitive|. For example maybe |width| and |height| for this case.',
    ];
    this.addSection(common, {
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('2');
      },
    });
    common.show = [rect._grid, rect._line, rect._sideWidth, rect._sideHeight];
    this.addSection(common, {
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('2');
      },
    });
    common.setContent = [
      'And so the area of a rectangle is the multiple of its |width| and |height|.',
    ];
    this.addSection(common, {
      transitionFromPrev: (done) => {
        rect._numSquaresEqn.showForm('2');
        rect.eqns.numSquaresEqn.getForm('3')
          .animatePositionsTo(0, 0.5, 1, 0.5, done);
      },
      setSteadyState: () => {
        rect._numSquaresEqn.showForm('3');
      },
    });

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Area Units
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    this.addSection({
      title: 'Area Units',
      setContent: centerV([
        'So we know that |area of a rectangle| is the |product of two adjacent side lengths|.',
        'We also know area is measured in |reference squares|, that can have a specific side length such as |meters|.',
        'We can put these together to understand how the units for area are |normally written|.',
      ]),
    });

    common.show = [rect._grid, rect._line, rect._side6m, rect._side10m];
    this.addSection(common, {
      setContent: [
        'Lets assume the reference squares have |1m side| length. Therefore the rectangle\'s |height| is |6m| and |width| is |10m|.',
      ],
    });

    this.addSection(common, {
      setContent: [
        'Now we can calculate area.',
      ],
      setSteadyState: () => {
        rect._rectEqn.showForm('0');
      },
    });

    this.addSection(common, {
      setContent: [
        'So the short hand way of writing units is to use the mathematical |square notation|.',
      ],
      setSteadyState: () => {
        rect.eqns.simpleUnitsEqn.showForm('0');
      },
    });

    this.addSection(common, {
      setContent: [
        'If the reference squares have side length |1m|, then we would say the area unit is |meters squared| or |m<sup>2</sup>|.',
      ],
      setSteadyState: () => {
        rect.eqns.simpleUnitsEqn.showForm('0');
      },
    });

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Square
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    this.addSection(common, {
      title: 'Square',
      setContent: [
        'As a |square| is a special type of rectangle, so area can be calculated the same way. |Adjacent sides are multiplied|.',
      ],
      show: [rect._gridSquare, rect._square, rect._sideSquareA, rect._sideSquareB],
      setSteadyState: () => {
        rect.eqns.squareEqn.showForm('0');
      },
    });

    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Triangle
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // common.show = [tri];
    common.showOnly = [tri];
    this.addSection(common, {
      title: 'Triangle',
      setContent: [
        'The area of a |triangle| is more challenging to calculate as squares do not fit nicely into triangles.',
      ],
      show: [tri._grid, tri._triIntro],
    });

    common.setContent = [
      'However, we can use our knowledge of |rectangles| to help calculate the area of a triangle.',
    ];
    this.addSection(common, {
      show: [tri._grid, tri._triIntro],
    });

    this.addSection(common, {
      show: [tri._rect, tri._sideRectA, tri._sideRectB],
    });

    common.setContent = [
      'We know the area of a rectangle is the |product of two adjacent sides|.',
    ];
    this.addSection(common, {
      show: [tri._rect, tri._sideRectA, tri._sideRectB],
      setSteadyState: () => {
        tri.eqns.triRectEqn.showForm('0');
      },
    });

    common.setContent = [
      'We can halve the rectangle into two |equal triangles|.',
    ];
    common.setSteadyState = () => { tri.eqns.triRectEqn.showForm('0'); };
    this.addSection(common, {
      show: [tri._rect, tri._sideRectA, tri._sideRectB],
    });

    this.addSection(common, {
      show: [
        tri._rect, tri._rectSplit, tri._sideRectA, tri._sideRectB,
      ],
    });

    common.setContent = [
      'Each triangle is |equal|, so each will have |half| the area of the rectangle.',
    ];
    common.show = [tri._rect, tri._rectSplit, tri._sideRectA, tri._sideRectB];
    this.addSection(common, {
      show: [tri._rect, tri._rectSplit, tri._sideRectA, tri._sideRectB],
    });

    this.addSection(common, {
      show: [tri._rect, tri._rectSplit, tri._sideRectA, tri._sideRectB],
      transitionFromPrev: (done) => {
        tri.eqns.triRectEqn.showForm('0');
        tri.eqns.triRectEqn.getForm('1')
          .animatePositionsTo(0, 0.5, 1, 0.5, done);
      },
      setSteadyState: () => { tri.eqns.triRectEqn.showForm('1'); },
    });

    this.addSection({
      setContent: centerV(['We can now use this to calculate the area of |any triangle|, not just one that is part of a rectangle.']),
    });

    // common.show = [
    //   tri._tri2, tri._tri2Rect1, tri._tri2Rect2,
    //   tri._sideTriRect1A, tri._sideTriRect1B,
    //   tri._sideTriRect2A, tri._sideTriRect2B,
    //   tri._tri2Rect1Tri, tri._tri2Rect2Tri,
    //   tri._label1, tri._label2,
    // ];
    common.setSteadyState = () => {};
    common.show = [tri._tri2];
    this.addSection(common, {
      title: 'asdf',
      setContent: ['Start with any triangle.'],
    });

    common.setContent = ['Draw a |rectangle| with the two |left| most points of the triangle and label its sides.'];
    this.addSection(common, {});
    this.addSection(common, {
      show: [tri._tri2, tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B],
    });

    common.setContent = ['Draw a |second rectangle| with the two |right| most points of the triangle and label its sides.'];
    this.addSection(common, {
      show: [
        tri._tri2, tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
      ],
    });
    this.addSection(common, {
      show: [
        tri._tri2,
        tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
        tri._tri2Rect2, tri._sideTriRect2C, tri._sideTriRect2D,
      ],
    });

    common.setContent = ['Sides |A| and |C| are both the |height| of the triangle, and are the same.'];
    common.modifiers = {
      A: highlight(colors.construction),
      C: highlight(colors.construction1),
    };
    this.addSection(common, {
      show: [
        tri._tri2,
        tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
        tri._tri2Rect2, tri._sideTriRect2C, tri._sideTriRect2D,
      ],
    });
    this.addSection(common, {
      show: [
        tri._tri2,
        tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
        tri._tri2Rect2, tri._sideTriRect2A, tri._sideTriRect2D,
      ],
    });

    // common.setContent = ['Sides |B| and |D| combine to be the |base| side of the triangle.'];
    // common.modifiers = {
    //   B: highlight(colors.construction),
    //   D: highlight(colors.construction1),
    // };
    // this.addSection(common, {
    //   show: [
    //     tri._tri2,
    //     tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
    //     tri._tri2Rect2, tri._sideTriRect2AH, tri._sideTriRect2D,
    //   ],
    // });
    // this.addSection(common, {
    //   show: [
    //     tri._tri2,
    //     tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
    //     tri._tri2Rect2, tri._sideTriRect2AH, tri._sideTriRect2D,
    //     tri._sideTriRectBase,
    //   ],
    // });

    common.setContent = ['The |area of the triangle| is the |sum| of the areas of the |two smaller triangles|.'];
    common.modifiers = {
      A: highlight(colors.construction),
      C: highlight(colors.construction1),
    };
    this.addSection(common, {
      show: [
        tri._tri2,
        tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
        tri._tri2Rect2, tri._sideTriRect2A, tri._sideTriRect2D,
      ],
    });
    common.show = [
      tri._tri2,
      tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
      tri._tri2Rect2, tri._sideTriRect2A, tri._sideTriRect2D,
      tri._tri2Rect1Tri, tri._tri2Rect2Tri,
      // tri._labelAD, tri._labelAC,
    ];
    this.addSection(common, {});
    this.addSection(common, {
      title: '234qer',
      setSteadyState: () => {
        tri._tri2AreaEqn.showForm('0');
      },
    });

    common.setContent = ['The area of each smaller triangle is half the area of the rectangle it is in.'];
    this.addSection(common, {
      setSteadyState: () => {
        tri.eqns.tri2AreaEqn.showForm('0');
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        tri.eqns.tri2AreaEqn.showForm('1');
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        tri.eqns.tri2AreaEqn.showForm('2');
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        tri.eqns.tri2AreaEqn.showForm('3');
      },
    });
    this.addSection(common, {
      setSteadyState: () => {
        tri.eqns.tri2AreaEqn.showForm('4');
      },
    });
  }
}

export default Content;
