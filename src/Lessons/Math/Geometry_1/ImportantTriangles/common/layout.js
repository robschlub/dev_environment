// @flow

import { Point } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'lines',
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
  layout.equil = {
    position: new Point(0, 0),
    tri: {
      points: equilPoints,
      width: 0.015,
      close: true,
      borderToPoint: 'never',
      position: new Point(0, 0),
      color: layout.colors.lines,
    },
    leftTri: {
      points: [
        equilPoints[0],
        new Point(0, equilPoints[0].y),
        new Point(0, equilPoints[2].y),
      ],
      width: 0.01,
      close: true,
      borderToPoint: 'alwaysOn',
      position: new Point(0, 0),
      color: layout.colors.lines,
    },
    rightTri: {
      points: [
        new Point(0, equilPoints[1].y),
        equilPoints[1],
        new Point(0, equilPoints[2].y),
      ],
      width: 0.01,
      close: true,
      borderToPoint: 'alwaysOn',
      position: new Point(0, 0),
      color: layout.colors.lines,
    },
    angle: {
      curve: {
        radius: 0.4,
        sides: 100,
        width: 0.02,
      },
      label: {
        text: 'A + B = C',
        radius: 0.4,
        // orientation: 'tangent'
        // curvePosition: 0.2,
      },
      // arrow1: {
      //   width: 0.08,
      //   height: 0.08,
      //   radius: 0.4,
      // },
      // arrows: {
      //   width: 0.08,
      //   height: 0.08,
      //   radius: 0.4,
      // },
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
      // arrow1: {
      //   width: 0.08,
      //   height: 0.08,
      //   radius: 0.4,
      // },
    },
    angle3: {
      p1: equilPoints[0],
      p2: equilPoints[2],
      p3: equilPoints[1],
      label: {
        curvePosition: 0.2,
        showRealAngle: true,
      },
    },
  };
  return layout;
}
