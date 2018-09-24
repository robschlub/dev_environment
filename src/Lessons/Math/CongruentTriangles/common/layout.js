// @flow

import { Point, Line, polarToRect } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'line',
  'lineLabels',
  'angleLabels',
  'angleA',
  'angleB',
  'angleC',
  'intersect',
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
        side1: 2.95,
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
        side1: 2.95,
        side2: 2.598,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(1, -1), rotation: Math.PI / 3 * 2 },
        side1: 1.5,
        side2: 0.1,
      },
    },
    ASAStart: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
        side1: 2,
        side2: 0.5,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(1, -1), rotation: Math.PI / 3 * 2 },
        side1: 0.5,
        side2: 2,
      },
    },
    ASA: {
      c1: {
        angle: Math.PI / 6,
        scenario: { position: new Point(-2, -1), rotation: 0 },
        side1: 2.95,
        side2: 2.598,
      },
      c2: {
        angle: Math.PI / 3,
        scenario: { position: new Point(1, -1), rotation: Math.PI / 3 * 2 },
        side1: 1.5,
        side2: 2,
      },
    },
  };
  const l1 = 1.8;
  const l2 = 0.9;
  const l3 = 1.3;
  const a1 = 0;
  const a2 = Math.acos((l1 * l1 + l2 * l2 - l3 * l3) / (2 * l1 * l2));
  const a3 = Math.acos((l1 * l1 + l3 * l3 - l2 * l2) / (2 * l1 * l3));
  const p23Delta = polarToRect(l2, a2);
  layout.corner.SSSProps = {
    length1: l1,
    length2: l2,
    length3: l3,
    angle1: a1,
    angle2: a2,
    angle3: a3,
    circleSides: 300,
    intersectPointRadius: 0.1,
    intersectPointSides: 30,
  };
  layout.corner.SSSStart = {
    l1: {
      position: new Point(-0.8, -0.5),
      rotation: layout.corner.SSSProps.angle1,
    },
    l2: {
      position: new Point(-1.2, -0.8),
      rotation: Math.PI / 3,
    },
    l3: {
      position: new Point(1.3, -0.8),
      rotation: Math.PI - Math.PI / 3,
    },
  };
  layout.corner.SSSConnected = {
    l1: {
      position: new Point(-0.8, -0.5),
      rotation: layout.corner.SSSProps.angle1,
    },
    l2: {
      position: new Point(-0.8, -0.5),
      rotation: Math.PI / 3 * 2,
    },
    l3: {
      position: new Point(-0.8 + l1, -0.5),
      rotation: Math.PI / 3,
    },
  };
  layout.corner.SSSConnectedNoRot = {
    l1: {
      position: layout.corner.SSSConnected.l1.position,
    },
    l2: {
      position: layout.corner.SSSConnected.l2.position,
    },
    l3: {
      position: layout.corner.SSSConnected.l3.position,
    },
    iUp: {
      position: layout.corner.SSSConnected.l2.position
        .add(p23Delta),
    },
    iDown: {
      position: layout.corner.SSSConnected.l2.position
        .add(p23Delta.x, -p23Delta.y),
    },
  };
  return layout;
}
