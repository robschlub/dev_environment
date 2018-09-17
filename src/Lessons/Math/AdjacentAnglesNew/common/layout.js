// @flow

import { Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'angleA',
  'angleB',
  'angleC',
  'line',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, -0.6);
  layout.equationPosition = new Point(0, 1.45);
  layout.units = {
    position: new Point(2, -1.6),
  };
  layout.line = {
    width: 0.03,
    length: 1.3,
  };
  layout.angle = {
    radius: 0.3,
    labelRadiusOffset: 0.05,
    width: 0.03,
    sides: 300,
  };
  layout.largerAngle = {
    radius: 1.0,
    labelRadiusOffset: 0.05,
    width: 0.015,
    sides: 400,
  };
  layout.line1 = {
    adjacent: {
      rotation: 0,
    },
    adjacentAdd: {
      rotation: 0,
    },
    supplementary: {
      rotation: 0,
    },
    complementary: {
      rotation: 0,
    },
    explemenetary: {
      rotation: 0,
    },
  };
  layout.line2 = {
    adjacent: {
      rotation: 1,
    },
    adjacentAdd: {
      rotation: 1,
    },
    supplementary: {
      rotation: 1,
    },
    complementary: {
      rotation: 1,
    },
    explemenetary: {
      rotation: 2,
    },
  };
  layout.line3 = {
    adjacent: {
      rotation: 2,
    },
    adjacentAdd: {
      rotation: 2.5,
    },
    supplementary: {
      rotation: Math.PI,
    },
    complementary: {
      rotation: Math.PI / 2,
    },
    explemenetary: {
      rotation: Math.PI * 2,
    },
  };
  return layout;
}
