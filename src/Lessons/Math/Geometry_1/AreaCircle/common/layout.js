// @flow

import {
  Point, Transform, polarToRect,
} from '../../../../../js/diagram/tools/g2';
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
      radius: layout.circle.def.radius - layout.circle.back.width,
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

  layout.triangle = {
    height: (sideNum) => {
      const { radius } = layout.polygons.def;
      const heightDimension = radius * Math.cos(Math.PI * 2 / sideNum / 2);
      return {
        vertexSpaceStart: 'start',
        length: heightDimension,
        angle: -Math.PI * 2 / sideNum / 2,
        width,
        color: layout.colors.height,
        label: {
          text: 'h',
          location: 'top',
          orientation: 'horizontal',
          offset: -0.02,
          linePosition: 0.5 + 0.4 * sideNum / Math.max(...layout.polygons.sides),
        },
      };
    },
    base: (sideNum) => {
      const { radius } = layout.polygons.def;
      const w = layout.polygons.def.width;
      const heightDimension = radius * Math.cos(Math.PI * 2 / sideNum / 2);
      return {
        vertexSpaceStart: 'start',
        p1: polarToRect(radius - w / 2, 0),
        p2: polarToRect(radius - w / 2, -Math.PI * 2 / sideNum),
        width,
        color: layout.colors.border,
        label: {
          text: 'b',
          location: 'right',
          orientation: 'horizontal',
          offset: 0.05,
        },
        arrows: {},
        offset: radius * 1.1 - heightDimension,
      };
    },
  };

  layout.triangleAreaEquation = new Point(1, 0);

  layout.selector = {
    position: new Point(-1, 1.5),
  };
  return layout;
}
