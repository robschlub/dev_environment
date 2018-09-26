// @flow

import { Point } from '../../../../js/diagram/tools/g2';
// import getCssColors from '../../../../js/tools/getCssColors';
import commonLessonLayout from '../common/layout';

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
  const layout: Object = commonLessonLayout();
  layout.input = new Point(0, 1.3);
  layout.quiz = {
    position: new Point(0, 0),
    answer: new Point(0, -1.7),
    nextSteps: new Point(0, -1.9),
    check: new Point(0, -1.7),
  };
  layout.answerBox = new Point(-2.7, 1.2);
  return layout;
}
