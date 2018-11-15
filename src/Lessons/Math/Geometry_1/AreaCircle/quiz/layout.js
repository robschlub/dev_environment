// @flow

import commonLessonLayout from '../common/layout';
import {
  Point, Transform,
} from '../../../../../js/diagram/tools/g2';
// const cssColorNames = [
//   'latin',
//   'line',
// ];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  const width = 0.01;
  const rad = 1;
  layout.circle = {
    radius: rad,
    sides: 100,
    width: width * 3,
    color: layout.colors.lines,
    transform: new Transform().translate(0, 0),
  };
  layout.radius = {
    vertexSpaceStart: 'start',
    length: rad - width,
    width,
    angle: 0,
    color: layout.colors.radius,
    label: {
      text: 'r',
      location: 'top',
      orientation: 'horizontal',
      offset: -0.02,
    },
  };
  layout.circumference = {
    line: {
      radius: rad * 1.2,
      sides: 100,
      sidesToDraw: 100 * 0.99,
      width: width * 0.9,
      color: layout.colors.radius,
      transform: new Transform().translate(0, 0),
    },
    arrow: {
      width: width * 7,
      height: width * 7,
      rotation: Math.PI,
      position: new Point(rad * 1.2 - width * 0.45, -width),
      color: layout.colors.radius,
      tip: new Point(0, 0),
    },
    label: {
      label: 'c',
      color: layout.colors.radius,
      scale: 0.7,
      position: new Point(0, rad * 1.3),
    },
  };
  return layout;
}
