// @flow

import { Point, Line, Transform } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'square1',
  'square2',
  'circle',
  'reference',
  'line',
  'grid',
  'cross',
  'row',
  'unit',
  'construction',
  'construction1',
  'constructionFill',
  'construction1Fill',
  'construction2Fill',
  'fillLabel',
  'lineLabel',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);

  // //////////////////////////////////////////////////////
  //     Shapes
  // //////////////////////////////////////////////////////
  const width = 0.03;
  // layout.shapesPosition = new Point(0, -0.5);
  // layout.square1 = {
  //   position: new Point(-1, 0),
  //   sideLength: 2,
  // };
  // layout.square2 = {
  //   position: new Point(1.5, 0),
  //   sideLength: 1,
  // };
  // layout.circle = {
  //   position: new Point(-1, 0),
  //   radius: 1,
  //   numSides: 300,
  // };

  // // //////////////////////////////////////////////////////
  // //     Measure
  // // //////////////////////////////////////////////////////
  // layout.measurePosition = new Point(0, -0.5);
  // layout.lengthMeasure = {
  //   position: new Point(0, -0.5),
  //   length: 4,
  //   width: 0.02,
  //   sections: 4,
  //   referenceOffset: 0.5,
  //   tickLength: 0.1,
  // };
  // layout.angleMeasure = {
  //   position: new Point(-1, -0.7),
  //   length: 2,
  //   width: 0.02,
  //   angle: Math.PI / 3,
  //   majorTickLength: 0.1,
  //   minorTickLength: 0.05,
  // };
  // layout.grid = {
  //   length: 5.7,
  //   height: 2.7,
  // };
  // layout.smallGrid = {
  //   xNum: 4,
  //   yNum: 4,
  // };
  // layout.circles = {
  //   position: new Point(0.15, 0.35),
  //   smallPosition: new Point(2, 0.15),
  //   radius: 0.15,
  //   sides: 25,
  //   width: 0.01,
  // };
  // layout.genericGrid = {
  //   position: new Point(0, 0.2),
  //   smallPosition: new Point(-2, 0),
  //   sideLength: 0.3,
  //   waveMag: 0.015,
  //   width: 0.01,
  //   segments: 20,
  // };
  // layout.squareGrid = {
  //   position: new Point(0, 0.2),
  //   smallPosition: new Point(0, 0),
  //   sideLength: 0.3,
  //   // width: 0.07,
  // };

  // layout.squareA = {
  //   position: new Point(-1.95, 0.05),
  //   sideLength: 1.2,
  //   width,
  //   labelOffset: -0.8,
  // };
  // layout.circleA = {
  //   position: new Point(0, 0.05),
  //   radius: 0.6,
  //   width,
  //   numSides: 100,
  //   labelOffset: -0.8,
  // };
  // layout.triangleA = {
  //   position: new Point(1.8, -0.15),
  //   sideLength: 1.39,
  //   width,
  //   labelOffset: -0.6,
  // };
  // layout.cross = {
  //   width,
  //   length: 1,
  // };

  // // //////////////////////////////////////////////////////
  // //     Size
  // // //////////////////////////////////////////////////////
  // layout.sizePosition = new Point(0, -0.5);
  // layout.mmSquare = {
  //   position: new Point(0, 0.3),
  //   sideLength: 0.25,
  //   width: 0.01,
  //   lineOffset: 0.15,
  //   labelOffset: 0.05,
  // };
  // layout.mSquare = {
  //   position: new Point(0, 0.3),
  //   sideLength: 2,
  //   width: 0.01,
  //   lineOffset: 0.2,
  //   labelOffset: 0.05,
  // };
  // layout.arrow = {
  //   width: 0.05,
  //   height: 0.05,
  // };

  // // //////////////////////////////////////////////////////
  // //     Rect Area
  // // //////////////////////////////////////////////////////
  // layout.rectPosition = new Point(0, -0.5);
  // layout.gridRect = {
  //   position: new Point(0, 0),
  //   smallPosition: new Point(0, 0),
  //   spacing: 0.25,
  //   length: 2.5,
  //   height: 1.5,
  // };

  // layout.rect = {
  //   position: new Point(0, 0),
  //   length: 2.5,
  //   height: 1.5,
  //   width,
  //   labelOffset: 0.1,
  // };
  // layout.rectSimpleEqnPosition = new Point(0, 1.2);
  // layout.rectNumSquaresEqnPosition = new Point(0, 1.2);
  // layout.rectEqnPosition = new Point(0, 1.5);
  // layout.rectEqnNavPosition = new Point(0, -0.25);
  // layout.rectSimpleAreaEqnPosition = new Point(0, 1.2);
  // layout.rectSquareEqnPosition = new Point(0, 1.2);

  layout.triRectEqnPosition = new Point(0, 1.2);
  // //////////////////////////////////////////////////////
  //     Triangle Area
  // //////////////////////////////////////////////////////
  layout.triPosition = new Point(0, -0.5);
  layout.gridTri = {
    position: new Point(0, 0),
    smallPosition: new Point(0, 0),
    spacing: 0.25,
    length: 4,
    height: 2,
  };
  layout.triLabelOffset = 0.07;
  layout.triIntro = {
    points: [
      new Point(-0.75, -0.75),
      new Point(0.75, -0.75),
      new Point(0, 0.75),
    ],
    width,
  };
  layout.triRect = {
    points: [
      new Point(-1.25, -0.75),
      new Point(1.25, -0.75),
      new Point(1.25, 0.75),
      new Point(-1.25, 0.75),
    ],
    width,
  };
  layout.tri2 = {
    points: [
      new Point(-1.5, -0.75),
      new Point(1.5, -0.75),
      new Point(0.3, 0.4),
    ],
    width,
  };

  layout.tri2Rect1 = {
    points: [
      layout.tri2.points[0],
      new Point(layout.tri2.points[2].x, layout.tri2.points[0].y),
      layout.tri2.points[2],
      new Point(layout.tri2.points[0].x, layout.tri2.points[2].y),
    ],
    width: width / 3,
  };
  layout.tri2Rect2 = {
    points: [
      new Point(layout.tri2.points[2].x, layout.tri2.points[1].y),
      layout.tri2.points[1],
      new Point(layout.tri2.points[1].x, layout.tri2.points[2].y),
      layout.tri2.points[2],
    ],
    width: width / 3,
  };
  layout.tri2Rect1Tri = {
    points: [
      layout.tri2Rect1.points[0],
      layout.tri2Rect1.points[1],
      layout.tri2Rect1.points[2],
    ],
    // midPoint: new Point(
    //   (layout.tri2Rect1.points[1].x - layout.tri2Rect1.points[0].x) / 1.5
    //     + layout.tri2Rect1.points[0].x,
    //   (layout.tri2Rect1.points[2].y - layout.tri2Rect1.points[0].y) / 3
    //     + layout.tri2Rect1.points[0].y,
    // ),
  };
  layout.tri2Rect2Tri = {
    points: [
      layout.tri2Rect2.points[0],
      layout.tri2Rect2.points[1],
      layout.tri2Rect2.points[3],
    ],
    // midPoint: new Point(
    //   (layout.tri2Rect2.points[1].x - layout.tri2Rect2.points[0].x)  / 3
    //     + layout.tri2Rect2.points[0].x,
    //   (layout.tri2Rect2.points[3].y - layout.tri2Rect2.points[0].y) / 3
    //     + layout.tri2Rect2.points[0].y,
    // ),
  };
  layout.tri2AreaEqnPosition = new Point(-0.5, 1.2);
  layout.tri2AreaEqnNavPosition = new Point(0, -0.25);

  // //////////////////////////////////////////////////////
  //     Rotated triangle area
  // //////////////////////////////////////////////////////
  const side = new Line(layout.tri2.points[0], layout.tri2.points[2]);
  const angle = side.angle() - Math.PI;
  layout.tri2Scenario = {
    rotation: 0,
    position: new Point(0, 0),
  };
  layout.tri3Scenario = {
    rotation: -angle,
    position: new Point(-0.3, -0.55),
  };
  const t = new Transform()
    .rotate(layout.tri3Scenario.rotation)
    .translate(layout.tri3Scenario.position);

  layout.tri3 = {
    points: layout.tri2.points.map(p => p.transformBy(t.m())),
    width,
  };
  const delta = width / 3 / 2;
  layout.tri3Rect1 = {
    points: [
      new Point(layout.tri3.points[2].x, layout.tri3.points[1].y - delta),
      layout.tri3.points[1].add(delta, -delta),
      new Point(layout.tri3.points[1].x + delta, layout.tri3.points[2].y + delta),
      layout.tri3.points[2].add(0, delta),
    ],
    width: width / 3,
  };
  layout.tri3Rect2 = {
    points: [
      layout.tri3.points[0].add(0, -delta),
      new Point(layout.tri3.points[1].x - delta, layout.tri3.points[0].y  - delta),
      layout.tri3.points[1].add(-delta, delta),
      new Point(layout.tri3.points[0].x, layout.tri3.points[1].y + delta),
    ],
    width: width / 3,
  };
  layout.tri3Tri = {
    points: layout.tri3.points,
  };
  layout.tri3Rect1Tri = {
    points: [
      layout.tri3Rect1.points[3],
      layout.tri3Rect1.points[1],
      layout.tri3Rect1.points[2],
    ],
  };
  layout.tri3Rect2Tri = {
    points: [
      layout.tri3Rect2.points[0],
      layout.tri3Rect2.points[1],
      layout.tri3Rect2.points[2],
    ],
  };

  layout.tri3AreaEqnPosition = new Point(-0.5, 1.2);
  layout.tri3AreaEqnNavPosition = new Point(0, -0.25);

  // //////////////////////////////////////////////////////
  //     Same Area Triangle
  // //////////////////////////////////////////////////////
  layout.samePosition = new Point(0, -0.5);
  layout.same = {
    width: 0.03,
    points: [
      new Point(-0.5, -0.75),
      new Point(0.5, -0.75),
      new Point(0, 0.75),
    ],
    pad: {
      sides: 50,
      radius: 0.15,
    },
    basePadMinSeparation: 0.4,
    grid:{
      position: new Point(0, 0),
      smallPosition: new Point(0, 0),
      spacing: 0.25,
      length: 5.5,
      height: 2,
    },
    label: {
      position: new Point(0, -1.2),
    },
  };
  return layout;
}
