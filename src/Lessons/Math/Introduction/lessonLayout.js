// @flow

import { Point, Rect } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors();

  return {
    // Diagram
    limits: new Rect(-3, -2, 6, 4),

    // General
    linewidth: 0.03,

    // Circle Diagram
    radius: 1.3,
    arrow: 1.1,
    cornerLength: 0.5,
    angleRadius: 0.5,
    wheelSize: 0.8,

    // Shapes Diagram
    square: { center: new Point(-1.8, -0.8  + 0.8) },
    tri: { center:    new Point( 0  , -0.98 + 0.8) },
    pent: { center:   new Point( 2  , -0.8  + 0.8) },
    circle: { center: new Point( 0  , -0.5) },
    colors,
  };
}
