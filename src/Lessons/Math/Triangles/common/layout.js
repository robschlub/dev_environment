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
  layout.lineWidth = 0.02;
  layout.pointRadius = 0.04;
  layout.pointPositions = {
    p1: new Point(0.6, 0.2),
    p2: new Point(-0.5, 0),
    p3: new Point(0.3, -0.5),
  };
  layout.pointSides = 50;
  return layout;
}
