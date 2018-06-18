// @flow

import { Point, Rect } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';

const cssColorNames = [
  'anchor',
  'radius',
  'reference',
  'latin',
  'circle',
  'rotation',
  'disabled',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);

  return {
    // Diagram
    limits: new Rect(-3, -2, 6, 4),

    // General
    linewidth: 0.03,

    // ------ Circle Colleciton --------
    radius: 0.9,
    wheelSize: 0.7,
    circlePoints: 400,
    anchorPoints: 100,

    circle: {
      center: new Point(0, -0.7),
      right: new Point(1, -0.7),
    },

    moon: {
      radius: 0.6,
      center: new Point(-1.9 - 0.2, -0.8 + 0.2),
    },
    wheel: {
      radius: 0.5,
      center: new Point(-0.7 - 0.2, -0.8 + 0.2),
    },
    ball: {
      radius: 0.4,
      center: new Point(0.3 - 0.2, -0.8 + 0.2),
    },
    clock: {
      radius: 0.3,
      center: new Point(1.1 - 0.2, -0.8 + 0.2),
    },
    circleShape: {
      radius: 0.5,
      center: new Point(1.9, -0.8 + 0.2),
    },
    colors,
  };
}
