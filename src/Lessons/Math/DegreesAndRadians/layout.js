// @flow

import { Point, Rect } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';

const cssColorNames = [
  'anchor',
  'radius',
  'reference',
  'angle',
  'angleText',
  'latin',
  'circle',
  'radialLines',
  'radialLinesText',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);

  return {
    // Diagram
    limits: new Rect(-3, -2, 6, 4),

    // General
    linewidth: 0.03,
    radialLineWidth: 0.01,

    // ------ Circle Colleciton --------
    radius: 1.3,
    angleRadius: 0.5,
    anchorPoints: 50,
    anglePoints: 400,
    circlePoints: 400,

    circle: {
      center: new Point(0, -0.5),
      right: new Point(1, -0.5),
    },

    sectionText: {
      position: new Point(-2.3, -0.3),
    },
    angleEqualsText: {
      position: new Point(-2.3, -0.6),
    },
    splitCircleAngleStart: Math.PI * 1.4,

    colors,
  };
}
