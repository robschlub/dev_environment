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
    radius: 0.9,
    wheelSize: 0.7,
    circlePoints: 400,
    anchorPoints: 100,

    locationText: {
      bottom: new Point(1.05, -1.4),
      top: new Point(-2.4, 0.8),
    },

    radiusText: {
      position: new Point(-2.4, 1.1),
    },

    diameterText: {
      position: new Point(-2.4, 0.9),
    },
    circumferenceText: {
      position: new Point(-2.4, 0.7),
    },

    circle: {
      center: new Point(0, -0.7),
      // right: new Point(1, -0.7),
      radius: 0.9,
      bounds: new Rect(-2.5, -1.5, 5, 3),
    },

    movingCircle: {
      center: new Point(0, -0.3),
      radius: 0.4,
    },

    slider: {
      position: new Point(-2.4, 1.3),
      length: 1.5,
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

