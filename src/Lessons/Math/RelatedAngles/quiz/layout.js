// @flow

import { Point, Rect } from '../../../../js/diagram/tools/g2';
// import getCssColors from '../../../../js/tools/getCssColors';
import lessonLayoutCommon from '../common/layout';

// const cssColorNames = [
//   'latin',
//   'line',
//   'angleA',
//   'angleB',
//   'angleC',
//   'angleD',
//   'disabled',
//   'supplementary',
//   'intersectingLine',
//   'quizLine',
// ];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout: Object = lessonLayoutCommon();
  // layout.colors = getCssColors(cssColorNames);
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
    check: new Point(0, -1.7),
  };
  layout.quizP2 = {
    first: {
      line1: {
        position: new Point(0, 0),
        rotation: 0,
      },
      line2: {
        position: new Point(0, 0),
        rotation: 0,
      },
      line3: {
        position: new Point(0, 0),
        rotation: 0,
      },
      line4: {
        position: new Point(0, 0),
        rotation: 0,
      },
      line5: {
        position: new Point(0, 0),
        rotation: 0,
      },
    },
  };
  layout.quizA1 = {
    minSeparation: 0.6,
    maxSeparation: 1.1,
    input: new Point(0, 1.35),
  };
  layout.parallelLine.boundary = new Rect(-2.5, -1.7, 5, 3);
  return layout;
}
