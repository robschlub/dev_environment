// @flow

import { Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'angleA',
  'angleB',
  'line',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, -0.3);
  layout.equationPosition = new Point(-1.7, -0.6);
  layout.units = {
    position: new Point(2, -1.6),
  };
  layout.line = {
    width: 0.03,
    length: 1.3,
  };
  layout.angle = {
    radius: 0.3,
    labelRadius: 0.35,
    width: 0.03,
    sides: 300,
  };
  layout.line1 = {
    adjacent: {
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
