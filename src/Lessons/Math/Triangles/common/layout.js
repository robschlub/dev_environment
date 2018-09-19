// @flow

import { Rect, Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'line',
  'point',
  'pointText',
  'angle',
  'angleText',
  'dimensions',
  'angleA',
  'angleB',
  'angleC',
  'parallelLines',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);

  const pointRadius = 0.15;
  layout.custom = {
    lineWidth: 0.02,
    pointRadius,
    pointPositions: {
      p1: new Point(0, 0.7),
      p2: new Point(-1.4, -0.7),
      p3: new Point(1.4, -0.7),
    },
    boundary: new Rect(
      -2.5, -1.5, 5, 2.3,
    ),
    pointSides: 50,
    randomBoundary: new Rect(
      0.2,
      0.2,
      1.5,
      0.5,
    ),
  };
  layout.totalAngle = {
    lineWidth: 0.02,
    // pointRadius,
    pointPositions: {
      p1: new Point(-2, -1),
      p2: new Point(2, -1),
      p3: new Point(-1, 0.5),
    },
    parallelLine: {
      length: 5,
      width: 0.015,
      offScreen: {
        line1: new Point(-2.5, -2),
        line2: new Point(-2.5, 2),
      },
    },
    equation: {
      position: new Point(-1.6, 0.8),
      scale: 1.2,
    },
    // boundary: new Rect(
    //   -2.5, -1.5, 5, 2.3,
    // ),
    // pointSides: 50,
    // randomBoundary: new Rect(
    //   0.2,
    //   0.2,
    //   1.5,
    //   0.5,
    // ),
    angle: {
      radius: 0.3,
      lineWidth: 0.03,
      sides: 200,
      labelRadius: 0.35,
    },
  };

  layout.examples = {
    lineWidth: 0.02,
    tri1: {
      points: [
        new Point(-0.5, 0),
        new Point(0, 1),
        new Point(0.5, 0),
      ],
      position: {
        position: new Point(-2, -1),
        rotation: 0,
      },
    },
    tri2: {
      points: [
        new Point(-0.5, 0),
        new Point(0.7, 1),
        new Point(0.7, 0),
      ],
      position: {
        position: new Point(-0.1, -1),
        rotation: 0,
      },
    },
    tri3: {
      points: [
        new Point(1, 0),
        new Point(0.3, 0),
        new Point(-0.5, 1),
      ],
      position: {
        position: new Point(1.7, -1),
        rotation: 0,
      },
    },
  };

  layout.properties = {
    lineWidth: 0.02,
    boundary: new Rect(
      -2.5, -1.5, 5, 2.3,
    ),
    dimension: {
      lineWidth: 0.01,
      arrowHeight: 0.06,
      arrowWidth: 0.06,
      labelOffset: 0.01,
      offset: 0.3,
    },
    angle: {
      radius: 0.3,
      lineWidth: 0.03,
      sides: 100,
    },
    triangle: {
      points: [
        new Point(-2, -1),
        new Point(-1, 0.5),
        new Point(2, -1),
      ],
      position: new Point(0, -0.85),
    },
  };
  return layout;
}
