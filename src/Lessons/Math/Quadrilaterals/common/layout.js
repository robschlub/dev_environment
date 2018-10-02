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
        new Point(-0.5, -0.2),
        new Point(-0.2, 0.5),
        new Point(0.5, 0.2),
        new Point(0.2, -0.4),
      ],
      position: new Point(-1.5, 0),
    },
    quad2: {
      points: [
        new Point(-0.5, 0.2),
        new Point(0.2, -0.4),
        new Point(0.5, 0.5),
        new Point(0, 0.1),
      ],
      position: new Point(0, 0),
    },
    quad3: {
      points: [
        new Point(-0.5, -0.5),
        new Point(0, -0.5),
        new Point(0.5, 0.5),
        new Point(0, 0.5),
      ],
      position: new Point(1.5, 0),
    },
  };
  return layout;
}
