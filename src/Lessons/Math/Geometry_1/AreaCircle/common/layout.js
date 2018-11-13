// @flow

import { Point, Transform } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import baseLayout from '../../../../LessonsCommon/layout';

const cssColorNames = [
  'lines',
  'fill',
  'height',
  'border',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function commonLessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.position = new Point(0, -0.4);
  const width = 0.015;

  layout.grid = {
    position: new Point(0, 0),
    smallPosition: new Point(0, 0),
    spacing: 0.25,
    length: 4,
    height: 3,
  };

  layout.circle = {
    def: {
      radius: 1.25,
      sides: 100,
      width: width * 2,
      color: layout.colors.lines,
      transform: new Transform('circle'),
    },
    back: {
      color: layout.colors.diagram.disabled,
      width,
    },
    fill: {
      fill: true,
      color: layout.colors.fill,
    },
    scenarios: {
      center: new Point(0, 0),
      left: new Point(-1, 0),
    },
  };

  layout.polygons = {
    def: {
      radius: layout.circle.def.radius - layout.circle.def.width,
      width,
      transform: new Transform('poly'),
      color: layout.colors.lines,
    },
    fill: {
      fill: true,
      color: layout.colors.fill,
    },
    radiusWidth: width,
    sides: [
      6,
      9,
      25,
    ],
  };

  layout.triangleAreaEquation = new Point(1, 0);

  layout.selector = {
    position: new Point(-1, 1.5),
  };
  return layout;
}
