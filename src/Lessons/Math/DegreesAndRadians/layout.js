// @flow

import { Point, Rect } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';

const cssColorNames = [
  'anchor',
  'radius',
  'radiusLight',
  'reference',
  'angle',
  'angleText',
  'latin',
  'circle',
  'arc',
  'arcLight',
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
    radialLineMajorInner: 1.1,
    radialLineMinorOuter: 1.3 ,
    radialLineMinorInner: 1.25,

    slider: {
      position: new Point(0.6 - 0.05 / 2, -0.5),
      length: 0.6 + 0.05,
      width: 0.03,
      circleWidth: 0.05,
      colorPos: colors.radius,
      colorNeg: colors.diagram.background,
      circleSides: 50,
    },

    radiusArc: {
      radius: 1.25,
    },

    compare: {
      radiusOffset: 0.2,
      arcOffset: 0.3,
      textPosition: new Point(2.0, -0.42),
    },

    circle: {
      center: new Point(0, -0.5),
      right: new Point(1.1, -0.5),
      farRight: new Point(1.6, -0.3),
      angle: {
        small: 0.8,
        large: Math.PI * 1.4,
      },
    },

    arcEquation: {
      left: new Point(-2.3, -0.7),
      centerTop: new Point(-1.0, 0.7),
      centerBottom: new Point(-1.0, -0.5),
    },
    sectionText: {
      position: new Point(-2.3, -0.3),
    },
    angleEqualsText: {
      leftCenter: new Point( -2.1, -0.4),
      left: new Point(-2.3, -0.6),
      top: new Point(0.35, 1),
      bottomRight: new Point(1.0, -1.8),
      units: {
        deg: 0.87,
        text: 0.90,
      },
    },
    // splitCircleAngleStart: Math.PI * 1.4,

    colors,
  };
}
