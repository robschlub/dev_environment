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
  layout.lengthMeasure = {
    position: new Point(0, -0.5),
    length: 4,
    width: 0.02,
    sections: 4,
    referenceOffset: 0.5,
    tickLength: 0.1,
  };
  layout.angleMeasure = {
    position: new Point(-1, -0.7),
    length: 2,
    width: 0.02,
    angle: Math.PI / 3,
    majorTickLength: 0.1,
    minorTickLength: 0.05,
  };
  layout.circles = {
    position: new Point(2, 0),
    radius: 0.2,
    num: 3,
    sides: 50,
    width: 0.01,
  };
  layout.genericGrid = {
    position: new Point(-2, 0),
    sideLength: 0.3,
    waveMag: 0.03,
    width: 0.007,
    segments: 20,
    length: 4,
    height: 2,
    spacing: 0.3,
  };
  return layout;
}
