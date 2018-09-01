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
  'intersectingLine',
  'quizLine',
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
  
  layout.position = new Point(1.5, 0);
  layout.parallelLine = {
    length: {
      full: len,
      end: len / 3,
      middle: len / 3,
    },
    label: {
      length: len / 2,
    },
    width: 0.02,
    boundary: new Rect(-1.5, -1.7, 3, 3),
  };
  layout.threeLines = {
    position: layout.position,
    rotation: 0,
  };
  layout.intersectingLine = {
    length: {
      full: len * 1.5,
      end: len / 3 * 1.5,
      middle: len / 3 * 1.5,
    },
    label: {
      length: len / 2  * 1.5,
    },
    width: 0.02,
    boundary: new Rect(-1.5, -1.7, 3, 3),
  };
  layout.quiz = {
    position: new Point(0, 0),
    first: {
      line1: {
        position: new Point(-1, 0),
        rotation: Math.PI / 2,
      },
      line2: {
        position: new Point(1, 0),
        rotation: Math.PI / 4,
      },
    },
    answer: new Point(0, -1.7),
    nextSteps: new Point(0, -1.9),
    check: new Point(2.3, 1.3),
  };
  layout.line1 = {
    parallel: {
      position: new Point(0, 0.3),
      rotation: 0,
    },
    opposite: {
      position: new Point(0, 0),
      rotation: 0,
    },
    corresponding: {
      position: new Point(0, 0.5),
      rotation: 0,
    },
    center: {
      position: new Point(0, 0),
      rotation: 0,
    },
    quiz: {
      position: new Point(0, 0),
      rotation: 0,
    },
    position: new Point(0, 0.3),
    rotation: 0,
  };
  layout.line2 = {
    parallel: {
      position: new Point(0, -0.3),
      rotation: 0,
    },
    opposite: {
      position: new Point(0, 0),
      rotation: Math.PI / 4,
    },
    corresponding: {
      position: new Point(0, -0.5),
      rotation: 0,
    },
    center: {
      position: new Point(0, 0),
      rotation: 0,
    },
    quiz: {
      position: new Point(0, 0),
      rotation: 0,
    },
    position: new Point(0, -0.3),
    rotation: 0,
  };
  layout.line3 = {
    corresponding: {
      position: new Point(0, 0),
      rotation: Math.PI / 3,
    },
  };
  layout.angle = {
    arc: {
      radius: 0.3,
      width: 0.02,
      sides: 200,
    },
    label: {
      radius: 0.35,
    },
  };
  layout.equation1 = {
    aPlusB: new Point(-3, -0.5),
    bPlusC: new Point(-3, -0.5),
  };

  layout.equation2 = {
    b: new Point(-3, -1.35),
    c: new Point(-3, -0.9),
  };

  layout.equation3 = {
    cEqualsA: new Point(-3, -1.3),
  };

  return layout;
}
