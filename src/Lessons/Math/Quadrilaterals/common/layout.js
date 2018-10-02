// @flow

import { Point, Line, polarToRect } from '../../../../js/diagram/tools/g2';
import getCssColors from '../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'lines',
  'angles',
  'construction',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, 0);
  layout.lineWidth = 0.02;
  layout.quads = {
    quad1: {
      points: [
        new Point(-0.5, -0.4),
        new Point(-0.2, 0.7),
        new Point(0.6, 0.1),
        new Point(0.3, -0.6),
      ],
      position: new Point(-1.6, -0.2),
    },
    quad2: {
      points: [
        new Point(-0.6, 0.4),
        new Point(0.2, -0.6),
        new Point(0.6, 0.7),
        new Point(0.1, 0.1),
      ],
      position: new Point(0, -0.2),
    },
    quad3: {
      points: [
        new Point(-0.7, 0),
        new Point(0, -0.7),
        new Point(0.7, 0),
        new Point(0, 0.7),
      ],
      position: new Point(1.6, -0.2),
    },
  };
  return layout;
}
