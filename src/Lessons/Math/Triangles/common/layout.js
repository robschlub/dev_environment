// @flow

import { Rect, Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'line',
  'point',
  'angle',
  'angleText',
  'dimensions',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);

  const pointRadius = 0.15;
  layout.custom = {
    lineWidth: 0.05,
    pointRadius,
    pointPositions: {
      p1: new Point(0, 0.7),
      p2: new Point(-1.4, -0.7),
      p3: new Point(1.4, -0.7),
    },
    boundary: new Rect(
      -3 + pointRadius,
      -2 + pointRadius,
      6 - pointRadius * 2,
      3.5 - pointRadius * 2,
    ),
    pointSides: 50,
    randomBoundary: new Rect(
      0.2,
      0.2,
      1.5,
      0.5,
    ),
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
    dimension: {
      lineWidth: 0.01,
      arrowHeight: 0.08,
      arrowWidth: 0.08,
      locations: [
        {
          triIndex: [0, 1],
          offset: 0.2,
        },
        {
          triIndex: [1, 2],
          offset: 0.2,
        },
        {
          triIndex: [2, 0],
          offset: 0.2,
        },
      ],
    },
    triangle: {
      points: [
        new Point(-1, 0),
        new Point(0, Math.sin(Math.PI / 3) * 2),
        new Point(1, 0),
      ],
      position: new Point(0, -1.2),
    },
    angleRotations: [
      0,
      Math.PI / 3 * 4,
      Math.PI / 3 * 2,
    ],
    angleAnnotation: {
      arc: {
        radius: 0.3,
        width: 0.01,
        sides: 50,
      },
      label: {
        radius: 0.4,
      },
    },
  };
  return layout;
}
