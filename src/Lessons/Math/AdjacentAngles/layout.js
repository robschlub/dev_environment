// @flow

import { Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import angleCircleLayout from '../../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  // 'radiusLight',
  'latin',
  'outsideLines',
  'angleA',
  'angleB',
  // 'rotation',
  // 'action',
  'disabled',
  // 'angleArea',
  // 'axes',
  // 'degrees',
  // 'radians',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = angleCircleLayout();
  layout.colors = Object.assign(colors, layout.colors);
  // layout.radius = 0.9;
  // layout.radiusArc = {
  //   radius: 1.25,
  // };

  // layout.compare = {
  //   radiusOffset: 0.2,
  //   arcOffset: 0.3,
  //   textPosition: new Point(2.0, -0.42),
  // };

  layout.circle.right = new Point(1.4, -0.2);
  // layout.angleEqualsText.bottomRight = new Point(1.0, -1.7);
  // layout.axes = {
  //   length: 1.3,
  // };
  layout.equationPosition = new Point(-1.8, -0.6);
  return layout;
}
