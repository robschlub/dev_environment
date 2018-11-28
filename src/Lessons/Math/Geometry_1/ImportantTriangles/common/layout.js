// @flow

import { Point } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  // 'line',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.equil = {
    tri: {
      points: [
        new Point(-0.5, -0.5),
        new Point(0.5, -0.5),
        new Point(0, 0.5),
      ],
      width: 0.01,
      close: true,
      borderToPoint: 'never',
      position: new Point(0, 0),
    },
  };
  return layout;
}
