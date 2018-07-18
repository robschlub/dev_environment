// @flow

import { Point, Rect } from '../../js/diagram/tools/g2';
import getCssColors from '../../js/tools/getCssColors';
import angleCircleLayout from '../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  'disabled',
  'quadrant',
  'axes',
  'sine',
  'quadAngles',
  'arc',
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
    // offset: 0.12,
  };
  layout.cosine = {
    lineWidth: 0.01,
  };
  layout.quadAngles = {
    lineWidth: 0.01,
    radius: 0.8,
  };
  layout.textYLimit = 0.07;
  layout.angle.radius = 0.4;
  layout.angle.lineWidth = 0.02;
  layout.angle.textOffset = -0.15;
  layout.unitsSelector = {
    position: new Point(0, -1.9),
  };
  layout.arc.lineWidth = 0.01;

  layout.grid = {
    width: layout.radius * 2,
    height: layout.radius * 2,
    range: new Rect(-1, -1, 2, 2),
    step: 0.2,
    position: new Point(-layout.radius, -layout.radius),
  };
  return layout;
}
