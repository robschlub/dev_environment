// @flow

import commonLessonLayout from '../common/layout';
import { Point, Rect } from '../../../../../js/diagram/tools/g2';
// const cssColorNames = [
//   'latin',
//   'line',
// ];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.adjustableRect = {
    points: [
      new Point(0, -1),
      new Point(0, 0),
      new Point(1, 0),
      new Point(1, -1),
    ],
    width: 0.03,
    limits: new Rect(-2, -1.5, 4, 2),
  }
  return layout;
}
