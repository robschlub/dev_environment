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
    // const shapes = diag._shapes;
    // const meas = diag._measure;
    // const size = diag._size;
    // const rect = diag._rect;
    const tri = diag._tri;

    // const mods = {
    //   m: highlight(colors.unit),
    // };
    // rect.eqns.rectEqn.changeDescription('0', 'Rectangle area is product of width and height.', mods);
    // rect.eqns.rectEqn.changeDescription('1', 'Expand both 6|m| and 10|m| as 6|m| is the same as saying 6 lots of 1|m|.', mods);
    // rect.eqns.rectEqn.changeDescription('2', 'Reorder equation so all |m| terms are on the right.', mods);
    // rect.eqns.rectEqn.changeDescription('3', 'Calculate 6 ⨉ 10', mods);
    // rect.eqns.rectEqn.changeDescription('4', 'Replace 6 ⨉ 10 with calculated result', mods);
    // rect.eqns.rectEqn.changeDescription('5', 'Multiplying anything by 1 doesn\'t change the result.', mods);
    // rect.eqns.rectEqn.changeDescription('6', 'Simplify by removing 1s', mods);
    // rect.eqns.rectEqn.changeDescription('7', 'Multiplying something by itself is the same as squaring it.', mods);
    // rect.eqns.rectEqn.changeDescription('8', 'Resulting area of rectangle', mods);


    // tri.eqns.tri2AreaEqn.changeDescription('0', 'Area of the triangle is the sum of the two smaller triangle areas.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('1', 'The smaller triangle areas are half the area of the rectangle they are in.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('2', 'The smaller triangle areas are half the area of the rectangles they are in.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('3', 'Prepare for factoring out common terms.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('4', 'Factor out common terms.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('5', 'Simplify the terms in the brackets.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('6', 'B and D sum to the base side length of the triangle.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('7', 'B and D sum to the base side length of the triangle.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('8', 'A is the height of the triangle.', mods);
    // tri.eqns.tri2AreaEqn.changeDescription('9', 'Area of a triangle is half the base times the height.', mods);

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
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Triangle
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // common.show = [tri];
    common.showOnly = [tri];
    common.setEnterState = () => {
      tri.setScenario(tri._tri2, layout.tri2Scenario);
    };
    this.addSection(common, {
      title: 'Introduction',
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

    common.setContent = ['Draw a |rectangle| with the triangle\'s |top| point, and |left bottom| point and label its side lengths.'];
    this.addSection(common, {});
    this.addSection(common, {
      show: [tri._tri2, tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B],
    });

    common.setContent = ['Draw a |second rectangle| with the triangle\'s |top| point and |right bottom| point and label its side lengths.'];
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
    ];
    this.addSection(common, {});
    this.addEqnStep(tri._tri2AreaEqn, '0', '0', common);
    this.addEqnStep(tri._tri2AreaEqn, '0', '1', common);
    this.addEqnStep(tri._tri2AreaEqn, '1', '2', common);

    common.setContent = ['We can rearrange the right hand side to separate the height |A|.'];
    this.addEqnStep(tri._tri2AreaEqn, '2', '2', common);
    this.addEqnStep(tri._tri2AreaEqn, '2', '3', common);
    this.addEqnStep(tri._tri2AreaEqn, '3', '4', common);
    this.addEqnStep(tri._tri2AreaEqn, '4', '5', common);

    common.setContent = ['Sides |B| and |D| form one side of the triangle. As it\'s the bottom side, we call it the |base|.'];
    common.modifiers = {
      B: highlight(colors.construction),
      D: highlight(colors.construction1),
    };
    this.addEqnStep(tri._tri2AreaEqn, '5', '5', common);
    common.show = [
      tri._tri2,
      tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
      tri._tri2Rect2, tri._sideTriRect2A, tri._sideTriRect2D,
      tri._tri2Rect1Tri, tri._tri2Rect2Tri,
      tri._sideTri2Base,
    ];
    this.addEqnStep(tri._tri2AreaEqn, '5', '5', common);
    this.addEqnStep(tri._tri2AreaEqn, '5', '6', common);
    this.addEqnStep(tri._tri2AreaEqn, '6', '7', common);

    common.setContent = ['Side |A| is the same as the |height| of the triangle.'];
    common.modifiers = {
      A: highlight(colors.construction),
    };
    this.addEqnStep(tri._tri2AreaEqn, '7', '7', common);
    common.show = [
      tri._tri2,
      tri._tri2Rect1, tri._sideTriRect1A, tri._sideTriRect1B,
      tri._tri2Rect2, tri._sideTriRect2A, tri._sideTriRect2D,
      tri._tri2Rect1Tri, tri._tri2Rect2Tri,
      tri._sideTri2Base, tri._sideTri2Height,
    ];
    this.addEqnStep(tri._tri2AreaEqn, '7', '7', common);
    this.addEqnStep(tri._tri2AreaEqn, '7', '8', common);
    this.addEqnStep(tri._tri2AreaEqn, '8', '9', common);

    common.setContent = ['And so the area of a triangle is |half its base times its height|.'];
    common.show = [
      tri._tri2,
      tri._sideTri2Base, tri._sideTri2Height,
    ];
    this.addEqnStep(tri._tri2AreaEqn, '9', '10', common, {
      title: 'asdfdffd',
    });

    common.show = [
      tri._tri2,
    ];
    this.addSection(common, {
      title: '243',
      setContent: ['This works for |any triangle|, no matter which side you call the |base|.'],
    });

    common.setContent = ['For example, if this triangle were rotated and we used a |different side| as base.'];
    this.addSection(common, {});
    this.addSection(common, {
      transitionFromPrev: (done) => {
        tri.moveToScenario(tri._tri2, layout.tri3Scenario, 1, done, 0);
      },
      setSteadyState: () => {
        tri.setScenario(tri._tri2, layout.tri3Scenario);
      },
    });

    common.setContent = ['Once again draw |two rectangles| between the |top| point and the |two bottom| points.'];
    this.addSection(common, {
      show: [
        tri._tri3,
        tri._tri3Rect2,
        tri._sideTri3Rect2A, tri._sideTri3Rect2C,
      ],
    });
    common.show = [
      tri._tri3, tri._tri3Rect1, tri._tri3Rect2,
        tri._sideTri3Rect1A, tri._sideTri3Rect1B,
        tri._sideTri3Rect2A, tri._sideTri3Rect2C,
      ]
    this.addSection(common);

    common.setContent = ['In this case, the |triangle_area| is the area of the |AC| triangle minus the area of the |AB| triangle.'];
    common.modifiers = {
      triangle_area: click(tri.showTri3Fill, [tri, tri._tri3Tri], colors.line),
      AC: click(tri.showTri3Fill, [tri, tri._tri3Rect2Tri], colors.construction1),
      AB: click(tri.showTri3Fill, [tri, tri._tri3Rect1Tri], colors.construction),
      C: highlight(colors.construction1),
      B: highlight(colors.construction),
    };
    this.addSection(common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '0', '0', common);

    common.setContent = ['We can now work through similar steps to before to find the area.']
    this.addEqnStep(tri.eqns.tri3AreaEqn, '0', '0', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '0', '1', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '1', '2', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '2', '3', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '3', '4', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '4', '5', common);

    common.setContent = ['In this case, the |base| is length |C| minus length |B|'];
    common.show = [
      tri._tri3, tri._tri3Rect1, tri._tri3Rect2,
      tri._sideTri3Rect1A, tri._sideTri3Rect1B,
      tri._sideTri3Rect2A, tri._sideTri3Rect2C,
      tri._sideTri3Base,
    ];
    this.addEqnStep(tri.eqns.tri3AreaEqn, '5', '5', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '5', '6', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '6', '7', common);
    
    common.setContent = ['And |A| is |height|.'];
    common.show = [
      tri._tri3, tri._tri3Rect1, tri._tri3Rect2,
      tri._sideTri3Rect1A, tri._sideTri3Rect1B,
      tri._sideTri3Rect2A, tri._sideTri3Rect2C,
      tri._sideTri3Base, tri._sideTri3Height
    ];
    this.addEqnStep(tri.eqns.tri3AreaEqn, '7', '8', common);
    this.addEqnStep(tri.eqns.tri3AreaEqn, '8', '9', common);

    common.setContent = ['And so the area of a triangle is |half its base times its height|.'];
    common.show = [
      tri._tri3,
      tri._sideTri3Base, tri._sideTri3Height
    ];
    this.addEqnStep(tri.eqns.tri3AreaEqn, '9', '10', common);
  }
}

export default Content;
