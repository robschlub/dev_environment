// @flow

import { Point, Line } from '../../../../js/diagram/tools/g2';
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
    sideWidth: 0.02,
    angleWidth: 0.02,
    angleRadius: 0.37,
    angleLabelRadius: 0.39,
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
        side: 3,
        limitLine: new Line(new Point(-2.2, -1), new Point(-1, -1)),
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(2, -1), rotation: Math.PI / 3 * 2 },
        side: 2,
        limitLine: new Line(new Point(2.2, -1), new Point(1, -1)),
      },
      c3: {
        angle: Math.PI / 2,
        scenario: {
          position: new Point(1, 2 * (Math.sqrt(3) / 2 - 0.5)),
          rotation: Math.PI / 6 * 7,
        },
        side: 0.5,
        limitLine: null,
      },
    },
    SASStart: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
        side1: 3,
        side2: 2.598,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(2, -1), rotation: Math.PI / 3 * 2 },
        side1: 2,
        side2: 2,
      },
    },
    SASZero: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
        side1: 2.9,
        side2: 2.598,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(1, -1), rotation: Math.PI / 3 * 2 },
        side1: 0,
        side2: 2,
      },
    },
    SAS: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
        side1: 2.9,
        side2: 2.598,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(1, -1), rotation: Math.PI / 3 * 2 },
        side1: 1.5,
        side2: 0.4,
      },
    },
  };
  return layout;
}
