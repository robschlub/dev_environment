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
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.units = {
    position: new Point(0, -1.8),
  };
  layout.selector = {
    position: new Point(0, 1.7),
  };
  layout.moveableLine = {
    length: 1.4,
    width: 0.01,
  };
  layout.line1 = {
    position: new Point(1.5, 0.5),
    rotation: 0,
  };
  layout.line2 = {
    position: new Point(1.5, -0.5),
    rotation: 0,
  };
  return layout;
}
