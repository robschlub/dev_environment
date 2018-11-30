// @flow

import { Point, Line } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'lines',
  'angles',
  'equalLength',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  // const equilPoints = [
  //   new Point(-1, -1),
  //   new Point(1, -1),
  //   new Point(0, 0.732),
  // ];
  const isoPoints = [
    new Point(-0.8, -1),
    new Point(0.8, -1),
    new Point(0, 1),
  ];
  const mid = new Point(0, isoPoints[0].y);
  layout.iso = {
    position: new Point(0, 0),
    scenario: {
      center: { position: new Point(0, 0) },
      bottom: { position: new Point(0, -0.5) },
    },
    tri: {
      points: isoPoints,
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
      p1: isoPoints[1],
      p2: isoPoints[0],
      label: { text: 'B' },
      // offset: 0.5,
    },
    side23: {
      p1: isoPoints[2],
      p2: isoPoints[1],
      color: layout.colors.equalLength,
    },
    side31: {
      p1: isoPoints[0],
      p2: isoPoints[2],
      color: layout.colors.equalLength,
    },
    sideH: {
      p1: isoPoints[2],
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
          isoPoints[0],
          mid,
          isoPoints[2],
        ],
        width: 0.015,
        close: true,
        borderToPoint: 'alwaysOn',
        position: new Point(0, 0),
        color: layout.colors.lines,
      },
      angle1: {
        p1: mid,
        p2: isoPoints[0],
        p3: isoPoints[2],
        label: { text: 'a' },
      },
      angle2: {
        p1: isoPoints[2],
        p2: mid,
        p3: isoPoints[0],
        curve: { radius: 0.17 },
        label: { text: 'b', radius: 0.15 },
      },
      angle3: {
        p1: isoPoints[0],
        p2: isoPoints[2],
        p3: mid,
        curve: { radius: 0.3 },
        label: { text: 'c', radius: 0.28 },
      },
      side12: {
        p1: mid,
        p2: isoPoints[0],
        label: {
          text: {
            eqn: 'fractionPre',
            numerator: '1',
            denominator: '2',
            main: 'B',
          },
        },
      },
      side23: {
        p1: isoPoints[2],
        p2: mid,
        label: { text: 'C', linePosition: 0.6 },
      },
      side31: {
        p1: isoPoints[0],
        p2: isoPoints[2],
        color: layout.colors.equalLength,
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
          isoPoints[1],
          isoPoints[2],
        ],
        width: 0.015,
        close: true,
        borderToPoint: 'alwaysOn',
        position: new Point(0, 0),
        color: layout.colors.lines,
      },
      angle1: {
        p1: isoPoints[1],
        p2: mid,
        p3: isoPoints[2],
        curve: { radius: 0.17 },
        label: { text: 'b', radius: 0.15 },
      },
      angle2: {
        p1: isoPoints[2],
        p2: isoPoints[1],
        p3: mid,
        label: { text: 'a' },
      },
      angle3: {
        p1: mid,
        p2: isoPoints[2],
        p3: isoPoints[1],
        curve: { radius: 0.3 },
        label: { text: 'c', radius: 0.28 },
      },
      side12: {
        p1: isoPoints[1],
        p2: mid,
        label: {
          text: {
            eqn: 'fractionPre',
            numerator: '1',
            denominator: '2',
            main: 'B',
          },
        },
      },
      side23: {
        p1: isoPoints[2],
        p2: isoPoints[1],
        color: layout.colors.equalLength,
        label: { text: 'A' },
      },
      side31: {
        p1: mid,
        p2: isoPoints[2],
        label: { text: 'C', linePosition: 0.4 },
      },
    },
    angle: {
      curve: {
        radius: 0.2,
        sides: 150,
        width: 0.02,
      },
      label: {
        text: 'a',
        radius: 0.18,
      },
      color: layout.colors.angles,
    },
    angle1: {
      p1: isoPoints[1],
      p2: isoPoints[0],
      p3: isoPoints[2],
    },
    angle2: {
      p1: isoPoints[2],
      p2: isoPoints[1],
      p3: isoPoints[0],
    },
    angle3: {
      p1: isoPoints[0],
      p2: isoPoints[2],
      p3: isoPoints[1],
      curve: { radius: 0.3 },
      label: { radius: 0.28 },
    },
    splitLine1: {
      p1: isoPoints[1],
      p2: new Line(isoPoints[2], isoPoints[0]).midpoint(),
      width: 0.015,
      color: layout.colors.lines,
    },
    splitLine2: {
      p1: isoPoints[0],
      p2: new Line(isoPoints[1], isoPoints[2]).midpoint(),
      width: 0.015,
      color: layout.colors.lines,
    },
  };
  return layout;
}
