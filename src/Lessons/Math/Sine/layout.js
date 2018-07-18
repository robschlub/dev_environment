// @flow

import { Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import sinCosCircleLayout from '../../../LessonsCommon/SinCosCircle/layout';

const cssColorNames = [
  'grid',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = sinCosCircleLayout();
  layout.radius = 1.4;
  layout.colors = Object.assign(colors, layout.colors);
  layout.circle.right = new Point(1.1, 0);
  layout.angleEqualsText.bottomRight = new Point(0.7, -1.7);
  layout.grid.width = layout.radius * 2;
  layout.grid.height = layout.radius * 2;
  layout.grid.position = new Point(-layout.radius, -layout.radius);
  return layout;
}
