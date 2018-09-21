// @flow

import { Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'line',
  'lineLabels',
  'angleLabels',
  'angleA',
  'angleB',
  'angleC',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);

  layout.triangle = {
    lineWidth: 0.02,
    angle: {
      radius: 0.3,
      lineWidth: 0.02,
      sides: 200,
      labelRadius: 0.35,
    },
  };

  layout.triangles = {
    congruent: {
      points: [
        new Point(-1.2, -1),
        new Point(1, -1),
        new Point(0.7, 0.5),
      ],
      tri1: {
        scenario: { position: new Point(-1.5, -0.2), rotation: 0 },
      },
      tri2: {
        scenario: { position: new Point(1.5, -0.2), rotation: 0 },
      },
    },
    congruentRot: {
      points: [
        new Point(-1.2, -1),
        new Point(1, -1),
        new Point(0.7, 0.5),
      ],
      tri1: {
        scenario: { position: new Point(-1.5, -0.2), rotation: 0 },
      },
      tri2: {
        scenario: { position: new Point(1.4, -0.6), rotation: Math.PI },
      },
    },
    congruentFlip: {
      points: [
        new Point(-1.2, -1),
        new Point(1, -1),
        new Point(0.7, 0.5),
      ],
      tri1: {
        scenario: { position: new Point(-1.5, -0.2), rotation: 0 },
      },
      tri2: {
        scenario: { position: new Point(1.3, -0.2), rotation: 0, scale: new Point(-1, 1) },
      },
    },
  };

  const length = 0.4;
  layout.corner = {
    length,
    width: 0.02,
    points: [
      new Point(length, 0),
      new Point(0, 0),
      new Point(0, length),
    ],
    AAA: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(2, -1), rotation: Math.PI / 3 * 2 },
      },
      c3: {
        angle: Math.PI / 2,
        scenario: {
          position: new Point(1, 2 * (Math.sqrt(3) / 2 - 0.5)),
          rotation: Math.PI / 6 * ,
        },
      },
    },
  };
  return layout;
}
