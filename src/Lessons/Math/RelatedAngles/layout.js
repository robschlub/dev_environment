// @flow

import { Rect, Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
// import angleCircleLayout from '../../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  'latin',
  'line',
  'angleA',
  'angleB',
  'disabled',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout = {
    limits: new Rect(-3, -2, 6, 4),
    linewidth: 0.03,
    position: new Point(0, 0),
    colors,
  };
  return layout;
}
