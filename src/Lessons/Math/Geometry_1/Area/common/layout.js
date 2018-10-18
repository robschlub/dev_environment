// @flow

import { Point } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'square1',
  'square2',
  'circle',
  'reference',
  'line',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.shapesPosition = new Point(0, -0.5);
  layout.square1 = {
    position: new Point(-1, 0),
    sideLength: 2,
  };
  layout.square2 = {
    position: new Point(1.5, 0),
    sideLength: 1,
  };
  layout.circle = {
    position: new Point(-1, 0),
    radius: 1,
    numSides: 300,
  };
  layout.lineLength = {
    position: new Point(0, -1),
    length: 4,
    width: 0.01,
    sections: 4,
    referenceOffset: 0.5,
  };
  return layout;
}
