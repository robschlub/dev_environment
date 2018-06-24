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
    radialLineMajorOuter: 1.3,
    radialLineMajorInner: 1.05,
    radialLineMinorOuter: 1.3 ,
    radialLineMinorInner: 1.1,

    slider: {
      position: new Point(0.6 - 0.05 / 2, -0.5),
      length: 0.6 + 0.05,
      width: 0.03,
      circleWidth: 0.05,
      colorPos: colors.radius,
      colorNeg: colors.diagram.background,
      circleSides: 50,
    },

    compare: {
      radiusOffset: 0.2,
      arcOffset: 0.3,
    },

    circle: {
      center: new Point(0, -0.5),
      right: new Point(1, -0.5),
      angle: {
        small: 0.8,
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
