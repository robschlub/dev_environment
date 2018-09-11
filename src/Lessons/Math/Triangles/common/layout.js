// @flow

import { Rect, Point } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'line',
  'point',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);
  layout.lineWidth = 0.1;
  layout.pointRadius = 0.2;
  layout.pointPositions = {
    p1: new Point(2.5, 0),
    p2: new Point(-1, 0.2),
    p3: new Point(-1, -0.2),
    // p4: new Point(0.5, -1.3),
    // p5: new Point(1.4, 0),
  };
  layout.pointSides = 50;
  return layout;
}
