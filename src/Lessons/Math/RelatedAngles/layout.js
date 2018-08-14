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
  const len = 1.4;
  layout.moveableLine = {
    length: {
      full: len,
      end: len / 2 * 0.5,
      middle: len / 2,
    },
    width: 0.02,
    boundary: new Rect(0.5, -1.7, 2.5, 3),
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
