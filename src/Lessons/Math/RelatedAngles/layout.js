// @flow

import { Rect, Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import baseLayout from '../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'line',
  'angleA',
  'angleB',
  'disabled',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  // layout.selectorFont.size = 0.15;
  return layout;
}
