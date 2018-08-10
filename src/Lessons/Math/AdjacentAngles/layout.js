// @flow

import { Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import angleCircleLayout from '../../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  'latin',
  'outsideLines',
  'angleA',
  'angleB',
  'disabled',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = angleCircleLayout();
  layout.colors = Object.assign(colors, layout.colors);
  layout.circle.right = new Point(1.4, -0.2);
  layout.equationPosition = new Point(-1.7, -0.6);
  layout.angleAnnotation.arc.lineWidth = 0.03;
  layout.angleAnnotation.arc.radius = 0.4;
  return layout;
}
