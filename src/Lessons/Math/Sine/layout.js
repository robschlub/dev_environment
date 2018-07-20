// @flow

import { Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import sinCosCircleLayout from '../../../LessonsCommon/SinCosCircle/layout';

const cssColorNames = [
  'grid',
  'bowHandle',
  'bowString',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = sinCosCircleLayout();
  layout.radius = 1.3;
  layout.colors = Object.assign(colors, layout.colors);
  layout.circle.right = new Point(1.2, 0);
  layout.angleEqualsText.bottomRight = new Point(1.2, -1.6);
  layout.grid.width = layout.radius * 2;
  layout.grid.height = layout.radius * 2;
  layout.grid.position = new Point(-layout.radius, -layout.radius);
  layout.compAngle = {
    angle: Math.PI / 6,
  };

  layout.angleAnnotation = {
    arc: {
      lineWidth: 0.02,
      radius: 0.3,
      sides: 200,
    },
    label: {
      radiusOffset: 0.07,
    },
  };

  layout.thetaAngle = Object.assign({}, layout.angleAnnotation);
  layout.complimentAngle = Object.assign({}, layout.angleAnnotation);
  layout.complimentAngle.label.radiusOffset = 0.1;

  return layout;
}
