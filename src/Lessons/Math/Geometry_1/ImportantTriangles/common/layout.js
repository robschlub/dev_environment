// @flow

import { Point } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'lines',
  'angles',
  'height',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  const equilPoints = [
    new Point(-1, -1),
    new Point(1, -1),
    new Point(0, 0.732),
  ];
  const mid = new Point(0, equilPoints[0].y);
  layout.equil = {
    position: new Point(0, 0),
    tri: {
      points: equilPoints,
      width: 0.015,
      close: true,
      borderToPoint: 'alwaysOn',
      position: new Point(0, 0),
      color: layout.colors.lines,
    },
    sideLength: {
      color: layout.colors.lines,
      offset: 0.2,
      label: {
        text: 'A',
        location: 'outside',
        orientation: 'horizontal',
      },
      showLine: false,
    },
    side12: {
      p1: equilPoints[1],
      p2: equilPoints[0],
      // offset: 0.5,
    },
    side23: {
      p1: equilPoints[2],
      p2: equilPoints[1],
    },
    side31: {
      p1: equilPoints[0],
      p2: equilPoints[2],
    },
    sideH: {
      p1: equilPoints[2],
      p2: mid,
      color: layout.colors.height,
      offset: 0.1,
      label: {
        linePosition: 0.6,
      },
    },
    left: {
      scenario: {
        center: { position: new Point(0, 0) },
        left: { position: new Point(-0.5, 0) },
      },
      tri: {
        points: [
          equilPoints[0],
          mid,
          equilPoints[2],
        ],
        width: 0.015,
        close: true,
        borderToPoint: 'alwaysOn',
        position: new Point(0, 0),
        color: layout.colors.lines,
      },
      angle1: {
        p1: mid,
        p2: equilPoints[0],
        p3: equilPoints[2],
        label: { text: 'a' },
      },
      angle2: {
        p1: equilPoints[2],
        p2: mid,
        p3: equilPoints[0],
        label: { text: 'b' },
      },
      angle3: {
        p1: equilPoints[0],
        p2: equilPoints[2],
        p3: mid,
        label: { text: 'c' },
      },
      side12: {
        p1: mid,
        p2: equilPoints[0],
        label: {
          text: {
            eqn: 'fractionPre',
            numerator: '1',
            denominator: '2',
            main: 'A',
          },
        },
      },
      side23: {
        p1: equilPoints[2],
        p2: mid,
        label: { text: 'B', linePosition: 0.6 },
      },
      side31: {
        p1: equilPoints[0],
        p2: equilPoints[2],
        label: { text: 'A' },
      },
    },
    right: {
      scenario: {
        center: { position: new Point(0, 0) },
        right: { position: new Point(0.5, 0) },
      },
      tri: {
        points: [
          mid,
          equilPoints[1],
          equilPoints[2],
        ],
        width: 0.015,
        close: true,
        borderToPoint: 'alwaysOn',
        position: new Point(0, 0),
        color: layout.colors.lines,
      },
      angle1: {
        p1: equilPoints[1],
        p2: mid,
        p3: equilPoints[2],
        label: { text: ['d', 'b'] },
      },
      angle2: {
        p1: equilPoints[2],
        p2: equilPoints[1],
        p3: mid,
        label: { text: ['e', 'a'] },
      },
      angle3: {
        p1: mid,
        p2: equilPoints[2],
        p3: equilPoints[1],
        label: { text: ['f', 'c'] },
      },
      side12: {
        p1: equilPoints[1],
        p2: mid,
        label: {
          text: {
            eqn: 'fractionPre',
            numerator: '1',
            denominator: '2',
            main: 'A',
          },
        },
      },
      side23: {
        p1: equilPoints[2],
        p2: equilPoints[1],
        label: { text: 'A' },
      },
      side31: {
        p1: mid,
        p2: equilPoints[2],
        label: { text: 'B', linePosition: 0.4 },
      },
    },
    angle: {
      curve: {
        radius: 0.3,
        sides: 150,
        width: 0.02,
      },
      label: {
        text: ['a', '60º'],
        radius: 0.28,
      },
      color: layout.colors.angles,
    },
    angle1: {
      p1: equilPoints[1],
      p2: equilPoints[0],
      p3: equilPoints[2],
    },
    angle2: {
      p1: equilPoints[2],
      p2: equilPoints[1],
      p3: equilPoints[0],
    },
    angle3: {
      p1: equilPoints[0],
      p2: equilPoints[2],
      p3: equilPoints[1],
    },
  };
  return layout;
}
