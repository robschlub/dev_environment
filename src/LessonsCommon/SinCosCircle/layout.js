// @flow

import { Point } from '../../js/diagram/tools/g2';
import getCssColors from '../../js/tools/getCssColors';
import angleCircleLayout from '../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  'disabled',
  'angleArea',
  'axes',
  'sine',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function sinCosCircleLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = angleCircleLayout();
  layout.colors = Object.assign(colors, layout.colors);
  layout.circle.right = new Point(1.4, -0.2);
  layout.angleEqualsText.bottomRight = new Point(1.0, -1.7);
  layout.axes = {
    length: 1.3,
  };

  layout.sine = {
    lineWidth: 0.01,
    offset: 0.12,
  };
  layout.cosine = {
    lineWidth: 0.005,
  };
  return layout;
}
