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
  layout.position = new Point(0, -0.4);
  const width = 0.02;

  layout.circle = {
    radius: 1.3,
    numSides: 100,
    width,
    scenarios: {
      center: new Point(0, 0),
      left: new Point(-1, 0),
    },
  };

  layout.polygons = {
    radius: layout.circle.radius - layout.circle.width,
    width: width / 2,
    borderWidth: width,
    sides: [
      6,
      9,
      25,
    ],
  };
  return layout;
}
