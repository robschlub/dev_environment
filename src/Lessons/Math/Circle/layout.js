// @flow

import { Point, Rect } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';

const cssColorNames = [
  'anchor',
  'radius',
  'diameter',
  'reference',
  'latin',
  'circle',
  'rotation',
  'disabled',
  'grid',
  'axis',
  'push',
  'slider',
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
    // radius: 0.9,
    wheelSize: 0.7,
    circlePoints: 400,
    anchorPoints: 100,

    locationText: {
      bottom: new Point(1.05, -1.4),
      top: new Point(-2.65, 0.4),
    },

    radiusText: {
      position: new Point(-2.65, 1),
    },

    diameterText: {
      position: new Point(-2.65, 0.8),
    },
    circumferenceText: {
      position: new Point(-2.65, 0.6),
    },

    circle: {
      center: new Point(0, -0.8),
      radius: 0.8,
    },

    grid: {
      range: new Rect(0, 0, 11, 6),
      step: 1,
      width: 5.5,
      height: 3,
      position: new Point(-2.75, -1.8),
    },

    slider: {
      position: new Point(-1, 1.35),
      length: 2,
      width: 0.05,
      circleWidth: 0.2,
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
    ring: {
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
