// @flow

import { Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'angle',
  'angleText',
  'dimensions',
  'line',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);

  layout.line = {
    width: 0.02,
    length: 1,
  };
  layout.angle = {
    radius: 0.3,
    labelRadius: 0.35,
    width: 0.02,
  };
  layout.line1 = {
    adjacent: {
      position: new Point(0,0),
      rotation: 0,
    },
  };
  layout.line2 = {
    adjacent: {
      position: new Point(0,0),
      rotation: 1,
    },
  };
  layout.line3 = {
    adjacent: {
      position: new Point(0,0),
      rotation: 2,
    },
  };
  layout.line4 = {
    adjacent: {
      position: new Point(0,0),
      rotation: 3,
    },
  };
  return layout;
}
