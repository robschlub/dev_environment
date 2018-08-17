// @flow

import { Rect, Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import baseLayout from '../../../LessonsCommon/layout';

const cssColorNames = [
  'latin',
  'line',
  'angleA',
  'angleB',
  'angleC',
  'angleD',
  'disabled',
  'supplementary',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout: Object = baseLayout();
  layout.colors = getCssColors(cssColorNames);
  layout.units = {
    position: new Point(2, -1.75),
  };
  layout.selector = {
    position: new Point(0, 1.7),
  };
  const len = 1.7;
  layout.moveableLine = {
    length: {
      full: len,
      end: len / 3,
      middle: len / 3,
    },
    label: {
      length: len / 2,
    },
    width: 0.02,
    boundary: new Rect(0, -1.7, 3, 3),
  };
  layout.line1 = {
    parallel: {
      position: new Point(1.5, 0.3),
      rotation: 0,
    },
    opposite: {
      position: new Point(1.5, 0),
      rotation: 0,
    },
    position: new Point(1.5, 0.3),
    rotation: 0,
  };
  layout.line2 = {
    parallel: {
      position: new Point(1.5, -0.3),
      rotation: 0,
    },
    opposite: {
      position: new Point(1.5, 0),
      rotation: Math.PI / 4,
    },
    position: new Point(1.5, -0.3),
    rotation: 0,
  };
  layout.angle = {
    arc: {
      radius: 0.4,
      width: 0.02,
      sides: 200,
    },
    label: {
      radius: 0.5,
    },
  };
  layout.equation1 = {
    aPlusB: new Point(-1.5, -0.5),
    bPlusC: new Point(-1.5, -0.5),
  };

  layout.equation2 = {
    b: new Point(-1.5, -1.2),
    c: new Point(-1.5, -0.9),
  };

  layout.equation3 = {
    cEqualsA: new Point(-1.5, -1.3),
  };

  return layout;
}
