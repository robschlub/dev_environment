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
  'rotation',
  'action',
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
    radius: 1.2,
    angle: {
      radius: 0.5,
      arrow: {
        width: 0.1,
        height: 0.1,
      },
    },
    angleRadius: 0.5,
    anchorPoints: 50,
    anglePoints: 400,
    circlePoints: 400,
    radialLineMajorOuter: 0.7 + 0.4,
    radialLineMajorInner: 0.55 + 0.4,
    radialLineMinorOuter: 0.7 + 0.4,
    radialLineMinorInner: 0.6 + 0.4,

    circle: {
      center: new Point(0, -0.5),
      right: new Point(1, -0.5),
      angle: {
        small: 1,
        large: Math.PI * 1.4,
      },
    },

    sectionText: {
      position: new Point(-2.3, -0.3),
    },
    angleEqualsText: {
      left: new Point(-2.3, -0.6),
      top: new Point(0.35, 1),
    },
    // splitCircleAngleStart: Math.PI * 1.4,

    colors,
  };
}
